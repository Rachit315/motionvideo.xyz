import { z } from "zod";

export const INQUIRY_TYPES = [
  "General",
  "Purchase & billing",
  "Support",
  "Partnership",
  "Press",
  "Removal or credit",
] as const;

// Shared by the contact form (client-side check) and its server function.
export const contactSchema = z.object({
  email: z.email().max(254),
  inquiry: z.enum(INQUIRY_TYPES),
  message: z.string().trim().min(10).max(5000),
  name: z.string().trim().min(1).max(100),
  subject: z.string().trim().min(1).max(150),
  // Honeypot: hidden from people, filled in by naive bots.
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
