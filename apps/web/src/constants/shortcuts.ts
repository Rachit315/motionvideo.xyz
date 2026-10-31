// Single-key shortcuts, registered once by `KeyboardShortcuts` and shown as
// hints in footer tooltips and the shortcuts dialog (opened with ?).
export const SHORTCUT_KEYS = {
  discover: "1",
  tools: "2",
  creatives: "3",
  skills: "4",
  extras: "5",
  jobs: "j",
  featured: "e",
  feedback: "f",
  bookmarks: "b",
  sponsorships: "p",
  settings: "s",
  theme: "d",
  sounds: "m",
  liveCursors: "l",
  shortcuts: "?",
} as const;

/** How a key is printed in a `<Kbd>`. */
export const keyLabel = (key: string) => key.toUpperCase();
