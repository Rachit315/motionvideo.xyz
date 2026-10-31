import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";

/**
 * Base UI slider in the app's styling: a muted track filled with primary up
 * to each thumb. Restyle parts through `data-slot` (`slider-track`,
 * `slider-range`, `slider-thumb`) from `className`. `label` names the thumbs
 * and `getAriaValueText` voices their values for assistive tech (the root's
 * own aria props don't reach them).
 */
const Slider = ({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  label,
  getAriaValueText,
  ...props
}: SliderPrimitive.Root.Props & { label?: string } & Pick<
    SliderPrimitive.Thumb.Props,
    "getAriaValueText"
  >) => {
  // One thumb per value: a range for array values, else a single thumb.
  const initial = value ?? defaultValue;
  const thumbs = Array.isArray(initial) ? initial : [initial];
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("data-horizontal:w-full", className)}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="bg-muted relative h-1.5 w-full grow overflow-hidden rounded-full select-none"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none"
          />
        </SliderPrimitive.Track>
        {thumbs.map((_, index) => (
          <SliderPrimitive.Thumb
            // Thumbs are positional: index is their identity.
            // oxlint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            data-slot="slider-thumb"
            getAriaLabel={label ? () => label : undefined}
            getAriaValueText={getAriaValueText}
            className="ring-ring/50 relative block size-4 shrink-0 rounded-full border-2 border-white bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_1px_3px_rgb(0_0_0/0.4)] transition-[box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
};

export { Slider };
