import { createFileRoute } from "@tanstack/react-router";

import { MotionVideoOverlay } from "@/components/motion-video";
import { useLocalizedNavigate } from "@/hooks/use-localized-navigate";
import {
  loadMotionVideo,
  motionVideoHead,
  videoNeighbours,
} from "@/lib/motion-video-route";

const ModelVideoRoute = () => {
  const { video } = Route.useLoaderData();
  const { model } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useLocalizedNavigate();
  const { previous, next } = videoNeighbours(video.slug, { ...search, model });
  // Stepping replaces the entry, so Back still leaves the overlay.
  const open = (slug: string) =>
    navigate({
      to: "/model/$model/videos/$slug",
      params: { model, slug },
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
          to: "/model/$model",
          params: { model },
          search,
          resetScroll: false,
          viewTransition: true,
        })
      }
    />
  );
};

// A video opened from a model page: the grid behind it keeps the model
// filter, and closing returns to the model page. The parent route validates
// the model; the head tags (and canonical) are the video's.
export const Route = createFileRoute(
  "/$locale/_gallery/model/$model/videos/$slug"
)({
  component: ModelVideoRoute,
  loader: loadMotionVideo,
  head: motionVideoHead,
});
