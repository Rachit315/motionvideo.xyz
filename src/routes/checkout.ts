import { createFileRoute } from "@tanstack/react-router";

import { ROUTES } from "@/constants/routes";
import { auth } from "@/server/auth";
import {
  createCheckoutUrl,
  hasPurchased,
  isCheckoutProduct,
} from "@/server/dodo";
import { diamondSoldOut } from "@/server/sponsorships";

const redirect = (location: string): Response =>
  new Response(null, { headers: { Location: location }, status: 303 });

// `?product=skill|diamond|gold|silver` picks from a fixed allowlist of Dodo
// products (default: skill); it cannot select any other product or override
// the launch discount. Existing skill buyers keep their access. Sponsor tiers
// need an account, which owns the placement on /sponsorships.
export const Route = createFileRoute("/checkout")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requested =
          new URL(request.url).searchParams.get("product") ?? "skill";
        const product = isCheckoutProduct(requested) ? requested : "skill";
        const session = await auth.api.getSession({ headers: request.headers });
        const buyer = session
          ? { email: session.user.email, userId: session.user.id }
          : null;
        if (product === "skill") {
          if (buyer && (await hasPurchased(buyer.email))) {
            return redirect(ROUTES.DASHBOARD);
          }
          return redirect(await createCheckoutUrl(product, buyer));
        }
        if (!buyer) {
          const back = `${ROUTES.CHECKOUT}?product=${product}`;
          return redirect(
            `${ROUTES.SIGN_IN}?redirect=${encodeURIComponent(back)}`
          );
        }
        if (product === "diamond" && (await diamondSoldOut())) {
          return redirect(`${ROUTES.SPONSOR}?soldOut=diamond`);
        }
        return redirect(await createCheckoutUrl(product, buyer));
      },
    },
  },
});
