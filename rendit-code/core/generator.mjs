// Генератор: класс → CSS-правила, сортировка для правильного каскада, печать файла.

import { escapeClass } from "./escape.mjs";
import {
  decodeArbitrary,
  parseCandidate,
  parseValue,
  splitTopLevel,
} from "./parser.mjs";
import { propertyIndex } from "./property-order.mjs";
import { createUtilities } from "./utilities.mjs";
import { createVariants } from "./variants.mjs";

// Регистрируемые переменные: не наследуются (translate-x у родителя не сдвигает детей) и имеют начальное значение.
const PROPERTIES = {
  "--rd-tx":
    '@property --rd-tx { syntax: "*"; inherits: false; initial-value: 0; }',
  "--rd-ty":
    '@property --rd-ty { syntax: "*"; inherits: false; initial-value: 0; }',
  "--rd-content":
    '@property --rd-content { syntax: "*"; inherits: false; initial-value: ""; }',
};

// Защита от CSS-инъекций. Свои значения ([…]) и варианты ([&…]:) попадают в CSS как есть, поэтому класс
// из чужого ввода (конструктор, вставленный код) мог бы закрыть правило и дописать в файл любой CSS:
// [color:red;}*{…], [&{}*]:p-1. Запрещено всё, что закрывает или открывает блок ({ } ;), комментарии,
// управляющие символы, «</» и «<!--» (</style> при встраивании CSS в HTML) и незакрытые кавычки.
// Одиночный «<» разрешён — он нужен в @media (width < 620px).
// «…» — заглушка из текста справки (bg-[url(…)], w-[…]), а не CSS: url(…) ломал сборку, остальное — мусор в файле.
// biome-ignore lint/suspicious/noControlCharactersInRegex: управляющие символы и ищем
const UNSAFE = /[{};\u0000-\u001f\u007f…]|\/\*|\*\/|<\/|<!--/;

