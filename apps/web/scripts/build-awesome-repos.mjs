// Build the per-model "awesome" lists (github.com/motionvideohq/awesome-*-
// motion-design) from src/data/motion-catalog.json:
//
//   pnpm repos:build                      writes ../../../awesome-repos/<repo>
//   pnpm repos:build -- --out /some/dir   writes /some/dir/<repo>
//
// Each repo gets a README (videos grouped by their main category, poster
// tables linking to motionvideo.xyz), one Markdown file per prompt in
// `prompts/`, `data/videos.json`, a LICENSE and a .gitignore. Media stays on
// assets.motionvideo.xyz; nothing is copied. The output folders are plain
// working trees: review them, then commit and push from there.
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MOTION_MODEL_NAMES } from "../src/lib/motion-catalog.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const outFlag = process.argv.indexOf("--out");
const outDir =
  outFlag === -1
    ? path.resolve(root, "../../../awesome-repos")
    : path.resolve(process.argv[outFlag + 1]);
const SITE = "https://motionvideo.xyz";
const ORG = "motionvideohq";

// One repo per model. The catalog's model name is the key.
const REPOS = {
  "Opus 5.5": { repo: "awesome-opus-5-5-motion-design", slug: "opus-5-5" },
  "Fable 5.5": { repo: "awesome-fable-5-5-motion-design", slug: "fable-5-5" },
  "Gemini 4 Argon": {
    repo: "awesome-gemini-4-argon-motion-design",
    slug: "gemini-4-argon",
  },
};

// README section per main category (a video's first content tag), in order.
const SECTIONS = {
  "product-ui": "Product UI and launch films",
  phone: "Phone and app motion",
  charts: "Animated charts and data",
  diagrams: "Explainers and diagrams",
  "kinetic-type": "Kinetic typography",
  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names
  shapes: "Shapes and abstract loops",
  particles: "Particles and generative motion",
  characters: "Characters and illustration",
  photos: "Photo motion",
  music: "Music and audio-reactive",
  code: "Code and dev tools",
  other: "More motion design",
};
const EFFORT = {
  medium: "Medium effort",
  high: "High effort",
  max: "Max effort",
};
const ITERATIONS = {
  "one-shot": "One-shot",
  "few-rounds": "A few rounds",
  "many-rounds": "Many rounds",
};

const anchor = (heading) =>
  heading
    .toLowerCase()
    .replaceAll(/[^a-z\d\s-]/gu, "")
    .trim()
    .replaceAll(/\s+/gu, "-");
const escapeHtml = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
/** A video's README section: its first content tag. */
const section = (video) => video.contentTags[0] ?? "other";

