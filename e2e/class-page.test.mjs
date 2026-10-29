// npm run test:e2e — страница классов на основе движка («Ширина»): таблица «класс → CSS» и конструктор, чей
// пример работает на настоящих классах с CSS от движка (правила вставляются в <style>).

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();

const button = (text) =>
  `[...document.querySelectorAll('#builder ~ * button')].find((b) => b.textContent === '${text}')`;

describe("страница классов", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/docs/scss/width", "/docs/scss/display"]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("таблица: CSS от движка", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/scss/width");
    const rows = await page.eval(
      `Object.fromEntries([...document.querySelectorAll('table tbody tr')].map((tr) => [tr.querySelector('button').childNodes[0].textContent, tr.querySelector('pre').textContent]))`,
    );
    assert.equal(rows["w-240"], "width: 240px;");
    assert.equal(rows["w-1/2"], "width: 50%;");
    assert.equal(rows["size-40"], "width: 40px;\nheight: 40px;");
    await page.close();
  });

  test("CSS конструктора не выходит за пример: max-sm:hidden в шапке работает", async () => {
    const page = await browser.page({ width: 375, height: 812, mobile: true });
    await page.goto("/docs/scss/display");
    await sleep(800);
    // в конструкторе выбран flex — его правило вставлено на страницу; шапка с flex max-sm:hidden не должна ожить
    assert.equal(
      await page.eval(
        `getComputedStyle(document.querySelector('header nav[aria-label="Разделы справки"]')).display`,
      ),
      "none",
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("конструктор: доля родителя — настоящий класс с CSS движка", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/scss/width");
    await sleep(800);
    await page.eval(`${button("Доля")}.click()`);
    await sleep(100);
    await page.eval(`${button("w-1/2")}.click()`);
    await page.eval(`${button("нет")}.click()`); // «не уже чем» — без ограничения
    await sleep(700);
    const r = await page.eval(`(() => {
      const box = document.querySelector('#builder ~ * .bg-blue-500');
      const parent = box.parentElement;
      const cs = getComputedStyle(parent);
      const inner = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return { cls: box.className.includes('w-1/2'), ratio: box.getBoundingClientRect().width / inner };
    })()`);
    assert.ok(r.cls, "у примера класс w-1/2");
    assert.ok(Math.abs(r.ratio - 0.5) < 0.02, `половина родителя: ${r.ratio}`);
    await page.eval(`${button("CSS")}.click()`);
    await sleep(100);
    assert.match(
      await page.eval(
        "document.querySelector('#builder ~ * [role=tabpanel] pre').textContent",
      ),
      /\/\* w-1\/2 \*\/\nwidth: 50%;/,
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });
});
