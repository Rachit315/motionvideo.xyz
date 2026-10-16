import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useIntlayer, useLocale } from "react-intlayer";
import { Check } from "reicon-react/icons/Check";
import { Xmark } from "reicon-react/icons/Xmark";

import { AvatarImage } from "@/components/account-avatar";
import { GoogleIcon } from "@/components/brand-icons";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import {
  setLiveCursorsEnabled,
  useLiveCursorsEnabled,
} from "@/components/live-presence";
import { SUPPORTED_LOCALES } from "@/components/locale-provider";
import { LOCALE_NAMES } from "@/components/locale-switcher";
import { FormSection, HeroHeader, PageMain } from "@/components/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/constants/routes";
import { useEmailUpdates } from "@/hooks/use-email-updates";
import { authClient, useSession } from "@/lib/auth-client";
import { createMetadata } from "@/seo/metadata";
import { getSubmitter } from "@/server/community-functions";

const helpClass = "text-muted-foreground text-xs leading-relaxed";
const NAME_MAX = 80;

/** One settings row: label (and help) on the left, its control on the right. */
const Row = ({
  label,
  help,
  htmlFor,
  children,
}: {
  label: ReactNode;
  help?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex min-w-0 flex-col gap-0.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {help && <p className={helpClass}>{help}</p>}
    </div>
    {children}
  </div>
);

/** The display name, edited in place; saved to the account. */
const NameField = ({ name }: { name: string }) => {
  const content = useIntlayer("settings-page");
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = value.trim();
    if (!next || next === name) {
      setEditing(false);
      return;
    }
    setStatus("saving");
    const { error } = await authClient.updateUser({ name: next });
    setStatus(error ? "error" : "idle");
    if (!error) {
      setEditing(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-1">
      <div className="flex min-h-9 items-center justify-between gap-4">
        <Label htmlFor="settings-name">{content.name}</Label>
        {/* Keyed apart: reusing one <button> element would turn Edit into
            the submit button mid-click and submit the form at once. */}
        {editing ? (
          <div key="editing" className="flex min-w-0 items-center gap-1">
            <Input
              id="settings-name"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setEditing(false);
                }
              }}
              maxLength={NAME_MAX}
              autoComplete="name"
              // oxlint-disable-next-line jsx-a11y/no-autofocus -- opened by Edit
              autoFocus
              className="w-48"
            />
            <Button
              type="submit"
              size="icon-lg"
              aria-label={content.save.value}
              disabled={status === "saving"}
            >
              <Check aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label={content.cancel.value}
              onClick={() => setEditing(false)}
            >
              <Xmark aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <div key="viewing" className="flex min-w-0 items-center gap-3">
            <span className="text-muted-foreground truncate text-sm">
              {name || content.noName}
            </span>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setValue(name);
                setEditing(true);
              }}
            >
              {content.edit}
            </Button>
          </div>
        )}
      </div>
      {status === "error" && (
        <p role="alert" className="text-destructive text-sm">
          {content.saveError}
        </p>
      )}
    </form>
  );
};

/** Sign-in providers: Google is connected, or can be connected here. */
const Connections = () => {
  const content = useIntlayer("settings-page");
  const [google, setGoogle] = useState<boolean | null>(null);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    let live = true;
    void (async () => {
      const { data } = await authClient.listAccounts();
      if (live) {
        setGoogle(
          (data ?? []).some((account) => account.providerId === "google")
        );
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const connect = async () => {
    setLinking(true);
    const { error } = await authClient.linkSocial({
      provider: "google",
      callbackURL: ROUTES.SETTINGS,
    });
    if (error) {
      setLinking(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-3 text-sm font-medium">
        <span className="bg-muted flex size-8 items-center justify-center rounded-full">
          <GoogleIcon className="size-4" />
        </span>
        Google
      </span>
      {google ? (
        <span className="text-muted-foreground text-sm">
          {content.connected}
        </span>
      ) : (
        <Button
          variant="outline"
          size="lg"
          disabled={google === null || linking}
          onClick={connect}
        >
          {content.connect}
        </Button>
      )}
    </div>
  );
};

const Settings = () => {
  const content = useIntlayer("settings-page");
  const [emailUpdates, setEmailUpdates] = useEmailUpdates();
  const cursors = useLiveCursorsEnabled();
  const { locale, setLocale } = useLocale();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { email } = Route.useLoaderData();
  const session = useSession();
  const user = session.data?.user;

  return (
    <>
      <SiteHeader signedIn />
      <PageMain width="narrow" className="gap-16">
        <HeroHeader title={content.title} intro={content.intro} />
        <div className="flex flex-col gap-14">
          <FormSection
            title={content.account}
            description={content.accountBody}
          >
            <Row label={content.avatar}>
              <span className="size-10 shrink-0 overflow-hidden rounded-full">
                <AvatarImage photo={user?.image} />
              </span>
            </Row>
            {/* Keyed so it resets once the session (and the name) loads. */}
            <NameField key={user?.name ?? ""} name={user?.name ?? ""} />
            <Row label={content.email}>
              <span className="text-muted-foreground truncate text-sm">
                {email}
              </span>
            </Row>
          </FormSection>

          <FormSection
            title={content.connections}
            description={content.connectionsBody}
          >
            <Connections />
          </FormSection>

          <FormSection
            title={content.preferences}
            description={content.preferencesBody}
          >
            <Row label={content.language} htmlFor="settings-language">
              <Select
                value={locale}
                onValueChange={(value) => {
                  const selected = SUPPORTED_LOCALES.find(
                    (supported) => supported === value
                  );
                  if (selected) {
                    setLocale(selected);
                  }
                }}
              >
                <SelectTrigger id="settings-language" className="w-40">
                  <SelectValue>{LOCALE_NAMES[locale]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SUPPORTED_LOCALES.map((value) => (
                      <SelectItem key={value} value={value} lang={value}>
                        {LOCALE_NAMES[value]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Row>
            <Row
              label={content.cursors}
              help={content.cursorsHelp}
              htmlFor="settings-cursors"
            >
              <Switch
                id="settings-cursors"
                checked={cursors}
                onCheckedChange={setLiveCursorsEnabled}
              />
            </Row>
          </FormSection>

          <FormSection title={content.emails} description={content.emailsBody}>
            <Row
              label={content.updates}
              help={content.updatesDescription}
              htmlFor="settings-updates"
            >
              <Switch
                id="settings-updates"
                checked={emailUpdates}
                onCheckedChange={setEmailUpdates}
              />
            </Row>
          </FormSection>

          <FormSection title={content.danger} description={content.dangerBody}>
            <Row label={content.deleteAccount} help={content.deleteNote}>
              <Button
                variant="destructive"
                size="lg"
                onClick={() => setDeleteOpen(true)}
              >
                {content.delete}
              </Button>
            </Row>
          </FormSection>
        </div>
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
