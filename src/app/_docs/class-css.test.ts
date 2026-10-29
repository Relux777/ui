// npm test — CSS классов для справки (class-css-engine.ts): считает движок, простое правило — одними свойствами

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cssOf as classCss,
  distModules,
  engineData,
  extraCssOf,
  splitCss,
} from "./class-css-engine.ts";

test("простое правило — только свойства", async () => {
  const map = await classCss(["w-20", "w-1/2", "size-40"]);
  assert.equal(map["w-20"].show, "width: 20px;");
  assert.equal(map["w-1/2"].show, "width: 50%;");
  assert.equal(map["size-40"].show, "width: 40px;\nheight: 40px;");
  assert.equal(map["w-20"].rule, ".w-20 {\n  width: 20px;\n}");
  assert.deepEqual(map["w-20"].props, []);
});

test("состояние и экран — правило целиком", async () => {
  const map = await classCss(["hover:bg-primary", "md:flex", "space-x-8"]);
  assert.match(map["hover:bg-primary"].show, /^@media \(hover: hover\)/);
  assert.match(map["md:flex"].show, /^@media \(width >= 770px\)/);
  assert.match(map["space-x-8"].show, /^:where\(\.space-x-8/);
});

test("регистрации @property идут в css, но не в таблицу", () => {
  const out = `/*! баннер */
@property --rd-tx { syntax: "*"; inherits: false; initial-value: 0; }
@layer utilities {
  .translate-x-8 {
    --rd-tx: 8px;
    translate: var(--rd-tx) var(--rd-ty);
  }
}
`;
  const { props, rule, show } = splitCss(out);
  assert.deepEqual(props, [
    '@property --rd-tx { syntax: "*"; inherits: false; initial-value: 0; }',
  ]);
  assert.ok(!rule.includes("@property"));
  assert.equal(show, "--rd-tx: 8px;\ntranslate: var(--rd-tx) var(--rd-ty);");
});

test("опечатка в классе страницы — ошибка сборки", async () => {
  await assert.rejects(classCss(["w-twenty"]), /не знает класс «w-twenty»/);
});

test("ready — класс есть в готовом CSS (dist)", async () => {
  const map = await classCss(["w-20", "w-37"]);
  assert.equal(map["w-20"].ready, true);
  assert.equal(map["w-37"].ready, false);
});

test("движок в браузере собирает тот же CSS, что и на сервере", async () => {
  // данные проходят через JSON — как пропсы с сервера в браузер
  const data = JSON.parse(JSON.stringify(await engineData()));
  const { buildTheme } = await import("../../../rendit-code/core/theme.mjs");
  const { createGenerator } = await import(
    "../../../rendit-code/core/generator.mjs"
  );
  const browser = createGenerator(buildTheme(data), data.config);
  const classes = [
    "w-100",
    "bg-primary/40",
    "md:hover:text-secondary",
    "shadow-3",
    "br-lg",
    "ease-spring",
    "dark:bg-surface",
    "@md:flex-row",
    "font-mono",
  ];
  const server = await classCss(classes);
  for (const cls of classes) {
    assert.ok(browser.isValid(cls), cls);
    assert.equal(
      splitCss(browser.generate([cls]).css).rule,
      server[cls].rule,
      cls,
    );
  }
});

test("CSS недостающих классов — только их, правило в строку", async () => {
  const css = await extraCssOf(["w-20", "w-61", "dark:bg-secondary"]);
  assert.ok(!css.includes(".w-20"), "w-20 есть в готовом CSS");
  assert.match(css, /^ {2}\.w-61 \{ width: 61px; \}$/m);
  assert.match(
    css,
    /\.dark\\:bg-secondary:where\([^)]*\) \{ background-color: var\(--secondary\); \}/,
  );
  assert.equal(await extraCssOf(["w-20"]), "");
});

test("готовый CSS по частям: основа и части, у каждой свои классы", () => {
  const { modules } = distModules();
  assert.equal(modules[0].id, "core");
  assert.ok(modules[0].required);
  const all = modules.flatMap((m) => m.classes);
  assert.equal(new Set(all).size, all.length, "класс — только в одной части");
  assert.ok(modules.every((m) => m.bytes > m.minBytes));
});
