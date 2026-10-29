// npm run test:e2e — левое меню справки: текущая страница видна, поиск по классу, свёрнутые группы запоминаются
// и общие со «всем меню» шапки.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();

// левое меню (справа на странице классов есть ещё оглавление — тоже в <aside>)
const SIDEBAR = 'nav[aria-label="Документация"]';

// ссылка видна: не под платформой и поиском и не за краем меню — в её середине сама ссылка
const reachable = (selector) => `(() => {
  const a = document.querySelector('${selector}');
  if (!a) return false;
  const r = a.getBoundingClientRect();
  return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('a') === a;
})()`;
const groupButton = (scope, title) =>
  `[...document.querySelectorAll('${scope} h2 button, ${scope} h3 button')].find((b) => b.textContent.startsWith('${title}'))`;

describe("левое меню справки", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/docs/scss/width", "/docs/scss/shadows", "/docs/install"]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("текущая страница видна в меню, классы рядом с названием", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/scss/width");
    await sleep(800);
    assert.ok(await page.eval(reachable(`${SIDEBAR} a[aria-current=page]`)));
    assert.equal(
      await page.eval(
        `document.querySelector('${SIDEBAR} a[aria-current=page]').textContent`,
      ),
      "Ширинаw-*",
    );
    await page.close();
  });

  test("поиск по классу: w-20 → «Ширина» видна, Enter открывает «Тени» по shadow-7", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/scss/width");
    await sleep(800);
    await page.click("aside input");
    await page.type("shadow-7");
    await sleep(300);
    assert.equal(
      await page.eval(
        `[...document.querySelectorAll('${SIDEBAR} ul a')].map((a) => a.getAttribute('href')).join()`,
      ),
      "/docs/scss/shadows",
    );
    assert.ok(
      await page.eval(reachable(`${SIDEBAR} a[href="/docs/scss/shadows"]`)),
    );
    await page.key("Enter", "Enter", 13, "\r");
    await page.waitFor("location.pathname === '/docs/scss/shadows'");
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("свёрнутая группа запоминается и свёрнута во «всём меню»", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/install");
    await sleep(800);
    await page.eval(`${groupButton(SIDEBAR, "Эффекты")}.click()`);
    await sleep(500);
    await page.reload();
    await sleep(1000);
    assert.equal(
      await page.eval(
        `${groupButton(SIDEBAR, "Эффекты")}.getAttribute('aria-expanded')`,
      ),
      "false",
    );
    await page.click('header button[aria-label="Всё меню"]');
    await page.waitFor("document.getElementById('site-menu').open");
    assert.equal(
      await page.eval(
        `${groupButton("#site-menu", "Эффекты")}.getAttribute('aria-expanded')`,
      ),
      "false",
    );
    await page.eval("localStorage.removeItem('docs-nav-closed')");
    await page.close();
  });
});
