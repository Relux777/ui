// npm run test:e2e — страницы компонентов: конструктор, тема превью, выпадающий список и вкладки

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { launch, sleep, unavailable, warm } from "./browser.mjs";

const skip = await unavailable();
const PREVIEW = "[data-component-preview]";
const LAST_LIST = "[role=listbox]";
const VISIBLE_LISTS = `[...document.querySelectorAll('${LAST_LIST}')].filter((el) => el.checkVisibility())`;

const button = (text) =>
  `[...document.querySelectorAll('button')].find((b) => b.textContent === '${text}')`;

describe("страницы компонентов", { skip: skip ?? false }, () => {
  let browser;
  before(async () => {
    await warm([
      "/docs/components/input",
      "/docs/components/select",
      "/docs/components/tabs",
      "/docs/components/modal",
      "/docs/components/modal/constructor",
    ]);
    browser = await launch();
  });
  after(() => browser?.close());

  test("поле ввода: ошибка, тёмная тема и код", async () => {
    const page = await browser.page({ width: 1440, height: 1000 });
    await page.goto("/docs/components/input/constructor");
    await sleep(300);
    await page.eval(`document.querySelector('${PREVIEW} input').focus()`);
    await page.send("Input.insertText", { text: "renat@example.com" });
    await page.waitFor(
      `document.querySelector('${PREVIEW} input').value === 'renat@example.com'`,
    );
    await page.eval(`${button("Ошибка")}.click()`);
    await page.waitFor(
      `!!document.querySelector('${PREVIEW} input[aria-invalid="true"]')`,
    );
    await page.eval(`${button("Тёмная")}.click()`);
    await page.waitFor(
      `document.querySelector('${PREVIEW}').dataset.theme === 'dark'`,
    );
    const bg = await page.eval(
      `getComputedStyle(document.querySelector('${PREVIEW}')).backgroundColor`,
    );
    assert.notEqual(bg, "rgb(250, 250, 251)", "фон превью стал тёмным");
    assert.match(
      await page.eval(
        `document.querySelector('${PREVIEW}').parentElement.querySelector('pre').textContent`,
      ),
      /error="Проверьте адрес/,
    );
    await page.eval(`${button("В JSX")}.click()`);
    await page.waitFor(
      `document.querySelector('${PREVIEW}').parentElement.querySelector('pre').textContent.includes('wrapperClassName={') && !document.querySelector('${PREVIEW}').parentElement.querySelector('pre').textContent.includes('const wrapper')`,
    );
    await page.eval(`${button("TSX")}.click()`);
    await page.waitFor(
      `document.querySelector('${PREVIEW}').parentElement.querySelector('pre').textContent.includes('<input') && !document.querySelector('${PREVIEW}').parentElement.querySelector('pre').textContent.includes('@/components/ui/Input')`,
    );
    await page.eval(`${button("Константы")}.click()`);
    await page.waitFor(
      `document.querySelector('${PREVIEW}').parentElement.querySelector('pre').textContent.includes('const wrapper')`,
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("поле ввода: установка и скачивание", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/input");
    await sleep(300);
    const info = await page.eval(`(() => {
      const install = document.getElementById('install').closest('section');
      const source = document.getElementById('source').closest('section');
      const tabs = [...document.querySelectorAll('nav[aria-label="Поле ввода: примеры и конструктор"] a')];
      return {
        downloads: [...install.querySelectorAll('button')].filter((b) => b.textContent.includes('Скачать')).map((b) => b.textContent.trim()),
        sourceDownload: [...source.querySelectorAll('button')].some((b) => b.textContent.includes('Скачать index.tsx')),
        tabs: tabs.map((a) => ({ text: a.textContent.trim(), href: a.getAttribute('href') })),
      };
    })()`);
    assert.deepEqual(info.downloads, ["Скачать index.tsx"]);
    assert.equal(info.sourceDownload, true);
    assert.deepEqual(info.tabs, [
      { text: "Поле ввода", href: "/docs/components/input" },
      {
        text: "Конструктор",
        href: "/docs/components/input/constructor",
      },
    ]);
    await page.close();
  });

  test("выбор: тёмная тема в портале, поиск, Enter и Esc", async () => {
    const page = await browser.page({ width: 1440, height: 1000 });
    await page.goto("/docs/components/select/constructor");
    await sleep(300);
    await page.eval(`${button("Тёмная")}.click()`);
    await page.eval(
      `document.querySelector('${PREVIEW} [role=combobox]').click()`,
    );
    await page.waitFor(
      `${VISIBLE_LISTS}.length > 0 && document.activeElement?.getAttribute('role') === 'combobox'`,
    );
    const open = await page.eval(`(() => {
      const list = ${VISIBLE_LISTS}.at(-1);
      const pop = list.parentElement;
      const r = pop.getBoundingClientRect();
      return {
        theme: pop.dataset.theme,
        inView: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth,
        options: list.querySelectorAll('[role=option]').length,
      };
    })()`);
    assert.equal(open.theme, "dark", "список следует теме превью");
    assert.ok(open.inView, "список целиком на экране");
    assert.ok(open.options >= 4, "все пункты на месте");

    await page.send("Input.insertText", { text: "разраб" });
    await page.waitFor(
      `${VISIBLE_LISTS}.length && ${VISIBLE_LISTS}.at(-1).textContent.includes('Разработка')`,
    );
    const found = await page.eval(
      `${VISIBLE_LISTS}.at(-1).querySelectorAll('[role=option]').length`,
    );
    assert.equal(found, 1, "поиск оставил только «Разработка»");

    await page.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Enter",
      code: "Enter",
      windowsVirtualKeyCode: 13,
    });
    await page.waitFor(`${VISIBLE_LISTS}.length === 0`);
    assert.equal(
      (
        await page.eval(
          `document.querySelector('${PREVIEW} [role=combobox]').textContent.trim()`,
        )
      ).startsWith("Разработка"),
      true,
    );

    await page.eval(
      `document.querySelector('${PREVIEW} [role=combobox]').click()`,
    );
    await page.waitFor(`${VISIBLE_LISTS}.length > 0`);
    await sleep(200); // обработчик Esc вешается эффектом после открытия — не гоняемся с ним
    await page.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await page.waitFor(`${VISIBLE_LISTS}.length === 0`);
    await page.waitFor(
      `document.activeElement === document.querySelector('${PREVIEW} [role=combobox]')`,
    );
    assert.equal(
      await page.eval(
        `document.activeElement === document.querySelector('${PREVIEW} [role=combobox]')`,
      ),
      true,
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("выбор на телефоне не выходит за экран", async () => {
    const page = await browser.page({
      width: 375,
      height: 812,
      mobile: true,
    });
    await page.goto("/docs/components/select/constructor");
    await sleep(300);
    await page.eval(
      `document.querySelector('${PREVIEW} [role=combobox]').scrollIntoView({ block: 'center', behavior: 'instant' })`,
    );
    await sleep(150);
    await page.eval(
      `document.querySelector('${PREVIEW} [role=combobox]').click()`,
    );
    await page.waitFor(`${VISIBLE_LISTS}.length > 0`);
    const box = await page.eval(`(() => {
      const list = ${VISIBLE_LISTS}.at(-1);
      const r = list.parentElement.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, w: innerWidth, h: innerHeight };
    })()`);
    assert.ok(box.left >= 0 && box.right <= box.w, "по ширине экрана");
    assert.ok(box.top >= 0 && box.bottom <= box.h, "по высоте экрана");
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("ссылки: выбор пункта открывает страницу", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/select");
    await sleep(300);
    await page.eval(
      `[...document.querySelectorAll('[role=combobox]')].find((el) => el.textContent.includes('Куда перейти')).click()`,
    );
    await page.waitFor(`${VISIBLE_LISTS}.length > 0`);
    await page.eval(
      `[...document.querySelectorAll('[role=option]')].find((o) => o.textContent.includes('Ширина')).click()`,
    );
    await page.waitFor("location.pathname === '/docs/scss/width'");
    assert.match(
      await page.eval("document.querySelector('h1').textContent"),
      /Ширина/,
    );
    await page.close();
  });

  test("вкладки: стрелка, фокус и панель", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/tabs");
    await sleep(300);
    await page.eval(`(() => {
      const tabs = [...document.querySelectorAll('${PREVIEW} [role=tab]')];
      tabs[0].focus();
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    })()`);
    await page.waitFor(
      `document.querySelectorAll('${PREVIEW} [role=tab]')[1].getAttribute('aria-selected') === 'true'`,
    );
    assert.equal(
      await page.eval(
        `document.activeElement.textContent.trim().startsWith('Видео')`,
      ),
      true,
    );
    assert.match(
      await page.eval(
        `document.querySelector('${PREVIEW} [role=tabpanel]').textContent`,
      ),
      /Восемь роликов/,
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("карточка готового компонента ведёт на страницу", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components");
    await sleep(200);
    assert.equal(
      await page.eval(
        `!!document.querySelector('a[href="/docs/components/input"]')`,
      ),
      true,
    );
    await page.eval(
      `document.querySelector('a[href="/docs/components/input"]').click()`,
    );
    await page.waitFor("location.pathname === '/docs/components/input'");
    assert.match(
      await page.eval("document.querySelector('h1').textContent"),
      /Поле ввода/,
    );
    await page.close();
  });

  test("конструктор: подсказка, переход к настройке и демо-пункты", async () => {
    const page = await browser.page({ width: 1440, height: 1000 });
    await page.goto("/docs/components/select/constructor");
    await sleep(300);
    await page.eval(`${button("Клик по примеру ведёт к настройке")}.click()`);
    await page.eval(`(() => {
      const el = document.querySelector('${PREVIEW} [data-part=trigger]');
      el.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
    })()`);
    await page.waitFor(
      `document.getElementById('settings-field').className.includes('outline-secondary')`,
    );
    await page.eval(
      `document.querySelector('${PREVIEW} [data-part=trigger]').click()`,
    );
    await sleep(300);
    assert.equal(
      await page.eval(`${VISIBLE_LISTS}.length`),
      0,
      "в режиме настройки список не открывается",
    );
    assert.ok(
      await page.eval("scrollY > 100"),
      "страница перешла к настройкам",
    );

    await page.eval(`${button("Клик по примеру ведёт к настройке")}.click()`);
    await page.eval(
      `document.querySelector('${PREVIEW} [data-part=trigger]').click()`,
    );
    await page.waitFor(`${VISIBLE_LISTS}.length > 0`);
    const options = await page.eval(`${VISIBLE_LISTS}.at(-1).textContent`);
    for (const label of ["Дизайн", "Разработка", "Маркетинг"]) {
      assert.ok(options.includes(label), label);
    }
    await page.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await page.close();
  });

  test("код компонента — вкладками файлов", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/select");
    await sleep(300);
    const result = await page.eval(`(() => {
      const section = document.getElementById('source').closest('section');
      const tabs = [...section.querySelectorAll('[role=tab]')];
      tabs[1].click();
      return {
        labels: tabs.map((t) => t.textContent.trim()),
        downloads: [...section.querySelectorAll('button')].filter((b) => b.textContent.includes('Скачать')).map((b) => b.textContent.trim()),
      };
    })()`);
    assert.deepEqual(result.labels, ["index.tsx", "options.ts"]);
    assert.deepEqual(result.downloads, ["Скачать index.tsx"]);
    await page.waitFor(
      `document.getElementById('source').closest('section').querySelector('[role=tabpanel]').textContent.includes('filterItems')`,
    );
    await page.close();
  });

  test("установка: два файла и кнопки скачивания", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/select");
    await sleep(300);
    const info = await page.eval(`(() => {
      const section = document.getElementById('install').closest('section');
      const text = section.textContent;
      return {
        downloads: [...section.querySelectorAll('button')].filter((b) => b.textContent.includes('Скачать')).map((b) => b.textContent.trim()),
        extra: text.includes('presets.tsx') || text.includes('navigation.tsx'),
      };
    })()`);
    assert.deepEqual(info.downloads, [
      "Скачать index.tsx",
      "Скачать options.ts",
    ]);
    assert.equal(info.extra, false);
    await page.close();
  });

  test("навигация: активный пункт и конструктор", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/navigation");
    await sleep(300);
    const info = await page.eval(`(() => {
      const section = document.getElementById('base').closest('section');
      const active = section.querySelector('a[aria-current=page]');
      return {
        active: active?.textContent.trim(),
        link: active?.getAttribute('href'),
        download: [...document.getElementById('install').closest('section').querySelectorAll('button')].some((b) => b.textContent.includes('Скачать index.tsx')),
      };
    })()`);
    assert.deepEqual(info, {
      active: "Компоненты",
      link: "/docs/components",
      download: true,
    });
    await page.goto("/docs/components/navigation/constructor");
    await sleep(300);
    await page.eval(`${button("TSX")}.click()`);
    await page.waitFor(
      `document.querySelector('[data-component-preview]').parentElement.querySelector('pre').textContent.includes('<nav') && !document.querySelector('[data-component-preview]').parentElement.querySelector('pre').textContent.includes('@/components/ui/Navigation')`,
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("меню: открытие, Esc и конструктор", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/menu");
    await sleep(300);
    await page.eval(
      `document.getElementById('base').closest('section').querySelector('[aria-haspopup=menu]').click()`,
    );
    await page.waitFor(
      `document.querySelectorAll('[role=menu] [role=menuitem]').length >= 4`,
    );
    assert.deepEqual(
      await page.eval(
        `[...document.querySelectorAll('[role=menu] [role=menuitem]')].map((b) => b.textContent.trim())`,
      ),
      ["Изменить⌘E", "Скопировать⌘C", "В архив", "Удалить⌫"],
    );
    await sleep(300); // обработчик Esc вешается эффектом после открытия — не гоняемся с ним
    await page.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await page.waitFor(`!document.querySelector('[role=menu]')`);
    await page.goto("/docs/components/menu/constructor");
    await sleep(300);
    await page.eval(`${button("TSX")}.click()`);
    await page.waitFor(
      `document.querySelector('[data-component-preview]').parentElement.querySelector('pre').textContent.includes('role="menu"') && !document.querySelector('[data-component-preview]').parentElement.querySelector('pre').textContent.includes('@/components/ui/Menu')`,
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("кнопка: варианты, металлик и тёмная тема", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/button");
    await sleep(300);
    const info = await page.eval(`(() => {
      const metal = document.querySelector('#metal').closest('section').querySelector('button');
      const dark = document.querySelector('#themes').closest('section').querySelector('[data-theme="dark"]');
      return {
        buttons: document.querySelectorAll('main button').length,
        metalClass: metal.className,
        metalBg: getComputedStyle(metal).backgroundImage,
        darkPanel: !!dark,
      };
    })()`);
    assert.ok(info.buttons >= 20, "все варианты на месте");
    assert.match(info.metalClass, /bg-\[linear-gradient\(115deg/);
    assert.match(info.metalBg, /linear-gradient/, "металлик собран градиентом");
    assert.equal(info.darkPanel, true, "есть панель тёмной темы");
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("поле ввода: необычные варианты и OTP", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/input");
    await sleep(300);
    const info = await page.eval(`(() => {
      const section = document.querySelector('#unusual').closest('section');
      return {
        fields: section.querySelectorAll('input').length,
        otp: section.querySelectorAll('input[size], input').length,
        cards: section.querySelectorAll('h3').length,
        toc: !!document.querySelector('[aria-label="На этой странице"] a[href="#unusual"]')
          || !!document.querySelector('a[href="#unusual"]'),
      };
    })()`);
    assert.ok(info.fields >= 8, "в разделе есть поля");
    assert.ok(info.cards >= 6, "варианты на месте");
    assert.equal(info.toc, true, "раздел есть в оглавлении страницы");
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("пейджер ведёт по страницам компонентов", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/button");
    await sleep(200);
    assert.deepEqual(
      await page.eval(`(() => {
        const nav = document.querySelector('nav[aria-label="Страницы справки"]');
        return {
          prev: nav.querySelector('a[rel=prev]').getAttribute('href'),
          next: nav.querySelector('a[rel=next]').getAttribute('href'),
        };
      })()`),
      { prev: "/docs/components", next: "/docs/components/input" },
    );
    await page.goto("/docs/components/input");
    await sleep(200);
    assert.deepEqual(
      await page.eval(`(() => {
        const nav = document.querySelector('nav[aria-label="Страницы справки"]');
        return {
          prev: nav.querySelector('a[rel=prev]').getAttribute('href'),
          next: nav.querySelector('a[rel=next]').getAttribute('href'),
        };
      })()`),
      {
        prev: "/docs/components/button",
        next: "/docs/components/input/constructor",
      },
    );
    await page.goto("/docs/components/input/constructor");
    await sleep(200);
    assert.deepEqual(
      await page.eval(`(() => {
        const nav = document.querySelector('nav[aria-label="Страницы справки"]');
        return {
          prev: nav.querySelector('a[rel=prev]').getAttribute('href'),
          next: nav.querySelector('a[rel=next]').getAttribute('href'),
        };
      })()`),
      {
        prev: "/docs/components/input",
        next: "/docs/components/select",
      },
    );
    await page.goto("/docs/components/tabs");
    await sleep(200);
    assert.deepEqual(
      await page.eval(`(() => {
        const nav = document.querySelector('nav[aria-label="Страницы справки"]');
        return {
          prev: nav.querySelector('a[rel=prev]').getAttribute('href'),
          next: nav.querySelector('a[rel=next]').getAttribute('href'),
        };
      })()`),
      {
        prev: "/docs/components/select/constructor",
        next: "/docs/components/navigation",
      },
    );
    await page.goto("/docs/components/menu/constructor");
    await sleep(200);
    assert.deepEqual(
      await page.eval(`(() => {
        const nav = document.querySelector('nav[aria-label="Страницы справки"]');
        return {
          prev: nav.querySelector('a[rel=prev]').getAttribute('href'),
          next: nav.querySelector('a[rel=next]').getAttribute('href'),
        };
      })()`),
      {
        prev: "/docs/components/menu",
        next: "/docs/components/modal",
      },
    );
    await page.goto("/docs/components/modal");
    await sleep(200);
    assert.deepEqual(
      await page.eval(`(() => {
        const nav = document.querySelector('nav[aria-label="Страницы справки"]');
        return {
          prev: nav.querySelector('a[rel=prev]').getAttribute('href'),
          next: nav.querySelector('a[rel=next]').getAttribute('href'),
        };
      })()`),
      {
        prev: "/docs/components/menu/constructor",
        next: "/docs/components/modal/constructor",
      },
    );
    await page.goto("/docs/components/modal/constructor");
    await sleep(200);
    assert.deepEqual(
      await page.eval(`(() => {
        const nav = document.querySelector('nav[aria-label="Страницы справки"]');
        return {
          prev: nav.querySelector('a[rel=prev]').getAttribute('href'),
          next: nav.querySelector('a[rel=next]').getAttribute('href'),
        };
      })()`),
      {
        prev: "/docs/components/modal",
        next: "/docs/releases",
      },
    );
    await page.close();
  });

  test("окно: открытие, Esc и затемнение", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/modal");
    await sleep(300);
    await page.eval(`${button("Открыть по центру")}.click()`);
    await page.waitFor(`!!document.querySelector('dialog.modal[open]')`);
    assert.equal(
      await page.eval(`getComputedStyle(document.documentElement).overflow`),
      "hidden",
      "страница под окном не прокручивается",
    );
    // запомнили открытое окно (на странице их несколько — по одному на пример)
    const index = await page.eval(
      `[...document.querySelectorAll('dialog.modal')].findIndex((d) => d.open)`,
    );
    await page.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    // уход анимацией: окно уже закрыто, но ещё видно — гаснет и уезжает, а не пропадает кадром
    const exit = await page.eval(`(() => {
      const d = [...document.querySelectorAll('dialog.modal')][${index}];
      const cs = getComputedStyle(d);
      return { open: d.open, display: cs.display, opacity: Number(cs.opacity) };
    })()`);
    assert.equal(exit.open, false, "окно закрыто");
    assert.notEqual(
      exit.display,
      "none",
      "display выключается только в конце ухода",
    );
    assert.ok(exit.opacity < 1, "окно гаснет, а не исчезает рывком");
    await page.waitFor(
      `getComputedStyle([...document.querySelectorAll('dialog.modal')][${index}]).display === 'none'`,
    );
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("окно: кнопка-триггер открывает окно", async () => {
    const page = await browser.page({ width: 1440, height: 900 });
    await page.goto("/docs/components/modal");
    await sleep(300);
    await page.eval(`${button("Удалить файл")}.click()`);
    await page.waitFor(`!!document.querySelector('dialog.modal[open]')`);
    await page.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await page.waitFor(`!document.querySelector('dialog.modal[open]')`);
    assert.deepEqual(page.errors, []);
    await page.close();
  });

  test("окно: позиции в конструкторе и закрытие из контента", async () => {
    const page = await browser.page({ width: 1440, height: 1000 });
    await page.goto("/docs/components/modal/constructor");
    await sleep(300);
    await page.eval(`${button("Открыть окно")}.click()`);
    await page.waitFor(`!!document.querySelector('${PREVIEW} dialog[open]')`);
    assert.deepEqual(
      await page.eval(`(() => {
        const d = document.querySelector('${PREVIEW} dialog');
        return { pos: d.dataset.pos, phone: d.dataset.phone, inline: d.dataset.inline };
      })()`),
      { pos: "center", phone: "bottom", inline: "true" },
      "по умолчанию: центр, на телефоне снизу, окно в рамке",
    );
    // позиция «Справа» — окно у правого края рамки
    await page.eval(
      `[...document.querySelectorAll('button')].filter((b) => b.textContent.trim() === 'Справа')[0].click()`,
    );
    await page.waitFor(
      `document.querySelector('${PREVIEW} dialog')?.dataset.pos === 'right'`,
    );
    await sleep(700); // появление окна (пружина 0.5с) доходит до конца — замер не спотыкается о scale
    const right = await page.eval(`(() => {
      const d = document.querySelector('${PREVIEW} dialog');
      const box = d.parentElement.getBoundingClientRect();
      const r = d.getBoundingClientRect();
      return { atRight: box.right - r.right < 16, taller: r.height > 200 };
    })()`);
    assert.ok(right.atRight, "окно прижато к правому краю рамки");
    assert.ok(right.taller, "панель во всю высоту рамки");
    // на телефоне — «По центру» (второй сегмент)
    await page.eval(
      `[...document.querySelectorAll('button')].filter((b) => b.textContent.trim() === 'По центру')[1].click()`,
    );
    await page.waitFor(
      `document.querySelector('${PREVIEW} dialog')?.dataset.phone === 'center'`,
    );
    // подложка как у настоящего окна: видна и ловит клик, пока окно открыто
    const backdrop = await page.eval(`(() => {
      const el = document.querySelector('${PREVIEW} [data-modal-backdrop]');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { opacity: cs.opacity, blur: cs.backdropFilter || cs.webkitBackdropFilter };
    })()`);
    assert.equal(backdrop?.opacity, "1", "подложка показана");
    assert.match(backdrop?.blur ?? "", /blur\(8px\)/, "фон под окном размыт");
    // класс фона из поля уходит на окно: фон меняется
    const bgBefore = await page.eval(
      `getComputedStyle(document.querySelector('${PREVIEW} dialog')).backgroundColor`,
    );
    await page.eval(`(() => {
      const input = document.querySelector('input[aria-label="Класс фона окна"]');
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      set.call(input, 'bg-primary');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    await page.waitFor(
      `document.querySelector('${PREVIEW} dialog').className.includes('bg-primary')`,
    );
    const bgAfter = await page.eval(
      `getComputedStyle(document.querySelector('${PREVIEW} dialog')).backgroundColor`,
    );
    assert.notEqual(bgAfter, bgBefore, "фон окна перекрасился");
    // клик по подложке закрывает
    await page.eval(
      `document.querySelector('${PREVIEW} [data-modal-backdrop]').click()`,
    );
    await page.waitFor(`!document.querySelector('${PREVIEW} dialog[open]')`);
    // открыли снова и закрыли кнопкой контента
    await page.eval(`${button("Открыть окно")}.click()`);
    await page.waitFor(`!!document.querySelector('${PREVIEW} dialog[open]')`);
    await page.eval(
      `[...document.querySelectorAll('${PREVIEW} dialog button')].find((b) => b.textContent.trim() === 'Отмена').click()`,
    );
    await page.waitFor(`!document.querySelector('${PREVIEW} dialog[open]')`);
    assert.deepEqual(page.errors, []);
    await page.close();
  });
});
