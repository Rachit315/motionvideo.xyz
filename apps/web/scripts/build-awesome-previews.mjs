// Generate looping WebP previews for the per-model awesome lists
// (github.com/motionvideohq/awesome-*-motion-design), upload them to the R2
// bucket behind assets.motionvideo.xyz, and build a mosaic banner per repo.
//
//   node apps/web/scripts/build-awesome-previews.mjs
//   node apps/web/scripts/build-awesome-previews.mjs --out /some/dir
//   node apps/web/scripts/build-awesome-previews.mjs --only opus-5-5
//
// Writes `<repo>/data/previews.json` (slug → WebP URL) and
// `<repo>/assets/banner.webp`, which build-awesome-repos.mjs then uses. Keys
// embed a hash of the source preview and the encode settings, so reruns skip
// work and a settings change uploads under a fresh key.
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = fileURLToPath(new URL("..", import.meta.url));
const wrangler = path.join(root, "node_modules/.bin/wrangler");
const ORIGIN = "https://assets.motionvideo.xyz";
const BUCKET = "motionvideo-assets";
const CACHE_CONTROL = "public, max-age=31536000, immutable";
const CONCURRENCY = 6;

// 320px wide, 6 fps, four seconds: small enough for a README with hundreds of
// previews, large enough to stay sharp in a one-third-width table cell.
const PREVIEW = {
  version: 1,
  width: 320,
  fps: 6,
  seconds: 4,
  quality: 48,
};
// Walls are 12 × 8 for the large Opus list and 8 × 4 for the small lists, so
// ten videos are not repeated into a hundred near-identical tiles.
const REPOS = {
  "Opus 5.5": {
    repo: "awesome-opus-5-5-motion-design",
    slug: "opus-5-5",
    banner: { columns: 12, rows: 8 },
  },
  "Fable 5.5": {
    repo: "awesome-fable-5-5-motion-design",
    slug: "fable-5-5",
    banner: { columns: 8, rows: 4 },
  },
  "Gemini 4 Argon": {
    repo: "awesome-gemini-4-argon-motion-design",
    slug: "gemini-4-argon",
    banner: { columns: 8, rows: 4 },
  },
};

const wallOf = (spec) => {
  const { columns, rows } = spec.banner;
  return {
    columns,
    rows,
    tileWidth: Math.round(2280 / columns),
    tileHeight: Math.round(1280 / rows),
  };
};

const outFlag = process.argv.indexOf("--out");
const outDir =
  outFlag === -1
    ? path.resolve(root, "../../../awesome-repos")
    : path.resolve(process.argv[outFlag + 1]);
const onlyFlag = process.argv.indexOf("--only");
const only = onlyFlag === -1 ? undefined : process.argv[onlyFlag + 1];
const dryRun = process.argv.includes("--dry-run");

const hashOf = (value) =>
  createHash("sha256").update(value).digest("hex").slice(0, 10);
const encodeSettings = [
  `v${PREVIEW.version}`,
  `w${PREVIEW.width}`,
  `fps${PREVIEW.fps}`,
  `s${PREVIEW.seconds}`,
  `q${PREVIEW.quality}`,
].join("-");
const keyFor = (slug, video) =>
  `readme/${slug}/${video.slug}-${hashOf(`${video.preview}|${encodeSettings}`)}.webp`;

const exists = async (key) => {
  const response = await fetch(`${ORIGIN}/${key}?check=${Date.now()}`, {
    method: "HEAD",
    signal: AbortSignal.timeout(15_000),
  });
  return response.ok;
};

const download = async (url, file) => {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(10 * 60_000),
  });
  if (!response.ok || !response.body) {
    throw new Error(`Download failed with HTTP ${response.status}`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(file));
};

const framesIn = async (dir) => {
  const names = await readdir(dir);
  return names
    .filter((name) => name.endsWith(".png"))
    .toSorted()
    .map((name) => path.join(dir, name));
};

const makePreview = async (file, dir, webp) => {
  await mkdir(dir, { recursive: true });
  await run("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-t",
    String(PREVIEW.seconds),
    "-i",
    file,
    "-vf",
    `fps=${PREVIEW.fps},scale=${PREVIEW.width}:-2:flags=lanczos`,
    path.join(dir, "%03d.png"),
  ]);
  const frames = await framesIn(dir);
  if (frames.length === 0) {
    throw new Error("No frames decoded");
  }
  await run("img2webp", [
    "-loop",
    "0",
    "-lossy",
    "-d",
    String(Math.round(1000 / PREVIEW.fps)),
    "-q",
    String(PREVIEW.quality),
    "-m",
    "6",
    ...frames,
    "-o",
    webp,
  ]);
};

