import { useState } from "react";

import { BookmarkButton } from "@/components/bookmark-button";
import { ExternalLinkChip } from "@/components/external-link-chip";
import type { DirectoryEntry, DirectoryKind } from "@/lib/directories";

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
}: {
  kind: DirectoryKind;
  entry: DirectoryEntry;
  /** Hover badge; omitted on sections without categories. */
  categoryLabel: string | undefined;
  label: string;
}) => {
  const [broken, setBroken] = useState(false);

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
        <span className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/75 via-transparent to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 group-focus-visible:opacity-100">
          <span className="flex items-start">
            {categoryLabel && (
              <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                {categoryLabel}
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
          hover or keyboard focus, and kept visible once saved. */}
      <BookmarkButton
        kind={kind}
        id={entry.id}
        variant="outline"
        size="icon-sm"
        className="pointer-events-none absolute top-2.5 right-2.5 rounded-full opacity-0 transition-opacity duration-200 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100 group-hover/card:pointer-events-auto group-hover/card:opacity-100 aria-pressed:pointer-events-auto aria-pressed:opacity-100 motion-reduce:transition-none"
      />
    </div>
  );
};
