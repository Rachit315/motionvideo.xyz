import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, desc, eq, gt, inArray, ne, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";

import { JOB_LISTING_DAYS } from "@/constants/jobs";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { jobPostSchema } from "@/lib/jobs";

import { requireAdmin } from "./admin";
import { getCurrentSession } from "./auth";
import { jobPosts } from "./db/job-schema";
import { user } from "./db/schema";
import { createJobCheckoutUrl } from "./dodo";
import { sendEmail } from "./email";
import { syncJobPayment } from "./jobs";

const DAY = 24 * 60 * 60 * 1000;
const idSchema = z.string().min(1).max(100);

const listingColumns = {
  id: jobPosts.id,
  plan: jobPosts.plan,
  title: jobPosts.title,
  company: jobPosts.company,
  location: jobPosts.location,
  remote: jobPosts.remote,
  type: jobPosts.type,
  salary: jobPosts.salary,
  description: jobPosts.description,
  applyUrl: jobPosts.applyUrl,
  logo: jobPosts.logo,
  publishedAt: jobPosts.publishedAt,
};

/** A live listing as /jobs shows it. */
export type JobListing = {
  [K in keyof typeof listingColumns]: (typeof jobPosts.$inferSelect)[K];
};

/** Approved, unexpired listings: featured first, then newest. */
export const getJobs = createServerFn({ method: "GET" }).handler(
  (): Promise<JobListing[]> =>
    drizzle(env.DB)
      .select(listingColumns)
      .from(jobPosts)
      .where(
        and(eq(jobPosts.status, "approved"), gt(jobPosts.expiresAt, new Date()))
      )
      .orderBy(
        sql`case when ${jobPosts.plan} = 'featured' then 0 else 1 end`,
        desc(jobPosts.publishedAt)
      )
);

const ownerColumns = {
  ...listingColumns,
  status: jobPosts.status,
  expiresAt: jobPosts.expiresAt,
  reviewNote: jobPosts.reviewNote,
};

type OwnerJobPost = {
  [K in keyof typeof ownerColumns]: (typeof jobPosts.$inferSelect)[K];
};

/** A post as its owner sees it on /jobs/post. */
export interface MyJobPost extends OwnerJobPost {
  /** Approved, but its listing period is over. */
  expired: boolean;
}

/**
 * The signed-in user's posts, newest first; `null` when signed out. A
 * `paymentId` from Dodo's return URL is synced first, so a paid post shows as
 * in review without waiting for the webhook.
 */
export const getMyJobPosts = createServerFn({ method: "GET" })
  .validator(z.object({ paymentId: idSchema.optional() }))
  .handler(async ({ data }) => {
    const session = await getCurrentSession();
    if (!session) {
      return null;
    }
    if (data.paymentId) {
      try {
        await syncJobPayment(data.paymentId);
      } catch (error) {
        // Unknown ids or a Dodo outage: the webhook catches up later.
        console.error("Job payment sync on return failed", error);
      }
    }
    const rows = await drizzle(env.DB)
      .select(ownerColumns)
      .from(jobPosts)
      .where(eq(jobPosts.userId, session.user.id))
      .orderBy(desc(jobPosts.createdAt));
    const now = Date.now();
    const posts: MyJobPost[] = rows.map((row) => ({
      ...row,
      expired:
        row.status === "approved" &&
        row.expiresAt !== null &&
        row.expiresAt.getTime() <= now,
    }));
    return { email: session.user.email, posts };
  });

const requireSession = async () => {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};

/** What saving a post returns: its id and whether it still needs paying. */
export interface SavedJobPost {
  id: string;
  status: "draft" | "pending";
}

/**
 * Creates a draft, or edits one of the user's posts. Only unpaid drafts and
 * posts sent back for changes are editable; a corrected post (already paid)
 * returns to review.
 */
export const saveJobPost = createServerFn({ method: "POST" })
  .validator(jobPostSchema)
  .handler(async ({ data }): Promise<SavedJobPost> => {
    const session = await requireSession();
    const db = drizzle(env.DB);
    const now = new Date();
    const fields = {
      title: data.title,
      company: data.company,
      location: data.location,
      remote: data.remote,
      type: data.type,
      salary: data.salary || null,
      description: data.description,
      applyUrl: data.applyUrl,
      logo: data.logo ?? null,
      updatedAt: now,
    };
    if (!data.id) {
      const id = crypto.randomUUID();
      await db
        .insert(jobPosts)
        .values({
          ...fields,
          id,
          userId: session.user.id,
          plan: data.plan,
          createdAt: now,
        })
        .run();
      return { id, status: "draft" };
    }
    const [row] = await db
      .select({ status: jobPosts.status })
      .from(jobPosts)
      .where(
        and(eq(jobPosts.id, data.id), eq(jobPosts.userId, session.user.id))
      )
      .limit(1);
    if (!row || (row.status !== "draft" && row.status !== "rejected")) {
      throw new Error("This post can't be edited");
    }
    const status = row.status === "draft" ? "draft" : "pending";
    const update: Partial<typeof jobPosts.$inferInsert> = {
      ...fields,
      status,
      reviewNote: null,
    };
    // The plan is chosen at payment; it can't change afterwards.
    if (row.status === "draft") {
      update.plan = data.plan;
    }
    await db.update(jobPosts).set(update).where(eq(jobPosts.id, data.id)).run();
    return { id: data.id, status };
  });

