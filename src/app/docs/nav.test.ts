// npm test — оглавление справки: у каждого пункта есть страница, поиск находит страницу по классу

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { DOCS_NAV, filterDocsNav } from "./_nav.ts";
import { DOCS_STUBS } from "./_stubs.ts";

const hrefs = DOCS_NAV.flatMap((g) => g.links.map((l) => l.href));
const titles = (query: string) =>
  filterDocsNav(query).flatMap((g) => g.links.map((l) => l.title));

// /docs/scss/width → app/docs/(getting-started)/scss/width/page.tsx
const pageFile = (href: string) =>
  new URL(
    `./(getting-started)${href.replace(/^\/docs/, "")}/page.tsx`,
    import.meta.url,
  );

test("у каждого пункта меню есть страница", () => {
  for (const href of hrefs) assert.ok(existsSync(pageFile(href)), href);
});

test("адреса не повторяются", () => {
  assert.equal(new Set(hrefs).size, hrefs.length);
});

test("каждая заготовка — пункт меню", () => {
  for (const href of Object.keys(DOCS_STUBS))
    assert.ok(hrefs.includes(href), href);
});

test("пустой запрос — всё меню", () => {
  assert.equal(filterDocsNav("  "), DOCS_NAV);
});

test("класс со значением находит страницу свойства", () => {
  assert.ok(titles("w-20").includes("Ширина"));
  assert.ok(titles("shadow-7").includes("Тени"));
  assert.ok(titles("hover:bg-red-500").includes("Состояния"));
  assert.ok(titles("max-sm:hidden").includes("Адаптив"));
  assert.ok(titles("br-full").includes("Скругления"));
});

test("начало класса и название тоже находят", () => {
  assert.ok(titles("sha").includes("Тени"));
  assert.ok(titles("ширина").includes("Ширина"));
  assert.ok(titles("Тёмная").includes("Тёмная тема"));
  assert.ok(titles("box-shadow").includes("Тени"));
});

test("w-20 не находит чужие страницы с w- в середине", () => {
  assert.ok(!titles("w-20").includes("Текст"));
});

test("все слова запроса должны совпасть", () => {
  assert.deepEqual(titles("рамки dashed"), ["Рамки"]);
  assert.deepEqual(titles("нет-такого-класса"), []);
});
