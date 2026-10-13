import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";

/**
 * Sticky filter bar shell shared by the gallery and the resource directories.
 * Pass `label` to expose it as a toolbar; otherwise it renders a plain div.
 */
export const CollectionToolbar = ({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) => (
  <div className="bg-background/90 sticky top-0 z-30 backdrop-blur-md">
    <div
      {...(label ? { role: "toolbar", "aria-label": label } : {})}
      className="mx-auto flex w-full max-w-[1800px] items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6"
    >
      {children}
    </div>
  </div>
);

/**
 * Rounded category pill with a count, for the horizontally scrolling filter
 * row. The active pill reads as yellow (`default`); the "All" pill stays a
 * white outline when active via `activeVariant="outline"`.
 *
 * Link props stay loose (`to` as a plain string) so one chip can serve every
 * section's routes; they are forwarded to TanStack's `Link`.
 */
export const CategoryChip = ({
  active,
  activeVariant = "default",
  label,
  count,
  to,
  params,
  search,
  activeOptions,
}: {
  active: boolean;
  activeVariant?: "default" | "outline";
  label: ReactNode;
  count: ReactNode;
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string | undefined>;
  activeOptions?: { exact?: boolean; includeSearch?: boolean };
}) => (
  // SAFETY: TanStack's Link is generic over each route's params/search, so the
  // loose per-section props below are asserted at the boundary; every caller
  // passes the `to`/`params`/`search` triple of a real route.
  <Link
    resetScroll={false}
    to={to as never}
    params={params as never}
    search={search as never}
    activeOptions={activeOptions as never}
    aria-current={active ? ("page" as const) : undefined}
    className={cn(
      buttonVariants({
        variant: active ? activeVariant : "secondary",
      }),
      "rounded-full px-3",
      !active && "text-muted-foreground"
    )}
  >
    {label}
    <span className="text-xs tabular-nums opacity-60">{count}</span>
  </Link>
);
