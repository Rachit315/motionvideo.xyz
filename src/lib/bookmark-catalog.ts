import catalog from "@/data/motion-catalog.json";
import type { BookmarkKind } from "@/lib/bookmark-items";
import { DIRECTORY_ENTRIES } from "@/lib/directories";
import type { DirectoryEntry, DirectoryKind } from "@/lib/directories";
import type { MotionVideo } from "@/lib/motion-catalog";

// Kept apart from bookmark-items.ts so the bookmark store and buttons, which
// load on every page, don't pull the gallery catalog into the shared bundle.

export type BookmarkItem =
  | { kind: "video"; video: MotionVideo }
  | { kind: DirectoryKind; entry: DirectoryEntry };

const videos = new Map<string, MotionVideo>(
  catalog.videos.map((video) => [video.slug, video])
);

const byId = (list: DirectoryEntry[]) =>
  new Map(list.map((entry) => [entry.id, entry]));

const entries: Record<DirectoryKind, Map<string, DirectoryEntry>> = {
  tool: byId(DIRECTORY_ENTRIES.tool),
  studio: byId(DIRECTORY_ENTRIES.studio),
  skill: byId(DIRECTORY_ENTRIES.skill),
  extra: byId(DIRECTORY_ENTRIES.extra),
};

/** The catalog item a bookmark points at; `undefined` once it is removed. */
export const findBookmarkItem = (
  kind: BookmarkKind,
  id: string
): BookmarkItem | undefined => {
  if (kind === "video") {
    const video = videos.get(id);
    return video && { kind, video };
  }
  const entry = entries[kind].get(id);
  return entry && { kind, entry };
};
