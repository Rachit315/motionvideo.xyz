import {
  ClientOnly,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useIntlayer, useLocale } from "react-intlayer";
import { Bookmark } from "reicon-react/icons/Bookmark";
import { Briefcase } from "reicon-react/icons/Briefcase";
import { ChatRoundDots } from "reicon-react/icons/ChatRoundDots";
import { ChevronRight } from "reicon-react/icons/ChevronRight";
import { Cursor } from "reicon-react/icons/Cursor";
import { Exit } from "reicon-react/icons/Exit";
import { HandHeart } from "reicon-react/icons/HandHeart";
import { Keyboard } from "reicon-react/icons/Keyboard";
import { Moon } from "reicon-react/icons/Moon";
import { Settings } from "reicon-react/icons/Settings";
import { Sparkles } from "reicon-react/icons/Sparkles";
import { Sun } from "reicon-react/icons/Sun";
import { User } from "reicon-react/icons/User";

import { GitHubIcon, XIcon } from "@/components/brand-icons";
import { useFeedbackDialog } from "@/components/feedback-dialog";
import { useKeyboardShortcuts } from "@/components/keyboard-shortcuts";
import {
  setLiveCursorsEnabled,
  useLiveCursorsEnabled,
} from "@/components/live-presence";
import { useSignInDialog } from "@/components/sign-in-dialog";
import { SoundSwitch } from "@/components/sound-switch";
import { toggleTheme } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LINK } from "@/constants/links";
import { ACCOUNT_PAGES, ROUTES } from "@/constants/routes";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

// The hover zoom lives on the inner span: the menu positions against the
// trigger's box, and scaling the trigger itself made the open menu jump when
// the pointer left it (the anchor shrank back from 105%).
const avatarButtonClass =
  "group/avatar focus-visible:ring-ring block size-8 shrink-0 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
const avatarFaceClass =
  "block size-full overflow-hidden rounded-full transition-transform group-hover/avatar:scale-105";

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

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
] as const;

const iconButtonClass =
  "text-muted-foreground flex size-8 items-center justify-center transition-colors outline-none hover:text-foreground";

/**
 * Session, theme, language, and sign-out shared by the desktop account
 * popover and the mobile site menu. `initialSignedIn` (from the page loader)
 * is only used until the client session has loaded.
 */
