import handler from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";

import { STATIC_PAGES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { UPLOAD_PATH_PREFIX } from "@/lib/uploads";

// Durable Object classes must be exported from the Worker entry.
export { Presence } from "@/server/presence";

const PRESENCE_PATH = "/api/presence";

// Worker entry. `www.` is attached as a custom domain too; send it to the
// apex so auth cookies and BETTER_AUTH_URL only ever see one origin.
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.hostname === `www.${SITE.DOMAIN}`) {
      url.hostname = SITE.DOMAIN;
      return Response.redirect(url.toString(), 301);
    }
    // Live presence WebSockets go straight to the one site-wide instance.
    if (url.pathname === PRESENCE_PATH) {
      const presence = env.PRESENCE.get(env.PRESENCE.idFromName("site"));
      return presence.fetch(request);
    }
    // Uploaded logos and covers (POST /api/upload), straight from R2.
    if (
      request.method === "GET" &&
      url.pathname.startsWith(UPLOAD_PATH_PREFIX)
    ) {
      const object = await env.UPLOADS.get(url.pathname.slice(1));
      if (!object) {
        return new Response("Not found", { status: 404 });
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("ETag", object.httpEtag);
      // Uploads are images only; never let a browser treat one as a page.
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Content-Security-Policy", "default-src 'none'; sandbox");
      return new Response(object.body, { headers });
    }
    // Prerendered at build time: serve the HTML file. It doesn't exist yet
    // while the build itself prerenders these pages, so render instead.
    if (STATIC_PAGES.includes(url.pathname)) {
      const page = await env.ASSETS.fetch(request);
      if (page.status !== 404) {
        return page;
      }
    }
    return handler.fetch(request);
  },
};
