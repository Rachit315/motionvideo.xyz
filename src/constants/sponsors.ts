export type SponsorTier = "diamond" | "gold" | "silver";

export interface Sponsor {
  name: string;
  tier: SponsorTier;
  url: string;
  /** Square mark, served from our domain (`public/sponsors/`). */
  logo: string;
  /** Card cover (OG image), mirrored to our R2 (`assets.motionvideo.xyz`). */
  cover: string;
  /** Dark-on-transparent mark: invert it so it reads on dark backgrounds. */
  darkInvert?: boolean;
}

// Active sponsors. Placements read from here: the header shows Diamond marks.
export const SPONSORS: readonly Sponsor[] = [
  {
    name: "Shadcn Labs",
    tier: "diamond",
    url: "https://www.shadcn-labs.com",
    logo: "/sponsors/shadcn-labs.svg",
    cover: "https://assets.motionvideo.xyz/sponsors/shadcn-537fcb5230.png",
    darkInvert: true,
  },
  {
    name: "Kobra",
    tier: "diamond",
    url: "https://kobra.systems/",
    logo: "/sponsors/kobra.png",
    cover: "https://assets.motionvideo.xyz/sponsors/kobra-49303ab0dc.png",
    darkInvert: true,
  },
];

/** Sponsor marks plus one open invite slot. */
export const SPONSOR_SLOTS = 3;
