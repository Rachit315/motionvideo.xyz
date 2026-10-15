import type { SubmissionKind } from "@/lib/community";

export const SPONSOR_TIERS = ["diamond", "gold", "silver"] as const;

export type SponsorTier = (typeof SPONSOR_TIERS)[number];

/** A section and one of its category slugs, e.g. `{ kind: "tool", slug: "ai" }`. */
export interface SponsorCategory {
  kind: SubmissionKind;
  slug: string;
}

export interface Sponsor {
  name: string;
  tier: SponsorTier;
  url: string;
  /** Square mark: our domain (`public/sponsors/`) or the sponsor's HTTPS URL. */
  logo: string;
  /** Cover of the sponsored grid card (every tier). */
  cover: string | null;
  tagline?: string;
  /** Gold and Silver: the category page the placement shows on. */
  category?: SponsorCategory;
  /** Dark-on-transparent mark: invert it so it reads on dark backgrounds. */
  darkInvert?: boolean;
}

/**
 * A founding sponsor: credited on /sponsor, and shown in the sponsored grid
 * card only while no Diamond sponsor is live. Never in the sponsor slots.
 */
export type FoundingSponsor = Pick<
  Sponsor,
  "name" | "url" | "logo" | "cover" | "tagline" | "darkInvert"
>;

// Partners from the start. They are thanked on /sponsor and take no Diamond
// seat; until a Diamond sponsor is live they fill the sponsored grid card.
export const FOUNDING_SPONSORS: readonly FoundingSponsor[] = [
  {
    name: "Shadcn Labs",
    url: "https://www.shadcn-labs.com",
    logo: "/sponsors/shadcn-labs.svg",
    cover: "https://assets.motionvideo.xyz/sponsors/shadcn-537fcb5230.png",
    darkInvert: true,
  },
  {
    name: "Kobra",
    url: "https://kobra.systems/",
    logo: "/sponsors/kobra.png",
    cover: "https://assets.motionvideo.xyz/sponsors/kobra-49303ab0dc.png",
    darkInvert: true,
  },
];

/** Diamond seats: the header shows this many marks or open invite slots. */
export const SPONSOR_SLOTS = 3;
