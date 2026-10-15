import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { count, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";

import { LINK } from "@/constants/links";
import { SITE } from "@/constants/site";
import { FEEDBACK_MOOD_LABELS, feedbackSchema } from "@/lib/feedback";
import type { FeedbackResult } from "@/lib/feedback";

import { requireAdmin } from "./admin";
import { getCurrentSession } from "./auth";
import { feedback } from "./db/feedback-schema";
import { sendEmail } from "./email";

/** One stored piece of feedback, as /admin/feedback lists it. */
export type FeedbackItem = typeof feedback.$inferSelect;

/** Stores one piece of feedback and pings the inbox. Open to everyone. */
export const sendFeedback = createServerFn({ method: "POST" })
  .validator(feedbackSchema)
  .handler(async ({ data }): Promise<FeedbackResult> => {
    const ip = getRequest().headers.get("cf-connecting-ip") ?? "unknown";
    const limit = await env.CONTACT_LIMITER?.limit({ key: ip });
    if (limit && !limit.success) {
      return { ok: false, error: "rate-limit" };
    }
    const session = await getCurrentSession();
    const email = session?.user.email ?? data.email ?? null;
    try {
      await drizzle(env.DB)
        .insert(feedback)
        .values({
          id: crypto.randomUUID(),
          mood: data.mood ?? null,
          message: data.message,
          page: data.page,
          email,
          userId: session?.user.id ?? null,
          createdAt: new Date(),
        })
        .run();
    } catch (error) {
      console.error("Storing feedback failed", error);
      return { ok: false, error: "storage" };
    }
    try {
      await sendEmail({
        to: LINK.EMAIL,
        replyTo: email ?? undefined,
        subject: `${SITE.NAME} feedback${data.mood ? ` (${FEEDBACK_MOOD_LABELS[data.mood]})` : ""}`,
        text: `Page: ${data.page}\nFrom: ${email ?? "anonymous"}\n\n${data.message}`,
      });
    } catch (error) {
      // Stored already; /admin/feedback still shows it.
      console.error("Feedback notification failed", error);
    }
    return { ok: true };
  });

const feedbackView = z.enum(["open", "resolved"]);

/** Feedback for /admin/feedback, newest first, with open/resolved counts. */
export const listFeedback = createServerFn({ method: "GET" })
  .validator(z.object({ view: feedbackView }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = drizzle(env.DB);
    const [items, [open], [resolved]] = await Promise.all([
      db
        .select()
        .from(feedback)
        .where(
          data.view === "open"
            ? isNull(feedback.resolvedAt)
            : isNotNull(feedback.resolvedAt)
        )
        .orderBy(desc(feedback.createdAt))
        .limit(200),
      db
        .select({ total: count() })
        .from(feedback)
        .where(isNull(feedback.resolvedAt)),
      db
        .select({ total: count() })
        .from(feedback)
        .where(isNotNull(feedback.resolvedAt)),
    ]);
    return {
      items,
      counts: { open: open?.total ?? 0, resolved: resolved?.total ?? 0 },
    };
  });

/** Marks feedback handled, or reopens it. */
export const resolveFeedback = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1), resolved: z.boolean() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await drizzle(env.DB)
      .update(feedback)
      .set({ resolvedAt: data.resolved ? new Date() : null })
      .where(eq(feedback.id, data.id))
      .run();
  });
