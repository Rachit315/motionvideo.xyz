export default function layoutMasonry(items, width, heights, gap = 12) {
  const lanes =
    1 + [560, 900, 1200, 1600].filter((point) => width >= point).length;
  const laneWidth = (width - gap * (lanes - 1)) / lanes;
  const ends = Array.from({ length: lanes }, () => 0);
  const placements = items.map((item) => {
    // `item.lane` pins an item under a specific lane (e.g. the jobs widget
    // under the sponsored card); otherwise the shortest lane wins.
    const { lane: pinned } = item;
    let lane = 0;
    if (pinned !== undefined && pinned < lanes) {
      lane = pinned;
    } else {
      for (let candidate = 1; candidate < lanes; candidate += 1) {
        if (ends[candidate] < ends[lane]) {
          lane = candidate;
        }
      }
    }
    const height = item.aspectRatio
      ? laneWidth / item.aspectRatio
      : (heights[item.key] ?? 380);
    const placement = { item, lane, top: ends[lane], height };
    ends[lane] += height + gap;
    return placement;
  });
  return {
    placements,
    laneWidth,
    totalHeight: Math.max(0, ...ends) - (items.length > 0 ? gap : 0),
  };
}
