import directories from "@/data/resource-directories.json";
import xArticles from "@/data/x-articles.json";

export interface DirectoryEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  cover: string | null;
}

// Each kind is its own section: `tool` lists /tools, `studio` lists /creatives
// (studios and designers), `skill` lists /skills, and `extra` lists /extras.
export type DirectoryKind = "tool" | "studio" | "skill" | "extra";

// The data file lists skills, web articles and resources under tools; they
// get their own sections here.
const KIND_BY_TOOL_CATEGORY = {
  Skills: "skill",
  Articles: "extra",
  Resources: "extra",
} as const satisfies Record<string, DirectoryKind>;

const toolsOfKind = (kind: DirectoryKind) =>
  directories.tools.entries.filter(
    (entry) =>
      (Object.entries(KIND_BY_TOOL_CATEGORY).find(
        ([name]) => name === entry.category
      )?.[1] ?? "tool") === kind
  );

// The data file lists every skill under "Skills"; their sub-category is picked
// here by id. A skill missing from this list stays under "All" only.
const SKILL_CATEGORY_BY_ID = {
  "oil-motion": "Motion graphics",
  "remotion-skills": "Motion graphics",
  "jacky-motion": "Motion graphics",
  "lemo-opuscar": "Motion graphics",
  "codex-whiteboard-video": "Motion graphics",
  cinetic: "Product films",
  "guizang-product-video": "Product films",
  "video-demo": "Product films",
  "video-production-skills": "AI video",
  "diffusion-studio-skills": "AI video",
  "shuohao-skills": "AI video",
  director: "AI video",
  "one-prompt-video": "AI video",
  "minimax-h3-video-reverse": "AI video",
  "huashu-art-motion": "Motion graphics",
  motionmaxxing: "Motion graphics",
  "product-launch-motion": "Product films",
  "motion-graphics-skills": "Motion graphics",
  "claude-motion-design": "Motion graphics",
  "herk-edit-kit": "AI video",
  "barty-motion-graphics": "Motion graphics",
  animate: "Motion graphics",
  "claude-motion": "Motion graphics",
  "claude-remotion-skill": "Motion graphics",
  "lottie-motion-design-skill": "Motion graphics",
  "gsap-skills": "Motion graphics",
  "hyperframes-community-skills": "Motion graphics",
  "awesome-ai-motion": "Motion graphics",
  "video-skills": "Product films",
  "motion-design-skills": "Motion graphics",
  "bang-motion": "Motion graphics",
  "opus-video-skills": "Motion graphics",
  "claude-animation": "Motion graphics",
  "remotion-workflow-skills": "Motion graphics",
  "remotion-brand-motion": "Motion graphics",
  "apple-motion-study": "Motion graphics",
  "kinetic-typography-skills": "Motion graphics",
  "motion-anything": "Motion graphics",
  "data-animation-skills": "Motion graphics",
  "explainer-video-skills": "Motion graphics",
  "javascript-animation-skills": "Motion graphics",
  "manim-animation-skills": "Motion graphics",
  "map-animation-skills": "Motion graphics",
  "webgl-animation-skills": "Motion graphics",
  "anything-to-explainer": "Motion graphics",
  "video-talkcraft": "Motion graphics",
  anidoodle: "Motion graphics",
  "motion-graphics-music-video": "Motion graphics",
  "claude-video-kit": "Motion graphics",
  "persian-motion-director": "Motion graphics",
  "mort1d-motion-graphics": "Motion graphics",
  "lemo-wake": "Motion graphics",
  "hyperframes-motion-reel": "Motion graphics",
  "motion-video-director": "Motion graphics",
  "papercut-explainer": "Motion graphics",
  "extreme-motion-design": "Motion graphics",
  mashhad: "Motion graphics",
  "video-shotcraft": "Product films",
  "agentic-product-demo": "Product films",
  "saas-motion-kit": "Product films",
  "brand-motion-design": "Product films",
  appshot: "Product films",
  "ai-promo-video-maker": "Product films",
  "ad-video-skills": "Product films",
  "e-commerce-video-skills": "Product films",
  "claude-youtube-editor": "AI video",
  "claude-faceless-shorts-creator": "AI video",
  "take-one": "AI video",
  openvideoharness: "AI video",
  "motion-design-for-agents": "AI video",
  "aiev-video-skills": "AI video",
  cutdirector: "AI video",
  "remotion-koubo-workflow": "AI video",
  "short-form-video-skills": "AI video",
  openmontage: "AI video",
  brag: "Product films",
  "diffusion-studio-lottie": "Motion graphics",
  "firered-openstoryline": "AI video",
  "chengfeng-videocut": "AI video",
  "narrator-ai": "AI video",
  pixel2motion: "Motion graphics",
  "claude-code-video-toolkit": "Motion graphics",
  "story-to-hand-drawn-video": "Motion graphics",
  "vox-director": "Motion graphics",
  "lanshu-ai-presenter": "AI video",
  "gbro-collage-b-roll": "Motion graphics",
  "vibe-motion-skills": "Motion graphics",
  "manim-skill": "Motion graphics",
  onetake: "Product films",
  cartcut: "AI video",
  "premiere-pro-mcp": "AI video",
  "live-panel": "Motion graphics",
  "video-recap-skills": "AI video",
  baocut: "AI video",
  "heygen-skills": "AI video",
  "hyperframes-motion-director": "Product films",
  "claude-animation-base": "Motion graphics",
  mathlens: "Motion graphics",
  explainroo: "Motion graphics",
  "agent-storyboard": "AI video",
  "image-story-video-wizard": "AI video",
  "hand-drawn-explainer": "Motion graphics",
  "xianxia-cinematic-director": "AI video",
  "vox-ai-motion-graphics": "Motion graphics",
  "claude-shorts": "AI video",
  "auto-video-agent": "AI video",
  "vox-collage-b-roll": "Motion graphics",
  "motion-video-kit": "Product films",
  "erduo-b-roll-engine": "AI video",
  "oh-my-cassette": "AI video",
  "director-skills": "AI video",
  "hbg-life-simulation": "AI video",
  "ai-video-editing-skill": "AI video",
  "naive-video-skill": "AI video",
  "avatar-mix": "AI video",
  easyedit: "AI video",
  "videodb-skills": "AI video",
  "claude-remotion-kickstart": "Motion graphics",
  seecut: "AI video",
  monet: "AI video",
  "remotion-ad-video": "Product films",
  "book-video-factory": "AI video",
  "promo-creator-skills": "Product films",
  "cut-video": "AI video",
  "adu-motion-video": "AI video",
  vex: "AI video",
  "motion-video-skill": "Product films",
  "after-effects-mcp": "Motion graphics",
  "remotion-motion-graphics-skill": "Motion graphics",
  "30x-video": "Product films",
  "ghost-editor": "AI video",
  brewreel: "Product films",
  "remotion-ads": "Product films",
  "unclejobs-motion-video": "Motion graphics",
  "gbro-collage-info": "Motion graphics",
  "remotion-claude-video": "Motion graphics",
  "vlog-cut": "AI video",
  "story-hand-drawn-video": "AI video",
  "code-video": "Product films",
  "blender-education-video": "Motion graphics",
  "knowledge-explainer": "Motion graphics",
  "typewriter-video": "Motion graphics",
  "remotion-video-director": "Product films",
  "video-clipforge": "AI video",
  reelmimic: "AI video",
  "zack-d-films-generator": "AI video",
  "vidmuse-video-creator": "AI video",
  "3brown1blue": "Motion graphics",
  "codex-video-short-maker": "AI video",
  "story-hand-drawn-remotion": "Motion graphics",
  "self-media-video-packaging": "AI video",
  "remotion-director": "Motion graphics",
  "paper-algorithm": "AI video",
  "video-vox": "Motion graphics",
  "jj-koubo": "AI video",
  "onboarding-video-generator": "Product films",
  "remotion-code-motion-explainer": "Motion graphics",
  "hbg-code-explainer": "Motion graphics",
  "paint-mv-skills": "Motion graphics",
  "product-demo-director": "Product films",
  ultrademo: "Product films",
  "react-bits-video": "Motion graphics",
  "reel-video": "AI video",
  "claude-gif": "Motion graphics",
  "remotion-guofeng-starter": "Motion graphics",
  voxstylehub: "Motion graphics",
  "ruic-motion-reel": "Motion graphics",
  montara: "AI video",
  aftr: "Motion graphics",
  lipnardo: "AI video",
  framewright: "Motion graphics",
  "purffle-shorts": "AI video",
  ccvideo: "Product films",
  "personal-ip-brand-intro": "Motion graphics",
} as const satisfies Record<string, string>;

