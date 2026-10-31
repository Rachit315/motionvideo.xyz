import { createServerFn } from "@tanstack/react-start";

import catalog from "@/data/motion-catalog.json";
import type { MotionVideo } from "@/lib/motion-catalog";

/** What a card in the /sign-in feed shows. */
export type FeedVideo = Pick<
  MotionVideo,
  "slug" | "poster" | "preview" | "width" | "height"
>;

// Three columns of twelve: enough to fill a tall screen before a column
// repeats.
const FEED_SIZE = 36;

// The gallery's first videos, trimmed on the server so the sign-in page ships
// a few posters instead of the whole catalog.
export const getSignInFeed = createServerFn({ method: "GET" }).handler(
  (): FeedVideo[] =>
    catalog.videos
      .slice(0, FEED_SIZE)
      .map(({ slug, poster, preview, width, height }) => ({
        slug,
        poster,
        preview,
        width,
        height,
      }))
);
