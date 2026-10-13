import { Dialog } from "@base-ui/react/dialog";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import MediaThemeSutro from "player.style/sutro/react";
import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useIntlayer, useLocale } from "react-intlayer";
import type { IconComponent } from "reicon-react";
import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";
import { Check } from "reicon-react/icons/Check";
import { ChevronLeft } from "reicon-react/icons/ChevronLeft";
import { ChevronRight } from "reicon-react/icons/ChevronRight";
import { Copy } from "reicon-react/icons/Copy";
import { User } from "reicon-react/icons/User";
import { Xmark } from "reicon-react/icons/Xmark";

import { BookmarkButton } from "@/components/bookmark-button";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { findMotionCategory } from "@/lib/motion-catalog";
import type {
  GallerySearch,
  MotionCategory,
  MotionVideo,
} from "@/lib/motion-catalog";

// Shared-element name: the card media morphs into the overlay's player.
// Slugs are `[a-z0-9-]` already; strip anything else so the ident stays valid.
const videoTransitionName = (slug: string) =>
  `video-${slug.replaceAll(/[^\w-]/gu, "")}`;

// Opens a video's overlay route over the page it was opened from: Discover
// (`/videos/$slug`) or a category page (`/category/$category/videos/$slug`).
const VideoLink = ({
  slug,
  category,
  search,
  ...props
}: Omit<ComponentPropsWithRef<"a">, "href"> & {
  slug: string;
  category: MotionCategory | undefined;
  search: GallerySearch;
}) =>
  category ? (
    <Link
      to="/category/$category/videos/$slug"
      params={{ category, slug }}
      search={search}
      resetScroll={false}
      viewTransition
      {...props}
    />
  ) : (
    <Link
      to="/videos/$slug"
      params={{ slug }}
      search={search}
      resetScroll={false}
      viewTransition
      {...props}
    />
  );

/** A creator's photo, or the user glyph when there is none or it fails to load. */
const CreatorAvatar = ({
  src,
  size,
  className,
}: {
  src: string;
  size: number;
  className: string;
}) => {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("bg-muted object-cover", className)}
    />
  ) : (
    <User
      aria-hidden="true"
      className={cn("bg-muted text-muted-foreground p-1", className)}
    />
  );
};

const MotionPreview = ({
  video,
  paused,
  transitionName,
}: {
  video: MotionVideo;
  paused: boolean;
  transitionName?: string;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const content = useIntlayer("motion-gallery");

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const updatePlayback = async () => {
      if (visible && !paused && !reducedMotion.matches && !document.hidden) {
        if (!element.getAttribute("src")) {
          element.src = video.preview;
        }
        try {
          await element.play();
        } catch {
          // Autoplay can be denied; the poster and full-video link remain usable.
        }
      } else {
        element.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0.25 }
    );
    observer.observe(element);
    reducedMotion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      element.pause();
    };
  }, [paused, video.preview]);

  return (
    <div
      className="bg-muted shadow-outline relative overflow-hidden rounded-xl"
      style={{
        aspectRatio: `${video.width} / ${video.height}`,
        viewTransitionName: transitionName,
      }}
    >
      {/* Decorative muted preview; full playback is available in the detail dialog. */}
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={ref}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
      {failed && (
        <span className="bg-background/90 text-muted-foreground absolute top-2 left-2 rounded px-2 py-1 text-xs">
          {content.previewError}
        </span>
      )}
    </div>
  );
};

const TOOLTIP_DELAY = 200;

const CopyPromptButton = ({
  prompt,
  size,
}: {
  prompt: string;
  size: "icon" | "icon-sm";
}) => {
  const content = useIntlayer("motion-gallery");
  const [copied, setCopied] = useState(false);
  const label = copied ? content.copied.value : content.copy.value;
  return (
    <Tooltip>
      <TooltipTrigger
        delay={TOOLTIP_DELAY}
        render={<button type="button" aria-label={label} />}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
          } catch {
            // The detail view explains clipboard failures; keep this control quiet.
          }
        }}
        className={cn(
          buttonVariants({ size, variant: "outline" }),
          "rounded-full"
        )}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

/**
 * Copy prompt and Bookmark (the two main actions, outline) on the hovered
 * card.
 */
