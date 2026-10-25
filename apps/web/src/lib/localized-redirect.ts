import { redirect } from "@tanstack/react-router";
import type { LocalesValues } from "intlayer";

import { LOCALE_ROUTE } from "@/components/localized-link";
import type { LocalizedNavigateOptions } from "@/hooks/use-localized-navigate";

/**
 * Loose redirect options, for the same reason as `LocalizedNavigateOptions`:
 * callers write app paths, not the generated `/$locale/...` route ids.
 */
type LocalizedRedirectOptions = Omit<
  LocalizedNavigateOptions,
  "to" | "params"
> & {
  params?: Record<string, string | undefined>;
  href?: string;
  code?: number;
  statusCode?: number;
  headers?: HeadersInit;
  throw?: unknown;
};

/**
 * `redirect` for routes under `/$locale`: callers pass the app path
 * (`/sign-in`) and the current locale is inserted as a route param.
 */
export const localizedRedirect = (
  to: string,
  locale: LocalesValues,
  options: LocalizedRedirectOptions = {}
) =>
  // SAFETY: `to` is an app path; prepending the locale segment produces the
  // matching generated `/$locale/...` route id.
  redirect({
    ...options,
    params: { locale, ...options.params },
    to: `/${LOCALE_ROUTE}${to}`,
  } as never);
