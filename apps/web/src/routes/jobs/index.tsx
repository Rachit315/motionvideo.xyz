import { createFileRoute, getRouteApi } from "@tanstack/react-router";

import { JobsBoard } from "@/components/jobs-board";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { createMetadata } from "@/seo/metadata";
import { getLandingData } from "@/server/functions";
import { getJobs } from "@/server/job-functions";

const routeApi = getRouteApi("/jobs/");

const Jobs = () => {
  const { signedIn, jobs } = routeApi.useLoaderData();
  return <JobsBoard signedIn={signedIn} jobs={jobs} type={undefined} />;
};

export const Route = createFileRoute("/jobs/")({
  component: Jobs,
  head: () =>
    createMetadata({
      canonical: ROUTES.JOBS,
      description: `Motion design, creative developer and video engineering jobs, posted on ${SITE.NAME}.`,
      title: "Motion design jobs",
    }),
  loader: async () => {
    const [landing, jobs] = await Promise.all([getLandingData(), getJobs()]);
    return { ...landing, jobs };
  },
});
