import { createFileRoute, redirect } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";

// Submitting work moved under /dashboard.
export const Route = createFileRoute("/submit")({
  beforeLoad: () => {
    throw redirect({
      to: ROUTES.DASHBOARD_SUBMIT,
      search: true,
      statusCode: 301,
    });
  },
});
