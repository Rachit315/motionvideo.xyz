import { createFileRoute, getRouteApi, notFound } from "@tanstack/react-router";

import { JobsBoard } from "@/components/jobs-board";
import { JOB_TYPES } from "@/constants/jobs";
import type { JobType } from "@/constants/jobs";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { createMetadata } from "@/seo/metadata";
import { getLandingData } from "@/server/functions";
import { getJobs } from "@/server/job-functions";

const routeApi = getRouteApi("/jobs/$type");

// English head tags per type page; the on-page copy is translated.
const TYPE_META: Record<JobType, { title: string; noun: string }> = {
  "full-time": { title: "Full-time motion design jobs", noun: "Full-time" },
  "part-time": { title: "Part-time motion design jobs", noun: "Part-time" },
  contract: { title: "Contract motion design jobs", noun: "Contract" },
  freelance: { title: "Freelance motion design jobs", noun: "Freelance" },
};

const JobsOfType = () => {
  const { signedIn, jobs, type } = routeApi.useLoaderData();
  return <JobsBoard signedIn={signedIn} jobs={jobs} type={type} />;
};

// /jobs/full-time, /jobs/part-time, /jobs/contract, /jobs/freelance. Unknown
// types 404; /jobs/post is its own (static) route and wins over this one.
export const Route = createFileRoute("/jobs/$type")({
  component: JobsOfType,
  loader: async ({ params }) => {
    const type = JOB_TYPES.find((value) => value === params.type);
    if (!type) {
      throw notFound();
    }
    const [landing, jobs] = await Promise.all([getLandingData(), getJobs()]);
    return { ...landing, jobs, type };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    const meta = TYPE_META[loaderData.type];
    return createMetadata({
      canonical: `${ROUTES.JOBS}/${loaderData.type}`,
      description: `${meta.noun} motion design, creative developer and video engineering jobs, posted on ${SITE.NAME}.`,
      title: meta.title,
    });
  },
});
