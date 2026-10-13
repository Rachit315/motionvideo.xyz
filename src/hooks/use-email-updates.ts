import { useState } from "react";

// Email updates default to on; stored per browser until the real preference
// backend lands.
export const EMAIL_UPDATES_KEY = "motionvideo-email-updates";

export const useEmailUpdates = () => {
  const [emailUpdates, setEmailUpdates] = useState(() => {
    if (typeof localStorage === "undefined") {
      return true;
    }
    return localStorage.getItem(EMAIL_UPDATES_KEY) !== "0";
  });
  const set = (checked: boolean) => {
    setEmailUpdates(checked);
    try {
      localStorage.setItem(EMAIL_UPDATES_KEY, checked ? "1" : "0");
    } catch {
      // Private browsing keeps the in-memory choice for this visit.
    }
  };
  return [emailUpdates, set] as const;
};
