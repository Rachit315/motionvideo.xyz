import { Link, createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { z } from "zod";

import { CategoryChip } from "@/components/collection-toolbar";
import { MoveCard } from "@/components/moves";
import { HeroHeader, PageMain } from "@/components/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { MOVE_FAMILIES, MOVES, findMoveFamily } from "@/lib/moves";
import type { MoveFamily } from "@/lib/moves";
import { movesJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";
import { getLandingData } from "@/server/functions";
import { getMovePosters } from "@/server/move-functions";

interface MovesSearch {
  family?: MoveFamily;
}

const routeApi = getRouteApi("/moves/");

const counts = Object.fromEntries(
  MOVE_FAMILIES.map((family) => [
    family,
    MOVES.filter((move) => move.family === family).length,
  ])
);

// Every move, filterable by family. The page is public (names, summaries and
// posters are what people search for); each move's prompt is in Pro.
const Moves = () => {
  const content = useIntlayer("moves");
  const { signedIn, posters } = routeApi.useLoaderData();
  const { family } = routeApi.useSearch();
  const shown = family ? MOVES.filter((move) => move.family === family) : MOVES;

  return (
    <>
      <SiteHeader signedIn={signedIn} />
      <PageMain width="full" className="gap-10">
        <HeroHeader
          title={content.title}
          intro={content.intro}
          note={
            <>
              {MOVES.length} {content.movesInLibrary} {content.proNote}{" "}
              <Link
                to={ROUTES.PRICING}
                className="text-foreground underline underline-offset-4"
              >
                {content.seePricing}
              </Link>
            </>
          }
        />
        <nav
          aria-label={content.families.value}
          className="flex flex-wrap justify-center gap-2"
        >
          <CategoryChip
            to={ROUTES.MOVES}
            search={{}}
            active={!family}
            activeVariant="outline"
            label={content.all}
            count={MOVES.length}
          />
          {MOVE_FAMILIES.filter((id) => counts[id] > 0).map((id) => (
            <CategoryChip
              key={id}
              to={ROUTES.MOVES}
              search={{ family: id }}
              active={family === id}
              label={content.familyLabels[id]}
              count={counts[id]}
            />
          ))}
        </nav>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((move) => (
            <li key={move.slug} className="flex [&>a]:flex-1">
              <MoveCard move={move} poster={posters[move.slug]} />
            </li>
          ))}
        </ul>
      </PageMain>
      <SiteFooter />
    </>
  );
};

export const Route = createFileRoute("/moves/")({
  component: Moves,
  validateSearch: (search): MovesSearch => ({
    family: findMoveFamily(z.string().safeParse(search.family).data),
  }),
  loader: async () => {
    const [landing, posters] = await Promise.all([
      getLandingData(),
      getMovePosters(),
    ]);
    return { ...landing, posters };
  },
  // Family filters are views of one page: they all point at /moves.
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.MOVES,
      title: "Motion design moves",
      description: `${MOVES.length} named motion design techniques, from easing and squash and stretch to kinetic type and transitions, each with examples from AI-made videos on ${SITE.NAME}.`,
    }),
    scripts: [movesJsonLd(MOVES)],
  }),
});
