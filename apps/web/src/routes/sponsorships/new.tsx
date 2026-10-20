import { createFileRoute, redirect } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";

// New sponsorship plans moved under /dashboard.
export const Route = createFileRoute("/sponsorships/new")({
  beforeLoad: () => {
    throw redirect({
      to: ROUTES.DASHBOARD_SPONSORSHIPS_NEW,
      search: true,
      statusCode: 301,
    });
  },
});
