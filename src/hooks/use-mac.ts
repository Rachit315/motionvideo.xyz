import { useSyncExternalStore } from "react";

const subscribeNever = () => () => {
  // The platform never changes while the page is open.
};

/**
 * Whether shortcuts use ⌘ (Apple platforms) rather than Ctrl. The server and
 * the first client render assume ⌘, so hydration matches.
 */
export const useIsMac = () =>
  useSyncExternalStore(
    subscribeNever,
    () => /mac|iphone|ipad/iu.test(navigator.userAgent),
    () => true
  );
