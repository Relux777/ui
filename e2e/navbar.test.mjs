// npm run test:e2e — нижнее меню в настоящем браузере: появление, стекло, переходы, линза, размер шрифта.
// Нужен запущенный сайт (npm run dev); без него тесты пропускаются.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import {
  backdropRootsAbove,
  launch,
  NAV_GLASS,
  sleep,
  unavailable,
  warm,
} from "./browser.mjs";

const skip = await unavailable();
if (skip) console.log(`e2e пропущены: ${skip}`);

const NAV_LINK = (href) => `nav[aria-label="Основное меню"] a[href="${href}"]`;
// вкладка «Справки»: в шапке на компьютере, над меню на телефоне — point() берёт видимую
const TAB_LINK = (href) =>
  `nav[aria-label="Разделы справки"] a[href="${href}"]`;

// с самого начала документа, каждый кадр: где стекло меню и нет ли над ним «корней» размытия
const RECORD_ENTRANCE = `window.__nb = []; (() => {
  const t0 = performance.now();
  const tick = () => {
    const nav = ${NAV_GLASS};
    if (nav) window.__nb.push({ t: performance.now() - t0, top: nav.getBoundingClientRect().top, roots: ${backdropRootsAbove(NAV_GLASS)} });
    if (performance.now() - t0 < 2500) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();`;

async function entrance(page) {
  await sleep(2700);
  const rows = await page.eval("window.__nb");
  return { rows, final: rows.at(-1).top };
}

/** соседние одинаковые значения — одним */
const runs = (values) => values.filter((v, i) => v !== values[i - 1]);

