// Colour math shared by the gallery's colour filter and the catalog scripts
// (which import this file directly, so it must not use `@/` aliases).

export type Rgb = readonly [r: number, g: number, b: number];
export type Oklab = readonly [l: number, a: number, b: number];
export interface Hsv {
  /** 0–360. */
  h: number;
  /** 0–1. */
  s: number;
  /** 0–1. */
  v: number;
}

/** `#c0737f`, `c0737f` or `#C07` → `c0737f`; anything else → undefined. */
export const normalizeHex = (value: string): string | undefined => {
  const hex = value.trim().replace(/^#/u, "").toLowerCase();
  if (/^[\da-f]{6}$/u.test(hex)) {
    return hex;
  }
  if (/^[\da-f]{3}$/u.test(hex)) {
    return [...hex].map((digit) => digit + digit).join("");
  }
  return undefined;
};

/** A normalized hex (`c0737f`) as 0–255 channels. */
export const hexToRgb = (hex: string): Rgb => [
  Number.parseInt(hex.slice(0, 2), 16),
  Number.parseInt(hex.slice(2, 4), 16),
  Number.parseInt(hex.slice(4, 6), 16),
];

export const rgbToHex = ([r, g, b]: Rgb): string =>
  [r, g, b]
    .map((channel) =>
      Math.round(Math.min(255, Math.max(0, channel)))
        .toString(16)
        .padStart(2, "0")
    )
    .join("");

export const hsvToRgb = ({ h, s, v }: Hsv): Rgb => {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return 255 * (v - v * s * Math.max(0, Math.min(k, 4 - k, 1)));
  };
  return [f(5), f(3), f(1)];
};

export const rgbToHsv = ([r, g, b]: Rgb): Hsv => {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const delta = max - Math.min(rn, gn, bn);
  let h = 0;
  if (delta > 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
  }
  return { h: (h * 60 + 360) % 360, s: max === 0 ? 0 : delta / max, v: max };
};

const toLinear = (channel: number) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (c: number) =>
  255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

// Björn Ottosson's OKLab: perceptually even, so plain distances compare
// colours the way people see them.
export const rgbToOklab = ([r, g, b]: Rgb): Oklab => {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)];
  const l = Math.cbrt(0.41222147 * lr + 0.53633254 * lg + 0.05144599 * lb);
  const m = Math.cbrt(0.2119035 * lr + 0.68069955 * lg + 0.10739696 * lb);
  const s = Math.cbrt(0.08830246 * lr + 0.28171884 * lg + 0.6299787 * lb);
  return [
    0.21045426 * l + 0.7936178 * m - 0.00407205 * s,
    1.9779985 * l - 2.4285922 * m + 0.4505937 * s,
    0.02590404 * l + 0.78277177 * m - 0.80867577 * s,
  ];
};

export const oklabToRgb = ([L, A, B]: Oklab): Rgb => {
  const l = (L + 0.39633778 * A + 0.21580376 * B) ** 3;
  const m = (L - 0.10556135 * A - 0.06385417 * B) ** 3;
  const s = (L - 0.08948418 * A - 1.2914855 * B) ** 3;
  return [
    fromLinear(4.07674166 * l - 3.30771159 * m + 0.23096993 * s),
    fromLinear(-1.268438 * l + 2.6097574 * m - 0.3413194 * s),
    fromLinear(-0.00419609 * l - 0.7034186 * m + 1.7076147 * s),
  ];
};

export const oklabDistance = (x: Oklab, y: Oklab) =>
  Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);

/** OKLab distance between two normalized hexes. */
export const hexDistance = (x: string, y: string) =>
  oklabDistance(rgbToOklab(hexToRgb(x)), rgbToOklab(hexToRgb(y)));
