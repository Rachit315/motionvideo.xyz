import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, count, desc, eq, ne, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";

import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { SPONSOR_ONCE_DAYS } from "@/constants/sponsors";
import type { SponsorTier } from "@/constants/sponsors";
import { sponsorCreativeSchema, sponsorDraftSchema } from "@/lib/sponsorships";

import { requireAdmin } from "./admin";
import { audienceStats } from "./audience";
import { getCurrentSession } from "./auth";
import { user } from "./db/schema";
import { sponsorships } from "./db/sponsorship-schema";
import { createSponsorCheckoutUrl, sponsorPortalUrl } from "./dodo";
import { sendEmail } from "./email";
import {
  diamondSoldOut,
  syncSponsorPayment,
  syncSponsorship,
} from "./sponsorships";

type SponsorshipRow = typeof sponsorships.$inferSelect;

const DAY = 24 * 60 * 60 * 1000;
/** Unpaid drafts cost nothing to make; capped per account. */
const MAX_DRAFTS = 10;
const idSchema = z.string().min(1).max(100);

export const getDiamondSoldOut = createServerFn({ method: "GET" }).handler(() =>
  diamondSoldOut()
);

/** Site traffic shown to prospective sponsors on /sponsor. */
export const getAudienceStats = createServerFn({ method: "GET" }).handler(() =>
  audienceStats()
);

const mySponsorshipColumns = {
  id: sponsorships.id,
  billing: sponsorships.billing,
  tier: sponsorships.tier,
  status: sponsorships.status,
  hasPortal: sql<boolean>`${sponsorships.customerId} is not null`,
  cancelAtPeriodEnd: sponsorships.cancelAtPeriodEnd,
  nextBillingAt: sponsorships.nextBillingAt,
  endsAt: sponsorships.endsAt,
  name: sponsorships.name,
  url: sponsorships.url,
  tagline: sponsorships.tagline,
  logo: sponsorships.logo,
  cover: sponsorships.cover,
  darkInvert: sponsorships.darkInvert,
  review: sponsorships.review,
  reviewNote: sponsorships.reviewNote,
};

/** A sponsorship as its owner sees it on /sponsorships. */
export type MySponsorship = {
  [
    K in Exclude<keyof typeof mySponsorshipColumns, "hasPortal">
  ]: SponsorshipRow[K];
} & { hasPortal: boolean };

// One-off runs report "expired" once their 30 days are over.
const withRunStatus = <Row extends MySponsorship>(row: Row): Row =>
  row.billing === "once" && row.endsAt && row.endsAt.getTime() <= Date.now()
    ? { ...row, status: "expired" }
    : row;

const requireSession = async () => {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};

/**
 * The signed-in user's sponsorships, newest first; `null` when signed out.
 * The `subscriptionId` or `paymentId` Dodo appends to the return URL is
 * synced before reading, so a new sponsorship shows as paid without waiting
 * for the webhook.
 */
export const getMySponsorships = createServerFn({ method: "GET" })
  .validator(
    z.object({
      subscriptionId: idSchema.optional(),
      paymentId: idSchema.optional(),
    })
  )
  .handler(async ({ data }) => {
    const session = await getCurrentSession();
    if (!session) {
      return null;
    }
    try {
      if (data.subscriptionId) {
        await syncSponsorship(data.subscriptionId);
      }
      if (data.paymentId) {
        await syncSponsorPayment(data.paymentId);
      }
    } catch (error) {
      // Unknown ids or a Dodo outage: the webhook catches up later.
      console.error("Sponsorship sync on return failed", error);
    }
    const rows: MySponsorship[] = await drizzle(env.DB)
      .select(mySponsorshipColumns)
      .from(sponsorships)
      .where(eq(sponsorships.userId, session.user.id))
      .orderBy(desc(sponsorships.createdAt));
    return {
      email: session.user.email,
      sponsorships: rows.map(withRunStatus),
    };
  });

/** Saving a draft can fail for reasons the form explains. */
export type SaveDraftResult =
  | { ok: true; id: string }
  | { ok: false; error: "sold-out" | "drafts" };

/**
 * Creates or edits an unpaid sponsorship draft: plan, billing and the
 * placement, all saved before checkout. Diamond is refused while its seats
 * are taken.
 */
