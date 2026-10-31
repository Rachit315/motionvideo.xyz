import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { user } from "./schema";

// One row per saved item. Items come from the static catalogs (gallery
// videos in `src/data/motion-catalog.json`, directory entries in
// `src/lib/directories.ts`), so there is no items table to reference.
export const bookmarks = sqliteTable(
  "bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // Matches BOOKMARK_KINDS in src/lib/bookmark-items.ts.
    kind: text("kind", {
      enum: ["video", "tool", "studio", "skill", "extra"],
    }).notNull(),
    // Video slug or directory entry id.
    itemId: text("item_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.kind, table.itemId] })]
);
