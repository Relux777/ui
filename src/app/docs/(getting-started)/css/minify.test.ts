// npm test — сжатие CSS из CSS-конструктора: шапка остаётся, пробелы в значениях не трогаются

import assert from "node:assert/strict";
import { test } from "node:test";
import { minifyCss } from "./minify.ts";

const CSS = `/*! RenDit Code v0.2.0 | шапка, как есть */
@layer utilities {
  /* обычный комментарий */
  .w-\\[calc\\(100\\%-40px\\)\\] {
    width: calc(100% - 40px);
  }
  @media (width >= 770px) {
    .md\\:p-30 {
      padding: 30px;
    }
  }
  :where(.space-x-8 > :not(:last-child)) {
    margin-inline-end: 8px;
  }
}
`;

test("шапка остаётся, обычные комментарии и лишние пробелы уходят", () => {
  const min = minifyCss(CSS);
  assert.ok(min.startsWith("/*! RenDit Code v0.2.0 | шапка, как есть */\n"));
  assert.ok(!min.includes("обычный комментарий"));
  assert.ok(!/\n.*\n/.test(min.trim()), "правила — одной строкой после шапки");
});

test("значения и условия не ломаются", () => {
  const min = minifyCss(CSS);
  assert.ok(min.includes("width: calc(100% - 40px)}"));
  assert.ok(min.includes("@media (width >= 770px){.md\\:p-30{padding: 30px}}"));
  assert.ok(min.includes(":where(.space-x-8>:not(:last-child)){"));
});
