#!/usr/bin/env node
// Готовый CSS RenDit UI для проектов без сборки (HTML/CSS, CDN, WordPress…):
//   node rendit-code/dist.mjs   (npm run dist)
// → dist/rendit-ui.css      — всё целиком: RenDit SCSS (токены обеих тем, сброс, база, сетка .row, компоненты)
//                             и готовые классы RenDit Code — частые значения шкалы, все цвета, варианты экранов
//                             и состояний;
//   dist/rendit-ui.min.css  — то же, сжатое (для продакшена).
//
// В проектах с Node.js движок собирает только нужные классы — файл меньше и любые значения работают.
// Здесь классы — заранее выбранный набор: шкала отступов и размеров, все цвета токенов и палитры с частой
// прозрачностью, брейкпоинты для раскладки. Чего нет в наборе — пишите свой CSS на переменных (var(--primary)).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile, compileString } from "sass";
import { loadConfig } from "./core/config.mjs";
import { createGenerator } from "./core/generator.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "dist");
const SCSS = path.join(ROOT, "src/assets/scss");

const config = await loadConfig(ROOT);
const generator = createGenerator(config.theme, config);
const {
  colors: COLOR_TOKENS,
  shadows: SHADOWS,
  radius: RADII,
} = config.tokenInfo;

// ── Набор классов ───────────────────────────────────────────────────────────

const SPACE = [
  0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64,
  72, 80, 96, 120,
];
const SPACE_SM = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
const SIZE = [...SPACE, 140, 160, 200, 240, 280, 320, 360, 400, 480];
const MAX_W = [
  240, 280, 320, 360, 400, 480, 560, 640, 720, 800, 960, 1080, 1200,
];
const FONT = [
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 28, 32, 36, 40, 48, 56,
  64, 72,
];
const FONT_SM = [14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64];
const ALPHA = [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90];
const SCREENS = Object.keys(config.screens);

const each = (prefixes, values) =>
  prefixes.flatMap((p) => values.map((v) => `${p}-${v}`));

// смысловые токены (без палитры) — для прозрачности и наведения
const SEMANTIC = COLOR_TOKENS.filter((c) => !/-\d+$/.test(c));

