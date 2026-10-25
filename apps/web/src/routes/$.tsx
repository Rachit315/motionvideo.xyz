import { createFileRoute, redirect } from "@tanstack/react-router";

import { DEFAULT_LOCALE, localizedPath } from "@/constants/locales";

// Fallback for unprefixed URLs when the Worker does not get a chance to
// negotiate a locale (for example, a client-side transition to an old link).
export const Route = createFileRoute("/$")({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `${localizedPath(location.pathname, DEFAULT_LOCALE)}${location.searchStr}`,
      statusCode: 307,
    });
  },
});
