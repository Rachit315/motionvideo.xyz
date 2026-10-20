import { createFileRoute } from "@tanstack/react-router";

import { ROUTES, STATIC_PAGES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { absoluteUrl } from "@/constants/url";

// A map of the public site for LLM agents (https://llmstxt.org). Signed-in
// pages are intentionally absent; the JSON catalog endpoints below are the
// machine-readable way in.
const body = `# ${SITE.NAME}

> ${SITE.TAGLINE} ${SITE.DESCRIPTION.LONG}

## Pages

- [Gallery](${absoluteUrl(ROUTES.HOME)}): Motion videos grouped by category (product UI, kinetic type, charts, diagrams…), each with the prompt and skill behind it.
- [MotionVideo Skill](${absoluteUrl(ROUTES.MOTIONVIDEO_SKILL)}): The paid skill pack that teaches a coding agent motion design, with pricing, install steps, and an FAQ.
- [Tools](${absoluteUrl(ROUTES.TOOLS)}): Agent tools and plugins for motion design, by category.
- [Creatives](${absoluteUrl(ROUTES.CREATIVES)}): Studios, designers, and agencies that make motion work.
- [Skills](${absoluteUrl(ROUTES.SKILLS)}): Agent skills for motion design, by category.
- [Extras](${absoluteUrl(ROUTES.EXTRAS)}): Extra resources: assets, libraries, and references.
- [Jobs](${absoluteUrl(ROUTES.JOBS)}): Motion design job board.
- [Sponsor](${absoluteUrl(ROUTES.SPONSOR)}): Sponsorship placements on the site.
${STATIC_PAGES.map(
  (page) =>
    `- [${page.slice(1).replace(/^./u, (letter) => letter.toUpperCase())}](${absoluteUrl(page)})`
).join("\n")}

## Data

- [Motion catalog](${absoluteUrl("/api/catalog/")}): JSON of every gallery video with its prompt, model, stack, effort, and media URLs.
- [Directories](${absoluteUrl("/api/catalog/directories")}): JSON of the tools, studios, skills, and extras directories.

## Optional

- [Sitemap](${absoluteUrl("/sitemap.xml")})
`;

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(body, {
          headers: {
            "Cache-Control": "public, max-age=3600",
            "Content-Type": "text/plain; charset=utf-8",
          },
        }),
    },
  },
});
