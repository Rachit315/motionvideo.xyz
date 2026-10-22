import { createFileRoute } from "@tanstack/react-router";

import { MOVES } from "@/lib/moves";
import { jsonEndpoint } from "@/server/catalog-api";

// The public half of every move (no prompts), for the MCP server and other
// integrations. Prompts stay behind Pro; a signed-in endpoint for them comes
// with MCP OAuth.
const endpoint = jsonEndpoint({ moves: MOVES });

export const Route = createFileRoute("/api/moves/")({
  server: {
    handlers: {
      GET: ({ request }) => endpoint(request),
    },
  },
});
