export interface MotionVideo {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  contentTags: string[];
  promptShared: boolean;
  handle: string;
  /** The creator's display name on X, when known. */
  creatorName?: string;
  avatar: string;
  poster: string;
  preview: string;
  video: string;
  width: number;
  height: number;
  prompt?: string;
  skillUrl?: string;
  /** The skills CLI command that installs it (`npx skills add …`). */
  skillInstall?: string;
  tweetUrl?: string;
  description?: string;
  /** How it was made, as the creator reported it. One of MOTION_MODELS. */
  model?: string;
  stack?: string;
  /** One of EFFORTS. */
  effort?: string;
  /** One of ITERATIONS. */
  iterations?: string;
}

// Reasoning effort the model ran at, and how many rounds of feedback the
// video took, as the creator reported them. Labels live in the gallery
// dictionary.
export const EFFORTS = ["medium", "high", "max"] as const;
export type Effort = (typeof EFFORTS)[number];
export const findEffort = (value: string | undefined) =>
  EFFORTS.find((effort) => effort === value);

export const ITERATIONS = ["one-shot", "few-rounds", "many-rounds"] as const;
export type Iterations = (typeof ITERATIONS)[number];
export const findIterations = (value: string | undefined) =>
  ITERATIONS.find((iterations) => iterations === value);

// Models creators reported making their videos with, as shown in the gallery.
// The URL carries a slug: `?model=opus-5-5` on Discover, or the
// `/model/opus-5-5` page.
export const MOTION_MODELS = [
  "Opus 5.5",
  "Fable 5.5",
  "Gemini 4 Argon",
  "GPT-6 Astra",
] as const;
export type MotionModel = (typeof MOTION_MODELS)[number];
/** Each model's full name, for page titles and copy. */
export const MOTION_MODEL_NAMES: Record<MotionModel, string> = {
  "Opus 5.5": "Claude Opus 5.5",
  "Fable 5.5": "Claude Fable 5.5",
  "Gemini 4 Argon": "Gemini 4 Argon",
  "GPT-6 Astra": "GPT-6 Astra",
};
export const motionModelSlug = (model: string) =>
  model.toLowerCase().replaceAll(/[^a-z\d]+/gu, "-");
export const findMotionModel = (slug: string | undefined) =>
  MOTION_MODELS.find((model) => motionModelSlug(model) === slug);

/** What a video shares to remake it: its prompt, or an agent skill. */
export const MOTION_TYPES = ["prompt", "skill"] as const;
export type MotionType = (typeof MOTION_TYPES)[number];
export const findMotionType = (value: string | undefined) =>
  MOTION_TYPES.find((type) => type === value);

export const MOTION_CATEGORIES = [
  "product-ui",
  "phone",
  "charts",
  "diagrams",
  "kinetic-type",
  "shapes",
  "particles",
  "characters",
  "photos",
  "music",
  "code",
] as const;

export type MotionCategory = (typeof MOTION_CATEGORIES)[number];

export const findMotionCategory = (value: string | undefined) =>
  MOTION_CATEGORIES.find((category) => category === value);

// Discover's filters are search params (`?type=prompt&model=opus-5-5`); each
// value also has its own page with that filter in the path.
export interface GallerySearch {
  type?: MotionType;
  /** A motionModelSlug. */
  model?: string;
  sort?: "newest" | "oldest";
}

export interface MotionFilters extends GallerySearch {
  category?: MotionCategory;
  q?: string;
}

/**
 * The page a gallery grid shows: Discover (undefined), or one filter fixed by
 * the path: `/category/$category`, `/model/$model` or `/type/$type`.
 */
export type GalleryScope =
  | { kind: "category"; category: MotionCategory }
  | { kind: "model"; model: MotionModel }
  | { kind: "type"; type: MotionType };

/** The filters a scope fixes, as MotionFilters. */
export const scopeFilters = (
  scope: GalleryScope | undefined
): MotionFilters => {
  switch (scope?.kind) {
    case "category": {
      return { category: scope.category };
    }
    case "model": {
      return { model: motionModelSlug(scope.model) };
    }
    case "type": {
      return { type: scope.type };
    }
    default: {
      return {};
    }
  }
};

export const filterMotionVideos = (
  videos: MotionVideo[],
  search: MotionFilters
): MotionVideo[] => {
  const words = search.q?.trim().toLowerCase().split(/\s+/u) ?? [];
  const filtered = videos.filter((video) => {
    if (search.type && !video.tags.includes(search.type)) {
      return false;
    }
    if (
      search.model &&
      (!video.model || motionModelSlug(video.model) !== search.model)
    ) {
      return false;
    }
    if (search.category && !video.contentTags.includes(search.category)) {
      return false;
    }
    const text = [
      video.title,
      video.handle,
      video.prompt ?? "",
      ...video.contentTags,
    ]
      .join(" ")
      .toLowerCase();
    return words.every((word) => text.includes(word));
  });
  if (search.sort) {
    const direction = search.sort === "newest" ? -1 : 1;
    filtered.sort((a, b) => direction * a.date.localeCompare(b.date));
  }
  return filtered;
};
