import { env } from "cloudflare:workers";
import { and, asc, count, eq, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import { SPONSOR_SLOTS } from "@/constants/sponsors";
import type { Sponsor } from "@/constants/sponsors";

import { user } from "./db/schema";
import { sponsorships } from "./db/sponsorship-schema";
import { getDodo, sponsorTierOf } from "./dodo";

// Server-only sponsorship logic shared by the webhook, /checkout and the
// server functions. Kept out of sponsorship-functions.ts: a module the client
// imports may export only server functions, or its server imports leak into
// the client bundle.
// The account a subscription belongs to: the `user_id` checkout put in its
// metadata while that account exists, else the account with the paying email.
const ownerOf = async (
  db: DrizzleD1Database,
  metadataUserId: string | undefined,
  email: string
): Promise<string | null> => {
  if (metadataUserId) {
    const [byId] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, metadataUserId))
      .limit(1);
    if (byId) {
      return byId.id;
    }
  }
  const [byEmail] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(sql`lower(${user.email})`, email.toLowerCase()))
    .limit(1);
  return byEmail?.id ?? null;
};

/**
 * Mirrors one Dodo subscription into the `sponsorship` table. The state comes
 * from the API, not the webhook payload, so duplicate or out-of-order
 * deliveries converge on Dodo's current state. Non-sponsor products (the
 * business's other brands share the webhook) are ignored. Creative fields are
 * never touched; a tier change sends a submitted creative back to review.
 */
export const syncSponsorship = async (subscriptionId: string) => {
  const subscription = await getDodo().subscriptions.retrieve(subscriptionId);
  const tier = sponsorTierOf(subscription.product_id);
  if (!tier) {
    return;
  }
  const db = drizzle(env.DB);
  const userId = await ownerOf(
    db,
    // Absent unless our checkout created the subscription.
    subscription.metadata.user_id?.toString(),
    subscription.customer.email
  );
  const now = new Date();
  const billing = {
    customerId: subscription.customer.customer_id,
    email: subscription.customer.email,
    tier,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_next_billing_date,
    nextBillingAt: new Date(subscription.next_billing_date),
    updatedAt: now,
  };
  await db
    .insert(sponsorships)
    .values({
      ...billing,
      subscriptionId: subscription.subscription_id,
      userId,
      createdAt: now,
    })
    .onConflictDoUpdate({
      target: sponsorships.subscriptionId,
      set: {
        ...billing,
        // An account claimed earlier stays attached when no owner is found now.
        userId: sql`coalesce(${userId}, ${sponsorships.userId})`,
        review: sql`case when ${sponsorships.tier} <> ${tier} and ${sponsorships.review} <> 'draft' then 'pending' else ${sponsorships.review} end`,
      },
    })
    .run();
};

/** Approved creatives of active subscriptions: every live placement. */
export const liveSponsors = async (): Promise<Sponsor[]> => {
  const rows = await drizzle(env.DB)
    .select()
    .from(sponsorships)
    .where(
      and(
        eq(sponsorships.status, "active"),
        eq(sponsorships.review, "approved")
      )
    )
    .orderBy(asc(sponsorships.createdAt));
  return rows.flatMap((row): Sponsor[] =>
    row.name && row.url && row.logo
      ? [
          {
            name: row.name,
            tier: row.tier,
            url: row.url,
            logo: row.logo,
            cover: row.cover,
            tagline: row.tagline ?? undefined,
            category:
              row.categoryKind && row.category
                ? { kind: row.categoryKind, slug: row.category }
                : undefined,
            darkInvert: row.darkInvert,
          },
        ]
      : []
  );
};

/**
 * Diamond is capped at SPONSOR_SLOTS seats. Subscriptions on hold keep their
 * seat while the payment is retried.
 */
export const diamondSoldOut = async (): Promise<boolean> => {
  const [row] = await drizzle(env.DB)
    .select({ taken: count() })
    .from(sponsorships)
    .where(
      and(
        eq(sponsorships.tier, "diamond"),
        inArray(sponsorships.status, ["active", "on_hold"])
      )
    );
  return (row?.taken ?? 0) >= SPONSOR_SLOTS;
};
