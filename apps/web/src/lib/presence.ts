// Messages between a tab and the presence Durable Object
// (src/server/presence.ts), as JSON over one WebSocket.

/** Tab → server. x: fraction of the page width; y: px from the page top. */
export type PresenceClientMessage =
  | { t: "page"; p: string }
  | { t: "move"; x: number; y: number }
  | { t: "leave" };

/** A cursor on the page: who, its colour, and where. */
export interface PresenceCursor {
  id: string;
  c: string;
  x: number;
  y: number;
}

/**
 * Server → tab. `cursors` answers every `page` message with the cursors
 * already on that page, so idle visitors show up without moving.
 */
export type PresenceServerMessage =
  | { t: "hello"; id: string; color: string }
  | { t: "count"; n: number }
  | ({ t: "move" } & PresenceCursor)
  | { t: "cursors"; list: PresenceCursor[] }
  | { t: "gone"; id: string };
