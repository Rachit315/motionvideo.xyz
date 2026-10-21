import { env } from "cloudflare:workers";
import { and, asc, count, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import { SPONSOR_SLOTS } from "@/constants/sponsors";
import type { Sponsor } from "@/constants/sponsors";

import { sponsorships } from "./db/sponsorship-schema";
import { getDodo, sponsorProductOf } from "./dodo";

// Server-only sponsorship logic shared by the webhook and the server
// functions. Kept out of sponsorship-functions.ts: a module the client imports
// may export only server functions, or its server imports leak into the
// client bundle.

/**
 * The sponsorship row a Dodo subscription or payment was bought for: the
 * `sponsorship_id` our checkout put in its metadata.
 */
const sponsorshipFor = async (id: string | undefined) => {
  if (!id) {
    return null;
  }
  const [row] = await drizzle(env.DB)
    .select()
    .from(sponsorships)
    .where(eq(sponsorships.id, id))
    .limit(1);
  return row ?? null;
};

/**
 * Mirrors one Dodo subscription (a monthly sponsorship) onto the draft named
 * in its metadata. State comes from the API, not the webhook payload, so
 * duplicate or out-of-order deliveries converge on Dodo's current state.
 * Non-sponsor products (the webhook is business-wide) are ignored. The first
 * active state sends the creative to review; a tier change sends an already
 * submitted creative back to review.
 */
export const syncSponsorship = async (subscriptionId: string) => {
  const subscription = await getDodo().subscriptions.retrieve(subscriptionId);
  const product = sponsorProductOf(subscription.product_id);
  if (product?.billing !== "monthly") {
    return;
  }
  const row = await sponsorshipFor(
    subscription.metadata.sponsorship_id?.toString()
  );
  if (!row) {
    return;
  }
  if (row.subscriptionId && row.subscriptionId !== subscriptionId) {
    // A second checkout for the same draft; it needs a manual refund.
    console.error(
      `Subscription ${subscriptionId} duplicates ${row.subscriptionId} for sponsorship ${row.id}`
    );
    return;
  }
  const { tier } = product;
  // Paying submits the creative; a plan change re-reviews a submitted one.
  let { review } = row;
  if (review === "draft" && subscription.status === "active") {
    review = "pending";
  } else if (review !== "draft" && row.tier !== tier) {
    review = "pending";
  }
  await drizzle(env.DB)
    .update(sponsorships)
    .set({
      subscriptionId,
      customerId: subscription.customer.customer_id,
      email: subscription.customer.email,
      tier,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_next_billing_date,
      nextBillingAt: new Date(subscription.next_billing_date),
      review,
      updatedAt: new Date(),
    })
    .where(eq(sponsorships.id, row.id))
    .run();
};

/**
 * Applies one Dodo payment for a one-off sponsorship to the draft named in
 * its metadata, the same way: a paid draft goes to review, a fully refunded
 * run is cancelled. Subscription payments and other products are ignored.
 */
export const syncSponsorPayment = async (paymentId: string) => {
  const payment = await getDodo().payments.retrieve(paymentId);
  const product = payment.product_cart
    ?.map((item) => sponsorProductOf(item.product_id))
    .find((match) => match?.billing === "once");
  if (!product) {
    return;
  }
  const row = await sponsorshipFor(payment.metadata.sponsorship_id?.toString());
  if (!row) {
    return;
  }
  if (row.paymentId && row.paymentId !== paymentId) {
    console.error(
      `Payment ${paymentId} duplicates ${row.paymentId} for sponsorship ${row.id}`
    );
    return;
  }
  const db = drizzle(env.DB);
  const now = new Date();
  if (payment.refund_status === "full") {
    await db
      .update(sponsorships)
      .set({ status: "cancelled", updatedAt: now })
      .where(eq(sponsorships.id, row.id))
      .run();
    return;
  }
  if (payment.status === "succeeded" && row.status === "unpaid") {
    await db
      .update(sponsorships)
      .set({
        paymentId,
        customerId: payment.customer.customer_id,
        email: payment.customer.email,
        // The tier actually paid for, whatever the draft said.
        tier: product.tier,
        status: "active",
        review: "pending",
        updatedAt: now,
      })
      .where(eq(sponsorships.id, row.id))
      .run();
  }
};

/** Approved creatives of running sponsorships: every live placement. */
export const liveSponsors = async (): Promise<Sponsor[]> => {
  const rows = await drizzle(env.DB)
    .select()
    .from(sponsorships)
    .where(
      and(
        eq(sponsorships.status, "active"),
        eq(sponsorships.review, "approved"),
        // One-off runs end at `endsAt`; monthly runs have none.
        or(isNull(sponsorships.endsAt), gt(sponsorships.endsAt, new Date()))
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
            darkInvert: row.darkInvert,
          },
        ]
      : []
  );
};

/**
 * Diamond is capped at SPONSOR_SLOTS seats: paid runs that are not over.
 * Subscriptions on hold keep their seat while the payment is retried.
 */
export const diamondSoldOut = async (): Promise<boolean> => {
  const [row] = await drizzle(env.DB)
    .select({ taken: count() })
    .from(sponsorships)
    .where(
      and(
        eq(sponsorships.tier, "diamond"),
        inArray(sponsorships.status, ["active", "on_hold"]),
        // One-off runs end at `endsAt`; monthly runs have none.
        or(isNull(sponsorships.endsAt), gt(sponsorships.endsAt, new Date()))
      )
    );
  return (row?.taken ?? 0) >= SPONSOR_SLOTS;
};
