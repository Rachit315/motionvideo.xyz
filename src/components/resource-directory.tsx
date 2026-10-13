import { useState } from "react";
import { useIntlayer } from "react-intlayer";
import type { IntlayerNode } from "react-intlayer";
import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";

import { CollectionGrid } from "@/components/collection-grid";
import { CollectionIntro } from "@/components/collection-intro";
import {
  CategoryChip,
  CollectionToolbar,
} from "@/components/collection-toolbar";
import { FadeScroller } from "@/components/fade-scroller";
import { SponsoredCard } from "@/components/sponsored-card";
import type { MasonryItem } from "@/components/virtual-masonry";
import { useLaneCount } from "@/hooks/use-lane-count";
import { DIRECTORY_CATEGORIES, DIRECTORY_ENTRIES } from "@/lib/directories";
import type {
  DirectoryCategory,
  DirectoryEntry,
  DirectoryKind,
} from "@/lib/directories";

// Covers are imported at 960×540.
const COVER_RATIO = 16 / 9;

// "All" and each category are their own pages: /tools, /tools/ai, /skills…
const SECTION_ROUTES = {
  tool: { all: "/tools", category: "/tools/$category" },
  studio: { all: "/creatives", category: "/creatives/$category" },
  skill: { all: "/skills", category: "/skills/$category" },
  extra: { all: "/extras", category: "/extras/$category" },
} as const satisfies Record<DirectoryKind, { all: string; category: string }>;

const DirectoryCard = ({
  entry,
  categoryLabel,
  label,
}: {
  entry: DirectoryEntry;
  /** Hover badge; omitted on sections without categories. */
  categoryLabel: string | undefined;
  label: string;
}) => {
  const [broken, setBroken] = useState(false);

  return (
    <a
      href={entry.url}
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
          className="size-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.025]"
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
      <span className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/75 via-transparent to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="flex items-start justify-between gap-2">
          {categoryLabel && (
            <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {categoryLabel}
            </span>
          )}
          <ArrowRightUp
            aria-hidden="true"
            className="ml-auto size-4 text-white"
          />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium tracking-tight text-white">
            {entry.name}
          </span>
          <span lang="en" className="truncate text-xs text-white/75">
            {entry.description}
          </span>
        </span>
      </span>
    </a>
  );
};

export const ResourceDirectory = ({
  kind,
  category,
}: {
  kind: DirectoryKind;
  /** The category page being shown; `undefined` on the "All" page. */
  category: DirectoryCategory | undefined;
}) => {
  const content = useIntlayer("resource-directory");
  const entries = DIRECTORY_ENTRIES[kind];
  const categories: DirectoryCategory[] = DIRECTORY_CATEGORIES[kind];
  // Category copy for this section, keyed by slug.
  const labels: Partial<Record<string, IntlayerNode<string>>> =
    content.labels[kind];
  const headings: Partial<Record<string, IntlayerNode<string>>> =
    content.headings[kind];
  const descriptions: Partial<Record<string, IntlayerNode<string>>> =
    content.descriptions[kind];
  const filtered = category
    ? entries.filter((entry) => entry.category === category.id)
    : entries;

  const surprise = () => {
    const entry = filtered[Math.floor(Math.random() * filtered.length)];
    if (entry) {
      window.open(entry.url, "_blank", "noopener,noreferrer");
    }
  };

  const intro = (
    <CollectionIntro
      titleId="directory-intro-title"
      title={(category && headings[category.slug]) ?? content.titles[kind]}
      description={
        (category && descriptions[category.slug]) ?? content.intros[kind]
      }
      onSurprise={surprise}
      surpriseLabel={content.surprise}
      submitLabel={content.submit[kind]}
      submitSearch={{ kind, category: category?.slug }}
    />
  );

  const cards: MasonryItem[] = filtered.map((entry) => {
    const entryCategory = categories.find(({ id }) => id === entry.category);
    // Sections without chips show no badge.
    const categoryLabel =
      categories.length > 0
        ? ((entryCategory && labels[entryCategory.slug]?.value) ??
          entry.category)
        : undefined;
    return {
      key: entry.id,
      aspectRatio: COVER_RATIO,
      node: (
        <DirectoryCard
          entry={entry}
          categoryLabel={categoryLabel}
          label={`${entry.name}: ${content.visit.value} (${content.newTab.value})`}
        />
      ),
    };
  });
  const items: MasonryItem[] = [{ key: "intro", node: intro }, ...cards];
  // Sponsored tile in the first row's rightmost lane — but when the row
  // isn't full it just follows the last tile instead of floating apart.
  const lanes = useLaneCount();
  let sponsoredIndex = 1 + cards.length;
  if (lanes < 2) {
    sponsoredIndex = 1;
  } else if (sponsoredIndex >= lanes) {
    sponsoredIndex = lanes - 1;
  }
  items.splice(sponsoredIndex, 0, {
    key: "sponsored",
    aspectRatio: COVER_RATIO,
    node: <SponsoredCard />,
  });

  return (
    <>
      {categories.length > 0 && (
        <CollectionToolbar>
          <FadeScroller
            label={content.categories.value}
            className="-mx-1 -my-1 min-w-0 basis-full px-1 py-1 lg:basis-[65%]"
          >
            {[undefined, ...categories].map((value) => {
              const selected = value?.slug === category?.slug;
              const count = value
                ? entries.filter((entry) => entry.category === value.id).length
                : entries.length;
              // "All" stays a white outline when chosen; a chosen category turns yellow.
              const linkProps = value
                ? {
                    to: SECTION_ROUTES[kind].category,
                    params: { category: value.slug },
                  }
                : { to: SECTION_ROUTES[kind].all };
              return (
                <CategoryChip
                  key={value?.slug ?? "all"}
                  {...linkProps}
                  activeOptions={{ exact: true, includeSearch: false }}
                  active={selected}
                  activeVariant={value ? "default" : "outline"}
                  label={value ? labels[value.slug] : content.all}
                  count={count}
                />
              );
            })}
          </FadeScroller>
        </CollectionToolbar>
      )}
      <CollectionGrid items={items} />
    </>
  );
};
