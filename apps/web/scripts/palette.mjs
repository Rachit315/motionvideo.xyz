// A video's dominant colours, for the gallery's colour filter and similar
// videos: a few frames of the preview, point-sampled (not averaged, so thin
// bright strokes keep their colour) and clustered in OKLab.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import {
  oklabDistance,
  oklabToRgb,
  rgbToHex,
  rgbToOklab,
} from "../src/lib/color.ts";

const run = promisify(execFile);
const WIDTH = 64;
const HEIGHT = 36;
const FRAMES = 6;
const CLUSTERS = 8;
const ROUNDS = 12;
// Neutral clusters under this share of the frames are specks, not colours.
const MIN_SHARE = 0.03;
// Saturated accents carry a video's look on far less of the frame.
const MIN_ACCENT_SHARE = 0.004;
const ACCENT_CHROMA = 0.08;
// Clusters closer than this read as one colour.
const MERGE_DISTANCE = 0.06;
const MAX_COLORS = 5;

/**
 * Up to five hex colours (no `#`), most of the frames first. Null when ffmpeg
 * is unavailable or can't read the media (the preview video, or a poster).
 */
export const paletteOf = async (media) => {
  let stdout;
  try {
    ({ stdout } = await run(
      "ffmpeg",
      [
        "-loglevel",
        "error",
        "-i",
        media,
        "-vf",
        // Every 45th frame (1.5s at 30fps), point-sampled.
        `select='not(mod(n\\,45))',scale=${WIDTH}:${HEIGHT}:flags=neighbor`,
        "-fps_mode",
        "vfr",
        "-frames:v",
        String(FRAMES),
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-",
      ],
      { encoding: "buffer", maxBuffer: 16 * 1024 * 1024 }
    ));
  } catch {
    return null;
  }
  const pixels = [];
  for (let index = 0; index + 2 < stdout.length; index += 3) {
    pixels.push(
      rgbToOklab([stdout[index], stdout[index + 1], stdout[index + 2]])
    );
  }
  if (pixels.length === 0) {
    return null;
  }

  // Deterministic seeds: the mean, then each pixel farthest from every seed
  // so far, so small but distinct accents get a cluster of their own.
  const mean = [0, 1, 2].map(
    (axis) =>
      pixels.reduce((sum, pixel) => sum + pixel[axis], 0) / pixels.length
  );
  const centroids = [mean];
  const nearest = pixels.map((pixel) => oklabDistance(pixel, mean));
  while (centroids.length < CLUSTERS) {
    let farthest = 0;
    for (let index = 1; index < pixels.length; index += 1) {
      if (nearest[index] > nearest[farthest]) {
        farthest = index;
      }
    }
    const seed = [...pixels[farthest]];
    centroids.push(seed);
    for (const [index, pixel] of pixels.entries()) {
      nearest[index] = Math.min(nearest[index], oklabDistance(pixel, seed));
    }
  }

  const assignments = new Uint8Array(pixels.length);
  for (let round = 0; round < ROUNDS; round += 1) {
    const sums = centroids.map(() => [0, 0, 0, 0]);
    for (const [index, pixel] of pixels.entries()) {
      let best = 0;
      let bestDistance = Infinity;
      for (const [cluster, centroid] of centroids.entries()) {
        const distance = oklabDistance(pixel, centroid);
        if (distance < bestDistance) {
          best = cluster;
          bestDistance = distance;
        }
      }
      assignments[index] = best;
      const sum = sums[best];
      sum[0] += pixel[0];
      sum[1] += pixel[1];
      sum[2] += pixel[2];
      sum[3] += 1;
    }
    for (const [cluster, [l, a, b, count]] of sums.entries()) {
      if (count > 0) {
        centroids[cluster] = [l / count, a / count, b / count];
      }
    }
  }

  const counts = centroids.map(() => 0);
  for (const assignment of assignments) {
    counts[assignment] += 1;
  }
  const clusters = centroids
    .map((centroid, index) => ({
      centroid,
      share: counts[index] / pixels.length,
    }))
    .toSorted((a, b) => b.share - a.share);
  const kept = [];
  for (const cluster of clusters) {
    const twin = kept.find(
      (other) =>
        oklabDistance(other.centroid, cluster.centroid) < MERGE_DISTANCE
    );
    const chroma = Math.hypot(cluster.centroid[1], cluster.centroid[2]);
    if (twin) {
      twin.share += cluster.share;
    } else if (
      cluster.share >= (chroma >= ACCENT_CHROMA ? MIN_ACCENT_SHARE : MIN_SHARE)
    ) {
      kept.push(cluster);
    }
  }
  return kept
    .toSorted((a, b) => b.share - a.share)
    .slice(0, MAX_COLORS)
    .map((cluster) => rgbToHex(oklabToRgb(cluster.centroid)));
};
