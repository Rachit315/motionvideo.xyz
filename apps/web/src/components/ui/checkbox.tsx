import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

import { cn } from "@/lib/utils";

type CheckboxCorner = "square" | "round";

const checkboxCorners: Record<CheckboxCorner, string> = {
  square: "rounded-[4px]",
  round: "rounded-full",
};

const Checkbox = ({
  className,
  corner = "square",
  ...props
}: CheckboxPrimitive.Root.Props & { corner?: CheckboxCorner }) => (
  <CheckboxPrimitive.Root
    data-slot="checkbox"
    data-corner={corner}
    className={cn(
      "t-check",
      "peer border-input group-has-[:focus-visible]/field-label:not-data-checked:border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-checked:bg-primary relative flex size-4 shrink-0 items-center justify-center border outline-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-invalid:ring-3",
      checkboxCorners[corner],
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      keepMounted
      data-slot="checkbox-indicator"
      className="grid place-content-center text-current"
    >
      <svg
        viewBox="-0.3 -0.3 11 8.6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-3"
      >
        <path d="M1 4L3.8 7L9.4 1" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

export { Checkbox, type CheckboxCorner };
