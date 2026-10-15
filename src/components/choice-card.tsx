import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * One option of a radio group drawn as a card (plan, billing): title and
 * radio, then an optional dollar price with a note and an optional line of
 * detail. Without a price the title reads as the card's heading. Styled like
 * the plan cards on /sponsor.
 */
export const ChoiceCard = ({
  name,
  checked,
  onSelect,
  title,
  price,
  priceNote,
  body,
  disabled = false,
}: {
  /** The radio group's name. */
  name: string;
  checked: boolean;
  onSelect: () => void;
  title: ReactNode;
  price?: number;
  priceNote?: ReactNode;
  body?: ReactNode;
  disabled?: boolean;
}) => (
  <label
    className={cn(
      "bg-card shadow-outline flex cursor-pointer flex-col gap-3 rounded-xl p-4 transition-shadow",
      checked && "ring-primary ring-2",
      disabled && "cursor-not-allowed opacity-50"
    )}
  >
    <span
      className={cn(
        "flex items-center justify-between gap-2 font-semibold",
        price === undefined ? "text-base tracking-tight" : "text-sm"
      )}
    >
      {title}
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        disabled={disabled}
        className="accent-primary size-4"
      />
    </span>
    {price !== undefined && (
      <span className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          ${price}
        </span>
        <span className="text-muted-foreground text-xs">{priceNote}</span>
      </span>
    )}
    {body && <span className="text-muted-foreground text-sm">{body}</span>}
  </label>
);
