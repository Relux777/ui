// Тесты RenDit Code: npm run rendit-code:test

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./core/config.mjs";
import { escapeClass } from "./core/escape.mjs";
import { createGenerator } from "./core/generator.mjs";
import { decodeArbitrary, parseCandidate } from "./core/parser.mjs";
import { extractCandidates } from "./core/scanner.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = await loadConfig(ROOT);
const gen = createGenerator(config.theme, config);

let passed = 0;
const test = (name, fn) => {
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`✖ ${name}\n${err.message}\n`);
    process.exitCode = 1;
  }
};

const decls = (cls) => {
  const item = gen.compile(cls);
  assert.ok(item, `${cls} — не скомпилировался`);
  return Object.fromEntries(item.rules[0].decls);
};
const invalid = (...classes) => {
  for (const c of classes)
    assert.equal(gen.compile(c), null, `${c} не должен быть утилитой`);
};
// порядок классов в итоговом CSS
const order = (...classes) => {
  const { css } = gen.generate(classes);
  const pos = (c) =>
    css.indexOf(`.${escapeClass(c)} `) === -1
      ? css.indexOf(`.${escapeClass(c)}:`)
      : css.indexOf(`.${escapeClass(c)} `);
  return classes.slice().sort((a, b) => pos(a) - pos(b));
};

// ── токены из SCSS ──────────────────────────────────────────────────────────
test("токены: палитра, семантика, тени, скругления, градиенты", () => {
  const t = config.tokenInfo;
  for (const c of [
    "blue-500",
    "gray-950",
    "white",
    "primary",
    "foreground-muted",
    "surface-inverse",
  ])
    assert.ok(t.colors.includes(c), `нет цвета ${c}`);
  assert.ok(!t.colors.includes("shadow-color"), "shadow-color — не цвет");
  for (const s of ["1", "6", "glass", "inset"])
    assert.ok(t.shadows.includes(s), `нет тени ${s}`);
  assert.ok(t.radius.includes("lg"));
  assert.ok(t.gradients.includes("brand"));
  assert.ok(t.eases.includes("spring"));
});

// ── парсер ──────────────────────────────────────────────────────────────────
test("варианты и значения со скобками", () => {
  const p = parseCandidate("md:[&>svg]:hover:!-mt-[calc(1px+2px)]");
  assert.deepEqual(p.variants, ["md", "[&>svg]", "hover"]);
  assert.equal(p.important, true);
  assert.equal(p.negative, true);
  assert.equal(p.base, "mt-[calc(1px+2px)]");
});
test("текст: линия подчёркивания, отступ первой строки, списки, перенос", () => {
  assert.deepEqual(decls("decoration-2"), {
    "text-decoration-thickness": "2px",
  });
  assert.deepEqual(decls("decoration-wavy"), {
    "text-decoration-style": "wavy",
  });
  // цвет линии по-прежнему цветом, а не толщиной
  assert.deepEqual(decls("decoration-secondary"), {
    "text-decoration-color": "var(--secondary)",
  });
  assert.deepEqual(decls("overline"), { "text-decoration-line": "overline" });
  assert.deepEqual(decls("indent-24"), { "text-indent": "24px" });
  assert.deepEqual(decls("list-none"), { "list-style-type": "none" });
  assert.deepEqual(decls("list-inside"), { "list-style-position": "inside" });
  assert.deepEqual(decls("break-normal"), {
    "overflow-wrap": "normal",
    "word-break": "normal",
  });
});

test("модификатор после /", () => {
  assert.equal(parseCandidate("bg-primary/50").modifier, "50");
  assert.equal(parseCandidate("w-[calc(100%/3)]").modifier, null);
});
test("calc: пробелы вокруг операторов, var() не трогаем", () => {
  assert.equal(decodeArbitrary("calc(100%-10px)"), "calc(100% - 10px)");
  assert.equal(
    decodeArbitrary("calc(var(--a-b)*2+1px)"),
    "calc(var(--a-b) * 2 + 1px)",
  );
  assert.equal(
    decodeArbitrary("min(100vw-2rem,600px)"),
    "min(100vw - 2rem,600px)",
  );
  assert.equal(decodeArbitrary("1fr_auto"), "1fr auto");
  assert.equal(decodeArbitrary("--x"), "var(--x)");
});

// ── экранирование ───────────────────────────────────────────────────────────
test("CSS.escape", () => {
  assert.equal(escapeClass("2xl:flex"), "\\32 xl\\:flex");
  assert.equal(escapeClass("w-1/2"), "w-1\\/2");
  assert.equal(escapeClass("bg-[#fff]"), "bg-\\[\\#fff\\]");
});

