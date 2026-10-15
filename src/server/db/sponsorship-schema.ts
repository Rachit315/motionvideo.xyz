import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { user } from "./schema";

// One row per sponsorship. The sponsor fills in the creative first (an
// "unpaid" draft), then pays: monthly as a Dodo subscription, or once for a
// 30-day run. Billing fields mirror Dodo (re-read from the API on every
// webhook, so delivery order never matters). A placement only goes live once
// `review` is "approved" while `status` is "active" (and, for one-off runs,
// before `endsAt`).
export const sponsorships = sqliteTable(
  "sponsorship",
  {
    id: text("id").primaryKey(),
    // Null only if the account is deleted after paying.
    userId: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    // Matches SponsorBilling in src/constants/sponsors.ts.
    billing: text("billing", { enum: ["monthly", "once"] })
      .notNull()
      .default("monthly"),
    // Monthly runs: the Dodo subscription. One-off runs: the Dodo payment.
    subscriptionId: text("subscription_id"),
    paymentId: text("payment_id"),
    // Null until paid.
    customerId: text("customer_id"),
    // The account's email until paid, then the email Dodo charged.
    email: text("email").notNull(),
    // Matches SponsorTier in src/constants/sponsors.ts.
    tier: text("tier", { enum: ["diamond", "gold", "silver"] }).notNull(),
    // "unpaid" before checkout completes, then Dodo's SubscriptionStatus.
    // One-off runs use "active" once paid and "cancelled" once refunded.
    status: text("status", {
      enum: [
        "unpaid",
        "pending",
        "active",
        "on_hold",
        "paused",
        "cancelled",
        "failed",
        "expired",
        "past_due",
      ],
    }).notNull(),
    cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" })
      .notNull()
      .default(false),
    nextBillingAt: integer("next_billing_at", { mode: "timestamp_ms" }),
    // One-off runs: 30 days from first approval; null until then.
    endsAt: integer("ends_at", { mode: "timestamp_ms" }),
    // Creative, set by the sponsor.
    name: text("name"),
    url: text("url"),
    tagline: text("tagline"),
    logo: text("logo"),
    cover: text("cover"),
    darkInvert: integer("dark_invert", { mode: "boolean" })
      .notNull()
      .default(false),
    // Gold and Silver placements: the section and category page they show on.
    categoryKind: text("category_kind", {
      enum: ["video", "tool", "studio", "skill", "extra"],
    }),
    category: text("category"),
    // "draft" until paid; payment and any later creative edit send it to
    // "pending" review.
    review: text("review", {
      enum: ["draft", "pending", "approved", "rejected"],
    })
      .notNull()
      .default("draft"),
    reviewNote: text("review_note"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("sponsorship_user_idx").on(table.userId),
    index("sponsorship_email_idx").on(table.email),
    uniqueIndex("sponsorship_subscription_idx").on(table.subscriptionId),
    uniqueIndex("sponsorship_payment_idx").on(table.paymentId),
  ]
);
