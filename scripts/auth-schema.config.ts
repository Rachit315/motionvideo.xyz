// Loaded only by the Better Auth CLI (`pnpm auth:schema`) to generate
// src/server/db/schema.ts. The CLI reads options; it never touches the DB.
import { drizzle } from "drizzle-orm/d1";

import { createAuth } from "../src/server/auth-config";

// SAFETY: the CLI only reads the auth options; the D1 binding is never called.
export const auth = createAuth(drizzle({} as D1Database), {
  baseURL: "http://localhost:3000",
  secret: "cli-only-secret-cli-only-secret-00",
  sendSignInCode: async () => {
    /* empty */
  },
});
