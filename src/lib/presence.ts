// Messages between a tab and the presence Durable Object
// (src/server/presence.ts), as JSON over one WebSocket.

/** Tab → server. x: fraction of the page width; y: px from the page top. */
export type PresenceClientMessage =
  | { t: "page"; p: string }
  | { t: "move"; x: number; y: number }
  | { t: "leave" };

/** Server → tab. */
export type PresenceServerMessage =
  | { t: "hello"; id: string; color: string }
  | { t: "count"; n: number }
  | { t: "move"; id: string; c: string; x: number; y: number }
  | { t: "gone"; id: string };
