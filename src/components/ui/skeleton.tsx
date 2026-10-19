import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Surface = "background" | "shell";

const Skeleton = ({
  className,
  on = "background",
  ...props
}: ComponentProps<"div"> & { on?: Surface }) => (
  <div
    data-slot="skeleton"
    className={cn(
      "skeleton-shimmer rounded-md",
      on === "shell" ? "bg-shell-line-strong" : "bg-muted",
      className
    )}
    {...props}
  />
);

export { Skeleton };
