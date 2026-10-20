// Add curated X video posts to src/data/motion-catalog.json through the public
// FxTwitter API.
//
//   pnpm catalog:import:videos
//
// Each source names the post plus the curation FxTwitter can't supply: a
// title, content categories and where the prompt is (in the post itself or in
// one of the creator's own replies) between two markers, or a skill URL. Every
// video needs a prompt or a skill, so a source with neither is rejected. Posts
// already in the catalog are skipped, so the list can keep
// growing; find new posts with `pnpm catalog:discover`. New videos are spread
// through the default (popular) order, one after every third existing video.
// Run `pnpm assets:mirror` afterwards to move the media onto
// assets.motionvideo.xyz.
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { z } from "zod";

import { MOTION_CATEGORIES } from "../src/lib/motion-catalog.ts";

const run = promisify(execFile);
const catalogPath = fileURLToPath(
  new URL("../src/data/motion-catalog.json", import.meta.url)
);
const API = "https://api.fxtwitter.com/2";
const CONCURRENCY = 6;
// Cards play a small preview; the detail view plays the best quality.
const PREVIEW_WIDTH = 480;

// Posts found with `pnpm catalog:discover` and checked by hand. Add one here,
// then rerun the script.
const SOURCES = [
  {
    post: "twoclipping/status/2110329502676951367",
    title: "Landing page 3D fly-over",
    contentTags: ["product-ui"],
    prompt: {
      in: "post",
      from: "<inputs>",
    },
  },
  {
    post: "kloss_xyz/status/2107696042053431360",
    title: "MAGNETIC psychedelic Blender short",
    contentTags: ["music", "particles"],
    prompt: {
      in: "reply",
      from: "MAGNETIC:",
    },
  },
  {
    post: "beamnxw/status/2109722135291744578",
    title: "One-word brand launch clip",
    contentTags: ["kinetic-type", "product-ui"],
    prompt: {
      in: "reply",
      from: "<inputs>",
    },
  },
  {
    post: "higgsfield_ai/status/2108372803464692139",
    title: "LOUD ONE launch film",
    contentTags: ["kinetic-type", "music"],
    prompt: {
      in: "reply",
      from: "<inputs>",
    },
  },
  {
    post: "higgsfield_ai/status/2108370085178138694",
    title: "PHYLLA language model launch",
    contentTags: ["kinetic-type"],
    prompt: {
      in: "post",
      from: "<inputs>",
    },
  },
  {
    post: "socialwithaayan/status/2109641079087919114",
    title: "Animated short directed from one Claude chat",
    contentTags: ["characters"],
    prompt: {
      in: "reply",
      from: "Use the Fish Audio",
    },
  },
  {
    post: "rossaxbt/status/2108933141406638456",
    title: "White dot UI motion system",
    contentTags: ["product-ui", "shapes"],
    prompt: {
      in: "post",
      from: "<inputs>",
    },
  },
  {
    post: "rossaxbt/status/2108570705692357094",
    title: "Orange dot motion system",
    contentTags: ["shapes", "kinetic-type", "charts"],
    prompt: {
      in: "post",
      from: "<inputs>",
    },
  },
  {
    post: "kloss_xyz/status/2109087249572749553",
    title: "Turn It Up Now lyric video",
    contentTags: ["music", "kinetic-type"],
    prompt: {
      in: "post",
      from: "Make a fully interactive music video",
    },
  },
  {
    post: "phasE89/status/2107759067313672475",
    title: "Offside explained in 3D",
    contentTags: ["diagrams"],
    prompt: {
      in: "reply",
      from: "3D VÝUKOVÉ",
    },
  },
  {
    post: "flxrnc/status/2108242454105251921",
    title: "14-second UI morph loop",
    contentTags: ["shapes", "product-ui"],
    prompt: {
      in: "post",
      from: "<inputs>",
    },
  },
  {
    post: "prasenx/status/2109744342617473244",
    title: "History of music",
    contentTags: ["music", "diagrams"],
    prompt: {
      in: "reply",
      from: "make a cinematic video",
    },
  },
  {
    post: "notdwd/status/2110430375164232173",
    title: "Shotbase landing page fly-over",
    contentTags: ["product-ui"],
    prompt: {
      in: "post",
      from: "<inputs>",
      to: "</start>",
    },
  },
  {
    post: "DemitiyaGeekzen/status/2110418136277401678",
    title: "huashu-art-motion explainer run with Gemini",
    contentTags: ["characters"],
    skillUrl: "https://github.com/alchaincyf/huashu-art-motion",
  },
];

const sourceSchema = z
  .object({
    post: z.string().regex(/^\w+\/status\/\d+$/u),
    title: z.string().min(1),
    contentTags: z.array(z.enum(MOTION_CATEGORIES)).min(1),
    prompt: z
      .object({
        in: z.enum(["post", "reply"]),
        from: z.string().min(1),
        to: z.string().min(1).optional(),
      })
      .optional(),
    skillUrl: z.url().optional(),
    description: z.string().optional(),
  })
  .refine((source) => source.prompt || source.skillUrl, {
    message: "A source needs a prompt or a skillUrl",
  });

const formatSchema = z.object({
  url: z.url(),
  container: z.string().optional(),
  bitrate: z.number().optional(),
});
const statusSchema = z.object({
  id: z.string(),
  text: z.string(),
  created_timestamp: z.number(),
  author: z.object({ screen_name: z.string(), avatar_url: z.url() }),
  media: z
    .object({
      all: z.array(
        z.object({
          type: z.string(),
          url: z.url(),
          thumbnail_url: z.url().optional(),
          width: z.number(),
          height: z.number(),
          formats: z.array(formatSchema).optional(),
        })
      ),
    })
    .optional(),
});
// Only the author and text matter in replies (the prompt may live there).
const replySchema = z.object({
  id: z.string(),
  text: z.string(),
  author: z.object({ screen_name: z.string() }),
});
const conversationSchema = z.object({
  status: statusSchema,
  thread: z.array(replySchema).optional(),
  replies: z.array(replySchema).optional(),
});

