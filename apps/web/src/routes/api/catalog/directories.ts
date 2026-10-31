import { createFileRoute } from "@tanstack/react-router";

import directories from "@/data/resource-directories.json";
import { jsonEndpoint } from "@/server/catalog-api";

// The tools, studios, skills, and resources directories; see
// `src/data/resource-directories.json`.
const endpoint = jsonEndpoint(directories);

export const Route = createFileRoute("/api/catalog/directories")({
  server: {
    handlers: {
      GET: ({ request }) => endpoint(request),
    },
  },
});
