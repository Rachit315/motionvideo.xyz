import { createServerFn } from "@tanstack/react-start";

import { isAdminEmail } from "./admin";
import { getCurrentSession } from "./auth";

/** `signedIn`/`admin` for the /admin layout guard. */
export const getAdminAccess = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getCurrentSession();
    return {
      signedIn: session !== null,
      admin: session !== null && isAdminEmail(session.user.email),
    };
  }
);
