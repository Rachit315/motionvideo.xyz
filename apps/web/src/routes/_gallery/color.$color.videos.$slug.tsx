import { createFileRoute } from "@tanstack/react-router";

import { MotionVideoOverlay } from "@/components/motion-video";
import { findMotionColor } from "@/lib/motion-catalog";
import {
  loadMotionVideo,
  motionVideoHead,
  videoNeighbours,
} from "@/lib/motion-video-route";

const ColorVideoRoute = () => {
  const { video } = Route.useLoaderData();
  const { color } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { previous, next } = videoNeighbours(video.slug, {
    ...search,
    color: findMotionColor(color)?.hex,
  });
  // Stepping replaces the entry, so Back still leaves the overlay.
  const open = (slug: string) =>
    navigate({
      to: "/color/$color/videos/$slug",
      params: { color, slug },
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
          to: "/color/$color",
          params: { color },
          search,
          resetScroll: false,
          viewTransition: true,
        })
      }
    />
  );
};

// A video opened from a colour page: the grid behind it keeps the colour
// filter, and closing returns to the colour page. The parent route validates
// the colour; the head tags (and canonical) are the video's.
export const Route = createFileRoute("/_gallery/color/$color/videos/$slug")({
  component: ColorVideoRoute,
  loader: loadMotionVideo,
  head: motionVideoHead,
});
