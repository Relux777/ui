// npm test — HTML-код переключателя темы: рабочий целиком (иконки, скрипт без модулей), все классы понятны движку

import assert from "node:assert/strict";
import { test } from "node:test";
import { cssOf } from "../../../../_docs/class-css-engine.ts";
import { classesOf, htmlCode, VARIANTS } from "./_switcher-code.ts";

test("16 вариантов: вид × анимация × подписи", () => {
  assert.equal(VARIANTS.length, 16);
  assert.equal(new Set(VARIANTS.map((v) => v.key)).size, 16);
});

test("иконки — настоящие SVG, без заглушек; скрипт — без модулей", () => {
  for (const v of VARIANTS) {
    const html = htmlCode(v.kind, v.animate, v.labels);
    assert.ok(!/<!--/.test(html), `${v.key}: заглушка в разметке`);
    assert.ok(
      !html.includes('type="module"'),
      `${v.key}: модуль не откроется с диска`,
    );
    for (const svg of html.match(/<svg[\s\S]*?<\/svg>/g) ?? [])
      assert.match(svg, /<path d="[^"]{20,}"\/>/, `${v.key}: пустая иконка`);
    assert.match(html, /<script>[\s\S]*applyTheme[\s\S]*<\/script>/);
  }
});

test("все классы HTML-кода понятны движку", async () => {
  const all = [
    ...new Set(
      VARIANTS.flatMap((v) => classesOf(htmlCode(v.kind, v.animate, v.labels))),
    ),
  ];
  assert.ok(all.length > 40);
  await cssOf(all); // неизвестный класс — исключение
});
