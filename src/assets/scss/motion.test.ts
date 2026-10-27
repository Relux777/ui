// npm test — правила движения, которые легко сломать незаметно: глазами баг виден только посреди анимации.
// Стили компилируются настоящим sass, разметка читается из исходников.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { compile } from "sass";

const ROOT = join(import.meta.dirname, "../../..");
const SCSS = join(ROOT, "src/assets/scss");
const css = (file: string) =>
  compile(join(ROOT, file), { loadPaths: [SCSS] }).css;
const source = (file: string) => readFileSync(join(ROOT, file), "utf8");

/** тело @keyframes по имени */
function keyframes(text: string, name: string) {
  const start = text.indexOf(`@keyframes ${name} {`);
  assert.ok(start >= 0, `нет @keyframes ${name}`);
  let depth = 0;
  for (let i = text.indexOf("{", start); i < text.length; i++) {
    if (text[i] === "{") depth++;
    if (text[i] === "}" && --depth === 0) return text.slice(start, i + 1);
  }
  throw new Error(`не закрыт @keyframes ${name}`);
}

/** объявления правила с точным селектором */
function rule(text: string, selector: string) {
  const start = text.indexOf(`${selector} {`);
  assert.ok(start >= 0, `нет правила ${selector}`);
  return text.slice(start, text.indexOf("}", start) + 1);
}

// opacity < 1, filter, mask, clip-path, mix-blend-mode у предка делают его «корнем» размытия
// (Filter Effects 2, Backdrop Root) — стекло внутри перестаёт размывать фон, пока они действуют
const BACKDROP_ROOT = /\b(opacity|filter|mask|clip-path|mix-blend-mode)\s*:/;

test("появление нижнего меню — только transform: стекло размывает фон с первого кадра", () => {
  const nav = css("src/components/NavBar/navbar.module.scss");
  for (const name of ["nb-enter", "nb-enter-late"]) {
    const body = keyframes(nav, name);
    assert.doesNotMatch(body, BACKDROP_ROOT, `${name}: ${body}`);
    assert.match(body, /transform\s*:/, name);
  }
});

test("появление меню — @keyframes, а не переход: next-themes и data-instant переходы выключают", () => {
  const nav = css("src/components/NavBar/navbar.module.scss");
  assert.match(rule(nav, ".enter"), /animation:\s*nb-enter /);
  assert.match(rule(nav, ".enterLate"), /animation:\s*nb-enter-late /);
});

test("смена страниц: сама страница не прозрачная и не сдвигается — тает только накладка ::before", () => {
  const ui = css("src/assets/scss/RenDit_UI.scss");
  const page = rule(ui, ".route-enter > *");
  assert.doesNotMatch(page, BACKDROP_ROOT, page);
  assert.doesNotMatch(
    page,
    /\b(transform|translate|scale|animation)\s*:/,
    page,
  );

  const overlay = rule(ui, ".route-enter > *::before");
  assert.match(overlay, /animation:\s*route-enter /);
  assert.match(overlay, /pointer-events:\s*none/);
  // после анимации накладка невидима и не перехватывает касания
  assert.match(overlay, /opacity:\s*0/);
  assert.match(overlay, /visibility:\s*hidden/);
});

test("смена страниц: накладка тает от фона страницы до прозрачной", () => {
  const ui = css("src/assets/scss/RenDit_UI.scss");
  const body = keyframes(ui, "route-enter");
  assert.match(body, /opacity:\s*1/);
  assert.match(
    rule(ui, ".route-enter > *::before"),
    /background:\s*var\(--background\)/,
  );
});

// layout вкладок «Справки» — у каждой свой
const DOCS_TABS_LAYOUTS = [
  "src/app/docs/(getting-started)/layout.tsx",
  "src/app/docs/components/layout.tsx",
  "src/app/docs/releases/layout.tsx",
];

test("без View Transitions: снимки страницы рисуются поверх шапки и меню и ломают их стекло", () => {
  for (const file of [
    "src/app/layout.tsx",
    "src/app/docs/layout.tsx",
    ...DOCS_TABS_LAYOUTS,
    "src/components/Header/index.tsx",
    "src/components/NavBar/index.tsx",
    "src/components/DocsTabs/index.tsx",
  ])
    assert.doesNotMatch(source(file), /ViewTransition|view-transition/, file);
  const ui = css("src/assets/scss/RenDit_UI.scss");
  assert.doesNotMatch(ui, /view-transition-name/);
});

test("контейнеры страниц отмечены .route-enter: корневой layout и вкладки документации", () => {
  assert.match(
    source("src/app/layout.tsx"),
    /<div className="route-enter contents">\{children\}<\/div>/,
  );
  for (const file of DOCS_TABS_LAYOUTS)
    assert.match(source(file), /<main className="route-enter /, file);
});

test("общий layout справки без обёртки: иначе накладка перехода растянулась бы поверх шапки и меню", () => {
  // корни layout вкладок должны быть прямыми детьми .route-enter корневого layout; обёртка с display: contents
  // получила бы ::before c position: absolute от всего документа
  const layout = source("src/app/docs/layout.tsx");
  assert.match(layout, /return \(\s*<>/);
  assert.doesNotMatch(layout, /<div|<main|<section/);
});

test("шапка и меню вне контейнера страниц — их не накрывает накладка перехода", () => {
  const layout = source("src/app/layout.tsx");
  const wrapper = layout.indexOf('<div className="route-enter contents">');
  assert.ok(layout.indexOf("<HeaderComponent />") < wrapper);
  assert.ok(layout.indexOf("<NavBarComponent />") > wrapper);
});

test("появление блоков при прокрутке (.reveal) — только прозрачность, без сдвига", () => {
  // сдвиг блока уводил бы переход по якорю (#раздел) мимо заголовка — под шапку
  const body = keyframes(css("src/assets/scss/RenDit_UI.scss"), "reveal");
  assert.match(body, /opacity\s*:\s*0/);
  assert.doesNotMatch(body, /\b(translate|transform|scale|rotate)\s*:/, body);
});

test("при «уменьшении движения» нет ни появления меню, ни накладки", () => {
  const nav = css("src/components/NavBar/navbar.module.scss");
  const ui = css("src/assets/scss/RenDit_UI.scss");
  assert.match(
    nav,
    /prefers-reduced-motion: reduce\)\s*\{\s*\.enter,\s*\.enterLate\s*\{\s*animation: none/,
  );
  assert.match(
    ui,
    /prefers-reduced-motion: reduce\)\s*\{\s*\.route-enter > \*::before\s*\{\s*animation: none/,
  );
});
