// Add curated X video posts to src/data/motion-catalog.json through the public
// FxTwitter API.
//
//   pnpm catalog:import:videos
//
// Each source names the post plus the curation FxTwitter can't supply: a
// title, content categories and, when the creator shared it, where the prompt
// is (in the post itself or in one of the creator's own replies) between two
// markers. Posts already in the catalog are skipped, so the list can keep
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
    post: "claudeai/status/2108271552991252810",
    title: "Claude Motion launch explainer",
    contentTags: ["product-ui", "charts"],
  },
  {
    post: "higgsfield/status/2108294775644585998",
    title: "Higgsfield Katana launch film",
    contentTags: ["product-ui", "kinetic-type"],
  },
  {
    post: "flxrnc/status/2108899503092740561",
    title: "Opus 5.5 motion loop",
    contentTags: ["shapes"],
  },
  {
    post: "anabology/status/2110224953287070195",
    title: "Claudia Grok Bot music video teaser",
    contentTags: ["music", "characters"],
  },
  {
    post: "higgsfield_ai/status/2108378429737628038",
    title: "Zero-percent video generation motion piece",
    contentTags: ["shapes", "particles"],
  },
  {
    post: "RoundtableSpace/status/2107686101729055121",
    title: "Opus 5.5 alone vs in a motion harness",
    contentTags: ["product-ui"],
  },
  {
    post: "beamnxw/status/2108953385189732416",
    title: "637 animation techniques reel",
    contentTags: ["kinetic-type", "shapes"],
  },
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
    post: "flxrnc/status/2109266407338934719",
    title: "Opus 5.5 motion piece without a video editor",
    contentTags: ["shapes"],
  },
  {
    post: "motion_so/status/2108241529726984328",
    title: "Sonnet, Haiku and Opus 5.5 make a video about Claude",
    contentTags: ["kinetic-type"],
  },
  {
    post: "beamnxw/status/2109304262597443724",
    title: "Promo video studio teaser",
    contentTags: ["product-ui"],
  },
  {
    post: "beamnxw/status/2110039251681218763",
    title: "Claude Code and Remotion studio reel",
    contentTags: ["product-ui"],
  },
  {
    post: "higgsfield_ai/status/2108312022429602298",
    title: "Car commercial made in code",
    contentTags: ["photos"],
  },
  {
    post: "flxrnc/status/2109629188525420930",
    title: "Single-prompt Opus 5.5 motion piece",
    contentTags: ["shapes"],
  },
  {
    post: "higgsfield/status/2108384911245869197",
    title: "Pure Three.js film made in Claude",
    contentTags: ["particles"],
  },
  {
    post: "higgsfield/status/2110378916963876908",
    title: "Claude on its own motion design: launch video",
    contentTags: ["product-ui", "kinetic-type"],
  },
  {
    post: "beamnxw/status/2109255985994830148",
    title: "Motion design studio stack reel",
    contentTags: ["code"],
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
    post: "motion_so/status/2107507518817878117",
    title: "Opus 5.5 launch video with and without a harness",
    contentTags: ["product-ui"],
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
    post: "primalrobin/status/2107767177743069515",
    title: "40-minute Claude documentary for $2",
    contentTags: ["diagrams"],
  },
  {
    post: "beamnxw/status/2108821248817971519",
    title: "20 tools motion studio reel",
    contentTags: ["code"],
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
    post: "runwayml/status/2108287937272266800",
    title: "Claude Motion with Runway",
    contentTags: ["charts"],
  },
  {
    post: "alex_barashkov/status/2107855834130636808",
    title: "Graphic animation with the full prompt log",
    contentTags: ["shapes"],
  },
  {
    post: "motion_so/status/2108614312684380287",
    title: "Second World War explainer, Claude Motion vs Motion",
    contentTags: ["diagrams"],
  },
  {
    post: "higgsfield_ai/status/2108397633584947553",
    title: "3D and 2D animation one-shot in Claude",
    contentTags: ["characters"],
  },
  {
    post: "higgsfield_ai/status/2108362169163358365",
    title: "Product shoot to motion video in two hours",
    contentTags: ["photos"],
  },
  {
    post: "higgsfield_ai/status/2108423513480876234",
    title: "3D motion graphics coded in Claude",
    contentTags: ["shapes"],
  },
  {
    post: "higgsfield_ai/status/2108422688972939300",
    title: "After Effects-style animation in code",
    contentTags: ["shapes"],
  },
  {
    post: "higgsfield_ai/status/2108322424492339297",
    title: "Brand mascot animation",
    contentTags: ["characters"],
  },
  {
    post: "higgsfield_ai/status/2108324188100686223",
    title: "Strata launch video",
    contentTags: ["product-ui"],
  },
  {
    post: "paulo_kombucha/status/2110014691523101157",
    title: "Cactus mascot with 14 animated transitions",
    contentTags: ["characters"],
  },
  {
    post: "primalrobin/status/2107964005910212703",
    title: "15-minute 3D documentary",
    contentTags: ["diagrams"],
  },
  {
    post: "motion_so/status/2109082358091792711",
    title: "A380 animation one-shot",
    contentTags: ["diagrams"],
  },
  {
    post: "higgsfield_ai/status/2108337982231228481",
    title: "Product commercial in code",
    contentTags: ["photos"],
  },
  {
    post: "motion_so/status/2109412370175115294",
    title: "A motion video about prompts",
    contentTags: ["kinetic-type"],
  },
  {
    post: "higgsfield_ai/status/2108318576470089979",
    title: "Code-based motion design",
    contentTags: ["shapes"],
  },
  {
    post: "motion_so/status/2108391952685396435",
    title: "Motion working inside Claude over MCP",
    contentTags: ["product-ui"],
  },
  {
    post: "kloss_xyz/status/2108237822029099461",
    title: "Full song music video in Blender",
    contentTags: ["music", "particles"],
  },
  {
    post: "higgsfield_ai/status/2108422189263593795",
    title: "3D car chase animation",
    contentTags: ["shapes"],
  },
  {
    post: "hanifproduktif/status/2110182874913910978",
    title: "HyperFrames launch video with Gemini 4 Argon",
    contentTags: ["product-ui"],
  },
  {
    post: "higgsfield_ai/status/2108421514966298799",
    title: "Paper animation drawn in Claude",
    contentTags: ["characters"],
  },
  {
    post: "higgsfield_ai/status/2108400820198985759",
    title: "Launch teaser one-shot",
    contentTags: ["kinetic-type"],
  },
  {
    post: "higgsfield_ai/status/2108318230574227524",
    title: "Motion graphic, every pixel editable",
    contentTags: ["shapes"],
  },
  {
    post: "higgsfield_ai/status/2108346535499227448",
    title: "Generation, animation and editing in code",
    contentTags: ["shapes"],
  },
  {
    post: "higgsfield_ai/status/2108330828216565858",
    title: "Kinetic type promo with glitch transitions",
    contentTags: ["kinetic-type"],
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
    post: "thayto_dev/status/2107582000639136156",
    title: "Job applications feature video",
    contentTags: ["product-ui"],
  },
  {
    post: "beamnxw/status/2110408774737432738",
    title: "Motion studio stack reel",
    contentTags: ["code"],
  },
  {
    post: "motion_so/status/2107879939051786720",
    title: "Nano Banana 2.1 motion design",
    contentTags: ["photos"],
  },
  {
    post: "himanshutwtxs/status/2108093804725325928",
    title: "Coffee brewing methods explainer",
    contentTags: ["diagrams"],
  },
  {
    post: "motion_so/status/2109724848796897597",
    title: "Muse Wonder launch video",
    contentTags: ["product-ui"],
  },
  {
    post: "motion_so/status/2110399022162911263",
    title: "Gemini 4 Argon in Motion",
    contentTags: ["product-ui"],
  },
  {
    post: "motion_so/status/2107185985750725006",
    title: "Inside Opus 5.5's mind",
    contentTags: ["shapes"],
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
    post: "motion_so/status/2109670269598290053",
    title: "Draw your founder: GPT-6 Astra vs Opus 5.5",
    contentTags: ["characters"],
  },
  {
    post: "makwanatejas170/status/2107190788610531354",
    title: "Motion skill before and after",
    contentTags: ["kinetic-type"],
  },
  {
    post: "BuildFastWithAI/status/2108403445304844291",
    title: "Rust-rendered video with fframes",
    contentTags: ["particles", "code"],
  },
  {
    post: "HBCoop_/status/2107924371553841560",
    title: "Substack launch video in HyperFrames Studio",
    contentTags: ["product-ui"],
  },
  {
    post: "Rames_Jusso/status/2109705543942369659",
    title: "HyperFrames Studio one-shot launch video",
    contentTags: ["product-ui"],
  },
  {
    post: "makwanatejas170/status/2109707535955673392",
    title: "HeyGen video edited by an agent",
    contentTags: ["product-ui"],
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
    post: "Adamdesgns/status/2108994543362187313",
    title: "Falcon 1 tribute music video",
    contentTags: ["music"],
  },
  {
    post: "motion_so/status/2110080269948702986",
    title: "Code remix in Motion",
    contentTags: ["shapes"],
  },
  {
    post: "motion_so/status/2110052382075973908",
    title: "Apple HomeView launch video",
    contentTags: ["product-ui"],
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
    post: "sudeepsd_/status/2108169293540331747",
    title: "Automated feature update video",
    contentTags: ["product-ui"],
  },
  {
    post: "BuildFastWithAI/status/2107862020246929648",
    title: "Godot game trailer by Opus 5.5",
    contentTags: ["characters"],
  },
  {
    post: "higgsfield_ai/status/2110436743589876093",
    title: "Ink animation: Gemini 4 Argon vs Opus 5.5",
    contentTags: ["characters"],
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
    post: "samuel_yostt/status/2108284928018272407",
    title: "ViralGrow promo video",
    contentTags: ["product-ui"],
  },
  {
    post: "BuildFastWithAI/status/2110324161763840011",
    title: "Gemini comeback motion graphic",
    contentTags: ["charts"],
  },
  {
    post: "BuildFastWithAI/status/2108194404347281483",
    title: "fframes GPU-rendered demo",
    contentTags: ["code", "particles"],
  },
  {
    post: "aisongman/status/2110276502655000606",
    title: "Procedural Blender ramen scene",
    contentTags: ["shapes"],
  },
  {
    post: "higgsfield_ai/status/2110437867487137997",
    title: "Streaming service launch video",
    contentTags: ["product-ui"],
  },
  {
    post: "DemitiyaGeekzen/status/2110418136277401678",
    title: "huashu-art-motion explainer run with Gemini",
    contentTags: ["characters"],
    skillUrl: "https://github.com/alchaincyf/huashu-art-motion",
  },
];

const sourceSchema = z.object({
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
