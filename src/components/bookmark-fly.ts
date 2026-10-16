import { animate, arc } from "motion";

/**
 * Flies a small copy of the saved card (its poster or cover) along an arc
 * from the clicked bookmark button to the Bookmarks entry in the header
 * account menu, tilting and shrinking into it, so the save has a visible
 * destination. Cards without an image fly a dot.
 *
 * Progressive enhancement only: the bookmark toggle itself never waits for
 * this. It no-ops when there is nothing to fly to, when the target is
 * off-screen, under `prefers-reduced-motion`, or when too many flights are
 * already running (rapid clicking).
 */
const MAX_CONCURRENT_FLIGHTS = 3;
const DOT_SIZE = 20;
/** The flying copy of the card: a 16:9 thumbnail this wide. */
const THUMB_WIDTH = 72;

let activeFlights = 0;
const lastPulse = new WeakMap<Element, { stop: () => void }>();

const hasArea = (rect: DOMRect) => rect.width > 0 && rect.height > 0;

const inViewport = (rect: DOMRect) =>
  rect.bottom > 0 &&
  rect.top < window.innerHeight &&
  rect.right > 0 &&
  rect.left < window.innerWidth;

const pulse = (element: Element) => {
  try {
    lastPulse.get(element)?.stop();
    lastPulse.set(
      element,
      animate(element, { scale: [1, 1.18, 1] }, { duration: 0.32 })
    );
  } catch {
    // WAAPI unavailable: the bookmark still toggled, so stay quiet.
  }
};

/**
 * The saved card's own image: a video's poster, else the largest image on
 * the card (its cover, not an avatar). Undefined when the card has none.
 */
const cardImage = (source: HTMLElement) => {
  const card = source.closest(".group\\/card, [data-key]");
  const poster = card?.querySelector("video")?.poster;
  if (poster) {
    return poster;
  }
  let thumb: string | undefined;
  let largest = 0;
  for (const image of card?.querySelectorAll("img") ?? []) {
    const box = image.getBoundingClientRect();
    if (image.currentSrc && box.width * box.height > largest) {
      largest = box.width * box.height;
      thumb = image.currentSrc;
    }
  }
  return thumb;
};

/** The flying element, centred on `from`: a 16:9 thumbnail or a dot. */
const makeFlyer = (from: DOMRect, thumb: string | undefined) => {
  const width = thumb ? THUMB_WIDTH : DOT_SIZE;
  const height = thumb ? Math.round((THUMB_WIDTH * 9) / 16) : DOT_SIZE;

  const dot = document.createElement("div");
  dot.setAttribute("aria-hidden", "true");
  dot.dataset.bookmarkFlyDot = "";
  dot.style.position = "fixed";
  dot.style.left = `${from.left + from.width / 2 - width / 2}px`;
  dot.style.top = `${from.top + from.height / 2 - height / 2}px`;
  dot.style.width = `${width}px`;
  dot.style.height = `${height}px`;
  dot.style.borderRadius = thumb ? "8px" : "9999px";
  dot.style.background = thumb
    ? `var(--muted) center / cover no-repeat url("${thumb.replaceAll('"', "%22")}")`
    : "var(--primary)";
  dot.style.boxShadow =
    "0 6px 20px rgb(0 0 0 / 0.3), 0 0 0 2px var(--background)";
  dot.style.zIndex = "100";
  dot.style.pointerEvents = "none";
  return dot;
};

export const flyBookmarkToMenu = (source: HTMLElement) => {
  if (document.hidden) {
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  if (activeFlights >= MAX_CONCURRENT_FLIGHTS) {
    return;
  }

  // The menu is closed most of the time, so its Bookmarks row has no box to
  // fly to: aim at the avatar button that opens it instead. When the menu
  // happens to be open, fly to the row itself.
  const openItem = document.querySelector<HTMLElement>(
    '[data-bookmark-fly-target="bookmarks-item"]'
  );
  const openRect = openItem?.getBoundingClientRect();
  const target =
    openItem && openRect && hasArea(openRect) && inViewport(openRect)
      ? openItem
      : document.querySelector<HTMLElement>(
          '[data-bookmark-fly-target="account"]'
        );
  if (!target) {
    return;
  }
  // The menu positions against the trigger's box, so the landing pulse runs
  // on the avatar's inner face rather than the trigger itself.
  const pulseTarget =
    target.querySelector("[data-bookmark-fly-pulse]") ?? target;

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (!hasArea(from) || !hasArea(to) || !inViewport(to)) {
    return;
  }
  const deltaX = to.left + to.width / 2 - (from.left + from.width / 2);
  const deltaY = to.top + to.height / 2 - (from.top + from.height / 2);
  const distance = Math.hypot(deltaX, deltaY);
  if (distance < 24) {
    pulse(pulseTarget);
    return;
  }

  const dot = makeFlyer(from, cardImage(source));
  // SAFETY: `document` here is the page DOM (this only runs on click in the
  // browser); the cast works around a conflicting global `body` type.
  (document.body as ParentNode).append(dot);

  // Longer flights get a little more time; short hops stay snappy.
  const duration = Math.min(0.85, Math.max(0.5, distance / 1400));
  activeFlights += 1;
  let settled = false;
  const settle = (land: boolean) => {
    if (settled) {
      return;
    }
    settled = true;
    activeFlights = Math.max(0, activeFlights - 1);
    dot.remove();
    if (land) {
      pulse(pulseTarget);
    }
  };

  try {
    animate(
      dot,
      {
        x: deltaX,
        y: deltaY,
        // Lifts off a touch bigger, then shrinks into the avatar; tilts
        // toward the direction of travel and straightens as it lands.
        scale: [0.6, 1.1, 0.25],
        rotate: [0, deltaX >= 0 ? 12 : -12, 0],
        opacity: [1, 1, 0.8],
      },
      {
        duration,
        ease: "easeInOut",
        path: arc({ strength: 0.35, peak: 0.45 }),
        onComplete: () => settle(true),
      }
    );
    // Safety net: never leave a stray dot if the animation never completes
    // (tab hidden mid-flight, WAAPI hiccup, unmount during navigation).
    window.setTimeout(() => settle(false), duration * 1000 + 400);
  } catch {
    settle(false);
  }
};
