import { useRouterState } from "@tanstack/react-router";
import {
  createContext,
  use,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useIntlayer } from "react-intlayer";

import { track } from "@/lib/analytics";
import type {
  PresenceClientMessage,
  PresenceServerMessage,
} from "@/lib/presence";
import { cn } from "@/lib/utils";

// Client half of src/server/presence.ts. One WebSocket per tab: it always
// reports which page the tab is on (so the header can show how many people
// are online), and, only while "Live cursors" is on, shares this tab's cursor
// and draws everyone else's on the same page.

const SOCKET_PATH = "/api/presence";
const STORAGE_KEY = "motionvideo-live-cursors";
/**
 * Minimum gap between cursor updates sent, in ms (~8 per second). Every
 * message counts toward the Durable Object's free daily requests (20
 * messages = 1 request), so this stays coarse; the CSS transition smooths it.
 */
const SEND_INTERVAL = 120;
/** A cursor with no update for this long is dropped, in ms. */
const STALE_AFTER = 15_000;
const RETRY_MAX = 30_000;
/** Keep-alive; the server drops sockets silent for 70 s. */
const PING_INTERVAL = 25_000;

const listeners = new Set<() => void>();
const subscribeCursors = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
};

/** Whether live cursors are on (default: on). Stored per browser. */
export const useLiveCursorsEnabled = () =>
  useSyncExternalStore(
    subscribeCursors,
    () => localStorage.getItem(STORAGE_KEY) !== "0",
    () => true
  );

export const setLiveCursorsEnabled = (enabled: boolean) => {
  localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  track("live_cursors_toggle", { enabled });
  for (const onChange of listeners) {
    onChange();
  }
};

interface RemoteCursor {
  id: string;
  color: string;
  /** The page this tab was on when the cursor arrived. */
  path: string;
  x: number;
  y: number;
  seen: number;
}

// The tab's one presence socket and page (LivePresenceProvider mounts once).
let socket: WebSocket | null = null;
let currentPath = "/";

const sendPresence = (message: PresenceClientMessage) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
};

/** People online right now (this tab included); null until connected. */
const OnlineContext = createContext<number | null>(null);

