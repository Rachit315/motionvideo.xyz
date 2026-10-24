// Fetch the curated X Articles listed under /extras/articles through the
// public FxTwitter API and write src/data/x-articles.json.
//
//   pnpm catalog:import:articles [output]
//
// Each source is the article's own post (`x.com/<handle>/status/<id>`); the
// script fails if a post is gone or no longer carries an article, and leaves
// the previous file untouched. Run `pnpm assets:mirror` afterwards to move
// the covers onto assets.motionvideo.xyz.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { z } from "zod";

// Long-form X Articles on making motion videos with AI (mostly Claude Opus
// 5.5), found through FxTwitter timelines and checked by hand. Add a post
// here, then rerun the script.
const SOURCES = [
  "humzaakhalid/status/2105203643758895454",
  "0xMovez/status/2104216919033192746",
  "twoclipping/status/2104446706741825818",
  "socialwithaayan/status/2104519430814482644",
  "neil_xbt/status/2103862582041874854",
  "flxrnc/status/2105311836190978392",
  "0xwhrrari/status/2105643919119696297",
  "ridark_eth/status/2106005237190275109",
  "beamnxw/status/2108616740846420354",
  "liu8in/status/2104707129101988095",
  "HyperFrames_/status/2110072407784616067",
  "MarkKnd/status/2109602794995089505",
  "Adamdesgns/status/2108994182312243442",
  "cesaralvarezll/status/2108198909977805148",
  "seeconvm/status/2106096193235259564",
  "humzaakhalid/status/2105947929290936331",
  "Khazix0918/status/2110587546271191166",
  "AdrianPunk115/status/2110591812536803373",
  "zhu185178/status/2110385140837056621",
  "RaphaelAubryy/status/2111331094650069115",
  "sleepclip/status/2112181238907769216",
  "socialwithaayan/status/2112162508891201962",
  "zhu185178/status/2112127321905762500",
  "Mileson07/status/2112473015439208688",
  "tkz_aiart/status/2112755280392212536",
  "humzaakhalid/status/2112801267710095825",
  "lemomo_ai/status/2113195080517562646",
  "tobiadonadon_/status/2113352372001054721",
  "rubenhassid/status/2110250601032659233",
  "0xjmori/status/2111793914206171234",
  "aiedge_/status/2112552093483671966",
];

const output = path.resolve(
  process.argv[2] ??
    fileURLToPath(new URL("../src/data/x-articles.json", import.meta.url))
);

const articleSchema = z.object({
  tweet: z.object({
    id: z.string(),
    created_timestamp: z.number(),
    author: z.object({ screen_name: z.string() }),
    article: z.object({
      title: z.string().min(1),
      preview_text: z.string(),
      cover_media: z
        .object({ media_info: z.object({ original_img_url: z.url() }) })
        .optional(),
    }),
  }),
});

const PREVIEW_LENGTH = 140;

const firstLine = (text) => {
  const line = text.replaceAll(/\s+/gu, " ").trim();
  return line.length > PREVIEW_LENGTH
    ? `${line.slice(0, PREVIEW_LENGTH - 1).trimEnd()}…`
    : line;
};

const fetchArticle = async (source) => {
  const response = await fetch(`https://api.fxtwitter.com/${source}`, {
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`${source}: HTTP ${response.status}`);
  }
  const { tweet } = articleSchema.parse(await response.json());
  const handle = tweet.author.screen_name;
  return {
    id: `${handle.toLowerCase()}-${tweet.id}`,
    name: tweet.article.title.trim(),
    description: `@${handle} · ${firstLine(tweet.article.preview_text)}`,
    category: "Articles",
    url: `https://x.com/${handle}/article/${tweet.id}`,
    cover: tweet.article.cover_media?.media_info.original_img_url ?? null,
    publishedAt: new Date(tweet.created_timestamp * 1000).toISOString(),
  };
};

// Covers already mirrored by `pnpm assets:mirror` keep their mirrored URL.
const previous = await readFile(output, "utf-8")
  .then((text) => JSON.parse(text).entries)
  .catch(() => []);
const mirrored = new Map(
  previous
    .filter((entry) =>
      entry.cover?.startsWith("https://assets.motionvideo.xyz/")
    )
    .map((entry) => [entry.id, entry.cover])
);

const entries = await Promise.all(SOURCES.map(fetchArticle));
// Newest first.
entries.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
for (const entry of entries) {
  entry.cover = mirrored.get(entry.id) ?? entry.cover;
}

await writeFile(
  output,
  `${JSON.stringify({ importedAt: new Date().toISOString(), entries }, null, 2)}\n`
);
console.log(`${entries.length} articles written to ${output}`);
