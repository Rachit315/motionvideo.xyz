import { RENDERERS } from "@/constants/stack";
import { cn } from "@/lib/utils";

type Kind = "skills" | "scenes" | "motion" | "renderers";

// Small looping illustrations for the "What's included" cards. Motion is
// disabled for visitors who prefer reduced motion.
const anim = "motion-reduce:animate-none";

const Skills = () => (
  <svg viewBox="0 0 160 96" className="h-full w-auto" aria-hidden>
    <rect
      x="30"
      y="8"
      width="100"
      height="80"
      rx="10"
      className="fill-background stroke-border"
    />
    {[24, 38, 52, 66].map((y, i) => (
      <rect
        key={y}
        x="44"
        y={y}
        width={i === 3 ? 40 : 72}
        height="6"
        rx="3"
        className={cn(
          "fill-muted-foreground/40 animate-mv-type transform-box-fill origin-left",
          ["mv-delay-0", "mv-delay-300", "mv-delay-600", "mv-delay-900"][i],
          anim
        )}
      />
    ))}
  </svg>
);

// The filmstrip scrolls past the edge of the frame, so both ends fade out
// with a horizontal mask instead of cutting off mid-frame. The svg fills the
// card, which keeps the fade pinned to its left and right edges.
const stripMask = {
  maskImage:
    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
};

const Scenes = () => (
  <svg
    viewBox="0 0 256 96"
    preserveAspectRatio="xMidYMid slice"
    className="h-full w-full"
    style={stripMask}
    aria-hidden
  >
    <g className={cn("animate-mv-strip", anim)}>
      {[0, 56, 112, 168, 224, 280, 336].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y="22"
            width="48"
            height="52"
            rx="8"
            className={i % 2 ? "fill-primary/30" : "fill-muted-foreground/20"}
          />
          <rect
            x={x + 8}
            y="58"
            width="24"
            height="6"
            rx="3"
            className="fill-background"
          />
        </g>
      ))}
    </g>
  </svg>
);

const motionCurve = "M16 76 C 60 76, 70 10, 104 22 S 140 40, 144 34";

const Motion = () => (
  <svg viewBox="0 0 160 96" className="h-full w-auto" aria-hidden>
    <path
      d={motionCurve}
      className="stroke-muted-foreground/40"
      fill="none"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
    <circle
      cx="0"
      cy="0"
      r="8"
      className={cn(
        "fill-primary animate-mv-follow-path transform-box-fill",
        anim
      )}
      style={{ offsetPath: `path("${motionCurve}")`, offsetAnchor: "center" }}
    />
  </svg>
);

const Renderers = () => (
  <div className="relative size-16" aria-hidden>
    {RENDERERS.map((renderer, i) => (
      <span
        key={renderer.name}
        className={cn(
          "animate-mv-cycle bg-background absolute inset-0 flex items-center justify-center rounded-2xl opacity-0 shadow-sm",
          ["mv-delay-0", "mv-delay-1500", "mv-delay-3000", "mv-delay-4500"][i],
          "motion-reduce:animate-none motion-reduce:first:opacity-100"
        )}
      >
        <img
          src={renderer.src}
          alt=""
          width={32}
          height={32}
          className={cn("size-8", renderer.mono && "dark:invert")}
        />
      </span>
    ))}
  </div>
);

const art: Record<Kind, () => React.JSX.Element> = {
  motion: Motion,
  renderers: Renderers,
  scenes: Scenes,
  skills: Skills,
};

export const FeatureArt = ({ kind }: { kind: Kind }) => {
  const Art = art[kind];
  return (
    <div className="bg-muted/50 flex h-32 items-center justify-center overflow-hidden rounded-lg">
      <Art />
    </div>
  );
};
