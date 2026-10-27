// npm run test:e2e — шапка: логотип в прокрутке, перезагрузка посреди страницы, поиск.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();

const LOGO = 'header a[href="/"]';
const scrolled = "document.documentElement.hasAttribute('data-scrolled')";

describe("шапка", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/", "/docs", "/docs/install"]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("логотип на главной в прокрутке: плавно наверх, без перехода", async () => {
    const page = await browser.page();
    await page.goto("/");
    await page.wheel(400, 6);
    await sleep(800);
    assert.ok(await page.eval(scrolled), "шапка компактная");
    const rec = await page.sample(
      `({ y: scrollY, vt: !!document.activeViewTransition })`,
      1800,
    );
    await page.click(LOGO);
    const rows = (await rec.done()).map((r) => r.v);
    assert.equal(await page.eval("location.pathname"), "/");
    assert.equal(await page.eval("scrollY"), 0);
    assert.equal(await page.eval(scrolled), false, "шапка развернулась");
    assert.ok(
      rows.every((r) => !r.vt),
      "без смены страницы",
    );
    const ys = new Set(rows.map((r) => Math.round(r.y)));
    assert.ok(
      ys.size > 5,
      `прокрутка плавная, а не скачком: ${ys.size} положений`,
    );
    await page.close();
  });

  test("логотип с другой страницы: главная открывается сверху, шапка разворачивается", async () => {
    const page = await browser.page();
    await page.goto("/docs/install");
    await page.wheel(400, 5);
    await sleep(800);
    assert.ok(await page.eval(scrolled));
    await page.click(LOGO);
    await page.waitFor("location.pathname === '/'");
    await page.waitFor(`scrollY === 0 && !${scrolled}`);
    await page.close();
  });

  test("перезагрузка посреди страницы: шапка компактная сразу, без анимации", async () => {
    const page = await browser.page();
    await page.goto("/");
    await page.wheel(400, 6);
    await sleep(800);
    // ширина таблетки логотипа в каждом нарисованном кадре: либо развёрнутая, либо круг 44px — промежуточных
    // быть не должно. Замер — после отрисовки кадра (setTimeout из rAF): внутри rAF замер мог бы пройти раньше,
    // чем в том же кадре обработчик прокрутки поставит атрибут, и увидеть то, что на экран не попало
    await page.onNewDocument(`window.__hd = []; (() => {
      const t0 = performance.now();
      const tick = () => {
        setTimeout(() => {
          const a = document.querySelector('${LOGO}');
          if (a) window.__hd.push({ y: scrollY, s: ${scrolled}, w: a.getBoundingClientRect().width });
        });
        if (performance.now() - t0 < 1500) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    })();`);
    await page.reload();
    await sleep(1600);
    const rows = await page.eval("window.__hd");
    assert.ok(rows.length > 5);
    const late = rows.filter((r) => r.y > 100);
    assert.ok(late.length > 0, "прокрутка восстановлена");
    assert.deepEqual(
      late.filter((r) => !r.s),
      [],
      "в прокрутке — data-scrolled в каждом кадре",
    );
    const widths = new Set(late.map((r) => Math.round(r.w)));
    assert.deepEqual(
      [...widths],
      [44],
      `только круг 44px, без промежуточных: ${[...widths]}`,
    );
    await page.close();
  });

  test("поиск: «width» — подсказки ширины, Esc закрывает, фокус на лупе, запрос остаётся", async () => {
    const page = await browser.page();
    await page.goto("/");
    await page.click('button[aria-label="Поиск"]');
    await page.waitFor("document.activeElement?.type === 'search'");
    await page.type("width");
    await page.waitFor("!!document.querySelector('[data-show]')");
    const options = await page.eval(
      `[...document.querySelectorAll('[role="option"]')].map((o) => o.querySelector('span span').textContent)`,
    );
    assert.deepEqual(options, ["w-N", "min-w-N", "max-w-N"]);
    await page.key("Escape", "Escape", 27);
    await page.waitFor("!document.documentElement.hasAttribute('data-search')");
    assert.equal(
      await page.eval("document.activeElement?.getAttribute('aria-label')"),
      "Поиск",
    );
    assert.equal(
      await page.eval("document.querySelector('input[type=search]').value"),
      "width",
    );
    await page.close();
  });
});
