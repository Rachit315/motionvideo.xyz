import type { SoundPatch } from "@web-kits/audio";
import { SoundProvider, usePatch } from "@web-kits/audio/react";
import { useEffect, useId, useRef, useSyncExternalStore } from "react";

import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kobra-sound-muted";
const VOLUME_KEY = "kobra-sound-volume";
const DEFAULT_VOLUME = 0.5;

const PATCH = {
  name: "kobra-ui",
  sounds: {
    tap: {
      source: { type: "sine", frequency: 1300, fm: { ratio: 0.5, depth: 100 } },
      envelope: { attack: 0, decay: 0.015, sustain: 0, release: 0.005 },
      gain: 0.2,
    },
    select: {
      source: { type: "triangle", frequency: { start: 900, end: 780 } },
      envelope: { attack: 0.001, decay: 0.055 },
      gain: 0.26,
    },
    toggleOn: {
      source: { type: "sine", frequency: { start: 520, end: 880 } },
      envelope: { attack: 0.002, decay: 0.085 },
      gain: 0.3,
    },
    toggleOff: {
      source: { type: "sine", frequency: { start: 780, end: 420 } },
      envelope: { attack: 0.002, decay: 0.085 },
      gain: 0.28,
    },

    open: {
      source: { type: "triangle", frequency: { start: 320, end: 620 } },
      filter: { type: "lowpass", frequency: 2600 },
      envelope: { attack: 0.006, decay: 0.13 },
      gain: 0.24,
    },
    close: {
      source: { type: "triangle", frequency: { start: 560, end: 300 } },
      filter: { type: "lowpass", frequency: 2200 },
      envelope: { attack: 0.004, decay: 0.11 },
      gain: 0.22,
    },
    tick: {
      source: { type: "square", frequency: 1400 },
      filter: { type: "lowpass", frequency: 3000 },
      envelope: { decay: 0.014 },
      gain: 0.1,
    },

    sliderTick: {
      layers: [
        {
          source: { type: "noise", color: "white" },
          filter: { type: "bandpass", frequency: 3000, resonance: 4 },
          envelope: { attack: 0, decay: 0.02, sustain: 0, release: 0.006 },
          gain: 0.19,
        },
        {
          source: { type: "sine", frequency: 700 },
          envelope: { attack: 0, decay: 0.012, sustain: 0, release: 0.004 },
          gain: 0.09,
        },
      ],
    },
    destructive: {
      layers: [
        {
          source: { type: "triangle", frequency: { start: 300, end: 170 } },
          filter: { type: "lowpass", frequency: 1400 },
          envelope: { attack: 0.002, decay: 0.12 },
          gain: 0.32,
        },
        {
          source: { type: "noise", color: "brown" },
          filter: { type: "bandpass", frequency: 700, resonance: 1.1 },
          envelope: { decay: 0.05 },
          gain: 0.06,
        },
      ],
    },
    key: {
      layers: [
        {
          source: { type: "sine", frequency: { start: 1000, end: 900 } },
          envelope: { attack: 0.001, decay: 0.028 },
          gain: 0.14,
        },
        {
          source: { type: "noise", color: "white" },
          filter: { type: "bandpass", frequency: 3200, resonance: 2 },
          envelope: { decay: 0.01 },
          gain: 0.035,
        },
      ],
    },

    success: {
      layers: [
        {
          source: { type: "triangle", frequency: 784 },
          envelope: { attack: 0.004, decay: 0.16 },
          gain: 0.22,
        },
        {
          source: { type: "triangle", frequency: 1175 },
          envelope: { attack: 0.004, decay: 0.22 },
          gain: 0.18,
          delay: 0.075,
        },
      ],
    },
    error: {
      layers: [
        {
          source: { type: "triangle", frequency: 300 },
          filter: { type: "lowpass", frequency: 1200 },
          envelope: { attack: 0.003, decay: 0.13 },
          gain: 0.26,
        },
        {
          source: { type: "triangle", frequency: 224 },
          filter: { type: "lowpass", frequency: 1000 },
          envelope: { attack: 0.003, decay: 0.2 },
          gain: 0.24,
          delay: 0.09,
        },
      ],
    },

    warning: {
      layers: [
        {
          source: { type: "triangle", frequency: 622 },
          filter: { type: "lowpass", frequency: 2800 },
          envelope: { attack: 0.003, decay: 0.14 },
          gain: 0.2,
        },
        {
          source: { type: "triangle", frequency: 622 },
          filter: { type: "lowpass", frequency: 2800 },
          envelope: { attack: 0.003, decay: 0.18 },
          gain: 0.17,
          delay: 0.085,
        },
      ],
    },

    copy: {
      layers: [
        {
          source: { type: "sine", frequency: 1200 },
          envelope: { attack: 0, decay: 0.015, sustain: 0, release: 0.006 },
          gain: 0.16,
        },
        {
          source: { type: "sine", frequency: 1400 },
          envelope: { attack: 0, decay: 0.015, sustain: 0, release: 0.006 },
          delay: 0.04,
          gain: 0.14,
        },
      ],
    },

    notification: {
      layers: [
        {
          source: { type: "triangle", frequency: 523 },
          envelope: { attack: 0.008, decay: 0.3, sustain: 0.03, release: 0.12 },
          gain: 0.14,
        },
        {
          source: { type: "triangle", frequency: 784 },
          envelope: { attack: 0.008, decay: 0.25, sustain: 0.02, release: 0.1 },
          delay: 0.12,
          gain: 0.12,
        },
      ],
    },

    swoosh: {
      source: { type: "sine", frequency: { start: 300, end: 2000 } },
      envelope: { attack: 0.008, decay: 0.12, sustain: 0, release: 0.04 },
      gain: 0.12,
    },

    chirp: {
      source: { type: "sine", frequency: { start: 1200, end: 1500 } },
      envelope: { attack: 0, decay: 0.03, sustain: 0, release: 0.01 },
      gain: 0.08,
    },

    command: {
      layers: [
        {
          source: { type: "triangle", frequency: { start: 1046, end: 784 } },
          envelope: { attack: 0.001, decay: 0.075 },
          gain: 0.2,
        },
        {
          source: { type: "sine", frequency: 1568 },
          envelope: { attack: 0.001, decay: 0.045 },
          gain: 0.06,
          delay: 0.018,
        },
      ],
    },

    blocked: {
      source: { type: "sine", frequency: 180 },
      filter: { type: "lowpass", frequency: 700 },
      envelope: { attack: 0.004, decay: 0.06 },
      gain: 0.16,
    },
  },
} as const satisfies SoundPatch;