export const saveSponsorDraft = createServerFn({ method: "POST" })
  .validator(sponsorDraftSchema)
  .handler(async ({ data }): Promise<SaveDraftResult> => {
    const session = await requireSession();
    if (data.tier === "diamond" && (await diamondSoldOut())) {
      return { ok: false, error: "sold-out" };
    }
    const db = drizzle(env.DB);
    const now = new Date();
    const fields = {
      tier: data.tier,
      billing: data.billing,
      name: data.name,
      url: data.url,
      tagline: data.tagline,
      logo: data.logo,
      cover: data.cover,
      darkInvert: data.darkInvert,
      updatedAt: now,
    };
    if (data.id) {
      const updated = await db
        .update(sponsorships)
        .set(fields)
        .where(
          and(
            eq(sponsorships.id, data.id),
            eq(sponsorships.userId, session.user.id),
            eq(sponsorships.status, "unpaid")
          )
        )
        .returning({ id: sponsorships.id });
      if (updated.length === 0) {
        throw new Error("Not an unpaid draft");
      }
      return { ok: true, id: data.id };
    }
    const [drafts] = await db
      .select({ total: count() })
      .from(sponsorships)
      .where(
        and(
          eq(sponsorships.userId, session.user.id),
          eq(sponsorships.status, "unpaid")
        )
      );
    if ((drafts?.total ?? 0) >= MAX_DRAFTS) {
      return { ok: false, error: "drafts" };
    }
    const id = crypto.randomUUID();
    await db
      .insert(sponsorships)
      .values({
        ...fields,
        id,
        userId: session.user.id,
        email: session.user.email,
        status: "unpaid",
        createdAt: now,
      })
      .run();
    return { ok: true, id };
  });

/** Dodo checkout for one of the user's unpaid drafts. */
export const startSponsorCheckout = createServerFn({ method: "POST" })
  .validator(z.object({ id: idSchema }))
  .handler(async ({ data }) => {
    const session = await requireSession();
    const [row] = await drizzle(env.DB)
      .select({
        tier: sponsorships.tier,
        billing: sponsorships.billing,
        status: sponsorships.status,
      })
      .from(sponsorships)
      .where(
        and(
          eq(sponsorships.id, data.id),
          eq(sponsorships.userId, session.user.id)
        )
      )
      .limit(1);
    if (!row || row.status !== "unpaid") {
      throw new Error("Not an unpaid draft");
    }
    return createSponsorCheckoutUrl(row.tier, row.billing, data.id, {
      email: session.user.email,
      userId: session.user.id,
    });
  });

/** Deletes one of the user's unpaid drafts. */
export const deleteSponsorDraft = createServerFn({ method: "POST" })
  .validator(z.object({ id: idSchema }))
  .handler(async ({ data }) => {
    const session = await requireSession();
    await drizzle(env.DB)
      .delete(sponsorships)
      .where(
        and(
          eq(sponsorships.id, data.id),
          eq(sponsorships.userId, session.user.id),
          eq(sponsorships.status, "unpaid")
        )
      )
      .run();
  });

// Throws unless the signed-in user owns this paid sponsorship.
const ownedPaidSponsorship = async (id: string) => {
  const session = await requireSession();
  const [row] = await drizzle(env.DB)
    .select()
    .from(sponsorships)
    .where(
      and(
        eq(sponsorships.id, id),
        eq(sponsorships.userId, session.user.id),
        ne(sponsorships.status, "unpaid")
      )
    )
    .limit(1);
  if (!row) {
    throw new Error("Not found");
  }
  return row;
};

/** Saves a paid sponsorship's placement and sends it to review. Owner only. */
export const saveSponsorCreative = createServerFn({ method: "POST" })
  .validator(sponsorCreativeSchema)
  .handler(async ({ data }) => {
    const row = await ownedPaidSponsorship(data.id);
    await drizzle(env.DB)
      .update(sponsorships)
      .set({
        name: data.name,
        url: data.url,
        tagline: data.tagline,
        logo: data.logo,
        cover: data.cover,
        darkInvert: data.darkInvert,
        review: "pending",
        reviewNote: null,
        updatedAt: new Date(),
      })
      .where(eq(sponsorships.id, row.id))
      .run();
  });

