// npm test — кнопки «Предыдущая» и «Следующая»: порядок как в оглавлении, концы без соседа

import assert from "node:assert/strict";
import { test } from "node:test";
import { DOCS_NAV } from "./_nav.ts";
import { docsNeighbors, pagerPages } from "./_pager-data.ts";

const DOCS_PAGES = pagerPages(DOCS_NAV);

test("соседи идут по порядку оглавления", () => {
  assert.deepEqual(docsNeighbors("/docs/install", DOCS_PAGES), {
    prev: { title: "Обзор", href: "/docs" },
    next: { title: "Готовый CSS", href: "/docs/css" },
  });
});

test("у первой страницы нет предыдущей, у последней — следующей", () => {
  assert.equal(docsNeighbors("/docs", DOCS_PAGES).prev, null);
  assert.equal(docsNeighbors("/docs/releases", DOCS_PAGES).next, null);
});

test("после справки — «Компоненты», затем их страницы и «Обновления»", () => {
  assert.deepEqual(docsNeighbors("/docs/components", DOCS_PAGES).next, {
    title: "Кнопка",
    href: "/docs/components/button",
  });
  assert.deepEqual(docsNeighbors("/docs/components/button", DOCS_PAGES).next, {
    title: "Поле ввода",
    href: "/docs/components/input",
  });
  assert.deepEqual(docsNeighbors("/docs/components/input", DOCS_PAGES).next, {
    title: "Конструктор поля",
    href: "/docs/components/input/constructor",
  });
  assert.deepEqual(
    docsNeighbors("/docs/components/input/constructor", DOCS_PAGES).next,
    {
      title: "Выбор",
      href: "/docs/components/select",
    },
  );
  assert.deepEqual(docsNeighbors("/docs/components/select", DOCS_PAGES).next, {
    title: "Конструктор выбора",
    href: "/docs/components/select/constructor",
  });
  assert.deepEqual(
    docsNeighbors("/docs/components/select/constructor", DOCS_PAGES).next,
    {
      title: "Вкладки",
      href: "/docs/components/tabs",
    },
  );
  assert.deepEqual(docsNeighbors("/docs/components/tabs", DOCS_PAGES).next, {
    title: "Навигация",
    href: "/docs/components/navigation",
  });
  assert.deepEqual(
    docsNeighbors("/docs/components/navigation", DOCS_PAGES).next,
    {
      title: "Конструктор навигации",
      href: "/docs/components/navigation/constructor",
    },
  );
  assert.deepEqual(
    docsNeighbors("/docs/components/navigation/constructor", DOCS_PAGES).next,
    {
      title: "Меню",
      href: "/docs/components/menu",
    },
  );
  assert.deepEqual(docsNeighbors("/docs/components/menu", DOCS_PAGES).next, {
    title: "Конструктор меню",
    href: "/docs/components/menu/constructor",
  });
  assert.deepEqual(
    docsNeighbors("/docs/components/menu/constructor", DOCS_PAGES).next,
    {
      title: "Окно",
      href: "/docs/components/modal",
    },
  );
  assert.deepEqual(docsNeighbors("/docs/components/modal", DOCS_PAGES).next, {
    title: "Конструктор окна",
    href: "/docs/components/modal/constructor",
  });
  assert.deepEqual(
    docsNeighbors("/docs/components/modal/constructor", DOCS_PAGES).next,
    {
      title: "Обновления",
      href: "/docs/releases",
    },
  );
});

test("адреса не повторяются, страница вне списка — без кнопок", () => {
  const hrefs = DOCS_PAGES.map((p) => p.href);
  assert.equal(new Set(hrefs).size, hrefs.length);
  assert.deepEqual(docsNeighbors("/docs/нет-такой", DOCS_PAGES), {
    prev: null,
    next: null,
  });
});
