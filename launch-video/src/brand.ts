import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * MotionVideo brand, taken from motionvideo.xyz/brand: one yellow, black ink,
 * the logomark, and the site's own face (Timeless Sans).
 */
export const YELLOW = "#FFBE25";
export const LIGHT_YELLOW = "#FFDD73";
export const INK = "#0a0a0a";
export const PAPER = "#fbfaf7";
/** The stage every scene sits on; matches snapcn's dark `background` token. */
export const NIGHT = "#0a0a0b";

/** Timeless Sans is copied from the site's gitignored public/fonts (see `npm run fonts`). */
export const FONT = "Timeless Sans";
loadFont({
  family: FONT,
  url: staticFile("fonts/timeless/TimelessSansVF-1.094.woff2"),
  weight: "300 900",
  display: "block",
});

/** Root-relative public path; the components used here run it through staticFile themselves. */
export const pub = (path: string) => `/${path}`;

/**
 * Frames pulled from real videos in the MotionVideo gallery (src/data/motion-catalog.json),
 * one still per video, ordered so neighbours contrast.
 */
export const FRAMES = [
  "ajith-io-b5626e-1",
  "arjunsh1607-93005d-0",
  "himanshutwtxs-5f4b43-1",
  "higgsfield-ce3e50-0",
  "stephanlivera-df17a2-1",
  "emollick-8661a8-0",
  "majin-appsheet-2d3c1a-0",
  "thismacapital-dfba20-0",
  "polydao-7a572b-1",
  "jasonzhou1993-8595e0-1",
  "higgsfield_ai-11033b-0",
  "pankajkumar-dev-0bee87-1",
  "tequilafunks-97f6c9-1",
  "brainextends-e19ac3-1",
  "lexnlin-6161a6-0",
  "samuel-spitz-974923-0",
  "claudeai-dc180f-1",
  "majin-appsheet-2d3c1a-1",
  "higgsfield_ai-edddb9-0",
  "ratheejaisal-1f4538-0",
  "eyishazyer-af035b-1",
  "steventey-0d20e4-1",
  "maxalexweber-67688b-1",
  "runwayml-b0b1a0-0",
  "techyoutbe-945b56-1",
  "sudo-kiran-49176d-1",
  "ezshine-c90d73-1",
  "higgsfield-0ab1c3-0",
].map((slug) => `frames/${slug}.jpg`);

/**
 * The MotionVideo logomark (public/brand/motionvideo-logomark-black.svg). Its
 * viewBox starts at 12,12, so the box is padded by the same 12 on the far edges.
 */
