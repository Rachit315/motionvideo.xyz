import { getRequest } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import { renderEmail } from "../emails/_render";
import SignInEmail, { signInSubject } from "../emails/sign-in";
import WelcomeEmail, { welcomeSubject } from "../emails/welcome";
import { createAuth } from "./auth-config";
import type { Auth } from "./auth-config";
import * as schema from "./db/schema";
import { purchaseStatus } from "./dodo";
import { sendEmail } from "./email";

const buildAuth = (): Auth =>
  createAuth(drizzle(env.DB, { schema }), {
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    turnstileSecret: env.TURNSTILE_SECRET_KEY || undefined,
    google:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }
        : undefined,
    // Open sign-up: any email gets a code, and the account is created the first
    // time it is used. Purchases are matched by email on the dashboard. The
    // welcome flag comes from the client, so the thank-you template is only
    // used when the email really has a paid order.
    sendSignInCode: async (email, code, { welcome }) => {
      const purchase = welcome ? await purchaseStatus(email) : null;
      if (purchase?.purchased) {
        const firstName = purchase.name?.trim().split(/\s+/u)[0] || null;
        const props = { firstName, code };
        await sendEmail({
          subject: welcomeSubject(props),
          to: email,
          ...(await renderEmail(<WelcomeEmail {...props} />)),
        });
        return;
      }
      await sendEmail({
        subject: signInSubject(code),
        to: email,
        ...(await renderEmail(<SignInEmail code={code} />)),
      });
    },
  });

let instance: Auth | undefined;

/**
 * The auth instance, built on first call. Only call it inside a request
 * handler: Better Auth runs plugin `init` as soon as it is constructed, and
 * the OAuth provider's init queries D1 (it seeds the MCP resource). Workers
 * forbid I/O at module scope, so building it there failed the init promise
 * for the isolate's lifetime and every session check returned 500.
 */
export const getAuth = (): Auth => {
  instance ??= buildAuth();
  return instance;
};

/** The signed-in session for the current request, or `null`. */
export const getCurrentSession = () =>
  getAuth().api.getSession({ headers: getRequest().headers });
