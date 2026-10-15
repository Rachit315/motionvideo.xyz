import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./schema";

// One row per Dodo sponsor subscription. Billing fields mirror Dodo (re-read
// from the API on every webhook, so delivery order never matters); the
// creative fields are filled in by the sponsor on /sponsorships and only go
// live once `review` is "approved" while `status` is "active".
export const sponsorships = sqliteTable(
  "sponsorship",
  {
    subscriptionId: text("subscription_id").primaryKey(),
    // Null until a signed-in account with the paying email exists.
    userId: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    customerId: text("customer_id").notNull(),
    email: text("email").notNull(),
    // Matches SponsorTier in src/constants/sponsors.ts.
    tier: text("tier", { enum: ["diamond", "gold", "silver"] }).notNull(),
    // Dodo SubscriptionStatus.
    status: text("status", {
      enum: [
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
    // "draft": nothing submitted yet. Any creative edit returns to "pending".
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
  ]
);
