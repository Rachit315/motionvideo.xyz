import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cva } from "class-variance-authority";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ChevronDown } from "reicon-react/icons/ChevronDown";

import { cn } from "@/lib/utils";

interface Pill {
  x: number;
  top: number;
  width: number;
  height: number;
}

const NavigationMenuList = ({
  className,
  onPointerOver,
  onPointerLeave,
  onFocus,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<Pill | null>(null);
  const [shown, setShown] = useState(false);
  const inside = useRef(false);
  const pillRef = useRef<HTMLSpanElement>(null);

  const moveTo = (item: HTMLElement) => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const bounds = list.getBoundingClientRect();
    const box = item.getBoundingClientRect();
    const next = {
      x: box.left - bounds.left,
      top: box.top - bounds.top,
      width: box.width,
      height: box.height,
    };
    if (shown) {
      setPill(next);
      return;
    }

    flushSync(() => setPill(next));
    void pillRef.current?.getBoundingClientRect();
    setShown(true);
  };

  const itemUnder = (target: EventTarget | null) => {
    const list = listRef.current;
    if (!list || !(target instanceof Element)) {
      return null;
    }

    const item = target.closest<HTMLElement>(
      '[data-slot="navigation-menu-trigger"], [data-slot="navigation-menu-link"]'
    );
    return item && list.contains(item) ? item : null;
  };

  const settle = () => {
    const open =
      listRef.current?.querySelector<HTMLElement>("[data-popup-open]");
    if (open) {
      moveTo(open);
    } else {
      setShown(false);
    }
  };
  // Reads the latest `shown` without resubscribing the observer.
  const onPopupChange = useEffectEvent(() => {
    if (!inside.current) {
      settle();
    }
  });

  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const observer = new MutationObserver(() => onPopupChange());
    observer.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-popup-open"],
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <NavigationMenuPrimitive.List
      ref={listRef}
      data-slot="navigation-menu-list"
      className={cn(
        "group relative flex flex-1 list-none items-center justify-center gap-(--navigation-menu-gap) [--navigation-menu-gap:--spacing(2)]",
        className
      )}
      onPointerOver={(event) => {
        inside.current = true;
        const item = itemUnder(event.target);
        if (item) {
          moveTo(item);
        }
        onPointerOver?.(event);
      }}
      onPointerLeave={(event) => {
        inside.current = false;
        settle();
        onPointerLeave?.(event);
      }}
      onFocus={(event) => {
        const item = itemUnder(event.target);
        if (item) {
          moveTo(item);
        }
        onFocus?.(event);
      }}
      {...props}
    >
      {pill ? (
        <span
          ref={pillRef}
          aria-hidden
          data-slot="navigation-menu-pill"
          className={cn(
            "bg-nav-hover pointer-events-none absolute top-0 left-0 rounded-full ease-(--tabs-ease) motion-reduce:transition-none",
            shown
              ? "transition-[transform,width,opacity] duration-(--tabs-duration)"
              : "transition-opacity duration-150"
          )}
          style={{
            transform: `translateX(${String(pill.x)}px)`,
            top: pill.top,
            width: pill.width,
            height: pill.height,
            opacity: shown ? 1 : 0,
          }}
        />
      ) : null}
      {props.children}
    </NavigationMenuPrimitive.List>
  );
};

const NavigationMenuItem = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) => (
  <NavigationMenuPrimitive.Item
    data-slot="navigation-menu-item"
    className={cn("relative", className)}
    {...props}
  />
);

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger transition-ring focus-visible:ring-ring/50 relative inline-flex h-9 w-max items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:outline-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-popup-open:after:absolute data-popup-open:after:-inset-x-(--navigation-menu-gap) data-popup-open:after:inset-y-0 data-popup-open:after:content-['']"
);

const NavigationMenuTrigger = ({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) => (
  <NavigationMenuPrimitive.Trigger
    data-slot="navigation-menu-trigger"
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-px ms-1 size-3 shrink-0"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
);

const NavigationMenuContent = ({
  className,
  keepMounted = true,
  ...props
}: NavigationMenuPrimitive.Content.Props) => (
  <NavigationMenuPrimitive.Content
    data-slot="navigation-menu-content"
    keepMounted={keepMounted}
    className={cn(
      "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 w-auto p-1 transition-[opacity,translate] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:data-[activation-direction=left]:translate-x-4 data-starting-style:data-[activation-direction=left]:-translate-x-4 data-ending-style:data-[activation-direction=right]:-translate-x-4 data-starting-style:data-[activation-direction=right]:translate-x-4 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
      className
    )}
    {...props}
  />
);

const NavigationMenuPositioner = ({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,

  collisionPadding = 16,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) => (
  <NavigationMenuPrimitive.Portal>
    <NavigationMenuPrimitive.Positioner
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      className={cn(
        "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-200 ease-(--ease-out) data-instant:transition-none data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:top-[-10px]",
        className
      )}
      {...props}
    >
      <NavigationMenuPrimitive.Popup className="popover-panel bg-popover text-popover-foreground ring-foreground/10 relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-xl shadow ring-1 transition-[width,height] duration-200 ease-(--ease-out) outline-none">
        <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
      </NavigationMenuPrimitive.Popup>
    </NavigationMenuPrimitive.Positioner>
  </NavigationMenuPrimitive.Portal>
);

const NavigationMenuLink = ({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) => (
  <NavigationMenuPrimitive.Link
    data-slot="navigation-menu-link"
    className={cn(
      "focus-visible:ring-ring/50 in-data-[slot=navigation-menu-content]:hover:bg-nav-hover in-data-[slot=navigation-menu-content]:focus:bg-nav-hover data-active:bg-muted/50 relative flex items-center gap-2 rounded-full p-2 text-sm transition-[box-shadow,outline-color,outline-offset] duration-(--ring-duration) ease-(--ease-out) outline-none focus-visible:ring-3 focus-visible:outline-1 motion-reduce:transition-none [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  />
);

const NavigationMenuIndicator = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) => (
  <NavigationMenuPrimitive.Icon
    data-slot="navigation-menu-indicator"
    className={cn(
      "data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
      className
    )}
    {...props}
  >
    <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
  </NavigationMenuPrimitive.Icon>
);

const NavigationMenu = ({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align">) => (
  <NavigationMenuPrimitive.Root
    data-slot="navigation-menu"
    className={cn(
      "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuPositioner align={align} />
  </NavigationMenuPrimitive.Root>
);

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
};
