import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useIntlayer } from "react-intlayer";

import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { PageMain, AccountPageHeader } from "@/components/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useEmailUpdates } from "@/hooks/use-email-updates";
import { cn } from "@/lib/utils";
import { createMetadata } from "@/seo/metadata";
import { getSubmitter } from "@/server/community-functions";

const Settings = () => {
  const content = useIntlayer("settings-page");
  const [emailUpdates, setEmailUpdates] = useEmailUpdates();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <SiteHeader signedIn />
      <PageMain width="narrow">
        <AccountPageHeader title={content.title} intro={content.intro} />
        <section
          aria-label={content.general.value}
          className="bg-card shadow-outline flex flex-col gap-1 rounded-2xl p-5"
        >
          <h2 className="text-base font-semibold tracking-tight">
            {content.general}
          </h2>
          <div className="flex items-center gap-4 py-2">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium">{content.deleteAccount}</p>
              <p className="text-muted-foreground text-sm">
                {content.deleteNote}
              </p>
            </div>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              {content.deleteAccount}
            </Button>
          </div>
        </section>
        <section
          aria-label={content.emails.value}
          className="bg-card shadow-outline flex flex-col gap-1 rounded-2xl p-5"
        >
          <h2 className="text-base font-semibold tracking-tight">
            {content.emails}
          </h2>
          <div className="flex items-center gap-4 py-2">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium">{content.updates}</p>
              <p className="text-muted-foreground text-sm">
                {content.updatesDescription}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailUpdates}
              aria-label={content.updates.value}
              onClick={() => setEmailUpdates(!emailUpdates)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors outline-none focus-visible:ring-2",
                emailUpdates ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
                  emailUpdates && "translate-x-5"
                )}
              />
            </button>
          </div>
          <p className="text-muted-foreground text-xs">
            {emailUpdates ? content.on : content.off}
          </p>
        </section>
      </PageMain>
      <SiteFooter />
      <DeleteAccountDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
};

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () =>
    createMetadata({
      canonical: ROUTES.SETTINGS,
      noIndex: true,
      title: "Settings",
    }),
  loader: async () => {
    const submitter = await getSubmitter();
    if (!submitter) {
      throw redirect({
        search: { redirect: ROUTES.SETTINGS },
        to: ROUTES.SIGN_IN,
      });
    }
    return submitter;
  },
});
