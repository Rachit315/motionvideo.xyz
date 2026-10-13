import {
  Outlet,
  createFileRoute,
  getRouteApi,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { cn } from "cn";
import { useMemo, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { ChevronDown } from "reicon-react/icons/ChevronDown";
import { Pause3 } from "reicon-react/icons/Pause3";
import { Play } from "reicon-react/icons/Play";
import { Search } from "reicon-react/icons/Search";
import { z } from "zod";

import {
  CollectionGrid,
  CollectionEmptyState,
} from "@/components/collection-grid";
import { CollectionIntro } from "@/components/collection-intro";
import {
  CategoryChip,
  CollectionToolbar,
} from "@/components/collection-toolbar";
import { FadeScroller } from "@/components/fade-scroller";
import { MotionVideoCard } from "@/components/motion-video";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SponsoredCard } from "@/components/sponsored-card";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { MasonryItem } from "@/components/virtual-masonry";
import catalog from "@/data/motion-catalog.json";
import { useLaneCount } from "@/hooks/use-lane-count";
import {
  MOTION_CATEGORIES,
  filterMotionVideos,
  findMotionCategory,
} from "@/lib/motion-catalog";
import type { GallerySearch, MotionVideo } from "@/lib/motion-catalog";
import { getLandingData } from "@/server/functions";

const routeApi = getRouteApi("/_gallery");
const videos: MotionVideo[] = catalog.videos;
const TYPES = ["prompt", "skill"] as const;
const typeCounts = Object.fromEntries(
  TYPES.map((type) => [
    type,
    videos.filter((video) => video.tags.includes(type)).length,
  ])
);
// Pills are outline buttons with rounded-full: default choices read as plain
// white chips; any other choice turns yellow.
const chipClass = (active: boolean) =>
  cn(
    buttonVariants({ variant: active ? "default" : "outline" }),
    "rounded-full px-3"
  );

const Gallery = () => {
  const content = useIntlayer("motion-gallery");
  const { signedIn } = routeApi.useLoaderData();
  const search = routeApi.useSearch();
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
  // The open video renders as a child route overlay on top of this gallery;
  // on `/category/$category` (and its video overlays) the grid is filtered.
  const params = useParams({ strict: false });
  const openSlug = params.slug;
  const category = findMotionCategory(params.category);
  const sort = search.sort ?? "popular";
  const sortLabels = {
    popular: content.popular,
    newest: content.newest,
    oldest: content.oldest,
  };

  const filtered = useMemo(
    () =>
      filterMotionVideos(videos, {
        type: search.type,
        category,
        sort: search.sort,
      }),
    [search.type, category, search.sort]
  );
  const categoryCounts = useMemo(() => {
    const matching = filterMotionVideos(videos, { type: search.type });
    return Object.fromEntries(
      MOTION_CATEGORIES.map((id) => [
        id,
        matching.filter((video) => video.contentTags.includes(id)).length,
      ])
    );
  }, [search.type]);
  const previewsPaused = paused || Boolean(openSlug);
  const lanes = useLaneCount();

  // Type and sort stay search params on whichever page is showing.
  const updateSearch = (patch: GallerySearch) => {
    const next = { ...search, ...patch };
    void (category
      ? navigate({
          to: "/category/$category",
          params: { category },
          search: next,
          resetScroll: false,
        })
      : navigate({ to: "/", search: next, resetScroll: false }));
  };

  const surprise = () => {
    const video = filtered[Math.floor(Math.random() * filtered.length)];
    if (!video) {
      return;
    }
    const options = {
      search,
      resetScroll: false,
      viewTransition: true,
    };
    void (category
      ? navigate({
          to: "/category/$category/videos/$slug",
          params: { category, slug: video.slug },
          ...options,
        })
      : navigate({
          to: "/videos/$slug",
          params: { slug: video.slug },
          ...options,
        }));
  };

  const intro = (
    <CollectionIntro
      titleId="gallery-intro-title"
      title={category ? content.categoryTitles[category] : content.title}
      description={category ? content.categoryIntros[category] : content.intro}
      onSurprise={surprise}
      surpriseDisabled={filtered.length === 0}
      surpriseLabel={content.surprise}
      submitLabel={content.submitVideo}
      submitSearch={{ kind: "video", category }}
    />
  );

  const cards: MasonryItem[] = filtered.map((video) => ({
    key: video.slug,
    aspectRatio: video.width / video.height,
    node: (
      <MotionVideoCard
        video={video}
        paused={previewsPaused}
        open={video.slug === openSlug}
        category={category}
        search={search}
      />
    ),
  }));
  const items: MasonryItem[] = [{ key: "intro", node: intro }, ...cards];
  // Sponsored tile in the first row's rightmost lane — but when the row
  // isn't full it just follows the last tile instead of floating apart.
  let sponsoredIndex = 1 + cards.length;
  if (lanes < 2) {
    sponsoredIndex = 1;
  } else if (sponsoredIndex >= lanes) {
    sponsoredIndex = lanes - 1;
  }
  items.splice(sponsoredIndex, 0, {
    key: "sponsored",
    aspectRatio: 16 / 9,
    node: <SponsoredCard />,
  });

  return (
    <>
      <SiteHeader signedIn={signedIn} />
      <CollectionToolbar label={content.browse.value}>
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none lg:basis-[65%]">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={content.filterType.value}
              className={chipClass(Boolean(search.type))}
            >
              {search.type ? content[search.type] : content.all}
              <ChevronDown aria-hidden="true" className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
              <DropdownMenuRadioGroup
                value={search.type ?? "all"}
                onValueChange={(value) =>
                  updateSearch({
                    type: TYPES.find((type) => type === value),
                  })
                }
              >
                <DropdownMenuRadioItem value="all">
                  {content.all}
                  <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                    {videos.length}
                  </span>
                </DropdownMenuRadioItem>
                {TYPES.map((type) => (
                  <DropdownMenuRadioItem key={type} value={type}>
                    {content[type]}
                    <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                      {typeCounts[type]}
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator orientation="vertical" className="my-1.5" />
          <FadeScroller
            label={content.filterCategory.value}
            className="-mx-1 -my-1 min-w-0 flex-1 px-1 py-1"
          >
            {MOTION_CATEGORIES.map((id) => {
              const active = category === id;
              // Each category is its own page; the active chip goes back to `/`.
              return active ? (
                <CategoryChip
                  key={id}
                  to="/"
                  search={search}
                  active
                  label={content.categories[id]}
                  count={categoryCounts[id]}
                />
              ) : (
                <CategoryChip
                  key={id}
                  to="/category/$category"
                  params={{ category: id }}
                  search={search}
                  active={false}
                  label={content.categories[id]}
                  count={categoryCounts[id]}
                />
              );
            })}
          </FadeScroller>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={content.sort.value}
              className={chipClass(sort !== "popular")}
            >
              {sortLabels[sort]}
              <ChevronDown aria-hidden="true" className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(value) =>
                  updateSearch({
                    sort:
                      value === "newest" || value === "oldest"
                        ? value
                        : undefined,
                  })
                }
              >
                <DropdownMenuRadioItem value="popular">
                  {content.popular}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="newest">
                  {content.newest}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">
                  {content.oldest}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
            className={cn(chipClass(paused), "max-sm:px-2")}
          >
            {paused ? (
              <Play aria-hidden="true" />
            ) : (
              <Pause3 aria-hidden="true" />
            )}
            <span className="max-sm:sr-only">
              {paused ? content.play : content.pause}
            </span>
          </button>
        </div>
      </CollectionToolbar>
      <CollectionGrid
        items={items}
        emptyState={
          filtered.length === 0 ? (
            <CollectionEmptyState
              icon={Search}
              title={content.noResults}
              description={content.tryAgain}
            />
          ) : undefined
        }
      />
      <Outlet />
      <SiteFooter />
    </>
  );
};

// Pathless layout: `/`, `/category/$category`, and their `videos/$slug`
// overlays share the gallery, so a video opens as an overlay route while the
// grid (and its scroll position) stays mounted.
export const Route = createFileRoute("/_gallery")({
  component: Gallery,
  loader: () => getLandingData(),
  validateSearch: (search): GallerySearch => ({
    type: z.enum(["prompt", "skill"]).safeParse(search.type).data,
    sort: z.enum(["newest", "oldest"]).safeParse(search.sort).data,
  }),
});