// A fence longer than any backtick run inside the prompt.
const fence = (text) => {
  const longest = Math.max(
    0,
    ...[...text.matchAll(/`+/gu)].map(([run]) => run.length)
  );
  return "`".repeat(Math.max(3, longest + 1));
};

const build = async (model, { repo, slug }, videos) => {
  const name = MOTION_MODEL_NAMES[model];
  const utm = (url) =>
    `${url}${url.includes("?") ? "&" : "?"}utm_source=github&utm_medium=readme&utm_campaign=${repo}`;
  const pageUrl = utm(`${SITE}/model/${slug}`);
  const videoUrl = (video) => utm(`${SITE}/videos/${video.slug}`);
  const dir = path.join(outDir, repo);
  // build-awesome-previews.mjs writes the looping WebP map and the banner.
  const previews = await readFile(path.join(dir, "data/previews.json"), "utf-8")
    .then((json) => JSON.parse(json))
    .catch(() => ({}));
  const hasBanner = await access(path.join(dir, "assets/banner.webp"))
    .then(() => true)
    .catch(() => false);
  const previewFor = (video) => previews[video.slug] ?? video.poster;
  // Newest first within each section.
  const sorted = videos.toSorted((a, b) => b.date.localeCompare(a.date));
  const groups = Object.keys(SECTIONS)
    .map((id) => [id, sorted.filter((video) => section(video) === id)])
    .filter(([, list]) => list.length > 0);
  const withPrompt = videos.filter((video) => video.prompt).length;
  const withSkill = videos.filter((video) => video.skillUrl).length;
  const withPreview = videos.filter((video) => previews[video.slug]).length;
  const latest = sorted[0]?.date;

  const cell = (video) => {
    const links = [
      `<a href="${video.tweetUrl}"><b>@${escapeHtml(video.handle)}</b></a>`,
      video.prompt ? `<a href="prompts/${video.slug}.md">Prompt</a>` : null,
      video.skillUrl ? `<a href="${video.skillUrl}">Skill</a>` : null,
    ].filter(Boolean);
    const meta = [
      video.stack,
      EFFORT[video.effort],
      ITERATIONS[video.iterations],
    ]
      .filter(Boolean)
      .map(escapeHtml)
      .join(" · ");
    return [
      `<td width="33%" valign="top">`,
      `<a href="${videoUrl(video)}"><img src="${previewFor(video)}" alt="${escapeHtml(`${video.title}: ${name} motion design by @${video.handle}`)}" width="100%"></a><br>`,
      `<b>${escapeHtml(video.title)}</b><br>`,
      links.join(" · "),
      meta ? `<br><sub>${meta}</sub>` : "",
      `</td>`,
    ].join("");
  };
  // Three posters per row; short rows are padded so posters keep one size.
  const table = (list) => {
    const rows = [];
    for (let index = 0; index < list.length; index += 3) {
      const cells = list.slice(index, index + 3).map(cell);
      while (cells.length < 3) {
        cells.push(`<td width="33%"></td>`);
      }
      rows.push(`<tr>${cells.join("")}</tr>`);
    }
    return `<table>\n${rows.join("\n")}\n</table>`;
  };

  const readme = [
    `# Awesome ${model} Motion Design [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)`,
    "",
    hasBanner
      ? `<a href="${pageUrl}"><img src="assets/banner.webp" alt="${escapeHtml(`A wall of ${name} motion design videos: launch films, kinetic typography, UI motion and more`)}" width="100%"></a>`
      : null,
    "",
    `Motion design and motion graphics videos made with **${name}**, each with the prompt (or agent skill) behind it. Launch films, kinetic typography, UI motion, animated explainers and more, all written as code.`,
    "",
    `Every video here was made by asking ${name} to write the animation as code (HTML, Canvas, SVG, Remotion, HyperFrames and friends). Pick one, copy its prompt, and make your own.`,
    "",
    `**[▶ Watch all ${videos.length} on MotionVideo](${pageUrl})**`,
    "",
    `- ${videos.length} motion design videos, ${withPrompt} with the full prompt in [\`prompts/\`](prompts/)${withSkill > 0 ? ` and ${withSkill} made with an agent skill` : ""}`,
    withPreview > 0
      ? `- ${withPreview} looping previews play right in the tables; every one links to the full video`
      : null,
    `- Machine-readable list in [\`data/videos.json\`](data/videos.json)`,
    `- Every entry credits its creator and links to the original post`,
    latest ? `- Latest video: ${latest}` : null,
    "",
    "## Contents",
    "",
    ...groups.map(
      ([id, list]) =>
        `- [${SECTIONS[id]}](#${anchor(SECTIONS[id])}) (${list.length})`
    ),
    "- [How to use a prompt](#how-to-use-a-prompt)",
    "- [Contributing](#contributing)",
    "- [Credits](#credits)",
    "",
    ...groups.flatMap(([id, list]) => [
      `## ${SECTIONS[id]}`,
      "",
      table(list),
      "",
    ]),
    "## How to use a prompt",
    "",
    `1. Open a video's **Prompt** link and copy the prompt.`,
    `2. Give it to ${name} (in Claude Code, Cursor, or any agent that can write and run code), filling in any placeholders such as your product name.`,
    "3. Let it write the animation as code, then render it to video (Remotion, HyperFrames, or a headless browser with ffmpeg).",
    "",
    `Want agents that already know timing, easing and choreography? See the [MotionVideo skill](${utm(`${SITE}/motionvideo-skill`)}).`,
    "",
    "## Contributing",
    "",
    `Made a motion design video with ${name}? [Submit it on MotionVideo](${utm(`${SITE}/dashboard/submit`)}) with its prompt or skill. This list is generated from the MotionVideo catalog, so new videos land here too.`,
    "",
    "## Credits",
    "",
    `Videos, prompts and post text belong to their creators; each entry links to the original post. Want something credited differently or removed? [Contact us](${utm(`${SITE}/contact`)}). The list itself is MIT licensed.`,
    "",
    `Curated by [MotionVideo](${utm(SITE)}): motion design, written in code.`,
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const promptFile = (video) => {
    const rows = [
      `- **Creator:** [@${video.handle}](https://x.com/${video.handle})`,
      `- **Model:** ${name}`,
      video.stack ? `- **Stack:** ${video.stack}` : null,
      video.effort ? `- **Effort:** ${EFFORT[video.effort]}` : null,
      video.iterations ? `- **Rounds:** ${ITERATIONS[video.iterations]}` : null,
      video.contentTags.length > 0
        ? `- **Categories:** ${video.contentTags.map((tag) => SECTIONS[tag] ?? tag).join(", ")}`
        : null,
      `- **Posted:** ${video.date}`,
    ].filter(Boolean);
    const tick = fence(video.prompt);
    return [
      `# ${video.title}`,
      "",
      `A ${name} motion design video by [@${video.handle}](https://x.com/${video.handle}). [Original post](${video.tweetUrl}) · [Watch on MotionVideo](${videoUrl(video)})`,
      "",
      `[![${escapeHtml(video.title)}](${previewFor(video)})](${videoUrl(video)})`,
      "",
      ...rows,
      "",
      "## Prompt",
      "",
      `${tick}text`,
      video.prompt,
      tick,
      "",
      video.skillUrl
        ? `Made with the [agent skill](${video.skillUrl}).\n`
        : null,
      `More ${name} motion design, each with its prompt: [${SITE.replace("https://", "")}/model/${slug}](${pageUrl})`,
      "",
    ]
      .filter((line) => line !== null)
      .join("\n");
  };

  const data = sorted.map((video) => ({
    slug: video.slug,
    title: video.title,
    creator: video.handle,
    post_url: video.tweetUrl,
    motionvideo_url: `${SITE}/videos/${video.slug}`,
    poster_url: video.poster,
    preview_webp_url: previews[video.slug] ?? null,
    video_url: video.video,
    width: video.width,
    height: video.height,
    posted: video.date,
    model: name,
    categories: video.contentTags,
    stack: video.stack ?? null,
    effort: video.effort ?? null,
    iterations: video.iterations ?? null,
    prompt: video.prompt ?? null,
    skill_url: video.skillUrl ?? null,
  }));

  // Regenerate the generated parts only; keep .git and anything else.
  await rm(path.join(dir, "prompts"), { recursive: true, force: true });
  await mkdir(path.join(dir, "prompts"), { recursive: true });
  await mkdir(path.join(dir, "data"), { recursive: true });
  await writeFile(path.join(dir, "README.md"), readme);
  await writeFile(
    path.join(dir, "data/videos.json"),
    `${JSON.stringify(data, null, 2)}\n`
  );
  await Promise.all(
    videos
      .filter((video) => video.prompt)
      .map((video) =>
        writeFile(
          path.join(dir, "prompts", `${video.slug}.md`),
          promptFile(video)
        )
      )
  );
  await writeFile(path.join(dir, ".gitignore"), ".DS_Store\n");
  await writeFile(
    path.join(dir, "LICENSE"),
    `MIT License

Copyright (c) ${new Date().getFullYear()} MotionVideo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This license covers the list (README structure, data and scripts). The
videos, prompts and post text it links to belong to their creators.
`
  );
  return {
    repo,
    dir,
    videos: videos.length,
    prompts: withPrompt,
    skills: withSkill,
    sections: groups.length,
  };
};

const catalog = JSON.parse(
  await readFile(path.join(root, "src/data/motion-catalog.json"), "utf-8")
);
const results = [];
for (const [model, spec] of Object.entries(REPOS)) {
  const videos = catalog.videos.filter((video) => video.model === model);
  // oxlint-disable-next-line no-await-in-loop
  results.push(await build(model, spec, videos));
}
console.table(results);
console.log(
  `GitHub: ${Object.values(REPOS)
    .map(({ repo }) => `https://github.com/${ORG}/${repo}`)
    .join(" ")}`
);
