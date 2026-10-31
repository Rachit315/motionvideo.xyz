import confetti from "canvas-confetti";
import { useEffect } from "react";

const COLORS = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
const DURATION_MS = 3 * 1000;

export const ConfettiSideCannons = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const end = Date.now() + DURATION_MS;
    let frameId = 0;

    const frame = () => {
      if (Date.now() > end) {
        return;
      }

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 1 },
        colors: COLORS,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 1 },
        colors: COLORS,
      });

      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return null;
};
