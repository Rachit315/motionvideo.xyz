import { notFound } from "@tanstack/react-router";

import catalog from "@/data/motion-catalog.json";
import { MOTION_COLORS, filterMotionVideos } from "@/lib/motion-catalog";
import type { MotionFilters, MotionVideo } from "@/lib/motion-catalog";
import { videoJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

// Shared by the gallery routes: the video overlays' loader and head
// (`/videos/$slug` over Discover, `/category/$category/videos/$slug` over a
// category page…) and which colours have a page of their own.
const videos: MotionVideo[] = catalog.videos;

// A colour page with only a handful of videos is too thin to be worth a URL.
const MIN_COLOR_PAGE_VIDEOS = 6;

/** The named colours with enough videos for a page, `/color/$color`. */
export const COLOR_PAGES = MOTION_COLORS.filter(
  (color) =>
    filterMotionVideos(videos, { color: color.hex }).length >=
    MIN_COLOR_PAGE_VIDEOS
);

export const loadMotionVideo = ({ params }: { params: { slug: string } }) => {
  const video = videos.find((entry) => entry.slug === params.slug);
  if (!video) {
    throw notFound();
  }
  return { video };
};

// Both overlay URLs show the same video, so both point at `/videos/$slug`;
// structured data makes the video one citable entity per page.
export const motionVideoHead = ({
  loaderData,
  params,
}: {
  loaderData?: { video: MotionVideo };
  params: { slug: string };
}) => ({
  ...createMetadata({
    canonical: `/videos/${params.slug}`,
    title: loaderData?.video.title ?? "Motion video",
    description: loaderData
      ? `${loaderData.video.title} by @${loaderData.video.handle}. Watch the motion video${loaderData.video.prompt ? " and copy the prompt behind it" : ""} on MotionVideo.`
      : "A motion video on MotionVideo.",
  }),
  scripts: loaderData ? [videoJsonLd(loaderData.video)] : [],
});

/**
 * The videos before and after `slug` in the grid behind the overlay (same
 * category, type and sort), so the overlay can step through it.
 */
export interface VideoNeighbours {
  previous?: string;
  next?: string;
}

export const videoNeighbours = (
  slug: string,
  filters: MotionFilters
): VideoNeighbours => {
  const list = filterMotionVideos(videos, filters);
  const index = list.findIndex((entry) => entry.slug === slug);
  if (index === -1) {
    return {};
  }
  return { previous: list[index - 1]?.slug, next: list[index + 1]?.slug };
};
