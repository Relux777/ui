// npm test — страница-образец для HTML без сборки: все её классы есть в готовом CSS, работает как есть

import assert from "node:assert/strict";
import { test } from "node:test";
import { cssOf } from "../../../_docs/class-css-engine.ts";
import { htmlPage, pageClasses } from "./html-page.ts";

test("все классы образца — в готовом CSS", async () => {
  const classes = pageClasses(htmlPage("rendit-ui.min.css"));
  assert.ok(classes.length > 10);
  const css = await cssOf(classes);
  const missing = classes.filter((c) => !css[c].ready);
  assert.deepEqual(missing, [], `нет в готовом CSS: ${missing}`);
});

test("в <head> — кодировка, масштаб, тема до отрисовки, затем стили", () => {
  const html = htmlPage("x.css");
  const head = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
  assert.ok(head.indexOf('charset="utf-8"') < head.indexOf("<script>"));
  assert.ok(head.indexOf("<script>") < head.indexOf('href="x.css"'));
  assert.match(head, /name="viewport"/);
});
