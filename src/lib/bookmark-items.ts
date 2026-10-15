import type { DirectoryKind } from "@/lib/directories";

// Matches the `kind` column in src/server/db/bookmark-schema.ts.
export const BOOKMARK_KINDS = [
  "video",
  "tool",
  "studio",
  "skill",
  "extra",
] as const satisfies readonly ("video" | DirectoryKind)[];

export type BookmarkKind = (typeof BOOKMARK_KINDS)[number];

/** A saved item: a gallery video slug or a directory entry id. */
export interface BookmarkRef {
  kind: BookmarkKind;
  id: string;
}

// Ids are only unique within a kind, so keys carry both.
export const bookmarkKey = (kind: BookmarkKind, id: string) => `${kind}:${id}`;
