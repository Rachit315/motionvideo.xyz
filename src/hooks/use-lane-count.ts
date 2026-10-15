import { useEffect, useState } from "react";

// Lane breakpoints mirror `layoutMasonry`: the first row holds one tile per
// lane, left to right.
export const laneCount = (width: number) =>
  1 + [560, 900, 1200, 1600].filter((point) => width >= point).length;

// Grid width read off the masonry itself, so the lane math always agrees with
// `layoutMasonry` (viewport approximations drift at breakpoint edges once
// scrollbars and padding are accounted for).
export const useLaneCount = () => {
  const [width, setWidth] = useState(1280);
  useEffect(() => {
    const update = () => {
      const grid = document.querySelector("#main-content > div")?.clientWidth;
      setWidth(grid && grid > 0 ? grid : window.innerWidth - 48);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return laneCount(width);
};
