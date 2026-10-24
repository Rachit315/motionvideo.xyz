import { useMatches } from "@tanstack/react-router";
import { z } from "zod";

import { SPONSOR_BILLINGS, SPONSOR_TIERS } from "@/constants/sponsors";
import type { Sponsor } from "@/constants/sponsors";
import { publicUrlSchema } from "@/lib/community";
import { imageRefSchema } from "@/lib/uploads";

export const SPONSOR_NAME_MAX = 60;
export const SPONSOR_TAGLINE_MAX = 90;

const sponsorshipIdSchema = z.string().min(1).max(100);

// The placement a sponsor fills in. Every tier shows a card, so a cover is
// always required.
const creativeFields = {
  name: z.string().trim().min(1).max(SPONSOR_NAME_MAX),
  url: publicUrlSchema,
  tagline: z.string().trim().min(1).max(SPONSOR_TAGLINE_MAX),
  logo: imageRefSchema,
  cover: imageRefSchema,
  darkInvert: z.boolean(),
};

// A new or unpaid sponsorship on /sponsorships/new: plan, billing and the
// placement, saved before checkout. `id` edits an unpaid draft.
export const sponsorDraftSchema = z.object({
  id: sponsorshipIdSchema.optional(),
  tier: z.enum(SPONSOR_TIERS),
  billing: z.enum(SPONSOR_BILLINGS),
  ...creativeFields,
});

export type SponsorDraft = z.infer<typeof sponsorDraftSchema>;

// An edit to a paid sponsorship's placement on /sponsorships.
export const sponsorCreativeSchema = z.object({
  id: sponsorshipIdSchema,
  ...creativeFields,
});

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
