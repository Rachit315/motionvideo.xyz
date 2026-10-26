import { getIntlayer } from "intlayer";

import { LINK } from "@/constants/links";
import { DEFAULT_LOCALE, isLocale, localizedPath } from "@/constants/locales";
import {
  BASE_PRICE_CENTS,
  LAUNCH_PRICE_CENTS,
  PRODUCT_NAME,
} from "@/constants/pricing";
import type { Offer } from "@/constants/pricing";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { absoluteUrl } from "@/constants/url";
import type { MotionVideo } from "@/lib/motion-catalog";

// Structured data, emitted as <script type="application/ld+json"> through a
// route's `head().scripts`.

type JsonValue =
  | string
  | number
  | boolean
  | JsonValue[]
  | { [key: string]: JsonValue };

// A schema.org node: a `@type` plus JSON-serializable properties.
interface JsonLd {
  "@type": string;
  [property: string]: JsonValue;
}

// `<` is escaped so page content can never close the script tag early.
const jsonLdScript = (data: JsonLd) => ({
  children: JSON.stringify({
    "@context": "https://schema.org",
    ...data,
  }).replaceAll("<", String.raw`\u003c`),
  type: "application/ld+json",
});

// A stable id, so every page's nodes point at one organization instead of
// repeating it (and search engines merge them into one entity).
const ORGANIZATION_ID = `${SITE.URL}/#organization`;

const organization = {
  "@id": ORGANIZATION_ID,
  "@type": "Organization",
  email: LINK.EMAIL,
  founder: {
    "@type": "Person",
    name: SITE.AUTHOR.NAME,
    url: LINK.AUTHOR_WEBSITE,
  },
  logo: absoluteUrl("/brand/motionvideo-app-icon-512.png"),
  name: SITE.NAME,
  sameAs: [LINK.GITHUB, LINK.X],
  url: SITE.URL,
};

const resolveLocale = (locale?: string) =>
  isLocale(locale) ? locale : DEFAULT_LOCALE;

// The site in the page's language: one node per locale home (its own `@id`,
// so the nine language versions never claim conflicting values), described
// as that locale's home page is.
export const websiteJsonLd = (locale?: string) => {
  const resolved = resolveLocale(locale);
  const url = absoluteUrl(localizedPath("/", resolved));
  return jsonLdScript({
    "@id": `${url}#website`,
    "@type": "WebSite",
    description: getIntlayer("gallery-meta", resolved).home.description,
    inLanguage: resolved,
    name: SITE.NAME,
    publisher: { "@id": ORGANIZATION_ID },
    url,
  });
};

export const organizationJsonLd = () => jsonLdScript(organization);

export const productJsonLd = (offer?: Offer, locale?: string) => {
  const resolved = resolveLocale(locale);
  return jsonLdScript({
    "@type": "Product",
    brand: { "@type": "Brand", name: SITE.NAME },
    description: getIntlayer("directory-meta", resolved).skill.description,
    image: absoluteUrl("/og.jpg"),
    name: PRODUCT_NAME,
    url: absoluteUrl(localizedPath(ROUTES.MOTIONVIDEO_SKILL, resolved)),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: (
        (offer?.active ? LAUNCH_PRICE_CENTS : BASE_PRICE_CENTS) / 100
      ).toFixed(2),
      priceCurrency: "USD",
      url: absoluteUrl(localizedPath(ROUTES.PRICING, resolved)),
    },
  });
};

// The skill page's FAQ, in the language the page shows it in: FAQ markup
// must match the visible questions and answers.
export const faqJsonLd = (locale?: string) =>
  jsonLdScript({
    "@type": "FAQPage",
    inLanguage: resolveLocale(locale),
    mainEntity: getIntlayer("faqs", resolveLocale(locale)).faqs.map((faq) => ({
      "@type": "Question",
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
      name: faq.question,
    })),
  });

/** A page one level below home: its footer link label and app path. */
export interface BreadcrumbItem {
  page:
    | "about"
    | "brand"
    | "changelog"
    | "contact"
    | "privacy"
    | "refunds"
    | "terms";
  path: string;
}

/** A page below a `BreadcrumbItem`, already named in the page's language. */
interface ChildCrumb {
  name: string;
  path: string;
}

/**
 * One gallery video, for its /videos/$slug page. `description` is the page's
 * own meta description (already in the page's language). No `inLanguage`:
 * the video has no spoken language of its own, and the page's language says
 * nothing about it.
 */
export const videoJsonLd = (
  video: MotionVideo,
  description: string,
  locale?: string
) =>
  jsonLdScript({
    "@type": "VideoObject",
    contentUrl: absoluteUrl(video.video),
    creator: {
      "@type": "Person",
      name: video.creatorName ?? `@${video.handle}`,
      url: `https://x.com/${video.handle}`,
    },
    description: video.description ?? description,
    keywords: video.contentTags.join(", "),
    name: video.title,
    publisher: { "@id": ORGANIZATION_ID },
    thumbnailUrl: absoluteUrl(video.poster),
    uploadDate: video.date,
    url: absoluteUrl(
      localizedPath(`/videos/${video.slug}`, resolveLocale(locale))
    ),
  });

// Home › <page> (› <child>), for pages below the home page, named in the
// page's language (the footer's link labels).
export const breadcrumbJsonLd = (
  current: BreadcrumbItem,
  locale?: string,
  child?: ChildCrumb
) => {
  const resolved = resolveLocale(locale);
  const crumbs = [
    { name: getIntlayer("json-ld", resolved).home, path: ROUTES.HOME },
    {
      name: getIntlayer("site-footer", resolved)[current.page],
      path: current.path,
    },
    ...(child ? [child] : []),
  ];
  return jsonLdScript({
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((item, index) => ({
      "@type": "ListItem",
      item: absoluteUrl(localizedPath(item.path, resolved)),
      name: item.name,
      position: index + 1,
    })),
  });
};

/**
 * One changelog entry, for its /changelog/$slug page. `inLanguage` is
 * English on every locale: entries are only written in English.
 */
export const changelogEntryJsonLd = (
  entry: { date: string; description: string; path: string; title: string },
  locale?: string
) =>
  jsonLdScript({
    "@type": "BlogPosting",
    author: { "@id": ORGANIZATION_ID },
    datePublished: entry.date,
    description: entry.description,
    headline: entry.title,
    inLanguage: DEFAULT_LOCALE,
    publisher: { "@id": ORGANIZATION_ID },
    url: absoluteUrl(localizedPath(entry.path, resolveLocale(locale))),
  });
