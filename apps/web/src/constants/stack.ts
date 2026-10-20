export interface Logo {
  name: string;
  src: string;
  /** Single-color black mark; inverted to white in dark mode. */
  mono?: boolean;
  /** Dropped on small screens so the row fits on one line. */
  mobileHidden?: boolean;
}

// Shown as avatar groups in the hero. Logos live in public/logos.
export const AGENTS: readonly Logo[] = [
  { name: "Claude Code", src: "/logos/claude-code.svg" },
  { name: "Codex", src: "/logos/codex.svg" },
  { mono: true, name: "Cursor", src: "/logos/cursor.svg" },
  { mobileHidden: true, name: "Antigravity", src: "/logos/antigravity.svg" },
  {
    mobileHidden: true,
    mono: true,
    name: "GitHub Copilot",
    src: "/logos/github-copilot.svg",
  },
  { mono: true, name: "opencode", src: "/logos/opencode.svg" },
  { name: "Amp", src: "/logos/amp.svg", mobileHidden: true },
  { mono: true, name: "Pi", src: "/logos/pi.svg" },
  {
    mono: true,
    name: "Hermes Agent",
    src: "/logos/hermes-agent.svg",
  },
  { name: "OpenClaw", src: "/logos/openclaw.svg", mobileHidden: true },
];

export const RENDERERS: readonly Logo[] = [
  { name: "Remotion", src: "/logos/remotion.png" },
  { name: "HyperFrames", src: "/logos/hyperframes.png" },
  { mono: true, name: "Editframe", src: "/logos/editframe.png" },
  { name: "fframes", src: "/logos/fframes.svg" },
];
