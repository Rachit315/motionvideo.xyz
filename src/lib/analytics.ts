// Product analytics through Cloudflare Zaraz: `zaraz.track()` sends custom
// events that show in the Zaraz dashboard (and any tool Zaraz forwards to).
// Zaraz is enabled per zone in the Cloudflare dashboard; until then, and in
// development, `window.zaraz` is absent and these calls do nothing.
//
// Two ways to track:
// - `track(event, props)` from code (non-click moments: sign-in, copy, etc.);
// - `data-track="event"` (plus `data-track-*` props) on any clickable element,
//   picked up by `trackClicks` (mounted once in the root).

export type AnalyticsProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    zaraz?: {
      track: (event: string, properties?: AnalyticsProps) => void;
    };
  }
}

export const track = (event: string, properties?: AnalyticsProps) => {
  try {
    window.zaraz?.track(event, properties);
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
  properties.path = location.pathname;
  track(name, properties);
};

/**
 * Sends `data-track` clicks: `<a data-track="sponsor_click" data-track-tier="gold">`
 * becomes `track("sponsor_click", { tier: "gold", path })`. Returns the cleanup.
 */
export const trackClicks = () => {
  document.addEventListener("click", onTrackedClick, true);
  return () => document.removeEventListener("click", onTrackedClick, true);
};
