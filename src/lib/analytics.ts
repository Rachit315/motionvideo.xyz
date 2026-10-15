import type { PostHog } from "posthog-js";

// Product analytics through PostHog (https://posthog.com). Enabled only when
// VITE_POSTHOG_KEY is set at build time; otherwise (and in development
// without a key) every call is a no-op. posthog-js is loaded lazily after
// the page is interactive, so it never weighs on first paint, and events
// sent before it loads are queued.
//
// Kept cheap on purpose (PostHog's free tier is 1M events a month): no
// autocapture, no session recording, no person profiles for anonymous
// visitors; page views plus the explicit events below.
//
// Two ways to track:
// - `track(event, props)` from code (non-click moments: sign-in, copy, etc.);
// - `data-track="event"` (plus `data-track-*` props) on any clickable element,
//   picked up by `startAnalytics` (mounted once in the root).

export type AnalyticsProps = Record<string, string | number | boolean>;

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

let client: PostHog | null = null;
const queue: [string, AnalyticsProps | undefined][] = [];

export const track = (event: string, properties?: AnalyticsProps) => {
  if (!KEY) {
    return;
  }
  try {
    if (client) {
      client.capture(event, properties);
    } else if (queue.length < 50) {
      queue.push([event, properties]);
    }
  } catch {
    // Analytics must never break the page.
  }
};

const onTrackedClick = (event: MouseEvent) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  const element = event.target.closest<HTMLElement>("[data-track]");
  const name = element?.dataset.track;
  if (!element || !name) {
    return;
  }
  const properties: AnalyticsProps = {};
  for (const [key, value] of Object.entries(element.dataset)) {
    if (key.startsWith("track") && key !== "track" && value !== undefined) {
      const prop = key.slice("track".length);
      properties[prop.charAt(0).toLowerCase() + prop.slice(1)] = value;
    }
  }
  track(name, properties);
};

const load = async (key: string) => {
  // Dynamic on purpose: keeps posthog-js (~50 kB) out of the main bundle and
  // off the critical path; it loads once the page is idle.
  const { default: posthog } = await import("posthog-js");
  posthog.init(key, {
    api_host: HOST,
    // SPA navigations count as page views.
    capture_pageview: "history_change",
    capture_pageleave: false,
    autocapture: false,
    disable_session_recording: true,
    disable_surveys: true,
    person_profiles: "identified_only",
    mask_all_text: true,
  });
  client = posthog;
  for (const [event, properties] of queue.splice(0)) {
    posthog.capture(event, properties);
  }
};

/**
 * Starts analytics once: loads PostHog when the browser is idle and sends
 * every `data-track` click. Returns the cleanup.
 */
export const startAnalytics = () => {
  if (!KEY) {
    return () => {
      // Analytics disabled: nothing was started.
    };
  }
  const idle =
    window.requestIdleCallback ??
    ((run: () => void) => window.setTimeout(run, 1500));
  idle(() => {
    void (async () => {
      try {
        await load(KEY);
      } catch {
        // Blocked or offline: the site works the same without analytics.
      }
    })();
  });
  document.addEventListener("click", onTrackedClick, true);
  return () => document.removeEventListener("click", onTrackedClick, true);
};
