import { IconMinus } from "@tabler/icons-react";
import { OTPInput, OTPInputContext } from "input-otp";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { flushSync } from "react-dom";

import { cn } from "@/lib/utils";

interface Sweep {
  id: number;
  from: number;
  to: number;
  tone: "paste" | "success";
}

interface InputOTPStatus {
  invalid: boolean;
  success: boolean;
  sweep: Sweep | null;
  landing: boolean;
}

const InputOTPStatusContext = React.createContext<InputOTPStatus>({
  invalid: false,
  landing: false,
  success: false,
  sweep: null,
});

const SWEEP_TIMING = {
  paste: { duration: 0.4, stagger: 0.045 },
  success: { duration: 0.42, stagger: 0.048 },
} as const;

const RING_TRAVEL = 0.42;

const DIGIT_SPRING = { bounce: 0.2, duration: 0.3, type: "spring" } as const;

const DIGITS = "^[0-9\\u0660-\\u0669\\u06f0-\\u06f9]+$";

interface RingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SlotLike {
  char: string | null;
  isActive: boolean;
}

const westernDigits = (text: string) =>
  text.replaceAll(/[\u0660-\u0669\u06F0-\u06F9]/gu, (digit) =>
    String((digit.codePointAt(0) ?? 0) % 16)
  );

const codeIn = (pasted: string, maxLength: number) => {
  const normalized = westernDigits(pasted.normalize("NFKC"));
  const runs = (
    normalized.match(/\d(?:[\s\u2010\u2011\u2013-]?\d)*/gu) ?? []
  ).map((run) => run.replaceAll(/\D/gu, ""));
  const exact = runs.find((run) => run.length === maxLength);
  if (exact !== undefined) {
    return exact;
  }
  return runs.join("");
};

const pasteInto = (
  value: string,
  pasted: string,
  maxLength: number,
  start: number,
  end: number
) => {
  const digits = codeIn(pasted, maxLength);
  if (!digits) {
    return null;
  }
  const whole = digits.length >= maxLength;
  const from = whole ? 0 : start;
  const next = (
    value.slice(0, from) +
    digits +
    value.slice(whole ? value.length : end)
  ).slice(0, maxLength);
  return { from, next, to: Math.min(from + digits.length, maxLength) };
};

const getActiveRange = (slots: readonly SlotLike[]) => {
  let first = -1;
  let last = -1;
  for (const [index, slot] of slots.entries()) {
    if (slot.isActive) {
      if (first === -1) {
        first = index;
      }
      last = index;
    }
  }
  return { first, last };
};

const isSlotsComplete = (slots: readonly SlotLike[]) =>
  slots.length > 0 && slots.every((slot) => Boolean(slot.char));

const isRingShown = (
  first: number,
  last: number,
  complete: boolean,
  landing: boolean
) => first !== -1 && (!complete || last > first || landing);

const getRingSpring = (
  reduceMotion: boolean,
  sweep: Sweep | null,
  jump: boolean
) => {
  if (reduceMotion || jump) {
    return { duration: 0 };
  }
  return {
    bounce: 0.18,
    duration: sweep ? RING_TRAVEL : 0.3,
    type: "spring" as const,
  };
};