describe("нижнее меню", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/", "/docs", "/docs/install", "/docs/components"]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("при загрузке выезжает снизу, и стекло размывает фон с первого кадра", async () => {
    const page = await browser.page();
    await page.onNewDocument(RECORD_ENTRANCE);
    await page.goto("/");
    const { rows, final } = await entrance(page);
    assert.ok(rows.length > 10, `кадров: ${rows.length}`);
    assert.ok(
      rows[0].top > final + 40,
      `первый кадр ниже: ${rows[0].top} → ${final}`,
    );
    assert.deepEqual(
      rows
        .filter((r) => r.roots.length)
        .map((r) => `${Math.round(r.t)}ms ${r.roots}`),
      [],
      "у предков стекла нет opacity / filter во время появления (иначе блюр включается рывком в конце)",
    );
    assert.ok(
      rows.slice(-5).every((r) => Math.abs(r.top - final) < 0.5),
      "в конце стоит на месте",
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("перезагрузка посреди страницы — меню так же выезжает снизу", async () => {
    const page = await browser.page();
    await page.goto("/");
    await page.wheel(400, 6);
    await sleep(600);
    await page.onNewDocument(RECORD_ENTRANCE);
    await page.reload();
    const { rows, final } = await entrance(page);
    assert.ok(await page.eval("scrollY > 500"), "прокрутка восстановлена");
    assert.ok(
      rows[0].top > final + 40,
      `первый кадр ниже: ${rows[0].top} → ${final}`,
    );
    assert.deepEqual(
      rows.filter((r) => r.roots.length),
      [],
    );
    await page.close();
  });

  test("переходы между страницами не двигают, не прячут и не накрывают меню", async () => {
    const page = await browser.page();
    await page.goto("/");
    await sleep(1300); // появление закончилось
    const rec = await page.sample(
      `(() => {
        const nav = ${NAV_GLASS};
        const r = nav.getBoundingClientRect();
        return {
          top: r.top, left: r.left, width: r.width,
          vt: !!document.activeViewTransition,
          visible: nav.checkVisibility({ opacityProperty: true, visibilityProperty: true }),
          roots: ${backdropRootsAbove(NAV_GLASS)}.length,
          path: location.pathname,
        };
      })()`,
      4200,
    );
    await page.click(NAV_LINK("/docs/install"));
    await sleep(1200);
    // другая вкладка «Справки» — другой layout
    await page.click(TAB_LINK("/docs/components"));
    await sleep(1200);
    await page.click(NAV_LINK("/"));
    const rows = await rec.done();
    assert.deepEqual(runs(rows.map((r) => r.v.path)), [
      "/",
      "/docs/install",
      "/docs/components",
      "/",
    ]);
    const first = rows[0].v;
    for (const { t, v } of rows) {
      const at = `${Math.round(t)}ms ${v.path}`;
      assert.equal(
        v.vt,
        false,
        `${at}: идёт View Transition — снимок страницы накрыл бы меню`,
      );
      assert.equal(v.visible, true, `${at}: меню не видно`);
      assert.equal(v.roots, 0, `${at}: над стеклом «корень» размытия`);
      assert.ok(
        Math.abs(v.top - first.top) < 0.5 &&
          Math.abs(v.left - first.left) < 0.5 &&
          Math.abs(v.width - first.width) < 0.5,
        `${at}: меню сдвинулось ${JSON.stringify(v)}`,
      );
    }
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("линза и aria-current — на пункте текущей страницы", async () => {
    const page = await browser.page();
    await page.goto("/docs/install");
    const state = () =>
      page.eval(`({
        current: document.querySelector('nav[aria-label="Основное меню"] [aria-current="page"]')?.getAttribute('href'),
        lens: ${NAV_GLASS}.style.getPropertyValue('--nb-i'),
      })`);
    assert.deepEqual(await state(), { current: "/docs/install", lens: "1" });
    // «Справка» выбрана во всём разделе, хоть и ведёт на установку
    await page.click(TAB_LINK("/docs/components"));
    await page.waitFor("location.pathname === '/docs/components'");
    assert.deepEqual(await state(), { current: "/docs/install", lens: "1" });
    // переход не через меню (ссылка в шапке) — линза тоже переезжает
    await page.click('header a[href="/"]');
    await page.waitFor("location.pathname === '/'");
    assert.deepEqual(await state(), { current: "/", lens: "0" });
    await page.close();
  });

  test("нажатие на выбранный пункт — как в iOS: в начало раздела, а там — наверх", async () => {
    const page = await browser.page();
    await page.goto("/docs/components");
    await sleep(1300);
    await page.click(NAV_LINK("/docs/install"));
    await page.waitFor("location.pathname === '/docs/install'");
    await page.wheel(400, 6);
    await page.waitFor("scrollY > 1000");
    await page.click(NAV_LINK("/docs/install"));
    await page.waitFor("scrollY === 0");
    assert.equal(await page.eval("location.pathname"), "/docs/install");
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("размер шрифта: подпись внутри панели, цифры 13…18 своим размером, выбор меняет масштаб", async () => {
    const page = await browser.page();
    await page.goto("/");
    await sleep(1300);
    await page.click('button[aria-label="Ещё"]');
    await sleep(700);
    await page.click('button[aria-label^="Размер текста"]');
    await sleep(800);
    const sizes = await page.eval(
      `[...document.querySelectorAll('fieldset button')].map((b) => [b.textContent, getComputedStyle(b).fontSize])`,
    );
    assert.deepEqual(
      sizes,
      [13, 14, 15, 16, 17, 18].map((s) => [String(s), `${s}px`]),
    );
    const legend = await page.eval(`(() => {
      const f = document.querySelector('fieldset').getBoundingClientRect();
      const l = document.querySelector('fieldset legend');
      const r = l.getBoundingClientRect();
      return { text: l.textContent.trim(), inside: r.top >= f.top && r.bottom <= f.bottom && r.left >= f.left && r.right <= f.right };
    })()`);
    assert.deepEqual(legend, {
      text: "Размер шрифта на сайте, px",
      inside: true,
    });

    await page.click('fieldset button[aria-label="17 px"]');
    await page.waitFor(
      `document.documentElement.style.getPropertyValue('--text-scale') !== ''`,
    );
    assert.equal(await page.eval(`localStorage.getItem('text-size')`), "17");
    assert.equal(
      await page.eval(
        `document.querySelector('fieldset button[aria-pressed="true"]').textContent`,
      ),
      "17",
    );
    await page.click('fieldset button[aria-label="14 px"]');
    await page.waitFor(
      `document.documentElement.style.getPropertyValue('--text-scale') === ''`,
    );
    await page.close();
  });

  test("телефон 375px: меню целиком на экране, страница не шире экрана", async () => {
    const page = await browser.page({ width: 375, height: 812, mobile: true });
    await page.goto("/");
    await sleep(1300);
    const box = await page.eval(`(() => {
      const w = ${NAV_GLASS}.parentElement.getBoundingClientRect();
      return { left: w.left, right: w.right, bottom: w.bottom, vw: innerWidth, vh: innerHeight,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth };
    })()`);
    assert.ok(box.left >= 0 && box.right <= box.vw, JSON.stringify(box));
    assert.ok(box.bottom <= box.vh, JSON.stringify(box));
    assert.equal(box.overflow, false);
    await page.close();
  });

  test("телефон: переходы касанием по меню — меню стоит на месте, линза переезжает", async () => {
    const page = await browser.page({ width: 375, height: 812, mobile: true });
    await page.goto("/");
    await sleep(1300);
    const rec = await page.sample(
      `(() => {
        const r = ${NAV_GLASS}.getBoundingClientRect();
        return { top: r.top, left: r.left, vt: !!document.activeViewTransition, path: location.pathname };
      })()`,
      3200,
    );
    await page.tap(NAV_LINK("/docs/install"));
    await page.waitFor("location.pathname === '/docs/install'");
    await sleep(900);
    // вкладка в доке над меню
    await page.tap(TAB_LINK("/docs/components"));
    await page.waitFor("location.pathname === '/docs/components'");
    const rows = await rec.done();
    assert.deepEqual(runs(rows.map((r) => r.v.path)), [
      "/",
      "/docs/install",
      "/docs/components",
    ]);
    const first = rows[0].v;
    for (const { t, v } of rows) {
      assert.equal(v.vt, false, `${Math.round(t)}ms: View Transition`);
      assert.ok(
        Math.abs(v.top - first.top) < 0.5 &&
          Math.abs(v.left - first.left) < 0.5,
        `${Math.round(t)}ms ${v.path}: меню сдвинулось ${JSON.stringify(v)}`,
      );
    }
    assert.equal(
      await page.eval(`${NAV_GLASS}.style.getPropertyValue('--nb-i')`),
      "1",
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });
});