export type SoundName = keyof (typeof PATCH)["sounds"];

interface Cue {
  sound: SoundName;
  detune?: number;
  velocity?: number;
}

const JITTER: Record<SoundName, number> = {
  tap: 26,
  select: 22,
  toggleOn: 14,
  toggleOff: 14,
  open: 10,
  close: 10,
  tick: 18,
  sliderTick: 10,
  key: 20,
  destructive: 12,
  blocked: 30,
  chirp: 24,
  command: 8,

  copy: 6,

  notification: 3,
  swoosh: 14,

  success: 5,
  error: 5,
  warning: 5,
};

const jitter = (cents: number) => (Math.random() * 2 - 1) * cents;

const play = (
  patch: {
    play: (name: string, opts?: { detune?: number; velocity?: number }) => void;
  },
  cue: Cue
) => {
  patch.play(cue.sound, {
    detune: (cue.detune ?? 0) + jitter(JITTER[cue.sound]),

    velocity: (cue.velocity ?? 1) * (0.9 + Math.random() * 0.1),
  });
};

const TOGGLE_SLOTS = new Set([
  "switch",
  "checkbox",
  "toggle",
  "toggle-group-item",
  "radio-group-item",
  "context-menu-checkbox-item",
  "context-menu-radio-item",
  "dropdown-menu-checkbox-item",
  "dropdown-menu-radio-item",
  "menubar-checkbox-item",
  "menubar-radio-item",
]);

const INTERACTIVE =
  '[data-slot], button, a[href], [role="button"], [role="option"], [role="menuitem"], input[type="checkbox"], input[type="radio"]';

const TEXT_ENTRY =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable]';

