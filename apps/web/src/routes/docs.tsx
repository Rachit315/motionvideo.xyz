import { Link, createFileRoute, getRouteApi } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useIntlayer } from "react-intlayer";
import { ArrowRight } from "reicon-react/icons/ArrowRight";

import { CopyIcon } from "@/components/copy-icon";
import { PageMain, SupportEmail } from "@/components/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { absoluteUrl } from "@/constants/url";
import { useTransientStatus } from "@/hooks/use-transient-status";
import { createMetadata } from "@/seo/metadata";
import { getLandingData } from "@/server/functions";

const routeApi = getRouteApi("/docs");

// Anchor ids of the sections, in page order; the table of contents links to them.
const SECTION_IDS = {
  start: "getting-started",
  skill: "install-skill",
  moves: "using-moves",
  mcp: "mcp",
  plans: "plans-and-billing",
  api: "public-api",
  help: "help",
} as const;
type SectionKey = keyof typeof SECTION_IDS;
const SECTION_KEYS: readonly SectionKey[] = [
  "start",
  "skill",
  "moves",
  "mcp",
  "plans",
  "api",
  "help",
];

// Install commands, exactly as in the skill repository's README.
const SKILL_COMMANDS = [
  {
    key: "interactive",
    command:
      "npx skills add git@github.com:motionvideohq/motionvideo-skill.git",
  },
  {
    key: "all",
    command:
      "npx skills add git@github.com:motionvideohq/motionvideo-skill.git --skill '*' -a claude-code -g -y",
  },
  { key: "update", command: "npx skills update" },
] as const;

const SKILL_NAMES = [
  "motion-video",
  "motion-system",
  "motion-storyboard",
  "motion-craft",
  "motion-review",
  "motion-remotion",
  "motion-hyperframes",
  "motion-editframe",
  "motion-fframes",
] as const;

// Public, unauthenticated endpoints (src/routes/api, src/routes/llms[.]txt.ts).
const API_ENDPOINTS = [
  { key: "catalog", path: "/api/catalog" },
  { key: "directories", path: "/api/catalog/directories" },
  { key: "moves", path: "/api/moves" },
  { key: "llms", path: "/llms.txt" },
] as const;

const CONDITIONAL_CURL = `curl -i ${absoluteUrl("/api/catalog")} -H 'If-None-Match: "<etag>"'`;

const linkClass = "text-foreground underline underline-offset-4";
const inlineCodeClass =
  "bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-xs";

/** A command or request on one line, with a copy button. */
const CodeLine = ({ code }: { code: string }) => {
  const content = useIntlayer("docs-page");
  const [status, flash] = useTransientStatus<"idle" | "copied" | "failed">(
    "idle"
  );
  const copied = status === "copied";
  const label = copied ? content.copied.value : content.copy.value;

  return (
    <div className="flex flex-col gap-1">
      <div className="bg-muted/50 flex items-center gap-2 rounded-xl p-2 pl-4">
        <code className="text-foreground min-w-0 flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap">
          {code}
        </code>
        <Button
          aria-label={label}
          size="sm"
          variant="outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              flash("copied");
            } catch {
              flash("failed");
            }
          }}
        >
          <CopyIcon copied={copied} />
          {label}
        </Button>
      </div>
      <output className="text-muted-foreground text-xs">
        {status === "failed" && content.copyError}
      </output>
    </div>
  );
};

const ArrowLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    to={to}
    className="text-foreground inline-flex w-fit items-center gap-1 text-sm font-medium hover:underline"
  >
    {children}
    <ArrowRight aria-hidden="true" className="size-3.5" />
  </Link>
);

const DocsSection = ({
  section,
  children,
}: {
  section: SectionKey;
  children: ReactNode;
}) => {
  const content = useIntlayer("docs-page");
  const id = SECTION_IDS[section];
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="text-muted-foreground flex scroll-mt-8 flex-col gap-4 leading-7"
    >
      <h2
        id={`${id}-title`}
        className="text-foreground text-xl font-semibold tracking-tight"
      >
        {content.titles[section]}
      </h2>
      {children}
    </section>
  );
};