const base = [
  // раскладка
  "block",
  "inline-block",
  "inline",
  "flex",
  "inline-flex",
  "grid",
  "inline-grid",
  "hidden",
  "contents",
  "flex-row",
  "flex-col",
  "flex-wrap",
  "flex-nowrap",
  "flex-1",
  "flex-auto",
  "flex-none",
  "grow",
  "shrink-0",
  "items-start",
  "items-center",
  "items-end",
  "items-baseline",
  "items-stretch",
  "justify-start",
  "justify-center",
  "justify-end",
  "justify-between",
  "justify-around",
  "justify-evenly",
  "self-start",
  "self-center",
  "self-end",
  "self-stretch",
  "place-items-center",
  "place-content-center",
  ...each(["grid-cols", "col-span"], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  ...each(["grid-fill", "grid-fit"], [120, 160, 200, 240, 280, 320]),
  "col-span-full",
  "relative",
  "absolute",
  "fixed",
  "sticky",
  "static",
  "inset-0",
  ...each(
    ["top", "right", "bottom", "left"],
    [0, 4, 8, 12, 16, 20, 24, 32, 48, 64, 80],
  ),
  ...each(["z"], [0, 1, 2, 5, 10, 20, 30, 40, 50]),
  "overflow-hidden",
  "overflow-auto",
  "overflow-x-auto",
  "overflow-y-auto",
  "overflow-visible",
  "isolate",
  "container",
  // отступы и размеры
  ...each(
    [
      "p",
      "px",
      "py",
      "pt",
      "pr",
      "pb",
      "pl",
      "m",
      "mx",
      "my",
      "mt",
      "mr",
      "mb",
      "ml",
      "gap",
      "gap-x",
      "gap-y",
    ],
    SPACE,
  ),
  "mx-auto",
  "my-auto",
  "ml-auto",
  "mr-auto",
  "mt-auto",
  "mb-auto",
  ...each(["-mx", "-my", "-mt"], [4, 8, 12, 16, 20, 24]),
  ...each(["w", "h", "size", "min-w", "min-h"], SIZE),
  "w-full",
  "h-full",
  "w-screen",
  "h-screen",
  "h-dvh",
  "min-h-dvh",
  "min-h-screen",
  "w-fit",
  "h-fit",
  "w-1/2",
  "w-1/3",
  "w-2/3",
  "w-1/4",
  "w-3/4",
  "size-full",
  "min-w-0",
  "min-h-0",
  ...each(["max-w"], MAX_W),
  "max-w-full",
  "max-w-60ch",
  "max-w-72ch",
  // текст
  ...each(["font"], FONT),
  "font-mono",
  ...each(["font-w"], [400, 500, 600, 700]),
  ...each(["letter-s"], [0, 2, 4, 6, 8, 10]),
  ...each(["-letter-s"], [1, 2, 3, 4]),
  ...each(["leading"], [1, 1.05, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.75, 2]),
  "text-left",
  "text-center",
  "text-right",
  "text-balance",
  "uppercase",
  "lowercase",
  "capitalize",
  "normal-case",
  "italic",
  "underline",
  "no-underline",
  "truncate",
  "whitespace-nowrap",
  "break-words",
  "tabular-nums",
  ...each(["line-clamp"], [1, 2, 3, 4]),
  // цвета: все токены и палитра
  ...COLOR_TOKENS.flatMap((c) => [`bg-${c}`, `text-${c}`, `border-${c}`]),
  "bg-transparent",
  "text-current",
  "border-transparent",
  ...SEMANTIC.flatMap((c) =>
    ALPHA.flatMap((a) => [`bg-${c}/${a}`, `border-${c}/${a}`]),
  ),
  ...COLOR_TOKENS.filter((c) => /-500$/.test(c)).flatMap((c) =>
    ALPHA.map((a) => `bg-${c}/${a}`),
  ),
  "bg-gradient-brand",
  "bg-gradient-dark",
  "bg-gradient-accent",
  "bg-clip-text",
  // рамки, скругления, тени
  "border",
  "border-0",
  "border-2",
  "border-t",
  "border-r",
  "border-b",
  "border-l",
  "border-x",
  "border-y",
  "border-solid",
  "border-dashed",
  "border-dotted",
  ...RADII.map((r) => `br-${r}`),
  "br-full",
  ...each(["br"], [0, 4, 8, 12, 16, 20, 24, 32]),
  ...SHADOWS.map((s) => `shadow-${s}`),
  "shadow-none",
  // эффекты и движение
  ...each(["opacity"], [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
  "transition",
  "transition-colors",
  "transition-transform",
  "transition-opacity",
  ...each(["duration"], [150, 200, 300, 400, 500, 700]),
  "ease-spring",
  "ease-spring-bouncy",
  "ease-out",
  "ease-in-out",
  "ease-linear",
  ...each(["backdrop-blur"], [4, 8, 12, 20]),
  "cursor-pointer",
  "select-none",
  "pointer-events-none",
  "sr-only",
  "outline-none",
];

// под экран — то, что меняет раскладку
const responsive = [
  "block",
  "flex",
  "grid",
  "hidden",
  "flex-row",
  "flex-col",
  "items-center",
  "justify-between",
  ...each(["grid-cols"], [1, 2, 3, 4, 5, 6]),
  ...each(["col-span"], [1, 2, 3, 4, 6, 12]),
  ...each(["p", "px", "py", "gap"], SPACE_SM),
  ...each(["font"], FONT_SM),
  "text-left",
  "text-center",
  "w-full",
  "w-1/2",
  "w-auto",
];

// состояния — наведение, фокус и тёмная тема
const states = [
  ...SEMANTIC.map((c) => `hover:bg-${c}`),
  ...SEMANTIC.map((c) => `hover:text-${c}`),
  ...SEMANTIC.flatMap((c) => [5, 10, 15].map((a) => `hover:bg-${c}/${a}`)),
  ...each(["hover:shadow"], [1, 2, 3, 4, 5]),
  "hover:-translate-y-1",
  "hover:-translate-y-2",
  "hover:underline",
  "hover:opacity-80",
  "active:scale-95",
  "active:scale-97",
  "focus-visible:outline-2",
  "focus-visible:outline-ring",
  "focus-visible:outline-offset-2",
  "dark:hidden",
  "dark:block",
  "dark:flex",
  "dark:shadow-none",
  "dark:border",
];

const candidates = [
  ...base,
  ...SCREENS.flatMap((s) => responsive.map((c) => `${s}:${c}`)),
  ...states,
];
const classes = [...new Set(candidates)].filter((c) => generator.isValid(c));
const skipped = candidates.length - classes.length;
const { css: utilities } = generator.generate(classes);

// ── Сборка ──────────────────────────────────────────────────────────────────

const styles = compile(path.join(SCSS, "RenDit_UI.scss"), {
  loadPaths: [SCSS],
  style: "expanded",
}).css;

const banner = `/*! RenDit UI v${config.version} | MIT | готовый CSS: стили RenDit SCSS + ${classes.length} классов RenDit Code */`;
// без BOM, @charset и старой шапки — своя шапка; @charset первым: в файле есть кириллица
const clean = (css) =>
  css
    .replace(/^\uFEFF/, "")
    .replace(/^@charset "UTF-8";\s*/, "")
    .replace(/^\/\*![^*]*\*\/\s*/, "");
const head = `@charset "UTF-8";\n${banner}\n`;
const full = `${head}${clean(styles)}\n\n${utilities}\n`;
const min = `${head}${clean(compileString(clean(full), { syntax: "css", style: "compressed" }).css)}\n`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "rendit-ui.css"), full);
fs.writeFileSync(path.join(OUT, "rendit-ui.min.css"), min);

const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(0)} КБ`;
console.log(
  `✓ dist/rendit-ui.css ${kb(full)} · dist/rendit-ui.min.css ${kb(min)} · ${classes.length} классов${skipped ? ` (пропущено ${skipped} — нет такой утилиты)` : ""}`,
);