// One 1.19:1 tile per video for Opus; a short filmstrip for the small lists,
// which need more than one frame per video to fill the wall.
const bannerFrame = async (file, out, time, wall) => {
  await run("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-ss",
    String(time),
    "-i",
    file,
    "-frames:v",
    "1",
    "-vf",
    `scale=${wall.tileWidth}:${wall.tileHeight}:force_original_aspect_ratio=increase,crop=${wall.tileWidth}:${wall.tileHeight}`,
    out,
  ]);
  await access(out);
};

const bannerFrames = async (file, out, index, wall) => {
  const start = 0.3;
  const step = 3.6 / 11;
  try {
    await bannerFrame(file, out, start + index * step, wall);
    return true;
  } catch (error) {
    console.error(`banner frame ${out}: ${error.message}`);
    try {
      await bannerFrame(file, out, 0, wall);
      return true;
    } catch (fallbackError) {
      console.error(`banner frame ${out}: ${fallbackError.message}`);
      return false;
    }
  }
};

const catalog = JSON.parse(
  await readFile(path.join(root, "src/data/motion-catalog.json"), "utf-8")
);
const models = Object.entries(REPOS).filter(
  ([, spec]) => !only || spec.slug === only
);
if (models.length === 0) {
  throw new Error(`Unknown --only: ${only}`);
}

const workDir = await mkdtemp(path.join(tmpdir(), "motionvideo-awesome-"));
const queue = [];
for (const [model, spec] of models) {
  const videos = catalog.videos
    .filter((video) => video.model === model)
    .toSorted((a, b) => b.date.localeCompare(a.date));
  // The newest videos become the banner wall; every video gets a preview.
  const wall = wallOf(spec);
  const bannerSlugs = new Set(
    videos.slice(0, wall.columns * wall.rows).map((video) => video.slug)
  );
  for (const [index, video] of videos.entries()) {
    queue.push({ video, spec, bannerSlugs, index, newest: videos.length });
  }
}
console.log(
  `${queue.length} previews for ${models.length} repos → ${outDir}${dryRun ? " (dry run)" : ""}`
);

const generated = new Map();
const bannerTiles = new Map();
const failures = [];

const buildOne = async ({ video, spec, bannerSlugs, newest }) => {
  const key = keyFor(spec.slug, video);
  const url = `${ORIGIN}/${key}`;
  const base = path.join(workDir, video.slug);
  const file = `${base}.mp4`;
  const webp = path.join(workDir, `${video.slug}.webp`);
  const needsPreview = !(await exists(key));
  const needsBanner = bannerSlugs.has(video.slug);

  await mkdir(path.dirname(base), { recursive: true });
  // The banner is cut from the source clip, so a cached preview still needs
  // the download when this video belongs on the wall.
  if (needsPreview || needsBanner) {
    await download(video.preview, file);
  }
  if (needsPreview) {
    await makePreview(file, `${base}-frames`, webp);
    // Three attempts: wrangler occasionally races on a refreshed OAuth token.
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        // Retries run one after another on purpose.
        // oxlint-disable-next-line no-await-in-loop
        await run(
          wrangler,
          [
            "r2",
            "object",
            "put",
            `${BUCKET}/${key}`,
            "--remote",
            "--file",
            webp,
            "--content-type",
            "image/webp",
            "--cache-control",
            CACHE_CONTROL,
          ],
          { cwd: root, maxBuffer: 16 * 1024 * 1024 }
        );
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error;
        // oxlint-disable-next-line no-await-in-loop
        await sleep(1000 * attempt);
      }
    }
    if (lastError) {
      throw lastError;
    }
  }
  generated.set(video.slug, url);

  if (bannerSlugs.has(video.slug)) {
    const dir = path.join(workDir, `banner-${spec.slug}`);
    await mkdir(dir, { recursive: true });
    let tiles = bannerTiles.get(spec.slug);
    if (!tiles) {
      tiles = new Set();
      bannerTiles.set(spec.slug, tiles);
    }
    const wall = wallOf(spec);
    const perVideo =
      spec.slug === "opus-5-5"
        ? 1
        : Math.ceil((wall.columns * wall.rows) / Math.min(newest, 12));
    let added = 0;
    for (let index = 0; index < perVideo; index += 1) {
      const out = path.join(dir, `tile-${video.slug}-${index}.png`);
      // oxlint-disable-next-line no-await-in-loop
      const ok = await bannerFrames(file, out, index, wall);
      if (ok) {
        tiles.add(out);
        added += 1;
      }
    }
    if (added === 0) {
      throw new Error("No banner frame decoded");
    }
  }
};

