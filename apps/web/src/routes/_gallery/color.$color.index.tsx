import { createFileRoute } from "@tanstack/react-router";

import { createMetadata } from "@/seo/metadata";

// Head tags for a colour page, e.g. `/color/red`: every motion design video
// with that colour in its palette. The parent route has rejected unknown
// colours, so the slug is a plain colour word.
export const Route = createFileRoute("/_gallery/color/$color/")({
  head: ({ params }) => {
    const name = params.color.replace(/^./u, (letter) => letter.toUpperCase());
    return createMetadata({
      canonical: `/color/${params.color}`,
      title: `${name} motion design videos`,
      description: `${name} motion design and motion graphics: AI-made launch films, kinetic type, UI motion and more with ${params.color} in the palette, each with the prompt or skill behind it.`,
    });
  },
});
