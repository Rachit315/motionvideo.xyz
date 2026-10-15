import { useEffect } from "react";

import { trackClicks } from "@/lib/analytics";

/** Mounted once in the root: sends every `data-track` click (see analytics). */
export const ClickTracking = () => {
  useEffect(() => trackClicks(), []);
  return null;
};
