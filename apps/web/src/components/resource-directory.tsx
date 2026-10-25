import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { useIntlayer, useLocale } from "react-intlayer";
import type { IntlayerNode } from "react-intlayer";
import { ChevronDown } from "reicon-react/icons/ChevronDown";
import { Search } from "reicon-react/icons/Search";

import {
  CollectionEmptyState,
  CollectionGrid,
} from "@/components/collection-grid";
import {
  CollectionIntro,
  SurpriseAndSubmit,
} from "@/components/collection-intro";
import {
  CategoryChip,
  CollectionToolbar,
} from "@/components/collection-toolbar";
import {
  DIRECTORY_COVER_RATIO,
  DirectoryCard,
} from "@/components/directory-card";
import { FadeScroller } from "@/components/fade-scroller";
import { SponsoredCard, sponsoredTileIndex } from "@/components/sponsored-card";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MasonryItem } from "@/components/virtual-masonry";
import { useLaneCount } from "@/hooks/use-lane-count";
import {
  DIRECTORY_CATEGORIES,
  DIRECTORY_ENTRIES,
  DIRECTORY_FILTERS,
  DIRECTORY_SORTS,
  directorySearch,
  filterValuesOf,
  sortDirectoryEntries,
} from "@/lib/directories";
import type {
  DirectoryCategory,
  DirectoryEntry,
  DirectoryKind,
  DirectorySearch,
} from "@/lib/directories";
import { cn } from "@/lib/utils";

// "All" and each category are their own pages: /tools, /tools/ai, /skills…
const SECTION_ROUTES = {
  tool: { all: "/tools", category: "/tools/$category" },
  studio: { all: "/creatives", category: "/creatives/$category" },
  skill: { all: "/skills", category: "/skills/$category" },
  extra: { all: "/extras", category: "/extras/$category" },
} as const satisfies Record<DirectoryKind, { all: string; category: string }>;

interface MenuSection {
  id: "filter" | "sort";
  label: ReactNode;
  value: string;
  options: { value: string; label: ReactNode; disabled?: boolean }[];
  onSelect: (value: string) => void;
}

