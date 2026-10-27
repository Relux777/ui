// Варианты (префиксы) движка Ren: hover:, md:, dark:, group-hover:, data-[state=open]:, [&>svg]: …
//
// Вариант возвращает { rank, sel?, at?, pseudo? }:
//   sel    — шаблон селектора, «&» = селектор, собранный к этому моменту
//   at     — at-правило-обёртка (@media, @container, @supports)
//   pseudo — псевдоэлемент (::before), всегда дописывается в самый конец селектора
//   rank   — место в каскаде. Правила сортируются по рангам вариантов: чем больше ранг,
//            тем ниже правило в CSS и тем оно сильнее. Поэтому md:p-20 всегда перебивает p-10,
//            lg: — md:, active: — hover:, независимо от порядка классов в разметке.

import { decodeArbitrary, splitTopLevel } from "./parser.mjs";

const HOVER_MEDIA = "@media (hover: hover) and (pointer: fine)";

// Порядок важен: что ниже — то сильнее (focus перебивает hover, active — focus, disabled — всё).
const PSEUDO_CLASSES = [
  ["first", ":first-child"],
  ["last", ":last-child"],
  ["only", ":only-child"],
  ["odd", ":nth-child(odd)"],
  ["even", ":nth-child(even)"],
  ["first-of-type", ":first-of-type"],
  ["last-of-type", ":last-of-type"],
  ["only-of-type", ":only-of-type"],
  ["empty", ":empty"],
  ["visited", ":visited"],
  ["target", ":target"],
  ["open", ":is([open], :popover-open)"],
  ["default", ":default"],
  ["checked", ":checked"],
  ["indeterminate", ":indeterminate"],
  ["placeholder-shown", ":placeholder-shown"],
  ["autofill", ":autofill"],
  ["optional", ":optional"],
  ["required", ":required"],
  ["valid", ":valid"],
  ["invalid", ":invalid"],
  ["user-valid", ":user-valid"],
  ["user-invalid", ":user-invalid"],
  ["in-range", ":in-range"],
  ["out-of-range", ":out-of-range"],
  ["read-only", ":read-only"],
  ["focus-within", ":focus-within"],
  ["hover", ":hover"],
  ["focus", ":focus"],
  ["focus-visible", ":focus-visible"],
  ["active", ":active"],
  ["enabled", ":enabled"],
  ["disabled", ":disabled"],
];
const PSEUDO = new Map(
  PSEUDO_CLASSES.map(([name, sel], i) => [name, { sel, i }]),
);

const PSEUDO_ELEMENTS = {
  before: "::before",
  after: "::after",
  placeholder: "::placeholder",
  file: "::file-selector-button",
  marker: "::marker",
  selection: "::selection",
  "first-line": "::first-line",
  "first-letter": "::first-letter",
  backdrop: "::backdrop",
};

const RANK = {
  arbitrary: 5,
  children: 6,
  not: 30,
  group: 40,
  peer: 50,
  pseudo: 100,
  aria: 200,
  data: 210,
  has: 220,
  nth: 230,
  supports: 300,
  media: 400,
  maxScreen: 1000,
  minScreen: 2000,
  maxContainer: 3000,
  minContainer: 4000,
  orientation: 4500,
  dark: 5000,
  print: 5100,
  dir: 5200,
  pseudoElement: 6000,
};

// 770px → 770, 48rem → 768
function toPx(value) {
  const m = /^(\d+(?:\.\d+)?)(px|rem|em)?$/.exec(String(value).trim());
  if (!m) return null;
  return m[2] === "rem" || m[2] === "em" ? Number(m[1]) * 16 : Number(m[1]);
}

// Шкала брейкпоинтов: ранг зависит от ширины, поэтому и min-[500px]: встаёт на своё место
const minRank = (base, w) => base + w / 100000;
const maxRank = (base, w) => base + (100000 - w) / 100000;

function arbitraryBody(input) {
  if (!input.startsWith("[") || !input.endsWith("]")) return null;
  const body = input.slice(1, -1);
  return body ? decodeArbitrary(body) : null;
}