// ── утилиты ─────────────────────────────────────────────────────────────────
test("отступы в px", () => {
  assert.deepEqual(decls("p-10"), { padding: "10px" });
  assert.deepEqual(decls("-mt-10"), { "margin-top": "-10px" });
  assert.deepEqual(decls("p-1.5rem"), { padding: "1.5rem" });
  assert.deepEqual(decls("-m-[4px]"), { margin: "-4px" });
  invalid("-p-10");
});
test("цвета: токены, палитра, прозрачность", () => {
  assert.deepEqual(decls("bg-primary"), {
    "background-color": "var(--primary)",
  });
  assert.deepEqual(decls("text-blue-500"), { color: "var(--blue-500)" });
  assert.deepEqual(decls("bg-primary/50"), {
    "background-color": "color-mix(in oklab, var(--primary) 50%, transparent)",
  });
  assert.deepEqual(decls("bg-[#fff]/[0.3]"), {
    "background-color": "color-mix(in oklab, #fff 30%, transparent)",
  });
  invalid("bg-unknown-token", "bg-primary-50");
});
test("тени, скругления, градиенты из токенов", () => {
  assert.deepEqual(decls("shadow-3"), { "box-shadow": "var(--shadow-3)" });
  assert.deepEqual(decls("shadow-glass"), {
    "box-shadow": "var(--shadow-glass)",
  });
  assert.deepEqual(decls("br-lg"), { "border-radius": "var(--radius-lg)" });
  assert.deepEqual(decls("br-20"), { "border-radius": "20px" });
  assert.deepEqual(decls("bg-gradient-brand"), {
    "background-image": "var(--gradient-brand)",
  });
  assert.deepEqual(decls("ease-spring"), {
    "transition-timing-function": "var(--ease-spring)",
  });
  invalid("shadow-99", "bg-gradient-nope", "ease-nope");
});
test("защита от CSS-инъекций: свои значения и варианты не выходят из правила", () => {
  invalid(
    "[color:red;}*{color:red]",
    "w-[1px;}body{display:none]",
    "[&{}*]:p-1",
    "[&,body]:hidden", // часть селектора без класса — стилизовала бы чужие элементы
    "[@media(min-width:1px){*{x:y}}]:p-1",
    "content-['</style><script>']",
    "w-[1px/**/]",
    "content-['abc]",
    // «…» — заглушка из текста справки, не CSS: url(…) ломал сборку
    "bg-[url(…)]",
    "w-[…]",
    "[…]:p-1",
  );
  // обычные свои значения и варианты работают как раньше
  assert.deepEqual(decls("[mask-type:alpha]"), { "mask-type": "alpha" });
  assert.deepEqual(decls("content-['→']"), {
    "--rd-content": "'→'",
    content: "var(--rd-content)",
  });
  assert.ok(gen.compile("[&>svg]:size-20"));
  assert.ok(gen.compile("[[data-scrolled]_&]:opacity-0"));
  assert.ok(gen.compile("[&_p,&_li]:mt-4"));
});
test("transition-[свойства]", () => {
  assert.deepEqual(decls("transition-[grid-template-rows,opacity]"), {
    "transition-property": "grid-template-rows,opacity",
    "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
    "transition-duration": "150ms",
  });
  assert.equal(decls("transition")["transition-duration"], "150ms");
  invalid("transition-nope", "-transition-[opacity]");
});
test("неоднозначные корни: text-, font-, border-", () => {
  assert.deepEqual(decls("text-center"), { "text-align": "center" });
  assert.deepEqual(decls("text-[18px]"), { "font-size": "18px" });
  assert.deepEqual(decls("text-[#f00]"), { color: "#f00" });
  // размер текста масштабируется переменной --text-scale (настройка «размер текста» на сайте)
  assert.deepEqual(decls("font-14"), {
    "font-size": "calc(14px * var(--text-scale, 1))",
  });
  assert.deepEqual(decls("font-14/20"), {
    "font-size": "calc(14px * var(--text-scale, 1))",
    "line-height": "calc(20px * var(--text-scale, 1))",
  });
  assert.deepEqual(decls("font-14/1.4"), {
    "font-size": "calc(14px * var(--text-scale, 1))",
    "line-height": "1.4",
  });
  assert.deepEqual(decls("font-w-700"), { "font-weight": "700" });
  assert.deepEqual(decls("font-[600]"), { "font-weight": "600" });
  assert.deepEqual(decls("border-2"), {
    "border-width": "2px",
    "border-style": "solid",
  });
  assert.deepEqual(decls("border-t-primary/20"), {
    "border-top-color": "color-mix(in oklab, var(--primary) 20%, transparent)",
  });
});
test("рамка с одной стороны не включает остальные стороны", () => {
  // border-style: solid у border-b дал бы остальным сторонам ширину по умолчанию — 3px
  assert.deepEqual(decls("border-b"), {
    "border-bottom-width": "1px",
    "border-bottom-style": "solid",
  });
  assert.deepEqual(decls("border-l-2"), {
    "border-left-width": "2px",
    "border-left-style": "solid",
  });
  assert.deepEqual(decls("border-x"), {
    "border-inline-width": "1px",
    "border-inline-style": "solid",
  });
  assert.deepEqual(decls("border-t-[3px]"), {
    "border-top-width": "3px",
    "border-top-style": "solid",
  });
});
test("сетка .row и CSS Grid", () => {
  assert.deepEqual(decls("col-6"), { flex: "0 0 auto", width: "50%" });
  assert.deepEqual(decls("col"), { flex: "1 0 0%", width: "auto" });
  assert.deepEqual(decls("offset-3"), { "margin-inline-start": "25%" });
  assert.deepEqual(decls("gutter-24"), {
    "--gutter-x": "24px",
    "--gutter-y": "24px",
  });
  assert.deepEqual(decls("gutter-x-0"), { "--gutter-x": "0px" });
  assert.deepEqual(decls("grid-cols-3"), {
    "grid-template-columns": "repeat(3, minmax(0, 1fr))",
  });
  assert.deepEqual(decls("grid-fill-240"), {
    "grid-template-columns": "repeat(auto-fill, minmax(min(240px, 100%), 1fr))",
  });
  invalid("col-13", "offset-12");
});
test("размеры, дроби", () => {
  assert.deepEqual(decls("w-1/3"), { width: "33.333333%" });
  assert.deepEqual(decls("h-screen"), { height: "100vh" });
  assert.deepEqual(decls("min-h-dvh"), { "min-height": "100dvh" });
  assert.deepEqual(decls("aspect-16/9"), { "aspect-ratio": "16 / 9" });
});
test("произвольные свойства и important", () => {
  assert.deepEqual(decls("[mask-type:alpha]"), { "mask-type": "alpha" });
  assert.deepEqual(decls("[anchor-name:--lang]"), { "anchor-name": "--lang" });
  assert.deepEqual(decls("[position-area:bottom_span-left]"), {
    "position-area": "bottom span-left",
  });
  assert.deepEqual(decls("!p-0"), { padding: "0 !important" });
  assert.deepEqual(decls("p-0!"), { padding: "0 !important" });
});
test("у каждой вещи одно имя: старые псевдонимы удалены", () => {
  invalid(
    "pd-10",
    "align-center",
    "column",
    "none",
    "wrap",
    "rounded-10",
    "color-primary",
    "t-10",
    "p-events-none",
    "font-bold",
  );
});

