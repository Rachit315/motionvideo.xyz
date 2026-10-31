import { useId } from "react";
import type { MouseEvent, ReactNode } from "react";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

/**
 * One option of a radio group drawn as a card (plan, billing): title and
 * radio, then an optional dollar price with a note and an optional line of
 * detail. Without a price the title reads as the card's heading. Styled like
 * the plan cards on /sponsor.
 *
 * Renders inside a `RadioGroup`, which owns the selection: `value` names this
 * option, and the card's ring follows the radio's checked state. The whole
 * card selects the option: the title, price and detail are labels for the
 * radio, and a click anywhere else on the card (its padding, gaps) selects it
 * through `onSelect` too, except on controls inside it, so `children` (below
 * the detail) can hold their own controls.
 */
export const ChoiceCard = ({
  value,
  onSelect,
  title,
  price,
  priceNote,
  body,
  disabled = false,
  children,
}: {
  /** This option's value in the surrounding `RadioGroup`. */
  value: string;
  /** Selects this option on clicks that miss the radio (the card's padding). */
  onSelect: () => void;
  title: ReactNode;
  price?: number;
  priceNote?: ReactNode;
  body?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
}) => {
  const id = useId();
  const labelClass = cn("cursor-pointer", disabled && "cursor-not-allowed");
  const selectFromCard = (event: MouseEvent<HTMLDivElement>) => {
    // Labels and the radio select on their own; other controls keep theirs.
    if (
      disabled ||
      !(event.target instanceof Element) ||
      event.target.closest(
        "a, button, input, label, [role='button'], [role='radio']"
      )
    ) {
      return;
    }
    onSelect();
  };
  return (
    // The radio stays the keyboard and screen reader control; the card only
    // widens its click target.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={selectFromCard}
      className={cn(
        "bg-card shadow-outline flex flex-col gap-3 rounded-xl p-4 transition-shadow",
        "has-data-checked:ring-primary has-data-checked:ring-2",
        !disabled && "cursor-pointer",
        disabled && "opacity-50"
      )}
    >
      <span
        className={cn(
          "flex items-center justify-between gap-2 font-semibold",
          price === undefined ? "text-base tracking-tight" : "text-sm"
        )}
      >
        <label htmlFor={id} className={cn(labelClass, "min-w-0 flex-1")}>
          {title}
        </label>
        <RadioGroupItem id={id} value={value} disabled={disabled} />
      </span>
      {price !== undefined && (
        <label
          htmlFor={id}
          className={cn(labelClass, "flex items-baseline gap-1.5")}
        >
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            ${price}
          </span>
          <span className="text-muted-foreground text-xs">{priceNote}</span>
        </label>
      )}
      {body && (
        <label
          htmlFor={id}
          className={cn(labelClass, "text-muted-foreground text-sm")}
        >
          {body}
        </label>
      )}
      {children}
    </div>
  );
};
