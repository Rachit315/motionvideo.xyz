import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import type { FeedVideo } from "@/server/sign-in-functions";

// Each column drifts at its own pace, the middle one downwards, so the cards
// never line up across columns. `phase` starts a column part-way through its
// loop.
const COLUMNS = [
  { duration: 90_000, direction: "normal", phase: 0 },
  { duration: 120_000, direction: "reverse", phase: 0 },
  { duration: 105_000, direction: "normal", phase: 0.4 },
] as const satisfies readonly {
  duration: number;
  direction: PlaybackDirection;
  phase: number;
}[];

// Tall phone-format videos would fill a whole column; past this they crop.
const MIN_ASPECT = 0.8;

const play = async (video: HTMLVideoElement) => {
  try {
    await video.play();
  } catch {
    // Autoplay can be denied; the poster stays.
  }
};

const FeedCard = ({ video }: { video: FeedVideo }) => (
  // Bottom padding rather than a flex gap: each half of a track is then
  // exactly half its height, so the -50% loop is seamless.
  <div className="pb-3">
    <div
      className="bg-muted shadow-outline overflow-hidden rounded-xl"
      style={{
        aspectRatio: String(Math.max(video.width / video.height, MIN_ASPECT)),
      }}
    >
      {/* Decorative muted preview; its source loads once it scrolls into view. */}
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        data-preview={video.preview}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        className="size-full object-cover"
      />
    </div>
  </div>
);

/**
 * The /sign-in showcase: gallery videos in columns that scroll on their own,
 * fading out at the top and bottom. Previews play only while on screen,
 * everything stops while the tab is hidden, and reduced motion leaves still
 * posters.
 */
export const SignInFeed = ({ videos }: { videos: FeedVideo[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const columns = COLUMNS.map((_, column) =>
    videos.filter((__, index) => index % COLUMNS.length === column)
  );

  // One observer and one set of listeners for the whole feed, rather than one
  // per card: the tracks hold every card twice.
  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const scrolls = [
      ...root.querySelectorAll<HTMLElement>("[data-feed-track]"),
    ].map((track, index) => {
      const column = COLUMNS[index % COLUMNS.length];
      return track.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(-50%)" }],
        {
          duration: column.duration,
          direction: column.direction,
          iterationStart: column.phase,
          iterations: Infinity,
        }
      );
    });
    const previews = [...root.querySelectorAll("video")];
    const visible = new Set<Element>();

    const update = () => {
      const running = !reducedMotion.matches && !document.hidden;
      for (const scroll of scrolls) {
        if (running) {
          scroll.play();
        } else {
          scroll.pause();
        }
      }
      for (const preview of previews) {
        if (running && visible.has(preview)) {
          if (!preview.getAttribute("src") && preview.dataset.preview) {
            preview.src = preview.dataset.preview;
          }
          if (preview.paused) {
            void play(preview);
          }
        } else {
          preview.pause();
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target);
          } else {
            visible.delete(entry.target);
          }
        }
        update();
      },
      { root, threshold: 0.1 }
    );
    for (const preview of previews) {
      observer.observe(preview);
    }
    update();
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      for (const scroll of scrolls) {
        scroll.cancel();
      }
      for (const preview of previews) {
        preview.pause();
      }
    };
    // Runs once: the videos come from the page loader and never change while
    // the feed is mounted, and the DOM they render is what it reads.
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="flex size-full gap-3 overflow-hidden mask-t-from-85% mask-b-from-85% px-3"
    >
      {columns.map((column, index) => (
        <div
          // Columns are fixed slots, so the index is the identity.
          // oxlint-disable-next-line no-array-index-key
          key={index}
          // Two columns on lg, the third joins on xl.
          className={cn("min-w-0 flex-1", index === 2 && "hidden xl:block")}
        >
          <div data-feed-track className="will-change-transform">
            {[...column, ...column].map((video, position) => (
              <FeedCard
                // Each video appears twice in its track.
                key={`${video.slug}-${position < column.length ? "a" : "b"}`}
                video={video}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
