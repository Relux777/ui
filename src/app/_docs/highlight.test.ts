// npm test — подсветка кода в документации

import assert from "node:assert/strict";
import { test } from "node:test";
import { highlight, type Kind, langOf } from "./highlight.ts";

// только подсвеченные куски: [вид, текст]
const marks = (code: string, lang: Parameters<typeof highlight>[1]) =>
  highlight(code, lang)
    .filter((t) => t.kind && t.kind !== "punct")
    .map((t) => [t.kind as Kind, t.text]);

test("текст не теряется: склеенные токены — исходный код", () => {
  const code = `import path from "node:path";\n<button className="p-20">Кнопка</button>`;
  assert.equal(
    highlight(code, "js")
      .map((t) => t.text)
      .join(""),
    code,
  );
});

test("JS и JSX: ключевые слова, строки, теги, атрибуты, вызовы", () => {
  assert.deepEqual(marks(`import path from "node:path";`, "js"), [
    ["keyword", "import"],
    ["keyword", "from"],
    ["string", '"node:path"'],
  ]);
  assert.deepEqual(marks(`<button className="p-20">Кнопка</button>`, "js"), [
    ["tag", "button"],
    ["attr", "className"],
    ["string", '"p-20"'],
    ["tag", "button"],
  ]);
  assert.deepEqual(marks(`loadPaths: [path.join(a)]`, "js"), [
    ["attr", "loadPaths"],
    ["fn", "join"],
  ]);
  assert.deepEqual(marks("// комментарий", "js"), [
    ["comment", "// комментарий"],
  ]);
});

test("JSON: ключи отдельно от строк", () => {
  assert.deepEqual(marks(`"dev": "node rendit-code/cli.mjs dev"`, "json"), [
    ["attr", '"dev"'],
    ["string", '"node rendit-code/cli.mjs dev"'],
  ]);
});

test("SCSS: @-правила, свойства, переменные, селекторы, числа", () => {
  assert.deepEqual(marks(`@use "tools/mixins" as *;`, "css"), [
    ["keyword", "@use"],
    ["string", '"tools/mixins"'],
  ]);
  assert.deepEqual(
    marks(`.panel { padding: 16px; color: var(--primary); }`, "css"),
    [
      ["fn", ".panel"],
      ["attr", "padding"],
      ["number", "16px"],
      ["attr", "color"],
      ["fn", "var"],
      ["attr", "--primary"],
    ],
  );
});

test("HTML: теги, атрибуты, значения", () => {
  assert.deepEqual(marks(`<link rel="stylesheet" href="a.css">`, "html"), [
    ["tag", "link"],
    ["attr", "rel"],
    ["string", '"stylesheet"'],
    ["attr", "href"],
    ["string", '"a.css"'],
  ]);
});

test("терминал: команда в начале строки, флаги, комментарии", () => {
  assert.deepEqual(marks("npm i -D sass", "bash"), [
    ["fn", "npm"],
    ["attr", "-D"],
  ]);
  assert.deepEqual(marks("# комментарий", "bash"), [
    ["comment", "# комментарий"],
  ]);
});

test("язык по имени файла", () => {
  assert.equal(langOf("package.json"), "json");
  assert.equal(langOf("main.scss"), "css");
  assert.equal(langOf("index.html"), "html");
  assert.equal(langOf("next.config.ts"), "js");
  assert.equal(langOf(), "js");
});
