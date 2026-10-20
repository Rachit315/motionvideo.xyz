import { createFileRoute, redirect } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";

// Settings moved under /dashboard.
export const Route = createFileRoute("/settings")({
  beforeLoad: () => {
    throw redirect({
      to: ROUTES.DASHBOARD_SETTINGS,
      search: true,
      statusCode: 301,
    });
  },
});
