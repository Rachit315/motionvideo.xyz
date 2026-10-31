import type { ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { type CameraMove, ScreenRecording } from "@/components/snap-cn/screen-recording";
import { FONT, INK, NIGHT, YELLOW } from "@/brand";

const settle = { damping: 200, mass: 0.6 } as const;

export function Stage({ children }: { children: ReactNode }) {
  return <AbsoluteFill style={{ background: NIGHT }}>{children}</AbsoluteFill>;
}

/**
 * A caption line that lands a word at a time (4f stagger). A `*phrase*` (one or
 * more words) lands as one piece and sits on a yellow marker that wipes in
 * after it.
 */
function Caption({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text
    .split(/(\*[^*]+\*)/)
    .flatMap((part) => (part.startsWith("*") ? [part] : part.split(" ")))
    .filter(Boolean);
  return (
    <div
      style={{
        display: "flex",
        gap: "0 0.28em",
        justifyContent: "center",
        fontFamily: FONT,
        fontSize: 38,
        fontWeight: 560,
        letterSpacing: "-0.02em",
        color: "#fafafa",
      }}
    >
      {words.map((raw, i) => {
        const marked = raw.startsWith("*");
        const word = raw.replaceAll("*", "");
        const p = spring({ frame: frame - i * 4, fps, config: settle });
        const mark = spring({ frame: frame - i * 4 - 10, fps, config: settle });
        return (
          <span
            key={`${word}-${i}`}
            style={{
              position: "relative",
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * 18}px)`,
            }}
          >
            {marked ? (
              <span
                style={{
                  position: "absolute",
                  left: "-0.12em",
                  right: "-0.12em",
                  top: "0.12em",
                  bottom: "0.02em",
                  background: YELLOW,
                  borderRadius: 6,
                  transform: `scaleX(${mark})`,
                  transformOrigin: "left center",
                }}
              />
            ) : null}
            <span
              style={{
                position: "relative",
                color: marked ? markedInk(mark) : undefined,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** White ink until the marker lands under the word, then near-black on yellow. */
const markedInk = (mark: number) => (mark > 0.5 ? INK : "#fafafa");

/**
 * The site nav (logo, links, search, avatar) is the top 54px of every 720px
 * capture. ScreenRecording lays itself out as fractions of a 16:9 box, so it
 * gets an exact 16:9 box and the window clips the nav off above it — no side
 * crop, no stretch.
 */
const NAV_SHARE = 54 / 720;

/**
 * A real screen capture of motionvideo.xyz under a caption: the shot rises into
 * a rounded window and the recording's own camera points at what matters.
 */
export function RecordingShot({
  src,
  caption,
  camera,
  trimBefore = 0,
}: {
  src: string;
  caption: string;
  camera: CameraMove[];
  trimBefore?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - 4, fps, config: settle });
  const width = 1100;
  const inner = (width * 9) / 16;
  const navOffset = inner * NAV_SHARE;
  const height = inner - navOffset;
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 40 }}>
        <Caption text={caption} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: (1280 - width) / 2,
          top: 118,
          width,
          height,
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.14)",
          transform: `translateY(${(1 - rise) * 60}px) scale(${0.96 + rise * 0.04})`,
          opacity: interpolate(rise, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ position: "absolute", left: 0, top: -navOffset, width, height: inner }}>
          <ScreenRecording
            src={src}
            camera={camera}
            trimBefore={trimBefore}
            entrance="none"
            backdropColor={NIGHT}
            mode="dark"
          />
        </div>
      </div>
    </Stage>
  );
}
