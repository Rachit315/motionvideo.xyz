import { Link } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/constants/routes";
import { SPONSOR_SLOTS } from "@/constants/sponsors";
import type { SponsorCategory } from "@/constants/sponsors";
import { sameCategory, useSponsors } from "@/lib/sponsorships";
import { cn } from "@/lib/utils";
import { withUtm } from "@/lib/utm";

const TOOLTIP_DELAY = 200;
const slotClass =
  "focus-visible:ring-ring/50 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] outline-none focus-visible:ring-3";

/**
 * The sponsor slots under a page's intro actions: Diamond sponsors on every
 * page, then on a category page that category's Gold sponsors (up to
 * SPONSOR_SLOTS each, so at most six). Dashed "+" places leading to /sponsor
 * fill the row up to SPONSOR_SLOTS. Silver has no slot (only the card).
 */
export const SponsorSlots = ({
  category,
}: {
  /** The category page being shown; `undefined` on "All" pages. */
  category: SponsorCategory | undefined;
}) => {
  const content = useIntlayer("site-header");
  const live = useSponsors();
  // Diamond (up to its seats), then this category's Gold (up to as many).
  const taken = [
    ...live
      .filter((sponsor) => sponsor.tier === "diamond")
      .slice(0, SPONSOR_SLOTS),
    ...(category
      ? live
          .filter(
            (sponsor) =>
              sponsor.tier === "gold" &&
              sameCategory(sponsor.category, category)
          )
          .slice(0, SPONSOR_SLOTS)
      : []),
  ];
  // Always SPONSOR_SLOTS places; more only when more sponsors fill them.
  const open = Math.max(0, SPONSOR_SLOTS - taken.length);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* One provider, so the slots' tooltips morph between labels. */}
      <TooltipProvider>
        {[
          ...taken.map((sponsor) => {
            const label = `${sponsor.name} · ${content.sponsored.value}`;
            return (
              <Tooltip key={`${sponsor.name}:${sponsor.url}`}>
                <TooltipTrigger
                  delay={TOOLTIP_DELAY}
                  render={
                    <a
                      href={withUtm(sponsor.url, "slots")}
                      target="_blank"
                      rel="sponsored noopener"
                      data-track="sponsor_click"
                      data-track-placement="slot"
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
                <TooltipContent side="bottom">{label}</TooltipContent>
              </Tooltip>
            );
          }),
          ...Array.from({ length: open }, (_, index) => (
            <Tooltip key={`open-${index}`}>
              <TooltipTrigger
                delay={TOOLTIP_DELAY}
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
              <TooltipContent side="bottom">
                {content.sponsorSlot.value}
              </TooltipContent>
            </Tooltip>
          )),
        ]}
      </TooltipProvider>
    </div>
  );
};
