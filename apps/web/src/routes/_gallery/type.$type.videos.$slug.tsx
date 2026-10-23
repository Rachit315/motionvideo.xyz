import { createFileRoute } from "@tanstack/react-router";

import { MotionVideoOverlay } from "@/components/motion-video";
import { findMotionType } from "@/lib/motion-catalog";
import {
  loadMotionVideo,
  motionVideoHead,
  videoNeighbours,
} from "@/lib/motion-video-route";

const TypeVideoRoute = () => {
  const { video } = Route.useLoaderData();
  const { type } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { previous, next } = videoNeighbours(video.slug, {
    ...search,
    type: findMotionType(type),
  });
  // Stepping replaces the entry, so Back still leaves the overlay.
  const open = (slug: string) =>
    navigate({
      to: "/type/$type/videos/$slug",
      params: { type, slug },
      search,
      replace: true,
      resetScroll: false,
    });
  return (
    <MotionVideoOverlay
      video={video}
      previous={previous ? () => open(previous) : undefined}
      next={next ? () => open(next) : undefined}
      onClose={() =>
        navigate({
          to: "/type/$type",
          params: { type },
          search,
          resetScroll: false,
          viewTransition: true,
        })
      }
    />
  );
};

// A video opened from a type page: the grid behind it keeps the type filter,
// and closing returns to the type page. The parent route validates the type;
// the head tags (and canonical) are the video's.
export const Route = createFileRoute("/_gallery/type/$type/videos/$slug")({
  component: TypeVideoRoute,
  loader: loadMotionVideo,
  head: motionVideoHead,
});
