import { DurableObject } from "cloudflare:workers";
import { z } from "zod";

import type {
  PresenceClientMessage,
  PresenceServerMessage,
} from "@/lib/presence";

// Live presence for the whole site: one instance (named "site") holds every
// open tab's WebSocket. It counts them for the header's "online" pill and
// relays cursor positions between tabs on the same page. Nothing is stored;
// a visitor is an anonymous id and a colour for as long as the tab is open.
// Hibernatable sockets: idle connections cost nothing between messages.

/** Random hues tried per connection; the one farthest from hues in use wins. */
const HUE_CANDIDATES = 12;

/** Distance between two hues around the colour wheel, 0–180. */
const hueDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
};

/**
 * A fresh random cursor hue for each connection, kept clear of the hues
 * other visitors already have, so cursors stay tellable apart.
 */
const pickHue = (taken: number[]) => {
  let best = Math.floor(Math.random() * 360);
  let bestGap = -1;
  for (let i = 0; i < HUE_CANDIDATES; i += 1) {
    const hue = Math.floor(Math.random() * 360);
    const gap = Math.min(180, ...taken.map((t) => hueDistance(hue, t)));
    if (gap > bestGap) {
      best = hue;
      bestGap = gap;
    }
  }
  return best;
};

const PATH_MAX = 200;
/** Open sockets kept at once; more are refused (free-tier guard). */
const MAX_SOCKETS = 500;
/** Tabs ping every 25 s; a socket silent for longer than this is dropped. */
const SILENT_LIMIT = 70_000;

interface Visitor {
  id: string;
  /** 0–359, kept so later visitors can pick a hue away from it. */
  hue: number;
  color: string;
  /** The page the tab is on; cursors only go to tabs on the same page. */
  path: string;
  /** Connect time, ms; the liveness baseline until the first ping. */
  since: number;
}

// Untrusted input from any tab: validated and clamped here.
const clientMessageSchema = z.discriminatedUnion("t", [
  z.object({
    t: z.literal("page"),
    p: z.string().transform((path) => path.slice(0, PATH_MAX)),
  }),
  z.object({
    t: z.literal("move"),
    // x: fraction of the page width; y: px from the top of the page.
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1_000_000),
  }),
  z.object({ t: z.literal("leave") }),
]);

const parse = (raw: string | ArrayBuffer): PresenceClientMessage | null => {
  if (raw instanceof ArrayBuffer || raw.length > 400) {
    return null;
  }
  try {
    const result = clientMessageSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    // Not JSON.
    return null;
  }
};

const trySend = (socket: WebSocket, message: string) => {
  try {
    socket.send(message);
  } catch {
    // Closing; webSocketClose updates the count.
  }
};

export class Presence extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    // Answered without waking the object; the timestamp shows liveness.
    ctx.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair("ping", "pong")
    );
  }

  /**
   * Open sockets, minus `except` and any tab that stopped pinging (a closed
   * laptop or dropped network may never send a close frame); those are
   * closed here so the online count stays honest.
   */
  private liveSockets(except?: WebSocket) {
    const now = Date.now();
    return this.ctx.getWebSockets().filter((socket) => {
      if (socket === except) {
        return false;
      }
      // SAFETY: fetch() attaches a Visitor to every socket it accepts.
      const visitor = socket.deserializeAttachment() as Visitor | null;
      const last =
        this.ctx.getWebSocketAutoResponseTimestamp(socket)?.getTime() ??
        visitor?.since ??
        0;
      if (now - last <= SILENT_LIMIT) {
        return true;
      }
      try {
        socket.close(1001, "silent");
      } catch {
        // Already closed.
      }
      return false;
    });
  }

  fetch(request: Request): Response {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected a WebSocket", { status: 426 });
    }
    if (this.ctx.getWebSockets().length >= MAX_SOCKETS) {
      return new Response("Busy", { status: 503 });
    }
    const { 0: client, 1: server } = new WebSocketPair();
    const id = crypto.randomUUID().slice(0, 8);
    const taken: number[] = [];
    for (const socket of this.ctx.getWebSockets()) {
      // SAFETY: fetch() attaches a Visitor to every socket it accepts.
      const other = socket.deserializeAttachment() as Visitor | null;
      // Sockets from before hues existed carry none.
      if (other && Number.isFinite(other.hue)) {
        taken.push(other.hue);
      }
    }
    const hue = pickHue(taken);
    const visitor: Visitor = {
      id,
      hue,
      // Saturated, mid-light: reads on light and dark pages with a white edge.
      color: `hsl(${hue} 85% 55%)`,
      path: "/",
      since: Date.now(),
    };
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment(visitor);
    const hello: PresenceServerMessage = {
      t: "hello",
      id,
      color: visitor.color,
    };
    server.send(JSON.stringify(hello));
    this.broadcastCount();
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(socket: WebSocket, raw: string | ArrayBuffer) {
    const message = parse(raw);
    // SAFETY: fetch() attaches a Visitor to every socket it accepts.
    const visitor = socket.deserializeAttachment() as Visitor | null;
    if (!message || !visitor) {
      return;
    }
    if (message.t === "page") {
      if (message.p !== visitor.path) {
        // Tabs on the old page drop this cursor.
        this.sendToPage(visitor.path, { t: "gone", id: visitor.id }, socket);
        socket.serializeAttachment({ ...visitor, path: message.p });
      }
      return;
    }
    if (message.t === "leave") {
      this.sendToPage(visitor.path, { t: "gone", id: visitor.id }, socket);
      return;
    }
    this.sendToPage(
      visitor.path,
      {
        t: "move",
        id: visitor.id,
        c: visitor.color,
        x: message.x,
        y: message.y,
      },
      socket
    );
  }

  webSocketClose(socket: WebSocket) {
    this.disconnect(socket);
  }

  webSocketError(socket: WebSocket) {
    this.disconnect(socket);
  }

  private disconnect(socket: WebSocket) {
    // SAFETY: fetch() attaches a Visitor to every socket it accepts.
    const visitor = socket.deserializeAttachment() as Visitor | null;
    try {
      socket.close(1000, "bye");
    } catch {
      // Already closed.
    }
    if (visitor) {
      this.sendToPage(visitor.path, { t: "gone", id: visitor.id }, socket);
    }
    this.broadcastCount(socket);
  }

  private broadcastCount(except?: WebSocket) {
    const sockets = this.liveSockets(except);
    const count: PresenceServerMessage = { t: "count", n: sockets.length };
    const message = JSON.stringify(count);
    for (const socket of sockets) {
      trySend(socket, message);
    }
  }

  private sendToPage(
    path: string,
    payload: PresenceServerMessage,
    except: WebSocket
  ) {
    const message = JSON.stringify(payload);
    for (const socket of this.liveSockets(except)) {
      // SAFETY: fetch() attaches a Visitor to every socket it accepts.
      const visitor = socket.deserializeAttachment() as Visitor | null;
      if (visitor?.path === path) {
        trySend(socket, message);
      }
    }
  }
}
