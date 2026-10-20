import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";

import { findBookmarkItem } from "@/lib/bookmark-catalog";
import { BOOKMARK_KINDS } from "@/lib/bookmark-items";
import type { BookmarkRef } from "@/lib/bookmark-items";

import { getCurrentSession } from "./auth";
import { bookmarks } from "./db/bookmark-schema";

const bookmarkInput = z
  .object({
    kind: z.enum(BOOKMARK_KINDS),
    id: z.string().max(200),
    saved: z.boolean(),
  })
  .refine(({ kind, id }) => findBookmarkItem(kind, id), "Unknown item");

/** The signed-in user's bookmarks, newest first; `null` when signed out. */
export const getBookmarks = createServerFn({ method: "GET" }).handler(
  async (): Promise<BookmarkRef[] | null> => {
    const session = await getCurrentSession();
    if (!session) {
      return null;
    }
    const rows = await drizzle(env.DB)
      .select({ kind: bookmarks.kind, id: bookmarks.itemId })
      .from(bookmarks)
      .where(eq(bookmarks.userId, session.user.id))
      .orderBy(desc(bookmarks.createdAt))
      .all();
    // Items removed from the catalogs keep their rows but are not shown.
    return rows.filter((row) => findBookmarkItem(row.kind, row.id));
  }
);

/** Saves or removes one bookmark. Idempotent, so retries are safe. */
export const setBookmark = createServerFn({ method: "POST" })
  .validator(bookmarkInput)
  .handler(async ({ data }) => {
    const session = await getCurrentSession();
    if (!session) {
      throw new Error("Unauthorized");
    }
    const userId = session.user.id;
    const db = drizzle(env.DB);
    await (data.saved
      ? db
          .insert(bookmarks)
          .values({
            userId,
            kind: data.kind,
            itemId: data.id,
            createdAt: new Date(),
          })
          .onConflictDoNothing()
          .run()
      : db
          .delete(bookmarks)
          .where(
            and(
              eq(bookmarks.userId, userId),
              eq(bookmarks.kind, data.kind),
              eq(bookmarks.itemId, data.id)
            )
          )
          .run());
    return { saved: data.saved };
  });
