import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";

import { cn } from "@/lib/utils";

/**
 * The Diamond placement in a video's detail sidebar: the first row of its
 * details list ("Sponsored by" → logo, name, tagline), styled like the
 * Creator / Category rows under it so it reads as part of the page. Render
 * it inside a `<dl>`. With `link`, the logo and name link out to the
 * sponsor; without, it is a static preview.
 *
 * A solid hairline closes the row in place of the next row's dashed border.
 * While several sponsors rotate (`rotation`), it fills with the primary
 * color over each turn, and only the value fades to the next sponsor: the
 * label stays put.
 */
export const SponsorDetailRow = ({
  label,
  logo,
  name,
  tagline,
  darkInvert = false,
  link,
  rotation,
  className,
}: {
  label: ReactNode;
  logo?: string;
  name: ReactNode;
  tagline?: ReactNode;
  darkInvert?: boolean;
  /** Anchor props, including `data-track*` analytics attributes. */
  link?: ComponentPropsWithoutRef<"a"> & Record<`data-${string}`, string>;
  /**
   * Set while sponsors rotate: `key` changes on every turn (restarting the
   * fill and the value's fade).
   */
  rotation?: { key: number };
  /** Overrides the row's spacing and type size (e.g. compact previews). */
  className?: string;
}) => {
  const mark = (
    <>
      <span className="bg-background shadow-outline dark:bg-popover flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-md p-0.5">
        {logo && (
          <img
            src={logo}
            alt=""
            width={20}
            height={20}
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
      <span className="truncate">{name}</span>
      <ArrowRightUp
        aria-hidden="true"
        className="text-muted-foreground size-3.5 shrink-0"
      />
    </>
  );
  return (
    <div
      className={cn(
        // The next row drops its dashed border: this row's hairline closes it.
        "relative flex items-start justify-between gap-4 border-t border-dashed py-2.5 text-sm first:border-t-0 [&+*]:border-t-0",
        className
      )}
    >
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd
        key={rotation?.key}
        className={cn(
          "flex min-w-0 flex-col items-end text-right",
          rotation &&
            "animate-in fade-in duration-500 motion-reduce:animate-none"
        )}
      >
        {link ? (
          <a
            {...link}
            className="focus-visible:ring-ring/50 flex max-w-full min-w-0 items-center gap-1.5 rounded-sm outline-none hover:underline focus-visible:ring-3"
          >
            {mark}
          </a>
        ) : (
          <span className="flex max-w-full min-w-0 items-center gap-1.5">
            {mark}
          </span>
        )}
        {tagline && (
          <span className="text-muted-foreground max-w-full truncate text-xs">
            {tagline}
          </span>
        )}
      </dd>
      <span
        aria-hidden="true"
        className="bg-border absolute inset-x-0 bottom-0 h-px overflow-hidden"
      >
        {rotation && (
          <span
            key={rotation.key}
            className="animate-mv-rotate bg-primary block h-full motion-reduce:hidden"
          />
        )}
      </span>
    </div>
  );
};
