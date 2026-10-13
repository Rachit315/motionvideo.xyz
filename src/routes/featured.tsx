import {
  Link,
  createFileRoute,
  getRouteApi,
  redirect,
} from "@tanstack/react-router";
import { useIntlayer, useLocale } from "react-intlayer";
import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";
import { Sparkles } from "reicon-react/icons/Sparkles";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ROUTES } from "@/constants/routes";
import { createMetadata } from "@/seo/metadata";
import type { MySubmission } from "@/server/community-functions";
import { getMySubmissions } from "@/server/community-functions";

const routeApi = getRouteApi("/featured");

const relativeDate = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(date);

const SubmissionCard = ({
  submission,
  locale,
  underReview,
}: {
  submission: MySubmission;
  locale: string;
  underReview: string;
}) => (
  <article className="bg-card shadow-outline flex flex-col gap-2 rounded-2xl p-5">
    <div className="flex items-center gap-2">
      <Badge className="capitalize">{submission.kind}</Badge>
      <Badge variant="secondary">
        {submission.status === "pending" ? underReview : submission.status}
      </Badge>
      <time
        dateTime={submission.createdAt.toISOString()}
        className="text-muted-foreground ml-auto text-xs"
      >
        {relativeDate(submission.createdAt, locale)}
      </time>
    </div>
    <h2 className="text-lg font-semibold tracking-tight">{submission.title}</h2>
    <p className="text-muted-foreground line-clamp-2 text-sm">
      {submission.description}
    </p>
    <a
      href={submission.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-1 self-start`}
    >
      {submission.url.replace(/^https?:\/\//u, "").split("/")[0]}
      <ArrowRightUp aria-hidden="true" />
    </a>
  </article>
);

const Featured = () => {
  const content = useIntlayer("featured-page");
  const { locale } = useLocale();
  const submissions = routeApi.useLoaderData();
  return (
    <>
      <SiteHeader signedIn />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-6 px-4 pt-6 pb-16 sm:px-6"
      >
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {content.title}
          </h1>
          <p className="text-muted-foreground text-sm">{content.intro}</p>
        </header>
        {submissions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                locale={locale}
                underReview={content.underReview.value}
              />
            ))}
          </div>
        ) : (
          <Empty className="bg-muted/40 rounded-2xl">
            <EmptyHeader>
              <EmptyMedia>
                <Sparkles
                  aria-hidden="true"
                  className="text-muted-foreground size-7"
                />
              </EmptyMedia>
              <EmptyTitle>{content.emptyTitle}</EmptyTitle>
              <EmptyDescription>{content.emptyDescription}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link
                to={ROUTES.SUBMIT}
                className={buttonVariants({ variant: "gradient" })}
              >
                {content.submit}
              </Link>
            </EmptyContent>
          </Empty>
        )}
      </main>
      <SiteFooter />
    </>
  );
};

export const Route = createFileRoute("/featured")({
  component: Featured,
  head: () =>
    createMetadata({
      canonical: ROUTES.FEATURED,
      noIndex: true,
      title: "Featured",
    }),
  loader: async () => {
    const submissions = await getMySubmissions();
    if (!submissions) {
      throw redirect({
        search: { redirect: ROUTES.FEATURED },
        to: ROUTES.SIGN_IN,
      });
    }
    return submissions;
  },
});
