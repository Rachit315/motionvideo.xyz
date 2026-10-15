import type { SponsorTier } from "@/constants/sponsors";
import { cn } from "@/lib/utils";

/**
 * A tiny wireframe of a page: the intro (with its sponsor slots) in the
 * first column's first row, a card under it, and the grid with the sponsored
 * card top right. Diamond and Gold light up a slot and the card; Silver only
 * the card.
 */
export const PlacementSketch = ({ tier }: { tier: SponsorTier }) => {
  const tile = "bg-muted rounded-sm";
  const accent = "bg-primary rounded-sm";
  return (
    <div
      aria-hidden="true"
      className="bg-card shadow-outline grid aspect-video grid-cols-4 grid-rows-2 gap-1.5 overflow-hidden rounded-xl p-3"
    >
      <div className="flex flex-col justify-end gap-1">
        <span className={cn(tile, "h-1.5 w-3/4")} />
        <span className={cn(tile, "h-1 w-full")} />
        <span className="mt-1 flex gap-0.5">
          <span className={cn(tier === "silver" ? tile : accent, "size-2")} />
          <span className="border-foreground/30 size-2 rounded-sm border border-dashed" />
          <span className="border-foreground/30 size-2 rounded-sm border border-dashed" />
        </span>
      </div>
      <span className={tile} />
      <span className={tile} />
      <span className={accent} />
      <span className={tile} />
      <span className={tile} />
      <span className={tile} />
      <span className={tile} />
    </div>
  );
};
