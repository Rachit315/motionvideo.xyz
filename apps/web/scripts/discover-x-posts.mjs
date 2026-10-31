// Find recent motion videos, X Articles and GitHub skills worth adding, by
// reading the timelines of every creator already in the catalog through the
// public FxTwitter API. Prints candidates only; curate them by hand into
// scripts/x-video-sources.json, scripts/import-x-articles.mjs or
// src/data/resource-directories.json.
//
//   pnpm catalog:discover                     last 7 days
//   pnpm catalog:discover --since 2026-10-06
//
// Reposts and quotes show up on these timelines too, which is how new
// creators surface. FxTwitter's /2/search would be the natural fit, but it
// returned 404 for every query when this was written.
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const API = "https://api.fxtwitter.com/2";
const CONCURRENCY = 8;
const PAGES = 3;
const DAY = 24 * 60 * 60 * 1000;

const sinceArgument = process.argv.indexOf("--since");
const since =
  sinceArgument === -1
    ? Date.now() - 7 * DAY
    : Date.parse(process.argv[sinceArgument + 1]);
if (Number.isNaN(since)) {
  throw new TypeError("--since expects a date like 2026-10-06");
}

const readData = async (name) =>
  JSON.parse(
    await readFile(
      fileURLToPath(new URL(`../src/data/${name}`, import.meta.url)),
      "utf-8"
    )
  );
const [catalog, articles, directories] = await Promise.all([
  readData("motion-catalog.json"),
  readData("x-articles.json"),
  readData("resource-directories.json"),
]);

const statusId = (url) => url?.match(/status\/(?<id>\d+)/u)?.groups.id;
// Removed duplicates count as known, so their posts never come back.
const knownVideos = new Set(
  [...catalog.videos, ...(catalog.removed ?? [])].map((video) =>
    statusId(video.tweetUrl)
  )
);
const knownArticles = new Set(
  articles.entries.map((entry) => entry.url.split("/").at(-1))
);
const knownUrls = [
  ...directories.tools.entries,
  ...directories.studios.entries,
].map((entry) => entry.url.toLowerCase());
const handles = new Set([
  ...catalog.videos.map((video) => video.handle),
  ...articles.entries.map((entry) => new URL(entry.url).pathname.split("/")[1]),
]);

// A post is a video candidate when it reads as AI-made and as motion.
const AI_MADE =
  /opus|claude|codex|remotion|hyperframes?|prompt|skill|agent|cursor|gpt|gemini|one.shot/iu;
const MOTION =
  /motion|animat|video|launch|promo|explainer|render|film|reel|trailer/iu;

const fetchJson = async (path) => {
  const response = await fetch(`${API}/${path}`, {
    signal: AbortSignal.timeout(60_000),
  });
  return response.ok ? response.json() : null;
};

const timeline = async (handle) => {
  const posts = [];
  let cursor;
  for (let page = 0; page < PAGES; page += 1) {
    const query = cursor ? `&cursor=${encodeURIComponent(cursor)}` : "";
    // Sequential by design: each page needs the previous cursor.
    // oxlint-disable-next-line no-await-in-loop
    const data = await fetchJson(
      `profile/${handle}/statuses?count=100${query}`
    );
    const results = data?.results ?? [];
    posts.push(...results);
    cursor = data?.cursor?.bottom;
    const oldest = Math.min(
      ...results.map((post) => post.created_timestamp * 1000)
    );
    if (results.length === 0 || oldest < since || !cursor) {
      break;
    }
  }
  return posts.filter((post) => post.created_timestamp * 1000 >= since);
};

const posts = new Map();
const queue = [...handles];
const worker = async () => {
  for (let handle = queue.shift(); handle; handle = queue.shift()) {
    // oxlint-disable-next-line no-await-in-loop
    for (const post of await timeline(handle).catch(() => [])) {
      posts.set(post.id, post);
      if (post.quote) {
        posts.set(post.quote.id, post.quote);
      }
    }
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const byLikes = (a, b) => b.likes - a.likes;
const line = (post, detail) =>
  `${post.likes} likes · ${post.created_at.slice(4, 10)} · x.com/${post.author.screen_name}/status/${post.id}\n    ${detail.replaceAll(/\s+/gu, " ").slice(0, 160)}`;

const videos = [...posts.values()]
  .filter(
    (post) =>
      !knownVideos.has(post.id) &&
      post.media?.all?.some((item) => item.type === "video") &&
      AI_MADE.test(post.text ?? "") &&
      MOTION.test(post.text ?? "")
  )
  .toSorted(byLikes);
const newArticles = [...posts.values()]
  .filter((post) => post.article && !knownArticles.has(post.id))
  .toSorted(byLikes);
const repos = new Map();
for (const post of posts.values()) {
  for (const [, repo] of (post.text ?? "").matchAll(
    /github\.com\/(?<repo>[\w-]+\/[\w.-]+)/gu
  )) {
    const key = repo.replace(/\.$/u, "").toLowerCase();
    if (!knownUrls.some((url) => url.includes(key)) && !repos.has(key)) {
      repos.set(key, post);
    }
  }
}

console.log(
  `${handles.size} creators, ${posts.size} posts since ${new Date(since).toISOString().slice(0, 10)}.\n`
);
console.log(`VIDEOS (${videos.length})`);
for (const post of videos) {
  console.log(`  ${line(post, post.text)}`);
}
console.log(`\nARTICLES (${newArticles.length})`);
for (const post of newArticles) {
  console.log(`  ${line(post, post.article.title ?? "")}`);
}
console.log(`\nGITHUB REPOS (${repos.size})`);
for (const [repo, post] of repos) {
  console.log(`  github.com/${repo}  ← @${post.author.screen_name}`);
}
