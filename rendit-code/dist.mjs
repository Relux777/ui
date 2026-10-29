#!/usr/bin/env node
// Готовый CSS RenDit UI для проектов без сборки (HTML/CSS, CDN, WordPress…):
//   node rendit-code/dist.mjs   (npm run dist)
// → dist/rendit-ui.css         — всё целиком: RenDit SCSS (токены обеих тем, сброс, база, сетка .row, компоненты)
//                                и готовые классы RenDit Code — частые значения шкалы, все цвета, варианты экранов
//                                и состояний;
//   dist/rendit-ui.min.css     — то же, сжатое (для продакшена);
//   dist/modules/rendit-*.css  — то же по частям: основа (core) обязательна, остальные — по желанию (раскладка,
//                                flex и grid, отступы, размеры, текст, цвета, рамки, эффекты, движение,
//                                взаимодействие), у каждой обычная и .min.css;
//   dist/modules/manifest.json — список частей: название, что внутри, размер, классы (для CSS-конструктора справки).
//
// Части делятся по свойствам CSS: одно свойство — всегда в одной части, вместе с его вариантами (sm:, hover:,
// dark:). Поэтому части можно подключать в любом наборе и порядке — классы разных частей не спорят друг с другом.
// В проектах с Node.js движок собирает только нужные классы — файл меньше и любые значения работают.
// Здесь классы — заранее выбранный набор. Чего нет — соберите в CSS-конструкторе справки или пишите свой CSS
// на переменных (var(--primary)).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile, compileString } from "sass";
import { loadConfig } from "./core/config.mjs";
import { createGenerator } from "./core/generator.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "dist");
const MODULES_OUT = path.join(OUT, "modules");
const SCSS = path.join(ROOT, "src/assets/scss");

const config = await loadConfig(ROOT);
const generator = createGenerator(config.theme, config);
const {
  colors: COLOR_TOKENS,
  shadows: SHADOWS,
  radius: RADII,
} = config.tokenInfo;

// ── Наборы значений ─────────────────────────────────────────────────────────

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
// варианты под экраны: sm:flex, md:flex …
const screens = (classes) =>
  SCREENS.flatMap((s) => classes.map((c) => `${s}:${c}`));

// смысловые токены (фон, текст, акцент, статусы) и палитра (gray-50 … pink-950) — разные части: палитра большая
const SEMANTIC = COLOR_TOKENS.filter((c) => !/-\d+$/.test(c));
const PALETTE = COLOR_TOKENS.filter((c) => /-\d+$/.test(c));

// ── Части ───────────────────────────────────────────────────────────────────
// base — классы части, responsive — какие из них нужны и под экраны (sm:… 2xl:), states — состояния и тема

