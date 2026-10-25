import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { z } from "zod";

import { LoginForm } from "@/components/login-form";
import { SignInFeed } from "@/components/sign-in-feed";
import { BrandHeader } from "@/components/site-header";
import {
  DEFAULT_LOCALE,
  ensureLocalizedPath,
  isLocale,
  localizedPath,
} from "@/constants/locales";
import type { LocaleHeadContext } from "@/constants/locales";
import { ROUTES } from "@/constants/routes";
import { createMetadata } from "@/seo/metadata";
import { getSignInFeed } from "@/server/sign-in-functions";

interface SignInSearch {
  redirect?: string;
}

const routeApi = getRouteApi("/$locale/sign-in");

// Same-origin paths only, never "//evil.com".
const safeRedirect = z
  .string()
  .startsWith("/")
  .refine((path) => !path.startsWith("//"));

// Direct visits and redirects from account-only pages; elsewhere the header
// and bookmark buttons open the same form in a dialog. On lg+ the gallery
// scrolls by in the right half.
const SignIn = () => {
  const search = routeApi.useSearch();
  const { locale } = routeApi.useParams();
  const feed = routeApi.useLoaderData();
  // Links from before the locale prefix still come back to the right page.
  const redirectTo = search.redirect
    ? ensureLocalizedPath(search.redirect, locale)
    : localizedPath(ROUTES.DASHBOARD, locale);
  return (
    <div data-no-bottom-blur className="relative grid min-h-svh lg:grid-cols-2">
      {/* Spans the whole page, not just the form's half, so the logo sits
          where the site header puts it on wide screens too. */}
      <BrandHeader className="absolute inset-x-0 top-0" />
      {/* Centred in its half, vertically too; the padding keeps it clear of
          the brand row on short screens. */}
      <main
        id="main-content"
        className="flex min-h-svh items-center justify-center px-6 py-24"
      >
        <div className="w-full max-w-sm">
          <LoginForm layout="page" callbackURL={redirectTo} />
        </div>
      </main>
      <div className="sticky top-0 hidden h-svh p-2 lg:block">
        <div className="bg-muted size-full overflow-hidden rounded-2xl">
          <SignInFeed videos={feed} />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/$locale/sign-in")({
  component: SignIn,
  loader: () => getSignInFeed(),
  staticData: { noIndex: true },
  head: ({ params }: LocaleHeadContext) =>
    createMetadata({
      title: getIntlayer(
        "account-meta",
        isLocale(params.locale) ? params.locale : DEFAULT_LOCALE
      ).signInTitle,
    }),
  validateSearch: (search): SignInSearch => ({
    redirect: safeRedirect.safeParse(search.redirect).data,
  }),
});