export const LivePresenceProvider = ({ children }: { children: ReactNode }) => {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const enabled = useLiveCursorsEnabled();
  const [online, setOnline] = useState<number | null>(null);
  const [cursors, setCursors] = useState<Map<string, RemoteCursor>>(
    () => new Map()
  );

  // Connection, reconnecting with backoff.
  useEffect(() => {
    let retry = 1000;
    let timer: number | undefined;
    let stopped = false;
    const ping = setInterval(() => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    }, PING_INTERVAL);

    const onMessage = (event: MessageEvent) => {
      let message: PresenceServerMessage;
      // "pong" (the keep-alive answer) is not JSON and falls through.
      try {
        // SAFETY: only our presence Durable Object writes to this socket.
        message = JSON.parse(String(event.data)) as PresenceServerMessage;
      } catch {
        return;
      }
      if (message.t === "count") {
        setOnline(message.n);
      } else if (message.t === "move") {
        setCursors((current) =>
          new Map(current).set(message.id, {
            id: message.id,
            color: message.c,
            path: currentPath,
            x: message.x,
            y: message.y,
            seen: Date.now(),
          })
        );
      } else if (message.t === "gone") {
        setCursors((current) => {
          const next = new Map(current);
          next.delete(message.id);
          return next;
        });
      }
    };

    const connect = () => {
      const protocol = location.protocol === "https:" ? "wss:" : "ws:";
      const opened = new WebSocket(
        `${protocol}//${location.host}${SOCKET_PATH}`
      );
      socket = opened;
      opened.addEventListener("open", () => {
        retry = 1000;
        sendPresence({ t: "page", p: currentPath });
      });
      opened.addEventListener("message", onMessage);
      opened.addEventListener("close", () => {
        // A replaced socket (effect re-run) must not clear the current one.
        if (socket !== opened) {
          return;
        }
        socket = null;
        setOnline(null);
        setCursors(new Map());
        if (!stopped) {
          timer = window.setTimeout(connect, retry);
          retry = Math.min(retry * 2, RETRY_MAX);
        }
      });
    };

    connect();
    return () => {
      stopped = true;
      clearTimeout(timer);
      clearInterval(ping);
      socket?.close(1000, "unmount");
    };
  }, []);

  // A new page: report it. Cursors from the old page stop rendering (they are
  // tagged with the page they arrived on) and age out.
  useEffect(() => {
    currentPath = path;
    sendPresence({ t: "page", p: path });
  }, [path]);

  // Share this tab's cursor while live cursors are on (mouse and trackpad
  // only; touch has no hovering cursor).
  useEffect(() => {
    if (!enabled || !matchMedia("(pointer: fine)").matches) {
      sendPresence({ t: "leave" });
      return;
    }
    let pending: { x: number; y: number } | null = null;
    let last = 0;
    let timer: number | undefined;
    let client: { x: number; y: number } | null = null;

    const flush = () => {
      timer = undefined;
      if (pending) {
        sendPresence({ t: "move", ...pending });
        last = Date.now();
        pending = null;
      }
    };
    const queue = () => {
      if (!client) {
        return;
      }
      // x as a fraction of the page width, so layouts of any width line up;
      // y in page pixels, so scrolling keeps the cursor on the same content.
      pending = {
        x: (client.x + scrollX) / document.documentElement.scrollWidth,
        y: client.y + scrollY,
      };
      if (timer === undefined) {
        timer = window.setTimeout(
          flush,
          Math.max(0, SEND_INTERVAL - (Date.now() - last))
        );
      }
    };
    const onMove = (event: PointerEvent) => {
      // Background tabs never send (synthetic or stray events).
      if (document.hidden) {
        return;
      }
      client = { x: event.clientX, y: event.clientY };
      queue();
    };
    const onLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        client = null;
        pending = null;
        sendPresence({ t: "leave" });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", queue, { passive: true });
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", queue);
      document.removeEventListener("mouseout", onLeave);
      clearTimeout(timer);
      sendPresence({ t: "leave" });
    };
  }, [enabled]);

  // Drop cursors whose tab went quiet without saying goodbye.
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors((current) => {
        const now = Date.now();
        const fresh = [...current.values()].filter(
          (cursor) => now - cursor.seen < STALE_AFTER
        );
        return fresh.length === current.size
          ? current
          : new Map(fresh.map((cursor) => [cursor.id, cursor]));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const visible = enabled
    ? [...cursors.values()].filter((cursor) => cursor.path === path)
    : [];

  return (
    <OnlineContext value={online}>
      {children}
      {visible.length > 0 &&
        createPortal(
          // Positioned against the document (body is not positioned), so
          // page coordinates map straight onto translate().
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-60 size-0"
          >
            {visible.map((cursor) => (
              <svg
                key={cursor.id}
                viewBox="0 0 16 16"
                width={18}
                height={18}
                className="absolute top-0 left-0 drop-shadow-sm transition-transform duration-150 ease-linear motion-reduce:transition-none"
                style={{
                  transform: `translate(${cursor.x * document.documentElement.scrollWidth}px, ${cursor.y}px)`,
                }}
              >
                <path
                  d="M1.5 1.2 14 6.3 8.3 8.3 6.3 14z"
                  fill={cursor.color}
                  stroke="white"
                  strokeWidth={1.2}
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>,
          document.body
        )}
    </OnlineContext>
  );
};

/** The header's "N online" pill. Reserves its space before connecting. */
export const OnlineCount = ({ className }: { className?: string }) => {
  const content = useIntlayer("site-header");
  const online = use(OnlineContext);
  return (
    <output
      aria-label={
        online === null ? undefined : `${online} ${content.online.value}`
      }
      className={cn(
        "text-muted-foreground inline-flex h-8 items-center gap-1.5 text-sm tabular-nums transition-opacity",
        online === null && "opacity-0",
        className
      )}
    >
      <span aria-hidden="true" className="relative flex size-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60 motion-reduce:animate-none" />
        <span className="relative size-2 rounded-full bg-emerald-500" />
      </span>
      {/* Phones show the dot and number only. */}
      <span aria-hidden="true">
        {online ?? 1}
        <span className="max-sm:hidden"> {content.online}</span>
      </span>
    </output>
  );
};
