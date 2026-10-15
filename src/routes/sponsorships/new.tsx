import { createFileRoute, getRouteApi, redirect } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { useIntlayer } from "react-intlayer";
import { z } from "zod";

import { ChoiceCard } from "@/components/choice-card";
import { FormSection, HeroHeader, PageMain } from "@/components/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  CreativePreview,
  CreativeSections,
  EMPTY_CREATIVE,
} from "@/components/sponsor-creative-fields";
import type { CreativeFields } from "@/components/sponsor-creative-fields";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import {
  SPONSOR_BILLINGS,
  SPONSOR_PRICE_USD,
  SPONSOR_TIERS,
} from "@/constants/sponsors";
import type { SponsorBilling, SponsorTier } from "@/constants/sponsors";
import { track } from "@/lib/analytics";
import { sponsorDraftSchema, tierNeedsCategory } from "@/lib/sponsorships";
import { createMetadata } from "@/seo/metadata";
import {
  getDiamondSoldOut,
  getMySponsorships,
  saveSponsorDraft,
  startSponsorCheckout,
} from "@/server/sponsorship-functions";
import type { MySponsorship } from "@/server/sponsorship-functions";

// Sign in, fill in the plan and the placement, review, then pay on Dodo.
// The draft is saved before checkout, so the creative is ready the moment
// the payment lands; Dodo's cancel URL brings the sponsor back to it.

interface NewSponsorshipSearch {
  tier?: SponsorTier;
  billing?: SponsorBilling;
  /** An unpaid draft to finish. */
  sponsorship?: string;
}

interface DraftFields extends CreativeFields {
  tier: SponsorTier;
  billing: SponsorBilling;
}

type FormError =
  | "validation"
  | "cover"
  | "category"
  | "sold-out"
  | "drafts"
  | "save"
  | "checkout";

const routeApi = getRouteApi("/sponsorships/new");

const fieldsOf = (
  draft: MySponsorship | undefined,
  search: NewSponsorshipSearch,
  diamondSoldOut: boolean
): DraftFields => {
  if (draft) {
    return {
      tier: draft.tier,
      billing: draft.billing,
      name: draft.name ?? "",
      url: draft.url ?? "",
      tagline: draft.tagline ?? "",
      logo: draft.logo ?? "",
      cover: draft.cover ?? "",
      categoryKind: draft.categoryKind,
      category: draft.category,
      darkInvert: draft.darkInvert,
    };
  }
  const fallback: SponsorTier = diamondSoldOut ? "gold" : "diamond";
  const tier =
    search.tier === "diamond" && diamondSoldOut
      ? fallback
      : (search.tier ?? fallback);
  return {
    ...EMPTY_CREATIVE,
    tier,
    billing: search.billing ?? "monthly",
  };
};

