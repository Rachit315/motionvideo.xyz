export const SITE_ORIGIN = "https://motionvideo.xyz" as const;

// Absolute URL for canonical links, Open Graph, and JSON-LD. Always the
// production origin so shared links and structured data never point at dev.
export const absoluteUrl = (path = "/"): string =>
  new URL(path, SITE_ORIGIN).toString();
