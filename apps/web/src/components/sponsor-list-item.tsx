import type { ReactNode } from "react";
import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";

import { cn } from "@/lib/utils";

/**
 * A sponsored row for detail sidebars: logo, name, tagline, and an external
 * link mark. It reads as a native list item rather than a cover card, and
 * scales down inside narrow containers such as the placement previews.
 */
export const SponsorListItem = ({
  logo,
  name,
  tagline,
  sponsored,
  darkInvert = false,
  className,
}: {
  logo?: string;
  name: ReactNode;
  tagline?: ReactNode;
  sponsored: ReactNode;
  darkInvert?: boolean;
  className?: string;
}) => (
  <span
    className={cn(
      "@container flex min-w-0 flex-1 items-center gap-2 @min-[17rem]:gap-2.5",
      className
    )}
  >
    <span className="bg-background shadow-outline flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md p-0.5 @min-[17rem]:size-9 @min-[17rem]:rounded-lg @min-[17rem]:p-1">
      {logo && (
        <img
          src={logo}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={cn(
            "size-full object-contain",
            darkInvert && "dark:invert"
          )}
        />
      )}
    </span>
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-[11px] font-medium tracking-tight @min-[17rem]:text-sm">
          {name}
        </span>
        <span className="text-muted-foreground hidden shrink-0 text-[10px] font-medium tracking-wide uppercase @min-[13rem]:inline">
          {sponsored}
        </span>
      </span>
      {tagline && (
        <span className="text-muted-foreground hidden truncate text-xs @min-[17rem]:block">
          {tagline}
        </span>
      )}
    </span>
    <ArrowRightUp
      aria-hidden="true"
      className="text-muted-foreground hidden size-4 shrink-0 @min-[9rem]:block"
    />
  </span>
);
