import { Link, createFileRoute, getRouteApi } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useIntlayer } from "react-intlayer";
import { ArrowRight } from "reicon-react/icons/ArrowRight";
import { ArrowUpRight } from "reicon-react/icons/ArrowUpRight";

import { GitHubIcon } from "@/components/brand-icons";
import { CopyIcon } from "@/components/copy-icon";
import { HeroHeader, PageMain, PageSection } from "@/components/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { useTransientStatus } from "@/hooks/use-transient-status";
import { createMetadata } from "@/seo/metadata";
import { getLandingData } from "@/server/functions";

// Product names, URLs, tool names and commands stay untranslated.
const MCP = {
  NAME: "MotionVideo MCP",
  SERVER_URL: "https://mcp.motionvideo.xyz/mcp",
  REPO: "https://github.com/motionvideohq/motionvideo-mcp",
  CURSOR_INSTALL:
    "https://cursor.com/install-mcp?name=motionvideo&config=eyJ1cmwiOiAiaHR0cHM6Ly9tY3AubW90aW9udmlkZW8ueHl6L21jcCJ9",
  VSCODE_INSTALL:
    "vscode:mcp/install?%7B%22name%22%3A%22motionvideo%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.motionvideo.xyz%2Fmcp%22%7D",
  CLAUDE_CODE_MARKETPLACE:
    "claude plugin marketplace add motionvideohq/motionvideo-mcp",
  CLAUDE_CODE_INSTALL: "/plugin install motionvideo",
  GROK_CLI:
    "grok mcp add --transport http motionvideo https://mcp.motionvideo.xyz/mcp",
} as const;

const TOOLS = [
  { name: "search-videos", key: "searchVideos" },
  { name: "get-video", key: "getVideo" },
  { name: "list-categories", key: "listCategories" },
  { name: "browse-directory", key: "browseDirectory" },
] as const;

const EXTRAS = [
  { name: "motionvideo://catalog/overview", key: "catalogOverview" },
  { name: "motionvideo://videos/{slug}", key: "videoEntry" },
  { name: "remix-video", key: "remixVideo" },
] as const;

const routeApi = getRouteApi("/mcp");

const linkClass = "text-foreground underline underline-offset-4";

/** Copies `text`, then flashes "Copied" (or an error line) for a moment. */
const useCopy = (text: string) => {
  const [status, flash] = useTransientStatus<"idle" | "copied" | "failed">(
    "idle"
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      flash("copied");
    } catch {
      flash("failed");
    }
  };
  return [status, copy] as const;
};

const CopyError = ({ failed }: { failed: boolean }) => {
  const content = useIntlayer("mcp-page");
  return (
    <output className="text-muted-foreground text-xs">
      {failed && content.copyError}
    </output>
  );
};

const CopyUrlButton = () => {
  const content = useIntlayer("mcp-page");
  const [status, copy] = useCopy(MCP.SERVER_URL);
  return (
    <div className="flex flex-col items-center gap-1">
      <Button size="lg" onClick={copy}>
        <CopyIcon copied={status === "copied"} />
        {status === "copied" ? content.copied : content.copyUrl}
      </Button>
      <CopyError failed={status === "failed"} />
    </div>
  );
};

/** One command or URL in a code font, with its own copy button. */
const CodeBlock = ({ code }: { code: string }) => {
  const content = useIntlayer("mcp-page");
  const [status, copy] = useCopy(code);
  return (
    <div className="flex flex-col gap-1">
      <div className="bg-muted flex items-center gap-2 rounded-lg py-1.5 pr-1.5 pl-3">
        <pre className="text-foreground min-w-0 flex-1 overflow-x-auto font-mono text-sm leading-6">
          <code>{code}</code>
        </pre>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={copy}
          aria-label={
            status === "copied" ? content.copied.value : content.copy.value
          }
        >
          <CopyIcon copied={status === "copied"} />
        </Button>
      </div>
      <CopyError failed={status === "failed"} />
    </div>
  );
};

const ExternalButton = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={buttonVariants({ variant: "outline", className: "self-start" })}
  >
    {children}
    <ArrowUpRight aria-hidden="true" />
  </a>
);