let processed = 0;
const total = queue.length;
const worker = async () => {
  // oxlint-disable-next-line no-await-in-loop
  while (queue.length > 0) {
    const job = queue.shift();
    try {
      // oxlint-disable-next-line no-await-in-loop
      await buildOne(job);
      processed += 1;
      if (processed % 25 === 0 || processed === total) {
        console.log(`[${processed}/${total}] ${job.video.slug}`);
      }
    } catch (error) {
      failures.push({ slug: job.video.slug, error: error.message });
      processed += 1;
      console.error(`failed ${job.video.slug}: ${error.message}`);
    }
  }
};
if (dryRun) {
  for (const job of queue.slice(0, 5)) {
    console.log(`${keyFor(job.spec.slug, job.video)}  ←  ${job.video.preview}`);
  }
} else {
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
}

// Deterministic shuffle so the wall looks varied but reruns are stable.
const seededShuffle = (items, seed) => {
  let state = seed;
  // mulberry32: a 32-bit PRNG, which is integer bit arithmetic by design.
  /* oxlint-disable no-bitwise, unicorn/prefer-math-trunc */
  const random = () => {
    state = (state + 0x6d_2b_79_f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
  /* oxlint-enable no-bitwise, unicorn/prefer-math-trunc */
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

const buildBanner = async (spec) => {
  const tiles = seededShuffle(
    [...(bannerTiles.get(spec.slug) ?? [])],
    spec.slug.length * 7919
  );
  const wall = wallOf(spec);
  const need = wall.columns * wall.rows;
  if (tiles.length < need) {
    throw new Error(`Banner needs ${need} tiles, got ${tiles.length}`);
  }
  const dir = path.join(workDir, `wall-${spec.slug}`);
  await mkdir(dir, { recursive: true });
  const picked = tiles.slice(0, need);
  await Promise.all(
    picked.map((tile, index) =>
      run("ffmpeg", [
        "-y",
        "-v",
        "error",
        "-i",
        tile,
        "-vf",
        `scale=${wall.tileWidth}:${wall.tileHeight}:force_original_aspect_ratio=increase,crop=${wall.tileWidth}:${wall.tileHeight}`,
        path.join(dir, `${String(index + 1).padStart(3, "0")}.png`),
      ])
    )
  );
  const raw = path.join(dir, "banner.png");
  await run("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-framerate",
    "1",
    "-i",
    path.join(dir, "%03d.png"),
    "-vf",
    `tile=${wall.columns}x${wall.rows},scale=1762:990:flags=lanczos`,
    "-frames:v",
    "1",
    raw,
  ]);
  const repoDir = path.join(outDir, spec.repo);
  await mkdir(path.join(repoDir, "assets"), { recursive: true });
  const banner = path.join(repoDir, "assets/banner.webp");
  await run("cwebp", [
    "-q",
    "82",
    "-m",
    "6",
    "-metadata",
    "none",
    raw,
    "-o",
    banner,
  ]);
  return banner;
};

for (const [model, spec] of models) {
  if (dryRun) {
    continue;
  }
  const repoDir = path.join(outDir, spec.repo);
  // One repo at a time, like the banner below.
  // oxlint-disable-next-line no-await-in-loop
  await mkdir(path.join(repoDir, "data"), { recursive: true });
  const previews = {};
  for (const video of catalog.videos.filter((item) => item.model === model)) {
    const url = generated.get(video.slug);
    if (url) {
      previews[video.slug] = url;
    }
  }
  // oxlint-disable-next-line no-await-in-loop
  await writeFile(
    path.join(repoDir, "data/previews.json"),
    `${JSON.stringify(previews, null, 2)}\n`
  );
  if ((bannerTiles.get(spec.slug) ?? new Set()).size > 0) {
    // oxlint-disable-next-line no-await-in-loop
    const banner = await buildBanner(spec);
    console.log(`banner ${path.relative(outDir, banner)}`);
  }
}

console.log(`previews: ${generated.size}, failed: ${failures.length}`);
if (failures.length > 0) {
  console.error(failures.map((failure) => failure.slug).join("\n"));
  process.exitCode = 1;
}
