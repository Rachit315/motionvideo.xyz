/**
 * Request header /welcome sends with its sign-in code request, so the code
 * arrives in the post-checkout welcome email (only if the email has a paid
 * order; the server checks).
 */
export const WELCOME_HEADER = "x-motionvideo-welcome";
