import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import { WELCOME_HEADER } from "../constants/auth";
import type * as schema from "./db/schema";

export interface AuthConfig {
  baseURL: string;
  secret: string;
  /** `welcome`: requested from /welcome right after checkout. */
  sendSignInCode: (
    email: string,
    code: string,
    options: { welcome: boolean }
  ) => Promise<void>;
}

// Runtime-agnostic factory: no `cloudflare:workers` import, so the Better Auth
// CLI can load it (`pnpm auth:schema`) to regenerate the Drizzle schema.
export const createAuth = (
  db: DrizzleD1Database<typeof schema>,
  config: AuthConfig
) =>
  betterAuth({
    baseURL: config.baseURL,
    secret: config.secret,
    database: drizzleAdapter(db, { provider: "sqlite" }),
    rateLimit: {
      enabled: true,
      storage: "database",
      customRules: {
        "/email-otp/send-verification-otp": { window: 60, max: 3 },
        "/sign-in/email-otp": { window: 60, max: 10 },
      },
    },
    advanced: {
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
    },
    plugins: [
      // Six-digit email codes; the account is created on first sign-in.
      emailOTP({
        otpLength: 6,
        expiresIn: 60 * 10,
        allowedAttempts: 5,
        storeOTP: "hashed",
        sendVerificationOTP: ({ email, otp }, ctx) =>
          config.sendSignInCode(email, otp, {
            // Set by /welcome; the server still checks for a paid order.
            welcome: ctx?.headers?.get(WELCOME_HEADER) === "1",
          }),
      }),
      // Must stay last.
      tanstackStartCookies(),
    ],
  });
