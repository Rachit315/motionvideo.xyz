/**
 * Request header /welcome sends with its sign-in code request, so the code
 * arrives in the post-checkout welcome email (only if the email has a paid
 * order; the server checks).
 */
export const WELCOME_HEADER = "x-motionvideo-welcome";

/**
 * Turnstile site key (public). Development uses Cloudflare's always-pass test
 * key, so localhost needs no real widget.
 */
export const TURNSTILE_SITE_KEY = import.meta.env.DEV
  ? "1x00000000000000000000AA"
  : "0x4AAAAAAFXgOOxvmXdEdwMs";

/** Request header carrying the Turnstile token (Better Auth's captcha plugin). */
export const CAPTCHA_HEADER = "x-captcha-response";
