import { useIntlayer } from "react-intlayer";
import type { IntlayerNode } from "react-intlayer";

import { CollectionGrid } from "@/components/collection-grid";
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
import type { MasonryItem } from "@/components/virtual-masonry";
import { useLaneCount } from "@/hooks/use-lane-count";
import { DIRECTORY_CATEGORIES, DIRECTORY_ENTRIES } from "@/lib/directories";
import type { DirectoryCategory, DirectoryKind } from "@/lib/directories";

// "All" and each category are their own pages: /tools, /tools/ai, /skills…
const SECTION_ROUTES = {
  tool: { all: "/tools", category: "/tools/$category" },
  studio: { all: "/creatives", category: "/creatives/$category" },
  skill: { all: "/skills", category: "/skills/$category" },
  extra: { all: "/extras", category: "/extras/$category" },
} as const satisfies Record<DirectoryKind, { all: string; category: string }>;

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
          label={`${entry.name}: ${content.visit.value} (${content.newTab.value})`}
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
            className="-mx-1 -my-1 min-w-0 basis-full px-1 py-1 lg:basis-[65%]"
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
                  activeOptions={{ exact: true, includeSearch: false }}
                  active={selected}
                  label={value ? labels[value.slug] : content.all}
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
