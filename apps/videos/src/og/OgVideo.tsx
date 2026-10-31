import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

import { FONT, FRAMES, INK, LOGOMARK_BOX, LOGOMARK_PATH } from "../brand";

/**
 * The site's share video (og:video), the moving twin of public/og.jpg on
 * motionvideo.xyz: the logomark, name and tagline at the centre, with gallery
 * posters revolving around them on a tilted ring. Posters at the back of the
 * ring shrink, fade and blur (as the blurred ones in the still do), those at
 * the front come forward sharp. One full turn per loop, so it repeats
 * seamlessly.
 */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const OG_FPS = 30;
export const OG_DURATION = 12 * OG_FPS;

const POSTERS = FRAMES.filter((_, index) => index % 2 === 0).slice(0, 10);
// The ring: wide and shallow, so it reads as tilted towards the viewer and
// clears the centred text.
const RING = { x: 470, y: 230 };
const POSTER = { width: 250, height: 141 };

const TAGLINE = "Motion videos made with AI and code";

export const OgVideo = () => {
  const frame = useCurrentFrame();
  const turn = (frame / OG_DURATION) * Math.PI * 2;
  const posters = POSTERS.map((src, index) => {
    const angle = turn + (index / POSTERS.length) * Math.PI * 2;
    // Depth: 1 at the front of the ring (bottom), 0 at the back (top).
    const depth = (Math.sin(angle) + 1) / 2;
    return {
      src,
      depth,
      x: OG_WIDTH / 2 + Math.cos(angle) * RING.x,
      y: OG_HEIGHT / 2 + Math.sin(angle) * RING.y,
    };
  }).toSorted((a, b) => a.depth - b.depth);

  const markWidth = 112;
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff", fontFamily: FONT }}>
      {posters.map(({ src, depth, x, y }) => {
        const scale = 0.72 + depth * 0.38;
        return (
          <Img
            key={src}
            src={staticFile(src)}
            style={{
              position: "absolute",
              left: x - POSTER.width / 2,
              top: y - POSTER.height / 2,
              width: POSTER.width,
              height: POSTER.height,
              objectFit: "cover",
              borderRadius: 10,
              transform: `scale(${scale})`,
              filter: `blur(${(1 - depth) ** 2 * 9}px)`,
              opacity: 0.55 + depth * 0.45,
              boxShadow: `0 ${6 + depth * 18}px ${20 + depth * 30}px rgb(0 0 0 / ${0.08 + depth * 0.12})`,
            }}
          />
        );
      })}
      {/* A soft white pool keeps the name legible when a poster passes behind. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 330px 170px at 50% 52%, rgb(255 255 255 / 0.95) 45%, rgb(255 255 255 / 0) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: INK,
        }}
      >
        <svg
          viewBox={`12 12 ${LOGOMARK_BOX.width} ${LOGOMARK_BOX.height}`}
          width={markWidth}
          height={(markWidth * LOGOMARK_BOX.height) / LOGOMARK_BOX.width}
          aria-hidden="true"
        >
          <path d={LOGOMARK_PATH} fill={INK} />
        </svg>
        <div
          style={{
            marginTop: 26,
            fontSize: 76,
            fontWeight: 600,
            letterSpacing: -2.5,
            lineHeight: 1,
          }}
        >
          MotionVideo
        </div>
        <div style={{ marginTop: 30, fontSize: 24, color: "#6b6b6b" }}>
          {TAGLINE}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
