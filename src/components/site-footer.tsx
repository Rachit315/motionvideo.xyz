import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useIntlayer } from "react-intlayer";
import { ChevronDown } from "reicon-react/icons/ChevronDown";

import { GitHubIcon, XIcon } from "@/components/brand-icons";
import { FooterWordmark } from "@/components/footer-wordmark";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { SoundSwitch } from "@/components/sound-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LINK } from "@/constants/links";
import {
  MORE_PRODUCTS,
  OTHER_PRODUCTS,
  SHADCN_LABS_PROJECTS,
} from "@/constants/products";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";
import { withUtm } from "@/lib/utm";

const FooterMenu = ({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className={buttonVariants({ variant: "subtle" })}>
      {label}
      <ChevronDown
        aria-hidden="true"
        className="size-3.5 transition-transform in-data-popup-open:rotate-180"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent side="top" align="end" className="w-52">
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

const IconLink = ({
  href,
  label,
  tooltip,
  children,
}: {
  href: string;
  label: string;
  tooltip: ReactNode;
  children: ReactNode;
}) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={buttonVariants({ size: "icon", variant: "subtle" })}
        />
      }
    >
      {children}
    </TooltipTrigger>
    <TooltipContent side="top">{tooltip}</TooltipContent>
  </Tooltip>
);

const mobileHeadingClass = "text-foreground font-medium";
const mobileLinkClass =
  "text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors outline-none focus-visible:ring-2";

export const SiteFooter = () => {
  const content = useIntlayer("site-footer");
  const legal = [
    [ROUTES.TERMS, content.terms],
    [ROUTES.PRIVACY, content.privacy],
    [ROUTES.REFUNDS, content.refunds],
    [ROUTES.LICENSE, content.license],
  ] as const;
  const company = [
    [ROUTES.ABOUT, content.about],
    [ROUTES.BRAND, content.brand],
    [ROUTES.CONTACT, content.contact],
    [ROUTES.SPONSOR, content.sponsor],
  ] as const;
  const products = [...OTHER_PRODUCTS, ...MORE_PRODUCTS];
  const labsMenu = (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{content.labsProjects}</DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-44">
        {SHADCN_LABS_PROJECTS.map((project) => (
          <DropdownMenuLinkItem
            key={project.name}
            href={withUtm(project.url, "footer")}
          >
            {project.name}
          </DropdownMenuLinkItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
  const socials = (
    <TooltipProvider>
      <IconLink
        href={LINK.GITHUB_REPO}
        label={content.githubRepository.value}
        tooltip={content.starGithub}
      >
        <GitHubIcon className="size-4" />
      </IconLink>
      <IconLink
        href={LINK.X_FOLLOW}
        label={`${content.followX.value}: ${SITE.AUTHOR.TWITTER}`}
        tooltip={content.followX}
      >
        <XIcon className="size-4" />
      </IconLink>
    </TooltipProvider>
  );
  const credit = (
    <p className="text-muted-foreground">
      © {new Date().getFullYear()} {SITE.NAME}
      <span className="mx-2" aria-hidden="true">
        ·
      </span>
      {content.builtBy}{" "}
      <a
        href={withUtm(LINK.AUTHOR_WEBSITE, "footer")}
        className="hover:text-foreground transition-colors"
      >
        {SITE.AUTHOR.FIRST_NAME}
      </a>
    </p>
  );

  return (
    <footer className="mx-auto mt-auto w-full max-w-[1800px] px-4 pt-6 text-sm sm:px-6">
      {/* Desktop: one row, link groups in dropdowns. */}
      <div className="flex items-center justify-between gap-x-4 max-md:hidden">
        {credit}
        <nav
          aria-label={content.footer.value}
          className="-mr-2 flex items-center gap-0.5"
        >
          <FooterMenu label={content.legal}>
            {legal.map(([to, label]) => (
              <DropdownMenuLinkItem key={to} render={<Link to={to} />}>
                {label}
              </DropdownMenuLinkItem>
            ))}
          </FooterMenu>
          <FooterMenu label={content.company}>
            {company.map(([to, label]) => (
              <DropdownMenuLinkItem key={to} render={<Link to={to} />}>
                {label}
              </DropdownMenuLinkItem>
            ))}
          </FooterMenu>
          <FooterMenu label={content.otherProducts}>
            {products.map((product) => (
              <DropdownMenuLinkItem
                key={product.name}
                href={withUtm(product.url, "footer")}
              >
                {product.name}
              </DropdownMenuLinkItem>
            ))}
            <DropdownMenuSeparator />
            {labsMenu}
          </FooterMenu>
          <span className="bg-border mx-1.5 h-4 w-px" aria-hidden="true" />
          {socials}
          <span className="bg-border mx-1.5 h-4 w-px" aria-hidden="true" />
          <LocaleSwitcher />
          {/* Theme and sound share one tooltip group. */}
          <TooltipProvider>
            <ThemeToggle />
            <SoundSwitch
              tooltip
              className={buttonVariants({ size: "icon", variant: "subtle" })}
              iconClassName="size-[18px]"
            />
          </TooltipProvider>
        </nav>
      </div>
      {/* Mobile: link groups as a two-column grid, products spanning both,
          then socials | locale + theme, then the credit line. */}
      <div className="flex flex-col gap-8 md:hidden">
        <nav
          aria-label={content.footer.value}
          className="grid grid-cols-2 gap-x-4 gap-y-8"
        >
          {(
            [
              [content.legal, legal],
              [content.company, company],
            ] as const
          ).map(([heading, links]) => (
            <div key={heading.value} className="flex flex-col gap-2.5">
              <p className={mobileHeadingClass}>{heading}</p>
              {links.map(([to, label]) => (
                <Link key={to} to={to} className={mobileLinkClass}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
          <div className="col-span-2 flex flex-col gap-2.5">
            <p className={mobileHeadingClass}>{content.otherProducts}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {products.map((product) => (
                <a
                  key={product.name}
                  href={withUtm(product.url, "footer")}
                  className={mobileLinkClass}
                >
                  {product.name}
                </a>
              ))}
              {/* Reads as one more product link; the chevron marks the menu. */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    mobileLinkClass,
                    "flex items-center gap-1 text-left"
                  )}
                >
                  {content.labsProjects}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-3.5 shrink-0 transition-transform in-data-popup-open:rotate-180"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-48">
                  {SHADCN_LABS_PROJECTS.map((project) => (
                    <DropdownMenuLinkItem
                      key={project.name}
                      href={withUtm(project.url, "footer")}
                    >
                      {project.name}
                    </DropdownMenuLinkItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
        <div className="-mx-2 flex items-center justify-between">
          <div className="flex items-center">{socials}</div>
          <div className="flex items-center">
            <LocaleSwitcher />
            {/* Theme and sound share one tooltip group. */}
            <TooltipProvider>
              <ThemeToggle />
              <SoundSwitch
                tooltip
                className={buttonVariants({ size: "icon", variant: "subtle" })}
                iconClassName="size-[18px]"
              />
            </TooltipProvider>
          </div>
        </div>
        {credit}
      </div>
      {/* Mobile: lifted slightly so the (half-height) progressive blur
          dissolves only the wordmark's lower edge. */}
      <div className="max-md:mt-8">
        <FooterWordmark />
      </div>
    </footer>
  );
};
