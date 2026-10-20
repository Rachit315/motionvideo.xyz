import { useEffect } from "react";

import { startAnalytics } from "@/lib/analytics";

/** Mounted once in the root: loads PostHog and sends `data-track` clicks. */
export const ClickTracking = () => {
  useEffect(() => startAnalytics(), []);
  return null;
};
