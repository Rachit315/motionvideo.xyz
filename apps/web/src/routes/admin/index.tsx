import { createFileRoute, redirect } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    throw redirect({ to: ROUTES.ADMIN_SUBMISSIONS });
  },
});
