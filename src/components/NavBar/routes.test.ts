// npm test — node:test, TypeScript без сборки (Node 24 сам убирает типы)

import assert from "node:assert/strict";
import { test } from "node:test";
import { readPercent } from "./read-progress.ts";
import { activeIndex, ROUTES } from "./routes.ts";

const at = (label: string) => ROUTES.findIndex((r) => r.label === label);

test("пункт текущей страницы", () => {
  assert.equal(activeIndex("/"), at("Главная"));
  assert.equal(activeIndex("/docs/install"), at("Справка"));
});

test("«Справка» выбрана во всём разделе /docs, хоть и ведёт на установку", () => {
  for (const path of [
    "/docs",
    "/docs/colors",
    "/docs/components",
    "/docs/releases",
    "/docs/install/nextjs",
  ])
    assert.equal(activeIndex(path), at("Справка"), path);
});

test("похожий префикс — не совпадение", () => {
  // /docsify начинается с /docs, но это другой раздел
  assert.equal(activeIndex("/docsify"), 0);
  assert.equal(activeIndex("/docs/installer"), at("Справка"));
});

test("неизвестная страница — первый пункт", () => {
  assert.equal(activeIndex("/logos"), 0);
});

test("«Блог» выбран во всём /blog", () => {
  for (const path of ["/blog", "/blog/news", "/blog/2026/release"])
    assert.equal(activeIndex(path), at("Блог"), path);
  assert.notEqual(activeIndex("/blogger"), at("Блог"));
});

test("пункт без страницы (Меню) никогда не выбирается адресом", () => {
  for (const path of ["/", "/blog", "/menu", "/docs", "/x"])
    assert.notEqual(activeIndex(path), at("Меню"), path);
});

test("прочитано: 0…100 %, округление, границы", () => {
  assert.equal(readPercent(0, 1000), 0);
  assert.equal(readPercent(500, 1000), 50);
  assert.equal(readPercent(333, 1000), 33);
  assert.equal(readPercent(1000, 1000), 100);
  // инерция на iOS уводит прокрутку за края
  assert.equal(readPercent(-50, 1000), 0);
  assert.equal(readPercent(1200, 1000), 100);
});

test("страница без прокрутки прочитана целиком", () => {
  assert.equal(readPercent(0, 0), 100);
});
