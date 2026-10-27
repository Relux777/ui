// npm run test:e2e — окно быстрого доступа: кнопка в шапке и «Меню» в нижнем меню, разделы страницы,
// на компьютере панель справа, на телефоне лист снизу.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, NAV_GLASS, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();

const BUTTON = 'header button[aria-label="Быстрый переход"]';
const SHEET = "document.querySelector('dialog.sheet')";
const opened = `${SHEET}?.open === true`;
const closed = `${SHEET}?.open === false`;
// vw — без полосы прокрутки: лист стоит от края страницы, а не окна
const sheetBox = `(() => { const r = ${SHEET}.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, vw: document.documentElement.clientWidth, vh: innerHeight }; })()`;
const parts = `[...${SHEET}.querySelectorAll('ol > li > a')].map((a) => a.textContent.replace(/^\\d+/, '').trim())`;

describe("быстрый доступ", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/", "/docs/install", "/docs/components"]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("компьютер: кнопка в шапке открывает панель справа с разделами страницы, Esc закрывает", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/install");
    await page.click(BUTTON);
    await page.waitFor(opened);
    await sleep(700);
    assert.deepEqual(await page.eval(parts), [
      "Установка",
      "Проверка",
      "Настройка проекта",
      "Что в проекте",
      "Если что-то не так",
    ]);
    const box = await page.eval(sheetBox);
    // справа с полем 8px (место под полосой прокрутки остаётся — scrollbar-gutter: stable)
    assert.ok(
      box.right <= box.vw - 8 && box.right >= box.vw - 8 - 20,
      JSON.stringify(box),
    );
    assert.ok(box.top <= 10 && box.bottom >= box.vh - 10, JSON.stringify(box));
    assert.equal(
      await page.eval("getComputedStyle(document.documentElement).overflow"),
      "hidden",
      "страница под окном не прокручивается",
    );
    await page.key("Escape", "Escape", 27);
    await page.waitFor(closed);
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("переход к разделу: окно закрывается, страница едет к разделу", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/install");
    await page.click(BUTTON);
    await page.waitFor(opened);
    await sleep(600);
    await page.click('dialog.sheet a[href="#setup"]');
    await page.waitFor(closed);
    // заголовок встаёт под шапку с отступом scroll-mt-80 (и не уезжает под неё)
    await page.waitFor(
      "Math.abs(document.getElementById('setup').getBoundingClientRect().top - 80) < 4",
    );
    await page.close();
  });

  test("телефон: «Меню» открывает лист снизу, линза остаётся на «Справке», вкладка в листе переводит страницу", async () => {
    const page = await browser.page({ width: 375, height: 812, mobile: true });
    await page.goto("/docs/install");
    await sleep(1300);
    await page.tap(
      'nav[aria-label="Основное меню"] button[aria-haspopup="dialog"]',
    );
    await page.waitFor(opened);
    await sleep(800);
    const box = await page.eval(sheetBox);
    assert.ok(
      Math.abs(box.bottom - box.vh) < 2 && box.left === 0,
      JSON.stringify(box),
    );
    assert.equal(
      await page.eval(`${NAV_GLASS}.style.getPropertyValue('--nb-i')`),
      "1",
      "линза вернулась на «Справку»",
    );
    await page.tap(
      'dialog.sheet nav[aria-label="Разделы справки"] a[href="/docs/components"]',
    );
    await page.waitFor("location.pathname === '/docs/components'");
    await page.waitFor(closed);
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("на главной — разделы главной", async () => {
    const page = await browser.page({ width: 1280, height: 800 });
    await page.goto("/");
    await page.click(BUTTON);
    await page.waitFor(opened);
    const list = await page.eval(parts);
    assert.ok(list.length > 3, `разделы: ${list}`);
    await page.close();
  });
});
