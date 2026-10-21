import { useEffect, useState } from "react";
import { useIntlayer } from "react-intlayer";

import { ExternalLinkChip } from "@/components/external-link-chip";
import { SponsorListItem } from "@/components/sponsor-list-item";
import { FOUNDING_SPONSORS } from "@/constants/sponsors";
import { useSponsors } from "@/lib/sponsorships";
import { cn } from "@/lib/utils";
import { withUtm } from "@/lib/utm";

// How long each sponsor stays on the card before fading to the next.
const ROTATE_MS = 6000;

// UTM content and analytics name per placement. The feed keeps its original
// names ("grid", "card") so earlier click data stays comparable.
const TRACKING = {
  feed: { utm: "grid", track: "card" },
  sidebar: { utm: "sidebar", track: "sidebar" },
} as const;

/**
 * A sponsored placement: every Diamond sponsor first (or, while there is
 * none, the founding sponsors), then Gold and Silver in the feed. No tier is
 * tied to a category page. The detail sidebar shows only Diamond, as a list
 * item rather than a card. Each cover (or row) fades into the next on a
 * timer, with a progress hairline along the bottom edge. The whole placement
 * links straight to the showing sponsor.
 */
export const SponsoredCard = ({
  placement,
}: {
  /** The video grid feed, or a detail view's sidebar. */
  placement: keyof typeof TRACKING;
}) => {
  const content = useIntlayer("motion-gallery");
  const live = useSponsors();
  // Diamond first (the founding sponsors while there is none). Only the feed
  // goes on to Gold and Silver.
  const diamond = live.filter((entry) => entry.tier === "diamond");
  const base = diamond.length > 0 ? diamond : FOUNDING_SPONSORS;
  const gold = live.filter((entry) => entry.tier === "gold");
  const silver = live.filter((entry) => entry.tier === "silver");
  const sponsors =
    placement === "sidebar"
      ? [...base]
      : [...base, ...gold, ...silver].flatMap((entry) =>
          entry.cover ? [{ ...entry, cover: entry.cover }] : []
        );
  const [active, setActive] = useState(0);
  // The list changes between pages; stay within it.
  const showing = active % Math.max(sponsors.length, 1);
  const sponsor = sponsors[showing];

  useEffect(() => {
    if (sponsors.length < 2) {
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % sponsors.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [sponsors.length]);

  if (!sponsor) {
    return null;
  }

  if (placement === "sidebar") {
    return (
      <a
        href={withUtm(sponsor.url, TRACKING.sidebar.utm)}
        target="_blank"
        rel="sponsored noopener"
        data-track="sponsor_click"
        data-track-placement={TRACKING.sidebar.track}
        data-track-name={sponsor.name}
        aria-label={`${sponsor.name} (${content.sponsored.value})`}
        className="group focus-visible:ring-ring hover:bg-muted/60 relative -mx-2 flex items-center rounded-xl px-2 py-2 transition-colors outline-none focus-visible:ring-2"
      >
        <SponsorListItem
          logo={sponsor.logo}
          name={sponsor.name}
          tagline={sponsor.tagline}
          sponsored={content.sponsored}
          darkInvert={sponsor.darkInvert}
        />
        {sponsors.length > 1 && (
          <span
            aria-hidden="true"
            className="bg-muted absolute inset-x-2 bottom-0 h-0.5 overflow-hidden rounded-full motion-reduce:hidden"
          >
            <span
              key={active}
              className="animate-mv-rotate bg-primary/60 block h-full"
            />
          </span>
        )}
      </a>
    );
  }

  return (
    <a
      href={withUtm(sponsor.url, TRACKING[placement].utm)}
      target="_blank"
      rel="sponsored noopener"
      data-track="sponsor_click"
      data-track-placement={TRACKING[placement].track}
      data-track-name={sponsor.name}
      aria-label={`${sponsor.name} (${content.sponsored.value})`}
      className="group focus-visible:ring-ring shadow-outline relative block aspect-video overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {sponsors.map((entry, index) => (
        <img
          key={`${entry.name}:${entry.url}`}
          src={entry.cover ?? undefined}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          aria-hidden={index === showing ? undefined : true}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-500 motion-reduce:transition-none",
            index === showing ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100"
      />
      <span className="absolute inset-x-0 top-0 flex items-start p-2.5">
        <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {content.sponsored}
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-linear-to-t from-black/70 to-transparent p-2.5 pt-6">
        <span
          key={`${sponsor.name}:${sponsor.url}`}
          className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-sm"
        >
          <img
            src={sponsor.logo}
            alt=""
            width={28}
            height={28}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="size-full object-contain"
          />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium tracking-tight text-white">
            {sponsor.name}
          </span>
          {sponsor.tagline && (
            <span className="truncate text-xs text-white/75">
              {sponsor.tagline}
            </span>
          )}
        </span>
        <ExternalLinkChip className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100" />
      </span>
      {sponsors.length > 1 && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20 motion-reduce:hidden"
        >
          <span
            key={active}
            className="animate-mv-rotate block h-full bg-white/90"
          />
        </span>
      )}
    </a>
  );
};

/** One-lane phones: the sponsored tile comes after the intro and this many. */
const PHONE_OFFSET = 3;

/**
 * Where the sponsored tile goes among a grid's items (intro first): the first
 * row's rightmost lane, or right after the last tile when that row isn't
 * full; on one-lane phones a few items in, so it isn't in the first view.
 */
export const sponsoredTileIndex = (lanes: number, cardCount: number) =>
  lanes < 2
    ? 1 + Math.min(PHONE_OFFSET, cardCount)
    : Math.min(1 + cardCount, lanes - 1);
