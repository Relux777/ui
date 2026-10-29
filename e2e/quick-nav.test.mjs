// npm run test:e2e — два окна-листа. «Быстрый переход» (#quick-nav): кнопка в быстром меню NavBar, только на
// страницах с разделами, в окне — только разделы. «Всё меню» (#site-menu): кружок справа в шапке, вкладки,
// поиск по классам и все страницы справки. На компьютере — панель справа, на телефоне — лист снизу,
// страница под ним размыта. «Меню» нижнего меню — отдельная страница /menu.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, NAV_GLASS, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();

const MORE = 'button[aria-label="Ещё"]';
const QUICK = 'button[aria-label="Быстрый переход"]';
const MENU = 'header button[aria-label="Всё меню"]';
const sheet = (id) => `document.getElementById('${id}')`;
const opened = (id) => `${sheet(id)}?.open === true`;
const closed = (id) => `${sheet(id)}?.open === false`;
// vw — без полосы прокрутки: лист стоит от края страницы, а не окна
const sheetBox = (id) =>
  `(() => { const r = ${sheet(id)}.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, vw: document.documentElement.clientWidth, vh: innerHeight }; })()`;
const parts = `[...${sheet("quick-nav")}.querySelectorAll('ol > li > a')].map((a) => a.textContent.replace(/^\\d+/, '').trim())`;
const quickShown = `!!document.querySelector('${QUICK}')`;

describe("окна быстрого перехода и меню", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm([
      "/",
      "/menu",
      "/docs/install",
      "/docs/components",
      "/docs/scss/width",
    ]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("компьютер: быстрый переход из меню у стрелки — панель справа только с разделами, Esc закрывает", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/install");
    await page.click(MORE);
    await page.waitFor(quickShown);
    await sleep(700);
    await page.click(QUICK);
    await page.waitFor(opened("quick-nav"));
    await sleep(700);
    assert.deepEqual(await page.eval(parts), [
      "Установка",
      "Проверка",
      "Настройка проекта",
      "Что в проекте",
      "Вопросы и ответы",
    ]);
    assert.equal(
      await page.eval(
        `!!${sheet("quick-nav")}.querySelector('nav, input, [role=listbox]')`,
      ),
      false,
      "в окне только разделы: без вкладок, поиска и платформы",
    );
    const box = await page.eval(sheetBox("quick-nav"));
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
    await page.waitFor(closed("quick-nav"));
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("переход к разделу: окно закрывается, страница едет к разделу", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/install");
    await page.click(MORE);
    await page.waitFor(quickShown);
    await sleep(700);
    await page.click(QUICK);
    await page.waitFor(opened("quick-nav"));
    await sleep(600);
    await page.click('#quick-nav a[href="#setup"]');
    await page.waitFor(closed("quick-nav"));
    // заголовок встаёт под шапку с отступом scroll-mt-80 (и не уезжает под неё)
    await page.waitFor(
      "Math.abs(document.getElementById('setup').getBoundingClientRect().top - 80) < 4",
    );
    await page.close();
  });

  test("на странице без разделов кнопки быстрого перехода нет", async () => {
    const page = await browser.page({ width: 1280, height: 800 });
    await page.goto("/menu");
    await page.click(MORE);
    await sleep(800);
    assert.equal(await page.eval(quickShown), false);
    await page.close();
  });

  test("в шапке нет кнопки темы — она в меню у стрелки", async () => {
    const page = await browser.page({ width: 1280, height: 800 });
    await page.goto("/docs/install");
    assert.equal(
      await page.eval(
        `!!document.querySelector('header button[aria-label="Сменить тему"]')`,
      ),
      false,
    );
    await page.close();
  });

  test("телефон: быстрый переход — лист снизу, страница под ним размыта", async () => {
    const page = await browser.page({ width: 375, height: 812, mobile: true });
    await page.goto("/docs/install");
    await sleep(1300);
    await page.tap(MORE);
    await page.waitFor(quickShown);
    await sleep(700);
    await page.tap(QUICK);
    await page.waitFor(opened("quick-nav"));
    await sleep(800);
    const box = await page.eval(sheetBox("quick-nav"));
    assert.ok(
      Math.abs(box.bottom - box.vh) < 2 && box.left === 0,
      JSON.stringify(box),
    );
    assert.match(
      await page.eval(
        `getComputedStyle(${sheet("quick-nav")}, '::backdrop').backdropFilter`,
      ),
      /blur\(8px\)/,
      "страница под листом размыта",
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("компьютер: кружок в шапке — всё меню, поиск по классу и Enter открывают страницу", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/install");
    await page.click(MENU);
    await page.waitFor(opened("site-menu"));
    await sleep(600);
    await page.click("#site-menu input");
    await page.type("w-20");
    await sleep(300);
    assert.equal(
      await page.eval(
        `${sheet("site-menu")}.querySelector('ul a')?.getAttribute('href')`,
      ),
      "/docs/scss/width",
      "первой найдена «Ширина»",
    );
    await page.key("Enter", "Enter", 13, "\r");
    await page.waitFor("location.pathname === '/docs/scss/width'");
    await page.waitFor(closed("site-menu"));
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("телефон: всё меню — лист снизу постоянной высоты, вкладка в листе переводит страницу", async () => {
    const page = await browser.page({ width: 375, height: 812, mobile: true });
    await page.goto("/docs/install");
    await sleep(1300);
    await page.tap(MENU);
    await page.waitFor(opened("site-menu"));
    await sleep(800);
    const box = await page.eval(sheetBox("site-menu"));
    assert.ok(
      Math.abs(box.bottom - box.vh) < 2 && box.left === 0,
      JSON.stringify(box),
    );
    assert.ok(
      Math.abs(box.bottom - box.top - box.vh * 0.85) < 2,
      `85% экрана: ${JSON.stringify(box)}`,
    );
    assert.equal(
      await page.eval(`${NAV_GLASS}.style.getPropertyValue('--nb-i')`),
      "1",
      "линза на «Справке»",
    );
    await page.tap(
      '#site-menu nav[aria-label="Разделы справки"] a[href="/docs/components"]',
    );
    await page.waitFor("location.pathname === '/docs/components'");
    await page.waitFor(closed("site-menu"));
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("«Меню» в нижнем меню ведёт на свою страницу", async () => {
    const page = await browser.page({ width: 375, height: 812, mobile: true });
    await page.goto("/");
    await sleep(1000);
    await page.tap('nav[aria-label="Основное меню"] a[href="/menu"]');
    await page.waitFor("location.pathname === '/menu'");
    assert.equal(
      await page.eval("!!document.querySelector('dialog[open]')"),
      false,
      "окна не открываются",
    );
    assert.equal(
      await page.eval(`${NAV_GLASS}.style.getPropertyValue('--nb-i')`),
      "3",
    );
    await page.close();
  });

  test("на главной — разделы главной", async () => {
    const page = await browser.page({ width: 1280, height: 800 });
    await page.goto("/");
    await page.click(MORE);
    await page.waitFor(quickShown);
    await sleep(700);
    await page.click(QUICK);
    await page.waitFor(opened("quick-nav"));
    const list = await page.eval(parts);
    assert.ok(list.length > 3, `разделы: ${list}`);
    await page.close();
  });
});