export const useAccount = (initialSignedIn = false) => {
  const { locale, setLocale } = useLocale();
  const session = useSession();
  const router = useRouter();
  const navigate = useNavigate();
  const user = session.isPending ? undefined : session.data?.user;
  const signedIn = session.isPending ? initialSignedIn : Boolean(user);
  // Menus remount on every open, so lazy init resyncs without effects.
  const [dark, setDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
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

  return { locale, setLocale, signedIn, user, dark, onToggleTheme, signOut };
};

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
  const { locale, setLocale, signedIn, user, dark, onToggleTheme, signOut } =
    useAccount(initialSignedIn);
  const signInDialog = useSignInDialog();
  const feedbackDialog = useFeedbackDialog();
  const feedbackContent = useIntlayer("feedback-dialog");
  const keyboardShortcuts = useKeyboardShortcuts();
  const cursorsEnabled = useLiveCursorsEnabled();
  const avatar = (
    <ClientOnly fallback={avatarPlaceholder}>
      <AvatarImage />
    </ClientOnly>
  );

  return (
    <>
      {/* The same popover on every screen size. */}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={
            signedIn ? content.accountMenu.value : content.signIn.value
          }
          title={signedIn ? undefined : content.signIn.value}
          data-bookmark-fly-target="account"
          className={avatarButtonClass}
        >
          <span className={avatarFaceClass} data-bookmark-fly-pulse="">
            {avatar}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-64">
          {/* Who is signed in, set apart from the item groups below. */}
          {signedIn && user && (
            <>
              <div className="flex flex-col px-1.5 py-1">
                <span className="text-muted-foreground text-xs">
                  {content.signedInAs}
                </span>
                <span className="truncate text-sm font-medium">
                  {user.email}
                </span>
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuLinkItem
            render={<Link to={ROUTES.FEATURED} />}
            className="group py-1.5"
          >
            {content.featured}
            <Sparkles
              aria-hidden="true"
              className="text-muted-foreground group-hover:text-foreground group-focus:text-accent-foreground ml-auto transition-colors"
            />
          </DropdownMenuLinkItem>
          <DropdownMenuLinkItem
            render={<Link to={ROUTES.BOOKMARKS} />}
            data-bookmark-fly-target="bookmarks-item"
            className="group py-1.5"
          >
            {content.bookmarks}
            <Bookmark
              aria-hidden="true"
              className="text-muted-foreground group-hover:text-foreground group-focus:text-accent-foreground ml-auto transition-colors"
            />
          </DropdownMenuLinkItem>
          <DropdownMenuSeparator />
          <DropdownMenuLinkItem
            render={<Link to={ROUTES.LISTINGS} />}
            className="group py-1.5"
          >
            {content.listings}
            <Briefcase
              aria-hidden="true"
              className="text-muted-foreground group-hover:text-foreground group-focus:text-accent-foreground ml-auto transition-colors"
            />
          </DropdownMenuLinkItem>
          <DropdownMenuLinkItem
            render={<Link to={ROUTES.SPONSORSHIPS} />}
            className="group py-1.5"
          >
            {content.sponsorships}
            <HandHeart
              aria-hidden="true"
              className="text-muted-foreground group-hover:text-foreground group-focus:text-accent-foreground ml-auto transition-colors"
            />
          </DropdownMenuLinkItem>
          <DropdownMenuSeparator />
          <DropdownMenuLinkItem
            render={<Link to={ROUTES.SETTINGS} />}
            className="group py-1.5"
          >
            {content.settings}
            <Settings
              aria-hidden="true"
              className="text-muted-foreground group-hover:text-foreground group-focus:text-accent-foreground ml-auto transition-colors"
            />
          </DropdownMenuLinkItem>
          <DropdownMenuItem
            onClick={() => feedbackDialog.open()}
            className="group py-1.5"
          >
            {feedbackContent.trigger}
            <ChatRoundDots
              aria-hidden="true"
              className="text-muted-foreground group-hover:text-foreground group-focus:text-accent-foreground ml-auto transition-colors"
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => keyboardShortcuts.open()}
            className="group py-1.5"
          >
            {content.keyboard}
            <Keyboard
              aria-hidden="true"
              className="text-muted-foreground group-hover:text-foreground group-focus:text-accent-foreground ml-auto transition-colors"
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Label left, single ghost toggle right-aligned. */}
          <div className="flex h-8 items-center gap-2 px-1.5">
            <span className="text-sm">{content.theme}</span>
            <button
              type="button"
              aria-label={content.theme.value}
              title={content.theme.value}
              onClick={onToggleTheme}
              className={cn(iconButtonClass, "-mr-2 ml-auto")}
            >
              {dark ? (
                <Moon aria-hidden="true" className="size-4" />
              ) : (
                <Sun aria-hidden="true" className="size-4" />
              )}
            </button>
          </div>
          {/* Other visitors' cursors on this page (and sharing ours). */}
          <div className="flex h-8 items-center gap-2 px-1.5">
            <span className="text-sm">{content.liveCursors}</span>
            <button
              type="button"
              aria-label={content.liveCursors.value}
              aria-pressed={cursorsEnabled}
              title={content.liveCursors.value}
              onClick={() => setLiveCursorsEnabled(!cursorsEnabled)}
              className={cn(
                iconButtonClass,
                "-mr-2 ml-auto",
                cursorsEnabled && "text-foreground"
              )}
            >
              <Cursor
                aria-hidden="true"
                weight={cursorsEnabled ? "Filled" : "Outline"}
                className="size-4"
              />
            </button>
          </div>
          {/* Interface sounds, toggled like the theme. */}
          <div className="flex h-8 items-center gap-2 px-1.5">
            <span className="text-sm">{content.sounds}</span>
            <SoundSwitch className={cn(iconButtonClass, "-mr-2 ml-auto")} />
          </div>
          <DropdownMenuSub>
            {/* No leading icon. ml-auto sits on EN (not the chevron), so EN
              rides right and centers exactly above the GitHub glyph, with
              the chevron flush after it above X. */}
            <DropdownMenuSubTrigger className="group h-8 gap-0 py-0 [&>svg:last-child]:hidden">
              {content.language}
              <span className="text-muted-foreground ml-auto w-8 shrink-0 text-center text-sm">
                {locale.toUpperCase()}
              </span>
              <span
                aria-hidden="true"
                className="-mr-2 flex size-8 shrink-0 items-center justify-center"
              >
                <ChevronRight className="text-muted-foreground group-hover:text-foreground size-4 transition-colors" />
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {LANGUAGE_OPTIONS.map((language) => (
                <DropdownMenuCheckboxItem
                  key={language.code}
                  checked={locale === language.code}
                  onCheckedChange={() => setLocale(language.code)}
                  className="py-1.5"
                >
                  {language.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          {/* Label left, GitHub then X right-aligned with the theme toggle. */}
          <div className="flex h-8 items-center gap-1 px-1.5">
            <span className="text-sm">{content.socials}</span>
            <div className="-mr-2 ml-auto flex items-center">
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
            // A plain row like the others (label left, icon right), in the
            // destructive colour: logging out is not a call to action.
            <DropdownMenuItem
              variant="destructive"
              onClick={signOut}
              className="py-1.5"
            >
              {content.signOut}
              <Exit aria-hidden="true" className="ml-auto" />
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => signInDialog.open()}
              className="hover:text-cta-foreground hover:**:text-cta-foreground focus:text-cta-foreground focus:**:text-cta-foreground not-data-[variant=destructive]:focus:**:text-cta-foreground p-0 hover:bg-transparent focus:bg-transparent"
            >
              <span
                className={cn(
                  buttonVariants({ variant: "gradient", size: "default" }),
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
    </>
  );
};
