import { createFileRoute } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";
import { auth } from "@/server/auth";
import { createCheckoutUrl, hasPurchased } from "@/server/dodo";

const redirect = (location: string): Response =>
  new Response(null, { headers: { Location: location }, status: 303 });

// Checkout for the skill bundle. Sponsorships check out from their form on
// /sponsorships/new, so any other `?product=` goes to the sponsor plans
// instead of silently selling the bundle. Existing buyers keep their access.
export const Route = createFileRoute("/checkout")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const product = new URL(request.url).searchParams.get("product");
        if (product !== null && product !== "skill") {
          return redirect(ROUTES.SPONSOR);
        }
        const session = await auth.api.getSession({ headers: request.headers });
        const buyer = session
          ? { email: session.user.email, userId: session.user.id }
          : null;
        if (buyer && (await hasPurchased(buyer.email))) {
          return redirect(ROUTES.DASHBOARD_SKILL);
        }
        return redirect(await createCheckoutUrl(buyer));
      },
    },
  },
});
