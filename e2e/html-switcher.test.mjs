// npm run test:e2e — HTML-код переключателя темы из справки работает «как пример»: берём код из конструктора
// (платформа HTML/CSS), вставляем в чистую страницу с одним готовым CSS (dist/rendit-ui.min.css), нажимаем.
// Скрипта в <head> нет — код кнопки ставит тему сам.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, test } from "node:test";
import { launch, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();
const DIST = readFileSync(
  new URL("../dist/rendit-ui.min.css", import.meta.url),
  "utf8",
);

const KIND = (title) =>
  `[...document.querySelectorAll('#switcher ~ * button[aria-pressed]')].find((b) => b.textContent === '${title}').click()`;
const CODE = `document.querySelector('#switcher ~ * pre').textContent`;

// код из конструктора → чистая страница того же сайта (localStorage работает), только готовый CSS
async function pageWith(browser, kind) {
  const page = await browser.page({ width: 1280, height: 800 });
  await page.goto("/docs/scss/dark");
  await page.eval("localStorage.setItem('docs-platform', 'html')");
  await page.reload();
  await sleep(900);
  await page.eval(KIND(kind));
  await sleep(200);
  const code = await page.eval(CODE);
  await page.eval("localStorage.clear()");
  const { frameTree } = await page.send("Page.getFrameTree");
  await page.send("Page.setDocumentContent", {
    frameId: frameTree.frame.id,
    html: `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>${DIST}</style></head><body style="padding:40px">${code}</body></html>`,
  });
  await sleep(300);
  return { page, code };
}

const theme = `document.documentElement.getAttribute('data-theme')`;
const style = (sel, prop) =>
  `getComputedStyle(document.querySelector('${sel}')).${prop}`;

describe("HTML-код переключателя темы", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/docs/scss/dark"]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("«Иконка»: тема ставится сама, нажатие — тёмная, видна нужная иконка", async () => {
    const { page, code } = await pageWith(browser, "Иконка");
    assert.match(code, /<svg[^>]*><path d="M12 17\.01/);
    assert.equal(
      await page.eval(theme),
      "light",
      "тема поставлена без скрипта в <head>",
    );
    // в светлой — луна, солнце спрятано
    assert.equal(await page.eval(style("#theme-toggle svg", "opacity")), "0");
    await page.click("#theme-toggle");
    await sleep(800);
    assert.equal(await page.eval(theme), "dark");
    assert.equal(await page.eval("localStorage.getItem('theme')"), "dark");
    assert.equal(await page.eval(style("#theme-toggle svg", "opacity")), "1");
    assert.equal(
      await page.eval(style("#theme-toggle svg:last-child", "opacity")),
      "0",
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("«Ползунок»: aria-checked и бегунок едет", async () => {
    const { page } = await pageWith(browser, "Ползунок");
    await page.click("#theme-toggle");
    await sleep(800);
    assert.equal(await page.eval(theme), "dark");
    assert.equal(
      await page.eval(
        "document.getElementById('theme-toggle').getAttribute('aria-checked')",
      ),
      "true",
    );
    assert.equal(
      await page.eval(style("#theme-toggle span span", "translate")),
      "26px",
      "dark:translate-x-26 — из <style> кода",
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("«Три кнопки»: выбранная отмечена, «Система» — как устройство", async () => {
    const { page } = await pageWith(browser, "Три кнопки");
    await page.click('#theme-modes [data-mode="dark"]');
    await sleep(300);
    assert.equal(await page.eval(theme), "dark");
    assert.equal(
      await page.eval(
        `document.querySelector('#theme-modes [data-mode="dark"]').getAttribute('aria-pressed')`,
      ),
      "true",
    );
    await page.click('#theme-modes [data-mode="system"]');
    await sleep(300);
    assert.equal(await page.eval(theme), "light", "устройство — светлое");
    assert.equal(await page.eval("localStorage.getItem('theme')"), "system");
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("«Список»: меню открывается, выбор закрывает его и меняет тему", async () => {
    const { page } = await pageWith(browser, "Список");
    await page.click("#theme-button");
    await sleep(400);
    assert.equal(
      await page.eval(style("#theme-menu", "visibility")),
      "visible",
    );
    await page.click('#theme-menu [data-mode="dark"]');
    await sleep(500);
    assert.equal(await page.eval(theme), "dark");
    assert.equal(
      await page.eval(
        "document.getElementById('theme-menu').hasAttribute('data-open')",
      ),
      false,
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });
});