/** Dodo's billing portal for the sponsorship's customer. Owner only. */
export const getSponsorPortalUrl = createServerFn({ method: "POST" })
  .validator(z.object({ id: idSchema }))
  .handler(async ({ data }) => {
    const row = await ownedPaidSponsorship(data.id);
    if (!row.customerId) {
      throw new Error("Not paid through Dodo");
    }
    return sponsorPortalUrl(row.customerId);
  });

/** A sponsorship as the admin review queue sees it. */
export type AdminSponsorship = MySponsorship & {
  /** The email the sponsorship was paid with. */
  email: string;
  /** The owning account's email, once one is linked. */
  ownerEmail: string | null;
  updatedAt: Date;
};

/** Every paid sponsorship for /admin/sponsorships, pending review first. */
export const listSponsorships = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminSponsorship[]> => {
    await requireAdmin();
    const rows: AdminSponsorship[] = await drizzle(env.DB)
      .select({
        ...mySponsorshipColumns,
        email: sponsorships.email,
        ownerEmail: user.email,
        updatedAt: sponsorships.updatedAt,
      })
      .from(sponsorships)
      .leftJoin(user, eq(user.id, sponsorships.userId))
      .where(ne(sponsorships.status, "unpaid"))
      .orderBy(
        sql`case when ${sponsorships.review} = 'pending' then 0 else 1 end`,
        desc(sponsorships.updatedAt)
      );
    return rows.map(withRunStatus);
  }
);

const TIER_NAMES: Record<SponsorTier, string> = {
  diamond: "Diamond",
  gold: "Gold",
  silver: "Silver",
};

const reviewEmail = (
  row: SponsorshipRow,
  approved: boolean,
  note: string | undefined
) => {
  const placement = `${TIER_NAMES[row.tier]} sponsorship${row.name ? ` for ${row.name}` : ""}`;
  const manage = `${env.BETTER_AUTH_URL}${ROUTES.DASHBOARD_SPONSORSHIPS}`;
  const noteBlock = note ? `\n\nNote from the reviewer:\n${note}` : "";
  const runs =
    row.billing === "once"
      ? `for ${SPONSOR_ONCE_DAYS} days from today`
      : "while your subscription is active";
  return approved
    ? {
        subject: `Your ${SITE.NAME} sponsorship is live`,
        text: `Your ${placement} is approved. It shows on ${SITE.NAME} ${runs}.${noteBlock}\n\nManage it at ${manage}`,
      }
    : {
        subject: `Your ${SITE.NAME} sponsorship needs changes`,
        text: `Your ${placement} wasn't approved yet.${noteBlock}\n\nUpdate the placement at ${manage} and it goes back to review.`,
      };
};

/**
 * Approves or rejects a submitted creative and emails the sponsor. A one-off
 * run's 30 days start at its first approval.
 */
export const reviewSponsorship = createServerFn({ method: "POST" })
  .validator(
    z
      .object({
        id: idSchema,
        action: z.enum(["approve", "reject"]),
        note: z.string().trim().max(1000).optional(),
      })
      // Sponsors need to know what to change.
      .refine((data) => data.action === "approve" || Boolean(data.note), {
        path: ["note"],
        message: "Say what needs to change.",
      })
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = drizzle(env.DB);
    const [found] = await db
      .select({ row: sponsorships, ownerEmail: user.email })
      .from(sponsorships)
      .leftJoin(user, eq(user.id, sponsorships.userId))
      .where(eq(sponsorships.id, data.id))
      .limit(1);
    if (!found) {
      throw new Error("Not found");
    }
    if (found.row.review === "draft") {
      throw new Error("Nothing submitted to review yet");
    }
    const approved = data.action === "approve";
    const note = data.note || undefined;
    const startsRun =
      approved && found.row.billing === "once" && !found.row.endsAt;
    const endsAt = startsRun
      ? new Date(Date.now() + SPONSOR_ONCE_DAYS * DAY)
      : found.row.endsAt;
    await db
      .update(sponsorships)
      .set({
        review: approved ? "approved" : "rejected",
        reviewNote: note ?? null,
        endsAt,
        updatedAt: new Date(),
      })
      .where(eq(sponsorships.id, data.id))
      .run();
    try {
      await sendEmail({
        to: found.ownerEmail ?? found.row.email,
        ...reviewEmail(found.row, approved, note),
      });
    } catch (error) {
      // The decision is saved and shows on /sponsorships either way.
      console.error("Sponsorship review email failed", error);
    }
  });
