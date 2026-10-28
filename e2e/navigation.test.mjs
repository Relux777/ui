// npm run test:e2e — смена страниц: новая страница проявляется прозрачностью (без View Transitions и без
// накладки цвета фона — блоки не окрашиваются), не сдвигается; постоянные части не мигают; при загрузке
// и перезагрузке страница видна сразу.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, sleep, unavailable, VISIBLE_PAGES, warm } from "./browser.mjs";

const skip = await unavailable();

const NAV_LINK = (href) => `nav[aria-label="Основное меню"] a[href="${href}"]`;

// каждый кадр: видимые верхние узлы страниц — их opacity / transform / filter и псевдоэлемент ::before
const PAGES_STATE = `(() => ({
  path: location.pathname,
  vt: !!document.activeViewTransition,
  pages: ${VISIBLE_PAGES}.map((el) => {
    const s = getComputedStyle(el);
    const b = getComputedStyle(el, '::before');
    return {
      tag: el.tagName.toLowerCase(),
      inDocs: !!el.parentElement.closest('main.route-enter'),
      opacity: +s.opacity, transform: s.transform, filter: s.filter,
      overlay: b.content !== 'none' && b.content !== 'normal',
    };
  }),
}))()`;

// самая прозрачная страница в кадре
const minOpacity = (r) => Math.min(...r.pages.map((p) => p.opacity));

describe("смена страниц", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/", "/docs", "/docs/install", "/docs/components"]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("новая страница проявляется прозрачностью, без накладки и сдвига", async () => {
    const page = await browser.page();
    await page.goto("/");
    await sleep(1300);
    const rec = await page.sample(PAGES_STATE, 1500);
    await page.click(NAV_LINK("/docs/install"));
    const rows = (await rec.done()).map((r) => r.v);
    const docs = rows.filter((r) => r.path === "/docs/install");
    assert.ok(docs.length > 5, "кадры после перехода записаны");
    for (const r of rows) {
      assert.equal(r.vt, false, "без View Transitions");
      for (const p of r.pages) {
        assert.equal(p.overlay, false, `${r.path} ${p.tag}: без накладки`);
        assert.deepEqual(
          { transform: p.transform, filter: p.filter },
          { transform: "none", filter: "none" },
          `${r.path} ${p.tag}: страница не сдвигается и не размывается`,
        );
      }
    }
    const opacity = docs.map(minOpacity);
    assert.ok(opacity[0] < 0.5, `в начале почти прозрачная: ${opacity[0]}`);
    assert.equal(opacity.at(-1), 1);
    for (let i = 1; i < opacity.length; i++)
      assert.ok(
        opacity[i] >= opacity[i - 1] - 1e-6,
        `проявляется без скачков назад: ${opacity}`,
      );
    await page.close();
  });

  test("внутри вкладки «Установка и настройка»: боковое меню не мигает, проявляется только страница", async () => {
    const page = await browser.page();
    await page.goto("/docs");
    await sleep(1300);
    const rec = await page.sample(PAGES_STATE, 1500);
    await page.click(NAV_LINK("/docs/install"));
    const rows = (await rec.done())
      .map((r) => r.v)
      .filter((r) => r.path === "/docs/install");
    assert.ok(rows.length > 5);
    const layout = rows.map((r) => r.pages.find((p) => !p.inDocs)?.opacity);
    assert.ok(
      layout.every((o) => o === 1),
      `раздел (с боковым меню) не мигает: ${layout}`,
    );
    const content = rows.map((r) =>
      Math.min(...r.pages.filter((p) => p.inDocs).map((p) => p.opacity)),
    );
    assert.ok(content[0] < 0.5, `страница проявляется: ${content[0]}`);
    assert.equal(content.at(-1), 1);
    await page.close();
  });

  test("«назад»: прежняя страница возвращается и снова проявляется", async () => {
    const page = await browser.page();
    await page.goto("/");
    await sleep(1300);
    await page.click(NAV_LINK("/docs/install"));
    await page.waitFor("location.pathname === '/docs/install'");
    await sleep(800);
    const rec = await page.sample(PAGES_STATE, 1200);
    await page.eval("history.back()");
    const rows = (await rec.done())
      .map((r) => r.v)
      .filter((r) => r.path === "/");
    assert.ok(rows.length > 3, "вернулись на главную");
    const opacity = rows.map(minOpacity);
    assert.ok(
      Math.min(...opacity) < 0.7,
      `проявилась снова: ${opacity.slice(0, 5)}`,
    );
    assert.equal(opacity.at(-1), 1);
    await page.close();
  });

  test("загрузка и перезагрузка — страница видна сразу; переходы — с проявлением", async () => {
    const page = await browser.page({ theme: "dark" });
    await page.goto("/docs/install");
    // с первого кадра документа: самая прозрачная страница за всю загрузку
    await page.onNewDocument(`window.__min = 1;
      (function tick() {
        for (const el of document.querySelectorAll('.route-enter > *'))
          window.__min = Math.min(window.__min, +getComputedStyle(el).opacity);
        if (performance.now() < 5000) requestAnimationFrame(tick);
      })();`);
    await page.reload();
    await sleep(500);
    assert.equal(
      await page.eval("window.__min"),
      1,
      "при загрузке не проявляется",
    );
    assert.equal(
      await page.eval(
        "document.documentElement.hasAttribute('data-first-load')",
      ),
      true,
    );

    // первое действие снимает data-first-load — показанная страница при этом не мигает
    const OPACITY = `Math.min(...${VISIBLE_PAGES}.map((el) => +getComputedStyle(el).opacity))`;
    let rec = await page.sample(OPACITY, 500);
    await page.click("main h1");
    assert.deepEqual([...new Set((await rec.done()).map((r) => r.v))], [1]);
    assert.equal(
      await page.eval(
        "document.documentElement.hasAttribute('data-first-load')",
      ),
      false,
    );

    // а переход по ссылке — уже с проявлением
    rec = await page.sample(
      `location.pathname === '/' ? ${OPACITY} : null`,
      900,
    );
    await page.click(NAV_LINK("/"));
    const opacity = (await rec.done())
      .map((r) => r.v)
      .filter((v) => v !== null);
    assert.ok(
      Math.min(...opacity) < 0.5,
      `переход проявляется: ${opacity.slice(0, 4)}`,
    );
    assert.equal(opacity.at(-1), 1);
    await page.close();
  });

  test("ссылки страниц работают по клику, без ошибок в консоли", async () => {
    const page = await browser.page();
    await page.goto("/docs");
    await page.click('main a[href="/docs/install"]');
    await page.waitFor("location.pathname === '/docs/install'");
    await page.click(NAV_LINK("/"));
    await page.waitFor("location.pathname === '/'");
    await sleep(500);
    assert.deepEqual(page.errors, []);
    await page.close();
  });
});
