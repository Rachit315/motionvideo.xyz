// Pulls the licensed Timeless website font into gitignored `public/fonts/`
// so dev and the Worker serve it same-origin at `/fonts/...`.
//
// The font stays out of the public repo (its license allows embedding on the
// website, not redistribution in a public repository): this script is
// the only thing that materializes it. It skips when the file already exists
// and fails loudly when the file is missing and the download fails, so a
// deploy never silently ships the Arial fallback.
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const FONT_VERSION = "1.094";
const FONT_FILE = `TimelessSansVF-${FONT_VERSION}.woff2`;
const DEST = path.join(
  import.meta.dirname,
  "..",
  "public",
  "fonts",
  "timeless",
  FONT_FILE
);
// Canonical remote copy: the `motionvideo-assets` R2 bucket behind
// assets.motionvideo.xyz. A local licensed file can be used instead via
// `FONT_SRC=<path-or-url> pnpm fonts:pull`.
const FALLBACK_SRC = `https://assets.motionvideo.xyz/fonts/timeless/${FONT_FILE}`;

const exists = async (file) => {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
};

if (await exists(DEST)) {
  console.log(`fonts:pull: ${FONT_FILE} already present, skipping.`);
  process.exit(0);
}

const src = process.env.FONT_SRC ?? FALLBACK_SRC;
console.log(`fonts:pull: fetching ${src}`);
let response;
try {
  response = await fetch(src);
} catch (error) {
  console.error(
    `fonts:pull: download failed (${error.cause?.message ?? error.message}). ` +
      `Place the licensed ${FONT_FILE} at public/fonts/timeless/ manually, ` +
      `or retry with FONT_SRC=<url-or-file> pnpm fonts:pull.`
  );
  process.exit(1);
}
if (!response.ok || !response.body) {
  console.error(
    `fonts:pull: ${src} returned HTTP ${response.status}. ` +
      `Place the licensed ${FONT_FILE} at public/fonts/timeless/ manually.`
  );
  process.exit(1);
}

await mkdir(path.dirname(DEST), { recursive: true });
const buffer = Buffer.from(await response.arrayBuffer());
await writeFile(DEST, buffer);
console.log(
  `fonts:pull: wrote ${(buffer.length / 1024).toFixed(0)} KB to ${DEST}`
);
