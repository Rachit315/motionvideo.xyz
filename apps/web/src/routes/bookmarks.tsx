import { createFileRoute, redirect } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";

// Bookmarks moved under /dashboard.
export const Route = createFileRoute("/bookmarks")({
  beforeLoad: () => {
    throw redirect({
      to: ROUTES.DASHBOARD_BOOKMARKS,
      search: true,
      statusCode: 301,
    });
  },
});
