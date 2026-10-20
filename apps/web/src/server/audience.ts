import { env } from "cloudflare:workers";
import { z } from "zod";

import { SITE } from "@/constants/site";

// Site traffic for the /sponsor page, read from PostHog's query API with a
// personal API key (scope `query:read`) and cached at the edge, so PostHog
// sees at most one set of queries per hour per Cloudflare location.

const POSTHOG_API = "https://us.posthog.com/api/projects/359988/query/";
const CACHE_KEY = `https://${SITE.DOMAIN}/__cache/audience-stats`;
const CACHE_SECONDS = 3600;
const WINDOW_DAYS = 30;
const TOP = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface AudienceStats {
  visitors: number;
  pageviews: number;
  /** One row per UTC day from the first day with data through yesterday. */
  daily: { day: string; visitors: number; pageviews: number }[];
  /** ISO 3166-1 alpha-2 codes, most visitors first. */
  countries: { code: string; visitors: number }[];
  /** Named sources (direct visits and our own domain left out). */
  referrers: { name: string; visitors: number }[];
}

// Human pageviews on the site over the last WINDOW_DAYS complete UTC days.
const PAGEVIEWS = `event = '$pageview'
  AND timestamp >= toStartOfDay(now()) - INTERVAL ${WINDOW_DAYS} DAY
  AND timestamp < toStartOfDay(now())
  AND properties.$host = '${SITE.DOMAIN}'
  AND (properties.$virt_is_bot IS NULL OR properties.$virt_is_bot = false)`;

const QUERIES = {
  totals: `SELECT count(DISTINCT person_id), count() FROM events WHERE ${PAGEVIEWS}`,
  daily: `SELECT toString(toDate(timestamp)) AS day, count(DISTINCT person_id), count()
    FROM events WHERE ${PAGEVIEWS} GROUP BY day ORDER BY day`,
  countries: `SELECT properties.$geoip_country_code AS code, count(DISTINCT person_id) AS visitors
    FROM events WHERE ${PAGEVIEWS} AND code != '' GROUP BY code ORDER BY visitors DESC LIMIT ${TOP}`,
  referrers: `SELECT properties.$referring_domain AS domain, count(DISTINCT person_id) AS visitors
    FROM events WHERE ${PAGEVIEWS} GROUP BY domain ORDER BY visitors DESC LIMIT 50`,
};

const responseSchema = z.object({ results: z.array(z.array(z.unknown())) });
const totalsRow = z.tuple([z.number(), z.number()]);
const dailyRow = z.tuple([z.string(), z.number(), z.number()]);
const countRow = z.tuple([z.string(), z.number()]);

// Referring domains that are the same source; the rest show as their domain.
// Looked up with whatever domain PostHog recorded, hence a Map.
const SOURCES = new Map([
  ["t.co", "X"],
  ["x.com", "X"],
  ["twitter.com", "X"],
  ["com.twitter.android", "X"],
  ["instagram.com", "Instagram"],
  ["l.instagram.com", "Instagram"],
  ["google.com", "Google"],
  ["com.google.android.googlequicksearchbox", "Google"],
  ["threads.com", "Threads"],
  ["l.threads.com", "Threads"],
  ["threads.net", "Threads"],
  ["youtube.com", "YouTube"],
  ["linkedin.com", "LinkedIn"],
  ["lnkd.in", "LinkedIn"],
  ["reddit.com", "Reddit"],
  ["news.ycombinator.com", "Hacker News"],
  ["github.com", "GitHub"],
  ["facebook.com", "Facebook"],
  ["l.facebook.com", "Facebook"],
  ["bing.com", "Bing"],
  ["duckduckgo.com", "DuckDuckGo"],
]);

// Not a source: no referrer, our own pages, and the Google sign-in return.
const NOT_SOURCES = new Set(["$direct", SITE.DOMAIN, "accounts.google.com"]);

const query = async (hogql: string) => {
  const response = await fetch(POSTHOG_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.POSTHOG_PERSONAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query: hogql } }),
  });
  if (!response.ok) {
    throw new Error(`PostHog query failed: ${response.status}`);
  }
  return responseSchema.parse(await response.json()).results;
};

/** Every day from `first` through yesterday (UTC), zero where nothing came in. */
const fillDays = (rows: AudienceStats["daily"]) => {
  const [first] = rows;
  if (!first) {
    return [];
  }
  const byDay = new Map(rows.map((row) => [row.day, row]));
  const start = Date.parse(`${first.day}T00:00:00Z`);
  const today = new Date().setUTCHours(0, 0, 0, 0);
  return Array.from(
    { length: Math.round((today - start) / DAY_MS) },
    (_, i) => {
      const day = new Date(start + i * DAY_MS).toISOString().slice(0, 10);
      return byDay.get(day) ?? { day, visitors: 0, pageviews: 0 };
    }
  );
};

const topSources = (rows: [string, number][]) => {
  const bySource = new Map<string, number>();
  for (const [domain, visitors] of rows) {
    const host = domain.replace(/^www\./u, "");
    if (NOT_SOURCES.has(host) || NOT_SOURCES.has(domain)) {
      continue;
    }
    const name = SOURCES.get(host) ?? host;
    bySource.set(name, (bySource.get(name) ?? 0) + visitors);
  }
  return [...bySource]
    .map(([name, visitors]) => ({ name, visitors }))
    .toSorted((a, b) => b.visitors - a.visitors)
    .slice(0, TOP);
};

const fetchStats = async (): Promise<AudienceStats> => {
  const [totals, daily, countries, referrers] = await Promise.all([
    query(QUERIES.totals),
    query(QUERIES.daily),
    query(QUERIES.countries),
    query(QUERIES.referrers),
  ]);
  const [visitors, pageviews] = totalsRow.parse(totals[0] ?? [0, 0]);
  return {
    visitors,
    pageviews,
    daily: fillDays(
      daily.map((row) => {
        const [day, dayVisitors, dayPageviews] = dailyRow.parse(row);
        return { day, visitors: dayVisitors, pageviews: dayPageviews };
      })
    ),
    countries: countries.map((row) => {
      const [code, count] = countRow.parse(row);
      return { code, visitors: count };
    }),
    // Sources are merged after the query (t.co and x.com are both X), so
    // it reads more rows than it shows.
    referrers: topSources(referrers.map((row) => countRow.parse(row))),
  };
};

/**
 * The last 30 days of traffic, or null when no API key is set or PostHog
 * fails (the page then leaves the numbers out rather than guessing).
 */
export const audienceStats = async (): Promise<AudienceStats | null> => {
  if (!env.POSTHOG_PERSONAL_API_KEY) {
    return null;
  }
  const cache = await caches.open("audience-stats");
  const cached = await cache.match(CACHE_KEY);
  if (cached) {
    // SAFETY: only this function writes CACHE_KEY, always with an AudienceStats.
    return (await cached.json()) as AudienceStats;
  }
  try {
    const stats = await fetchStats();
    await cache.put(
      CACHE_KEY,
      Response.json(stats, {
        headers: { "Cache-Control": `public, max-age=${CACHE_SECONDS}` },
      })
    );
    return stats;
  } catch (error) {
    console.error("audience stats", error);
    return null;
  }
};
