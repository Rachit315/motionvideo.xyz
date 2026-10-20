import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./schema";

// Site feedback from the footer and account-menu dialog; read at /admin/feedback.
export const feedback = sqliteTable(
  "feedback",
  {
    id: text("id").primaryKey(),
    // Matches FEEDBACK_MOODS in src/lib/feedback.ts; null when not picked.
    mood: text("mood", { enum: ["love", "okay", "bad"] }),
    message: text("message").notNull(),
    // Path the dialog was opened on, e.g. `/tools/ai`.
    page: text("page").notNull(),
    // The account email when signed in, else an optional reply address.
    email: text("email"),
    userId: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    resolvedAt: integer("resolved_at", { mode: "timestamp_ms" }),
  },
  (table) => [index("feedback_created_idx").on(table.createdAt)]
);
