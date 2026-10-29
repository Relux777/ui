// npm test — вкладки «Справки»: какая выбрана по адресу

import assert from "node:assert/strict";
import { test } from "node:test";
import { activeTab, DOCS_TABS } from "./tabs.ts";

const at = (id: string) => DOCS_TABS.findIndex((t) => t.id === id);

test("страница вкладки — своя вкладка", () => {
  assert.equal(activeTab("/docs/install"), at("guide"));
  assert.equal(activeTab("/docs/components"), at("components"));
  assert.equal(activeTab("/docs/releases"), at("releases"));
});

test("вложенные страницы — вкладка раздела", () => {
  assert.equal(activeTab("/docs/components/button"), at("components"));
  assert.equal(activeTab("/docs/releases/0.1.0"), at("releases"));
});

test("остальная справка — «Справка»", () => {
  for (const path of ["/docs", "/docs/stacks/react", "/docs/scss/tokens"])
    assert.equal(activeTab(path), at("guide"), path);
});

test("похожий префикс — не совпадение", () => {
  assert.equal(activeTab("/docs/componentsx"), at("guide"));
  assert.equal(activeTab("/docsify"), -1);
});

test("вне справки вкладок нет", () => {
  for (const path of ["/", "/logos", "/header", "/blog"])
    assert.equal(activeTab(path), -1, path);
});