const SubHeading = ({ children }: { children: ReactNode }) => (
  <h3 className="text-foreground mt-2 font-medium">{children}</h3>
);

const StartSection = () => {
  const { start } = useIntlayer("docs-page");
  const items = [
    { key: "gallery", to: ROUTES.HOME, item: start.items.gallery },
    { key: "moves", to: ROUTES.MOVES, item: start.items.moves },
    { key: "skill", to: ROUTES.MOTIONVIDEO_SKILL, item: start.items.skill },
    { key: "mcp", to: ROUTES.MCP, item: start.items.mcp },
  ];
  return (
    <DocsSection section="start">
      <p>{start.intro}</p>
      <dl className="flex flex-col gap-3">
        {items.map(({ key, to, item }) => (
          <div key={key}>
            <dt>
              <Link to={to} className={`${linkClass} font-medium`}>
                {item.term}
              </Link>
            </dt>
            <dd>{item.description}</dd>
          </div>
        ))}
      </dl>
    </DocsSection>
  );
};

const SkillSection = () => {
  const { skill } = useIntlayer("docs-page");
  return (
    <DocsSection section="skill">
      <p>{skill.intro}</p>
      <SubHeading>{skill.accessHeading}</SubHeading>
      <ol className="flex list-decimal flex-col gap-1.5 pl-5">
        <li>{skill.steps.subscribe}</li>
        <li>{skill.steps.portal}</li>
        <li>{skill.steps.invite}</li>
        <li>{skill.steps.install}</li>
      </ol>
      <ArrowLink to={ROUTES.DASHBOARD_SKILL}>{skill.dashboardLink}</ArrowLink>
      <SubHeading>{skill.cliHeading}</SubHeading>
      <p>{skill.cliIntro}</p>
      <ul className="flex flex-col gap-3">
        {SKILL_COMMANDS.map(({ key, command }) => (
          <li key={key} className="flex flex-col gap-1.5">
            <span className="text-sm">{skill.commands[key]}</span>
            <CodeLine code={command} />
          </li>
        ))}
      </ul>
      <SubHeading>{skill.manualHeading}</SubHeading>
      <p>{skill.manual}</p>
      <p className="text-sm">{skill.publicRepo}</p>
      <SubHeading>{skill.startHeading}</SubHeading>
      <p>
        {skill.start} <span className="text-foreground">{skill.example}</span>
      </p>
      <p>{skill.entry}</p>
      <ul aria-label={skill.skillsLabel.value} className="flex flex-wrap gap-2">
        {SKILL_NAMES.map((name) => (
          <li key={name}>
            <code className={inlineCodeClass}>{name}</code>
          </li>
        ))}
      </ul>
      <aside className="bg-card shadow-outline mt-2 flex flex-col gap-1 rounded-xl p-5 text-sm">
        <h3 className="text-foreground font-medium">{skill.legacyHeading}</h3>
        <p>{skill.legacy}</p>
      </aside>
    </DocsSection>
  );
};

const MovesSection = () => {
  const { moves } = useIntlayer("docs-page");
  return (
    <DocsSection section="moves">
      <p>{moves.intro}</p>
      <ol className="flex list-decimal flex-col gap-1.5 pl-5">
        <li>{moves.steps.find}</li>
        <li>{moves.steps.read}</li>
        <li>{moves.steps.copy}</li>
        <li>{moves.steps.tune}</li>
      </ol>
      <p className="text-sm">{moves.note}</p>
      <ArrowLink to={ROUTES.MOVES}>{moves.link}</ArrowLink>
    </DocsSection>
  );
};

const McpSection = () => {
  const { mcp } = useIntlayer("docs-page");
  return (
    <DocsSection section="mcp">
      <p>{mcp.body}</p>
      <ArrowLink to={ROUTES.MCP}>{mcp.link}</ArrowLink>
    </DocsSection>
  );
};

