import { createFileRoute, redirect } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";

// Featured moved under /dashboard.
export const Route = createFileRoute("/featured")({
  beforeLoad: () => {
    throw redirect({
      to: ROUTES.DASHBOARD_FEATURED,
      search: true,
      statusCode: 301,
    });
  },
});
