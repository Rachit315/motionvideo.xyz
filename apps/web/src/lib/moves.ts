import moves from "@/data/moves.json";

// Moves: MotionVideo's own library of motion design techniques. Each move's
// public part (this module, shipped to the browser and indexed) explains what
// it is, when to use it and where it appears in the gallery. Its copy-ready
// prompt snippet is Pro-only: it lives in src/server/data/move-prompts.json
// and is only read by server functions after an access check.

export const MOVE_FAMILIES = [
  "timing",
  "type",
  "transitions",
  "ui",
  "vector",
  "generative",
  "camera",
  "texture",
  "data",
  "sound",
] as const;
export type MoveFamily = (typeof MOVE_FAMILIES)[number];

export interface Move {
  /** URL slug: `/moves/<slug>`. */
  slug: string;
  name: string;
  family: MoveFamily;
  /** Other names people search for. */
  aka: string[];
  /** One sentence: what it looks like. Used as the meta description. */
  summary: string;
  /** Markdown, ~100–200 words: how it reads, when it works, common mistakes. */
  body: string;
  /** Short "good for" tags, e.g. "logo stings", "counters". */
  goodFor: string[];
  /** Catalog video slugs (src/data/motion-catalog.json) that show this move. */
  examples: string[];
  /** Related move slugs. */
  related: string[];
}

// SAFETY: moves.json is ours and checked by scripts/check-moves.mjs (family in
// MOVE_FAMILIES, unique slugs, known examples and related slugs); JSON imports
// widen `family` to string.
export const MOVES: Move[] = moves.moves as Move[];

export const findMove = (slug: string | undefined) =>
  MOVES.find((move) => move.slug === slug);

export const findMoveFamily = (value: string | undefined) =>
  MOVE_FAMILIES.find((family) => family === value);

/** The Pro-only half of a move, served by `getMovePrompt` after an access check. */
export interface MovePrompt {
  slug: string;
  /** The copy-ready prompt snippet that asks an agent for this move. */
  prompt: string;
  /** Knobs worth naming in a prompt, e.g. "stagger 40–80 ms". */
  parameters: string[];
}
