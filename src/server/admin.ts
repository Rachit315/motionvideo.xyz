import { env } from "cloudflare:workers";

import { getCurrentSession } from "./auth";

/** Whether `email` is listed in the comma-separated ADMIN_EMAILS var. */
export const isAdminEmail = (email: string) =>
  (env.ADMIN_EMAILS ?? "")
    .split(",")
    .some((admin) => admin.trim().toLowerCase() === email.toLowerCase());

/** Throws unless the request comes from an admin. Use in every admin handler. */
export const requireAdmin = async () => {
  const session = await getCurrentSession();
  if (!session || !isAdminEmail(session.user.email)) {
    throw new Error("Forbidden");
  }
  return session;
};
