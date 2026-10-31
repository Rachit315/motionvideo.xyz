// Job board pricing. One payment lists a role for JOB_LISTING_DAYS from the
// day it is approved; there is no subscription and nothing renews.
export const JOB_LISTING_DAYS = 30;

export const JOB_PLANS = ["standard", "featured"] as const;
export type JobPlan = (typeof JOB_PLANS)[number];

/** USD per listing. Featured posts are pinned above the rest and shared on X. */
export const JOB_PLAN_USD: Record<JobPlan, number> = {
  standard: 99,
  featured: 199,
};

export const JOB_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "freelance",
] as const;
export type JobType = (typeof JOB_TYPES)[number];
