// npm run test:e2e — вкладки «Справки»: по центру шапки на компьютере, в начале страницы на телефоне,
// у каждой вкладки свой layout, страница установки не шире экрана.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, NAV_GLASS, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();

const TABS = 'nav[aria-label="Разделы справки"]';
const HEADER_TABS = `header > nav > ${TABS}`;
const TAB_LINK = (href) => `${TABS} a[href="${href}"]`;
// вкладки в начале страницы (телефон): видимые, не в шапке и не в окне быстрого доступа
const INLINE_TABS = `[...document.querySelectorAll('${TABS}')].find((n) => !n.closest('header, dialog') && n.checkVisibility())`;

const rect = (expr) =>
  `(() => { const r = (${expr}).getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width }; })()`;

describe("вкладки справки", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm([
      "/",
      "/docs",
      "/docs/install",
      "/docs/components",
      "/docs/releases",
    ]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("компьютер: вкладки в шапке по центру, с подписями, только в справке", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/");
    assert.equal(
      await page.eval(`!!document.querySelector('${HEADER_TABS}')`),
      false,
      "на главной вкладок нет",
    );

    await page.goto("/docs/install");
    const box = await page.eval(`(() => {
      const tabs = document.querySelector('${HEADER_TABS}').getBoundingClientRect();
      const nav = document.querySelector('header nav').getBoundingClientRect();
      const labels = [...document.querySelectorAll('${HEADER_TABS} a span')].map((s) => s.getBoundingClientRect().width > 20);
      return { center: tabs.left + tabs.width / 2, navCenter: nav.left + nav.width / 2, labels, height: tabs.height,
        current: document.querySelector('${HEADER_TABS} [aria-current="page"]')?.getAttribute('href') };
    })()`);
    assert.ok(
      Math.abs(box.center - box.navCenter) < 2,
      `по центру шапки: ${JSON.stringify(box)}`,
    );
    assert.deepEqual(box.labels, [true, true, true], "подписи видны");
    assert.ok(box.height <= 40, `тонкая капсула: ${box.height}`);
    assert.equal(box.current, "/docs/install");
    assert.equal(
      await page.eval(`!!(${INLINE_TABS})`),
      false,
      "вкладок в начале страницы на компьютере нет",
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("смена вкладки: свой layout, выбранная вкладка, меню на месте", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/install");
    await sleep(1300);
    const before = await page.eval(rect(NAV_GLASS));
    await page.click(TAB_LINK("/docs/components"));
    await page.waitFor("location.pathname === '/docs/components'");
    await page.waitFor(
      `document.querySelector('${HEADER_TABS} [aria-current="page"]')?.getAttribute('href') === '/docs/components'`,
    );
    const state = await page.eval(`({
      sidebar: [...document.querySelectorAll('nav[aria-label="Документация"]')].some((n) => n.checkVisibility()),
      h1: [...document.querySelectorAll('h1')].find((h) => h.checkVisibility())?.textContent,
    })`);
    assert.equal(state.sidebar, false, "у «Компонентов» нет бокового меню");
    assert.equal(state.h1, "Привет мир");
    const afterNav = await page.eval(rect(NAV_GLASS));
    assert.deepEqual(afterNav, before, "нижнее меню не сдвинулось");

    await page.click(TAB_LINK("/docs/releases"));
    await page.waitFor("location.pathname === '/docs/releases'");
    await page.click(TAB_LINK("/docs/install"));
    await page.waitFor("location.pathname === '/docs/install'");
    await page.waitFor(
      `[...document.querySelectorAll('nav[aria-label="Документация"]')].some((n) => n.checkVisibility())`,
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("переход между вкладками: проявляется только страница, шапка и меню не мигают", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/install");
    await sleep(1300);
    // у узла с display: contents своей коробки нет — прозрачность к нему не применится, страница не проявится
    const rec = await page.sample(
      `({
        pages: [...document.querySelectorAll('.route-enter > *')].filter((el) => el.checkVisibility()).map((el) => {
          const s = getComputedStyle(el);
          return { top: el.getBoundingClientRect().top, display: s.display, opacity: +s.opacity };
        }),
        chrome: Math.min(+getComputedStyle(document.querySelector('header')).opacity,
          +getComputedStyle(document.querySelector('nav[aria-label="Основное меню"]')).opacity),
      })`,
      1200,
    );
    await page.click(TAB_LINK("/docs/components"));
    const frames = (await rec.done()).map((r) => r.v);
    const rows = frames.flatMap((f) => f.pages);
    assert.ok(rows.length > 0);
    for (const r of rows) {
      assert.notEqual(r.display, "contents", JSON.stringify(r));
      assert.ok(r.top > 40, `страница ниже шапки: ${JSON.stringify(r)}`);
    }
    assert.ok(
      rows.some((r) => r.opacity < 0.5),
      "новая вкладка проявляется",
    );
    assert.ok(
      frames.every((f) => f.chrome === 1),
      "шапка и нижнее меню не мигают",
    );
    await page.close();
  });

  test("телефон: вкладки в начале страницы, а не над меню; открыть быстрый доступ — меню не двигается", async () => {
    const page = await browser.page({ width: 375, height: 812, mobile: true });
    await page.goto("/docs/install");
    await sleep(1300);
    const box = await page.eval(`(() => {
      const tabs = (${INLINE_TABS}).getBoundingClientRect();
      const header = document.querySelector('header').getBoundingClientRect();
      return { top: tabs.top, headerBottom: header.bottom, left: tabs.left, right: tabs.right, vw: innerWidth,
        header: getComputedStyle(document.querySelector('${HEADER_TABS}')).display,
        overNav: [...document.querySelectorAll('${TABS}')].some((n) => n.closest('.fixed') && n.checkVisibility()) };
    })()`);
    assert.equal(box.header, "none", "в шапке вкладок на телефоне нет");
    assert.equal(box.overNav, false, "над нижним меню вкладок больше нет");
    assert.ok(
      box.top >= box.headerBottom,
      `под шапкой: ${JSON.stringify(box)}`,
    );
    assert.ok(box.left >= 0 && box.right <= box.vw, "на экране");

    // раньше вкладки над меню поднимались, когда открывали быстрое меню (шрифт, тема)
    const nav = await page.eval(rect(NAV_GLASS));
    await page.tap('button[aria-label="Ещё"]');
    await sleep(800);
    assert.deepEqual(await page.eval(rect(NAV_GLASS)), nav, "меню на месте");

    await page.tap(TAB_LINK("/docs/components"));
    await page.waitFor("location.pathname === '/docs/components'");
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("телефон: страница установки не шире экрана, последний блок не под меню", async () => {
    const page = await browser.page({ width: 375, height: 812, mobile: true });
    await page.goto("/docs/install");
    await sleep(1000);
    assert.equal(
      await page.eval(
        "document.documentElement.scrollWidth > document.documentElement.clientWidth",
      ),
      false,
    );
    await page.eval(
      "scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })",
    );
    await sleep(600);
    const gap = await page.eval(`(() => {
      const last = [...document.querySelectorAll('nav[aria-label="Что дальше"]')].find((n) => n.checkVisibility()).getBoundingClientRect();
      return ${NAV_GLASS}.getBoundingClientRect().top - last.bottom;
    })()`);
    assert.ok(gap >= 0, `последний блок виден над меню: ${gap}`);
    await page.close();
  });

  test("планшет 700px с открытым поиском: вкладки-иконки не наезжают на поле", async () => {
    const page = await browser.page({ width: 700, height: 900 });
    await page.goto("/docs/install");
    await page.click('button[aria-label="Поиск"]');
    await page.waitFor("document.documentElement.hasAttribute('data-search')");
    await sleep(800);
    const r = await page.eval(`(() => {
      const tabs = document.querySelector('${HEADER_TABS}').getBoundingClientRect();
      const search = document.querySelector('header form').getBoundingClientRect();
      const label = document.querySelector('${HEADER_TABS} a span').getBoundingClientRect().width;
      return { tabsRight: tabs.right, searchLeft: search.left, label };
    })()`);
    assert.ok(r.label <= 1, "до 1200px — только иконки");
    assert.ok(r.tabsRight <= r.searchLeft, `не наезжают: ${JSON.stringify(r)}`);
    await page.close();
  });
});
