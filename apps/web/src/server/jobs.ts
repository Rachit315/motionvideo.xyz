import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import { jobPosts } from "./db/job-schema";
import { getDodo, jobPlanOf } from "./dodo";

// Server-only job board logic shared by the webhook and the server functions
// (kept out of job-functions.ts so its server imports never reach the client).

/**
 * Applies one Dodo payment to the job post named in its metadata. State comes
 * from the API, not a webhook payload, so redeliveries and out-of-order events
 * converge. A paid draft moves to review; a fully refunded post is pulled.
 * Payments for other products (the webhook is business-wide) are ignored.
 */
export const syncJobPayment = async (paymentId: string) => {
  const payment = await getDodo().payments.retrieve(paymentId);
  const plan = payment.product_cart
    ?.map((item) => jobPlanOf(item.product_id))
    .find(Boolean);
  const jobId = payment.metadata.job_id?.toString();
  if (!plan || !jobId) {
    return;
  }
  const db = drizzle(env.DB);
  const [row] = await db
    .select({ status: jobPosts.status })
    .from(jobPosts)
    .where(eq(jobPosts.id, jobId))
    .limit(1);
  if (!row) {
    return;
  }
  const now = new Date();
  if (payment.refund_status === "full") {
    await db
      .update(jobPosts)
      .set({ status: "refunded", updatedAt: now })
      .where(eq(jobPosts.id, jobId))
      .run();
    return;
  }
  if (payment.status === "succeeded" && row.status === "draft") {
    await db
      .update(jobPosts)
      .set({
        // The plan actually paid for, whatever the draft said.
        plan,
        status: "pending",
        paymentId: payment.payment_id,
        paidAt: now,
        updatedAt: now,
      })
      .where(eq(jobPosts.id, jobId))
      .run();
  }
};
