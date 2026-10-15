import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
});

// Refetches on window focus, so a sign-in in another tab updates this one
// when the visitor comes back.
export const { useSession } = authClient;
