// npm run test:e2e — CSS-конструктор («Готовый CSS»): свои классы собирает движок прямо в браузере, классы из
// частей не дублируются, ?add= вписывает классы, под конструкторами страниц классов для HTML — подсказка.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();

const chips = `Object.fromEntries([...document.querySelectorAll('#builder ~ * ul.flex-wrap > li')].map((li) => [li.childNodes[0].textContent, li.className]))`;
const panel = `document.querySelector('#builder ~ * [role=tabpanel] pre').textContent`;
const tab = (title) =>
  `[...document.querySelectorAll('#builder ~ * [role=tab]')].find((b) => b.textContent.startsWith('${title}')).click()`;

describe("CSS-конструктор", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/docs/css", "/docs/scss/width"]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("свои классы: движок в браузере, классы частей не дублируются, опечатки видно", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/css");
    await sleep(800);
    await page.click("#builder ~ * textarea");
    await page.type("w-100 md:p-30 p-16 hello-world");
    await sleep(300);
    const c = await page.eval(chips);
    assert.match(c["w-100"], /text-success/, "w-100 — в свой файл");
    assert.match(c["md:p-30"], /text-success/);
    assert.match(c["p-16"], /text-foreground-muted/, "p-16 уже в «Отступах»");
    assert.match(c["hello-world"], /line-through/, "не класс");
    await page.eval(tab("Свой CSS"));
    await sleep(100);
    const css = await page.eval(panel);
    assert.match(css, /\.w-100\{width: 100px\}/);
    assert.match(
      css,
      /@media \(width >= 770px\)\{\.md\\:p-30\{padding: 30px\}\}/,
    );
    assert.ok(!css.includes("p-16"), "p-16 не дублируется");
    await page.eval(tab("Подключение"));
    await sleep(100);
    const links = await page.eval(panel);
    assert.match(links, /dist\/modules\/rendit-core\.min\.css/);
    assert.match(links, /css\/rendit-custom\.min\.css/);
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("выключенная часть: класс из неё подсвечен, кнопка включает часть", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/css");
    await sleep(800);
    await page.click("#builder ~ * textarea");
    await page.type("bg-pink-500");
    await sleep(300);
    assert.match((await page.eval(chips))["bg-pink-500"], /bg-warning/);
    await page.eval(
      `document.querySelector('#builder ~ * ul.flex-wrap > li button').click()`,
    );
    await sleep(200);
    assert.match(
      (await page.eval(chips))["bg-pink-500"],
      /text-foreground-muted/,
      "палитра включена — класс уже в ней",
    );
    await page.close();
  });

  test("?add= из подсказки вписывает классы", async () => {
    const page = await browser.page({ width: 1280, height: 800 });
    await page.goto(
      `/docs/css?add=${["w-37", "w-[calc(100%+8px)]"].map(encodeURIComponent).join("+")}`,
    );
    await sleep(800);
    assert.equal(
      await page.eval("document.querySelector('#builder ~ * textarea').value"),
      "w-37 w-[calc(100%+8px)]",
    );
    await page.close();
  });

  test("HTML: под конструктором — каких классов нет в готовом CSS и ссылка в конструктор", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/scss/width");
    await page.eval("localStorage.setItem('docs-platform', 'html')");
    await page.reload();
    await sleep(1000);
    // w-240 есть в готовом CSS, max-w-full тоже — подсказки нет
    const none = await page.eval(
      `!!document.querySelector('#builder ~ * a[href^="/docs/css?add="]')`,
    );
    assert.equal(none, false);
    // 640px нет в шкале готового CSS
    await page.eval(`(() => {
      const r = document.querySelector('#builder ~ * input[type=range]');
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      set.call(r, r.max);
      r.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    await sleep(200);
    const href = await page.eval(
      `document.querySelector('#builder ~ * a[href^="/docs/css?add="]')?.getAttribute('href')`,
    );
    assert.equal(href, "/docs/css?add=w-640");
    await page.eval("localStorage.removeItem('docs-platform')");
    await page.close();
  });

  test("HTML: у конструктора текста — та же подсказка (классы готового CSS берёт с сайта)", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/scss/text");
    await page.eval("localStorage.setItem('docs-platform', 'html')");
    await page.reload();
    await page.waitFor(
      `!!document.querySelector('#builder ~ * a[href^="/docs/css?add="]')`,
    );
    const href = await page.eval(
      `document.querySelector('#builder ~ * a[href^="/docs/css?add="]').getAttribute('href')`,
    );
    // font-32/37 (размер со своей высотой строки) в готовом CSS нет
    assert.match(href, /font-32%2F37/);
    // с платформой Next.js подсказки нет: там классы собирает движок
    await page.eval("localStorage.setItem('docs-platform', 'nextjs')");
    await page.reload();
    await sleep(1000);
    assert.equal(
      await page.eval(
        `!!document.querySelector('#builder ~ * a[href^="/docs/css?add="]')`,
      ),
      false,
    );
    await page.eval("localStorage.removeItem('docs-platform')");
    await page.close();
  });
});
