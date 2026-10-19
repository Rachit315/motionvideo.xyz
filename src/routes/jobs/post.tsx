import { createFileRoute, redirect } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";

// Posting a job moved under /dashboard.
export const Route = createFileRoute("/jobs/post")({
  beforeLoad: () => {
    throw redirect({
      to: ROUTES.DASHBOARD_JOBS_POST,
      search: true,
      statusCode: 301,
    });
  },
});
