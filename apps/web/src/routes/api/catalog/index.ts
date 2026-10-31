import { createFileRoute } from "@tanstack/react-router";

import catalog from "@/data/motion-catalog.json";
import { jsonEndpoint } from "@/server/catalog-api";

// The motion video catalog (`importedAt` + every video with its prompt), for
// the MCP server and other integrations; see `src/data/motion-catalog.json`.
const endpoint = jsonEndpoint(catalog);

export const Route = createFileRoute("/api/catalog/")({
  server: {
    handlers: {
      GET: ({ request }) => endpoint(request),
    },
  },
});