const MODULES = [
  {
    id: "layout",
    title: "Раскладка",
    text: "display, позиция, смещение, слои z, переполнение, видимость",
    base: [
      "block",
      "inline-block",
      "inline",
      "flex",
      "inline-flex",
      "grid",
      "inline-grid",
      "hidden",
      "contents",
      "relative",
      "absolute",
      "fixed",
      "sticky",
      "static",
      "inset-0",
      "inset-x-0",
      "inset-y-0",
      ...each(
        ["top", "right", "bottom", "left"],
        [0, 4, 8, 12, 16, 20, 24, 32, 48, 64, 80],
      ),
      ...each(["z"], [0, 1, 2, 5, 10, 20, 30, 40, 50]),
      "-z-1",
      "overflow-hidden",
      "overflow-auto",
      "overflow-x-auto",
      "overflow-y-auto",
      "overflow-visible",
      "overscroll-contain",
      "isolate",
      "visible",
      "invisible",
      "sr-only",
      "not-sr-only",
      "object-cover",
      "object-contain",
      "object-center",
      "@container",
    ],
    responsive: ["block", "flex", "grid", "hidden", "inline-flex"],
    states: ["dark:hidden", "dark:block", "dark:flex"],
  },
  {
    id: "flex-grid",
    title: "Flex и Grid",
    text: "направление, перенос, выравнивание, колонки и ячейки сетки",
    base: [
      "flex-row",
      "flex-col",
      "flex-row-reverse",
      "flex-col-reverse",
      "flex-wrap",
      "flex-nowrap",
      "flex-1",
      "flex-auto",
      "flex-none",
      "grow",
      "shrink-0",
      "order-first",
      "order-last",
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
      ...each(
        ["grid-cols", "col-span"],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      ),
      ...each(["grid-fill", "grid-fit"], [120, 160, 200, 240, 280, 320]),
      "col-span-full",
    ],
    responsive: [
      "flex-row",
      "flex-col",
      "items-center",
      "justify-between",
      ...each(["grid-cols"], [1, 2, 3, 4, 5, 6]),
      ...each(["col-span"], [1, 2, 3, 4, 6, 12]),
    ],
    states: [],
  },
  {
    id: "spacing",
    title: "Отступы",
    text: "p-, m-, gap- и space- — шкала 0…120px",
    base: [
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
      ...each(["space-x", "space-y"], [4, 8, 12, 16, 24, 32]),
    ],
    responsive: each(["p", "px", "py", "gap"], SPACE_SM),
    states: [],
  },
  {
    id: "sizing",
    title: "Размеры",
    text: "ширина, высота, size-, ограничения min-/max-, пропорции",
    base: [
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
      "w-auto",
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
      "aspect-square",
      "aspect-video",
      "aspect-4/3",
    ],
    responsive: ["w-full", "w-1/2", "w-auto"],
    states: [],
  },
  {
    id: "text",
    title: "Текст",
    text: "размер, начертание, строка и интервал, выравнивание, регистр, обрезка",
    base: [
      ...each(["font"], FONT),
      "font-mono",
      ...each(["font-w"], [400, 500, 600, 700]),
      ...each(["letter-s"], [0, 2, 4, 6, 8, 10]),
      ...each(["-letter-s"], [1, 2, 3, 4]),
      ...each(["leading"], [1, 1.05, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.75, 2]),
      "text-left",
      "text-center",
      "text-right",
      "text-justify",
      "text-balance",
      "text-pretty",
      "uppercase",
      "lowercase",
      "capitalize",
      "normal-case",
      "italic",
      "underline",
      "line-through",
      "no-underline",
      "decoration-wavy",
      "decoration-dashed",
      ...each(["decoration"], [1, 2, 3]),
      ...each(["underline-offset"], [2, 4, 6]),
      "truncate",
      "whitespace-nowrap",
      "whitespace-pre-wrap",
      "break-words",
      "break-all",
      "hyphens-auto",
      "tabular-nums",
      "list-disc",
      "list-decimal",
      "list-none",
      "list-inside",
      ...each(["line-clamp"], [1, 2, 3, 4]),
    ],
    responsive: [...each(["font"], FONT_SM), "text-left", "text-center"],
    states: ["hover:underline"],
  },
  {
    id: "colors",
    title: "Цвета и фон",
    text: "смысловые цвета (фон, текст, акцент, статусы): bg-, text-, border-, прозрачность /N, градиенты",
    base: [
      ...SEMANTIC.flatMap((c) => [`bg-${c}`, `text-${c}`, `border-${c}`]),
      "bg-transparent",
      "text-current",
      "border-transparent",
      ...SEMANTIC.flatMap((c) =>
        ALPHA.flatMap((a) => [`bg-${c}/${a}`, `border-${c}/${a}`]),
      ),
      "bg-gradient-brand",
      "bg-gradient-dark",
      "bg-gradient-accent",
      "bg-clip-text",
      "bg-cover",
      "bg-center",
      "bg-no-repeat",
    ],
    responsive: [],
    states: [
      ...SEMANTIC.map((c) => `hover:bg-${c}`),
      ...SEMANTIC.map((c) => `hover:text-${c}`),
      ...SEMANTIC.flatMap((c) => [5, 10, 15].map((a) => `hover:bg-${c}/${a}`)),
    ],
  },
  {
    id: "palette",
    title: "Палитра",
    text: "все цвета палитры (gray-50 … pink-950): bg-, text-, border-; у оттенка 500 — прозрачность /N",
    base: [
      ...PALETTE.flatMap((c) => [`bg-${c}`, `text-${c}`, `border-${c}`]),
      ...PALETTE.filter((c) => /-500$/.test(c)).flatMap((c) =>
        ALPHA.map((a) => `bg-${c}/${a}`),
      ),
    ],
    responsive: [],
    states: [],
  },
  {
    id: "borders",
    title: "Рамки",
    text: "рамки и стороны, стиль, скругления br-, обводка фокуса",
    base: [
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
      "outline-none",
    ],
    responsive: [],
    states: [
      "focus-visible:outline-2",
      "focus-visible:outline-ring",
      "focus-visible:outline-offset-2",
      "dark:border",
    ],
  },
  {
    id: "effects",
    title: "Эффекты",
    text: "тени shadow-, прозрачность, размытие фона",
    base: [
      ...SHADOWS.map((s) => `shadow-${s}`),
      "shadow-none",
      ...each(["opacity"], [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
      ...each(["blur"], [4, 8, 12]),
      ...each(["backdrop-blur"], [4, 8, 12, 20]),
    ],
    responsive: [],
    states: [
      ...each(["hover:shadow"], [1, 2, 3, 4, 5]),
      "hover:opacity-80",
      "dark:shadow-none",
    ],
  },
  {
    id: "motion",
    title: "Движение",
    text: "переходы, длительность, кривые, сдвиг и масштаб",
    base: [
      "transition",
      "transition-colors",
      "transition-transform",
      "transition-opacity",
      "transition-none",
      ...each(["duration"], [150, 200, 300, 400, 500, 700]),
      ...each(["delay"], [100, 200, 300]),
      "ease-spring",
      "ease-spring-bouncy",
      "ease-out",
      "ease-in-out",
      "ease-linear",
      "motion-reduce:transition-none",
    ],
    responsive: [],
    states: [
      "hover:-translate-y-1",
      "hover:-translate-y-2",
      "hover:scale-105",
      "active:scale-95",
      "active:scale-97",
    ],
  },
  {
    id: "interaction",
    title: "Взаимодействие",
    text: "курсор, нажатия, выделение, прокрутка, поля форм",
    base: [
      "cursor-pointer",
      "cursor-default",
      "cursor-not-allowed",
      "select-none",
      "select-text",
      "pointer-events-none",
      "pointer-events-auto",
      "touch-none",
      "scroll-smooth",
      ...each(["scroll-mt"], [16, 24, 32, 48, 64, 80]),
      "scrollbar-thin",
      "scrollbar-none",
      "appearance-none",
      "resize-none",
      "resize-y",
      "accent-primary",
      "accent-secondary",
    ],
    responsive: [],
    states: [],
  },
];

// ── Сборка ──────────────────────────────────────────────────────────────────

const valid = (list) => [...new Set(list)].filter((c) => generator.isValid(c));
const parts = MODULES.map((m) => {
  const candidates = [...m.base, ...screens(m.responsive), ...m.states];
  const classes = valid(candidates);
  return { ...m, classes, skipped: new Set(candidates).size - classes.length };
});

const styles = compile(path.join(SCSS, "RenDit_UI.scss"), {
  loadPaths: [SCSS],
  style: "expanded",
}).css;

// без BOM, @charset и старой шапки — своя шапка; @charset первым: в файле есть кириллица
const clean = (css) =>
  css
    .replace(/^﻿/, "")
    .replace(/^@charset "UTF-8";\s*/, "")
    .replace(/^\/\*![^*]*\*\/\s*/, "");
const head = (what) =>
  `@charset "UTF-8";\n/*! RenDit UI v${config.version} | MIT | ${what} */\n`;
const minify = (css, what) =>
  `${head(what)}${clean(compileString(clean(css), { syntax: "css", style: "compressed" }).css)}\n`;

const files = [];
const write = (name, css, what) => {
  const full = `${head(what)}${clean(css)}\n`;
  const min = minify(css, what);
  fs.writeFileSync(
    path.join(path.dirname(name), `${path.basename(name)}.css`),
    full,
  );
  fs.writeFileSync(
    path.join(path.dirname(name), `${path.basename(name)}.min.css`),
    min,
  );
  return { bytes: Buffer.byteLength(full), minBytes: Buffer.byteLength(min) };
};

fs.mkdirSync(MODULES_OUT, { recursive: true });

// целиком: стили RenDit SCSS + все классы одним проходом движка (общий порядок правил)
const all = valid(parts.flatMap((p) => p.classes));
const { css: utilities } = generator.generate(all);
const whole = write(
  path.join(OUT, "rendit-ui"),
  `${clean(styles)}\n\n${utilities}`,
  `готовый CSS: стили RenDit SCSS + ${all.length} классов RenDit Code`,
);

// основа: токены, сброс, база, контейнер, сетка .row, компоненты — без неё части не работают
const core = write(
  path.join(MODULES_OUT, "rendit-core"),
  styles,
  "основа: токены обеих тем, сброс, база, .container, .row, компоненты",
);
files.push({
  id: "core",
  title: "Основа",
  text: "токены обеих тем, сброс, база, контейнер, сетка .row, компоненты — нужна всегда",
  file: "rendit-core",
  required: true,
  classes: [],
  ...core,
});

for (const part of parts) {
  const { css } = generator.generate(part.classes);
  const size = write(
    path.join(MODULES_OUT, `rendit-${part.id}`),
    css,
    `${part.title}: ${part.classes.length} классов RenDit Code`,
  );
  files.push({
    id: part.id,
    title: part.title,
    text: part.text,
    file: `rendit-${part.id}`,
    required: false,
    classes: part.classes,
    ...size,
  });
}

fs.writeFileSync(
  path.join(MODULES_OUT, "manifest.json"),
  `${JSON.stringify({ version: config.version, full: whole, modules: files }, null, 2)}\n`,
);

const kb = (n) => `${(n / 1024).toFixed(0)} КБ`;
const skipped = parts.reduce((n, p) => n + p.skipped, 0);
console.log(
  `✓ dist/rendit-ui.css ${kb(whole.bytes)} · .min.css ${kb(whole.minBytes)} · ${all.length} классов${skipped ? ` (пропущено ${skipped} — нет такой утилиты)` : ""}`,
);
for (const f of files)
  console.log(
    `  dist/modules/${f.file}.css ${kb(f.bytes)} · .min ${kb(f.minBytes)}${f.classes.length ? ` · ${f.classes.length} классов` : ""}`,
  );
