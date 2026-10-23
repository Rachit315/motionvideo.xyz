import { createFileRoute } from "@tanstack/react-router";

import { findMotionType } from "@/lib/motion-catalog";
import type { MotionType } from "@/lib/motion-catalog";
import { createMetadata } from "@/seo/metadata";

const PAGES: Record<MotionType, { title: string; description: string }> = {
  prompt: {
    title: "Motion design prompts",
    description:
      "AI-made motion design and motion graphics videos with the exact prompts behind them. Copy a prompt and make your own.",
  },
  skill: {
    title: "Motion design made with agent skills",
    description:
      "AI-made motion design and motion graphics videos made with agent skills, linked to each skill so you can use it too.",
  },
};

// Head tags for a type page, `/type/prompt` or `/type/skill`. The parent
// route has rejected unknown types.
export const Route = createFileRoute("/_gallery/type/$type/")({
  head: ({ params }) => {
    const type = findMotionType(params.type);
    return createMetadata({
      canonical: `/type/${params.type}`,
      ...(type && PAGES[type]),
    });
  },
});
