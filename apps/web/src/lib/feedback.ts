import { z } from "zod";

export const FEEDBACK_MOODS = ["love", "okay", "bad"] as const;
export type FeedbackMood = (typeof FEEDBACK_MOODS)[number];

/** English labels for the inbox email and /admin/feedback. */
export const FEEDBACK_MOOD_LABELS: Record<FeedbackMood, string> = {
  love: "Love it",
  okay: "It's okay",
  bad: "Not great",
};

export const FEEDBACK_MAX = 2000;

// Shared by the feedback dialog (client-side check) and its server function.
export const feedbackSchema = z.object({
  mood: z.enum(FEEDBACK_MOODS).optional(),
  message: z.string().trim().min(3).max(FEEDBACK_MAX),
  page: z.string().startsWith("/").max(500),
  // Only asked for while signed out; signed-in feedback uses the account email.
  email: z.email().max(254).optional(),
  // Honeypot: hidden from people, filled in by naive bots.
  website: z.string().max(0).optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type FeedbackResult =
  | { ok: true }
  | { ok: false; error: "rate-limit" | "storage" };
