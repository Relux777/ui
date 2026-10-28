// npm run test:e2e — страница установки: выбор платформы и ответов, шаги под набор, ссылка на набор,
// плавные ответы на вопросы; цвет панели браузера по теме сайта с первого кадра.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();

// имена файлов в шапках блоков кода шагов
const FILES = `[...document.querySelectorAll('section:has(#install) ol .truncate')].map((s) => s.textContent)`;
// вопросы, которые сейчас показаны (у остальных строка свёрнута)
const shownRows = `[...document.querySelectorAll('section:has(#install) [data-shown] legend')].map((l) => l.textContent)`;

describe("установка", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm(["/docs/install"]);
    browser = await launch();
  });
  after(() => browser?.close());

  // клик по варианту с текстом
  const pick = async (page, text) => {
    const id = await page.eval(`(() => {
      const label = [...document.querySelectorAll('section:has(#install) label')].find((l) => l.textContent.includes(${JSON.stringify(text)}) && l.checkVisibility());
      if (!label) return null;
      label.id ||= 'pick-' + Math.random().toString(36).slice(2);
      // вариант может быть ниже края экрана — мышь туда не дотянется
      label.scrollIntoView({ block: 'center', behavior: 'instant' });
      return label.id;
    })()`);
    assert.ok(id, `нет варианта «${text}»`);
    await sleep(150);
    await page.click(`#${id}`);
    await sleep(150);
  };

  test("выбор: язык меняет имена файлов, HTML — только вопрос о скриптах, набор в адресе", async () => {
    const page = await browser.page({ width: 1280, height: 900 });
    await page.goto("/docs/install");
    assert.ok((await page.eval(FILES)).includes("src/app/layout.tsx"));
    assert.deepEqual(await page.eval(shownRows), [
      "Язык",
      "Стили",
      "Движок",
      "Редактор",
    ]);
    // с VS Code — шаг с расширением подсказок, без движка вопроса о редакторе нет
    assert.ok(
      await page.eval(
        "document.querySelector('section:has(#install) ol').textContent.includes('rendit-code/vscode/install.mjs')",
      ),
    );
    await pick(page, "Без движка");
    await sleep(600);
    assert.deepEqual(await page.eval(shownRows), ["Язык", "Стили", "Движок"]);
    await pick(page, "RenDit Code");
    await sleep(300);

    await pick(page, "JavaScript");
    await page.waitFor(`${FILES}.includes('src/app/layout.jsx')`);
    assert.match(await page.eval("location.search"), /lang=js/);

    await pick(page, "HTML");
    await sleep(600);
    assert.deepEqual(await page.eval(shownRows), ["Скрипты"]);
    await pick(page, "jQuery");
    await page.waitFor(
      "document.querySelector('section:has(#install) ol').textContent.includes('jquery-3.7.1')",
    );
    assert.equal(await page.eval("location.search"), "?stack=html&js=jquery");

    // ссылкой можно поделиться: тот же набор после перезагрузки
    await page.reload();
    await page.waitFor(
      "document.querySelector('section:has(#install) ol')?.textContent.includes('jquery-3.7.1')",
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("платформа в левом меню меняет шаги установки и запоминается", async () => {
    const page = await browser.page({ width: 1280, height: 900 });
    await page.goto("/docs/install?stack=nextjs");
    await sleep(600);
    await page.click(
      'nav[aria-label="Документация"] button[aria-haspopup="listbox"]',
    );
    await sleep(400);
    await page.click(
      'nav[aria-label="Документация"] [role="option"]:nth-child(2)',
    );
    await page.waitFor(`${FILES}.some((f) => f.startsWith('vite.config'))`);
    assert.match(await page.eval("location.search"), /stack=react/);
    await page.goto("/docs/scss/colors");
    assert.equal(
      await page.eval("localStorage.getItem('docs-platform')"),
      "react",
    );
    // вернуть Next.js — остальным проверкам нужен он
    await page.eval(
      "localStorage.removeItem('docs-platform'); localStorage.removeItem('install-choice')",
    );
    await page.close();
  });

  test("карточка выбора наклоняется за курсором (3D), по ней идёт свет; курсор ушёл — выпрямилась", async () => {
    const page = await browser.page({ width: 1280, height: 900 });
    await page.goto("/docs/install");
    const box = await page.eval(`(() => {
      const el = document.querySelector('.tilt');
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      const r = el.getBoundingClientRect();
      return [r.x, r.y, r.width, r.height];
    })()`);
    await sleep(300);
    const ANGLES = `(() => { const s = document.querySelector('.tilt').style;
      return [parseFloat(s.getPropertyValue('--tilt-x')) || 0, parseFloat(s.getPropertyValue('--tilt-y')) || 0]; })()`;
    // у наклона с перспективой в матрице: [2] — от поворота вокруг вертикали, [6] — вокруг горизонтали
    const MATRIX = `getComputedStyle(document.querySelector('.tilt')).transform.match(/matrix3d\\((.+)\\)/)[1].split(',').map(Number)`;

    // курсор у левого верхнего угла: верх и левый край уходят вглубь
    for (const k of [0, 1, 2])
      await page.send("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        x: box[0] + 30 + k * 5,
        y: box[1] + 30,
      });
    await sleep(900);
    const [x, y] = await page.eval(ANGLES);
    assert.ok(x > 2 && y < -2, `углы: ${x}, ${y}`);
    let m = await page.eval(MATRIX);
    assert.ok(Math.abs(m[2]) > 0.02 && Math.abs(m[6]) > 0.02, `наклон: ${m}`);
    assert.equal(
      await page.eval(
        "document.querySelector('.tilt').hasAttribute('data-spot')",
      ),
      true,
      "свет включён",
    );

    await page.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: 5,
      y: box[1] + box[3] + 60,
    });
    await sleep(1100);
    assert.deepEqual(await page.eval(ANGLES), [0, 0]);
    m = await page.eval(MATRIX);
    assert.ok(
      Math.abs(m[2]) < 1e-3 && Math.abs(m[6]) < 1e-3,
      `выпрямилась: ${m}`,
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("копирование: галочка на пружине и «Скопировано», через пару секунд всё как было", async () => {
    const page = await browser.page({ width: 1280, height: 900 });
    await page.goto("/docs/install");
    // после оживления шаги один раз пересобираются под запомненный набор — ждём, чтобы кнопка не сменилась
    await sleep(600);
    // буфер обмена в браузере без окна — заглушка: запоминаем, что скопировали
    await page.eval(
      "navigator.clipboard.writeText = async (t) => { window.__copied = t; }",
    );
    const button =
      "section:has(#install) ol button[aria-label='Скопировать код']";
    await page.eval(
      `document.querySelector("${button}").scrollIntoView({ block: 'center', behavior: 'instant' })`,
    );
    await sleep(300);
    const state = `(() => {
      const b = document.querySelector('section:has(#install) ol button[aria-label="Скопировано"]');
      if (!b) return null;
      const pill = [...b.querySelectorAll('span')].find((s) => s.textContent === 'Скопировано');
      return { pill: +getComputedStyle(pill).opacity, ring: getComputedStyle(b).boxShadow };
    })()`;
    await page.click(button);
    await sleep(700);
    const shown = await page.eval(state);
    assert.ok(shown, "кнопка сменила подпись");
    assert.ok(shown.pill > 0.9, `«Скопировано» видно: ${shown.pill}`);
    assert.match(shown.ring, /4px/, "кольцо вокруг кнопки");
    assert.ok((await page.eval("window.__copied")).length > 5);
    await sleep(2000);
    assert.equal(await page.eval(state), null, "вернулась обычная кнопка");
    await page.close();
  });

  test("ответы на вопросы открываются и закрываются плавно", async () => {
    const page = await browser.page({ width: 1280, height: 900 });
    await page.goto("/docs/install");
    const summary = "section:has(#faq) details:first-of-type summary";
    await page.eval(
      `document.querySelector('${summary}').scrollIntoView({ block: 'center', behavior: 'instant' })`,
    );
    await sleep(400);
    const height = `document.querySelector('section:has(#faq) details:first-of-type > div').getBoundingClientRect().height`;

    let rec = await page.sample(height, 700);
    await page.click(summary);
    let heights = new Set((await rec.done()).map((r) => Math.round(r.v)));
    assert.ok(heights.size > 4, `открывается плавно: ${[...heights]}`);
    assert.equal(
      await page.eval(
        "document.querySelector('section:has(#faq) details').open",
      ),
      true,
    );

    rec = await page.sample(height, 600);
    await page.click(summary);
    heights = new Set((await rec.done()).map((r) => Math.round(r.v)));
    assert.ok(heights.size > 3, `закрывается плавно: ${[...heights]}`);
    await page.waitFor(
      "document.querySelector('section:has(#faq) details').open === false",
    );
    await page.close();
  });

  test("цвет панели браузера — по теме сайта с первого кадра, а не по теме системы", async () => {
    const page = await browser.page({ width: 390, height: 844, theme: "dark" });
    await page.goto("/docs/install");
    await page.eval("localStorage.setItem('theme', 'light')");
    // браузер берёт первый метатег, чей media подходит (React при оживлении может дописать ещё — ниже)
    await page.onNewDocument(`window.__meta = null; requestAnimationFrame(() => {
      const m = [...document.querySelectorAll('meta[name="theme-color"]')].find((m) => !m.media || matchMedia(m.media).matches);
      window.__meta = m ? m.content : 'нет';
    });`);
    await page.reload();
    await page.waitFor("window.__meta !== null");
    assert.equal(await page.eval("window.__meta"), "#fafafb");
    await page.close();
  });
});
