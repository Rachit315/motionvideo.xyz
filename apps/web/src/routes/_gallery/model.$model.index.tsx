import { createFileRoute } from "@tanstack/react-router";

import { MOTION_MODEL_NAMES, findMotionModel } from "@/lib/motion-catalog";
import { createMetadata } from "@/seo/metadata";

// Head tags for a model page, e.g. `/model/opus-5-5`: every motion design
// video made with that model. The parent route has rejected unknown models.
export const Route = createFileRoute("/_gallery/model/$model/")({
  head: ({ params }) => {
    const model = findMotionModel(params.model);
    const name = model ? MOTION_MODEL_NAMES[model] : params.model;
    return createMetadata({
      canonical: `/model/${params.model}`,
      title: `${name} motion design videos`,
      description: `Motion design and motion graphics made with ${name}: launch films, kinetic type, UI motion and more, each with the prompt or skill behind it.`,
    });
  },
});
