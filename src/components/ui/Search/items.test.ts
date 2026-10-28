// npm test — node:test, TypeScript без сборки (Node 24 сам убирает типы)

import assert from "node:assert/strict";
import { test } from "node:test";
import { searchItems } from "./items.ts";

const titles = (query: string) => searchItems(query).map((i) => i.title);

test("поиск: «width» находит классы ширины", () => {
  assert.deepEqual(titles("width"), ["w-N", "min-w-N", "max-w-N"]);
});

test("поиск: регистр и ё не важны, начало названия — выше", () => {
  assert.deepEqual(titles("ШИРИНА"), ["w-N", "min-w-N", "max-w-N"]);
  assert.equal(titles("max")[0], "max-w-N");
});

test("поиск: пустой запрос — без подсказок", () => {
  assert.deepEqual(searchItems("  "), []);
});
