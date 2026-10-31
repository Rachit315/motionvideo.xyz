import {
  oauthProviderAuthServerMetadata,
  oauthProviderOpenIdConfigMetadata,
} from "@better-auth/oauth-provider";
import { createFileRoute } from "@tanstack/react-router";

import {
  OAUTH_OPENID_CONFIG_SUFFIX,
  OAUTH_WELL_KNOWN_SUFFIX,
} from "@/constants/oauth";
import { getAuth } from "@/server/auth";

// Path-appended OAuth discovery (RFC 8414 §3.1, OIDC Discovery §4):
// `/api/auth/.well-known/<name>`. The path-inserted spellings live in
// src/routes/[.]well-known.$.ts.

const metadataHeaders = {
  "access-control-allow-origin": "*",
  "cache-control": "public, max-age=300",
};

// Built per request: `getAuth()` must not run at module scope.
const authServerMetadata = (request: Request) =>
  oauthProviderAuthServerMetadata(getAuth(), { headers: metadataHeaders })(
    request
  );
const openIdConfigMetadata = (request: Request) =>
  oauthProviderOpenIdConfigMetadata(getAuth(), { headers: metadataHeaders })(
    request
  );

const handle = (request: Request): Promise<Response> => {
  const { pathname } = new URL(request.url);
  if (pathname.endsWith(OAUTH_WELL_KNOWN_SUFFIX)) {
    return authServerMetadata(request);
  }
  if (pathname.endsWith(OAUTH_OPENID_CONFIG_SUFFIX)) {
    return openIdConfigMetadata(request);
  }
  return getAuth().handler(request);
};

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => getAuth().handler(request),
    },
  },
});
