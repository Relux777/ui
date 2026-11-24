// npm run test:e2e — кнопки «Предыдущая» и «Следующая» внизу страницы: соседи по оглавлению и переход

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();

const pager = (rel) =>
  `document.querySelector('nav[aria-label="Страницы справки"] a[rel="${rel}"]')`;

describe("кнопки страниц", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/docs/scss/scroll", "/docs/scss/forms", "/docs/components"]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("соседи по оглавлению и переход вперёд", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/scss/scroll");
    const labels = await page.eval(`({
      prev: ${pager("prev")}.textContent,
      next: ${pager("next")}.textContent,
      prevHref: ${pager("prev")}.getAttribute("href"),
      nextHref: ${pager("next")}.getAttribute("href"),
    })`);
    assert.match(labels.prev, /Предыдущая[\s\S]*Касание и выделение/);
    assert.match(labels.next, /Следующая[\s\S]*Поля форм/);
    assert.equal(labels.prevHref, "/docs/scss/pointer");
    assert.equal(labels.nextHref, "/docs/scss/forms");

    await page.eval(`${pager("next")}.click()`);
    await page.waitFor("location.pathname === '/docs/scss/forms'");
    await page.waitFor(
      "document.querySelector('h1')?.textContent.includes('Поля форм')",
    );
    assert.match(
      await page.eval("document.querySelector('h1').textContent"),
      /Поля форм/,
    );
    await page.close();
  });

  test("после справки — «Компоненты», их страницы, затем «Обновления»", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components");
    assert.equal(
      await page.eval(`${pager("next")}.getAttribute("href")`),
      "/docs/components/input",
    );
    await page.eval(`${pager("next")}.click()`);
    await page.waitFor("location.pathname === '/docs/components/input'");

    await page.goto("/docs/components/tabs");
    assert.equal(
      await page.eval(`${pager("next")}.getAttribute("href")`),
      "/docs/components/navigation",
    );
    await page.eval(`${pager("next")}.click()`);
    await page.waitFor("location.pathname === '/docs/components/navigation'");

    await page.goto("/docs/components/menu/constructor");
    assert.equal(
      await page.eval(`${pager("next")}.getAttribute("href")`),
      "/docs/components/modal",
    );
    await page.eval(`${pager("next")}.click()`);
    await page.waitFor("location.pathname === '/docs/components/modal'");

    await page.goto("/docs/components/modal/constructor");
    assert.equal(
      await page.eval(`${pager("next")}.getAttribute("href")`),
      "/docs/releases",
    );
    await page.eval(`${pager("next")}.click()`);
    await page.waitFor("location.pathname === '/docs/releases'");
    assert.equal(
      await page.eval(`${pager("prev")}.getAttribute("href")`),
      "/docs/components/modal/constructor",
    );
    await sleep(100);
    assert.deepEqual(page.errors, []);
    await page.close();
  });
});
