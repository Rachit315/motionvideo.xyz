import { useState } from "react";
import { useLocale } from "react-intlayer";
import { Star } from "reicon-react/icons/Star";

import { BookmarkButton } from "@/components/bookmark-button";
import { ExternalLinkChip } from "@/components/external-link-chip";
import type { DirectoryEntry, DirectoryKind } from "@/lib/directories";
import { cn } from "@/lib/utils";

// Covers are imported at 960×540.
export const DIRECTORY_COVER_RATIO = 16 / 9;

/**
 * A directory entry's cover tile, linking out to the entry's site, with a
 * bookmark button over its corner.
 */
export const DirectoryCard = ({
  kind,
  entry,
  categoryLabel,
  label,
  bookmarkAlwaysVisible = false,
}: {
  kind: DirectoryKind;
  entry: DirectoryEntry;
  /** Hover badge; omitted on sections without categories. */
  categoryLabel: string | undefined;
  label: string;
  /** Keep the bookmark visible instead of revealing it with the card hover. */
  bookmarkAlwaysVisible?: boolean;
}) => {
  const [broken, setBroken] = useState(false);
  const { locale } = useLocale();

  return (
    <div className="group/card relative">
      <a
        href={entry.url}
        data-track="directory_open"
        data-track-kind={kind}
        data-track-id={entry.id}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="group bg-muted shadow-outline focus-visible:ring-ring relative block aspect-video overflow-hidden rounded-xl outline-none focus-visible:ring-2"
      >
        {entry.cover && !broken ? (
          <img
            src={entry.cover}
            alt=""
            width={960}
            height={540}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setBroken(true)}
            className="size-full object-cover transition-transform duration-300 motion-safe:group-hover/card:scale-[1.025]"
          />
        ) : (
          <span
            className="flex size-full items-center justify-center"
            aria-hidden="true"
          >
            <span className="bg-background text-muted-foreground flex size-12 items-center justify-center rounded-full text-lg font-medium">
              {entry.name.slice(0, 1).toUpperCase()}
            </span>
          </span>
        )}
        <span className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/75 via-transparent to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
          <span className="flex items-start gap-1.5">
            {categoryLabel && (
              <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                {categoryLabel}
              </span>
            )}
            {entry.stars !== undefined && (
              <span className="flex items-center gap-0.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white tabular-nums backdrop-blur-sm">
                <Star aria-hidden="true" className="size-2.5" />
                {new Intl.NumberFormat(locale, { notation: "compact" }).format(
                  entry.stars
                )}
              </span>
            )}
          </span>
          <span className="flex items-end gap-2">
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium tracking-tight text-white">
                {entry.name}
              </span>
              <span lang="en" className="truncate text-xs text-white/75">
                {entry.description}
              </span>
            </span>
            <ExternalLinkChip />
          </span>
        </span>
      </a>
      {/* A sibling of the link (buttons can't nest in a link); shown on
          hover or keyboard focus. The bookmark stays visible on the
          Bookmarks page. */}
      <BookmarkButton
        kind={kind}
        id={entry.id}
        variant="outline"
        size="icon-sm"
        className={cn(
          "absolute top-2.5 right-2.5 rounded-full transition-opacity duration-200",
          bookmarkAlwaysVisible
            ? "pointer-events-auto"
            : "pointer-events-none opacity-0 group-hover/card:pointer-events-auto group-hover/card:opacity-100 group-has-[:focus-visible]/card:pointer-events-auto group-has-[:focus-visible]/card:opacity-100 motion-reduce:transition-none [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100"
        )}
      />
    </div>
  );
};
