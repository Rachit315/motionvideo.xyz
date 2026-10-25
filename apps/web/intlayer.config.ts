import type { IntlayerConfig } from "intlayer";

const config = {
  internationalization: {
    locales: ["en", "es", "fr", "zh", "ko", "ja", "de", "pt", "ru"],
    defaultLocale: "en",
  },
  routing: {
    // Every locale is a real path prefix, including the default one:
    // `/en/about`, `/fr/about`, and so on.
    mode: "prefix-all",
    // The URL is the source of truth; the Worker negotiates a locale for
    // unprefixed visits and stores it in a cookie.
    storage: false,
    enableProxy: false,
  },
  content: {
    contentDir: ["src"],
  },
} satisfies IntlayerConfig;

export default config;
