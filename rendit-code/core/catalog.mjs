// Каталог классов для подсказок в редакторе (расширение VS Code, rendit-code/vscode).
//
// Движок генерирует классы по требованию, поэтому готового списка у него нет. Каталог строится
// перебором: для каждого корня утилиты пробуем типичные значения (числа, слова, токены цветов,
// теней, скруглений) и оставляем только то, что движок действительно компилирует.
// Так подсказки никогда не расходятся с движком: что подсказано — то и сработает.

import { variantNames } from "./variants.mjs";

const NUMBERS = [
  0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 15, 16, 18, 20, 22, 24, 28, 30, 32, 36,
  40, 44, 48, 50, 56, 60, 64, 72, 75, 80, 90, 92, 95, 96, 100, 105, 110, 120,
  125, 150, 160, 180, 200, 240, 300, 320, 400, 500, 600, 700, 800, 900,
];
const WORDS = [
  "auto",
  "full",
  "screen",
  "dvh",
  "svh",
  "dvw",
  "fit",
  "min",
  "max",
  "none",
  "px",
  "first",
  "last",
  "square",
  "video",
  "round",
  "tight",
  "normal",
  "loose",
  "subgrid",
];
const FRACTIONS = ["1/2", "1/3", "2/3", "1/4", "3/4", "1/5", "16/9", "4/3"];

export function buildCatalog(config, generator) {
  const { statics, functional } = generator.utilities;
  const theme = config.theme;
  const tokenValues = [
    ...theme.colors.keys(),
    ...theme.shadows.keys(),
    ...theme.radius.keys(),
    ...theme.gradients.keys(),
    ...theme.eases.keys(),
    ...theme.fonts.keys(),
  ];
  const values = [
    ...new Set([
      ...NUMBERS.map(String),
      ...WORDS,
      ...FRACTIONS,
      ...tokenValues,
    ]),
  ];

  const utilities = new Set(statics.keys());
  for (const root of functional.keys()) {
    for (const v of values) {
      const cls = `${root}-${v}`;
      if (generator.isValid(cls)) utilities.add(cls);
    }
  }

  return {
    utilities: [...utilities].sort(naturalSort),
    variants: variantNames(config).filter((v) =>
      generator.isValid(`${v}:block`),
    ),
  };
}

const collator = new Intl.Collator("en", { numeric: true });
const naturalSort = (a, b) => collator.compare(a, b);

// ── Цвет класса для образца в редакторе ─────────────────────────────────────
// bg-blue-500/40 → { hex: "#3b82f6", alpha: 0.4 }. Значения токенов берутся из светлой темы.
export function classColor(cls, config, generator) {
  const item = generator.compile(cls);
  if (!item) return null;
  const decl = item.rules[0].decls.find(([p]) =>
    /color$|^fill$|^stroke$/.test(p),
  );
  if (!decl) return null;

  let value = decl[1].replace(/\s*!important$/, "");
  let alpha = 1;
  const mix =
    /^color-mix\(in oklab, (.+) (\d+(?:\.\d+)?)%, transparent\)$/.exec(value);
  if (mix) {
    value = mix[1];
    alpha = Number(mix[2]) / 100;
  }
  const rgb = resolveColor(value, config.tokenInfo.values);
  return rgb ? { ...rgb, a: rgb.a * alpha } : null;
}

function resolveColor(value, tokens, depth = 0) {
  if (depth > 10) return null;
  const v = value.trim();
  const ref = /^var\(--([\w-]+)\)$/.exec(v);
  if (ref)
    return tokens[ref[1]]
      ? resolveColor(tokens[ref[1]], tokens, depth + 1)
      : null;
  return parseColor(v);
}

// #rgb, #rrggbb(aa), rgb(), oklch() → { r, g, b, a } в долях 0…1
export function parseColor(input) {
  const v = input.trim().toLowerCase();
  if (v === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  if (v === "white") return { r: 1, g: 1, b: 1, a: 1 };
  if (v === "black") return { r: 0, g: 0, b: 0, a: 1 };

  let m = /^#([\da-f]{3,8})$/.exec(v);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join("");
    const n = (i) => Number.parseInt(h.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
  }

  m =
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/.exec(
      v,
    );
  if (m)
    return { r: m[1] / 255, g: m[2] / 255, b: m[3] / 255, a: alphaOf(m[4]) };

  m =
    /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?(?:\s*\/\s*([\d.]+%?))?\s*\)$/.exec(
      v,
    );
  if (m) {
    const L = m[2] ? Number(m[1]) / 100 : Number(m[1]);
    return { ...oklchToSrgb(L, Number(m[3]), Number(m[4])), a: alphaOf(m[5]) };
  }
  return null;
}

function alphaOf(raw) {
  if (raw === undefined) return 1;
  return raw.endsWith("%") ? Number.parseFloat(raw) / 100 : Number(raw);
}

// OKLCH → sRGB (формулы Björn Ottosson), с обрезкой по гамуту
function oklchToSrgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
  ];
  const gamma = (x) => {
    const c = Math.min(1, Math.max(0, x));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  };
  return { r: gamma(lin[0]), g: gamma(lin[1]), b: gamma(lin[2]) };
}