const NewSponsorship = () => {
  const content = useIntlayer("sponsorships-page");
  const { email, sponsorships, diamondSoldOut } = routeApi.useLoaderData();
  const search = routeApi.useSearch();
  const draft = sponsorships.find(
    (sponsorship) =>
      sponsorship.id === search.sponsorship && sponsorship.status === "unpaid"
  );
  const [fields, setFields] = useState(() =>
    fieldsOf(draft, search, diamondSoldOut)
  );
  // Set once the draft is saved, so a retry edits it instead of adding one.
  const [savedId, setSavedId] = useState(draft?.id);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const needsCategory = tierNeedsCategory(fields.tier);
  const price = SPONSOR_PRICE_USD[fields.tier];
  const update = (patch: Partial<DraftFields>) =>
    setFields((current) => ({ ...current, ...patch }));

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) {
      return;
    }
    if (!fields.cover.trim()) {
      setError("cover");
      return;
    }
    if (needsCategory && !fields.category) {
      setError("category");
      return;
    }
    const input = sponsorDraftSchema.safeParse({
      id: savedId,
      tier: fields.tier,
      billing: fields.billing,
      name: fields.name,
      url: fields.url,
      tagline: fields.tagline,
      logo: fields.logo,
      cover: fields.cover,
      categoryKind: needsCategory
        ? (fields.categoryKind ?? undefined)
        : undefined,
      category: needsCategory ? (fields.category ?? undefined) : undefined,
      darkInvert: fields.darkInvert,
    });
    if (!input.success) {
      setError("validation");
      return;
    }
    setPending(true);
    setError(null);
    let id: string;
    try {
      const saved = await saveSponsorDraft({ data: input.data });
      if (!saved.ok) {
        setPending(false);
        setError(saved.error);
        return;
      }
      ({ id } = saved);
      setSavedId(id);
    } catch {
      setPending(false);
      setError("save");
      return;
    }
    track("checkout_start", {
      product: `sponsor-${fields.tier}-${fields.billing}`,
    });
    try {
      window.location.assign(await startSponsorCheckout({ data: { id } }));
    } catch {
      setPending(false);
      setError("checkout");
    }
  };

  return (
    <>
      <SiteHeader signedIn />
      <PageMain width="narrow" className="gap-16">
        <HeroHeader
          title={content.checkout.heroTitle}
          intro={content.checkout.heroIntro}
        />

        <form
          onSubmit={onSubmit}
          aria-busy={pending}
          className="flex flex-col gap-14"
        >
          <fieldset disabled={pending} className="flex min-w-0 flex-col gap-14">
            <FormSection
              title={content.checkout.planSection}
              description={content.checkout.planSectionBody}
            >
              <div className="flex flex-col gap-3">
                {SPONSOR_TIERS.map((tier) => {
                  const soldOut = tier === "diamond" && diamondSoldOut;
                  return (
                    <ChoiceCard
                      key={tier}
                      name="tier"
                      checked={fields.tier === tier}
                      onSelect={() => update({ tier })}
                      disabled={soldOut}
                      title={content.tiers[tier]}
                      price={SPONSOR_PRICE_USD[tier]}
                      priceNote={content.priceSuffix[fields.billing]}
                      body={soldOut ? content.checkout.soldOut : undefined}
                    />
                  );
                })}
              </div>
            </FormSection>

            <FormSection
              title={content.checkout.billingSection}
              description={content.checkout.billingSectionBody}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {SPONSOR_BILLINGS.map((billing) => (
                  <ChoiceCard
                    key={billing}
                    name="billing"
                    checked={fields.billing === billing}
                    onSelect={() => update({ billing })}
                    title={content.billings[billing]}
                    body={content.checkout.billingBodies[billing]}
                  />
                ))}
              </div>
            </FormSection>

            <CreativeSections
              idPrefix="new-sponsorship"
              fields={fields}
              update={update}
              needsCategory={needsCategory}
            />

            <FormSection
              title={content.preview}
              description={content.previewSectionBody}
            >
              <CreativePreview fields={fields} />
            </FormSection>

            <FormSection
              title={content.checkout.reviewSection}
              description={content.checkout.reviewSectionBody}
            >
              <dl className="bg-card shadow-outline divide-border flex flex-col divide-y overflow-hidden rounded-xl text-sm">
                <div className="flex items-start justify-between gap-4 p-4">
                  <dt className="flex flex-col gap-0.5">
                    <span className="font-medium">
                      {content.tiers[fields.tier]}
                    </span>
                    <span className="text-muted-foreground">
                      {content.billings[fields.billing]}
                    </span>
                  </dt>
                  <dd className="tabular-nums">
                    ${price}
                    {content.priceSuffix[fields.billing]}
                  </dd>
                </div>
                <div className="bg-muted/60 flex items-center justify-between gap-4 p-4 font-medium">
                  <dt>{content.checkout.dueToday}</dt>
                  <dd className="tabular-nums">${price}</dd>
                </div>
                <div className="text-muted-foreground flex items-center justify-between gap-4 p-4 text-xs">
                  <dt>{content.checkout.signedInAs}</dt>
                  <dd className="truncate">{email}</dd>
                </div>
              </dl>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {content.checkout.note}
              </p>
              {error && (
                <p role="alert" className="text-destructive text-sm">
                  {content.checkout.errors[error]}
                </p>
              )}
              <Button type="submit" size="lg" className="w-fit">
                {pending ? content.checkout.opening : content.checkout.submit}
              </Button>
            </FormSection>
          </fieldset>
        </form>
      </PageMain>
      <SiteFooter />
    </>
  );
};

const idSchema = z.string().min(1).max(100);

export const Route = createFileRoute("/sponsorships/new")({
  component: NewSponsorship,
  head: () =>
    createMetadata({
      canonical: ROUTES.SPONSORSHIPS_NEW,
      noIndex: true,
      title: "New sponsorship",
    }),
  validateSearch: (search): NewSponsorshipSearch => ({
    tier: z.enum(SPONSOR_TIERS).safeParse(search.tier).data,
    billing: z.enum(SPONSOR_BILLINGS).safeParse(search.billing).data,
    sponsorship: idSchema.safeParse(search.sponsorship).data,
  }),
  loader: async ({ location }) => {
    const [mine, diamondSoldOut] = await Promise.all([
      getMySponsorships({ data: {} }),
      getDiamondSoldOut(),
    ]);
    if (!mine) {
      throw redirect({
        search: { redirect: location.href },
        to: ROUTES.SIGN_IN,
      });
    }
    return { ...mine, diamondSoldOut };
  },
});
