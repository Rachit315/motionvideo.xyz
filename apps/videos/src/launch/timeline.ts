/**
 * The cut, in frames, and every sound cue derived from it. Pure data (no React,
 * no Remotion) so `audio/write-cues.ts` can run it under plain Node to write
 * audio/cues.json, and the picture and the soundtrack can never disagree.
 */
export const FPS = 30;
/** Every slide between scenes; the problem → logo join is a hard cut. */
export const SLIDE = 14;

/**
 * The music (audio/sounddesign.json): Mixkit "What About Action?", 120.993 BPM.
 * Its drop downbeat (src 63.455 s, measured on the transient) lands on the logo
 * mark, two bars after the film's first frame.
 */
export const MUSIC = { bpm: 120.993, srcDrop: 63.455 } as const;
export const BAR = (4 * 60 * FPS) / MUSIC.bpm;

export const PROBLEM = 97;
/** logo-collapse: the stack runs out at 22, the word lands at 30; 80 holds the lockup ~1.2 s. */
export const LOGO = 80;
export const STACK_END = 22;
export const POSITIONING = 118;
export const GALLERY = 76;
export const PROMPT = 175;
export const SEARCH = 115;
export const LOCKUP = 150;
/** lockup-reveal cuts from the dark card to the yellow field on its own frame 99. */
export const LOCKUP_CUT = 99;

export const DROP = PROBLEM + STACK_END;

const DIRECTORY_START =
  PROBLEM + LOGO + POSITIONING + GALLERY + PROMPT + SEARCH - 5 * SLIDE;
const cutAt = (directory: number) => DIRECTORY_START + directory - SLIDE + LOCKUP_CUT;
/** Sized so the lockup's cut to yellow lands on the first bar line after a 100-frame rail. */
export const DIRECTORY = Math.round(
  DROP + Math.ceil((cutAt(100) - DROP) / BAR) * BAR - cutAt(0),
);

export const START = {
  problem: 0,
  logo: PROBLEM,
  positioning: PROBLEM + LOGO - SLIDE,
  gallery: PROBLEM + LOGO + POSITIONING - 2 * SLIDE,
  prompt: PROBLEM + LOGO + POSITIONING + GALLERY - 3 * SLIDE,
  search: PROBLEM + LOGO + POSITIONING + GALLERY + PROMPT - 4 * SLIDE,
  directory: DIRECTORY_START,
  lockup: DIRECTORY_START + DIRECTORY - SLIDE,
} as const;

export const DURATION = START.lockup + LOCKUP;

/** Source seconds the screen recordings start at (ScreenRecording `trimBefore` is frames). */
export const TRIM = { gallery: 70 / FPS, prompt: 105 / FPS, search: 1.3 } as const;

/**
 * Moments measured on the captures (public/rec), in source seconds: the press
 * that opens a video, the press on "Copy prompt", and the frame each typed
 * character of "launch film" appears (the capture runs at 15 fps).
 */
const CAPTURE = {
  openVideo: 4.0,
  copyPrompt: 7.78,
  keys: [2.4, 2.533, 2.766, 2.866, 3.0, 3.2, 3.4, 3.566, 3.766, 3.933, 4.133],
  spaceIndex: 6,
} as const;

const at = (start: number, trim: number, src: number) => start + (src - trim) * FPS;

export type Cue = {
  f: number;
  kind: string;
  id: string;
  weight?: number;
  pan?: number;
  variant?: string;
  dur?: number;
  apexFrac?: number;
};

export const CUES: Cue[] = [
  { f: DROP, kind: "drop", weight: 1.5, id: "reveal:logo:drop" },
  { f: DROP, kind: "land", weight: 1, id: "reveal:logo:mark" },
  { f: at(START.prompt, TRIM.prompt, CAPTURE.openVideo), kind: "click", weight: 1, pan: 0, id: "product:prompt:open" },
  { f: at(START.prompt, TRIM.prompt, CAPTURE.copyPrompt), kind: "click", weight: 1, pan: 0, id: "product:prompt:copy" },
  ...CAPTURE.keys.map(
    (t, i): Cue => ({
      // one frame early: the character is on screen by the capture frame, typed before it
      f: at(START.search, TRIM.search, t) - 1,
      kind: "key",
      weight: 0.5,
      id: i === CAPTURE.spaceIndex ? "product:search:space" : `product:search:key:${i}`,
      ...(i === CAPTURE.spaceIndex ? { variant: "space" } : {}),
    }),
  ),
  // card-rail flicks at its frames 0, 30, 60; the first one is under the slide in
  { f: START.directory + 32, kind: "whoosh", weight: 0.8, pan: -0.4, dur: 20, apexFrac: 0.1, id: "proof:rail:flick" },
  { f: START.lockup + LOCKUP_CUT, kind: "bell", weight: 0.8, id: "lockup:cut" },
];
