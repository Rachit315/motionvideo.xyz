import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";

import { cn } from "@/lib/utils";

/**
 * Plain white arrow, bottom-right, on cards that are themselves one external
 * link (directory entries, sponsors). Cards whose click opens a detail view
 * get a real outline button for their off-site link instead.
 */
export const ExternalLinkChip = ({ className }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "flex size-7 shrink-0 items-center justify-center text-white",
      className
    )}
  >
    <ArrowRightUp className="size-4" />
  </span>
);
