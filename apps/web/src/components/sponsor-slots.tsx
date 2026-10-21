import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { useIntlayer } from "react-intlayer";

import {
  SharedTooltip,
  TooltipProvider,
  TooltipTrigger,
  createTooltipHandle,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/constants/routes";
import { FOUNDING_SPONSORS, SPONSOR_SLOTS } from "@/constants/sponsors";
import { useSponsors } from "@/lib/sponsorships";
import { cn } from "@/lib/utils";
import { withUtm } from "@/lib/utm";

const TOOLTIP_DELAY = 200;
const slotClass =
  "focus-visible:ring-ring/50 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] outline-none focus-visible:ring-3";

/**
 * The sponsor slots under a page's intro actions: Diamond sponsors first,
 * then every Gold sponsor (up to SPONSOR_SLOTS of each, so at most six).
 * No tier is tied to a category page. Dashed "+" places leading to /sponsor
 * fill the row up to SPONSOR_SLOTS. Silver has no slot (only the card).
 */
export const SponsorSlots = ({
  demo = false,
}: {
  /**
   * The /sponsor placement preview: while no Diamond or Gold sponsor is
   * live, the founding sponsors fill the slots as examples. Clicks track as
   * "preview".
   */
  demo?: boolean;
}) => {
  const content = useIntlayer("site-header");
  const live = useSponsors();
  // Diamond (up to its seats), then Gold (up to as many).
  const paid = [
    ...live
      .filter((sponsor) => sponsor.tier === "diamond")
      .slice(0, SPONSOR_SLOTS),
    ...live
      .filter((sponsor) => sponsor.tier === "gold")
      .slice(0, SPONSOR_SLOTS),
  ];
  const taken = demo && paid.length === 0 ? FOUNDING_SPONSORS : paid;
  // Always SPONSOR_SLOTS places; more only when more sponsors fill them.
  const open = Math.max(0, SPONSOR_SLOTS - taken.length);
  const tooltip = useMemo(() => createTooltipHandle<ReactNode>(), []);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* One shared tooltip slides and morphs between the slots. */}
      <TooltipProvider>
        {[
          ...taken.map((sponsor) => {
            const label = `${sponsor.name} · ${content.sponsored.value}`;
            return (
              <TooltipTrigger
                key={`${sponsor.name}:${sponsor.url}`}
                delay={TOOLTIP_DELAY}
                handle={tooltip}
                payload={label}
                render={
                  <a
                    href={withUtm(sponsor.url, "slots")}
                    target="_blank"
                    rel="sponsored noopener"
                    data-track="sponsor_click"
                    data-track-placement={demo ? "preview" : "slot"}
                    data-track-name={sponsor.name}
                    aria-label={`${sponsor.name} (${content.sponsored.value})`}
                  />
                }
                className={cn(
                  slotClass,
                  // Outline-button surface: white chip in light, inverse in dark.
                  "bg-background shadow-outline dark:bg-popover p-1"
                )}
              >
                <img
                  src={sponsor.logo}
                  alt=""
                  width={32}
                  height={32}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className={cn(
                    "size-full object-contain",
                    // Black artwork: as-is on the white chip, inverted for dark.
                    sponsor.darkInvert && "dark:invert"
                  )}
                />
              </TooltipTrigger>
            );
          }),
          ...Array.from({ length: open }, (_, index) => (
            <TooltipTrigger
              key={`open-${index}`}
              delay={TOOLTIP_DELAY}
              handle={tooltip}
              payload={content.sponsorSlot.value}
              render={
                <Link
                  to={ROUTES.SPONSOR}
                  data-track="sponsor_slot_open"
                  aria-label={content.sponsorSlot.value}
                />
              }
              className={`${slotClass} text-muted-foreground hover:text-foreground border border-dashed border-current/40 transition-colors hover:border-current/70`}
            >
              {/* A thin drawn "+", like an empty app-icon slot. */}
              <span aria-hidden="true" className="relative size-3.5">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
              </span>
            </TooltipTrigger>
          )),
        ]}
        <SharedTooltip handle={tooltip} side="bottom" />
      </TooltipProvider>
    </div>
  );
};
