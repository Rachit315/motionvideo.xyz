import { docs } from "collections/server";
import { defineI18n } from "fumadocs-core/i18n";
import { loader } from "fumadocs-core/source";

import { LOCALES } from "@/constants/locales";
import { ROUTES } from "@/constants/routes";

// Server only: the compiled content/docs collection (see source.config.ts).
// Docs locales are the site's locales. Fumadocs URLs stay unprefixed
// (`/docs/<slug>`); links add the `/$locale` prefix when they render. A
// translation is `name.<locale>.mdx` next to the English `name.mdx`; a locale
// without one falls back to English.
export const docsI18n = defineI18n({
  languages: [...LOCALES],
  defaultLanguage: "en",
  parser: "dot",
  hideLocale: "always",
});

export const docsSource = loader({
  baseUrl: ROUTES.DOCS,
  i18n: docsI18n,
  source: docs.toFumadocsSource(),
});
