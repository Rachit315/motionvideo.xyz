import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";

import { SITE } from "@/constants/site";
import type { SponsorTier } from "@/constants/sponsors";
import { sponsorCreativeSchema, tierNeedsCategory } from "@/lib/sponsorships";

import { requireAdmin } from "./admin";
import { getCurrentSession } from "./auth";
import { user } from "./db/schema";
import { sponsorships } from "./db/sponsorship-schema";
import { sponsorPortalUrl } from "./dodo";
import { sendEmail } from "./email";
import { diamondSoldOut, syncSponsorship } from "./sponsorships";

type SponsorshipRow = typeof sponsorships.$inferSelect;

const subscriptionIdSchema = z.string().min(1).max(100);

export const getDiamondSoldOut = createServerFn({ method: "GET" }).handler(() =>
  diamondSoldOut()
);

/** A sponsorship as its owner sees it on /sponsorships. */
export type MySponsorship = Omit<
  SponsorshipRow,
  "userId" | "customerId" | "email" | "createdAt" | "updatedAt"
>;

const mySponsorshipColumns = {
  subscriptionId: sponsorships.subscriptionId,
  tier: sponsorships.tier,
  status: sponsorships.status,
  cancelAtPeriodEnd: sponsorships.cancelAtPeriodEnd,
  nextBillingAt: sponsorships.nextBillingAt,
  name: sponsorships.name,
  url: sponsorships.url,
  tagline: sponsorships.tagline,
  logo: sponsorships.logo,
  cover: sponsorships.cover,
  darkInvert: sponsorships.darkInvert,
  categoryKind: sponsorships.categoryKind,
  category: sponsorships.category,
  review: sponsorships.review,
  reviewNote: sponsorships.reviewNote,
};

/**
 * The signed-in user's sponsorships, newest first; `null` when signed out.
 * Rows paid with the account's email are claimed first. `subscriptionId`
 * (from Dodo's return URL) is synced before reading, so the new subscription
 * shows without waiting for the webhook — but only if it belongs to this
 * account.
 */
export const getMySponsorships = createServerFn({ method: "GET" })
  .validator(z.object({ subscriptionId: subscriptionIdSchema.optional() }))
  .handler(async ({ data }) => {
    const session = await getCurrentSession();
    if (!session) {
      return null;
    }
    if (data.subscriptionId) {
      try {
        await syncSponsorship(data.subscriptionId);
      } catch (error) {
        // Unknown ids or a Dodo outage: the webhook catches up later.
        console.error("Sponsorship sync on return failed", error);
      }
    }
    const db = drizzle(env.DB);
    await db
      .update(sponsorships)
      .set({ userId: session.user.id })
      .where(
        and(
          isNull(sponsorships.userId),
          eq(
            sql`lower(${sponsorships.email})`,
            session.user.email.toLowerCase()
          )
        )
      )
      .run();
    const rows: MySponsorship[] = await db
      .select(mySponsorshipColumns)
      .from(sponsorships)
      .where(eq(sponsorships.userId, session.user.id))
      .orderBy(desc(sponsorships.createdAt));
    return { email: session.user.email, sponsorships: rows };
  });

// Throws unless the signed-in user owns the subscription.
const ownedSponsorship = async (subscriptionId: string) => {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const [row] = await drizzle(env.DB)
    .select()
    .from(sponsorships)
    .where(
      and(
        eq(sponsorships.subscriptionId, subscriptionId),
        eq(sponsorships.userId, session.user.id)
      )
    )
    .limit(1);
  if (!row) {
    throw new Error("Not found");
  }
  return row;
};

/** Saves the placement and sends it to review. Owner only. */
export const saveSponsorCreative = createServerFn({ method: "POST" })
  .validator(sponsorCreativeSchema)
  .handler(async ({ data }) => {
    const row = await ownedSponsorship(data.subscriptionId);
    if (tierNeedsCategory(row.tier) && !data.category) {
      throw new Error("A category is required for this tier");
    }
    await drizzle(env.DB)
      .update(sponsorships)
      .set({
        name: data.name,
        url: data.url,
        tagline: data.tagline,
        logo: data.logo,
        cover: data.cover,
        categoryKind: tierNeedsCategory(row.tier)
          ? (data.categoryKind ?? null)
          : null,
        category: tierNeedsCategory(row.tier) ? (data.category ?? null) : null,
        darkInvert: data.darkInvert,
        review: "pending",
        reviewNote: null,
        updatedAt: new Date(),
      })
      .where(eq(sponsorships.subscriptionId, row.subscriptionId))
      .run();
  });

/** Dodo's billing portal for the subscription's customer. Owner only. */
export const getSponsorPortalUrl = createServerFn({ method: "POST" })
  .validator(z.object({ subscriptionId: subscriptionIdSchema }))
  .handler(async ({ data }) => {
    const row = await ownedSponsorship(data.subscriptionId);
    return sponsorPortalUrl(row.customerId);
  });

/** A sponsorship as the admin review queue sees it. */
export interface AdminSponsorship extends MySponsorship {
  /** The email the subscription was paid with. */
  email: string;
  /** The owning account's email, once one is linked. */
  ownerEmail: string | null;
  updatedAt: Date;
}

/** Every sponsorship for /admin/sponsorships, pending review first. */
export const listSponsorships = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminSponsorship[]> => {
    await requireAdmin();
    return drizzle(env.DB)
      .select({
        ...mySponsorshipColumns,
        email: sponsorships.email,
        ownerEmail: user.email,
        updatedAt: sponsorships.updatedAt,
      })
      .from(sponsorships)
      .leftJoin(user, eq(user.id, sponsorships.userId))
      .orderBy(
        sql`case when ${sponsorships.review} = 'pending' then 0 else 1 end`,
        desc(sponsorships.updatedAt)
      );
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
  const manage = `${env.BETTER_AUTH_URL}/sponsorships`;
  const noteBlock = note ? `\n\nNote from the reviewer:\n${note}` : "";
  return approved
    ? {
        subject: `Your ${SITE.NAME} sponsorship is live`,
        text: `Your ${placement} is approved. It shows on ${SITE.NAME} while your subscription is active.${noteBlock}\n\nManage it at ${manage}`,
      }
    : {
        subject: `Your ${SITE.NAME} sponsorship needs changes`,
        text: `Your ${placement} wasn't approved yet.${noteBlock}\n\nUpdate the placement at ${manage} and it goes back to review.`,
      };
};

/** Approves or rejects a submitted creative and emails the sponsor. */
export const reviewSponsorship = createServerFn({ method: "POST" })
  .validator(
    z
      .object({
        subscriptionId: subscriptionIdSchema,
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
      .where(eq(sponsorships.subscriptionId, data.subscriptionId))
      .limit(1);
    if (!found) {
      throw new Error("Not found");
    }
    if (found.row.review === "draft") {
      throw new Error("Nothing submitted to review yet");
    }
    const approved = data.action === "approve";
    const note = data.note || undefined;
    await db
      .update(sponsorships)
      .set({
        review: approved ? "approved" : "rejected",
        reviewNote: note ?? null,
        updatedAt: new Date(),
      })
      .where(eq(sponsorships.subscriptionId, data.subscriptionId))
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