/** Dodo checkout for one of the user's unpaid drafts. */
export const startJobCheckout = createServerFn({ method: "POST" })
  .validator(z.object({ id: idSchema }))
  .handler(async ({ data }) => {
    const session = await requireSession();
    const [row] = await drizzle(env.DB)
      .select({ plan: jobPosts.plan, status: jobPosts.status })
      .from(jobPosts)
      .where(
        and(eq(jobPosts.id, data.id), eq(jobPosts.userId, session.user.id))
      )
      .limit(1);
    if (!row || row.status !== "draft") {
      throw new Error("Not an unpaid draft");
    }
    return createJobCheckoutUrl(row.plan, data.id, {
      email: session.user.email,
      userId: session.user.id,
    });
  });

/** A post as the admin review queue sees it. */
export interface AdminJobPost extends OwnerJobPost {
  ownerEmail: string;
  paymentId: string | null;
  updatedAt: Date;
}

/** Every paid post for /admin/jobs, waiting for review first. */
export const listJobPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminJobPost[]> => {
    await requireAdmin();
    return drizzle(env.DB)
      .select({
        ...ownerColumns,
        ownerEmail: user.email,
        paymentId: jobPosts.paymentId,
        updatedAt: jobPosts.updatedAt,
      })
      .from(jobPosts)
      .innerJoin(user, eq(user.id, jobPosts.userId))
      .where(ne(jobPosts.status, "draft"))
      .orderBy(
        sql`case when ${jobPosts.status} = 'pending' then 0 else 1 end`,
        desc(jobPosts.updatedAt)
      );
  }
);

/** Approves (listing it for JOB_LISTING_DAYS) or rejects a paid post. */
export const reviewJobPost = createServerFn({ method: "POST" })
  .validator(
    z
      .object({
        id: idSchema,
        action: z.enum(["approve", "reject"]),
        note: z.string().trim().max(1000).optional(),
      })
      // Employers need to know what to change.
      .refine((data) => data.action === "approve" || Boolean(data.note), {
        path: ["note"],
        message: "Say what needs to change.",
      })
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = drizzle(env.DB);
    const [found] = await db
      .select({ row: jobPosts, ownerEmail: user.email })
      .from(jobPosts)
      .innerJoin(user, eq(user.id, jobPosts.userId))
      .where(
        and(
          eq(jobPosts.id, data.id),
          inArray(jobPosts.status, ["pending", "approved", "rejected"])
        )
      )
      .limit(1);
    if (!found) {
      throw new Error("Not found");
    }
    const approved = data.action === "approve";
    const now = new Date();
    const note = data.note || null;
    // The listing period starts at first approval; re-approving a corrected
    // post keeps the original end date.
    const publishedAt = found.row.publishedAt ?? now;
    const expiresAt =
      found.row.expiresAt ?? new Date(now.getTime() + JOB_LISTING_DAYS * DAY);
    await db
      .update(jobPosts)
      .set(
        approved
          ? {
              status: "approved",
              publishedAt,
              expiresAt,
              reviewNote: note,
              updatedAt: now,
            }
          : { status: "rejected", reviewNote: note, updatedAt: now }
      )
      .where(eq(jobPosts.id, data.id))
      .run();
    const manage = `${env.BETTER_AUTH_URL}${ROUTES.JOBS_POST}`;
    const noteBlock = note ? `\n\nNote from the reviewer:\n${note}` : "";
    const role = `${found.row.title} at ${found.row.company}`;
    try {
      await sendEmail({
        to: found.ownerEmail,
        ...(approved
          ? {
              subject: `Your ${SITE.NAME} job post is live`,
              text: `${role} is now listed on ${env.BETTER_AUTH_URL}${ROUTES.JOBS} until ${expiresAt.toUTCString()}.${noteBlock}`,
            }
          : {
              subject: `Your ${SITE.NAME} job post needs changes`,
              text: `${role} wasn't approved yet.${noteBlock}\n\nUpdate it at ${manage} and it goes back to review.`,
            }),
      });
    } catch (error) {
      // The decision is saved and shows on /jobs/post either way.
      console.error("Job review email failed", error);
    }
  });