// The section's facet and its order in one menu, like Discover's filters:
// "All" and "Featured" (the curated order) are the defaults, and the pill
// turns yellow once either moves off them. A facet value with no entries in
// the current category is disabled.
const DirectoryFilters = ({
  kind,
  search,
  inView,
  onChange,
}: {
  kind: DirectoryKind;
  search: DirectorySearch;
  /** Entries of the current category, before the facet is applied. */
  inView: DirectoryEntry[];
  onChange: (search: DirectorySearch) => void;
}) => {
  const content = useIntlayer("resource-directory");
  const sortLabels: Record<string, IntlayerNode<string>> = content.sorts;
  const filterLabels: Record<string, IntlayerNode<string>> = content.filters[
    kind
  ];
  const available = useMemo(
    () => new Set(inView.flatMap((entry) => filterValuesOf(kind, entry))),
    [kind, inView]
  );
  const sections: MenuSection[] = [
    {
      id: "filter",
      label: content.filterLabels[kind],
      value: search.filter ?? "all",
      onSelect: (value) =>
        onChange({
          ...search,
          filter: DIRECTORY_FILTERS[kind].find((filter) => filter === value),
        }),
      options: [
        { value: "all", label: content.all },
        ...DIRECTORY_FILTERS[kind].map((value) => ({
          value,
          label: filterLabels[value],
          disabled: !available.has(value) && search.filter !== value,
        })),
      ],
    },
    {
      id: "sort",
      label: content.sort,
      value: search.sort ?? "featured",
      onSelect: (value) =>
        onChange({
          ...search,
          sort: DIRECTORY_SORTS[kind].find((sort) => sort === value),
        }),
      options: ["featured", ...DIRECTORY_SORTS[kind]].map((value) => ({
        value,
        label: sortLabels[value],
      })),
    },
  ];
  const active = Boolean(search.filter ?? search.sort);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={content.filtersMenu.value}
        className={cn(
          buttonVariants({ variant: active ? "default" : "outline" }),
          "rounded-full px-3",
          active && "shadow-outline"
        )}
      >
        {search.filter && (
          <>
            <span className="max-w-32 truncate">
              {filterLabels[search.filter]}
            </span>
            <span aria-hidden="true" className="opacity-60">
              ·
            </span>
          </>
        )}
        <span className="whitespace-nowrap">
          {sortLabels[search.sort ?? "featured"]}
        </span>
        <ChevronDown aria-hidden="true" className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex w-auto max-w-[calc(100vw-1rem)] flex-col gap-1"
      >
        {sections.map((section) => (
          <div key={section.id} className="contents">
            <DropdownMenuRadioGroup
              className="min-w-44"
              value={section.value}
              onValueChange={(value) => section.onSelect(String(value))}
            >
              <DropdownMenuLabel>{section.label}</DropdownMenuLabel>
              {section.options.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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
  const { locale } = useLocale();
  const entries = DIRECTORY_ENTRIES[kind];
  const categories: DirectoryCategory[] = DIRECTORY_CATEGORIES[kind];
  // Category copy for this section, keyed by slug.
  const labels: Partial<Record<string, IntlayerNode<string>>> =
    content.labels[kind];
  const headings: Partial<Record<string, IntlayerNode<string>>> =
    content.headings[kind];
  const descriptions: Partial<Record<string, IntlayerNode<string>>> =
    content.descriptions[kind];
  // `?filter=` and `?sort=`, validated by each section's layout route; parsed
  // again here because the loose hook types every route's search at once.
  const search: DirectorySearch = directorySearch(kind).parse(
    useSearch({ strict: false })
  );
  const navigate = useNavigate();
  const inCategory = useMemo(
    () =>
      category
        ? entries.filter((entry) => entry.category === category.id)
        : entries,
    [entries, category]
  );
  const filtered = sortDirectoryEntries(
    search.filter
      ? inCategory.filter((entry) =>
          filterValuesOf(kind, entry).includes(search.filter ?? "")
        )
      : inCategory,
    search.sort
  );
  const compact = new Intl.NumberFormat(locale, { notation: "compact" });

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
      actions={
        <SurpriseAndSubmit
          onSurprise={surprise}
          surpriseLabel={content.surprise}
          submitLabel={content.submit[kind]}
          submitSearch={{ kind, category: category?.slug }}
        />
      }
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
      aspectRatio: DIRECTORY_COVER_RATIO,
      node: (
        <DirectoryCard
          kind={kind}
          entry={entry}
          categoryLabel={categoryLabel}
          label={`${entry.name}${entry.stars === undefined ? "" : ` (${compact.format(entry.stars)} ${content.stars.value})`}: ${content.visit.value} (${content.newTab.value})`}
        />
      ),
    };
  });
  const items: MasonryItem[] = [{ key: "intro", node: intro }, ...cards];
  const lanes = useLaneCount();
  const sponsoredIndex = sponsoredTileIndex(lanes, cards.length);
  items.splice(sponsoredIndex, 0, {
    key: "sponsored",
    aspectRatio: DIRECTORY_COVER_RATIO,
    node: <SponsoredCard placement="feed" />,
  });

  return (
    <>
      {categories.length > 0 && (
        <CollectionToolbar>
          <FadeScroller
            label={content.categories.value}
            className="-mx-1 -my-1 min-w-0 flex-1 px-1 py-1 lg:flex-none lg:basis-[65%]"
          >
            {[undefined, ...categories].map((value) => {
              const selected = value?.slug === category?.slug;
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
                  // The filter and order carry over to the other categories.
                  search={{ filter: search.filter, sort: search.sort }}
                  activeOptions={{ exact: true, includeSearch: false }}
                  active={selected}
                  label={value ? labels[value.slug] : content.all}
                />
              );
            })}
          </FadeScroller>
          <div className="ml-auto flex shrink-0 items-center">
            <DirectoryFilters
              kind={kind}
              search={search}
              inView={inCategory}
              onChange={(next) => {
                void navigate({
                  to: ".",
                  search: next,
                  replace: true,
                  resetScroll: false,
                });
              }}
            />
          </div>
        </CollectionToolbar>
      )}
      <CollectionGrid
        items={items}
        emptyState={
          filtered.length === 0 ? (
            <CollectionEmptyState
              icon={Search}
              title={content.noResults}
              description={content.tryAgain}
            />
          ) : undefined
        }
      />
    </>
  );
};
