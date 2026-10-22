import { Dialog } from "@base-ui/react/dialog";
import { Link, useMatch, useRouterState } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { useIntlayer } from "react-intlayer";
import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";
import { Menu } from "reicon-react/icons/Menu";
import { Xmark } from "reicon-react/icons/Xmark";

import { AccountMenu } from "@/components/account-avatar";
import { Brand } from "@/components/brand";
import { CommandMenu } from "@/components/command-menu";
import { OnlineCount } from "@/components/live-presence";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ROUTES } from "@/constants/routes";
import { MOVE_FAMILIES } from "@/lib/move-families";
import { cn } from "@/lib/utils";

const RESOURCE_ROUTES = [
  ["discover", ROUTES.HOME],
  ["tools", ROUTES.TOOLS],
  ["creatives", ROUTES.CREATIVES],
  ["skills", ROUTES.SKILLS],
  ["extras", ROUTES.EXTRAS],
  ["jobs", ROUTES.JOBS],
] as const;
// The sections a Resources link leads to, gallery pages aside (`/_gallery`).
const RESOURCE_PATHS = RESOURCE_ROUTES.flatMap(([, to]) =>
  to === ROUTES.HOME ? [] : [to]
);

// Muted until hovered, open, or holding the current page; the list's pill
// supplies the hover fill.
const topLevelClass = cn(
  navigationMenuTriggerStyle(),
  "text-muted-foreground hover:text-foreground data-popup-open:text-foreground aria-[current=page]:text-foreground data-[current=true]:text-foreground relative z-1 transition-colors"
);
const panelLinkClass = "flex-col items-start gap-0.5 rounded-lg px-3 py-2";
const mobileHeadingClass = "text-muted-foreground text-sm font-medium";
const mobileLinkClass =
  "text-muted-foreground hover:text-foreground [&[aria-current=page]]:text-foreground focus-visible:ring-ring rounded-md py-1.5 text-xl font-semibold tracking-tight transition-colors outline-none focus-visible:ring-2";
const mobileTopLinkClass = cn(mobileLinkClass, "py-2 text-3xl");
const roundIconClass =
  "bg-secondary text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex size-9 items-center justify-center rounded-full transition-colors outline-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:ring-3";

const SkillLink = ({
  variant,
  size,
  onClick,
}: Pick<VariantProps<typeof buttonVariants>, "variant" | "size"> & {
  onClick?: () => void;
}) => {
  const content = useIntlayer("site-header");
  return (
    <Link
      to={ROUTES.MOTIONVIDEO_SKILL}
      aria-label={content.skillLabel.value}
      onClick={onClick}
      className={buttonVariants({ variant, size })}
    >
      {/* Serif type sets the skill apart from the regular nav. */}
      <span className="font-serif">
        <span className="opacity-55" aria-hidden="true">
          ~/
        </span>
        {content.skill}
      </span>
      <ArrowRightUp aria-hidden="true" />
    </Link>
  );
};

/** Which dropdown holds the current page, to mark its trigger. */
const useCurrentSection = () => {
  const inGallery = useMatch({ from: "/_gallery", shouldThrow: false });
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const under = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);
  if (inGallery || RESOURCE_PATHS.some(under)) {
    return "resources";
  }
  return under(ROUTES.MOVES) ? "techniques" : null;
};

const PanelLink = ({
  link,
  title,
  note,
}: {
  link: ReactElement;
  title: ReactNode;
  note: ReactNode;
}) => (
  <li>
    <NavigationMenuLink render={link} className={panelLinkClass}>
      <span className="font-medium">{title}</span>
      <span className="text-muted-foreground text-xs leading-snug">{note}</span>
    </NavigationMenuLink>
  </li>
);

