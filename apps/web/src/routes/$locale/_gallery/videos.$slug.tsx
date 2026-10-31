import { createFileRoute } from "@tanstack/react-router";

import { MotionVideoOverlay } from "@/components/motion-video";
import { useLocalizedNavigate } from "@/hooks/use-localized-navigate";
import {
  loadMotionVideo,
  motionVideoHead,
  videoNeighbours,
} from "@/lib/motion-video-route";

const VideoRoute = () => {
  const { video } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useLocalizedNavigate();
  const { previous, next } = videoNeighbours(video.slug, search);
  // Stepping replaces the entry, so Back still leaves the overlay.
  const open = (slug: string) =>
    navigate({
      to: "/videos/$slug",
      params: { slug },
      search,
      replace: true,
      resetScroll: false,
    });
  return (
    <MotionVideoOverlay
      video={video}
      openVideo={open}
      previous={previous ? () => open(previous) : undefined}
      next={next ? () => open(next) : undefined}
      onClose={() =>
        navigate({
          to: "/",
          search,
          resetScroll: false,
          viewTransition: true,
        })
      }
    />
  );
};

// Rendered inside the `_gallery` layout, so the grid stays visible behind it.
export const Route = createFileRoute("/$locale/_gallery/videos/$slug")({
  component: VideoRoute,
  loader: loadMotionVideo,
  head: motionVideoHead,
});