const InputOTPRing = () => {
  const context = React.useContext(OTPInputContext);
  const { invalid, landing, sweep } = React.useContext(InputOTPStatusContext);
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const [box, setBox] = React.useState<RingBox | null>(null);

  const slots = context?.slots ?? [];
  const { first, last } = getActiveRange(slots);
  const complete = isSlotsComplete(slots);
  const shown = isRingShown(first, last, complete, landing);

  const measure = React.useCallback(() => {
    const container = ref.current?.closest("[data-input-otp-container]");
    const from = container?.querySelector(
      `[data-slot="input-otp-slot"][data-index="${String(first)}"]`
    );
    const to = container?.querySelector(
      `[data-slot="input-otp-slot"][data-index="${String(last)}"]`
    );
    if (!container || !from || !to) {
      return;
    }
    const row = container.getBoundingClientRect();
    const head = from.getBoundingClientRect();
    const tail = to.getBoundingClientRect();
    setBox({
      height: head.height,
      width: tail.right - head.left,
      x: head.left - row.left,
      y: head.top - row.top,
    });
  }, [first, last]);

  React.useLayoutEffect(() => {
    if (!shown) {
      return;
    }
    measure();
    const container = ref.current?.closest("[data-input-otp-container]");
    if (!container || typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [shown, measure]);

  const jump = box === null;
  const move = getRingSpring(reduceMotion ?? false, sweep, jump);

  return (
    <motion.span
      ref={ref}
      data-slot="input-otp-ring"
      aria-hidden
      initial={false}
      animate={{
        height: box?.height ?? 0,
        opacity: shown && box ? 1 : 0,
        width: box?.width ?? 0,
        x: box?.x ?? 0,
        y: box?.y ?? 0,
      }}
      transition={{
        height: move,
        opacity: reduceMotion
          ? { duration: 0 }
          : { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
        width: move,
        x: move,
        y: move,
      }}
      className={cn(
        "pointer-events-none absolute top-0 left-0 z-20 rounded-(--otp-radius) ring-[3px]",
        invalid ? "ring-destructive" : "ring-foreground/75"
      )}
    />
  );
};

const getSweepDelay = (
  swept: boolean,
  tone: Sweep["tone"] | undefined,
  index: number,
  from: number
) => {
  if (swept && tone === "paste") {
    return (index - from) * SWEEP_TIMING.paste.stagger;
  }
  return 0;
};

const isSlotSwept = (sweep: Sweep | null, index: number) =>
  sweep !== null && index >= sweep.from && index < sweep.to;

const InputOTP = ({
  className,
  containerClassName,
  "aria-invalid": ariaInvalid,
  value,
  defaultValue,
  onChange,
  onPaste,
  onPasteCapture,
  success = false,
  maxLength,
  children,
  ...props
}: Omit<React.ComponentProps<typeof OTPInput>, "render" | "children"> & {
  children?: React.ReactNode;
  containerClassName?: string;
  success?: boolean;
}) => {
  const invalid = ariaInvalid === true || ariaInvalid === "true";
  const reduceMotion = useReducedMotion();
  const [sweep, setSweep] = React.useState<Sweep | null>(null);
  const sweepId = React.useRef(0);
  const [written, setWritten] = React.useState(0);
  const [held, setHeld] = React.useState(String(defaultValue ?? ""));
  const current = value ?? held;

  const status = React.useMemo(
    () => ({
      invalid,
      landing: sweep?.tone === "paste" && written !== sweep.id,
      success,
      sweep,
    }),
    [invalid, success, sweep, written]
  );

  const startSweep = (from: number, to: number, tone: Sweep["tone"]) => {
    sweepId.current += 1;
    setSweep({ from, id: sweepId.current, to, tone });
  };

  const commit = (next: string) => {
    if (value === undefined) {
      setHeld(next);
    }
    onChange?.(next);
  };

  const handleChange = (typed: string) => {
    const next = westernDigits(typed);
    if (!reduceMotion && next.length - current.length > 1) {
      startSweep(current.length, next.length, "paste");
    }
    commit(next);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    onPasteCapture?.(event);
    onPaste?.(event);
    event.stopPropagation();
    if (event.defaultPrevented) {
      return;
    }
    event.preventDefault();

    const input = event.currentTarget;
    if (input.readOnly) {
      return;
    }
    const pasted = pasteInto(
      current,
      event.clipboardData.getData("text/plain"),
      maxLength,
      input.selectionStart ?? current.length,
      input.selectionEnd ?? current.length
    );
    if (!pasted || pasted.next === current) {
      return;
    }

    flushSync(() => {
      if (!reduceMotion) {
        startSweep(pasted.from, pasted.to, "paste");
      }
      commit(pasted.next);
    });
    const { length } = input.value;
    input.setSelectionRange(Math.min(length, maxLength - 1), length);
  };

  React.useEffect(() => {
    if (!success || reduceMotion) {
      return;
    }

    sweepId.current += 1;
    setSweep({ from: 0, id: sweepId.current, to: maxLength, tone: "success" });
  }, [success, maxLength, reduceMotion]);

  React.useEffect(() => {
    if (!sweep) {
      return;
    }

    const { duration, stagger } = SWEEP_TIMING[sweep.tone];
    const span = duration + stagger * (sweep.to - sweep.from);
    const timers = [
      window.setTimeout(() => setSweep(null), span * 1000),
      window.setTimeout(
        () => setWritten(sweep.id),
        stagger * (sweep.to - sweep.from - 1) * 1000
      ),
    ];

    return () => {
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [sweep]);

  return (
    <InputOTPStatusContext.Provider value={status}>
      <OTPInput
        data-slot="input-otp"
        data-success={success || undefined}
        aria-invalid={ariaInvalid}
        value={current}
        onChange={handleChange}
        onPasteCapture={handlePaste}
        maxLength={maxLength}
        containerClassName={cn(
          "flex max-w-full items-center gap-3 [--otp-radius:var(--radius-xl)] has-disabled:opacity-50 max-sm:[--otp-radius:var(--radius-lg)]",
          "[direction:ltr]",
          containerClassName
        )}
        spellCheck={false}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
        dir="ltr"
        inputMode="numeric"
        pattern={DIGITS}
      >
        {children}

        <InputOTPRing />
      </OTPInput>
    </InputOTPStatusContext.Provider>
  );
};

const InputOTPGroup = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-slot="input-otp-group"
    className={cn("flex min-w-0 items-center gap-3", className)}
    {...props}
  />
);

const getSlotTrailClass = (tone: Sweep["tone"]) =>
  tone === "success" ? "otp-trail-success" : "otp-trail";

const getSlotBounceClass = (swept: boolean, tone: Sweep["tone"] | undefined) =>
  swept && tone === "success" ? "otp-bounce" : undefined;

const getSlotProcessingClass = (
  isComplete: boolean,
  success: boolean,
  landing: boolean
) => (isComplete && !success && !landing ? "otp-processing" : undefined);

const getSlotPlaceholderOpacity = (char: string | null | undefined) =>
  char ? "opacity-0" : "opacity-100";

const getSlotTrailIndex = (sweep: Sweep | null, index: number) =>
  sweep ? index - sweep.from : 0;

const SlotDigit = ({
  char,
  delay,
  index,
  reduceMotion,
}: {
  char: string | null | undefined;
  delay: number;
  index: number;
  reduceMotion: boolean;
}) => (
  <AnimatePresence initial={false} custom={delay}>
    {char ? (
      <motion.span
        key={`${index}-${char}`}
        custom={delay}
        initial={
          reduceMotion
            ? false
            : {
                filter: "blur(2px)",
                opacity: 0,
                transform: "translateY(6px) rotateX(-35deg)",
              }
        }
        animate={{
          filter: "blur(0px)",
          opacity: 1,
          transform: "translateY(0px) rotateX(0deg)",
        }}
        exit="leave"
        variants={{
          leave: (after: number) =>
            reduceMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : {
                  filter: "blur(2px)",
                  opacity: 0,
                  transform: "translateY(-2px) rotateX(15deg)",
                  transition: { ...DIGIT_SPRING, delay: after },
                },
        }}
        transition={reduceMotion ? { duration: 0 } : { ...DIGIT_SPRING, delay }}
        style={{
          transformOrigin: "center bottom",
          transformStyle: "preserve-3d",
        }}
        className="text-foreground col-start-1 row-start-1"
      >
        {char}
      </motion.span>
    ) : null}
  </AnimatePresence>
);

const InputOTPSlot = ({
  index,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { landing, success, sweep } = React.useContext(InputOTPStatusContext);
  const { char, isActive } = inputOTPContext?.slots[index] ?? {};
  const swept = isSlotSwept(sweep, index);
  const isComplete = isSlotsComplete(inputOTPContext?.slots ?? []);
  const reduceMotion = useReducedMotion();
  const delay = getSweepDelay(swept, sweep?.tone, index, sweep?.from ?? 0);

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-index={index}
      className={cn(
        "bg-foreground/[0.06] ring-foreground/8 data-[active=true]:bg-foreground/10 [container-type:inline-size] relative flex aspect-square min-h-12 w-14 min-w-0 items-center justify-center rounded-(--otp-radius) text-2xl font-semibold tabular-nums ring-1 transition-[background-color,color] duration-150 ease-out outline-none *:text-[min(1.5rem,43cqi)] data-[active=true]:z-10 motion-reduce:transition-none",
        getSlotBounceClass(swept, sweep?.tone),
        className
      )}
      // SAFETY: CSS custom properties are valid React style extensions for OTP animation indexes.
      style={
        {
          ...style,
          "--otp-land": `${String(delay)}s`,
          "--otp-trail-index": getSlotTrailIndex(sweep, index),
        } as React.CSSProperties
      }
      {...props}
    >
      {swept && sweep ? (
        <span
          key={`${sweep.id}-${index}`}
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-(--otp-radius)",
            getSlotTrailClass(sweep.tone)
          )}
        />
      ) : null}
      <span
        className={cn(
          "relative grid place-items-center [perspective:240px]",
          getSlotProcessingClass(isComplete, success, landing)
        )}
        // SAFETY: CSS custom property for wave stagger index is consumed by OTP styles.
        style={{ "--otp-wave-index": index } as React.CSSProperties}
      >
        <span
          aria-hidden
          className={cn(
            "text-foreground/20 col-start-1 row-start-1 transition-opacity delay-(--otp-land) duration-150 ease-out motion-reduce:transition-none",
            getSlotPlaceholderOpacity(char)
          )}
        >
          0
        </span>
        <SlotDigit
          char={char}
          delay={delay}
          index={index}
          reduceMotion={reduceMotion ?? false}
        />
      </span>
    </div>
  );
};

const InputOTPSeparator = ({ ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="input-otp-separator"
    aria-hidden
    className="text-muted-foreground flex shrink-0 items-center [&_svg:not([class*='size-'])]:size-5"
    {...props}
  >
    <IconMinus />
  </div>
);

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
