import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";

import { ROUTES } from "@/constants/routes";
import catalog from "@/data/motion-catalog.json";
import { SUBMISSION_STATUSES } from "@/lib/community";
import type { SubmissionKind, SubmissionStatus } from "@/lib/community";
import { DIRECTORY_ENTRIES } from "@/lib/directories";

import { requireAdmin } from "./admin";
import { communitySubmissions } from "./db/community-schema";
import { sendEmail } from "./email";

const videoSlugs = new Set(catalog.videos.map((video) => video.slug));

/** A submission as moderators see it, contact details included. */
export interface AdminSubmission {
  id: string;
  kind: SubmissionKind;
  category: string | null;
  name: string;
  email: string;
  title: string;
  url: string;
  description: string;
  prompt: string | null;
  status: SubmissionStatus;
  featuredItemId: string | null;
  createdAt: Date;
  reviewedAt: Date | null;
}

const adminColumns = {
  id: communitySubmissions.id,
  kind: communitySubmissions.kind,
  category: communitySubmissions.category,
  name: communitySubmissions.name,
  email: communitySubmissions.email,
  title: communitySubmissions.title,
  url: communitySubmissions.url,
  description: communitySubmissions.description,
  prompt: communitySubmissions.prompt,
  status: communitySubmissions.status,
  featuredItemId: communitySubmissions.featuredItemId,
  createdAt: communitySubmissions.createdAt,
  reviewedAt: communitySubmissions.reviewedAt,
};

/** Submissions with `status`, newest first, plus the count per status. */
export const listSubmissions = createServerFn({ method: "GET" })
  .validator(z.object({ status: z.enum(SUBMISSION_STATUSES).optional() }))
  .handler(
    async ({
      data,
    }): Promise<{
      submissions: AdminSubmission[];
      counts: Record<SubmissionStatus, number>;
    }> => {
      await requireAdmin();
      const db = drizzle(env.DB);
      const [submissions, totals] = await Promise.all([
        db
          .select(adminColumns)
          .from(communitySubmissions)
          .where(
            data.status
              ? eq(communitySubmissions.status, data.status)
              : undefined
          )
          .orderBy(desc(communitySubmissions.createdAt)),
        db
          .select({ status: communitySubmissions.status, total: count() })
          .from(communitySubmissions)
          .groupBy(communitySubmissions.status),
      ]);
      const counts: Record<SubmissionStatus, number> = {
        pending: 0,
        featured: 0,
        declined: 0,
      };
      for (const { status, total } of totals) {
        counts[status] = total;
      }
      return { submissions, counts };
    }
  );

const reviewInput = z.discriminatedUnion("action", [
  z.object({
    id: z.string().min(1),
    action: z.literal("feature"),
    itemId: z.string().trim().min(1).max(200),
  }),
  z.object({ id: z.string().min(1), action: z.enum(["decline", "reset"]) }),
]);

/** Features (as an existing catalog item), declines, or reopens a submission. */
export const reviewSubmission = createServerFn({ method: "POST" })
  .validator(reviewInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = drizzle(env.DB);
    const [submission] = await db
      .select({
        kind: communitySubmissions.kind,
        name: communitySubmissions.name,
        email: communitySubmissions.email,
        title: communitySubmissions.title,
      })
      .from(communitySubmissions)
      .where(eq(communitySubmissions.id, data.id));
    if (!submission) {
      throw new Error("Submission not found");
    }

    if (data.action === "feature") {
      // A submission can only be featured as an item of its own kind.
      const exists =
        submission.kind === "video"
          ? videoSlugs.has(data.itemId)
          : DIRECTORY_ENTRIES[submission.kind].some(
              (entry) => entry.id === data.itemId
            );
      if (!exists) {
        throw new Error(`No ${submission.kind} with id "${data.itemId}"`);
      }
      await db
        .update(communitySubmissions)
        .set({
          status: "featured",
          featuredItemId: data.itemId,
          reviewedAt: new Date(),
        })
        .where(eq(communitySubmissions.id, data.id))
        .run();
      // The review stands even when the notification can't be sent.
      try {
        await sendEmail({
          to: submission.email,
          subject: "Your submission is featured on MotionVideo",
          text: [
            `Hi ${submission.name},`,
            "",
            `"${submission.title}" is now featured on MotionVideo, credited to you.`,
            "",
            `See it here: ${env.BETTER_AUTH_URL}${ROUTES.DASHBOARD_FEATURED}`,
            "",
            "Thanks for sharing your work.",
          ].join("\n"),
        });
      } catch (error) {
        console.error("Featured notification failed", error);
      }
      return;
    }

    await db
      .update(communitySubmissions)
      .set(
        data.action === "decline"
          ? { status: "declined", featuredItemId: null, reviewedAt: new Date() }
          : { status: "pending", featuredItemId: null, reviewedAt: null }
      )
      .where(eq(communitySubmissions.id, data.id))
      .run();
  });
