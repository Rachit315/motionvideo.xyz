import { useMatches } from "@tanstack/react-router";
import { z } from "zod";

import { SPONSOR_BILLINGS, SPONSOR_TIERS } from "@/constants/sponsors";
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

const sponsorshipIdSchema = z.string().min(1).max(100);

// The placement a sponsor fills in. Every tier shows a card, so a cover is
// always required.
const creativeFields = {
  name: z.string().trim().min(1).max(SPONSOR_NAME_MAX),
  url: publicUrlSchema,
  tagline: z.string().trim().min(1).max(SPONSOR_TAGLINE_MAX),
  logo: imageRefSchema,
  cover: imageRefSchema,
  categoryKind: z.enum(SUBMISSION_KINDS).optional(),
  category: z.string().max(40).optional(),
  darkInvert: z.boolean(),
};

const validCategory = (data: {
  categoryKind?: (typeof SUBMISSION_KINDS)[number];
  category?: string;
}) =>
  (data.categoryKind === undefined && data.category === undefined) ||
  (data.categoryKind !== undefined &&
    findSubmissionCategory(data.categoryKind, data.category) !== undefined);

const categoryIssue = {
  path: ["category"],
  message: "Pick a category for this section.",
};

// A new or unpaid sponsorship on /sponsorships/new: plan, billing and the
// placement, saved before checkout. `id` edits an unpaid draft.
export const sponsorDraftSchema = z
  .object({
    id: sponsorshipIdSchema.optional(),
    tier: z.enum(SPONSOR_TIERS),
    billing: z.enum(SPONSOR_BILLINGS),
    ...creativeFields,
  })
  .refine(validCategory, categoryIssue)
  .refine((data) => !tierNeedsCategory(data.tier) || Boolean(data.category), {
    path: ["category"],
    message: "Gold and Silver need a category.",
  });

export type SponsorDraft = z.infer<typeof sponsorDraftSchema>;

// An edit to a paid sponsorship's placement on /sponsorships; the category
// requirement is checked against the row's tier on the server.
export const sponsorCreativeSchema = z
  .object({ id: sponsorshipIdSchema, ...creativeFields })
  .refine(validCategory, categoryIssue);

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