const VideoActions = ({
  video,
  className,
  size = "icon",
}: {
  video: MotionVideo;
  className?: string;
  /** `icon-sm` (28px) on the card. */
  size?: "icon" | "icon-sm";
}) => (
  <div className={cn("flex shrink-0 gap-2", className)}>
    {video.prompt && <CopyPromptButton prompt={video.prompt} size={size} />}
    <BookmarkButton
      slug={video.slug}
      variant="outline"
      size={size}
      className="rounded-full"
    />
  </div>
);

export const MotionVideoCard = ({
  video,
  paused,
  open,
  category,
  search,
}: {
  video: MotionVideo;
  paused: boolean;
  /** This video's overlay route is showing; it owns the shared element. */
  open: boolean;
  /** The category page the grid shows, if any; the overlay opens over it. */
  category: MotionCategory | undefined;
  search: GallerySearch;
}) => {
  const content = useIntlayer("motion-gallery");
  const label = `${content.watch.value}: ${video.title}, @${video.handle}`;

  return (
    <article className="group/card relative">
      <VideoLink
        slug={video.slug}
        category={category}
        search={search}
        aria-label={label}
        className="group focus-visible:ring-ring relative block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <MotionPreview
          video={video}
          paused={paused}
          transitionName={open ? undefined : videoTransitionName(video.slug)}
        />
        {/* Plain hover state: tags and title over a bottom gradient. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between rounded-xl bg-linear-to-t from-black/70 via-transparent to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 group-focus-visible:opacity-100">
          <div className="flex gap-1">
            {video.tags
              .filter((tag) => tag === "prompt" || tag === "skill")
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
                >
                  {tag === "prompt" ? content.prompt : content.skill}
                </span>
              ))}
          </div>
          <h2 className="h-7 truncate pl-10 text-sm leading-7 font-medium tracking-tight text-white">
            {video.title}
          </h2>
        </div>
      </VideoLink>
      {/* Siblings of the card link (buttons can't nest in a link); shown on
          hover or keyboard focus, clear of the tags, title and avatar. */}
      {/* One provider for the card's actions, so their tooltips share
          open state and morph between labels instead of blinking. */}
      <TooltipProvider>
        <VideoActions
          video={video}
          size="icon-sm"
          className="pointer-events-none absolute top-2.5 right-2.5 opacity-0 transition-opacity duration-200 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100 group-hover/card:pointer-events-auto group-hover/card:opacity-100 motion-reduce:transition-none"
        />
        {/* Source link, like the top-right actions but pinned bottom-right. */}
        {video.sourceUrl && (
          <Tooltip>
            <TooltipTrigger
              delay={TOOLTIP_DELAY}
              render={
                <a
                  href={video.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={content.viewSource.value}
                />
              }
              className={cn(
                buttonVariants({ size: "icon-sm", variant: "outline" }),
                "rounded-full",
                "pointer-events-none absolute right-2.5 bottom-2.5 opacity-0 transition-opacity duration-200 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100 group-hover/card:pointer-events-auto group-hover/card:opacity-100 motion-reduce:transition-none"
              )}
            >
              <ArrowRightUp aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>{content.viewSource.value}</TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
      <a
        href={`https://x.com/${video.handle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`@${video.handle}`}
        title={`@${video.handle}`}
        className="focus-visible:ring-ring absolute bottom-2.5 left-2.5 size-7 overflow-hidden rounded-full shadow-sm transition-transform outline-none hover:scale-110 focus-visible:ring-2"
      >
        <CreatorAvatar src={video.avatar} size={28} className="size-full" />
      </a>
    </article>
  );
};

const DetailRow = ({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 border-t border-dashed py-2.5 text-sm first:border-t-0">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="flex min-w-0 flex-col items-end text-right">{children}</dd>
  </div>
);

const RELATIVE_UNITS = [
  ["year", 365],
  ["month", 30],
  ["week", 7],
  ["day", 1],
] as const;

/** "3 months ago" for a `YYYY-MM-DD` date, in the reader's language. */
const relativeDate = (date: string, locale: string) => {
  const days = Math.round(
    (Date.parse(date) - Date.now()) / (24 * 60 * 60 * 1000)
  );
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(days) >= size || unit === "day") {
      return format.format(Math.round(days / size), unit);
    }
  }
  return date;
};

/**
 * Previous/next in the player's control row. At either end of the grid it
 * becomes a dot that shakes when pressed: there is nothing that way.
 */
const StepButton = ({
  onStep,
  icon: Icon,
  label,
  endLabel,
}: {
  onStep?: () => void;
  icon: IconComponent;
  label: string;
  endLabel: string;
}) => {
  const [shaking, setShaking] = useState(false);
  return onStep ? (
    <Button
      variant="secondary"
      size="icon-xl"
      aria-label={label}
      onClick={onStep}
      className="rounded-full"
    >
      <Icon aria-hidden="true" />
    </Button>
  ) : (
    <Button
      variant="secondary"
      size="icon-xl"
      aria-label={endLabel}
      data-shaking={shaking || undefined}
      onClick={() => setShaking(true)}
      onAnimationEnd={() => setShaking(false)}
      className="data-shaking:animate-mv-shake rounded-full motion-reduce:animate-none"
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-current" />
    </Button>
  );
};

/**
 * Route overlay for `/videos/$slug`: the player floats over the blurred
 * gallery with details beside it. The player shares a view-transition name
 * with the card it opened from, so the card morphs into place.
 */
export const MotionVideoOverlay = ({
  video,
  onClose,
  previous,
  next,
}: {
  video: MotionVideo;
  onClose: () => void;
  /** Opens the previous/next video of the grid behind, when there is one. */
  previous?: () => void;
  next?: () => void;
}) => {
  const content = useIntlayer("motion-gallery");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const [failed, setFailed] = useState(false);
  // Fades out page chrome keyed on `in-data-overlay-open` (the bottom blur).
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.overlayOpen = "";
    return () => {
      delete root.dataset.overlayOpen;
    };
  }, []);
  // Arrow keys step through the grid, like the on-screen buttons.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const { key, target } = event;
      // Text fields and the player (whose arrows seek) keep their keys.
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          /^(?:INPUT|TEXTAREA|SELECT)$/u.test(target.tagName) ||
          target.closest("media-theme-sutro"))
      ) {
        return;
      }
      if (key === "ArrowLeft" && previous) {
        return previous();
      }
      if (key === "ArrowRight" && next) {
        return next();
      }
    };
    // Capture phase: the dialog stops arrow keys before they bubble up.
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [previous, next]);
  const types = video.tags.filter((tag) => tag === "prompt" || tag === "skill");
  const { locale } = useLocale();
  const [primaryCategory] = video.contentTags.flatMap((tag) => {
    const category = findMotionCategory(tag);
    return category ? [category] : [];
  });

  const copyPrompt = async () => {
    if (!video.prompt) {
      return;
    }
    try {
      await navigator.clipboard.writeText(video.prompt);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="bg-background/80 fixed inset-0 z-50 backdrop-blur-xl" />
        <Dialog.Popup className="fixed inset-0 z-50 overflow-y-auto outline-none lg:overflow-hidden">
          <div className="grid min-h-full lg:h-full lg:grid-cols-[minmax(0,1fr)_22rem]">
            {/* Full-bleed frosted stage: the whole page is blurred, so the
                empty space around the player reads as dismissible. */}
            <div className="relative min-h-[70svh] lg:min-h-0">
              {/* Clicking the empty space around the player closes, like a backdrop. */}
              <Dialog.Close
                tabIndex={-1}
                aria-hidden="true"
                className="absolute inset-0 cursor-default"
              />
              {/* The video's own colours, as a soft glow behind the player. */}
              <img
                src={video.poster}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-[8%] size-[84%] scale-110 object-cover opacity-60 blur-3xl saturate-150 dark:opacity-45"
              />
              {/* The stage is the column minus the step row (3rem buttons +
                  1rem gap) plus the inner breathing room, so the video never
                  touches the viewport top and the buttons never touch the
                  bottom. As a size container it lets the player fit both
                  ways and stay centred, whatever the video's shape. */}
              <div className="[container-type:size] pointer-events-none absolute inset-x-5 top-5 bottom-20 flex items-center justify-center">
                {/* Sutro (player.style) frame, as on the skill page. */}
                <MediaThemeSutro
                  className="pointer-events-auto relative block overflow-hidden rounded-xl shadow-2xl"
                  style={{
                    aspectRatio: `${video.width} / ${video.height}`,
                    width: `min(100cqw, calc(100cqh * ${video.width / video.height}))`,
                    viewTransitionName: videoTransitionName(video.slug),
                  }}
                >
                  {/* The source catalog does not supply caption tracks. */}
                  {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    key={video.slug}
                    slot="media"
                    src={video.video}
                    poster={video.poster}
                    autoPlay
                    playsInline
                    preload="metadata"
                    aria-label={video.title}
                    onError={() => setFailed(true)}
                    className="bg-muted size-full object-cover"
                  />
                </MediaThemeSutro>
              </div>
              {/* Pinned to the bottom centre, clear of the viewport edge,
                  independent of the video's size. */}
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3">
                <StepButton
                  onStep={previous}
                  icon={ChevronLeft}
                  label={content.previous.value}
                  endLabel={content.noPrevious.value}
                />
                <StepButton
                  onStep={next}
                  icon={ChevronRight}
                  label={content.next.value}
                  endLabel={content.noNext.value}
                />
              </div>
            </div>
            <aside className="bg-background flex min-h-0 flex-col gap-5 border-t p-5 lg:h-full lg:overflow-y-auto lg:border-t-0 lg:border-l">
              <div className="flex flex-col gap-0.5">
                {/* Category on the left, Bookmark and Close side by side on
                    the right of the same row; the title sits below. */}
                <div className="flex items-center justify-between gap-4">
                  <p className="text-muted-foreground min-w-0 truncate text-xl leading-tight font-semibold tracking-tight">
                    {primaryCategory && content.categories[primaryCategory]}
                  </p>
                  <div className="flex shrink-0 gap-2">
                    <BookmarkButton
                      slug={video.slug}
                      variant="secondary"
                      size="icon-lg"
                      className="rounded-full"
                    />
                    <Dialog.Close
                      aria-label={content.close.value}
                      className={cn(
                        buttonVariants({
                          variant: "secondary",
                          size: "icon-lg",
                        }),
                        "rounded-full"
                      )}
                    >
                      <Xmark aria-hidden="true" />
                    </Dialog.Close>
                  </div>
                </div>
                <Dialog.Title className="text-xl leading-tight font-semibold tracking-tight text-balance">
                  {video.title}
                </Dialog.Title>
              </div>
              {video.description && (
                <Dialog.Description className="text-sm leading-relaxed text-pretty">
                  {video.description}
                </Dialog.Description>
              )}
              <time
                dateTime={video.date}
                className="text-muted-foreground -mt-2 text-sm"
              >
                {relativeDate(video.date, locale)}
              </time>
              {failed && (
                <p role="alert" className="text-destructive text-sm">
                  {content.videoError}
                </p>
              )}
              <div className="flex flex-col gap-2">
                {video.tweetUrl && (
                  <a
                    href={video.tweetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      variant: "gradient",
                      size: "lg",
                    })}
                  >
                    {content.originalPost}
                    <ArrowRightUp aria-hidden="true" />
                  </a>
                )}
                {video.skillUrl && (
                  <a
                    href={video.skillUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
                  >
                    {content.viewSkill}
                    <ArrowRightUp aria-hidden="true" />
                  </a>
                )}
              </div>
              <dl>
                <DetailRow label={content.creator}>
                  <a
                    href={`https://x.com/${video.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                  >
                    <CreatorAvatar
                      src={video.avatar}
                      size={20}
                      className="size-5 rounded-full"
                    />
                    @{video.handle}
                  </a>
                </DetailRow>
                {video.contentTags.length > 0 && (
                  <DetailRow label={content.category}>
                    {video.contentTags.map((tag) => {
                      const category = findMotionCategory(tag);
                      return (
                        <span key={tag}>
                          {category ? content.categories[category] : tag}
                        </span>
                      );
                    })}
                  </DetailRow>
                )}
                {types.length > 0 && (
                  <DetailRow label={content.type}>
                    {types.map((tag) => (
                      <span key={tag}>
                        {tag === "prompt" ? content.prompt : content.skill}
                      </span>
                    ))}
                  </DetailRow>
                )}
              </dl>
              <section
                className="flex flex-col gap-3 border-t border-dashed pt-4"
                aria-label={content.prompt.value}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium">{content.prompt}</h2>
                  {video.prompt && (
                    <Button variant="outline" size="sm" onClick={copyPrompt}>
                      {copyStatus === "copied" ? (
                        <Check aria-hidden="true" />
                      ) : (
                        <Copy aria-hidden="true" />
                      )}
                      {copyStatus === "copied" ? content.copied : content.copy}
                    </Button>
                  )}
                </div>
                {video.prompt ? (
                  <pre className="bg-muted max-h-72 overflow-auto rounded-xl p-4 font-serif text-sm leading-relaxed whitespace-pre-wrap">
                    {video.prompt}
                  </pre>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {content.unavailablePrompt}
                  </p>
                )}
                <output className="text-muted-foreground text-xs">
                  {copyStatus === "failed" && content.copyError}
                </output>
              </section>
            </aside>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
