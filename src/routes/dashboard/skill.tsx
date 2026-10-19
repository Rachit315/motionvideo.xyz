import { createFileRoute, getRouteApi, redirect } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { useIntlayer } from "react-intlayer";
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
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { SKILL } from "@/constants/skill";
import { useTransientStatus } from "@/hooks/use-transient-status";
import { createMetadata } from "@/seo/metadata";
import { getAccount, getOffer, getPortalUrl } from "@/server/functions";

interface SkillSearch {
  /** Dev-only preview of the owner state. */
  preview?: "purchased";
}

const routeApi = getRouteApi("/dashboard/skill");

const PurchaseCard = () => {
  const content = useIntlayer("account");
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
      window.location.href = await getPortalUrl();
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

export const Route = createFileRoute("/dashboard/skill")({
  component: Skill,
  head: () => createMetadata({ noIndex: true, title: "Skill" }),
  validateSearch: (search): SkillSearch => ({
    preview: search.preview === "purchased" ? "purchased" : undefined,
  }),
  loaderDeps: ({ search }) => ({ preview: search.preview }),
  loader: async ({ deps }) => {
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
      throw redirect({
        search: { redirect: ROUTES.DASHBOARD_SKILL },
        to: ROUTES.SIGN_IN,
      });
    }
    return { ...account, offer: await getOffer() };
  },
});
