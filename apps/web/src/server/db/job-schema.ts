import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./schema";

// One row per job listing on /jobs. The employer fills it in first ("draft"),
// pays once through Dodo ("pending" review), and it is listed from approval
// until `expiresAt`. Payment state is re-read from Dodo, never trusted from
// the client or a webhook payload.
export const jobPosts = sqliteTable(
  "job_post",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // Matches JobPlan in src/constants/jobs.ts.
    plan: text("plan", { enum: ["standard", "featured"] }).notNull(),
    status: text("status", {
      enum: ["draft", "pending", "approved", "rejected", "refunded"],
    })
      .notNull()
      .default("draft"),
    title: text("title").notNull(),
    company: text("company").notNull(),
    location: text("location").notNull(),
    remote: integer("remote", { mode: "boolean" }).notNull().default(false),
    // Matches JobType in src/constants/jobs.ts.
    type: text("type", {
      enum: ["full-time", "part-time", "contract", "freelance"],
    }).notNull(),
    salary: text("salary"),
    description: text("description").notNull(),
    applyUrl: text("apply_url").notNull(),
    logo: text("logo"),
    paymentId: text("payment_id"),
    paidAt: integer("paid_at", { mode: "timestamp_ms" }),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
    reviewNote: text("review_note"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("job_post_user_idx").on(table.userId),
    index("job_post_live_idx").on(table.status, table.expiresAt),
  ]
);
