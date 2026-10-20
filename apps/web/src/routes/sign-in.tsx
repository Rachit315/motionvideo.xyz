import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { z } from "zod";

import { LoginForm } from "@/components/login-form";
import { ROUTES } from "@/constants/routes";
import { createMetadata } from "@/seo/metadata";

interface SignInSearch {
  redirect?: string;
}

const routeApi = getRouteApi("/sign-in");

// Same-origin paths only, never "//evil.com".
const safeRedirect = z
  .string()
  .startsWith("/")
  .refine((path) => !path.startsWith("//"));

// Direct visits and redirects from account-only pages; elsewhere the header
// and bookmark buttons open the same form in a dialog.
const SignIn = () => {
  const search = routeApi.useSearch();
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm callbackURL={search.redirect ?? ROUTES.DASHBOARD} />
      </div>
    </main>
  );
};

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
  head: () =>
    createMetadata({
      canonical: ROUTES.SIGN_IN,
      noIndex: true,
      title: "Sign in",
    }),
  validateSearch: (search): SignInSearch => ({
    redirect: safeRedirect.safeParse(search.redirect).data,
  }),
});
