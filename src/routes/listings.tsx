import { createFileRoute, redirect } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";

// Job listings moved under /dashboard.
export const Route = createFileRoute("/listings")({
  beforeLoad: () => {
    throw redirect({
      to: ROUTES.DASHBOARD_LISTINGS,
      search: true,
      statusCode: 301,
    });
  },
});
