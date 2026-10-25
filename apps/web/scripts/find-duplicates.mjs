// Find videos in src/data/motion-catalog.json that are the same footage:
// reposts of one clip under different titles, handles or crops.
//
//   pnpm catalog:duplicates          print duplicate groups
//   pnpm catalog:duplicates --json   the same, as JSON (for remove-videos)
//
// Titles and descriptions can't tell: they were written per post. Instead
// each preview is sampled twice a second as a tiny greyscale thumbnail, and
// two videos match when a run of their frames lines up at one time offset
// (so a trimmed or delayed repost still matches its source) with nearly
// identical pictures. Pictures are compared by correlation, which ignores
// brightness and contrast changes from re-encoding; near-blank frames (a
// black intro, a white card) carry no evidence and are skipped. Needs
// ffmpeg. Thumbnails are cached in node_modules/.cache by preview URL, so
// reruns are quick.
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const catalogPath = path.join(root, "src/data/motion-catalog.json");
const cachePath = path.join(
  root,
  "node_modules/.cache/motion-frame-thumbnails.json"
);
const CONCURRENCY = 12;
const WIDTH = 32;
const HEIGHT = 18;
const PIXELS = WIDTH * HEIGHT;
// Below this pixel spread a frame is blank enough to match anything.
const MIN_SPREAD = 12;
// Correlation above which two frames are the same picture.
const SAME_FRAME = 0.95;
// A pair matches when this many frames line up at one offset, covering this
// share of the shorter video's usable frames. Previews are often only 4s
// (8 frames, half of them blank), hence the low count and high share.
const MIN_ALIGNED = 3;
const MIN_SHARE = 0.75;

const thumbnailsOf = async (media) => {
  const { stdout } = await run(
    "ffmpeg",
    [
      "-loglevel",
      "error",
      "-i",
      media,
      "-vf",
      `fps=2,scale=${WIDTH}:${HEIGHT}:flags=area,format=gray`,
      "-f",
      "rawvideo",
      "-",
    ],
    { encoding: "buffer", maxBuffer: 64 * 1024 * 1024 }
  );
  const frames = [];
  for (let offset = 0; offset + PIXELS <= stdout.length; offset += PIXELS) {
    frames.push(stdout.subarray(offset, offset + PIXELS).toString("base64"));
  }
  return frames;
};

// Zero-mean, unit-length pixels, so a dot product is the correlation; null
// for a near-blank frame.
const normalise = (base64) => {
  const pixels = Buffer.from(base64, "base64");
  let sum = 0;
  for (const value of pixels) {
    sum += value;
  }
  const mean = sum / PIXELS;
  const centred = new Float32Array(PIXELS);
  let squares = 0;
  for (const [index, value] of pixels.entries()) {
    centred[index] = value - mean;
    squares += centred[index] ** 2;
  }
  if (Math.sqrt(squares / PIXELS) < MIN_SPREAD) {
    return null;
  }
  const length = Math.sqrt(squares);
  return centred.map((value) => value / length);
};

const correlation = (a, b) => {
  let dot = 0;
  for (let index = 0; index < PIXELS; index += 1) {
    dot += a[index] * b[index];
  }
  return dot;
};

// Most frames that line up at a single offset between `a` and `b`.
const alignedFrames = (a, b) => {
  let best = 0;
  for (let shift = 1 - a.length; shift < b.length; shift += 1) {
    let matched = 0;
    for (let index = Math.max(0, -shift); index < a.length; index += 1) {
      const other = b[index + shift];
      if (other === undefined) {
        break;
      }
      if (a[index] && other && correlation(a[index], other) >= SAME_FRAME) {
        matched += 1;
      }
    }
    best = Math.max(best, matched);
  }
  return best;
};

const catalog = JSON.parse(await readFile(catalogPath, "utf-8"));
const cache = JSON.parse(await readFile(cachePath, "utf-8").catch(() => "{}"));

const frames = new Map();
const failed = [];
const queue = [...catalog.videos];
const worker = async () => {
  for (let video = queue.shift(); video; video = queue.shift()) {
    if (!cache[video.preview]) {
      try {
        // oxlint-disable-next-line no-await-in-loop
        cache[video.preview] = await thumbnailsOf(video.preview);
      } catch {
        failed.push(video.slug);
        continue;
      }
    }
    const normalised = cache[video.preview].map(normalise);
    if (normalised.filter(Boolean).length >= MIN_ALIGNED) {
      frames.set(video.slug, normalised);
    }
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
await mkdir(path.dirname(cachePath), { recursive: true });
await writeFile(cachePath, JSON.stringify(cache));

// Union-find over every matching pair, so A≈B and B≈C land in one group.
const parent = new Map(catalog.videos.map((video) => [video.slug, video.slug]));
const find = (slug) => {
  let current = slug;
  while (parent.get(current) !== current) {
    current = parent.get(current);
  }
  return current;
};
const slugs = [...frames.keys()];
for (const [index, a] of slugs.entries()) {
  for (const b of slugs.slice(index + 1)) {
    const aligned = alignedFrames(frames.get(a), frames.get(b));
    const shorter = Math.min(
      frames.get(a).filter(Boolean).length,
      frames.get(b).filter(Boolean).length
    );
    if (aligned >= MIN_ALIGNED && aligned / shorter >= MIN_SHARE) {
      parent.set(find(a), find(b));
    }
  }
}

const bySlug = new Map(catalog.videos.map((video) => [video.slug, video]));
const groups = Map.groupBy(slugs, find)
  .values()
  .filter((group) => group.length > 1)
  // Keep first: the one with a prompt, then the earliest post, then the
  // larger frame; the rest are the duplicates to remove.
  .map((group) =>
    group
      .map((slug) => bySlug.get(slug))
      .toSorted(
        (a, b) =>
          Number(Boolean(b.prompt)) - Number(Boolean(a.prompt)) ||
          a.date.localeCompare(b.date) ||
          b.width * b.height - a.width * a.height
      )
  )
  .toArray();

if (process.argv.includes("--json")) {
  console.log(
    JSON.stringify(
      groups.map(([keep, ...rest]) => ({
        keep: keep.slug,
        remove: rest.map((video) => video.slug),
      })),
      null,
      2
    )
  );
} else {
  for (const [keep, ...rest] of groups) {
    console.log(
      `keep    ${keep.slug}  ${keep.date}  @${keep.handle}  ${keep.title}`
    );
    for (const video of rest) {
      console.log(
        `remove  ${video.slug}  ${video.date}  @${video.handle}  ${video.title}`
      );
    }
    console.log("");
  }
  const duplicates = groups.reduce((sum, group) => sum + group.length - 1, 0);
  console.log(`${groups.length} groups, ${duplicates} duplicates.`);
}
if (failed.length > 0) {
  console.error(`Could not read ${failed.length} previews:`, failed);
  process.exitCode = 1;
}