/** Desktop: Resources and Techniques menus, then MCP, Pricing and Docs. */
const DesktopNav = () => {
  const content = useIntlayer("site-header");
  const moves = useIntlayer("moves");
  const section = useCurrentSection();
  return (
    <NavigationMenu className="-ml-2 hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={topLevelClass}
            data-current={section === "resources"}
          >
            {content.resources}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[34rem] grid-cols-2 gap-0.5">
              {RESOURCE_ROUTES.map(([key, to]) => (
                <PanelLink
                  key={key}
                  link={<Link to={to} />}
                  title={content[key]}
                  note={content.resourceNotes[key]}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={topLevelClass}
            data-current={section === "techniques"}
          >
            {content.techniques}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[34rem] grid-cols-[13rem_1fr] gap-1">
              <NavigationMenuLink
                render={<Link to={ROUTES.MOVES} />}
                className="bg-muted/60 flex-col items-start justify-end gap-1 rounded-lg p-4"
              >
                <span className="font-medium">{content.allMoves}</span>
                <span className="text-muted-foreground text-xs leading-snug">
                  {content.allMovesNote}
                </span>
              </NavigationMenuLink>
              <ul className="grid grid-cols-2 gap-0.5">
                {MOVE_FAMILIES.map((family) => (
                  <li key={family}>
                    <NavigationMenuLink
                      render={<Link to={ROUTES.MOVES} search={{ family }} />}
                      className="rounded-lg px-3 py-1.5"
                    >
                      {moves.familyLabels[family]}
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {(
          [
            [ROUTES.MCP, content.mcp],
            [ROUTES.PRICING, content.pricing],
            [ROUTES.DOCS, content.docs],
          ] as const
        ).map(([to, label]) => (
          <NavigationMenuItem key={to}>
            <NavigationMenuLink
              render={<Link to={to} />}
              className={cn(topLevelClass, "p-0 px-3")}
            >
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

/**
 * Below lg: Resources and Techniques as short lists, then MCP, Pricing and
 * Docs, with the skill CTA at the bottom. Account items and preferences stay
 * in the avatar popover, as on desktop.
 */
const MobileMenu = () => {
  const content = useIntlayer("site-header");
  const moves = useIntlayer("moves");
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={content.openMenu.value}
        className={roundIconClass}
      >
        <Menu aria-hidden="true" className="size-4" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup
          aria-label={content.navigation.value}
          className="bg-background text-foreground fixed inset-0 z-50 flex flex-col overflow-y-auto px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-opacity duration-200 outline-none data-ending-style:opacity-0 data-starting-style:opacity-0"
        >
          <div className="flex items-center justify-between">
            <Brand />
            <Dialog.Close
              aria-label={content.closeMenu.value}
              className={roundIconClass}
            >
              <Xmark aria-hidden="true" className="size-4" />
            </Dialog.Close>
          </div>
          <nav
            aria-label={content.navigation.value}
            className="mt-8 flex flex-col gap-8"
          >
            <div className="flex flex-col">
              <p className={mobileHeadingClass}>{content.resources}</p>
              {RESOURCE_ROUTES.map(([key, to]) => (
                <Link
                  key={key}
                  to={to}
                  onClick={close}
                  className={mobileLinkClass}
                >
                  {content[key]}
                </Link>
              ))}
            </div>
            <div className="flex flex-col">
              <p className={mobileHeadingClass}>{content.techniques}</p>
              <Link
                to={ROUTES.MOVES}
                activeOptions={{ includeSearch: false }}
                onClick={close}
                className={mobileLinkClass}
              >
                {content.allMoves}
              </Link>
              <div className="grid grid-cols-2 gap-x-4">
                {MOVE_FAMILIES.map((family) => (
                  <Link
                    key={family}
                    to={ROUTES.MOVES}
                    search={{ family }}
                    onClick={close}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md py-1 text-base transition-colors outline-none focus-visible:ring-2"
                  >
                    {moves.familyLabels[family]}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              {(
                [
                  [ROUTES.MCP, content.mcp],
                  [ROUTES.PRICING, content.pricing],
                  [ROUTES.DOCS, content.docs],
                ] as const
              ).map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={close}
                  className={mobileTopLinkClass}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="mt-auto flex flex-col pt-8">
            <SkillLink onClick={close} variant="gradient" size="xl" />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// One header for every page. Left: brand + navigation menu. Right: search,
// skill CTA, and account. Mobile: brand left; search, avatar, menu right.
// The online count sits before search (number only on phones).
// `signedIn` (from the page loader) only covers the first render; the account
// menu follows the client session after that.
export const SiteHeader = ({ signedIn }: { signedIn?: boolean }) => (
  <header className="mx-auto grid w-full max-w-[1800px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 px-4 py-3 sm:px-6 md:gap-x-3">
    <div className="flex min-w-0 items-center gap-x-3 lg:gap-x-4">
      <Brand />
      <DesktopNav />
    </div>
    <div className="flex items-center gap-2 justify-self-end">
      <OnlineCount className="sm:mr-1" />
      <CommandMenu />
      <div className="max-md:hidden">
        <SkillLink variant="gradient" />
      </div>
      <AccountMenu signedIn={signedIn} />
      {/* Below lg one menu holds sections, account, and preferences. */}
      <div className="lg:hidden">
        <MobileMenu />
      </div>
    </div>
  </header>
);
