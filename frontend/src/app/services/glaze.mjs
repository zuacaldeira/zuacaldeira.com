// The living glaze's engine (docs/examples/theme.md). No imports: the table is passed in.
// The colour maths is the Living Glaze study's, as copied in the mock-ups' "glaze engine".

const toLin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const clamp = (v) => Math.min(1, Math.max(0, v));
const rgbToHex = (rgb) =>
  '#' + rgb.map((v) => Math.round(clamp(v) * 255).toString(16).padStart(2, '0')).join('');

function rgbToLab([r, g, b]) {
  [r, g, b] = [r, g, b].map(toLin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function labToRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => toGam(clamp(v)));
}

const mixLab = (p, q, t) => p.map((v, i) => v + (q[i] - v) * t);
const smooth = (t) => t * t * (3 - 2 * t);
const labOf = (hex) => rgbToLab(hexToRgb(hex));
const lum = (rgb) => {
  const [r, g, b] = rgb.map(toLin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (p, q) => {
  const [x, y] = [lum(p), lum(q)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
/** Dark when white reads better on it than black: the study's test, on the unrounded ground (THEME-12). */
const isDark = (rgb) => contrast([1, 1, 1], rgb) > contrast([0, 0, 0], rgb);

const SURFACES = ['bg', 'surface', 'raised', 'wash', 'border'];
const BLACK = [0, 0, 0];
const WHITE = [1, 0, 0];

/**
 * The study's guard: a colour below its minimum against any of its grounds moves toward black or
 * white, by bisection, only as far as it must. Judged on the rounded hex the page gets (D2), so the
 * colour it returns passes once rounded. Returns null when the colour already passes.
 */
function guard(lab, against, target) {
  const grounds = against.map(hexToRgb);
  const worst = (l) => Math.min(...grounds.map((g) => contrast(hexToRgb(rgbToHex(labToRgb(l))), g)));
  if (worst(lab) >= target) return null;
  const toward = worst(BLACK) > worst(WHITE) ? BLACK : WHITE;
  let [lo, hi] = [0, 1];
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (worst(mixLab(lab, toward, mid)) >= target) hi = mid;
    else lo = mid;
  }
  return mixLab(lab, toward, hi);
}

/** Refuses a table whose glazes do not hold exactly the map's tokens (THEME-P-07). */
export function checkTable(table) {
  const tokens = Object.keys(table.map);
  for (const [name, glaze] of Object.entries(table.glazes)) {
    for (const t of tokens) if (!(t in glaze.c)) throw new Error(`The glaze ${name} has no ${t}`);
    for (const t of Object.keys(glaze.c))
      if (!tokens.includes(t)) throw new Error(`The glaze ${name} has ${t}, which the map does not name`);
  }
}

/** The glaze at a minute of the visitor's day: the minute is passed in, never read from a clock. */
export function themeAt(table, minute) {
  const h = (((minute / 60) % 24) + 24) % 24;
  const keys = table.keys;
  let i = 0;
  while (i < keys.length - 2 && h >= keys[i + 1][0]) i++;
  const [[h0, k0], [h1, k1]] = [keys[i], keys[i + 1]];
  const a = table.glazes[k0];
  const b = table.glazes[k1];
  const t = h1 > h0 ? smooth((h - h0) / (h1 - h0)) : 0;
  const blendRgb = (k) => labToRgb(mixLab(labOf(a.c[k]), labOf(b.c[k]), t));
  const blend = (k) => rgbToHex(blendRgb(k));
  const hex = {};
  for (const k of SURFACES) hex[k] = blend(k);
  const dark = isDark(blendRgb('bg'));
  // A crossing (the two keyframes differ in mode): the inks snap to the side the ground is on.
  const side = a.mode === b.mode ? null : (a.mode === 'dark') === dark ? a : b;
  const lab = {};
  for (const k of Object.keys(table.map).filter((k) => !SURFACES.includes(k))) {
    lab[k] = side ? labOf(side.c[k]) : mixLab(labOf(a.c[k]), labOf(b.c[k]), t);
    hex[k] = rgbToHex(labToRgb(lab[k]));
  }
  const moved = [];
  const hold = (k, against, target) => {
    const held = guard(lab[k], against, target);
    if (!held) return;
    hex[k] = rgbToHex(labToRgb(held));
    moved.push(k);
  };
  for (const [k, target] of table.guards) hold(k, [hex.bg, hex.surface], target);
  hold('onAccent', [hex.accent], 4.5);

  // The footer and the band, by mode as the mock-ups' paint(); their inks guarded too (D5).
  const derive = (k, value) => {
    hex[k] = value;
    lab[k] = labOf(value);
  };
  derive('footBg', dark ? hex.raised : hex.heading);
  derive('footFg', dark ? hex.heading : hex.bg);
  derive('footGold', table.fixed.footGold);
  derive('footOnGold', table.fixed.footOnGold);
  derive('bandBg', dark ? hex.raised : hex.accent);
  derive('bandFg', dark ? hex.heading : hex.onAccent);
  hold('footFg', [hex.footBg], 4.5);
  hold('footGold', [hex.footBg], 4.5);
  hold('footOnGold', [hex.footGold], 4.5);
  hold('bandFg', [hex.bandBg], 4.5);
  return { hex, mode: dark ? 'dark' : 'light', moved };
}
