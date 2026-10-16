import { CheckCircle } from "reicon-react/icons/CheckCircle";
import { Copy3 } from "reicon-react/icons/Copy3";

import { cn } from "@/lib/utils";

// Both glyphs share one cell: the outgoing one shrinks and blurs away while
// the incoming one grows into focus, so the swap reads as a single morph
// rather than two icons trading places.
const layer =
  "col-start-1 row-start-1 transition-[opacity,scale,filter] duration-200 ease-out motion-reduce:transition-none";
const hidden = "scale-50 opacity-0 blur-[2px]";

/** The copy button's icon: Copy3, morphing into a tick when `copied`. */
export const CopyIcon = ({
  copied,
  className,
}: {
  copied: boolean;
  className?: string;
}) => (
  <span aria-hidden="true" className={cn("grid", className)}>
    <Copy3 className={cn(layer, copied && hidden)} />
    <CheckCircle className={cn(layer, !copied && hidden)} />
  </span>
);