export function isSafeCss(text) {
  if (UNSAFE.test(text)) return false;
  // кавычки — только парами
  return (
    (text.match(/"/g)?.length ?? 0) % 2 === 0 &&
    (text.match(/'/g)?.length ?? 0) % 2 === 0
  );
}

// Каждая часть списка селекторов должна содержать сам класс: [&,body]:hidden иначе спрятал бы всю страницу
function scopedToClass(selector, cls) {
  const parts = splitTopLevel(selector, ",");
  return parts?.every((s) => s.includes(cls)) ?? false;
}

// Кэш компиляции: в режиме наблюдения в него попадает каждое слово из исходников, поэтому он ограничен
const CACHE_LIMIT = 50_000;

export function createGenerator(theme, config) {
  const { statics, functional } = createUtilities(theme);
  const variants = createVariants(config);
  const cache = new Map();

  // ── Поиск утилиты по базе класса (без вариантов) ───────────────────────────
  function resolveUtility(p) {
    const { base, negative, modifier } = p;

    // [mask-type:alpha] — произвольное свойство
    if (base.startsWith("[") && base.endsWith("]")) {
      if (negative || modifier) return null;
      const m = /^\[(--[\w-]+|-?[a-z][a-z-]*):(.+)\]$/.exec(base);
      if (!m) return null;
      return [
        {
          sel: "&",
          decls: [[m[1], decodeArbitrary(m[2], { wrapVar: false })]],
        },
      ];
    }

    if (!negative && modifier === null && statics.has(base))
      return normalize(statics.get(base));

    // корень может содержать «-» (min-w, gap-x, border-t): пробуем от длинного к короткому,
    // дефисы внутри [...] и (...) не считаются
    const bracket = base.search(/[[(]/);
    const limit = bracket === -1 ? base.length : bracket;
    for (
      let i = base.lastIndexOf("-", limit - 1);
      i > 0;
      i = base.lastIndexOf("-", i - 1)
    ) {
      const handlers = functional.get(base.slice(0, i));
      if (!handlers) continue;
      const raw = base.slice(i + 1);
      if (!raw) continue;
      const ctx = { raw, parsed: parseValue(raw), negative, modifier };
      for (const handler of handlers) {
        const result = handler(ctx);
        if (result) return normalize(result);
      }
    }
    return null;
  }

  // ── Полная компиляция одного класса ────────────────────────────────────────
  function compile(raw) {
    if (cache.has(raw)) return cache.get(raw);
    const result = compileUncached(raw);
    if (cache.size >= CACHE_LIMIT) cache.clear();
    cache.set(raw, result);
    return result;
  }

  function compileUncached(raw) {
    const p = parseCandidate(raw);
    if (!p) return null;

    const rules = resolveUtility(p);
    if (!rules) return null;

    let element = `.${escapeClass(raw)}`;
    const at = [];
    const ranks = [];
    let pseudo = "";

    // варианты применяются слева направо: [&>svg]:hover:x → .x>svg:hover
    for (const name of p.variants) {
      const v = variants.resolve(name);
      if (!v) return null;
      ranks.push(v.rank);
      if (v.sel) {
        const current = element;
        element = v.sel.replaceAll("&", () => current);
      }
      if (v.at) at.push(v.at);
      if (v.pseudo) {
        if (pseudo) return null; // два псевдоэлемента подряд — невалидный CSS
        pseudo = v.pseudo;
      }
    }

    const needsContent = pseudo === "::before" || pseudo === "::after";
    const props = new Set();
    const out = rules.map((r) => {
      let decls = r.decls;
      if (needsContent && !decls.some(([prop]) => prop === "content")) {
        decls = [...decls, ["content", "var(--rd-content)"]];
        props.add("--rd-content");
      }
      if (p.important)
        decls = decls.map(([prop, val]) => [prop, `${val} !important`]);
      for (const [prop, val] of decls) {
        if (prop in PROPERTIES) props.add(prop);
        for (const name of Object.keys(PROPERTIES))
          if (val.includes(`var(${name})`)) props.add(name);
      }
      return { selector: r.sel.replaceAll("&", () => element) + pseudo, decls };
    });

    const cls = `.${escapeClass(raw)}`;
    const safe =
      at.every(isSafeCss) &&
      out.every(
        (r) =>
          isSafeCss(r.selector) &&
          scopedToClass(r.selector, cls) &&
          r.decls.every(([prop, val]) => isSafeCss(prop) && isSafeCss(val)),
      );
    if (!safe) return null;

    ranks.sort((a, b) => b - a);
    const first = out[0].decls[0][0];
    return {
      raw,
      rules: out,
      at,
      atKey: at.join("\u0000"),
      ranks,
      propIndex: propertyIndex(first),
      declCount: out.reduce((n, r) => n + r.decls.length, 0),
      properties: props,
    };
  }

  // ── Генерация файла ────────────────────────────────────────────────────────
  function generate(candidates) {
    const items = [];
    for (const c of candidates) {
      const item = compile(c);
      if (item) items.push(item);
    }
    items.sort(compareItems);

    const usedProps = new Set();
    for (const item of items) for (const p of item.properties) usedProps.add(p);

    const lines = [];
    lines.push(
      `/*! RenDit Code v${config.version} | RenDit UI | сгенерировано из классов в исходниках, не редактировать */`,
    );
    for (const p of Object.keys(PROPERTIES))
      if (usedProps.has(p)) lines.push(PROPERTIES[p]);
    lines.push(`@layer ${config.layer} {`);

    // соседние правила с одинаковыми @media/@container объединяются в один блок
    let i = 0;
    while (i < items.length) {
      const key = items[i].atKey;
      const group = [];
      while (i < items.length && items[i].atKey === key) group.push(items[i++]);

      const depth = group[0].at.length;
      group[0].at.forEach((a, d) => {
        lines.push(`${indent(d + 1)}${a} {`);
      });
      for (const item of group)
        for (const r of item.rules) lines.push(printRule(r, depth + 1));
      for (let d = depth; d > 0; d--) lines.push(`${indent(d)}}`);
    }

    lines.push("}");
    return { css: `${lines.join("\n")}\n`, count: items.length };
  }

  return {
    compile,
    generate,
    isValid: (c) => compile(c) !== null,
    // таблица утилит — для каталога подсказок (rendit-code/core/catalog.mjs)
    utilities: { statics, functional },
  };
}

// Каскад: сначала классы без вариантов, затем по рангам вариантов (наибольший ранг решает),
// внутри одного набора вариантов — по порядку свойств (сокращённые раньше развёрнутых),
// затем больше объявлений раньше, затем по имени — чтобы порядок был стабильным между сборками.
export function compareItems(a, b) {
  const n = Math.max(a.ranks.length, b.ranks.length);
  for (let i = 0; i < n; i++) {
    const ra = a.ranks[i];
    const rb = b.ranks[i];
    if (ra === undefined) return -1;
    if (rb === undefined) return 1;
    if (ra !== rb) return ra - rb;
  }
  if (a.atKey !== b.atKey) return a.atKey < b.atKey ? -1 : 1;
  if (a.propIndex !== b.propIndex) return a.propIndex - b.propIndex;
  if (a.declCount !== b.declCount) return b.declCount - a.declCount;
  return a.raw < b.raw ? -1 : a.raw > b.raw ? 1 : 0;
}

function normalize(result) {
  if (Array.isArray(result)) return result;
  return [{ sel: "&", decls: Object.entries(result) }];
}

const indent = (n) => "  ".repeat(n);

function printRule({ selector, decls }, depth) {
  const pad = indent(depth);
  const body = decls.map(([p, v]) => `${pad}  ${p}: ${v};`).join("\n");
  return `${pad}${selector} {\n${body}\n${pad}}`;
}
