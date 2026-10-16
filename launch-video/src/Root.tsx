import "./index.css";
import { Composition } from "remotion";
import { DURATION, FPS, MotionVideoLaunch } from "./MotionVideoLaunch";

export const RemotionRoot = () => (
  <Composition
    id="MotionVideoLaunch"
    component={MotionVideoLaunch}
    durationInFrames={DURATION}
    fps={FPS}
    width={1280}
    height={720}
  />
);
