import { createFileRoute } from "@tanstack/react-router";

import { localeFromPath, localizedPath } from "@/constants/locales";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/server/auth";
import { createCheckoutUrl, hasPurchased } from "@/server/dodo";

const redirect = (location: string): Response =>
  new Response(null, { headers: { Location: location }, status: 303 });

// Checkout for the skill bundle. Sponsorships check out from their form on
// /sponsorships/new, so any other `?product=` goes to the sponsor plans
// instead of silently selling the bundle. Existing buyers keep their access.
export const Route = createFileRoute("/$locale/checkout")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const locale = localeFromPath(url.pathname);
        const product = url.searchParams.get("product");
        if (product !== null && product !== "skill") {
          return redirect(localizedPath(ROUTES.SPONSOR, locale));
        }
        const session = await auth.api.getSession({ headers: request.headers });
        const buyer = session
          ? { email: session.user.email, userId: session.user.id }
          : null;
        if (buyer && (await hasPurchased(buyer.email))) {
          return redirect(localizedPath(ROUTES.DASHBOARD_SKILL, locale));
        }
        return redirect(await createCheckoutUrl(buyer, locale));
      },
    },
  },
});