// ── варианты ────────────────────────────────────────────────────────────────
test("селекторы вариантов", () => {
  const sel = (c) => gen.compile(c).rules[0].selector;
  assert.equal(sel("hover:p-10"), ".hover\\:p-10:hover");
  assert.equal(
    sel("[&>svg]:hover:fill-current"),
    ".\\[\\&\\>svg\\]\\:hover\\:fill-current>svg:hover",
  );
  assert.equal(
    sel("group-hover/card:opacity-50"),
    ".group-hover\\/card\\:opacity-50:is(:where(.group\\/card):hover *)",
  );
  assert.equal(
    sel("peer-checked:block"),
    ".peer-checked\\:block:is(:where(.peer):checked ~ *)",
  );
  assert.equal(
    sel("data-[state=open]:flex"),
    '.data-\\[state\\=open\\]\\:flex[data-state="open"]',
  );
  assert.equal(
    sel("aria-expanded:flex"),
    '.aria-expanded\\:flex[aria-expanded="true"]',
  );
  assert.equal(
    sel("dark:bg-surface"),
    '.dark\\:bg-surface:where([data-theme="dark"], [data-theme="dark"] *)',
  );
  assert.equal(
    sel("hover:before:block"),
    ".hover\\:before\\:block:hover::before",
  );
  invalid("unknown:p-10");
});
test("hover только для мыши, брейкпоинты mobile-first", () => {
  assert.deepEqual(gen.compile("hover:p-10").at, [
    "@media (hover: hover) and (pointer: fine)",
  ]);
  assert.deepEqual(gen.compile("md:p-10").at, ["@media (width >= 770px)"]);
  assert.deepEqual(gen.compile("max-md:p-10").at, ["@media (width < 770px)"]);
  assert.deepEqual(gen.compile("min-[500px]:p-10").at, [
    "@media (width >= 500px)",
  ]);
  assert.deepEqual(gen.compile("@md:flex").at, ["@container (width >= 448px)"]);
});

