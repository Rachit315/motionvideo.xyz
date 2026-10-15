import { useMatches } from "@tanstack/react-router";
import { z } from "zod";

import type {
  Sponsor,
  SponsorCategory,
  SponsorTier,
} from "@/constants/sponsors";
import {
  SUBMISSION_KINDS,
  findSubmissionCategory,
  publicUrlSchema,
} from "@/lib/community";
import { imageRefSchema } from "@/lib/uploads";

export const SPONSOR_NAME_MAX = 60;
export const SPONSOR_TAGLINE_MAX = 90;

/** Gold and Silver placements live on one category page. */
export const tierNeedsCategory = (tier: SponsorTier) => tier !== "diamond";

// What a sponsor submits on /sponsorships. Every tier shows a card, so a cover
// is always required; the category requirement (Gold and Silver) is checked
// against the subscription's tier on the server.
export const sponsorCreativeSchema = z
  .object({
    subscriptionId: z.string().min(1).max(100),
    name: z.string().trim().min(1).max(SPONSOR_NAME_MAX),
    url: publicUrlSchema,
    tagline: z.string().trim().min(1).max(SPONSOR_TAGLINE_MAX),
    logo: imageRefSchema,
    cover: imageRefSchema,
    categoryKind: z.enum(SUBMISSION_KINDS).optional(),
    category: z.string().max(40).optional(),
    darkInvert: z.boolean(),
  })
  .refine(
    (data) =>
      (data.categoryKind === undefined && data.category === undefined) ||
      (data.categoryKind !== undefined &&
        findSubmissionCategory(data.categoryKind, data.category) !== undefined),
    { path: ["category"], message: "Pick a category for this section." }
  );

export type SponsorCreative = z.infer<typeof sponsorCreativeSchema>;

export const sameCategory = (
  a: SponsorCategory | undefined,
  b: SponsorCategory | undefined
) =>
  a !== undefined && b !== undefined && a.kind === b.kind && a.slug === b.slug;

/**
 * Live sponsors from the nearest route loader that returns `getLandingData`,
 * so placements deep in a page need no props; none where no loader provides it.
 */
const NO_SPONSORS: readonly Sponsor[] = [];

export const useSponsors = (): readonly Sponsor[] =>
  useMatches({
    select: (matches) => {
      for (const { loaderData } of matches.toReversed()) {
        if (loaderData && "sponsors" in loaderData) {
          return loaderData.sponsors;
        }
      }
      return NO_SPONSORS;
    },
  });