const skillCategoryOf = (id: string): string | undefined =>
  Object.entries(SKILL_CATEGORY_BY_ID).find(([key]) => key === id)?.[1];

export const DIRECTORY_ENTRIES: Record<DirectoryKind, DirectoryEntry[]> = {
  tool: toolsOfKind("tool"),
  studio: directories.studios.entries,
  skill: toolsOfKind("skill").map((entry) => ({
    ...entry,
    category: skillCategoryOf(entry.id) ?? entry.category,
  })),
  // Articles first, newest first: X articles (`pnpm catalog:import:articles`)
  // and web articles (category "Articles" in the data file) together, then
  // the resources.
  extra: [
    ...[
      ...xArticles.entries,
      ...toolsOfKind("extra").filter((entry) => entry.category === "Articles"),
    ].toSorted((a, b) =>
      (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
    ),
    ...toolsOfKind("extra").filter((entry) => entry.category !== "Articles"),
  ],
};

// URL slugs for each section's category names; they match the chip labels.
// A new category stays under "All" until it gets a slug here.
const SLUG_BY_CATEGORY = {
  tool: { AI: "ai", Editor: "editors", Mockup: "mockups", Motion: "motion" },
  studio: { Studio: "studios", Designers: "designers" },
  skill: {
    "Motion graphics": "motion",
    "Product films": "product-films",
    "AI video": "ai-video",
  },
  extra: { Articles: "articles", Resources: "resources" },
} as const satisfies Record<DirectoryKind, Record<string, string>>;

type SlugMap = typeof SLUG_BY_CATEGORY;

/** A category's path segment in `kind`'s section, e.g. `ai` in `/tools/ai`. */
export type DirectorySlug<Kind extends DirectoryKind = DirectoryKind> = {
  [K in DirectoryKind]: SlugMap[K][keyof SlugMap[K]];
}[Kind];

export interface DirectoryCategory<Kind extends DirectoryKind = DirectoryKind> {
  /** Category name as imported, e.g. `Editor`. */
  id: string;
  /** Path segment, e.g. `editors` in `/tools/editors`. */
  slug: DirectorySlug<Kind>;
}

const toCategories = <Kind extends DirectoryKind>(
  kind: Kind
): DirectoryCategory<Kind>[] => {
  const slugs = new Map<string, string>(Object.entries(SLUG_BY_CATEGORY[kind]));
  return [
    ...new Set(DIRECTORY_ENTRIES[kind].map((entry) => entry.category)),
  ].flatMap((id) => {
    const slug = slugs.get(id);
    // SAFETY: `slugs` holds exactly SLUG_BY_CATEGORY[kind]'s values, which are
    // DirectorySlug<Kind> by definition.
    return slug ? [{ id, slug: slug as DirectorySlug<Kind> }] : [];
  });
};

// Chip order follows the first appearance of each category in the entries.
export const DIRECTORY_CATEGORIES = {
  tool: toCategories("tool"),
  studio: toCategories("studio"),
  skill: toCategories("skill"),
  extra: toCategories("extra"),
} satisfies {
  [K in DirectoryKind]: DirectoryCategory<K>[];
};

export const findDirectoryCategory = <Kind extends DirectoryKind>(
  kind: Kind,
  slug: string | undefined
): DirectoryCategory<Kind> | undefined =>
  // SAFETY: DIRECTORY_CATEGORIES is keyed by every DirectoryKind with that
  // kind's own category array, so indexing by `kind` yields exactly
  // DirectoryCategory<Kind>[].
  (DIRECTORY_CATEGORIES[kind] as DirectoryCategory<Kind>[]).find(
    (category) => category.slug === slug
  );

// English head tags for each category page (`/tools/ai`, `/skills/motion`…).
export const DIRECTORY_PAGES = {
  tool: {
    ai: {
      title: "AI video tools",
      description:
        "AI video generators, avatars, voiceovers, and AI-assisted editing tools for product films, curated by MotionVideo.",
    },
    editors: {
      title: "Video editors",
      description:
        "Video editors for product films, from browser-based editors to text-based and AI-assisted cutting, curated by MotionVideo.",
    },
    mockups: {
      title: "Mockup tools for product videos",
      description:
        "Device and UI mockup tools for product videos: cinematic screens and product shots for software, curated by MotionVideo.",
    },
    motion: {
      title: "Motion design tools",
      description:
        "Motion design tools and templates for launch videos, animated UI, and product films, curated by MotionVideo.",
    },
  },
  studio: {
    studios: {
      title: "Motion design studios",
      description:
        "Motion design studios that make product launch films and brand videos. Browse their work and visit their portfolios on MotionVideo.",
    },
    designers: {
      title: "Independent motion designers",
      description:
        "Independent motion designers who make product films and launch videos. Explore their portfolios and reach out directly on MotionVideo.",
    },
  },
  skill: {
    motion: {
      title: "Agent skills for motion graphics",
      description:
        "Open-source agent skills for code-rendered motion graphics: animated HTML, Remotion, and whiteboard videos your coding agent writes and renders, curated by MotionVideo.",
    },
    "product-films": {
      title: "Agent skills for product and launch films",
      description:
        "Open-source agent skills that direct product demos and launch films from your real product, curated by MotionVideo.",
    },
    "ai-video": {
      title: "Agent skills for AI video production",
      description:
        "Open-source agent skills for AI video production: scripts, generated footage, voiceovers, and editing from idea to final cut, curated by MotionVideo.",
    },
  },
  extra: {
    articles: {
      title: "X articles on motion video with Claude Opus",
      description:
        "Long-form X articles on making animation and motion videos with Claude Opus: workflows, prompts, and breakdowns from their creators, curated by MotionVideo.",
    },
    resources: {
      title: "Resources for motion video",
      description:
        "References and archives for making motion videos and product films, curated by MotionVideo.",
    },
  },
} satisfies {
  [K in DirectoryKind]: Record<
    DirectorySlug<K>,
    { title: string; description: string }
  >;
};
