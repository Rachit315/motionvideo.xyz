import "./index.css";
import { Composition, Folder } from "remotion";
import { DURATION, FPS, MotionVideoLaunch } from "./launch/MotionVideoLaunch";

/**
 * Every MotionVideo film, one folder per video in Studio. A new video (a
 * product update, a feature film) lives in its own `src/<video>/` directory
 * and registers its composition here.
 */
export const RemotionRoot = () => (
  <Folder name="launch">
    <Composition
      id="MotionVideoLaunch"
      component={MotionVideoLaunch}
      durationInFrames={DURATION}
      fps={FPS}
      width={1280}
      height={720}
    />
  </Folder>
);
