import { createFileRoute, redirect } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";

// Sponsorships moved under /dashboard.
export const Route = createFileRoute("/sponsorships/")({
  beforeLoad: () => {
    throw redirect({
      to: ROUTES.DASHBOARD_SPONSORSHIPS,
      search: true,
      statusCode: 301,
    });
  },
});
