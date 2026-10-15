import { Outlet, createFileRoute } from "@tanstack/react-router";

import { PageMain } from "@/components/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

// Shared shell for text pages (about, brand, contact, legal). Pathless: the
// child routes keep their own URLs, e.g. /terms.
const PagesLayout = () => (
  <>
    <SiteHeader signedIn={false} />
    <PageMain width="narrow" className="gap-10">
      <Outlet />
    </PageMain>
    <SiteFooter />
  </>
);

export const Route = createFileRoute("/_pages")({
  component: PagesLayout,
});
