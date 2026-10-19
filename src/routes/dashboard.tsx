import { Outlet, createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createMetadata } from "@/seo/metadata";

// Every account page lives under /dashboard and shares the site chrome. The
// pages themselves own their headings and content.
const DashboardLayout = () => (
  <>
    <SiteHeader signedIn />
    <Outlet />
    <SiteFooter />
  </>
);

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  // Account pages are never indexed; children keep their own titles.
  head: () => createMetadata({ noIndex: true, title: "Dashboard" }),
});
