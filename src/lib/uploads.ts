import { z } from "zod";

import { publicUrlSchema } from "@/lib/community";

// Images uploaded through /api/upload are stored in R2 under uploads/. In
// production forms store the public URL on assets.motionvideo.xyz; locally and
// on previews, the same-origin /uploads/… path the Worker serves.
export const UPLOAD_PATH_PREFIX = "/uploads/";

export const UPLOAD_PURPOSES = ["logo", "cover"] as const;
export type UploadPurpose = (typeof UPLOAD_PURPOSES)[number];

/** Largest accepted file per purpose, in bytes. */
export const UPLOAD_MAX_BYTES: Record<UploadPurpose, number> = {
  logo: 2 * 1024 * 1024,
  cover: 5 * 1024 * 1024,
};

/** A path returned by /api/upload. */
export const uploadPathSchema = z
  .string()
  .regex(/^\/uploads\/(?:logo|cover)\/[a-f0-9-]{36}\.(?:png|jpg|webp)$/u);

/** An image field: an uploaded file, or a public HTTPS URL. */
export const imageRefSchema = z.union([uploadPathSchema, publicUrlSchema]);
