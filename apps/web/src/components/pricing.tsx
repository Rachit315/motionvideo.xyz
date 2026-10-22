import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useIntlayer } from "react-intlayer";
import { Check } from "reicon-react/icons/Check";
import { InfoCircle } from "reicon-react/icons/InfoCircle";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLAN_BILLINGS, PLAN_PRICE_CENTS, PLANS } from "@/constants/plans";
import type { Plan, PlanAccess, PlanBilling } from "@/constants/plans";
import { formatUsd } from "@/constants/pricing";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

/**
 * Monthly | Annual | Lifetime as links that set `?billing=`, so each tab is
 * a shareable URL and works before hydration. Monthly is the bare /pricing.
 */
export const BillingToggle = ({ billing }: { billing: PlanBilling }) => {
  const content = useIntlayer("pricing");
  let note: ReactNode = null;
  if (billing === "annual") {
    note = content.annualNote;
  } else if (billing === "lifetime") {
    note = content.lifetimeNote;
  }
  return (
    <div className="flex flex-col items-center gap-3 sm:relative sm:block">
      <nav
        aria-label={content.billingPeriod.value}
        className="bg-muted inline-flex items-center rounded-xl p-1"
      >
        {PLAN_BILLINGS.map((option) => (
          <Link
            key={option}
            to={ROUTES.PRICING}
            search={{ billing: option === "monthly" ? undefined : option }}
            replace
            resetScroll={false}
            // Monthly's `billing: undefined` would otherwise match every
            // billing; TanStack sets aria-current="page" on the active link.
            activeOptions={{ explicitUndefined: true }}
            className="text-muted-foreground hover:text-foreground aria-[current]:bg-background aria-[current]:text-foreground dark:aria-[current]:bg-input/30 focus-visible:ring-ring/50 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 aria-[current]:shadow-sm"
          >
            {content.billing[option]}
          </Link>
        ))}
      </nav>
      {/* From sm up the note hangs off the toggle's right edge, so the toggle
          itself stays centred; on mobile it sits below it. */}
      {note && (
        <span className="text-primary text-sm font-medium whitespace-nowrap sm:absolute sm:top-1/2 sm:left-full sm:ml-3 sm:-translate-y-1/2">
          {note}
        </span>
      )}
    </div>
  );
};

const PlanCard = ({
  plan,
  billing,
  access,
}: {
  plan: Plan;
  billing: PlanBilling;
  access: PlanAccess | null;
}) => {
  const content = useIntlayer("pricing");
  const copy = content.plans[plan];
  // Business has no lifetime option: its card stays visible but dimmed, at
  // its monthly price, so the two plans can still be compared.
  const offered = PLAN_PRICE_CENTS[plan][billing] !== undefined;
  const shown = offered ? billing : "monthly";
  const current = access?.plan === plan;
  const featured = plan === "pro";

  let cta = (
    <Button size="xl" variant="secondary" disabled className="w-full">
      {copy.cta}
    </Button>
  );
  if (current) {
    cta = (
      <Link
        to={ROUTES.DASHBOARD_BILLING}
        className={buttonVariants({
          className: "w-full",
          size: "xl",
          variant: "outline",
        })}
      >
        {content.currentPlan}
      </Link>
    );
  } else if (offered) {
    cta = (
      <a
        href={`${ROUTES.CHECKOUT}?plan=${plan}&billing=${billing}`}
        data-track="checkout_start"
        data-track-plan={plan}
        data-track-billing={billing}
        className={buttonVariants({
          className: "w-full",
          size: "xl",
          variant: featured ? "gradient" : "secondary",
        })}
      >
        {copy.cta}
      </a>
    );
  }

  return (
    <Card
      size="lg"
      aria-disabled={offered ? undefined : true}
      className={cn(
        "w-full",
        featured && "ring-primary ring-2",
        !offered && "opacity-60"
      )}
    >
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              {copy.name}
              {offered && billing === "annual" && (
                <Badge variant="secondary">{content.save[plan]}</Badge>
              )}
            </h2>
            <p className="text-muted-foreground text-sm">{copy.audience}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="flex items-baseline gap-1.5">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">
                {formatUsd(PLAN_PRICE_CENTS[plan][shown] ?? 0)}
              </span>
              <span className="text-muted-foreground text-sm">
                {content.unit[shown]}
              </span>
            </p>
            <p className="text-muted-foreground text-sm">
              {offered ? content.billed[billing] : content.monthlyOrAnnualOnly}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="flex flex-col gap-3 text-sm">
          {Object.entries(content.perks[plan]).map(([key, perk]) => (
            <li key={key} className="flex gap-2">
              <Check
                aria-hidden="true"
                className="text-primary mt-0.5 size-4 shrink-0"
              />
              <span>
                {perk}
                {/* MCP sign-in isn't live yet, so the MCP line says so. */}
                {key === "mcp" && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          aria-label={content.mcpNote.value}
                          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 ml-1 inline-flex translate-y-0.5 rounded-full outline-none focus-visible:ring-3"
                        />
                      }
                    >
                      <InfoCircle aria-hidden="true" className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>{content.mcpNote}</TooltipContent>
                  </Tooltip>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent pt-0">{cta}</CardFooter>
    </Card>
  );
};

/** Pro and Business side by side (stacked on mobile) for one billing option. */
export const PlanCards = ({
  billing,
  access,
}: {
  billing: PlanBilling;
  access: PlanAccess | null;
}) => (
  <ul className="grid w-full gap-4 md:grid-cols-2">
    {PLANS.map((plan) => (
      <li key={plan} className="flex">
        <PlanCard plan={plan} billing={billing} access={access} />
      </li>
    ))}
  </ul>
);
