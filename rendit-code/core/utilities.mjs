// Таблица утилит RenDit Code.
//
// Два вида:
//   static     — точное имя: flex, hidden, truncate …
//   functional — корень + значение: p-10, bg-primary/50, w-[calc(100%-10px)] …
//
// Обработчик функциональной утилиты получает ctx и возвращает объявления или null («не моё —
// пробуйте следующий обработчик»). У одного корня может быть несколько обработчиков (text-: цвет,
// размер), они пробуются по порядку.
//
// Результат: массив правил [{ sel, decls }], где sel — шаблон селектора («&» = сам класс),
// decls — [[свойство, значение], …]. Для простого случая хватает объекта { свойство: значение }.
//
// Правило именования: у каждой вещи ОДНО имя. Имена — как в Tailwind, кроме того, что пришло
// из ReluxCode и стало «лицом» RenDit: числа в пикселях, font-N (размер), font-w-N (начертание),
// br-N (скругление), letter-s-N (межбуквенный интервал).

import { parseValue } from "./parser.mjs";
import {
  fraction,
  isNumber,
  length,
  looksLikeColor,
  looksLikeImage,
  looksLikeLength,
  negate,
  px,
} from "./values.mjs";

export function createUtilities(theme) {
  const statics = new Map();
  const functional = new Map();

  const add = (name, decls) => statics.set(name, decls);
  const fn = (root, handler) => {
    if (!functional.has(root)) functional.set(root, []);
    functional.get(root).push(handler);
  };

  // ── Цвет ──────────────────────────────────────────────────────────────────
  // primary, primary/50, blue-500/[0.3], [#0d5ef5], [#0d5ef5]/40, (--brand), current, transparent
  function color(ctx) {
    const { parsed, modifier } = ctx;
    if (!parsed) return null;

    const alpha = parseAlpha(modifier);
    if (alpha === undefined) return null;

    if (parsed.kind === "arbitrary") {
      if (parsed.hint && parsed.hint !== "color") return null;
      const v = parsed.value;
      if (!parsed.hint && !looksLikeColor(v) && !v.startsWith("var("))
        return null;
      return withAlpha(v, alpha);
    }

    const entry = theme.colors.get(parsed.value);
    return entry ? entry(alpha) : null;
  }

  // ── Длины (отступы, позиционирование) ─────────────────────────────────────
  function spacing(
    ctx,
    { allowAuto = false, allowFraction = false, allowFull = false } = {},
  ) {
    const { parsed, negative, modifier } = ctx;
    if (!parsed) return null;
    let v = null;

    if (parsed.kind === "arbitrary") {
      if (
        parsed.hint &&
        parsed.hint !== "length" &&
        parsed.hint !== "percentage"
      )
        return null;
      if (modifier) return null;
      v = parsed.value;
    } else {
      const raw = parsed.value;
      if (modifier) v = allowFraction ? fraction(raw, modifier) : null;
      else if (raw === "auto" && allowAuto) v = "auto";
      else if (raw === "full" && allowFull) v = "100%";
      else v = theme.spacing.get(raw) ?? length(raw);
    }
    if (v === null) return null;
    if (negative) {
      if (v === "auto") return null;
      v = negate(v);
    }
    return v;
  }

  // ── Размеры ───────────────────────────────────────────────────────────────
  const SIZE_KEYWORDS = {
    auto: "auto",
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    none: "none",
  };

  function size(ctx, axis) {
    const { parsed, negative, modifier } = ctx;
    if (!parsed || negative) return null;
    if (parsed.kind === "arbitrary") return modifier ? null : parsed.value;

    const raw = parsed.value;
    if (modifier) return fraction(raw, modifier);
    if (raw === "screen") return axis === "x" ? "100vw" : "100vh";
    if (["dvh", "svh", "lvh"].includes(raw) && axis !== "x") return `100${raw}`;
    if (["dvw", "svw", "lvw"].includes(raw) && axis !== "y") return `100${raw}`;
    if (raw in SIZE_KEYWORDS) return SIZE_KEYWORDS[raw];
    return theme.spacing.get(raw) ?? length(raw);
  }

  // Одно значение → одно или несколько свойств
  const spacingUtil = (root, props, opts = {}) =>
    fn(root, (ctx) => {
      if (ctx.negative && !opts.negative) return null;
      const v = spacing(ctx, opts);
      return v === null ? null : Object.fromEntries(props.map((p) => [p, v]));
    });

  // Утилита «корень-цвет» → свойство
  const colorUtil = (root, prop) =>
    fn(root, (ctx) => {
      const c = color(ctx);
      return c === null ? null : { [prop]: c };
    });

  // ── Отступы ───────────────────────────────────────────────────────────────
  const PADDING = {
    p: ["padding"],
    px: ["padding-inline"],
    py: ["padding-block"],
    ps: ["padding-inline-start"],
    pe: ["padding-inline-end"],
    pt: ["padding-top"],
    pr: ["padding-right"],
    pb: ["padding-bottom"],
    pl: ["padding-left"],
  };
  for (const [root, props] of Object.entries(PADDING)) spacingUtil(root, props);

  const MARGIN = {
    m: ["margin"],
    mx: ["margin-inline"],
    my: ["margin-block"],
    ms: ["margin-inline-start"],
    me: ["margin-inline-end"],
    mt: ["margin-top"],
    mr: ["margin-right"],
    mb: ["margin-bottom"],
    ml: ["margin-left"],
  };
  for (const [root, props] of Object.entries(MARGIN))
    spacingUtil(root, props, { negative: true, allowAuto: true });

  spacingUtil("gap", ["gap"]);
  spacingUtil("gap-x", ["column-gap"]);
  spacingUtil("gap-y", ["row-gap"]);

  // space-x-10: отступ между детьми, без лишнего отступа у последнего
  fn("space-x", (ctx) => {
    const v = spacing(ctx, {});
    return v === null
      ? null
      : [
          {
            sel: ":where(& > :not(:last-child))",
            decls: [["margin-inline-end", v]],
          },
        ];
  });
  fn("space-y", (ctx) => {
    const v = spacing(ctx, {});
    return v === null
      ? null
      : [
          {
            sel: ":where(& > :not(:last-child))",
            decls: [["margin-bottom", v]],
          },
        ];
  });

  // ── Позиционирование ──────────────────────────────────────────────────────
  for (const p of ["static", "relative", "absolute", "fixed", "sticky"])
    add(p, { position: p });

  const INSET = {
    inset: ["inset"],
    "inset-x": ["inset-inline"],
    "inset-y": ["inset-block"],
    start: ["inset-inline-start"],
    end: ["inset-inline-end"],
    top: ["top"],
    right: ["right"],
    bottom: ["bottom"],
    left: ["left"],
  };
  for (const [root, props] of Object.entries(INSET))
    spacingUtil(root, props, {
      negative: true,
      allowAuto: true,
      allowFraction: true,
      allowFull: true,
    });

  fn("z", (ctx) => {
    const { parsed, negative } = ctx;
    if (!parsed || ctx.modifier) return null;
    if (parsed.kind === "arbitrary") return { "z-index": parsed.value };
    if (parsed.value === "auto" && !negative) return { "z-index": "auto" };
    if (!/^\d+$/.test(parsed.value)) return null;
    return { "z-index": negative ? `-${parsed.value}` : parsed.value };
  });

  // ── Display ───────────────────────────────────────────────────────────────
  for (const d of [
    "block",
    "inline-block",
    "inline",
    "flex",
    "inline-flex",
    "grid",
    "inline-grid",
    "contents",
    "table",
    "table-row",
    "table-cell",
    "flow-root",
    "list-item",
  ])
    add(d, { display: d });
  add("hidden", { display: "none" });

  add("visible", { visibility: "visible" });
  add("invisible", { visibility: "hidden" });

  add("isolate", { isolation: "isolate" });
  add("box-border", { "box-sizing": "border-box" });
  add("box-content", { "box-sizing": "content-box" });

  // ── Flex ──────────────────────────────────────────────────────────────────
  add("flex-row", { "flex-direction": "row" });
  add("flex-row-reverse", { "flex-direction": "row-reverse" });
  add("flex-col", { "flex-direction": "column" });
  add("flex-col-reverse", { "flex-direction": "column-reverse" });
  add("flex-wrap", { "flex-wrap": "wrap" });
  add("flex-nowrap", { "flex-wrap": "nowrap" });
  add("flex-wrap-reverse", { "flex-wrap": "wrap-reverse" });

  add("flex-1", { flex: "1 1 0%" });
  add("flex-auto", { flex: "1 1 auto" });
  add("flex-initial", { flex: "0 1 auto" });
  add("flex-none", { flex: "none" });
  fn("flex", (ctx) =>
    ctx.parsed?.kind === "arbitrary" ? { flex: ctx.parsed.value } : null,
  );
  add("grow", { "flex-grow": "1" });
  add("grow-0", { "flex-grow": "0" });
  add("shrink", { "flex-shrink": "1" });
  add("shrink-0", { "flex-shrink": "0" });
  fn("basis", (ctx) => {
    const v = size(ctx, "x");
    return v === null ? null : { "flex-basis": v };
  });

  fn("order", (ctx) => {
    const { parsed, negative } = ctx;
    if (!parsed) return null;
    if (parsed.kind === "arbitrary") return { order: parsed.value };
    if (parsed.value === "first") return { order: "-9999" };
    if (parsed.value === "last") return { order: "9999" };
    if (parsed.value === "none") return { order: "0" };
    return /^\d+$/.test(parsed.value)
      ? { order: negative ? `-${parsed.value}` : parsed.value }
      : null;
  });

  // ── Выравнивание (flex и grid) ────────────────────────────────────────────
  const ALIGN = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    baseline: "baseline",
    stretch: "stretch",
  };
  for (const [k, v] of Object.entries(ALIGN)) {
    add(`items-${k}`, { "align-items": v });
    add(`self-${k}`, { "align-self": v });
  }
  add("self-auto", { "align-self": "auto" });

  const DISTRIBUTE = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
    stretch: "stretch",
  };
  for (const [k, v] of Object.entries(DISTRIBUTE)) {
    add(`justify-${k}`, { "justify-content": v });
    add(`content-${k}`, { "align-content": v });
  }

  for (const k of ["start", "end", "center", "stretch"]) {
    add(`justify-items-${k}`, { "justify-items": k });
    add(`justify-self-${k}`, { "justify-self": k });
    add(`place-items-${k}`, { "place-items": k });
    add(`place-content-${k}`, { "place-content": k });
    add(`place-self-${k}`, { "place-self": k });
  }

  // ── CSS Grid ──────────────────────────────────────────────────────────────
  fn("grid-cols", (ctx) => gridTemplate(ctx, "grid-template-columns"));
  fn("grid-rows", (ctx) => gridTemplate(ctx, "grid-template-rows"));

  function gridTemplate(ctx, prop) {
    const { parsed } = ctx;
    if (!parsed || ctx.negative || ctx.modifier) return null;
    if (parsed.kind === "arbitrary") return { [prop]: parsed.value };
    if (parsed.value === "none" || parsed.value === "subgrid")
      return { [prop]: parsed.value };
    return /^\d+$/.test(parsed.value) && Number(parsed.value) > 0
      ? { [prop]: `repeat(${parsed.value}, minmax(0, 1fr))` }
      : null;
  }

  // grid-fill-240 — сколько влезет колонок не уже 240px (адаптивная сетка карточек без брейкпоинтов),
  // grid-fit-240 — то же, но колонки растягиваются, если карточек меньше, чем места
  for (const [root, mode] of [
    ["grid-fill", "auto-fill"],
    ["grid-fit", "auto-fit"],
  ]) {
    fn(root, (ctx) => {
      const { parsed } = ctx;
      if (!parsed || ctx.negative || ctx.modifier) return null;
      const v =
        parsed.kind === "arbitrary" ? parsed.value : length(parsed.value);
      return v === null
        ? null
        : {
            "grid-template-columns": `repeat(${mode}, minmax(min(${v}, 100%), 1fr))`,
          };
    });
  }

  for (const [root, prop] of [
    ["col", "grid-column"],
    ["row", "grid-row"],
  ]) {
    fn(`${root}-span`, (ctx) => {
      const v = ctx.parsed?.value;
      if (v === "full") return { [prop]: "1 / -1" };
      return /^\d+$/.test(v ?? "") ? { [prop]: `span ${v} / span ${v}` } : null;
    });
    fn(`${root}-start`, (ctx) =>
      /^\d+$/.test(ctx.parsed?.value ?? "")
        ? { [`${prop}-start`]: ctx.parsed.value }
        : null,
    );
    fn(`${root}-end`, (ctx) =>
      /^\d+$/.test(ctx.parsed?.value ?? "")
        ? { [`${prop}-end`]: ctx.parsed.value }
        : null,
    );
  }

  add("grid-flow-row", { "grid-auto-flow": "row" });
  add("grid-flow-col", { "grid-auto-flow": "column" });
  add("grid-flow-dense", { "grid-auto-flow": "dense" });

  // ── Сетка .row (layout/_grid.scss) ────────────────────────────────────────
  // col-6 — 6 из 12 колонок, col — делит остаток поровну, col-auto — по содержимому, offset-2 — сдвиг
  fn("col", (ctx) => {
    const v = ctx.parsed?.value;
    if (!/^\d+$/.test(v ?? "") || ctx.modifier) return null;
    const n = Number(v);
    if (n < 1 || n > theme.columns) return null;
    return {
      flex: "0 0 auto",
      width: fraction(String(n), String(theme.columns)),
    };
  });
  add("col", { flex: "1 0 0%", width: "auto" });
  add("col-auto", { flex: "0 0 auto", width: "auto" });
  fn("offset", (ctx) => {
    const v = ctx.parsed?.value;
    if (!/^\d+$/.test(v ?? "") || Number(v) >= theme.columns) return null;
    return {
      "margin-inline-start":
        v === "0" ? "0" : fraction(v, String(theme.columns)),
    };
  });
  for (const [root, vars] of [
    ["gutter", ["--gutter-x", "--gutter-y"]],
    ["gutter-x", ["--gutter-x"]],
    ["gutter-y", ["--gutter-y"]],
  ]) {
    fn(root, (ctx) => {
      if (ctx.negative) return null;
      const v = spacing(ctx, {});
      // единица обязательна: calc(0 / -2) внутри .row невалиден
      const value = v === "0" ? "0px" : v;
      return v === null
        ? null
        : Object.fromEntries(vars.map((name) => [name, value]));
    });
  }

  // ── Размеры ───────────────────────────────────────────────────────────────
  const SIZES = {
    w: [["width"], "x"],
    h: [["height"], "y"],
    size: [["width", "height"], "xy"],
    "min-w": [["min-width"], "x"],
    "max-w": [["max-width"], "x"],
    "min-h": [["min-height"], "y"],
    "max-h": [["max-height"], "y"],
  };
  for (const [root, [props, axis]] of Object.entries(SIZES)) {
    fn(root, (ctx) => {
      const v = size(ctx, axis);
      if (v === null) return null;
      if (v === "none" && !root.startsWith("max")) return null;
      return Object.fromEntries(props.map((p) => [p, v]));
    });
  }

  fn("aspect", (ctx) => {
    const { parsed, modifier } = ctx;
    if (!parsed) return null;
    if (parsed.kind === "arbitrary") return { "aspect-ratio": parsed.value };
    if (parsed.value === "square") return { "aspect-ratio": "1 / 1" };
    if (parsed.value === "video") return { "aspect-ratio": "16 / 9" };
    if (parsed.value === "auto") return { "aspect-ratio": "auto" };
    if (modifier && isNumber(parsed.value) && isNumber(modifier))
      return { "aspect-ratio": `${parsed.value} / ${modifier}` };
    return null;
  });

  // ── Типографика ───────────────────────────────────────────────────────────
  // Размер текста масштабируется: пиксели умножаются на --text-scale (по умолчанию 1). Пользователь меняет
  // размер текста на сайте одной переменной на <html> — font-N, font-N/LH и leading-N в px растут вместе.
  // Свои значения (text-[18px], font-[1.2rem]) не масштабируются — они «как написано».
  const scaled = (v) =>
    typeof v === "string" && v.endsWith("px")
      ? `calc(${v} * var(--text-scale, 1))`
      : v;

  // font-14 → размер, font-14/20 → размер и высота строки, font-sans → семейство, font-[600] → начертание
  fn("font", (ctx) => {
    const { parsed } = ctx;
    if (!parsed || ctx.negative) return null;
    if (parsed.kind === "arbitrary") {
      const v = parsed.value;
      if (
        parsed.hint === "weight" ||
        parsed.hint === "number" ||
        (!parsed.hint && /^\d{3}$/.test(v))
      )
        return { "font-weight": v };
      if (parsed.hint === "length" || (!parsed.hint && looksLikeLength(v)))
        return { "font-size": v };
      return { "font-family": v };
    }
    if (theme.fonts.has(parsed.value))
      return { "font-family": theme.fonts.get(parsed.value) };
    const v = length(parsed.value);
    if (v === null) return null;
    if (!ctx.modifier) return { "font-size": scaled(v) };
    const lh = lineHeight(ctx.modifier);
    return lh === null
      ? null
      : { "font-size": scaled(v), "line-height": scaled(lh) };
  });

  // font-w-700
  fn("font-w", (ctx) => {
    const v = ctx.parsed?.value;
    if (ctx.parsed?.kind === "arbitrary") return { "font-weight": v };
    return /^[1-9]00$/.test(v ?? "") ? { "font-weight": v } : null;
  });

  // text-primary → цвет, text-[18px] → размер, text-center → выравнивание
  colorUtil("text", "color");
  fn("text", (ctx) => {
    const { parsed } = ctx;
    if (!parsed || parsed.kind !== "arbitrary") return null;
    if (
      parsed.hint === "length" ||
      (!parsed.hint && looksLikeLength(parsed.value))
    )
      return { "font-size": parsed.value };
    return null;
  });

  for (const a of ["left", "center", "right", "justify", "start", "end"])
    add(`text-${a}`, { "text-align": a });
  add("text-wrap", { "text-wrap": "wrap" });
  add("text-nowrap", { "text-wrap": "nowrap" });
  add("text-balance", { "text-wrap": "balance" });
  add("text-pretty", { "text-wrap": "pretty" });

  add("uppercase", { "text-transform": "uppercase" });
  add("lowercase", { "text-transform": "lowercase" });
  add("capitalize", { "text-transform": "capitalize" });
  add("normal-case", { "text-transform": "none" });
  add("italic", { "font-style": "italic" });
  add("not-italic", { "font-style": "normal" });
  add("underline", { "text-decoration-line": "underline" });
  add("overline", { "text-decoration-line": "overline" });
  add("line-through", { "text-decoration-line": "line-through" });
  add("no-underline", { "text-decoration-line": "none" });
  add("tabular-nums", { "font-variant-numeric": "tabular-nums" });

  // линия подчёркивания: цвет decoration-secondary, стиль decoration-wavy, толщина decoration-2 (px)
  colorUtil("decoration", "text-decoration-color");
  for (const s of ["solid", "double", "dotted", "dashed", "wavy"])
    add(`decoration-${s}`, { "text-decoration-style": s });
  fn("decoration", (ctx) => {
    const v = spacing(ctx, {});
    return v === null ? null : { "text-decoration-thickness": v };
  });
  fn("underline-offset", (ctx) => {
    const v = spacing(ctx, {});
    return v === null ? null : { "text-underline-offset": v };
  });
  // отступ первой строки абзаца
  fn("indent", (ctx) => {
    const v = spacing(ctx, {});
    return v === null ? null : { "text-indent": v };
  });

  // leading-1.4 → 1.4, leading-20 → 20px
  function lineHeight(raw) {
    if (raw.startsWith("[") && raw.endsWith("]"))
      return parseValue(raw)?.value ?? null;
    if (isNumber(raw))
      return raw.includes(".") || Number(raw) <= 4 ? raw : px(raw);
    return length(raw);
  }
  fn("leading", (ctx) => {
    const { parsed } = ctx;
    if (!parsed) return null;
    if (parsed.kind === "arbitrary") return { "line-height": parsed.value };
    const named = { none: "1", tight: "1.25", normal: "1.5", loose: "2" }[
      parsed.value
    ];
    const v = named ?? lineHeight(parsed.value);
    return v === null ? null : { "line-height": scaled(v) };
  });

  // letter-s-8 = 0.08em (сотые доли em: интервал растёт вместе с размером шрифта), -letter-s-2 — плотнее
  fn("letter-s", (ctx) => {
    const { parsed, negative } = ctx;
    if (!parsed) return null;
    if (parsed.kind === "arbitrary")
      return {
        "letter-spacing": negative ? negate(parsed.value) : parsed.value,
      };
    if (!isNumber(parsed.value)) return null;
    const em = Number.parseFloat((Number(parsed.value) * 0.01).toFixed(4));
    return {
      "letter-spacing": em === 0 ? "0" : `${negative ? "-" : ""}${em}em`,
    };
  });

  fn("line-clamp", (ctx) => {
    const v = ctx.parsed?.value;
    if (v === "none")
      return {
        overflow: "visible",
        display: "block",
        "-webkit-box-orient": "horizontal",
        "-webkit-line-clamp": "unset",
      };
    if (!/^\d+$/.test(v ?? "")) return null;
    return {
      overflow: "hidden",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": v,
    };
  });

  add("truncate", {
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap",
  });
  add("text-ellipsis", { "text-overflow": "ellipsis" });
  for (const w of [
    "normal",
    "nowrap",
    "pre",
    "pre-line",
    "pre-wrap",
    "break-spaces",
  ])
    add(`whitespace-${w}`, { "white-space": w });
  add("break-normal", { "overflow-wrap": "normal", "word-break": "normal" });
  add("break-words", { "overflow-wrap": "break-word" });
  add("break-all", { "word-break": "break-all" });
  add("hyphens-auto", { hyphens: "auto" });
  add("hyphens-manual", { hyphens: "manual" });
  add("hyphens-none", { hyphens: "none" });

  add("list-disc", { "list-style-type": "disc" });
  add("list-decimal", { "list-style-type": "decimal" });
  add("list-none", { "list-style-type": "none" });
  add("list-inside", { "list-style-position": "inside" });
  add("list-outside", { "list-style-position": "outside" });

  // ── Фон ───────────────────────────────────────────────────────────────────
  colorUtil("bg", "background-color");
  fn("bg", (ctx) => {
    const { parsed } = ctx;
    if (parsed?.kind !== "arbitrary" || ctx.modifier) return null;
    if (
      parsed.hint === "image" ||
      parsed.hint === "url" ||
      (!parsed.hint && looksLikeImage(parsed.value))
    )
      return { "background-image": parsed.value };
    if (parsed.hint === "position")
      return { "background-position": parsed.value };
    if (parsed.hint === "size") return { "background-size": parsed.value };
    return null;
  });
  // bg-gradient-brand — градиенты из токенов --gradient-ИМЯ
  fn("bg-gradient", (ctx) => {
    const v =
      ctx.parsed?.kind === "named"
        ? theme.gradients.get(ctx.parsed.value)
        : null;
    return v && !ctx.modifier ? { "background-image": v } : null;
  });
  add("bg-none", { "background-image": "none" });
  add("bg-cover", { "background-size": "cover" });
  add("bg-contain", { "background-size": "contain" });
  add("bg-center", { "background-position": "center" });
  add("bg-no-repeat", { "background-repeat": "no-repeat" });
  add("bg-clip-text", { "background-clip": "text", color: "transparent" });

  colorUtil("fill", "fill");
  colorUtil("stroke", "stroke");
  fn("stroke", (ctx) =>
    isNumber(ctx.parsed?.value ?? "")
      ? { "stroke-width": ctx.parsed.value }
      : null,
  );
  colorUtil("accent", "accent-color");
  colorUtil("caret", "caret-color");

  // ── Рамки ─────────────────────────────────────────────────────────────────
  // border = 1px solid (цвет по умолчанию — --border из generic/_base.scss);
  // border-2, border-t, border-b-2, border-primary/20, border-x-danger.
  // Стиль — только у своих сторон: border-style: solid у border-b включил бы и остальные стороны
  // с шириной по умолчанию (medium, 3px) — вместо линии снизу получалась рамка
  const BORDER_SIDES = {
    "": ["border-width", "border-color", "border-style"],
    x: ["border-inline-width", "border-inline-color", "border-inline-style"],
    y: ["border-block-width", "border-block-color", "border-block-style"],
    s: [
      "border-inline-start-width",
      "border-inline-start-color",
      "border-inline-start-style",
    ],
    e: [
      "border-inline-end-width",
      "border-inline-end-color",
      "border-inline-end-style",
    ],
    t: ["border-top-width", "border-top-color", "border-top-style"],
    r: ["border-right-width", "border-right-color", "border-right-style"],
    b: ["border-bottom-width", "border-bottom-color", "border-bottom-style"],
    l: ["border-left-width", "border-left-color", "border-left-style"],
  };
  for (const [side, [widthProp, colorProp, styleProp]] of Object.entries(
    BORDER_SIDES,
  )) {
    const root = side ? `border-${side}` : "border";
    add(root, { [widthProp]: "1px", [styleProp]: "solid" });
    fn(root, (ctx) => {
      const { parsed } = ctx;
      if (!parsed || ctx.negative) return null;
      if (parsed.kind === "named" && isNumber(parsed.value) && !ctx.modifier)
        return { [widthProp]: px(parsed.value), [styleProp]: "solid" };
      if (
        parsed.kind === "arbitrary" &&
        (parsed.hint === "length" ||
          (!parsed.hint && looksLikeLength(parsed.value)))
      )
        return { [widthProp]: parsed.value, [styleProp]: "solid" };
      return null;
    });
    colorUtil(root, colorProp);
  }
  for (const s of ["solid", "dashed", "dotted", "none"])
    add(`border-${s}`, { "border-style": s });

  // br-20 = 20px, br-lg — токен --radius-lg, br-full — «таблетка», br-round — круг (50%)
  const RADIUS = {
    "": ["border-radius"],
    t: ["border-top-left-radius", "border-top-right-radius"],
    r: ["border-top-right-radius", "border-bottom-right-radius"],
    b: ["border-bottom-right-radius", "border-bottom-left-radius"],
    l: ["border-top-left-radius", "border-bottom-left-radius"],
    s: ["border-start-start-radius", "border-end-start-radius"],
    e: ["border-start-end-radius", "border-end-end-radius"],
    tl: ["border-top-left-radius"],
    tr: ["border-top-right-radius"],
    br: ["border-bottom-right-radius"],
    bl: ["border-bottom-left-radius"],
  };
  for (const [side, props] of Object.entries(RADIUS)) {
    fn(side ? `br-${side}` : "br", (ctx) => {
      const { parsed } = ctx;
      if (!parsed || ctx.negative || ctx.modifier) return null;
      let v;
      if (parsed.kind === "arbitrary") v = parsed.value;
      else if (parsed.value === "full") v = "9999px";
      else if (parsed.value === "round") v = "50%";
      else if (parsed.value === "none") v = "0";
      else v = theme.radius.get(parsed.value) ?? length(parsed.value);
      return v === null ? null : Object.fromEntries(props.map((p) => [p, v]));
    });
  }

  // ── Обводка (outline) ─────────────────────────────────────────────────────
  add("outline-none", { "outline-style": "none" });
  add("outline", { "outline-style": "solid", "outline-width": "1px" });
  fn("outline", (ctx) =>
    isNumber(ctx.parsed?.value ?? "") && !ctx.modifier
      ? { "outline-style": "solid", "outline-width": px(ctx.parsed.value) }
      : null,
  );
  colorUtil("outline", "outline-color");
  fn("outline-offset", (ctx) => {
    const v = spacing(ctx, {});
    return v === null ? null : { "outline-offset": v };
  });

  // ── Эффекты ───────────────────────────────────────────────────────────────
  fn("opacity", (ctx) => {
    const { parsed } = ctx;
    if (!parsed) return null;
    if (parsed.kind === "arbitrary") return { opacity: parsed.value };
    if (!isNumber(parsed.value) || Number(parsed.value) > 100) return null;
    return {
      opacity: String(
        Number.parseFloat((Number(parsed.value) / 100).toFixed(4)),
      ),
    };
  });

  // shadow-1…6, shadow-glass — токены --shadow-ИМЯ из settings/_shadows.scss
  fn("shadow", (ctx) => {
    const { parsed } = ctx;
    if (!parsed || ctx.modifier || ctx.negative) return null;
    if (parsed.kind === "arbitrary") return { "box-shadow": parsed.value };
    const v = theme.shadows.get(parsed.value);
    return v ? { "box-shadow": v } : null;
  });
  add("shadow-none", { "box-shadow": "none" });

  for (const [root, prop] of [
    ["blur", "filter"],
    ["backdrop-blur", "backdrop-filter"],
  ]) {
    fn(root, (ctx) => {
      const { parsed } = ctx;
      if (!parsed) return null;
      if (parsed.value === "none") return { [prop]: "none" };
      const v =
        parsed.kind === "arbitrary" ? parsed.value : length(parsed.value);
      return v === null ? null : { [prop]: `blur(${v})` };
    });
  }

  // ── Переходы (анимаций @keyframes в RenDit нет) ──────────────────────────
  const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
  const TRANSITIONS = {
    "": "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, translate, scale, rotate, filter, backdrop-filter",
    all: "all",
    colors:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform, translate, scale, rotate",
  };
  for (const [k, v] of Object.entries(TRANSITIONS)) {
    add(k ? `transition-${k}` : "transition", {
      "transition-property": v,
      "transition-timing-function": EASE,
      "transition-duration": "150ms",
    });
  }
  add("transition-none", { "transition-property": "none" });
  // свои свойства: transition-[grid-template-rows,opacity] — та же кривая и длительность, что у transition
  fn("transition", (ctx) =>
    ctx.parsed?.kind === "arbitrary" && !ctx.modifier && !ctx.negative
      ? {
          "transition-property": ctx.parsed.value,
          "transition-timing-function": EASE,
          "transition-duration": "150ms",
        }
      : null,
  );
  fn("duration", (ctx) =>
    /^\d+$/.test(ctx.parsed?.value ?? "")
      ? { "transition-duration": `${ctx.parsed.value}ms` }
      : null,
  );
  fn("delay", (ctx) =>
    /^\d+$/.test(ctx.parsed?.value ?? "")
      ? { "transition-delay": `${ctx.parsed.value}ms` }
      : null,
  );
  add("ease-linear", { "transition-timing-function": "linear" });
  add("ease-in", {
    "transition-timing-function": "cubic-bezier(0.4, 0, 1, 1)",
  });
  add("ease-out", {
    "transition-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
  });
  add("ease-in-out", { "transition-timing-function": EASE });
  // ease-spring, ease-spring-bouncy — токены --ease-ИМЯ из settings/_motion.scss
  fn("ease", (ctx) => {
    const { parsed } = ctx;
    if (!parsed || ctx.modifier || ctx.negative) return null;
    const v =
      parsed.kind === "arbitrary"
        ? parsed.value
        : theme.eases.get(parsed.value);
    return v ? { "transition-timing-function": v } : null;
  });

  // ── Трансформации: отдельные свойства translate / scale / rotate ─────────
  // translate-x и translate-y не затирают друг друга: оси хранятся в --rd-tx / --rd-ty
  for (const [axis, varName] of [
    ["x", "--rd-tx"],
    ["y", "--rd-ty"],
  ]) {
    fn(`translate-${axis}`, (ctx) => {
      const v = spacing(ctx, { allowFraction: true, allowFull: true });
      return v === null
        ? null
        : [
            {
              sel: "&",
              decls: [
                [varName, v],
                ["translate", "var(--rd-tx) var(--rd-ty)"],
              ],
            },
          ];
    });
  }
  fn("scale", (ctx) => {
    const { parsed } = ctx;
    if (!parsed) return null;
    const v =
      parsed.kind === "arbitrary"
        ? parsed.value
        : isNumber(parsed.value)
          ? `${parsed.value}%`
          : null;
    return v === null ? null : { scale: ctx.negative ? `calc(${v} * -1)` : v };
  });
  fn("rotate", (ctx) => {
    const { parsed } = ctx;
    if (!parsed) return null;
    const v =
      parsed.kind === "arbitrary"
        ? parsed.value
        : isNumber(parsed.value)
          ? `${parsed.value}deg`
          : null;
    return v === null ? null : { rotate: ctx.negative ? negate(v) : v };
  });
  for (const o of ["center", "top", "bottom", "left", "right"])
    add(`origin-${o}`, { "transform-origin": o });

  // ── Переполнение и прокрутка ──────────────────────────────────────────────
  for (const v of ["auto", "hidden", "clip", "visible", "scroll"]) {
    add(`overflow-${v}`, { overflow: v });
    add(`overflow-x-${v}`, { "overflow-x": v });
    add(`overflow-y-${v}`, { "overflow-y": v });
  }
  for (const v of ["auto", "contain", "none"]) {
    add(`overscroll-${v}`, { "overscroll-behavior": v });
    add(`overscroll-y-${v}`, { "overscroll-behavior-y": v });
  }
  add("scroll-smooth", { "scroll-behavior": "smooth" });
  // отступ при прокрутке к якорю (#section): заголовок не прячется под липкой шапкой
  spacingUtil("scroll-mt", ["scroll-margin-top"]);
  spacingUtil("scroll-pt", ["scroll-padding-top"]);
  add("scrollbar-thin", { "scrollbar-width": "thin" });
  // полоса прокрутки скрыта, прокрутка работает
  add("scrollbar-none", [
    { sel: "&", decls: [["scrollbar-width", "none"]] },
    { sel: "&::-webkit-scrollbar", decls: [["display", "none"]] },
  ]);

  for (const v of ["contain", "cover", "fill", "none", "scale-down"])
    add(`object-${v}`, { "object-fit": v });
  add("object-center", { "object-position": "center" });

  // ── Взаимодействие ────────────────────────────────────────────────────────
  for (const c of [
    "auto",
    "default",
    "pointer",
    "text",
    "move",
    "help",
    "not-allowed",
    "none",
    "grab",
    "grabbing",
    "zoom-in",
  ])
    add(`cursor-${c}`, { cursor: c });
  add("pointer-events-none", { "pointer-events": "none" });
  add("pointer-events-auto", { "pointer-events": "auto" });
  add("select-none", { "user-select": "none" });
  add("select-text", { "user-select": "text" });
  add("select-all", { "user-select": "all" });
  for (const t of ["auto", "none", "manipulation", "pan-x", "pan-y"])
    add(`touch-${t}`, { "touch-action": t });
  add("resize-none", { resize: "none" });
  add("resize-y", { resize: "vertical" });
  add("appearance-none", { appearance: "none" });
  add("field-sizing-content", { "field-sizing": "content" });

  // ── Контейнерные запросы: родитель @container, дети @md:… ─────────────────
  add("@container", { "container-type": "inline-size" });

  // ── Доступность и безопасные зоны ─────────────────────────────────────────
  add("sr-only", {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    "clip-path": "inset(50%)",
    "white-space": "nowrap",
    "border-width": "0",
  });
  add("not-sr-only", {
    position: "static",
    width: "auto",
    height: "auto",
    margin: "0",
    overflow: "visible",
    "clip-path": "none",
    "white-space": "normal",
  });
  // отступы под «чёлку» и полосу жестов (при viewport-fit=cover)
  add("pt-safe", { "padding-top": "env(safe-area-inset-top)" });
  add("pb-safe", { "padding-bottom": "env(safe-area-inset-bottom)" });
  add("pl-safe", { "padding-left": "env(safe-area-inset-left)" });
  add("pr-safe", { "padding-right": "env(safe-area-inset-right)" });

  // ── Псевдоэлементы ────────────────────────────────────────────────────────
  fn("content", (ctx) => {
    const { parsed } = ctx;
    if (parsed?.kind !== "arbitrary") return null;
    return [
      {
        sel: "&",
        decls: [
          ["--rd-content", parsed.value],
          ["content", "var(--rd-content)"],
        ],
      },
    ];
  });
  add("content-none", [
    {
      sel: "&",
      decls: [
        ["--rd-content", "none"],
        ["content", "none"],
      ],
    },
  ]);

  return { statics, functional };
}

// Цвет с прозрачностью: color-mix работает с любым цветом — токеном, hex, oklch
export function withAlpha(value, alpha) {
  return alpha === null
    ? value
    : `color-mix(in oklab, ${value} ${alpha}, transparent)`;
}

// /50 → 50%, /[0.35] → 35%, /[35%] → 35%. undefined — модификатор есть, но неверный.
function parseAlpha(modifier) {
  if (modifier === null || modifier === undefined) return null;
  if (/^\d+(?:\.\d+)?$/.test(modifier))
    return Number(modifier) <= 100 ? `${modifier}%` : undefined;
  if (modifier.startsWith("[") && modifier.endsWith("]")) {
    const v = modifier.slice(1, -1);
    if (/^\d+(?:\.\d+)?%$/.test(v)) return v;
    if (/^0?\.\d+$|^1$/.test(v))
      return `${Number.parseFloat((Number(v) * 100).toFixed(4))}%`;
    if (/^var\(--[\w-]+\)$/.test(v)) return v;
  }
  if (/^\(--[\w-]+\)$/.test(modifier)) return `var${modifier}`;
  return undefined;
}
