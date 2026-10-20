import { useEffect, useRef, useState } from "react";

/**
 * A status that falls back to `idle` after `duration` ms, e.g. "Copied"
 * returning to "Copy prompt". Each new status restarts the timer.
 */
export const useTransientStatus = <Status extends string>(
  idle: Status,
  duration = 1500
) => {
  const [status, setStatus] = useState<Status>(idle);
  // 0 is never a live timer id, so clearing it is a no-op.
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = (next: Status) => {
    clearTimeout(timer.current);
    setStatus(next);
    timer.current = window.setTimeout(() => setStatus(idle), duration);
  };

  return [status, flash] as const;
};
