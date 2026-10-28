// npm run test:e2e — смена страниц: новая страница проявляется своей накладкой, без View Transitions,
// сама страница не становится прозрачной (стекло внутри неё не ломается), постоянные части не мигают.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, sleep, unavailable, VISIBLE_PAGES, warm } from "./browser.mjs";

const skip = await unavailable();

const NAV_LINK = (href) => `nav[aria-label="Основное меню"] a[href="${href}"]`;

// каждый кадр: видимые верхние узлы страниц — их собственные opacity / transform / filter и накладка ::before
const PAGES_STATE = `(() => ({
  path: location.pathname,
  vt: !!document.activeViewTransition,
  pages: ${VISIBLE_PAGES}.map((el) => {
    const s = getComputedStyle(el);
    const b = getComputedStyle(el, '::before');
    return {
      tag: el.tagName.toLowerCase(),
      inDocs: !!el.parentElement.closest('main.route-enter'),
      opacity: s.opacity, transform: s.transform, filter: s.filter,
      overlay: +b.opacity, overlayVisible: b.visibility === 'visible',
    };
  }),
}))()`;

describe("смена страниц", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/", "/docs", "/docs/install", "/docs/components"]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("новая страница проявляется: тает накладка, сама страница не прозрачная и не сдвинута", async () => {
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
      for (const p of r.pages)
        assert.deepEqual(
          { opacity: p.opacity, transform: p.transform, filter: p.filter },
          { opacity: "1", transform: "none", filter: "none" },
          `${r.path} ${p.tag}: сама страница не должна анимироваться`,
        );
    }
    // накладка: сначала почти сплошная, в конце — невидимая
    const overlay = docs.map((r) => Math.max(...r.pages.map((p) => p.overlay)));
    assert.ok(overlay[0] > 0.5, `в начале накладка плотная: ${overlay[0]}`);
    assert.equal(overlay.at(-1), 0);
    assert.ok(
      docs.at(-1).pages.every((p) => !p.overlayVisible),
      "в конце накладка скрыта (visibility)",
    );
    // тает плавно, без скачков назад
    for (let i = 1; i < overlay.length; i++)
      assert.ok(
        overlay[i] <= overlay[i - 1] + 1e-6,
        `накладка не должна темнеть обратно: ${overlay}`,
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
    const layout = rows.map((r) => r.pages.find((p) => !p.inDocs)?.overlay);
    assert.ok(
      layout.every((o) => o === 0),
      `раздел (с боковым меню) не мигает: ${layout}`,
    );
    const content = rows.map((r) =>
      Math.max(...r.pages.filter((p) => p.inDocs).map((p) => p.overlay)),
    );
    assert.ok(content[0] > 0.5, `страница проявляется: ${content[0]}`);
    assert.equal(content.at(-1), 0);
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
    const overlay = rows.map((r) => Math.max(...r.pages.map((p) => p.overlay)));
    assert.ok(
      Math.max(...overlay) > 0.3,
      `накладка проиграла снова: ${overlay.slice(0, 5)}`,
    );
    assert.equal(overlay.at(-1), 0);
    await page.close();
  });

  test("загрузка и перезагрузка — без накладки: блоки не проявляются «из фона», переходы — с ней", async () => {
    const page = await browser.page({ theme: "dark" });
    await page.goto("/docs/install");
    // с первого кадра документа: самая плотная накладка за всю загрузку
    await page.onNewDocument(`window.__overlay = 0;
      (function tick() {
        for (const el of document.querySelectorAll('.route-enter > *'))
          window.__overlay = Math.max(window.__overlay, +getComputedStyle(el, '::before').opacity);
        if (performance.now() < 5000) requestAnimationFrame(tick);
      })();`);
    await page.reload();
    await sleep(500);
    assert.equal(
      await page.eval("window.__overlay"),
      0,
      "при загрузке накладки нет",
    );
    assert.equal(
      await page.eval(
        "document.documentElement.hasAttribute('data-first-load')",
      ),
      true,
    );

    // первое действие снимает data-first-load — показанная страница при этом не мигает
    const OVERLAY = `Math.max(...${VISIBLE_PAGES}.map((el) => +getComputedStyle(el, '::before').opacity))`;
    let rec = await page.sample(OVERLAY, 500);
    await page.click("main h1");
    assert.deepEqual([...new Set((await rec.done()).map((r) => r.v))], [0]);
    assert.equal(
      await page.eval(
        "document.documentElement.hasAttribute('data-first-load')",
      ),
      false,
    );

    // а переход по ссылке — уже с проявлением
    rec = await page.sample(
      `location.pathname === '/' ? ${OVERLAY} : null`,
      900,
    );
    await page.click(NAV_LINK("/"));
    const overlay = (await rec.done())
      .map((r) => r.v)
      .filter((v) => v !== null);
    assert.ok(
      Math.max(...overlay) > 0.5,
      `переход проявляется: ${overlay.slice(0, 4)}`,
    );
    assert.equal(overlay.at(-1), 0);
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
