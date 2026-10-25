import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useState } from "react";
import type { ReactNode } from "react";
import { useIntlayer, useLocale } from "react-intlayer";
import { CheckCircle } from "reicon-react/icons/CheckCircle";

import { CopyIcon } from "@/components/copy-icon";
import { AccountPageHeader, PageMain } from "@/components/page";
import { BuyButton } from "@/components/pricing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DEFAULT_LOCALE, isLocale, localizedPath } from "@/constants/locales";
import type { LocaleHeadContext } from "@/constants/locales";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { SKILL } from "@/constants/skill";
import { useTransientStatus } from "@/hooks/use-transient-status";
import { localizedRedirect } from "@/lib/localized-redirect";
import { createMetadata } from "@/seo/metadata";
import { getAccount, getOffer, getPortalUrl } from "@/server/functions";

interface SkillSearch {
  /** Dev-only preview of the owner state. */
  preview?: "purchased";
}

const routeApi = getRouteApi("/$locale/dashboard/skill");

const PurchaseCard = () => {
  const content = useIntlayer("account");
  const { locale } = useLocale();
  const account = routeApi.useLoaderData();
  const { preview: previewSearch } = routeApi.useSearch();
  const preview = import.meta.env.DEV && previewSearch === "purchased";
  const [busy, setBusy] = useState(false);

  let portalLabel: ReactNode = busy ? content.opening : content.portal;
  if (preview) {
    portalLabel = content.portalPreview;
  }
  const openPortal = async () => {
    setBusy(true);
    try {
      window.location.href = await getPortalUrl({ data: { locale } });
    } catch {
      setBusy(false);
    }
  };

  if (account.purchased) {
    return (
      <Empty className="bg-card shadow-outline">
        <EmptyHeader>
          <EmptyMedia className="text-primary">
            <CheckCircle aria-hidden className="size-8" />
          </EmptyMedia>
          <EmptyTitle className="text-base">
            {content.own} {SITE.NAME}
          </EmptyTitle>
          <EmptyDescription>{content.portalDescription}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="lg" onClick={openPortal} disabled={busy || preview}>
            {portalLabel}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <Card size="lg">
      <CardHeader>
        <CardTitle>
          {content.get} {SITE.NAME}
        </CardTitle>
        <CardDescription>{content.purchaseDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <BuyButton offer={account.offer} />
      </CardContent>
    </Card>
  );
};

/** The command buyers run to add the pack, with a copy button. */
const CommandField = () => {
  const content = useIntlayer("dashboard-page");
  const [status, flash] = useTransientStatus<"idle" | "copied">("idle");
  const copied = status === "copied";
  const label = copied ? content.copied.value : content.copy.value;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{content.commandLabel}</span>
      <div className="bg-muted/50 flex items-center gap-2 rounded-xl p-2 pl-4">
        <code className="min-w-0 flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap">
          {SKILL.INSTALL_COMMAND}
        </code>
        <Button
          aria-label={label}
          size="sm"
          variant="outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(SKILL.INSTALL_COMMAND);
              flash("copied");
            } catch {
              // Clipboard access can be denied; the command stays selectable.
            }
          }}
        >
          <CopyIcon copied={copied} />
          {label}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs text-pretty">
        {content.globalNote}
      </p>
    </div>
  );
};

const InstallCard = () => {
  const content = useIntlayer("dashboard-page");
  const { purchased } = routeApi.useLoaderData();

  if (!purchased) {
    return (
      <p className="text-muted-foreground text-sm text-pretty">
        {content.installLocked}
      </p>
    );
  }

  return (
    <Card size="lg">
      <CardHeader>
        <CardTitle>{content.install}</CardTitle>
        <CardDescription>{content.installIntro}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <CommandField />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{content.steps}</span>
          <ol className="text-muted-foreground flex list-decimal flex-col gap-1.5 pl-4 text-sm">
            <li>{content.stepPortal}</li>
            <li>{content.stepInvite}</li>
            <li>{content.stepPrompt}</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

const Skill = () => {
  const content = useIntlayer("dashboard-page");

  return (
    <PageMain width="narrow">
      <AccountPageHeader
        title={content.skillTitle}
        intro={content.skillIntro}
      />
      <PurchaseCard />
      <InstallCard />
    </PageMain>
  );
};

export const Route = createFileRoute("/$locale/dashboard/skill")({
  component: Skill,
  head: ({ params }: LocaleHeadContext) =>
    createMetadata({
      title: getIntlayer(
        "account-meta",
        isLocale(params.locale) ? params.locale : DEFAULT_LOCALE
      ).skillTitle,
    }),
  validateSearch: (search): SkillSearch => ({
    preview: search.preview === "purchased" ? "purchased" : undefined,
  }),
  loaderDeps: ({ search }) => ({ preview: search.preview }),
  loader: async ({ deps, params }) => {
    if (import.meta.env.DEV && deps.preview === "purchased") {
      return {
        email: "preview@example.com",
        purchased: true,
        name: null,
        offer: await getOffer(),
      };
    }
    const account = await getAccount();
    if (!account) {
      throw localizedRedirect(ROUTES.SIGN_IN, params.locale, {
        search: {
          redirect: localizedPath(ROUTES.DASHBOARD_SKILL, params.locale),
        },
      });
    }
    return { ...account, offer: await getOffer() };
  },
});
