import {
  Link,
  createFileRoute,
  getRouteApi,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { useIntlayer, useLocale } from "react-intlayer";
import { HandHeart } from "reicon-react/icons/HandHeart";
import { z } from "zod";

import { ImageDropzone } from "@/components/image-dropzone";
import { AccountPageHeader, FormSection, PageMain } from "@/components/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { track } from "@/lib/analytics";
import { SUBMISSION_CATEGORIES, SUBMISSION_KINDS } from "@/lib/community";
import type { SubmissionKind } from "@/lib/community";
import type { DirectorySlug } from "@/lib/directories";
import {
  SPONSOR_NAME_MAX,
  SPONSOR_TAGLINE_MAX,
  sponsorCreativeSchema,
  tierNeedsCategory,
} from "@/lib/sponsorships";
import { imageRefSchema } from "@/lib/uploads";
import { createMetadata } from "@/seo/metadata";
import {
  getMySponsorships,
  getSponsorPortalUrl,
  saveSponsorCreative,
} from "@/server/sponsorship-functions";
import type { MySponsorship } from "@/server/sponsorship-functions";

// Dodo appends `subscription_id` (and its own `status`, which we re-read from
// the API instead) to the checkout return URL.
interface SponsorshipsSearch {
  subscription_id?: string;
}

interface CreativeFields {
  name: string;
  url: string;
  tagline: string;
  logo: string;
  cover: string;
  categoryKind: SubmissionKind | null;
  category: string | null;
  darkInvert: boolean;
}

type SaveError = "validation" | "cover" | "category" | "storage";

const routeApi = getRouteApi("/sponsorships");

const fieldClass = "flex flex-col gap-2";
const helpClass = "text-muted-foreground text-xs leading-relaxed";

/** The image when it is an upload or a public HTTPS URL, never junk. */
const previewUrl = (value: string) =>
  imageRefSchema.safeParse(value.trim()).success ? value.trim() : undefined;

// Roughly how the placement renders: the sponsored grid card (every tier).
const CreativePreview = ({ fields }: { fields: CreativeFields }) => {
  const content = useIntlayer("sponsorships-page");
  const logo = previewUrl(fields.logo);
  const cover = previewUrl(fields.cover);
  const name = fields.name.trim() || content.name.value;

  return (
    <div className="bg-muted shadow-outline relative aspect-video w-full max-w-sm overflow-hidden rounded-xl">
      {cover && (
        <img
          src={cover}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <span className="absolute top-2.5 left-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
        {content.sponsored}
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-linear-to-t from-black/70 to-transparent p-2.5 pt-6">
        <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-sm">
          {logo && (
            <img
              src={logo}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="size-full object-contain"
            />
          )}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium tracking-tight text-white">
            {name}
          </span>
          {fields.tagline.trim() && (
            <span className="truncate text-xs text-white/75">
              {fields.tagline}
            </span>
          )}
        </span>
      </span>
    </div>
  );
};

const CreativeForm = ({ sponsorship }: { sponsorship: MySponsorship }) => {
  const content = useIntlayer("sponsorships-page");
  const gallery = useIntlayer("motion-gallery");
  const directory = useIntlayer("resource-directory");
  const router = useRouter();
  const { tier, subscriptionId } = sponsorship;
  const needsCategory = tierNeedsCategory(tier);
  const [fields, setFields] = useState<CreativeFields>({
    name: sponsorship.name ?? "",
    url: sponsorship.url ?? "",
    tagline: sponsorship.tagline ?? "",
    logo: sponsorship.logo ?? "",
    cover: sponsorship.cover ?? "",
    categoryKind: sponsorship.categoryKind,
    category: sponsorship.category,
    darkInvert: sponsorship.darkInvert,
  });
  const [status, setStatus] = useState<"idle" | "pending" | "saved">("idle");
  const [error, setError] = useState<SaveError | null>(null);
  const id = (field: string) => `${subscriptionId}-${field}`;
  const update = (patch: Partial<CreativeFields>) => {
    setFields((current) => ({ ...current, ...patch }));
    setStatus("idle");
  };

  // The gallery categories for Discover, the directory chips elsewhere.
  let categoryOptions: { value: string; label: string }[] = [];
  if (fields.categoryKind === "video") {
    categoryOptions = SUBMISSION_CATEGORIES.video.map((value) => ({
      value,
      label: gallery.categories[value].value,
    }));
  } else if (fields.categoryKind) {
    const slugs: readonly DirectorySlug[] =
      SUBMISSION_CATEGORIES[fields.categoryKind];
    const labels: Partial<Record<string, { value: string }>> =
      directory.labels[fields.categoryKind];
    categoryOptions = slugs.map((value) => ({
      value,
      label: labels[value]?.value ?? value,
    }));
  }
  const categoryLabel = categoryOptions.find(
    (option) => option.value === fields.category
  )?.label;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "pending") {
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
    const input = sponsorCreativeSchema.safeParse({
      subscriptionId,
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
    setStatus("pending");
    setError(null);
    try {
      await saveSponsorCreative({ data: input.data });
      track("sponsor_creative_saved");
      setStatus("saved");
      await router.invalidate();
    } catch {
      setStatus("idle");
      setError("storage");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      aria-busy={status === "pending"}
      className="flex flex-col gap-12"
    >
      <fieldset
        disabled={status === "pending"}
        className="flex min-w-0 flex-col gap-12"
      >
        <FormSection
          title={content.campaignSection}
          description={content.campaignSectionBody}
        >
          <div className={fieldClass}>
            <Label htmlFor={id("name")}>{content.name}</Label>
            <Input
              id={id("name")}
              value={fields.name}
              onChange={(event) => update({ name: event.target.value })}
              required
              maxLength={SPONSOR_NAME_MAX}
            />
          </div>
          <div className={fieldClass}>
            <Label htmlFor={id("tagline")}>{content.tagline}</Label>
            <Input
              id={id("tagline")}
              value={fields.tagline}
              onChange={(event) => update({ tagline: event.target.value })}
              required
              maxLength={SPONSOR_TAGLINE_MAX}
            />
          </div>
          <div className={fieldClass}>
            <Label htmlFor={id("url")}>{content.url}</Label>
            <Input
              id={id("url")}
              type="url"
              placeholder="https://"
              value={fields.url}
              onChange={(event) => update({ url: event.target.value })}
              required
              maxLength={2048}
            />
          </div>
        </FormSection>

        <FormSection
          title={content.brandSection}
          description={content.brandSectionBody}
        >
          <ImageDropzone
            purpose="logo"
            value={fields.logo}
            onChange={(logo) => update({ logo })}
            label={content.logoDrop.value}
            hint={content.logoSize.value}
            required
          />
          <label className="text-muted-foreground flex items-start gap-3 text-sm leading-relaxed">
            <input
              type="checkbox"
              checked={fields.darkInvert}
              onChange={(event) => update({ darkInvert: event.target.checked })}
              className="accent-primary mt-0.5 size-4 shrink-0"
            />
            {content.darkInvert}
          </label>
        </FormSection>

        <FormSection
          title={content.mediaSection}
          description={content.mediaSectionBody}
        >
          <ImageDropzone
            purpose="cover"
            value={fields.cover}
            onChange={(cover) => update({ cover })}
            label={content.coverDrop.value}
            hint={content.coverSize.value}
            required
          />
        </FormSection>

        {needsCategory && (
          <FormSection
            title={content.placementSection}
            description={content.placementSectionBody}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className={fieldClass}>
                <Label htmlFor={id("section")}>{content.section}</Label>
                <Select
                  value={fields.categoryKind}
                  onValueChange={(value) => {
                    if (value) {
                      // Categories differ per section.
                      update({ categoryKind: value, category: null });
                    }
                  }}
                >
                  <SelectTrigger id={id("section")} className="w-full">
                    <SelectValue>
                      {fields.categoryKind
                        ? content.sections[fields.categoryKind]
                        : content.pickCategory}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SUBMISSION_KINDS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {content.sections[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={fieldClass}>
                <Label htmlFor={id("category")}>{content.category}</Label>
                <Select
                  value={fields.category}
                  onValueChange={(value) => update({ category: value })}
                  disabled={!fields.categoryKind}
                >
                  <SelectTrigger
                    id={id("category")}
                    className="w-full"
                    aria-describedby={id("category-help")}
                  >
                    <SelectValue>
                      {categoryLabel ?? content.pickCategory}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p id={id("category-help")} className={helpClass}>
                  {content.categoryHelp}
                </p>
              </div>
            </div>
          </FormSection>
        )}

        <FormSection
          title={content.preview}
          description={content.previewSectionBody}
        >
          <div className="bg-card shadow-outline flex justify-center rounded-xl p-6">
            <CreativePreview fields={fields} />
          </div>
        </FormSection>

        <FormSection
          title={content.submitSection}
          description={content.submitSectionBody}
        >
          {sponsorship.review !== "draft" && (
            <p className={helpClass}>{content.resubmit}</p>
          )}
          {error && (
            <p role="alert" className="text-destructive text-sm">
              {content.errors[error]}
            </p>
          )}
          {status === "saved" && (
            <p aria-live="polite" className="text-sm">
              {content.saved}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={status === "pending"}
            className="w-fit"
          >
            {status === "pending" ? content.saving : content.save}
          </Button>
        </FormSection>
      </fieldset>
    </form>
  );
};

const BillingButton = ({ subscriptionId }: { subscriptionId: string }) => {
  const content = useIntlayer("sponsorships-page");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const openPortal = async () => {
    setBusy(true);
    setFailed(false);
    try {
      window.location.href = await getSponsorPortalUrl({
        data: { subscriptionId },
      });
    } catch {
      setBusy(false);
      setFailed(true);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" disabled={busy} onClick={openPortal}>
        {busy ? content.opening : content.manageBilling}
      </Button>
      {failed && (
        <p role="alert" className="text-destructive text-xs">
          {content.billingError}
        </p>
      )}
    </div>
  );
};

const SponsorshipCard = ({ sponsorship }: { sponsorship: MySponsorship }) => {
  const content = useIntlayer("sponsorships-page");
  const { locale } = useLocale();
  const ending =
    sponsorship.cancelAtPeriodEnd ||
    sponsorship.status === "cancelled" ||
    sponsorship.status === "expired";
  const date =
    sponsorship.nextBillingAt &&
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(sponsorship.nextBillingAt);
  const hiddenWhileInactive =
    sponsorship.review === "approved" && sponsorship.status !== "active";

  return (
    <section
      aria-label={content.tiers[sponsorship.tier].value}
      className="bg-card shadow-outline flex flex-col gap-6 rounded-2xl p-5 sm:p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            {content.tiers[sponsorship.tier]}
            <Badge
              variant={sponsorship.status === "active" ? "default" : "outline"}
            >
              {content.statuses[sponsorship.status]}
            </Badge>
          </h2>
          {date && (
            <p className="text-muted-foreground text-sm">
              {ending ? content.ends : content.renews} {date}
            </p>
          )}
        </div>
        <BillingButton subscriptionId={sponsorship.subscriptionId} />
      </header>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm">
          <span className="text-muted-foreground">{content.placement}:</span>{" "}
          <span className="font-medium">
            {hiddenWhileInactive
              ? content.approvedInactive
              : content.reviews[sponsorship.review]}
          </span>
        </p>
        {sponsorship.reviewNote && (
          <div className="bg-muted/60 rounded-xl p-3 text-sm">
            <p className="text-muted-foreground text-xs">
              {content.reviewNote}
            </p>
            <p className="mt-1 whitespace-pre-line">{sponsorship.reviewNote}</p>
          </div>
        )}
      </div>
      <CreativeForm sponsorship={sponsorship} />
    </section>
  );
};

const Sponsorships = () => {
  const content = useIntlayer("sponsorships-page");
  const { sponsorships } = routeApi.useLoaderData();
  const search = routeApi.useSearch();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  // Back from checkout: the subscription shows up once Dodo confirms it.
  const returned =
    search.subscription_id === undefined
      ? undefined
      : sponsorships.find(
          (sponsorship) => sponsorship.subscriptionId === search.subscription_id
        );
  const confirming =
    search.subscription_id !== undefined && returned?.status !== "active";

  const refresh = async () => {
    setRefreshing(true);
    await router.invalidate();
    setRefreshing(false);
  };

  return (
    <>
      <SiteHeader signedIn />
      <PageMain width="narrow">
        <AccountPageHeader title={content.title} intro={content.intro} />
        {confirming && (
          <section
            aria-live="polite"
            className="bg-card shadow-outline flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">
                {content.confirmingTitle}
              </h2>
              <p className="text-muted-foreground text-sm">
                {content.confirmingBody}
              </p>
            </div>
            <Button
              variant="outline"
              disabled={refreshing}
              onClick={refresh}
              className="w-fit shrink-0"
            >
              {content.refresh}
            </Button>
          </section>
        )}
        {returned?.status === "active" && returned.review === "draft" && (
          <section
            aria-live="polite"
            className="bg-card shadow-outline flex items-start gap-3 rounded-2xl p-5"
          >
            <HandHeart aria-hidden="true" className="mt-0.5 size-6 shrink-0" />
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">{content.activeTitle}</h2>
              <p className="text-muted-foreground text-sm">
                {content.activeBody}
              </p>
            </div>
          </section>
        )}
        {sponsorships.length > 0
          ? sponsorships.map((sponsorship) => (
              <SponsorshipCard
                key={sponsorship.subscriptionId}
                sponsorship={sponsorship}
              />
            ))
          : !confirming && (
              <Empty className="bg-muted/40 rounded-2xl">
                <EmptyHeader>
                  <EmptyMedia>
                    <HandHeart
                      aria-hidden="true"
                      className="text-muted-foreground size-7"
                    />
                  </EmptyMedia>
                  <EmptyTitle>{content.emptyTitle}</EmptyTitle>
                  <EmptyDescription>
                    {content.emptyDescription}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Link to={ROUTES.SPONSOR} className={buttonVariants()}>
                    {content.seePlans}
                  </Link>
                </EmptyContent>
              </Empty>
            )}
      </PageMain>
      <SiteFooter />
    </>
  );
};

export const Route = createFileRoute("/sponsorships")({
  component: Sponsorships,
  head: () =>
    createMetadata({
      canonical: ROUTES.SPONSORSHIPS,
      noIndex: true,
      title: "Sponsorships",
    }),
  validateSearch: (search): SponsorshipsSearch => ({
    subscription_id: z
      .string()
      .min(1)
      .max(100)
      .safeParse(search.subscription_id).data,
  }),
  loaderDeps: ({ search }) => ({ subscriptionId: search.subscription_id }),
  loader: async ({ deps }) => {
    const mine = await getMySponsorships({
      data: { subscriptionId: deps.subscriptionId },
    });
    if (!mine) {
      // Sign-in returns here with the subscription to confirm.
      const back = deps.subscriptionId
        ? `${ROUTES.SPONSORSHIPS}?subscription_id=${encodeURIComponent(deps.subscriptionId)}`
        : ROUTES.SPONSORSHIPS;
      throw redirect({ search: { redirect: back }, to: ROUTES.SIGN_IN });
    }
    return mine;
  },
});
