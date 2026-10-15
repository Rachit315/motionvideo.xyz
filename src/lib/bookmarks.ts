import { useSyncExternalStore } from "react";

import { bookmarkKey } from "@/lib/bookmark-items";
import type { BookmarkKind } from "@/lib/bookmark-items";
import { getBookmarks, setBookmark } from "@/server/bookmark-functions";

interface BookmarkState {
  /** Whose bookmarks these are; `null` while signed out. */
  userId: string | null;
  /** Saved items as `bookmarkKey`s. */
  keys: ReadonlySet<string>;
  /** The server list has arrived for `userId`. */
  loaded: boolean;
}

const SIGNED_OUT: BookmarkState = {
  userId: null,
  keys: new Set(),
  loaded: false,
};

// One shared store for every bookmark button on the page: the signed-in
// user's saved items, updated optimistically and reconciled with the server.
let state = SIGNED_OUT;
const listeners = new Set<() => void>();
// Writes the server has not confirmed yet, laid over a list that loads late.
const unconfirmed = new Map<string, boolean>();
// Writes for one item are sent in order, so the last click wins.
const queues = new Map<string, Promise<unknown>>();

const update = (next: BookmarkState) => {
  state = next;
  for (const listener of listeners) {
    listener();
  }
};

const withBookmark = (
  keys: ReadonlySet<string>,
  key: string,
  saved: boolean
) => {
  const next = new Set(keys);
  if (saved) {
    next.add(key);
  } else {
    next.delete(key);
  }
  return next;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useBookmarks = () =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => SIGNED_OUT
  );

/** Points the store at the current session's user, loading their list. */
export const syncBookmarks = async (userId: string | null) => {
  if (state.userId === userId) {
    return;
  }
  unconfirmed.clear();
  if (!userId) {
    update(SIGNED_OUT);
    return;
  }
  update({ userId, keys: new Set(), loaded: false });
  try {
    const list = await getBookmarks();
    if (state.userId !== userId) {
      return;
    }
    let keys: ReadonlySet<string> = new Set(
      list?.map(({ kind, id }) => bookmarkKey(kind, id))
    );
    for (const [key, saved] of unconfirmed) {
      keys = withBookmark(keys, key, saved);
    }
    update({ userId, keys, loaded: true });
  } catch {
    // Buttons stay usable (showing only this visit's saves); the list loads
    // again on the next sign-in.
  }
};

/** Flips one bookmark for the signed-in user, rolling back if the save fails. */
export const toggleBookmark = async (kind: BookmarkKind, id: string) => {
  const { userId } = state;
  if (!userId) {
    return;
  }
  const key = bookmarkKey(kind, id);
  const saved = !state.keys.has(key);
  unconfirmed.set(key, saved);
  update({ ...state, keys: withBookmark(state.keys, key, saved) });

  const previous = queues.get(key);
  const write = (async () => {
    try {
      await previous;
    } catch {
      // That click rolls itself back; this one still goes out.
    }
    await setBookmark({ data: { kind, id, saved } });
  })();
  queues.set(key, write);
  try {
    await write;
  } catch {
    // Only undo if no newer click for this item has replaced this one.
    if (state.userId === userId && unconfirmed.get(key) === saved) {
      update({ ...state, keys: withBookmark(state.keys, key, !saved) });
    }
  } finally {
    if (unconfirmed.get(key) === saved) {
      unconfirmed.delete(key);
    }
    if (queues.get(key) === write) {
      queues.delete(key);
    }
  }
};
