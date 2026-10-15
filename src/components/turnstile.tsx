import { useEffect, useRef, useState } from "react";

import { TURNSTILE_SITE_KEY } from "@/constants/auth";

// Cloudflare Turnstile (free, no usage limits), rendered explicitly so the
// form decides when it needs a fresh token. Managed mode with
// `interaction-only`: most visitors never see it; a checkbox shows only when
// Cloudflare isn't sure.

interface TurnstileApi {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      appearance: "interaction-only";
      size: "flexible";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      "before-interactive-callback": () => void;
      "after-interactive-callback": () => void;
    }
  ) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptLoad: Promise<TurnstileApi> | null = null;

const loadTurnstile = () => {
  // Wraps the script's load/error events, a callback API with no promise.
  // oxlint-disable-next-line promise/avoid-new
  scriptLoad ??= new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.addEventListener("load", () => {
      if (window.turnstile) {
        resolve(window.turnstile);
      } else {
        reject(new Error("Turnstile unavailable"));
      }
    });
    script.addEventListener("error", () => {
      scriptLoad = null;
      reject(new Error("Turnstile failed to load"));
    });
    // SAFETY: the Workers types shadow the DOM `append` signature; at runtime
    // this is the browser's ParentNode.append.
    (document.head as ParentNode).append(script);
  });
  return scriptLoad;
};

/**
 * Renders the challenge and reports each token (null when it expires).
 * Change `resetKey` to get a fresh token after one has been used.
 */
export const Turnstile = ({
  onToken,
  resetKey,
}: {
  onToken: (token: string | null) => void;
  resetKey: number;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  // Out of the layout (no empty row, no stray gap) unless Cloudflare asks the
  // visitor to interact.
  const [interactive, setInteractive] = useState(false);
  const report = useRef(onToken);
  useEffect(() => {
    report.current = onToken;
  });

  useEffect(() => {
    let cancelled = false;
    const mount = async () => {
      const api = await loadTurnstile();
      if (cancelled || !container.current) {
        return;
      }
      widget.current = api.render(container.current, {
        sitekey: TURNSTILE_SITE_KEY,
        appearance: "interaction-only",
        size: "flexible",
        callback: (token) => report.current(token),
        "expired-callback": () => report.current(null),
        "error-callback": () => report.current(null),
        "before-interactive-callback": () => setInteractive(true),
        "after-interactive-callback": () => setInteractive(false),
      });
    };
    void mount();
    return () => {
      cancelled = true;
      if (widget.current) {
        window.turnstile?.remove(widget.current);
        widget.current = null;
      }
    };
  }, []);

  // A token is single-use: ask for a new one when the form says so.
  useEffect(() => {
    if (resetKey > 0 && widget.current) {
      report.current(null);
      window.turnstile?.reset(widget.current);
    }
  }, [resetKey]);

  return <div ref={container} hidden={!interactive} />;
};