const isOn = (el: HTMLElement) => {
  if (el instanceof HTMLInputElement) {
    return el.checked;
  }
  return (
    el.getAttribute("aria-checked") === "true" ||
    el.getAttribute("aria-pressed") === "true" ||
    el.dataset.checked !== null
  );
};

const rowPitch = (el: HTMLElement) => {
  const siblings = el.parentElement?.children;
  if (!siblings) {
    return 0;
  }
  return Math.min([...siblings].indexOf(el), 7) * 55;
};

const classifyNamed = (el: HTMLElement): Cue | null => {
  const named = el.dataset.sound;
  if (named && named in PATCH.sounds) {
    // SAFETY: `named in PATCH.sounds` narrows the string to a valid key of PATCH.sounds.
    return { sound: named as SoundName };
  }
  return null;
};

const classifyToggle = (el: HTMLElement, slot: string): Cue | null => {
  if (
    TOGGLE_SLOTS.has(slot) ||
    el.matches(
      'input[type="checkbox"], input[type="radio"], [aria-pressed], [role="menuitemcheckbox"], [role="menuitemradio"]'
    )
  ) {
    return { sound: isOn(el) ? "toggleOff" : "toggleOn" };
  }
  return null;
};

const classifySlotAction = (slot: string): Cue | null => {
  if (slot.endsWith("-close")) {
    return { sound: "close" };
  }
  if (slot.endsWith("-clear") || slot.endsWith("-remove")) {
    return { sound: "chirp" };
  }
  return null;
};

const classifyDestructive = (el: HTMLElement): Cue | null => {
  if (el.dataset.variant === "destructive") {
    return { sound: "destructive" };
  }
  return null;
};

const classifyTrigger = (el: HTMLElement, slot: string): Cue | null => {
  if (!slot.endsWith("-trigger")) {
    return null;
  }
  const expanded = el.getAttribute("aria-expanded");
  if (expanded === null) {
    return { sound: "select" };
  }
  return { sound: expanded === "true" ? "close" : "open" };
};

const classifyItem = (el: HTMLElement, slot: string): Cue | null => {
  if (
    slot.endsWith("-item") ||
    slot.endsWith("-link") ||
    slot.endsWith("-option")
  ) {
    return { sound: "select", detune: rowPitch(el) };
  }
  if (slot === "slider-thumb" || slot === "slider-track") {
    return { sound: "tick" };
  }
  return null;
};

const classifyButton = (el: HTMLElement): Cue | null => {
  if (
    el.dataset.slot === "button" ||
    el.matches('button, a[href], [role="button"]')
  ) {
    const soft =
      el.dataset.variant === "ghost" || el.dataset.variant === "link";
    return { sound: "tap", velocity: soft ? 0.78 : 1 };
  }
  return null;
};

const classify = (el: HTMLElement): Cue | null => {
  const slot = el.dataset.slot ?? "";
  return (
    classifyNamed(el) ??
    classifyToggle(el, slot) ??
    classifyDestructive(el) ??
    classifySlotAction(slot) ??
    classifyTrigger(el, slot) ??
    classifyItem(el, slot) ??
    classifyButton(el)
  );
};

const soundFor = (target: Element, keyed = false): Cue | null => {
  // The cmdk palette: the row comes from aria-activedescendant (keyboard) or
  // the clicked row itself; nested levels are gone, so every row "commands".
  if (target.closest('[data-slot="command"]')) {
    const pointed = keyed ? target.getAttribute("aria-activedescendant") : null;
    const row = pointed
      ? document.querySelector(`#${pointed}`)
      : target.closest('[data-slot="command-item"]');
    if (!row) {
      return null;
    }
    return { sound: "command" };
  }

  const labeled = target.closest("label")?.control ?? target;

  if (labeled.closest(TEXT_ENTRY)) {
    return null;
  }

  let el = labeled.closest<HTMLElement>(INTERACTIVE);
  while (el) {
    if (el.matches(':disabled, [aria-disabled="true"], [data-disabled]')) {
      return { sound: "blocked" };
    }
    const cue = classify(el);
    if (cue) {
      return cue;
    }
    el = el.parentElement?.closest<HTMLElement>(INTERACTIVE) ?? null;
  }
  return null;
};

const span = (min: number, max: number, value: number) =>
  max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)));

