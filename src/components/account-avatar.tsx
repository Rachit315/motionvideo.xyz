import {
  ClientOnly,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { cn } from "cn";
import { useMemo, useState } from "react";
import { useIntlayer, useLocale } from "react-intlayer";
import { Bookmark } from "reicon-react/icons/Bookmark";
import { ChevronRight } from "reicon-react/icons/ChevronRight";
import { Exit } from "reicon-react/icons/Exit";
import { HandHeart } from "reicon-react/icons/HandHeart";
import { Moon } from "reicon-react/icons/Moon";
import { Settings } from "reicon-react/icons/Settings";
import { Sparkles } from "reicon-react/icons/Sparkles";
import { Sun } from "reicon-react/icons/Sun";
import { User } from "reicon-react/icons/User";

import { GitHubIcon, XIcon } from "@/components/brand-icons";
import { useSignInDialog } from "@/components/sign-in-dialog";
import { toggleTheme } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { authClient, useSession } from "@/lib/auth-client";

// Pages that need an account; signing out there returns home.
const ACCOUNT_PAGES = new Set<string>([
  ROUTES.BOOKMARKS,
  ROUTES.DASHBOARD,
  ROUTES.FEATURED,
  ROUTES.SETTINGS,
  ROUTES.SUBMIT,
]);
const avatarButtonClass =
  "focus-visible:ring-ring block size-8 shrink-0 cursor-pointer overflow-hidden rounded-full transition-transform outline-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2";

const STORAGE_KEY = "motionvideo-avatar-seed";

let visitorSeed: string | undefined;

const getVisitorSeed = (): string => {
  if (visitorSeed) {
    return visitorSeed;
  }
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    visitorSeed = stored ?? crypto.randomUUID();
    if (!stored) {
      sessionStorage.setItem(STORAGE_KEY, visitorSeed);
    }
  } catch {
    // Storage restrictions must not prevent a random avatar or navigation.
    if (!visitorSeed) {
      visitorSeed = crypto.randomUUID();
    }
  }
  return visitorSeed;
};

const avatarPlaceholder = (
  <User aria-hidden="true" className="bg-muted size-full p-1.5" />
);

// Seeded anonymously so no account details reach the avatar service.
const AvatarImage = () => {
  const seed = useMemo(() => getVisitorSeed(), []);
  const [failed, setFailed] = useState(false);

  return failed ? (
    avatarPlaceholder
  ) : (
    <img
      src={`https://avatars.reicon.dev/v1/svg/${encodeURIComponent(seed)}?shape=circle&size=64`}
      alt=""
      aria-hidden="true"
      width={32}
      height={32}
      decoding="async"
      referrerPolicy="no-referrer"
      className="size-full object-cover"
      onError={() => setFailed(true)}
    />
  );
};

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
] as const;

const iconButtonClass =
  "text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-full transition-colors outline-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]";

/**
 * Header avatar. Always opens the account popover: featured + bookmarks,
 * sponsorships, a settings page link, theme, language, and socials in labeled
 * rows; a gradient sign-in button (log out at the same spot when signed in)
 * closes the menu. `signedIn` from the page loader is only used until the
 * client session has loaded.
 */
export const AccountMenu = ({
  signedIn: initialSignedIn = false,
}: {
  signedIn?: boolean;
}) => {
  const content = useIntlayer("site-header");
  const { locale, setLocale } = useLocale();
  const session = useSession();
  const signInDialog = useSignInDialog();
  const router = useRouter();
  const navigate = useNavigate();
  const user = session.isPending ? undefined : session.data?.user;
  const signedIn = session.isPending ? initialSignedIn : Boolean(user);
  // The popup remounts on every open, so lazy init resyncs without effects.
  const [dark, setDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );
  const avatar = (
    <ClientOnly fallback={avatarPlaceholder}>
      <AvatarImage />
    </ClientOnly>
  );

  const onToggleTheme = () => {
    toggleTheme();
    setDark((wasDark) => !wasDark);
  };

  const signOut = async () => {
    await authClient.signOut();
    // The session listener in SignInDialogProvider reruns the loaders.
    if (ACCOUNT_PAGES.has(router.state.location.pathname)) {
      await navigate({ to: ROUTES.HOME });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={signedIn ? content.accountMenu.value : content.signIn.value}
        title={signedIn ? undefined : content.signIn.value}
        className={avatarButtonClass}
      >
        {avatar}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        {signedIn && user && (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="truncate">
              {user.email}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
        )}
        <DropdownMenuLinkItem render={<Link to={ROUTES.FEATURED} />}>
          <Sparkles aria-hidden="true" />
          {content.featured}
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link to={ROUTES.BOOKMARKS} />}>
          <Bookmark aria-hidden="true" />
          {content.bookmarks}
        </DropdownMenuLinkItem>
        <DropdownMenuSeparator />
        <DropdownMenuLinkItem render={<Link to={ROUTES.SPONSOR} />}>
          <HandHeart aria-hidden="true" />
          {content.sponsorships}
        </DropdownMenuLinkItem>
        <DropdownMenuSeparator />
        <DropdownMenuLinkItem render={<Link to={ROUTES.SETTINGS} />}>
          <Settings aria-hidden="true" />
          {content.settings}
        </DropdownMenuLinkItem>
        <DropdownMenuSeparator />
        {/* Label left, single ghost toggle right-aligned. */}
        <div className="flex items-center gap-2 px-1.5 py-1">
          <span className="text-sm">{content.theme}</span>
          <button
            type="button"
            aria-label={content.theme.value}
            title={content.theme.value}
            onClick={onToggleTheme}
            className={cn(iconButtonClass, "ml-auto")}
          >
            {dark ? (
              <Moon aria-hidden="true" className="size-4" />
            ) : (
              <Sun aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
        <DropdownMenuSub>
          {/* No leading icon: the label sits beside EN, and the chevron
                rides in a size-8 box so its glyph centers exactly with the
                theme toggle and the X button below. */}
          <DropdownMenuSubTrigger className="[&>svg:last-child]:hidden">
            {content.language}
            <span className="text-muted-foreground ml-2 text-xs">
              {locale.toUpperCase()}
            </span>
            <span
              aria-hidden="true"
              className="ml-auto flex size-8 items-center justify-center"
            >
              <ChevronRight className="size-4" />
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {LANGUAGE_OPTIONS.map((language) => (
              <DropdownMenuCheckboxItem
                key={language.code}
                checked={locale === language.code}
                onCheckedChange={() => setLocale(language.code)}
              >
                {language.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {/* Label left, GitHub then X right-aligned with the theme toggle. */}
        <div className="flex items-center gap-1 px-1.5 py-1">
          <span className="text-sm">{content.socials}</span>
          <div className="ml-auto flex items-center">
            <a
              href={LINK.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={iconButtonClass}
            >
              <GitHubIcon className="size-4" />
            </a>
            <a
              href={LINK.X}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className={iconButtonClass}
            >
              <XIcon className="size-4" />
            </a>
          </div>
        </div>
        <DropdownMenuSeparator />
        {/* Footer button: gradient sign-in, log out at the same spot. */}
        {signedIn ? (
          <DropdownMenuItem
            onClick={signOut}
            className="p-0 focus:bg-transparent"
          >
            <span
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full"
              )}
            >
              <Exit aria-hidden="true" />
              {content.signOut}
            </span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => signInDialog.open()}
            className="p-0 focus:bg-transparent"
          >
            <span
              className={cn(
                buttonVariants({ variant: "gradient", size: "lg" }),
                "w-full"
              )}
            >
              <User aria-hidden="true" />
              {content.signIn}
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