export const LOGOMARK_PATH =
  "m12 512.7.3 5.6.6 4.8 1.1 4.7 1.6 5.1 2.2 4.9 2.3 4.2 2.6 4 3.4 4.1 3.5 3.7 3.6 3.1 4.4 3.1 4.4 2.6 4.3 2 5 1.9 5.2 1.3 4.7.8 4.8.4 5.4-.1 5.3-.6 4.7-.9L86 566l5-1.9 4.5-2.3 4.5-2.8 333.7-230.1 3-1.8 3.2-1.6 3.2-1.4 3.4-1.1 4.5-1.1 3.5-.5 3.5-.3h3.5l3.5.2 4.7.7 3.4.9 3.3 1 3.3 1.4 3.1 1.5 3.1 1.8 2.9 2 2.7 2.2 2.6 2.4 3.1 3.5 2.1 2.8 1.9 3 2.2 4.1 1.4 3.2 1.2 3.4.6 2.2.7 3.5.5 3.5.2 3.5v174.8l.2 5.4.7 5 1.2 4.9 1.5 4.6 2.1 4.9 2.5 4.7 2.7 4 3 3.7 3.7 3.9 4.1 3.4 3.9 2.8 4.1 2.5 4.9 2.2 5 1.8 4.6 1.3 4.8.8 5.3.4 5.1-.1 5.3-.6 4.7-.9 4.6-1.4 5-1.9 4.5-2.3 4.5-2.8 333.7-230.1 3-1.8 2.1-1.1 3.2-1.5 3.3-1.2 3.4-.9 2.3-.5 2.3-.4 3.5-.3 4.7-.1 3.5.2 3.5.5 3.4.8 4.5 1.3 3.3 1.4 4.2 2.1 2.9 1.9 3.8 2.8 2.6 2.3 2.5 2.5 2.9 3.7 2 2.9 1.8 3 1.5 3.2 1.7 4.4 1 3.3.7 3.5.5 3.5.2 3.5v101.5l.2 5.5.8 5.4 1.2 4.8 1.5 4.6 2.2 5 2.6 4.6 2.9 4.3 3.4 3.9 3.6 3.7 3.8 3.1 4.8 3.3 4.3 2.3 4.8 2.1 4.9 1.6 5.1 1.2 5.1.7 4.9.2 5.8-.4 4.9-.7 5-1.2 4.9-1.7 4.7-2.2 4.6-2.5 4.2-3L1232 437.6l2.1-1.6 2.9-2.7 1.7-1.7 2.7-3 1.4-1.9 2.3-3.3 2.1-3.5 1.2-2.3 2.3-5.7 1.8-5.9.5-2.5.6-3.8.4-4.7V181.1l-.1-2.5-.5-2.4-.6-1.9-.8-1.7-1.2-1.9-1.2-1.5-1.5-1.6-1.6-1.2-1.6-1-2.1-1.1-1.8-.7-1.9-.6-1.9-.3-2.3-.2-2 .1-2.2.3-1.9.4-1.9.7-1.8.8-1.7 1-145.3 94-4.1 2.4-4.3 1.9-4.5 1.5-4.6 1.1-2.4.4-3.5.3-3.6.1-2.3-.1-4.7-.6-4.6-1-4.5-1.5-2.2-.9-3.2-1.5-2.1-1.1-3-2-1.9-1.4-2.7-2.2-2.6-2.5-1.5-1.8-2.3-2.7-1.3-2-1.9-3-1.1-2.1-1.5-3.2-1.3-3.3-.9-3.4-.6-2.3-.7-4.7-.2-4.7-.1-108.5-.2-2.8-.6-4.5-1.2-5.2-1.6-5.1-1-2.4-2-4-1.5-2.7-2.7-4-3-3.7-2.1-2.3-3.5-3.3-3.8-2.9-2.5-1.8-4.4-2.5L949.4 51l-2.6-1.1-4.1-1.6-4.8-1.3-4.1-.8-2.6-.3-4.9-.3-4.2.1-2.4.1-5.1.8-4.1 1-2.5.7-4.6 1.7-3.8 1.8-2.1 1.1-319.6 184.3-4.3 2-3.3 1.2-3.5.9-4.6.8-3.6.4h-4.7l-3.5-.3-3.5-.5-3.5-.8-3.4-1.1-3.3-1.3-3.2-1.5-3-1.8-3-2-2.7-2.2-1.8-1.6-2.5-2.5-2.3-2.7-2.1-2.9-1.2-2-1.7-3.1-1.5-3.2-1.3-3.4-1-3.4-.7-3.4-.3-2.4-.3-3.5-.1-2.4-.1-113.8-.4-4.5-.4-2.8-.6-2.7-1.2-4.4-2-5.3-2-4-1.4-2.5-3-4.4-1.5-2-3-3.4-3.9-3.7-4.2-3.3-3.8-2.4-2.7-1.5-29.1-15.3-3.9-1.8-4.3-1.7-4.3-1.3-4.6-1-4.4-.5-5.5-.2-4.7.3-4.4.6-4.6 1L51.1 124.5l-4.9 1.9-3 1.3-2.9 1.6-4.5 2.8-2.6 2-2.5 2.1-3.8 3.7-2.4 2.7-3.1 4.3-1.7 2.7-1.6 2.9-2.3 5.1L14 163l-.7 3.1-.9 5.6-.3 3.6Z";
export const LOGOMARK_BOX = { width: 1266, height: 611 };