// state=open → [data-state="open"], active → [data-active]
function attribute(prefix, input, bare) {
  if (input.startsWith("[")) {
    const body = arbitraryBody(input);
    if (!body) return null;
    const m = /^([\w-]+)(?:([~|^$*]?=)(.*))?$/.exec(body);
    if (!m) return null;
    if (m[2] === undefined) return `[${prefix}${m[1]}]`;
    const raw = m[3].replace(/^['"]|['"]$/g, "");
    return `[${prefix}${m[1]}${m[2]}"${raw.replace(/"/g, '\\"')}"]`;
  }
  if (!/^[\w-]+$/.test(input)) return null;
  return bare(input);
}

// Все готовые варианты (без произвольных [..]) — для подсказок в редакторе
export function variantNames(config) {
  const pseudo = PSEUDO_CLASSES.map(([n]) => n);
  return [
    ...Object.keys(config.screens),
    ...Object.keys(config.screens).map((s) => `max-${s}`),
    ...pseudo,
    ...Object.keys(PSEUDO_ELEMENTS),
    "dark",
    "touch",
    "mouse",
    "motion-safe",
    "motion-reduce",
    "print",
    "portrait",
    "landscape",
    "ltr",
    "rtl",
    "contrast-more",
    "forced-colors",
    "*",
    ...Object.keys(config.containers).map((c) => `@${c}`),
    ...[
      "hover",
      "focus",
      "focus-visible",
      "focus-within",
      "active",
      "disabled",
      "checked",
    ].flatMap((s) => [`group-${s}`, `peer-${s}`]),
    ...["first", "last", "disabled", "checked", "empty"].map((s) => `not-${s}`),
    ...["checked", "focus", "hover"].map((s) => `has-${s}`),
    ...[
      "expanded",
      "selected",
      "checked",
      "disabled",
      "pressed",
      "current",
    ].map((s) => `aria-${s}`),
  ];
}

export function createVariants(config) {
  const screens = Object.entries(config.screens)
    .map(([name, v]) => [name, toPx(v)])
    .filter(([, v]) => v !== null);
  const containers = Object.entries(config.containers)
    .map(([name, v]) => [name, toPx(v)])
    .filter(([, v]) => v !== null);
  const screenMap = new Map(screens);
  const containerMap = new Map(containers);
  const dark = config.darkSelector;

  const cache = new Map();

  // Состояние для group-*/peer-*/has-*/not-*: hover, checked, [.is-open], [&:nth-child(3)] …
  function stateSelector(input) {
    if (input.startsWith("[")) {
      const body = arbitraryBody(input);
      if (!body) return null;
      return body.includes("&") ? body : `:is(${body})`;
    }
    const p = PSEUDO.get(input);
    return p ? { sel: p.sel, i: p.i, hover: input === "hover" } : null;
  }

  function resolve(name) {
    if (cache.has(name)) return cache.get(name);
    const v = build(name);
    cache.set(name, v);
    return v;
  }

  function build(name) {
    // ── произвольный вариант: [&>svg]:, [&:nth-child(3)]:, [@supports(display:grid)]:
    if (name.startsWith("[") && name.endsWith("]")) {
      const body = arbitraryBody(name);
      if (!body) return null;
      if (body.startsWith("@"))
        return {
          rank: RANK.arbitrary,
          at: body.replace(/^@(media|supports|container)\s*/, "@$1 "),
        };
      if (!body.includes("&")) return null;
      return { rank: RANK.arbitrary, sel: body };
    }

    if (name === "*") return { rank: RANK.children, sel: ":is(& > *)" };

    // ── псевдоклассы
    const pseudo = PSEUDO.get(name);
    if (pseudo) {
      const v = { rank: RANK.pseudo + pseudo.i, sel: `&${pseudo.sel}` };
      if (name === "hover") v.at = HOVER_MEDIA;
      return v;
    }

    // ── псевдоэлементы
    if (name in PSEUDO_ELEMENTS) {
      return {
        rank: RANK.pseudoElement + Object.keys(PSEUDO_ELEMENTS).indexOf(name),
        pseudo: PSEUDO_ELEMENTS[name],
      };
    }

    // ── брейкпоинты: md: (min-width), max-md: (max-width), min-[500px]:, max-[500px]:
    if (screenMap.has(name)) {
      const w = screenMap.get(name);
      return {
        rank: minRank(RANK.minScreen, w),
        at: `@media (width >= ${w}px)`,
      };
    }
    if (name.startsWith("max-")) {
      const key = name.slice(4);
      const w = screenMap.get(key) ?? toPx(arbitraryBody(key) ?? "");
      if (w === null || w === undefined) return null;
      return {
        rank: maxRank(RANK.maxScreen, w),
        at: `@media (width < ${w}px)`,
      };
    }
    if (name.startsWith("min-")) {
      const w = toPx(arbitraryBody(name.slice(4)) ?? "");
      if (w === null) return null;
      return {
        rank: minRank(RANK.minScreen, w),
        at: `@media (width >= ${w}px)`,
      };
    }

    // ── контейнерные запросы: @md:, @max-md:, @[500px]: (родитель с классом @container)
    if (name.startsWith("@")) {
      let key = name.slice(1);
      let isMax = false;
      if (key.startsWith("max-")) {
        isMax = true;
        key = key.slice(4);
      }
      const w = containerMap.get(key) ?? toPx(arbitraryBody(key) ?? "");
      if (w === null || w === undefined) return null;
      return isMax
        ? {
            rank: maxRank(RANK.maxContainer, w),
            at: `@container (width < ${w}px)`,
          }
        : {
            rank: minRank(RANK.minContainer, w),
            at: `@container (width >= ${w}px)`,
          };
    }

    // ── тема, печать, направление, ориентация, предпочтения системы
    if (name === "dark")
      return { rank: RANK.dark, sel: `&:where(${dark}, ${dark} *)` };
    if (name === "print") return { rank: RANK.print, at: "@media print" };
    if (name === "ltr")
      return {
        rank: RANK.dir,
        sel: '&:where(:dir(ltr), [dir="ltr"], [dir="ltr"] *)',
      };
    if (name === "rtl")
      return {
        rank: RANK.dir + 1,
        sel: '&:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)',
      };
    if (name === "portrait")
      return { rank: RANK.orientation, at: "@media (orientation: portrait)" };
    if (name === "landscape")
      return {
        rank: RANK.orientation + 1,
        at: "@media (orientation: landscape)",
      };
    if (name === "motion-safe")
      return {
        rank: RANK.media,
        at: "@media (prefers-reduced-motion: no-preference)",
      };
    if (name === "motion-reduce")
      return {
        rank: RANK.media + 1,
        at: "@media (prefers-reduced-motion: reduce)",
      };
    // touch: — сенсорные экраны (замена .touch-no-blur из ReluxCode: touch:backdrop-blur-none)
    if (name === "touch")
      return { rank: RANK.media + 2, at: "@media (hover: none)" };
    if (name === "mouse")
      return {
        rank: RANK.media + 3,
        at: "@media (hover: hover) and (pointer: fine)",
      };
    if (name === "contrast-more")
      return { rank: RANK.media + 4, at: "@media (prefers-contrast: more)" };
    if (name === "forced-colors")
      return { rank: RANK.media + 5, at: "@media (forced-colors: active)" };

    // ── group-hover:, group-hover/menu:, peer-checked:, group-[.is-open]:
    for (const [kind, combinator] of [
      ["group", " *"],
      ["peer", " ~ *"],
    ]) {
      if (!name.startsWith(`${kind}-`)) continue;
      let rest = name.slice(kind.length + 1);
      let marker = `.${kind}`;
      const parts = splitTopLevel(rest, "/");
      if (parts && parts.length === 2) {
        rest = parts[0];
        if (!/^[\w-]+$/.test(parts[1])) return null;
        marker = `.${kind}\\/${parts[1]}`;
      }
      const state = stateSelector(rest);
      if (!state) return null;
      const stateSel = typeof state === "string" ? state : state.sel;
      const inner = stateSel.includes("&")
        ? stateSel.replaceAll("&", `:where(${marker})`)
        : `:where(${marker})${stateSel}`;
      const v = {
        rank: RANK[kind] + (typeof state === "string" ? 0 : state.i / 1000),
        sel: `&:is(${inner}${combinator})`,
      };
      if (typeof state !== "string" && state.hover) v.at = HOVER_MEDIA;
      return v;
    }

    // ── not-first:, not-[.active]:
    if (name.startsWith("not-")) {
      const state = stateSelector(name.slice(4));
      if (!state || (typeof state === "string" && state.includes("&")))
        return null;
      return {
        rank: RANK.not,
        sel: `&:not(${typeof state === "string" ? state : state.sel})`,
      };
    }

    // ── has-checked:, has-[>img]:
    if (name.startsWith("has-")) {
      const rest = name.slice(4);
      if (rest.startsWith("[")) {
        const body = arbitraryBody(rest);
        return body ? { rank: RANK.has, sel: `&:has(${body})` } : null;
      }
      const p = PSEUDO.get(rest);
      return p
        ? { rank: RANK.has + p.i / 1000, sel: `&:has(*${p.sel})` }
        : null;
    }

    // ── aria-expanded: → [aria-expanded="true"], aria-[sort=asc]:
    if (name.startsWith("aria-")) {
      const sel = attribute(
        "aria-",
        name.slice(5),
        (k) => `[aria-${k}="true"]`,
      );
      return sel ? { rank: RANK.aria, sel: `&${sel}` } : null;
    }

    // ── data-active: → [data-active], data-[state=open]:
    if (name.startsWith("data-")) {
      const sel = attribute("data-", name.slice(5), (k) => `[data-${k}]`);
      return sel ? { rank: RANK.data, sel: `&${sel}` } : null;
    }

    // ── nth-3:, nth-[2n+1]:
    if (name.startsWith("nth-")) {
      const rest = name.slice(4);
      const body = rest.startsWith("[")
        ? arbitraryBody(rest)
        : /^\d+$/.test(rest)
          ? rest
          : null;
      return body ? { rank: RANK.nth, sel: `&:nth-child(${body})` } : null;
    }

    // ── supports-[display:grid]:
    if (name.startsWith("supports-")) {
      const body = arbitraryBody(name.slice(9));
      if (!body) return null;
      return {
        rank: RANK.supports,
        at: `@supports ${body.startsWith("(") ? body : `(${body})`}`,
      };
    }

    return null;
  }

  return { resolve };
}
