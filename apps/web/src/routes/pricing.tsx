import { Link, createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { ArrowRight } from "reicon-react/icons/ArrowRight";

import { HeroHeader, PageMain } from "@/components/page";
import { BillingToggle, PlanCards } from "@/components/pricing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PLAN_BILLINGS } from "@/constants/plans";
import type { PlanBilling } from "@/constants/plans";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { planJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";
import { getLandingData } from "@/server/functions";
import { getMyPlan } from "@/server/plan-functions";

interface PricingSearch {
  /** Omitted for monthly, the default tab. */
  billing?: Exclude<PlanBilling, "monthly">;
}

const routeApi = getRouteApi("/pricing");

const linkClass = "text-foreground underline underline-offset-4";

const Pricing = () => {
  const content = useIntlayer("pricing-page");
  const { signedIn, access } = routeApi.useLoaderData();
  const { billing = "monthly" } = routeApi.useSearch();

  return (
    <>
      <SiteHeader signedIn={signedIn} />
      <PageMain width="full" className="items-center gap-16">
        <HeroHeader
          title={content.title}
          intro={content.intro}
          actions={<BillingToggle billing={billing} />}
        />
        <section
          aria-label={content.plans.value}
          className="flex w-full max-w-4xl flex-col items-center gap-6"
        >
          <PlanCards billing={billing} access={access} />
          <p className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-pretty">
            {content.free}
            <Link
              to={ROUTES.HOME}
              className="text-foreground inline-flex items-center gap-1 font-medium hover:underline"
            >
              {content.browseGallery}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </p>
        </section>
        <section
          aria-labelledby="faq"
          className="flex w-full max-w-3xl flex-col gap-6"
        >
          <h2 id="faq" className="text-xl font-semibold tracking-tight">
            {content.faq}
          </h2>
          <Accordion>
            {content.faqs.map((faq) => (
              <AccordionItem
                key={faq.question.value}
                value={faq.question.value}
              >
                {/* Roomier rows here only; the shared trigger keeps its default padding. */}
                {/* oxlint-disable-next-line shadcn/no-restyle */}
                <AccordionTrigger className="py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Link to={ROUTES.REFUNDS} className={`${linkClass} text-sm`}>
            {content.refundPolicy}
          </Link>
        </section>
      </PageMain>
      <SiteFooter />
    </>
  );
};

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  validateSearch: (search): PricingSearch => {
    const billing = PLAN_BILLINGS.find((option) => option === search.billing);
    return { billing: billing === "monthly" ? undefined : billing };
  },
  loader: async () => {
    const [landing, access] = await Promise.all([
      getLandingData(),
      getMyPlan(),
    ]);
    return { ...landing, access };
  },
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.PRICING,
      title: "Pricing",
      description: `${SITE.NAME} Pro and Business: the full Moves library with every prompt, the Pro agent skill and every update. Pro from $9.99 a month, $79 a year or $149 once; Business with 3 seats from $29 a month.`,
    }),
    scripts: planJsonLd(),
  }),
});
