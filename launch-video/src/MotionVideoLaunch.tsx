import { springTiming, TransitionSeries } from "@remotion/transitions";
import { slide, type SlideDirection } from "@remotion/transitions/slide";
import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { CardRail } from "@/components/snap-cn/card-rail";
import { LockupReveal } from "@/components/snap-cn/lockup-reveal";
import { LogoCollapse } from "@/components/snap-cn/logo-collapse";
import { Manifesto } from "@/components/snap-cn/manifesto";
import { TextRewrite } from "@/components/snap-cn/text-rewrite";
import {
  FONT,
  FRAMES,
  INK,
  LIGHT_YELLOW,
  LOGOMARK_BOX,
  LOGOMARK_PATH,
  NIGHT,
  PAPER,
  pub,
  YELLOW,
} from "./brand";
import { RecordingShot, Stage } from "./scenes";
import {
  DIRECTORY as DIRECTORY_FRAMES,
  DURATION,
  FPS,
  GALLERY as GALLERY_FRAMES,
  LOCKUP as LOCKUP_FRAMES,
  LOGO as LOGO_FRAMES,
  POSITIONING as POSITIONING_FRAMES,
  PROBLEM as PROBLEM_FRAMES,
  PROMPT as PROMPT_FRAMES,
  SEARCH as SEARCH_FRAMES,
  SLIDE,
  TRIM,
} from "./timeline";

export { DURATION, FPS };

/** Every beat: its length in frames and what plays. Order is the cut. */
type Beat = { id: string; frames: number; node: ReactNode; next?: SlideDirection };

const beats: Beat[] = [
  // ── The problem ─────────────────────────────────────────────────────────
  {
    id: "problem",
    frames: PROBLEM_FRAMES,
    node: (
      <Stage>
        <Manifesto
          lineOne="Great motion drops daily."
          lineTwo="The prompt gets buried."
          lineThree="Not here."
          fontSize={74}
          payoffSize={200}
          restOffset={0}
          fontFamily={FONT}
          mode="dark"
          color="#fafafa"
          edgeColor={YELLOW}
          edgeMidColor={LIGHT_YELLOW}
        />
      </Stage>
    ),
  },
  // ── The directory ───────────────────────────────────────────────────────
  {
    id: "logo",
    frames: LOGO_FRAMES,
    next: "from-right",
    node: (
      <LogoCollapse
        images={FRAMES.slice(6, 12).map(pub).join("|")}
        mark={pub("brand/motionvideo-logomark-white.png")}
        markAspect={1200 / 568}
        lockupScale={1.7}
        wordTracking={-0.035}
        wordmark="MotionVideo"
        accent={YELLOW}
        fontFamily={FONT}
        mode="dark"
      />
    ),
  },
  {
    id: "positioning",
    frames: POSITIONING_FRAMES,
    next: "from-bottom",
    node: (
      <TextRewrite
        headline="Stop scrolling past motion"
        keep={1}
        append="worth making."
        fontSize={19}
        zoom={1.6}
        wordStagger={0.03}
        wordDuration={0.06}
        accentColor={YELLOW}
        selectionOpacity={0.4}
        markPath=""
        markSize={0}
        glow={false}
        fontFamily={FONT}
        mode="dark"
      />
    ),
  },
  {
    id: "gallery",
    frames: GALLERY_FRAMES,
    next: "from-right",
    node: (
      <RecordingShot
        src={pub("rec/gallery.mp4")}
        caption="AI-made *motion design* in one place."
        trimBefore={Math.round(TRIM.gallery * FPS)}
        camera={[{ at: 20, duration: 60, zoom: 1.12, x: 0.55, y: 0.5 }]}
      />
    ),
  },
  {
    id: "prompt",
    frames: PROMPT_FRAMES,
    next: "from-right",
    node: (
      <RecordingShot
        src={pub("rec/detail.mp4")}
        caption="Every one with the *prompt* behind it."
        trimBefore={Math.round(TRIM.prompt * FPS)}
        camera={[{ at: 58, duration: 45, zoom: 1.6, x: 0.69, y: 0.58 }]}
      />
    ),
  },
  {
    id: "search",
    frames: SEARCH_FRAMES,
    next: "from-bottom",
    node: (
      <RecordingShot
        src={pub("rec/search.mp4")}
        caption="*Search* by look, tool or creator."
        trimBefore={Math.round(TRIM.search * FPS)}
        camera={[{ at: 26, duration: 28, zoom: 1.45, x: 0.5, y: 0.45 }]}
      />
    ),
  },
  {
    id: "directory",
    /** Sized so the lockup's cut to yellow (its frame 99) lands on a bar line of the music. */
    frames: DIRECTORY_FRAMES,
    next: "from-left",
    node: (
      <Stage>
        <CardRail
          heading="Plus the tools, skills and creatives behind them."
          fontFamily={FONT}
          theme={{ background: "rgba(0,0,0,0)" }}
          mode="dark"
          cardHeight={252}
          shiftY={15}
          cards={[
            { image: pub("shots/tools.jpg"), title: "Tools", note: "Editors, AI tools and mockups", tag: "/tools" },
            { image: pub("shots/skills.jpg"), title: "Skills", note: "Open-source agent skills", tag: "/skills" },
            { image: pub("shots/creatives.jpg"), title: "Creatives", note: "Motion studios and designers", tag: "/creatives" },
            { image: pub("shots/extras.jpg"), title: "Extras", note: "Articles and guides", tag: "/extras" },
            { image: pub("shots/jobs.jpg"), title: "Jobs", note: "Roles in motion", tag: "/jobs" },
          ]}
        />
      </Stage>
    ),
  },
  // ── The ending: lockup on the construction grid, cut to the yellow field ─
  {
    id: "lockup",
    frames: LOCKUP_FRAMES,
    node: (
      <LockupReveal
        name="MotionVideo"
        mark={{ path: LOGOMARK_PATH, ...LOGOMARK_BOX }}
        fontFamily={FONT}
        ink={INK}
        paper={PAPER}
        gradient={[
          [0, PAPER],
          [0.4, LIGHT_YELLOW],
          [0.75, YELLOW],
          [1, "#f08a00"],
        ]}
      />
    ),
  },
];

/** The cut's own arithmetic must agree with timeline.ts (which audio/cues.json is written from). */
const total = beats.reduce((n, b) => n + b.frames, 0) - beats.filter((b) => b.next).length * SLIDE;
if (total !== DURATION) {
  throw new Error(`timeline.ts DURATION ${DURATION} disagrees with the beats (${total})`);
}

export function MotionVideoLaunch() {
  return (
    <AbsoluteFill style={{ background: NIGHT }}>
      <TransitionSeries>
        {beats.flatMap((b) => [
          <TransitionSeries.Sequence key={b.id} durationInFrames={b.frames} name={b.id}>
            {b.node}
          </TransitionSeries.Sequence>,
          ...(b.next
            ? [
                <TransitionSeries.Transition
                  key={`${b.id}-out`}
                  presentation={slide({ direction: b.next })}
                  timing={springTiming({ durationInFrames: SLIDE, config: { damping: 200 } })}
                />,
              ]
            : []),
        ])}
      </TransitionSeries>
    </AbsoluteFill>
  );
}
