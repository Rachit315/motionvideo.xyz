import {
  Link,
  Outlet,
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ROUTES } from "@/constants/routes";
import { createMetadata } from "@/seo/metadata";
import { getAdminAccess } from "@/server/admin-functions";

const tabClass =
  "text-muted-foreground hover:text-foreground rounded-md px-2.5 py-1 text-sm font-medium transition-colors data-[status=active]:bg-muted data-[status=active]:text-foreground";

// Internal moderation, English only. Every admin server function re-checks
// ADMIN_EMAILS; this guard only keeps the pages out of sight.
const Admin = () => (
  <>
    <SiteHeader signedIn />
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-6 pb-16 sm:px-6"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <nav aria-label="Admin sections" className="flex gap-1">
          <Link to={ROUTES.ADMIN_SUBMISSIONS} className={tabClass}>
            Submissions
          </Link>
          <Link to={ROUTES.ADMIN_SPONSORSHIPS} className={tabClass}>
            Sponsorships
          </Link>
          <Link to={ROUTES.ADMIN_JOBS} className={tabClass}>
            Jobs
          </Link>
          <Link to={ROUTES.ADMIN_FEEDBACK} className={tabClass}>
            Feedback
          </Link>
        </nav>
      </header>
      <Outlet />
    </main>
    <SiteFooter />
  </>
);

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => createMetadata({ noIndex: true, title: "Admin" }),
  beforeLoad: async ({ location }) => {
    const access = await getAdminAccess();
    if (!access.signedIn) {
      throw redirect({
        search: { redirect: location.pathname },
        to: ROUTES.SIGN_IN,
      });
    }
    // Non-admins see a plain 404, not a hint that the page exists.
    if (!access.admin) {
      throw notFound();
    }
  },
});
