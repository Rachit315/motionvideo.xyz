<div align="center">

<a href="https://motionvideo.xyz">
  <img src="public/og.png" alt="MotionVideo: Motion design, written in code." width="800" />
</a>

# MotionVideo

**Motion design, written in code.**

A searchable collection of AI-made motion videos and their public prompts and skills.<br /> The MotionVideo skill pack teaches your coding agent timing, easing, and choreography.

[Discover](https://motionvideo.xyz) · [Tools](https://motionvideo.xyz/tools) · [Creatives](https://motionvideo.xyz/creatives) · [Skills](https://motionvideo.xyz/skills) · [Extras](https://motionvideo.xyz/extras) · [MotionVideo skill](https://motionvideo.xyz/motionvideo-skill) · [About](https://motionvideo.xyz/about) · [Contact](https://motionvideo.xyz/contact)

[![GitHub stars](https://img.shields.io/github/stars/motionvideohq/motionvideo.xyz?style=flat-square)](https://github.com/motionvideohq/motionvideo.xyz/stargazers) [![License: MIT](https://img.shields.io/github/license/motionvideohq/motionvideo.xyz?style=flat-square)](LICENSE) [![Follow on X](https://img.shields.io/badge/Follow-%40alaymanguy-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/alaymanguy)

</div>

---

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, server functions) |
| UI | [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com), [Tailwind CSS v4](https://tailwindcss.com), [Reicon](https://reicon.dev/docs/react) icons, [player.style](https://player.style) (Sutro) video player |
| Hosting | [Cloudflare Workers](https://workers.cloudflare.com), deployed with [Wrangler](https://developers.cloudflare.com/workers/wrangler/) and Workers Builds |
| Data | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) with [Drizzle ORM](https://orm.drizzle.team), [R2](https://developers.cloudflare.com/r2/) for video assets |
| Auth | [Better Auth](https://www.better-auth.com) (six-digit email codes) |
| Email | [Resend](https://resend.com) (sign-in and contact messages), Cloudflare Email Routing (inbound) |
| Payments | [Dodo Payments](https://dodopayments.com) as merchant of record (brand "MotionVideo"), with GitHub repository access delivery |
| Tooling | [pnpm](https://pnpm.io), [Vite](https://vite.dev), [Oxlint](https://oxc.rs) + [Oxfmt](https://oxc.rs) via [Ultracite](https://www.ultracite.ai), [Lefthook](https://lefthook.dev) |

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm db:migrate:local
pnpm dev
```

The Timeless website font is served same-origin from `/fonts/timeless/TimelessSansVF-1.094.woff2` (a `public/` file deployed with the site, cached immutably via `public/_headers`). The licensed font remains outside the public repository and is used only for website embedding: `public/fonts/timeless/` is gitignored and materialized by `pnpm fonts:pull`, which downloads the canonical copy from the `motionvideo-assets` R2 bucket (or use `FONT_SRC=<path-or-url> pnpm fonts:pull` with a local licensed file). `predev`/`prebuild` run it automatically — they skip when the file exists and fail loudly when it is missing and the download fails, so a deploy never silently ships the Arial fallback.

To replace the website font, obtain the family from [Timeless](https://timeless.co), retain its license locally, and place the versioned WOFF2 at `public/fonts/timeless/`. Update both `@font-face` URLs in `src/fonts.css` and the preload URL in `src/routes/__root.tsx` to the same versioned filename. (`src/fonts.css` is deliberately separate from `src/styles.css` so HMR on app styles never re-resolves the font.) Optionally also upload the new version to R2 with `pnpm exec wrangler r2 object put motionvideo-assets/fonts/timeless/TimelessSansVF-<version>.woff2 --file <path-to-woff2> --content-type font/woff2 --cache-control 'public, max-age=31536000, immutable' --remote` so future `fonts:pull` runs fetch it.

`pnpm build` bundles the client and Worker and prerenders the seven static content pages without payment secrets. The Dodo client initializes on the first payment operation; runtime payment credentials are still required.

Email templates are React Email components in `src/emails`. Preview them with `pnpm email:dev` (port 3001).

### Cloudflare PR Previews

Workers Builds uses `pnpm run build` followed by `npx wrangler preview` for non-production branches. The `previews` block in `wrangler.jsonc` supplies test-mode Dodo product IDs, the separate `motionvideo-preview` D1 database, and a separate rate-limit namespace. `preview_urls` enables workers.dev Preview hostnames while `workers_dev: false` keeps the production Worker on its custom domains.

The v2 branch Preview is [feat-motionvideo-v2-motionvideo.pawaraniket508.workers.dev](https://feat-motionvideo-v2-motionvideo.pawaraniket508.workers.dev). For another branch, set `previews.vars.BETTER_AUTH_URL` to its Preview origin (`https://<normalized-branch>-motionvideo.pawaraniket508.workers.dev`) before deploying so sign-in links and checkout returns stay on that Preview.

Apply staging schema changes with `pnpm db:migrate:preview` before deploying a Preview. The `env.preview` block exists only for D1 migration commands; use `wrangler preview`, not `wrangler deploy --env preview`, to publish the app. Preview branches share this staging database, but never the production database.

Preview credentials are stored in Cloudflare's Previews Base configuration, separately from production secrets: `BETTER_AUTH_SECRET`, a test-mode `DODO_PAYMENTS_API_KEY`, and `DODO_PAYMENTS_WEBHOOK_KEY`. Manage them with `pnpm exec wrangler preview base-config secret put <NAME>`. Base secrets apply to new Previews; update existing ones with `pnpm exec wrangler preview secret put <NAME> --name <branch>`. No production Resend key is configured for Previews, so emails use the existing console-only development behavior.

## Discover, directories, and skill access

- The header lists Discover and Tools, then a More menu with Creatives, Skills, and Extras (the trigger reads as current on any of them); the mobile menu lists all five sections. Search (⌘K) lists the same pages.
- `/` is the public video gallery: compact sponsor/maker strip, type and category filters, search, sorting, and responsive masonry. The first card contains the introduction, Surprise me (within the current filters), and a Submit a video CTA.
- Each category is its own page, `/category/<category>` (e.g. `/category/product-ui`), with its own title, description, canonical, and heading; `type` and `sort` stay search params. Unknown categories 404.
- Videos open as overlay routes over the gallery: `/videos/<slug>` from Discover, `/category/<category>/videos/<slug>` from a category page (canonical: `/videos/<slug>`); closing returns to the page underneath. Masonry remeasures when cards, viewport width, or content heights change.
- `/tools` lists public tools, with a page per category: `/tools/ai`, `/tools/editors`, `/tools/mockups`, `/tools/motion`. `/skills` lists open-source agent skills and `/extras` the resources that fit no other section; both are split out of the tools import in code (`src/lib/directories.ts`), so re-importing keeps the split. `/tools/skills` and `/tools/resources` redirect (301) to them. `/creatives` lists studios and independent designers, with `/creatives/studios` and `/creatives/designers`. `/studios` redirects (301) to `/creatives`. Category slugs are defined in `src/lib/directories.ts`.
- `/submit` accepts video, tool, creative, agent skill, and other submissions from signed-in accounts (signed-out visitors are sent to `/sign-in?redirect=/submit…`, keeping `?kind=` and `?category=`). Every Submit CTA, including the header's, passes the current section and category (e.g. `/tools/ai` → `/submit?kind=tool&category=ai`, `/category/product-ui` → `/submit?kind=video&category=product-ui`). The form's optional Category select offers the kind's categories (gallery categories for videos, directory categories for tools and creatives; none for skills and extras); invalid `?category=` values are ignored and the server rejects a category that doesn't belong to the kind. It is stored in `community_submission.category`.
- `/bookmarks` lists the signed-in user's saved videos and directory entries (tools, creatives, skills, extras), newest first, in the gallery masonry with `?kind=` filter chips; video cards open the overlay on Discover.
- `/featured` shows the signed-in user's submissions with their review status, and the catalog items they became as cards once featured.
- `/sponsorships` lists the signed-in user's sponsor subscriptions: billing status, the Dodo customer portal, and the placement form (name, link, line of copy, logo, cover for Diamond/Gold, category for Gold/Silver). Saving sends the placement to review; it stays hidden until approved.
- `/admin` (accounts listed in the `ADMIN_EMAILS` var only; everyone else gets a 404) reviews submissions (`/admin/submissions`: feature by linking a catalog item id of the same kind, decline, or reset), sponsor placements (`/admin/sponsorships`: approve or reject with a note), and site feedback (`/admin/feedback`: open/resolved). Submission and sponsor reviews email the submitter or sponsor.
- Feedback: the avatar menu's Feedback item opens a dialog (optional mood, message, and a reply email when signed out); it records the page it was opened on.
- `/jobs` uses the directory layout (type chips; intro tile whose only action is Post a job; the sponsored tile; equal 16:9 job tiles, featured first, ending with a dashed "Your role here" tile), and Discover pins a Motion jobs card under the sponsored card on desktop (3+ lanes; `MasonryItem.lane`). Plans: Standard $99 and Featured $199, one-time, listed for 30 days from approval (`src/constants/jobs.ts`). `/jobs/post` (signed in) is the sectioned form (plan, job, employer with logo upload, details, review); it saves a draft in the `job_post` table, then opens a Dodo checkout whose metadata carries `job_id`. Dodo returns to `/listings` (Listings in the account menu), where `payment_id` moves the draft to review; `payment.succeeded` does the same, and a full refund pulls the post (`src/server/jobs.ts`).
- Logos and covers on `/jobs/post` and `/sponsorships` are uploaded through `POST /api/upload` (signed in; PNG, JPEG or WebP checked by their bytes; 2 MB logos, 5 MB covers) into the `UPLOADS` R2 binding under `uploads/`, and served by the Worker at `/uploads/…` with `nosniff` and a sandboxing CSP. Image fields accept such a path or a public HTTPS URL (`imageRefSchema`). Previews need the `motionvideo-assets-preview` bucket: `wrangler r2 bucket create motionvideo-assets-preview`. `/admin/jobs` approves (starting the 30 days) or sends it back with a note; corrected posts return to review without paying again. Rejecting doesn't refund: refund in Dodo.
- Live presence: the header shows how many people are online, from one Durable Object (`Presence`, `src/server/presence.ts`, binding `PRESENCE`) that holds every tab's WebSocket at `/api/presence`. With Live cursors on (account menu or L; on by default, stored per browser), each tab shares its pointer on the current page and draws everyone else's in a random colour (`src/components/live-presence.tsx`). Tabs ping every 25 s; sockets silent for 70 s are dropped from the count. Nothing is stored.
- `/license` is the MotionVideo Skill Bundle license (personal and client use; no sharing, reselling, redistribution or training), linked under Legal in the footer and prerendered like the other legal pages.
- Jobs type pages: `/jobs/full-time`, `/jobs/part-time`, `/jobs/contract`, `/jobs/freelance` (`src/routes/jobs/$type.tsx`, shared `JobsBoard`); unknown types 404, and `/jobs/post` stays its own route.
- Every collection intro (Discover, Tools, Creatives, Skills, Extras, Jobs and their category pages) has a one-line title and a three-line description slot (`CollectionIntro`: `truncate`, `line-clamp-3 min-h-[3lh]`), so switching pages never shifts the grid; the copy is written to fit.
- The header wordmark's context menu copies the logomark, logotype or app icon as SVG markup, links to the brand guidelines (`/brand`) and downloads `public/brand/motionvideo-brand-assets.zip`.
- Analytics: PostHog (`src/lib/analytics.ts`), on only when `VITE_POSTHOG_KEY` is set at build time (`VITE_POSTHOG_HOST` for EU). The key lives in `.env.production` (git-ignored; Vite reads it only for `pnpm build`), so local dev sends nothing. Data goes to the US project "Default project" (free plan, one project allowed; shared with the CLI's `cli:*` events) and its pinned "MotionVideo" dashboard. posthog-js loads lazily when the page is idle; page views on route change plus explicit events, with autocapture, session recording, surveys and anonymous person profiles off to stay in the free tier. Events: `track()` for non-click moments (video_open, prompt_copy, bookmark_toggle, search_open/select, sign_in_code_sent, sign_in, feedback_sent, theme/sounds/live_cursors toggles, shortcut, job_post_saved, sponsor_creative_saved, brand_copy) and `data-track` attributes on clicks (source_click, skill_click, surprise_me, submit_click, sponsor_click, sponsor_slot_open, checkout_start, job_apply, job_post_start, directory_open, brand_guidelines, brand_download).
- Cloudflare account settings are managed with the `cf` CLI (devDependency; `npx cf auth login` once): a zone Cache Rule caches everything on `assets.motionvideo.xyz` for a year at the edge (so repeat views don't count as R2 reads), a billing alert emails at $1 of spend, the media bucket's `r2.dev` URL stays disabled, and `motionvideo-assets-preview` backs uploads on Previews. Workers stays on the Free plan (hard daily limits, never billed); R2 is the only pay-as-you-go product. Builds and deploys still use Wrangler (`wrangler.jsonc`) until `cf` leaves beta, because `cf migrate` doesn't convert Durable Object migrations.
- Sending a sign-in code needs a Cloudflare Turnstile token (free, unlimited; widget "MotionVideo sign-in", site key in `src/constants/auth.ts`, test keys in development). Better Auth's `captcha` plugin checks it on `/email-otp/send-verification-otp` when the `TURNSTILE_SECRET_KEY` secret is set; without it codes send as before.
- Cost and abuse guards: every Worker response carries HSTS, `X-Frame-Options: DENY`, `nosniff`, a referrer policy and a permissions policy (`src/server.ts`). The presence WebSocket only accepts same-origin upgrades, caps the Durable Object at 500 sockets, and cursors send at most ~8 updates a second, never from background tabs. Uploads are rate-limited per IP (`UPLOAD_LIMITER`, 10/min) and, in production, linked from `UPLOADS_PUBLIC_URL` (the bucket's edge-cached domain) instead of the Worker. Accounts can hold at most 10 unpaid job drafts.
- Keyboard shortcuts (`src/components/keyboard-shortcuts.tsx`, keys in `src/constants/shortcuts.ts`): 1–5 open Discover, Tools, Creatives, Skills, Extras, J opens Jobs; E, B, P, S open Featured, Bookmarks, Sponsorships, Settings; F opens feedback, D toggles the theme, M the interface sounds, L live cursors, ⌘K or / opens search, and ? (or Keyboard in the account menu) lists every shortcut. Keys are ignored while typing and inside the video player, which has its own.
- `/motionvideo-skill` retains the original skill landing, demos, FAQ, pricing, and checkout links.
- `/sponsor` lists the Diamond ($500/mo), Gold ($250/mo), and Silver ($150/mo) sponsorship plans with catalogue counts and current sponsors per tier; each plan links to `/checkout?product=<tier>`. Founding sponsors (`FOUNDING_SPONSORS`) are credited there and fill the sponsored grid card while no Diamond sponsor is live; they never take a seat or a slot. On one-lane phones the sponsored card (and on Discover the jobs card) comes after the intro and three items. Diamond is capped at `SPONSOR_SLOTS` (3) seats, counting active or on-hold subscriptions, and shows as sold out when full. Live placements are the approved placements of active subscriptions: the sponsored grid card rotates Diamond, then (on a category page) that category's Gold, then its Silver; the sponsor slots under each intro show Diamond on every page plus, on a category page, that category's Gold (up to `SPONSOR_SLOTS` each), padded with dashed open slots to 3 — so 3 by default, up to 6 only when filled. Silver has no slot. Every tier needs a cover.
- Accounts: anyone can sign in with a six-digit code sent by email (Better Auth `emailOTP`: 10 minutes, 5 tries, stored hashed); the account is created on first sign-in. `/welcome` sends the code right after checkout, in the welcome email. Signed out, any link to an account page (`ACCOUNT_PAGES` in `src/constants/routes.ts`: Post a job, Listings, Featured, Bookmarks, Sponsorships, Settings, Submit, Dashboard), sponsor checkout links, their keyboard shortcuts, the header avatar and bookmark buttons open a sign-in dialog in place, which goes to the page once signed in (the same form as `/sign-in`, which remains for direct visits and redirects). The avatar menu links Featured, Bookmarks, Sponsorships, and Settings. Purchases are matched by email and shown on `/dashboard`; they do not gate sign-in.
- Public interfaces retain the existing light/dark theme and English, Spanish, and French dictionaries.

Product UI glyphs use direct `reicon-react/icons/<Name>` imports and the shared `Reicon` renderer (`src/components/ui/reicon.tsx`), which draws Reicon's Outline weight across the site; `filled` switches a glyph to the Filled weight for toggled states such as a saved bookmark. GitHub and X retain their original Simple Icons brand marks; MotionVideo's logomark, other brand artwork, and motion-design illustrations remain unchanged.

With a mouse or trackpad (`pointer: fine`), the site uses a custom arrow cursor (the [Kibo UI cursor](https://www.kibo-ui.com/components/cursor) pointer shape, black with a white keyline) for both the default and the pointer cursor, defined as SVG data URIs with a 2x `image-set()` in `src/styles.css`; Tailwind's `cursor-default`/`cursor-pointer` map to it too. Text fields and contenteditable keep the native I-beam, semantic cursors such as `not-allowed` and resize handles stay native, and touch devices are unaffected.

The account control uses [Reicon Avatars](https://github.com/dqev/reicon-avatars). A random anonymous seed is persisted in `sessionStorage`, keeping the avatar stable across routes and reloads within that browser session. Seeds do not contain account IDs or email addresses; requests omit the referrer. A Reicon user glyph covers initial hydration and avatar-loading failures without disabling account navigation. Creator photos remain their original attributed images.

Website typography uses the supplied Timeless Sans variable WOFF2, with the Grotesk style selected, weights 300–900, and normal/italic faces. `src/fonts.css` and the root preload reference the same same-origin font file. `font-display: optional` prevents a late font download from changing already-painted text and moving navigation or cards; slow cold loads retain the system fallback for that page. Email templates retain email-safe system fonts.

The catalog (`src/data/motion-catalog.json`) holds 370 videos, each credited to its creator and linked to the creator's original post on X; 243 publish their prompt and 5 link a skill. Directory entries live in `src/data/resource-directories.json`. Both are maintained in-repo.

New posts come in through the public FxTwitter API in three steps:

```bash
pnpm catalog:discover --since 2026-10-14   # default: last 7 days
pnpm catalog:import:videos                 # or catalog:import:articles
pnpm assets:mirror
```

`catalog:discover` reads the timelines of every creator already in the catalog (reposts and quotes included, which is how new creators surface) and prints candidate videos, X Articles and GitHub repos not yet listed; it changes nothing. Curate the ones worth adding into `SOURCES` in `scripts/import-x-videos.mjs` (post, title, content categories, and optionally where the prompt is: in the post or one of the creator's replies, between two markers) or `scripts/import-x-articles.mjs`. `catalog:import:videos` fetches each new post, picks the best MP4 for the detail view and a ~480px one for the card preview, adds a blur placeholder (needs `ffmpeg`), skips posts already in the catalog, and spreads new videos through the default order (one after every third existing video). Skills go straight into `src/data/resource-directories.json` with their sub-category in `SKILL_CATEGORY_BY_ID`.

Videos, previews, posters, avatars, and directory covers are served from our R2 bucket `motionvideo-assets` at `https://assets.motionvideo.xyz`. After adding entries with remote media URLs, run:

```bash
pnpm assets:mirror            # add --dry-run to list pending files
```

It downloads every remote media URL in `src/data/motion-catalog.json`, `src/data/resource-directories.json` and `src/data/x-articles.json`, uploads it with `wrangler r2 object put --remote` (immutable cache headers; keys embed a hash of the source URL, e.g. `motion/<slug>/video-<hash>.mp4`, `avatars/<handle>-<hash>.jpg`, `directories/tools/<id>-<hash>.webp`), skips objects already on the domain, and rewrites only successfully mirrored URLs. It needs `wrangler login`. Inclusion does not imply use of the MotionVideo skill.

`wrangler` uploads at most 300 MiB per file; the mirror reports larger files as failures and leaves their source URLs. Re-encode such a file under 300 MiB (e.g. `ffmpeg -i in.mp4 -c:v libx264 -b:v 6500k -maxrate 7500k -bufsize 13000k -c:a aac -b:a 128k -movflags +faststart out.mp4`), upload it to the key `pnpm assets:mirror --dry-run` prints for it, then rerun the mirror to rewrite the URL. An empty `avatar` renders the user glyph (used for creators whose X account no longer exists); a failing avatar falls back to it too.

Discover, Tools, and Studios share `VirtualMasonry` (`src/components/virtual-masonry.tsx`): window-scrolled, shortest-lane packing, with only cards near the viewport mounted. Hovering a card for 2 s zooms it into a preview positioned by Floating UI (via Base UI's PreviewCard) against a virtual anchor whose centre is clamped to the viewport, and the preview's width is capped by the viewport height, so it always opens fully on screen. Search lives in the ⌘K / `/` command menu, which lazy-loads the catalog and directories on first open.

On reload, a synchronous inline script measures the masonry container and intro before the first card paint. It uses the same packing function as React (`src/lib/masonry-layout.js`), and hydration adopts the measured snapshot instead of briefly rendering a guessed desktop width or intro height. Keep this script parser-blocking, rather than deferred or module-based, to preserve stable first-paint placement.

Each video has its own URL, `/videos/$slug`. Both it and `/` are children of the pathless `src/routes/_gallery.tsx` layout, so the video opens as an overlay route on top of the still-mounted grid (scroll and filters preserved). Links use TanStack Router's `viewTransition`; the card media and the overlay player share a `view-transition-name`, so the card morphs into the player and back.

Skills (`/skills`, `/skills/motion|product-films|ai-video`) and Extras (`/extras`, `/extras/articles|resources`) have category pages like Tools. The importer files every skill under "Skills", so `src/lib/directories.ts` assigns each skill's sub-category by id (`SKILL_CATEGORY_BY_ID`); a new skill shows under All until it is added there.

Extras → Articles lists long-form X Articles on making motion videos with Claude Opus 5.5. The curated posts live in `SOURCES` in `scripts/import-x-articles.mjs`; `pnpm catalog:import:articles` fetches each title, preview, author and cover through the public FxTwitter API into `src/data/x-articles.json` (failing if a post is gone or no longer an article), then `pnpm assets:mirror` moves the covers to assets.motionvideo.xyz.

## Payments

[Dodo Payments](https://dodopayments.com) is the merchant of record, under the Dodo brand "MotionVideo". `src/server/dodo.ts` holds every API call; there is no local copy of orders. Sponsor subscriptions are mirrored into the `sponsorship` table (`src/server/sponsorships.ts`) so placements can be reviewed and rendered. Job posts are one-time products (`DODO_PRODUCT_JOB_STANDARD`, `DODO_PRODUCT_JOB_FEATURED`); their live IDs in `wrangler.jsonc` stay empty until `pnpm dodo:setup --live` creates them, and checkout for a job fails until then.

- `GET /checkout?product=skill|diamond|gold|silver` (default `skill`) creates a hosted Checkout Session and 303-redirects to it. The product comes from a fixed allowlist of env product IDs and signed-in emails are prefilled. The skill bundle ($49) gets the launch code `MOTIONVIDEOLAUNCH` ($20 off, 100 uses) while it has uses left; Dodo only accepts a preset code when the checkout's code field is enabled, so that field appears only on launch-priced sessions, already filled in. Existing buyers go to `/dashboard`. Sponsor tiers are monthly subscriptions (Diamond $500, Gold $250, Silver $150) that require a signed-in account (signed-out visitors go to `/sign-in?redirect=/checkout?product=<tier>`), carry the account id in metadata, and return to `/sponsorships?subscription_id=…`, which syncs the subscription before rendering.
- The skill bundle returns to `/welcome?payment_id=…`. The page looks the payment up (it must be a skill bundle payment), then emails a sign-in link to its address once Dodo marks it succeeded; the thank-you email template is used only when the address has a paid order.
- `/dashboard` shows whether the signed-in email has a succeeded, not fully refunded skill bundle payment, with the customer portal for owners and a buy button otherwise. The launch offer's sold count is the discount's `times_used`.
- Delivery is Dodo's GitHub entitlement ("MotionVideo Skill repository", `pull` on `motionvideohq/motionvideo-skill`) attached to the skill bundle: the buyer connects GitHub in the Dodo customer portal (opened from `/dashboard`), Dodo sends the repository invite, and a refund removes it. The Dodo Payments GitHub App must be installed on the `motionvideohq` organization (Dodo dashboard → Entitlements → GitHub Access → Connect GitHub).
- `POST /api/webhook/dodo` verifies the Standard Webhooks signature with `DODO_PAYMENTS_WEBHOOK_KEY` on the raw body. `subscription.*` events re-read the subscription from the Dodo API and upsert its `sponsorship` row (so duplicate or out-of-order deliveries converge); a failed sync returns 500 so Dodo retries. Other events are acknowledged. Endpoints are business-wide, so it also receives other brands' events; non-sponsor products are ignored.

`pnpm dodo:setup` (test mode) and `pnpm dodo:setup --live` create or find the brand, the four products, the launch discount, the GitHub entitlement, and (live only) the webhook endpoint for `https://motionvideo.xyz/api/webhook/dodo`. It is idempotent and never touches the business's other brands. Test mode writes the IDs and a local webhook key to `.env` (pass `--test-webhook-url=<tunnel>/api/webhook/dodo` to register a test endpoint instead); live mode writes the IDs to `wrangler.jsonc` vars. Set the production secrets without displaying them:

```bash
pnpm -s dodo:setup --live --print-secret=api-key | pnpm wrangler secret put DODO_PAYMENTS_API_KEY
pnpm -s dodo:setup --live --print-secret=webhook-key | pnpm wrangler secret put DODO_PAYMENTS_WEBHOOK_KEY
```

Environment: `DODO_PAYMENTS_ENVIRONMENT` (`test_mode` | `live_mode`; anything else means test), `DODO_PAYMENTS_API_KEY`, `DODO_PAYMENTS_WEBHOOK_KEY`, `DODO_PRODUCT_SKILL`, `DODO_PRODUCT_SPONSOR_DIAMOND`, `DODO_PRODUCT_SPONSOR_GOLD`, `DODO_PRODUCT_SPONSOR_SILVER`, `DODO_LAUNCH_DISCOUNT_ID`, plus `DODO_PAYMENTS_LIVE_API_KEY` in `.env` for the live setup run only. Keep the discount ID stable: recreating the discount resets the sold count. `ADMIN_EMAILS` (comma-separated) gates `/admin`.

To test a webhook locally, sign a payload with the `.env` key per [Standard Webhooks](https://www.standardwebhooks.com/) (HMAC-SHA256 of `<webhook-id>.<webhook-timestamp>.<body>`), or forward real test events with the Dodo CLI (`dodo wh listen http://localhost:3000/api/webhook/dodo`) after pointing `DODO_PAYMENTS_WEBHOOK_KEY` at that endpoint's secret.

## Newsletter, submission, bookmark, and sponsorship storage

Apply D1 migrations with `pnpm db:migrate:local` for development. `pnpm deploy` applies remote migrations before deployment; deployments outside that command must run `pnpm db:migrate:remote` before enabling these forms.

- Newsletter signup requires explicit consent and stores the normalized email, consent timestamp, and creation timestamp in `newsletter_subscriber`. Duplicate signups succeed without replacing the original consent record. Signup collects an audience; it does not send a welcome email or configure a campaign service.
- Submissions require a signed-in account and attribution permission, and store the account email, name, title, public HTTPS URL, description, and an optional video prompt in `community_submission`, with `status = 'pending'`. Admins set `featured` (with `featured_item_id`, a video slug or directory entry id of the same kind, after adding the item to the catalog) or `declined` from `/admin/submissions`. Submitted URLs are never fetched.
- Bookmarks live in `bookmarks (user_id, kind, item_id, created_at)` with a `(user_id, kind, item_id)` primary key; `kind` is `video` (item = catalog slug) or a directory kind (item = entry id). Rows are deleted with their user. `src/server/bookmark-functions.ts` lists and sets them for the session's user only, accepting items that exist in the catalogs. The client keeps one optimistic store (`src/lib/bookmarks.ts`) shared by every bookmark button.
- Sponsorships live in `sponsorship`, keyed by Dodo subscription id: mirrored billing fields (tier, status, renewal, customer) plus the sponsor's placement and its review state (`draft` → `pending` → `approved`/`rejected`).
- Feedback lives in `feedback` (mood, message, page, account or optional reply email, created/resolved times). Each message is also emailed to the support inbox with Reply-To set when there is an address; a failed email does not lose the stored row. It shares the contact rate limiter and has a honeypot.
- Both forms validate on the client and server, include a honeypot, and reuse the existing contact rate limiter. Success is shown only after the D1 write succeeds; validation, rate-limit, and storage failures are reported in the form.
- Retrieve the opted-in audience with privileged D1 access, not a public endpoint:

```bash
pnpm exec wrangler d1 execute DB --remote --command "SELECT email, newsletter_consent_at, created_at FROM newsletter_subscriber ORDER BY created_at DESC"
```

The privacy policy covers this collection, retention, and consent withdrawal through the contact page.

## License

The website source code is released under the [MIT License](LICENSE). The MotionVideo skill pack, brand name, and logomark are not covered by this license; the skill pack is sold separately under its own [terms](https://motionvideo.xyz/terms).

Imported creator videos, prompts, and media retain their owners’ rights and are not covered by the website’s MIT license.

Timeless font assets are governed by the accompanying Timeless Free Font License 1.2, not the website's MIT license. Reicon's base artwork includes Solar Icons by [480 Design](https://solar-icons.vercel.app/) (CC BY 4.0) and [Zappicon](https://zappicon.com/).

The 404 figure is a [Hairline](https://github.com/lucasmarkes/hairline) figure by Lucas Marques (MIT; see `src/components/hairline/LICENSE`). `kernel.js` is vendored verbatim and `missing-frame.js` was made with its `hairline-create` skill; both are excluded from lint and format, and edits go to the figure only, rechecked with the skill's `look.mjs`.

## Made by

[Aniket Pawar](https://www.aniketpawar.com) ([@alaymanguy](https://x.com/alaymanguy)), who also runs [Shadcn Labs](https://www.shadcn-labs.com).