const sliderRange = (el: HTMLElement) => {
  if (el instanceof HTMLInputElement) {
    return {
      min: Number(el.min || 0),
      max: Number(el.max || 100),
      step: Math.abs(Number(el.step)) || 1,
    };
  }
  const read = (name: string, fallback: number) => {
    const value = Number(el.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  };
  return {
    min: read("aria-valuemin", 0),
    max: read("aria-valuemax", 100),
    step: 1,
  };
};

const listeners = new Set<() => void>();

const subscribeMuted = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
};

const notify = () => {
  for (const onChange of listeners) {
    onChange();
  }
};

export const setSoundMuted = (muted: boolean) => {
  localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
  track("sounds_toggle", { muted });
  notify();
};

export const useSoundMuted = () =>
  useSyncExternalStore(
    subscribeMuted,
    () => localStorage.getItem(STORAGE_KEY) === "1",
    () => false
  );

export const setSoundVolume = (volume: number) => {
  localStorage.setItem(VOLUME_KEY, String(volume));
  notify();
};

export const useSoundVolume = () =>
  useSyncExternalStore(
    subscribeMuted,
    () => {
      const stored = Number(localStorage.getItem(VOLUME_KEY));

      return Number.isFinite(stored) && stored > 0 && stored <= 1
        ? stored
        : DEFAULT_VOLUME;
    },
    () => DEFAULT_VOLUME
  );