const PlansSection = () => {
  const { plans } = useIntlayer("docs-page");
  return (
    <DocsSection section="plans">
      <p>{plans.unlocks}</p>
      <p>{plans.options}</p>
      <p>{plans.billing}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <ArrowLink to={ROUTES.PRICING}>{plans.pricingLink}</ArrowLink>
        <ArrowLink to={ROUTES.DASHBOARD_BILLING}>{plans.billingLink}</ArrowLink>
      </div>
    </DocsSection>
  );
};

const ApiSection = () => {
  const { api } = useIntlayer("docs-page");
  return (
    <DocsSection section="api">
      <p>{api.intro}</p>
      <div className="shadow-outline overflow-x-auto rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">
                {api.endpoint}
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                {api.returns}
              </th>
            </tr>
          </thead>
          <tbody>
            {API_ENDPOINTS.map(({ key, path }) => (
              <tr key={key} className="border-t align-top">
                <td className="px-4 py-3 whitespace-nowrap">
                  <code className="text-foreground font-mono text-xs">
                    GET{" "}
                    <a href={path} className="underline underline-offset-4">
                      {path}
                    </a>
                  </code>
                </td>
                <td className="px-4 py-3 text-pretty">{api.rows[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SubHeading>{api.examples}</SubHeading>
      <ul className="flex flex-col gap-2">
        {API_ENDPOINTS.map(({ key, path }) => (
          <li key={key}>
            <CodeLine code={`curl ${absoluteUrl(path)}`} />
          </li>
        ))}
      </ul>
      <p className="text-sm">{api.conditional}</p>
      <CodeLine code={CONDITIONAL_CURL} />
    </DocsSection>
  );
};

const HelpSection = () => {
  const { help } = useIntlayer("docs-page");
  return (
    <DocsSection section="help">
      <p>{help.body}</p>
      <p>
        <Link to={ROUTES.CONTACT} className={linkClass}>
          {help.contactLink}
        </Link>{" "}
        {help.email} <SupportEmail />
      </p>
    </DocsSection>
  );
};

const Docs = () => {
  const content = useIntlayer("docs-page");
  const { signedIn } = routeApi.useLoaderData();

  return (
    <>
      <SiteHeader signedIn={signedIn} />
      <PageMain width="full">
        <div className="mx-auto grid w-full max-w-6xl gap-10 pt-6 sm:pt-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-16">
          <header className="flex max-w-3xl flex-col gap-3 lg:col-start-2">
            <h1 className="text-4xl font-semibold tracking-tight">
              {content.title}
            </h1>
            <p className="text-muted-foreground text-pretty">{content.intro}</p>
          </header>
          <nav
            aria-label={content.onThisPage.value}
            className="flex flex-col gap-3 lg:sticky lg:top-8 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start"
          >
            <p className="text-sm font-medium">{content.onThisPage}</p>
            <ol className="flex flex-col gap-2 text-sm">
              {SECTION_KEYS.map((key) => (
                <li key={key}>
                  <a
                    href={`#${SECTION_IDS[key]}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {content.titles[key]}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex max-w-3xl min-w-0 flex-col gap-14 lg:col-start-2">
            <StartSection />
            <SkillSection />
            <MovesSection />
            <McpSection />
            <PlansSection />
            <ApiSection />
            <HelpSection />
          </div>
        </div>
      </PageMain>
      <SiteFooter />
    </>
  );
};

export const Route = createFileRoute("/docs")({
  component: Docs,
  loader: () => getLandingData(),
  head: () =>
    createMetadata({
      canonical: ROUTES.DOCS,
      title: "Docs",
      description: `Get started with ${SITE.NAME}: install the Pro agent skill, use Moves prompts with your agent, connect the MCP server, manage your plan and read the public JSON API.`,
    }),
});
