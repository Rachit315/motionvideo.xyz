import {
  Link,
  createFileRoute,
  getRouteApi,
  notFound,
} from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";

import {
  LockedPromptPanel,
  MoveBody,
  MoveCard,
  MovePromptPanel,
} from "@/components/moves";
import { PageMain } from "@/components/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { findMove } from "@/lib/moves";
import type { Move } from "@/lib/moves";
import { breadcrumbJsonLd, moveJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";
import { getLandingData } from "@/server/functions";
import {
  getMoveExamples,
  getMovePosters,
  getMovePrompt,
} from "@/server/move-functions";

const routeApi = getRouteApi("/moves/$slug");

const sectionTitle = "text-lg font-semibold tracking-tight";

/**
 * One move. Everything but the prompt is public and server-rendered for
 * search; the prompt is only in the page for Pro and Business accounts.
 */
const MovePage = () => {
  const content = useIntlayer("moves");
  const { move, related, examples, posters, prompt, signedIn } =
    routeApi.useLoaderData();

  return (
    <>
      <SiteHeader signedIn={signedIn} />
      <PageMain width="narrow" className="gap-10">
        <header className="flex flex-col gap-3 pt-4">
          <nav aria-label={content.breadcrumb.value} className="text-sm">
            <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5">
              <li>
                <Link to={ROUTES.MOVES} className="hover:text-foreground">
                  {content.moves}
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link
                  to={ROUTES.MOVES}
                  search={{ family: move.family }}
                  className="hover:text-foreground"
                >
                  {content.familyLabels[move.family]}
                </Link>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {move.name}
          </h1>
          <p className="text-muted-foreground text-lg text-pretty">
            {move.summary}
          </p>
          {move.aka.length > 0 && (
            <p className="text-muted-foreground text-sm">
              {content.alsoCalled} {move.aka.join(", ")}
            </p>
          )}
        </header>

        {examples.length > 0 && (
          <section aria-labelledby="examples" className="flex flex-col gap-4">
            <h2 id="examples" className={sectionTitle}>
              {content.examples}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {examples.map((video) => (
                <li key={video.slug}>
                  <Link
                    to="/videos/$slug"
                    params={{ slug: video.slug }}
                    className="group flex flex-col gap-2"
                  >
                    <span
                      className="bg-muted shadow-outline block overflow-hidden rounded-xl"
                      style={{
                        aspectRatio: `${video.width} / ${video.height}`,
                      }}
                    >
                      <img
                        src={video.poster}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </span>
                    <span className="text-sm">
                      <span className="font-medium group-hover:underline">
                        {video.title}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        @{video.handle}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <MoveBody body={move.body} />

        {move.goodFor.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {content.goodFor}
            </span>
            {move.goodFor.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {prompt.locked ? (
          <LockedPromptPanel signedIn={signedIn} slug={move.slug} />
        ) : (
          <MovePromptPanel prompt={prompt.prompt} />
        )}

        {related.length > 0 && (
          <section aria-labelledby="related" className="flex flex-col gap-4">
            <h2 id="related" className={sectionTitle}>
              {content.related}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug} className="flex [&>a]:flex-1">
                  <MoveCard move={item} poster={posters[item.slug]} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="faq" className="flex flex-col gap-4">
          <h2 id="faq" className={sectionTitle}>
            {content.faq}
          </h2>
          <Accordion>
            {content.faqs.map((faq) => (
              <AccordionItem
                key={faq.question.value}
                value={faq.question.value}
              >
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </PageMain>
      <SiteFooter />
    </>
  );
};

export const Route = createFileRoute("/moves/$slug")({
  component: MovePage,
  loader: async ({ params }) => {
    const move = findMove(params.slug);
    if (!move) {
      throw notFound();
    }
    const [landing, prompt, examples, posters] = await Promise.all([
      getLandingData(),
      getMovePrompt({ data: { slug: move.slug } }),
      getMoveExamples({ data: { slug: move.slug } }),
      getMovePosters(),
    ]);
    const related = move.related.flatMap((slug): Move[] => {
      const item = findMove(slug);
      return item ? [item] : [];
    });
    return { ...landing, move, related, prompt, examples, posters };
  },
  head: ({ loaderData, params }) => ({
    ...createMetadata({
      canonical: `${ROUTES.MOVES}/${params.slug}`,
      title: loaderData
        ? `${loaderData.move.name}: motion design move`
        : "Move",
      description: loaderData?.move.summary ?? "A motion design move.",
    }),
    scripts: loaderData
      ? [
          moveJsonLd(loaderData.move),
          breadcrumbJsonLd(
            { name: "Moves", path: ROUTES.MOVES },
            {
              name: loaderData.move.name,
              path: `${ROUTES.MOVES}/${params.slug}`,
            }
          ),
        ]
      : [],
  }),
});