const fetchConversation = async (id) => {
  const response = await fetch(`${API}/conversation/${id}`, {
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) {
    throw new Error(`${id}: HTTP ${response.status}`);
  }
  return conversationSchema.parse(await response.json());
};

const widthOf = (url) =>
  Number(url.match(/\/(?<width>\d+)x\d+\//u)?.groups.width);
const distanceFromPreviewWidth = (format) =>
  Math.abs((widthOf(format.url) || Infinity) - PREVIEW_WIDTH);

// The text from `from` (inclusive) up to and including `to`, if given.
const between = (text, { from, to }) => {
  const start = text.indexOf(from);
  if (start === -1) {
    return null;
  }
  const end = to ? text.indexOf(to, start) : -1;
  return (
    end === -1 ? text.slice(start) : text.slice(start, end + to.length)
  ).trim();
};

const findPrompt = (source, conversation) => {
  const { prompt } = source;
  if (!prompt) {
    return null;
  }
  const { status } = conversation;
  const texts =
    prompt.in === "post"
      ? [status.text]
      : [...(conversation.thread ?? []), ...(conversation.replies ?? [])]
          .filter(
            (reply) =>
              reply.author.screen_name === status.author.screen_name &&
              reply.id !== status.id
          )
          .map((reply) => reply.text);
  const found = texts.map((text) => between(text, prompt)).find(Boolean);
  if (!found) {
    throw new Error(`${source.post}: prompt marker "${prompt.from}" not found`);
  }
  return found;
};

// A 16px-wide PNG of the poster as a data URI, shown while media loads.
// Optional: skipped when ffmpeg is unavailable or fails.
const blurOf = async (poster) => {
  try {
    const { stdout } = await run(
      "ffmpeg",
      [
        "-loglevel",
        "error",
        "-i",
        poster,
        "-vf",
        "scale=16:-2",
        "-frames:v",
        "1",
        "-f",
        "image2pipe",
        "-vcodec",
        "png",
        "-",
      ],
      { encoding: "buffer", maxBuffer: 1024 * 1024 }
    );
    return `data:image/png;base64,${stdout.toString("base64")}`;
  } catch {
    return null;
  }
};

const buildVideo = async (source) => {
  const [, id] = source.post.split("/status/");
  const conversation = await fetchConversation(id);
  const { status } = conversation;
  const media = status.media?.all.find(
    (item) => item.type === "video" || item.type === "gif"
  );
  if (!media?.thumbnail_url) {
    throw new Error(`${source.post}: no video`);
  }
  const mp4 =
    media.formats?.filter((format) => format.container === "mp4") ?? [];
  const variants = mp4.length > 0 ? mp4 : [{ url: media.url, bitrate: 0 }];
  const [best] = variants.toSorted(
    (a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0)
  );
  const [preview] = variants.toSorted(
    (a, b) => distanceFromPreviewWidth(a) - distanceFromPreviewWidth(b)
  );
  const handle = status.author.screen_name;
  const prompt = findPrompt(source, conversation);
  const blur = await blurOf(media.thumbnail_url);
  const video = {
    slug: `${handle.toLowerCase()}-${createHash("sha1").update(status.id).digest("hex").slice(0, 6)}`,
    title: source.title,
    date: new Date(status.created_timestamp * 1000).toISOString().slice(0, 10),
    tags: [],
    contentTags: source.contentTags,
    promptShared: Boolean(prompt),
    handle,
    avatar: status.author.avatar_url,
    poster: media.thumbnail_url,
  };
  if (blur) {
    video.blur = blur;
  }
  Object.assign(video, {
    preview: preview.url,
    video: best.url,
    width: media.width,
    height: media.height,
    tweetUrl: `https://x.com/${handle}/status/${status.id}`,
  });
  if (prompt) {
    video.tags.push("prompt");
    video.prompt = prompt;
  }
  if (source.skillUrl) {
    video.tags.push("skill");
    video.skillUrl = source.skillUrl;
  }
  if (source.description) {
    video.description = source.description;
  }
  return video;
};

const catalog = JSON.parse(await readFile(catalogPath, "utf-8"));
const known = new Set(
  catalog.videos.map(
    (video) => video.tweetUrl?.match(/status\/(?<id>\d+)/u)?.groups.id
  )
);
const pending = z
  .array(sourceSchema)
  .parse(SOURCES)
  .filter((source) => !known.has(source.post.split("/status/")[1]));

const added = [];
const failed = [];
const queue = [...pending];
// A few posts at a time, to stay gentle on the public API.
const worker = async () => {
  for (let source = queue.shift(); source; source = queue.shift()) {
    try {
      // oxlint-disable-next-line no-await-in-loop
      added.push(await buildVideo(source));
    } catch (error) {
      failed.push({ post: source.post, error: error.message });
    }
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// Interleave: one new video after every three existing ones.
const videos = [];
const fresh = [...added];
for (const [index, video] of catalog.videos.entries()) {
  videos.push(video);
  if (index % 3 === 2 && fresh.length > 0) {
    videos.push(fresh.shift());
  }
}
videos.push(...fresh);

if (added.length > 0) {
  await writeFile(
    catalogPath,
    `${JSON.stringify({ importedAt: new Date().toISOString(), videos }, null, 2)}\n`
  );
}
console.log(
  `${added.length} added, ${SOURCES.length - pending.length} already in the catalog, ${failed.length} failed.`
);
if (failed.length > 0) {
  console.error(failed);
  process.exitCode = 1;
}
