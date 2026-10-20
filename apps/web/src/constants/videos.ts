import { ASSETS } from "./links";

// Rendered videos on the assets CDN (see ASSETS). Empty entries show the
// animated placeholder instead.
export const VIDEOS = {
  hero: ASSETS.VIDEO_HERO,
  launch: ASSETS.VIDEO_LAUNCH,
  showreel: ASSETS.VIDEO_SHOWREEL,
} as const;
