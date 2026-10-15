import { Link } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";

import { CollectionGrid } from "@/components/collection-grid";
import { CollectionIntro } from "@/components/collection-intro";
import {
  CategoryChip,
  CollectionToolbar,
} from "@/components/collection-toolbar";
import { DIRECTORY_COVER_RATIO } from "@/components/directory-card";
import { FadeScroller } from "@/components/fade-scroller";
import { JobCard, PostJobCard } from "@/components/job-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SponsoredCard, sponsoredTileIndex } from "@/components/sponsored-card";
import { buttonVariants } from "@/components/ui/button";
import type { MasonryItem } from "@/components/virtual-masonry";
import { JOB_TYPES } from "@/constants/jobs";
import type { JobType } from "@/constants/jobs";
import { ROUTES } from "@/constants/routes";
import { useLaneCount } from "@/hooks/use-lane-count";
import type { JobListing } from "@/server/job-functions";

// Same shell as Tools, Skills and Extras: type chips, then the masonry with
// the intro tile first and the sponsored tile in the first row.
export const JobsBoard = ({
  signedIn,
  jobs,
  type,
}: {
  signedIn: boolean;
  jobs: JobListing[];
  /** The type page being shown; `undefined` on /jobs. */
  type: JobType | undefined;
}) => {
  const content = useIntlayer("jobs-page");
  const lanes = useLaneCount();
  const filtered = type ? jobs.filter((job) => job.type === type) : jobs;

  const intro = (
    <CollectionIntro
      titleId="jobs-intro-title"
      title={type ? content.typeHeadings[type] : content.heroTitle}
      description={type ? content.typeDescriptions[type] : content.heroIntro}
      actions={
        <Link
          to={ROUTES.JOBS_POST}
          data-track="job_post_start"
          data-track-from="board"
          className={buttonVariants({ variant: "gradient", size: "lg" })}
        >
          {content.postJob}
          <ArrowRightUp aria-hidden="true" />
        </Link>
      }
      sponsorCategory={undefined}
    />
  );
  const cards: MasonryItem[] = [
    ...filtered.map((job) => ({
      key: job.id,
      aspectRatio: DIRECTORY_COVER_RATIO,
      node: <JobCard job={job} />,
    })),
    // Always one open slot at the end, so an empty board is one small tile.
    {
      key: "post-a-job",
      aspectRatio: DIRECTORY_COVER_RATIO,
      node: <PostJobCard />,
    },
  ];
  const items: MasonryItem[] = [{ key: "intro", node: intro }, ...cards];
  const sponsoredIndex = sponsoredTileIndex(lanes, cards.length);
  items.splice(sponsoredIndex, 0, {
    key: "sponsored",
    aspectRatio: DIRECTORY_COVER_RATIO,
    node: <SponsoredCard category={undefined} />,
  });

  return (
    <>
      <SiteHeader signedIn={signedIn} />
      <CollectionToolbar>
        <FadeScroller
          label={content.filterType.value}
          className="-mx-1 -my-1 min-w-0 basis-full px-1 py-1 lg:basis-[65%]"
        >
          {[undefined, ...JOB_TYPES].map((value) => (
            <CategoryChip
              key={value ?? "all"}
              {...(value
                ? { to: "/jobs/$type", params: { type: value } }
                : { to: ROUTES.JOBS })}
              activeOptions={{ exact: true, includeSearch: false }}
              active={value === type}
              activeVariant={value ? "default" : "outline"}
              label={value ? content.types[value] : content.all}
              count={
                value
                  ? jobs.filter((job) => job.type === value).length
                  : jobs.length
              }
            />
          ))}
        </FadeScroller>
      </CollectionToolbar>
      <CollectionGrid items={items} />
      <SiteFooter />
    </>
  );
};