const Client = ({ name, children }: { name: string; children: ReactNode }) => (
  <article className="bg-card shadow-outline flex flex-col gap-3 rounded-xl p-5">
    <h3 className="text-foreground font-medium">{name}</h3>
    {children}
  </article>
);

const Mcp = () => {
  const content = useIntlayer("mcp-page");
  const { signedIn } = routeApi.useLoaderData();

  return (
    <>
      <SiteHeader signedIn={signedIn} />
      <PageMain width="narrow" className="gap-16">
        <HeroHeader
          title={MCP.NAME}
          intro={content.intro}
          actions={
            <>
              <CopyUrlButton />
              <a
                href={MCP.REPO}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                <GitHubIcon aria-hidden="true" className="size-4" />
                {content.github}
              </a>
            </>
          }
          note={content.note}
        />

        <PageSection title={content.toolsTitle.value}>
          <p>{content.toolsIntro}</p>
          <div className="shadow-outline overflow-x-auto rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="text-foreground">
                <tr className="border-b">
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    {content.toolColumn}
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    {content.whatColumn}
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((tool) => (
                  <tr key={tool.name} className="border-b last:border-b-0">
                    <th
                      scope="row"
                      className="text-foreground px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                    >
                      {tool.name}
                    </th>
                    <td className="px-4 py-3">{content.tools[tool.key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-foreground font-medium">{content.extrasTitle}</h3>
          <dl className="flex flex-col gap-3 text-sm">
            {EXTRAS.map((extra) => (
              <div key={extra.name} className="flex flex-col gap-0.5">
                <dt className="text-foreground font-mono">{extra.name}</dt>
                <dd>{content.extras[extra.key]}</dd>
              </div>
            ))}
          </dl>
        </PageSection>

        <PageSection title={content.connectTitle.value}>
          <p>{content.connectIntro}</p>
          <CodeBlock code={MCP.SERVER_URL} />
          <div className="flex flex-col gap-4 text-sm leading-6">
            <Client name="Claude">
              <p>{content.clients.claude}</p>
            </Client>
            <Client name="Claude Code">
              <p>{content.clients.claudeCodeMarketplace}</p>
              <CodeBlock code={MCP.CLAUDE_CODE_MARKETPLACE} />
              <p>{content.clients.claudeCodeInstall}</p>
              <CodeBlock code={MCP.CLAUDE_CODE_INSTALL} />
            </Client>
            <Client name="ChatGPT">
              <p>{content.clients.chatgpt}</p>
            </Client>
            <Client name="Cursor">
              <p>{content.clients.cursor}</p>
              <ExternalButton href={MCP.CURSOR_INSTALL}>
                {content.clients.addToCursor}
              </ExternalButton>
            </Client>
            <Client name={content.clients.otherTitle.value}>
              <p>{content.clients.other}</p>
              <ExternalButton href={MCP.VSCODE_INSTALL}>
                {content.clients.addToVsCode}
              </ExternalButton>
            </Client>
            <Client name="Grok">
              <p>{content.clients.grokWeb}</p>
              <p>{content.clients.grokCli}</p>
              <CodeBlock code={MCP.GROK_CLI} />
            </Client>
          </div>
        </PageSection>

        <PageSection title={content.proTitle.value}>
          <p>{content.proBody}</p>
          <Link
            to={ROUTES.PRICING}
            className="text-foreground inline-flex items-center gap-1 self-start font-medium hover:underline"
          >
            {content.seePlans}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </PageSection>

        <p className="text-muted-foreground">
          {content.docs}{" "}
          <Link to={ROUTES.DOCS} className={linkClass}>
            {content.readDocs}
          </Link>
        </p>
      </PageMain>
      <SiteFooter />
    </>
  );
};

export const Route = createFileRoute("/mcp")({
  component: Mcp,
  loader: () => getLandingData(),
  head: () =>
    createMetadata({
      canonical: ROUTES.MCP,
      title: "MCP",
      description: `Connect ${SITE.NAME} to Claude, ChatGPT, Cursor, VS Code and other MCP clients. Search AI-made motion videos, pull their original prompts, and browse motion tools and studios. Free, no sign-in.`,
    }),
});
