import { z } from "zod";

import { JOB_PLANS, JOB_TYPES } from "@/constants/jobs";
import { publicUrlSchema } from "@/lib/community";
import { imageRefSchema } from "@/lib/uploads";

export const JOB_TITLE_MAX = 80;
export const JOB_COMPANY_MAX = 60;
export const JOB_LOCATION_MAX = 60;
export const JOB_SALARY_MAX = 40;
export const JOB_DESCRIPTION_MAX = 600;

// What an employer submits on /jobs/post. `id` is absent for a new post.
export const jobPostSchema = z.object({
  id: z.string().min(1).max(100).optional(),
  plan: z.enum(JOB_PLANS),
  title: z.string().trim().min(1).max(JOB_TITLE_MAX),
  company: z.string().trim().min(1).max(JOB_COMPANY_MAX),
  location: z.string().trim().min(1).max(JOB_LOCATION_MAX),
  remote: z.boolean(),
  type: z.enum(JOB_TYPES),
  salary: z.string().trim().max(JOB_SALARY_MAX).optional(),
  description: z.string().trim().min(1).max(JOB_DESCRIPTION_MAX),
  applyUrl: publicUrlSchema,
  logo: imageRefSchema.optional(),
});

export type JobPostInput = z.infer<typeof jobPostSchema>;
