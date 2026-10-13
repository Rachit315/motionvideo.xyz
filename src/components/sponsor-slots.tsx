import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { useIntlayer } from "react-intlayer";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/constants/routes";
import { SPONSORS, SPONSOR_SLOTS } from "@/constants/sponsors";
import { withUtm } from "@/lib/utm";

const TOOLTIP_DELAY = 200;
const slotClass =
  "focus-visible:ring-ring/50 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] outline-none focus-visible:ring-3";

/**
 * Diamond placements: each sponsor's square mark, then dashed "+" slots for
 * the free places, which lead to /sponsor.
 */
export const SponsorSlots = () => {
  const content = useIntlayer("site-header");
  const diamond = SPONSORS.filter(
    (sponsor) => sponsor.tier === "diamond"
  ).slice(0, SPONSOR_SLOTS);
  const open = SPONSOR_SLOTS - diamond.length;
  return (
    <div className="flex items-center gap-2">
      {/* One provider, so the slots' tooltips morph between labels. */}
      <TooltipProvider>
        {diamond.map((sponsor) => {
          const label = `${sponsor.name} · ${content.sponsored.value}`;
          return (
            <Tooltip key={sponsor.name}>
              <TooltipTrigger
                delay={TOOLTIP_DELAY}
                render={
                  <a
                    href={withUtm(sponsor.url, "header")}
                    target="_blank"
                    rel="sponsored noopener"
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
        })}
        {Array.from({ length: open }, (_, index) => (
          <Tooltip key={`open-${index}`}>
            <TooltipTrigger
              delay={TOOLTIP_DELAY}
              render={
                <Link
                  to={ROUTES.SPONSOR}
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
        ))}
      </TooltipProvider>
    </div>
  );
};