const SoundEffectListener = () => {
  const patch = usePatch(PATCH);
  const muted = useSoundMuted();

  const wasMuted = useRef(muted);
  useEffect(() => {
    const cameBack = wasMuted.current && !muted;
    wasMuted.current = muted;
    if (cameBack) {
      play(patch, { sound: "swoosh" });
    }
  }, [muted, patch]);

  useEffect(() => {
    if (!patch.ready) {
      return;
    }

    const TICK_GAP_MS = 28;
    const TICK_LAG_MS = 60;
    const DRAG_SLOP_PX = 3;

    let grab: { x: number; y: number; dragged: boolean } | null = null;
    let nextTickAt = 0;
    const queued = new Set<ReturnType<typeof setTimeout>>();

    const stopTicking = () => {
      for (const timer of queued) {
        clearTimeout(timer);
      }
      queued.clear();
      nextTickAt = 0;
    };

    const tick = (detune: number, now: number) => {
      if (nextTickAt - now > TICK_LAG_MS) {
        return false;
      }
      const wait = nextTickAt - now;
      nextTickAt += TICK_GAP_MS;
      const cue = { sound: "sliderTick", detune } as const;
      if (wait <= 0) {
        play(patch, cue);
        return true;
      }
      const timer = setTimeout(() => {
        queued.delete(timer);
        play(patch, cue);
      }, wait);
      queued.add(timer);
      return true;
    };

    const ratchet = (el: HTMLElement, from: number, to: number) => {
      const { min, max, step } = sliderRange(el);
      const crossed = Math.round(Math.abs(to - from) / step);
      if (!Number.isFinite(crossed) || crossed < 1) {
        return;
      }

      const now = performance.now();
      nextTickAt = Math.max(nextTickAt, now);
      const direction = Math.sign(to - from);

      for (let i = 1; i <= crossed; i += 1) {
        const value = from + direction * step * i;
        if (!tick(span(min, max, value) * 900, now)) {
          break;
        }
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !(event.target instanceof Element)) {
        return;
      }
      const cue = soundFor(event.target);
      if (!cue) {
        return;
      }
      if (cue.sound === "tick") {
        grab = { x: event.clientX, y: event.clientY, dragged: false };
      }
      play(patch, cue);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      if (event.repeat || !(event.target instanceof Element)) {
        return;
      }
      const typing = event.target.matches(TEXT_ENTRY);

      const driving =
        event.key === "Enter" && event.target.closest('[data-slot="command"]');
      if (typing && !driving) {
        return;
      }
      const cue = soundFor(event.target, true);
      if (cue) {
        play(patch, cue);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!grab || grab.dragged) {
        return;
      }
      if (
        Math.hypot(event.clientX - grab.x, event.clientY - grab.y) >
        DRAG_SLOP_PX
      ) {
        grab.dragged = true;
      }
    };

    const onPointerUp = () => {
      if (grab) {
        stopTicking();
      }
      grab = null;
    };

    const onContextMenu = () => play(patch, { sound: "open" });

    const onInput = (event: Event) => {
      if (!event.isTrusted) {
        return;
      }
      const el = event.target;
      if (
        !(el instanceof HTMLInputElement) ||
        !el.closest('[data-slot="input-otp"]')
      ) {
        return;
      }
      const deleting =
        // SAFETY: this listener is attached to trusted `input` events, which are InputEvents carrying `inputType`.
        (event as InputEvent).inputType?.startsWith("delete") ?? false;
      play(patch, {
        sound: "key",
        detune: el.value.length * 45 - (deleting ? 260 : 0),
      });
    };

    const observer = new MutationObserver((records) => {
      let slid = false;

      for (const record of records) {
        const el = record.target;
        if (!(el instanceof HTMLElement)) {
          continue;
        }
        const value = el.getAttribute(record.attributeName ?? "");

        const entered =
          value !== null && value !== "false" && value !== record.oldValue;

        switch (record.attributeName) {
          case "aria-valuenow": {
            if (slid || !el.matches('input[type="range"], [role="slider"]')) {
              break;
            }

            if (value === null || record.oldValue === null) {
              break;
            }

            if (grab && !grab.dragged) {
              break;
            }
            slid = true;
            if (grab) {
              ratchet(el, Number(record.oldValue), Number(value));
              break;
            }
            const { min, max } = sliderRange(el);
            const now = performance.now();
            nextTickAt = Math.max(nextTickAt, now);
            tick(span(min, max, Number(value)) * 900, now);
            break;
          }
          case "data-success": {
            if (entered) {
              play(patch, { sound: "success" });
            }
            break;
          }
          case "aria-invalid": {
            if (entered) {
              play(patch, { sound: "error" });
            }
            break;
          }
          default: {
            break;
          }
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["aria-valuenow", "aria-invalid", "data-success"],
    });

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointermove", onPointerMove, true);
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("pointercancel", onPointerUp, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("contextmenu", onContextMenu, true);
    document.addEventListener("input", onInput, true);
    return () => {
      observer.disconnect();
      stopTicking();
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("pointercancel", onPointerUp, true);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("contextmenu", onContextMenu, true);
      document.removeEventListener("input", onInput, true);
    };
  }, [patch]);

  return null;
};

export const SoundEffects = ({ children }: { children: React.ReactNode }) => {
  const muted = useSoundMuted();
  const volume = useSoundVolume();

  return (
    <SoundProvider enabled={!muted} volume={volume}>
      <SoundEffectListener />
      {children}
    </SoundProvider>
  );
};

const SPEAKER =
  "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z";
const WAVE_INNER = "M16 9a5 5 0 0 1 0 6";
const WAVE_OUTER = "M19.364 18.364a9 9 0 0 0 0-12.728";
const SLASH = "M2 2 22 22";

export const SoundToggle = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) => {
  const muted = useSoundMuted();
  const maskId = useId();

  return (
    <button
      type="button"
      aria-label={muted ? "Unmute interface sounds" : "Mute interface sounds"}
      aria-pressed={muted}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setSoundMuted(!muted);
        }
      }}

      data-sound="swoosh"
      {...props}
      className={cn(
        "text-shell-fg-faint hover:bg-foreground/5 hover:text-shell-fg-muted focus-visible:ring-ring flex size-7 cursor-pointer items-center justify-center rounded transition-[transform,box-shadow] duration-100 ease-out outline-none focus-visible:ring-2 active:scale-[0.96] motion-reduce:transition-none",
        className
      )}
    >
      <svg
        data-muted={muted}
        viewBox="0 0 24 24"
        width={17}
        height={17}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          <path
            className="sound-slash"
            d={SLASH}
            pathLength={1}
            stroke="black"
            strokeWidth={4}
          />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path className="sound-speaker" d={SPEAKER} />
          <path className="sound-wave sound-wave-inner" d={WAVE_INNER} />
          <path className="sound-wave sound-wave-outer" d={WAVE_OUTER} />
        </g>
        <path className="sound-slash" d={SLASH} pathLength={1} />
      </svg>
    </button>
  );
};
