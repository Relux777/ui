// Разбор класса на части:
//
//   md:hover:!-mt-10/50
//   └┬┘ └─┬─┘│└┬┘└─┬┘└┬┘
//    │    │  │ │   │  └ modifier (прозрачность цвета, знаменатель дроби)
//    │    │  │ │   └ value
//    │    │  │ └ root (определяется позже — по таблице утилит)
//    │    │  └ negative
//    │    └ important (! в начале или в конце)
//    └ variants (слева направо)
//
// Двоеточия, «/» и «-» внутри [...] и (...) не считаются разделителями: w-[calc(100%-10px)], [&>svg]:fill-current.

const MAX_LENGTH = 256;

// Разбивает строку по символу sep на верхнем уровне (вне [...] и (...)).
export function splitTopLevel(input, sep) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "\\") {
      i++;
      continue;
    }
    if (ch === "[" || ch === "(") depth++;
    else if (ch === "]" || ch === ")") {
      depth--;
      if (depth < 0) return null;
    } else if (ch === sep && depth === 0) {
      parts.push(input.slice(start, i));
      start = i + 1;
    }
  }
  if (depth !== 0) return null;
  parts.push(input.slice(start));
  return parts;
}

// Индекс последнего символа ch на верхнем уровне или -1.
function lastTopLevel(input, ch) {
  let depth = 0;
  let found = -1;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth--;
    else if (c === ch && depth === 0) found = i;
  }
  return found;
}

export function parseCandidate(raw) {
  if (!raw || raw.length > MAX_LENGTH) return null;

  const segments = splitTopLevel(raw, ":");
  if (!segments || segments.some((s) => s === "")) return null;

  let base = segments.pop();
  const variants = segments;

  let important = false;
  if (base.startsWith("!")) {
    important = true;
    base = base.slice(1);
  } else if (base.endsWith("!")) {
    important = true;
    base = base.slice(0, -1);
  }

  let negative = false;
  if (base.startsWith("-") && base.length > 1 && base[1] !== "-") {
    negative = true;
    base = base.slice(1);
  }

  let modifier = null;
  const slash = lastTopLevel(base, "/");
  if (slash > 0) {
    modifier = base.slice(slash + 1);
    base = base.slice(0, slash);
    if (!modifier) return null;
  }

  if (!base) return null;

  return { raw, variants, important, negative, base, modifier };
}

// Значение после корня утилиты: «10», «primary», «[calc(100%-10px)]», «(--my-var)», «[length:2px]».
export function parseValue(input) {
  if (input.startsWith("[")) {
    if (!input.endsWith("]")) return null;
    let body = input.slice(1, -1);
    if (!body) return null;

    let hint = null;
    const m = /^([a-z-]+):(?![:=])/.exec(body);
    if (m && TYPE_HINTS.has(m[1])) {
      hint = m[1];
      body = body.slice(m[0].length);
    }
    return { kind: "arbitrary", value: decodeArbitrary(body), hint };
  }

  if (input.startsWith("(")) {
    if (!input.endsWith(")")) return null;
    const body = input.slice(1, -1);
    if (!/^--[\w-]+$/.test(body)) return null;
    return { kind: "arbitrary", value: `var(${body})`, hint: null };
  }

  if (input.includes("[") || input.includes("(")) return null;
  return { kind: "named", value: input };
}

const TYPE_HINTS = new Set([
  "length",
  "color",
  "number",
  "percentage",
  "image",
  "url",
  "position",
  "size",
  "family-name",
  "weight",
  "shadow",
]);

// «_» → пробел (\_ — настоящее подчёркивание), «--x» → var(--x), пробелы вокруг + и - в calc().
// wrapVar: false — для произвольных свойств: [anchor-name:--menu] остаётся именем, а не var(--menu)
export function decodeArbitrary(input, { wrapVar = true } = {}) {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "\\" && input[i + 1] === "_") {
      out += "_";
      i++;
    } else if (ch === "_") {
      out += " ";
    } else {
      out += ch;
    }
  }
  if (wrapVar && /^--[\w-]+$/.test(out)) return `var(${out})`;
  return normalizeMath(out);
}

const MATH_FN = /(?:^|[^\w-])(calc|min|max|clamp|round|mod|rem)\(/;

// Внутри calc/min/max/clamp: «100%-10px» → «100% - 10px». В var(--a-b) и url() ничего не трогаем.
function normalizeMath(value) {
  if (!MATH_FN.test(value)) return value;

  let out = "";
  const stack = []; // для каждой открытой скобки: true — математическая функция
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];

    if (ch === "(") {
      const fn = /([\w-]*)$/.exec(out)[1];
      const inMath = stack.length > 0 && stack[stack.length - 1];
      stack.push(
        ["calc", "min", "max", "clamp", "round", "mod", "rem"].includes(fn) ||
          (fn === "" && inMath),
      );
      out += ch;
      continue;
    }
    if (ch === ")") {
      stack.pop();
      out += ch;
      continue;
    }

    const inMath = stack.length > 0 && stack[stack.length - 1];
    if (inMath && (ch === "+" || ch === "-" || ch === "*" || ch === "/")) {
      const prev = out.trimEnd().slice(-1);
      const next = value[i + 1];
      // бинарный оператор: слева операнд, справа не «-» от переменной (--x) и не пробел
      const leftIsOperand = /[\w%)\].]/.test(prev);
      const isVarDash =
        ch === "-" &&
        (next === "-" || (/[a-z]/i.test(prev) && /[a-z]/i.test(next ?? "")));
      if (leftIsOperand && !isVarDash && /[\w(.-]/.test(next ?? "")) {
        // экспонента 1e-3
        if (!(ch === "-" && /\de$/i.test(out))) {
          out = `${out.trimEnd()} ${ch} `;
          continue;
        }
      }
    }
    out += ch;
  }
  return out.replace(/ {2,}/g, " ");
}