// ── каскад ──────────────────────────────────────────────────────────────────
test("развёрнутое свойство после сокращённого", () => {
  assert.deepEqual(order("pt-0", "p-20"), ["p-20", "pt-0"]);
  assert.deepEqual(order("mx-auto", "m-10"), ["m-10", "mx-auto"]);
  assert.deepEqual(order("top-0", "inset-10"), ["inset-10", "top-0"]);
  assert.deepEqual(order("br-tl-0", "br-20"), ["br-20", "br-tl-0"]);
  assert.deepEqual(order("border-primary", "border"), [
    "border",
    "border-primary",
  ]);
});
test("брейкпоинты по возрастанию, max- по убыванию", () => {
  assert.deepEqual(
    order("xl:p-1", "md:p-1", "p-1", "sm:p-1", "min-[800px]:p-1"),
    ["p-1", "sm:p-1", "md:p-1", "min-[800px]:p-1", "xl:p-1"],
  );
  assert.deepEqual(order("max-sm:p-1", "max-xl:p-1", "max-md:p-1"), [
    "max-xl:p-1",
    "max-md:p-1",
    "max-sm:p-1",
  ]);
  assert.deepEqual(order("md:p-1", "max-md:p-2"), ["max-md:p-2", "md:p-1"]);
});
test("состояния: hover < focus < active < disabled", () => {
  assert.deepEqual(
    order("disabled:p-1", "active:p-1", "hover:p-1", "focus:p-1"),
    ["hover:p-1", "focus:p-1", "active:p-1", "disabled:p-1"],
  );
  assert.deepEqual(order("md:p-1", "hover:p-1"), ["hover:p-1", "md:p-1"]);
});
test("порядок стабилен при любом порядке входа", () => {
  const a = gen.generate(["p-1", "md:p-2", "hover:bg-primary", "mt-3"]).css;
  const b = gen.generate(["mt-3", "hover:bg-primary", "md:p-2", "p-1"]).css;
  assert.equal(a, b);
});

// ── сканер ──────────────────────────────────────────────────────────────────
test("сканер достаёт классы из JSX, cn(), шаблонов и объектов", () => {
  const src = `
    <div className="flex md:hover:bg-primary/50 w-[calc(100%-10px)]" />
    <p className={cn("p-10", active && "text-danger", \`gap-\${x} mt-20\`)}>Текст, flex.</p>
    const variants = { size: { sm: "px-10 py-4" } };
    <i className="before:content-['→'] [&>svg]:fill-current" />
  `;
  const found = extractCandidates(src);
  for (const c of [
    "flex",
    "md:hover:bg-primary/50",
    "w-[calc(100%-10px)]",
    "p-10",
    "text-danger",
    "mt-20",
    "px-10",
    "py-4",
    "before:content-['→']",
    "[&>svg]:fill-current",
  ]) {
    assert.ok(found.has(c), `не найден ${c}`);
  }
});

// ── скорость ────────────────────────────────────────────────────────────────
test("скорость: 20 000 классов", () => {
  const big = [];
  const roots = ["p", "m", "gap", "w", "h", "br", "font", "mt", "px"];
  const vars = ["", "md:", "hover:", "lg:hover:", "dark:", "max-sm:"];
  for (let i = 0; i < 20000; i++)
    big.push(`${vars[i % vars.length]}${roots[i % roots.length]}-${i % 400}`);
  const fresh = createGenerator(config.theme, config);
  const t = performance.now();
  fresh.generate(big);
  const cold = performance.now() - t;
  const t2 = performance.now();
  fresh.generate(big);
  const warm = performance.now() - t2;
  console.log(
    `  скорость: холодная ${cold.toFixed(0)} мс, повторная ${warm.toFixed(0)} мс`,
  );
  assert.ok(cold < 2000);
});

console.log(
  process.exitCode ? "Есть ошибки" : `✓ Все тесты пройдены (${passed})`,
);
