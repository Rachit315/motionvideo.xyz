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

// The data file lists skills and resources under tools; they get their own
// sections here.
const KIND_BY_TOOL_CATEGORY = {
  Skills: "skill",
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
  // X articles (`pnpm catalog:import:articles`) come before the resources.
  extra: [...xArticles.entries, ...toolsOfKind("extra")],
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
