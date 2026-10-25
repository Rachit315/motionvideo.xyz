import { defaultLocale, locales, validatePrefix } from "intlayer";
import type { LocalesValues } from "intlayer";

/** Every locale the site renders, in switcher order. */
// SAFETY: intlayer's generated config types `locales` with the project's locale
// union, which `LocalesValues` also models.
export const LOCALES = locales as readonly LocalesValues[];

// SAFETY: the generated config's default locale is one of the configured locales.
export const DEFAULT_LOCALE = defaultLocale as LocalesValues;

/** Each language in its own name. */
export const LOCALE_NAMES: Record<LocalesValues, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  zh: "简体中文",
  ko: "한국어",
  ja: "日本語",
  de: "Deutsch",
  pt: "Português",
  ru: "Русский",
};

/**
 * All locales live in the path, ahead of the page: `/en/tools`, `/fr/tools`.
 * Passing the mode explicitly keeps helpers correct even before the generated
 * Intlayer config has been rebuilt.
 */
export const I18N_ROUTING = {
  defaultLocale: DEFAULT_LOCALE,
  mode: "prefix-all" as const,
};

export const isLocale = (value: unknown): value is LocalesValues =>
  // SAFETY: `includes` is true only for the locale strings in LOCALES, which
  // the generated config guarantees are LocalesValues.
  typeof value === "string" && LOCALES.includes(value as LocalesValues);

/**
 * What a route `head` under `/$locale` reads. Annotating a head's argument
 * with this (instead of letting TanStack infer the full context) keeps the
 * head from feeding back into the route's own loader/search inference, which
 * otherwise collapses those types to `{}` on routes that declare a loader.
 */
export interface LocaleHeadContext {
  params: { locale: string };
}

/**
 * Prefix an unprefixed app path (`/tools`) with a locale (`/fr/tools`).
 * The home path stays `/fr` rather than `/fr/`.
 */
export const localizedPath = (path: string, locale: LocalesValues): string => {
  let suffix = path;
  if (suffix === "/") {
    suffix = "";
  } else if (!suffix.startsWith("/")) {
    suffix = `/${suffix}`;
  }
  return `/${locale}${suffix}`;
};

/**
 * Prefix a path only when it has no locale yet. Redirect targets can arrive
 * from an old link (`/dashboard`) or an already-localized URL (`/fr/dashboard`).
 */
export const ensureLocalizedPath = (
  path: string,
  locale: LocalesValues
): string => {
  const [pathname] = path.split(/[?#]/u);
  const [, segment] = pathname.split("/");
  return isLocale(segment) ? path : localizedPath(path, locale);
};

/** Locale of a pathname, or the default locale when it has no valid prefix. */
export const localeFromPath = (pathname: string): LocalesValues => {
  const [, segment] = pathname.split("/");
  const { isValid } = validatePrefix(segment, I18N_ROUTING);
  return isValid && isLocale(segment) ? segment : DEFAULT_LOCALE;
};

/** Locale used for the `og:locale` meta tag (`en` → `en_US`). */
const OG_LOCALES: Record<LocalesValues, string> = {
  de: "de_DE",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  ja: "ja_JP",
  ko: "ko_KR",
  pt: "pt_PT",
  ru: "ru_RU",
  zh: "zh_CN",
};

export const ogLocale = (locale: LocalesValues): string => OG_LOCALES[locale];

/** Cookie Intlayer and the Worker use to remember a negotiated locale. */
export const LOCALE_COOKIE = "INTLAYER_LOCALE";
