import {
  Link,
  createFileRoute,
  getRouteApi,
  redirect,
} from "@tanstack/react-router";
import { useState } from "react";
import { useIntlayer, useLocale } from "react-intlayer";
import { Briefcase } from "reicon-react/icons/Briefcase";
import { CheckCircle } from "reicon-react/icons/CheckCircle";
import { z } from "zod";

import { CompanyLogo } from "@/components/company-logo";
import { AccountPageHeader, PageMain } from "@/components/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { getMyJobPosts, startJobCheckout } from "@/server/job-functions";
import type { MyJobPost } from "@/server/job-functions";

const routeApi = getRouteApi("/listings");

const ListingRow = ({ post }: { post: MyJobPost }) => {
  const content = useIntlayer("jobs-page");
  const { locale } = useLocale();
  const [paying, setPaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const live = post.status === "approved" && !post.expired;
  const label: string = post.expired
    ? content.status.expired.value
    : content.status[post.status].value;
  const status =
    live && post.expiresAt
      ? `${label} ${new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(post.expiresAt)}`
      : label;
  const editable = post.status === "draft" || post.status === "rejected";

  const pay = async () => {
    setPaying(true);
    setFailed(false);
    try {
      window.location.assign(await startJobCheckout({ data: { id: post.id } }));
    } catch {
      setPaying(false);
      setFailed(true);
    }
  };

  return (
    <li className="bg-card shadow-outline flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <CompanyLogo job={post} className="size-10 rounded-lg" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium">{post.title}</span>
          <span className="text-muted-foreground truncate text-sm">
            {post.company} · {content.plans[post.plan].name}
          </span>
        </div>
        <Badge variant={live ? "default" : "outline"}>{status}</Badge>
      </div>
      {post.status === "rejected" && post.reviewNote && (
        <p className="bg-muted/60 rounded-xl p-3 text-sm whitespace-pre-line">
          <span className="text-muted-foreground">{content.reviewNote}</span>{" "}
          {post.reviewNote}
        </p>
      )}
      {editable && (
        <div className="flex flex-wrap gap-2">
          <Link
            to={ROUTES.JOBS_POST}
            search={{ job: post.id }}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {content.edit}
          </Link>
          {post.status === "draft" && (
            <Button size="sm" onClick={pay} disabled={paying}>
              {content.pay}
            </Button>
          )}
        </div>
      )}
      {failed && (
        <p role="alert" className="text-destructive text-sm">
          {content.errorCheckout}
        </p>
      )}
    </li>
  );
};

const Listings = () => {
  const content = useIntlayer("jobs-page");
  const { posts } = routeApi.useLoaderData();
  const { job } = routeApi.useSearch();
  // Back from a successful Dodo checkout (the loader synced the payment).
  const justPaid = posts.some(
    (post) => post.id === job && post.status === "pending"
  );

  return (
    <>
      <SiteHeader signedIn />
      <PageMain width="narrow">
        <AccountPageHeader
          title={content.listingsTitle}
          intro={content.listingsIntro}
          actions={
            // Only with posts; the empty state carries its own button.
            posts.length > 0 && (
              <Link to={ROUTES.JOBS_POST} className={buttonVariants()}>
                {content.postJob}
              </Link>
            )
          }
        />
        {justPaid && (
          <section
            aria-live="polite"
            className="bg-card shadow-outline flex items-start gap-3 rounded-2xl p-5"
          >
            <CheckCircle
              aria-hidden="true"
              className="mt-0.5 size-6 shrink-0"
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">{content.paidTitle}</h2>
              <p className="text-muted-foreground text-sm">
                {content.paidBody}
              </p>
            </div>
          </section>
        )}
        {posts.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <ListingRow key={`${post.id}-${post.status}`} post={post} />
            ))}
          </ul>
        ) : (
          <Empty className="bg-muted/40 rounded-2xl">
            <EmptyHeader>
              <EmptyMedia>
                <Briefcase
                  aria-hidden="true"
                  className="text-muted-foreground size-7"
                />
              </EmptyMedia>
              <EmptyTitle>{content.listingsEmpty}</EmptyTitle>
              <EmptyDescription>{content.listingsEmptyBody}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link to={ROUTES.JOBS_POST} className={buttonVariants()}>
                {content.postJob}
              </Link>
            </EmptyContent>
          </Empty>
        )}
      </PageMain>
      <SiteFooter />
    </>
  );
};

interface ListingsSearch {
  job?: string;
  payment_id?: string;
}

const idSchema = z.string().min(1).max(100);

export const Route = createFileRoute("/listings")({
  component: Listings,
  head: () =>
    createMetadata({
      canonical: ROUTES.LISTINGS,
      noIndex: true,
      title: "Listings",
    }),
  // Dodo appends `payment_id` (and its own `status`, re-read from the API).
  validateSearch: (search): ListingsSearch => ({
    job: idSchema.safeParse(search.job).data,
    payment_id: idSchema.safeParse(search.payment_id).data,
  }),
  loaderDeps: ({ search }) => ({ paymentId: search.payment_id }),
  loader: async ({ deps, location }) => {
    const mine = await getMyJobPosts({ data: { paymentId: deps.paymentId } });
    if (!mine) {
      throw redirect({
        search: { redirect: location.href },
        to: ROUTES.SIGN_IN,
      });
    }
    return mine;
  },
});
