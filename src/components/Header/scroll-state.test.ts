// npm test — node:test, TypeScript без сборки (Node 24 сам убирает типы)

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SCROLL_OFF,
  SCROLL_ON,
  SCROLL_SCRIPT,
  watchScroll,
} from "./scroll-state.ts";

// окно с прокруткой, подписками и кадрами; <html> пишет в журнал каждую смену атрибута
function fakeWindow(scrollY = 0) {
  const attrs = new Set<string>();
  const log: string[] = [];
  const listeners = new Map<string, Set<() => void>>();
  const frames: (() => void)[] = [];
  const root = {
    hasAttribute: (a: string) => attrs.has(a),
    setAttribute: (a: string) => {
      attrs.add(a);
      log.push(`+${a}`);
    },
    removeAttribute: (a: string) => {
      attrs.delete(a);
      log.push(`-${a}`);
    },
    toggleAttribute: (a: string, on: boolean) => {
      if (on) attrs.add(a);
      else attrs.delete(a);
      log.push(`${on ? "+" : "-"}${a}`);
    },
    offsetHeight: 0,
  };
  const win = {
    scrollY,
    document: { documentElement: root },
    addEventListener: (t: string, fn: () => void) => {
      if (!listeners.has(t)) listeners.set(t, new Set());
      listeners.get(t)?.add(fn);
    },
    removeEventListener: (t: string, fn: () => void) =>
      listeners.get(t)?.delete(fn),
    requestAnimationFrame: (fn: () => void) => frames.push(fn),
  };
  const fire = (t: string) => {
    for (const fn of [...(listeners.get(t) ?? [])]) fn();
  };
  return {
    win,
    attrs,
    log,
    listeners,
    fire,
    // прокрутка: событие scroll, затем кадр
    scrollTo(y: number) {
      win.scrollY = y;
      fire("scroll");
      for (const fn of frames.splice(0)) fn();
    },
    /** записи журнала с этого места */
    mark() {
      const from = log.length;
      return () => log.slice(from);
    },
  };
}

const start = (scrollY = 0) => {
  const page = fakeWindow(scrollY);
  watchScroll(page.win as unknown as Window, SCROLL_ON, SCROLL_OFF);
  return page;
};
const INSTANT_ON = ["+data-instant", "+data-scrolled", "-data-instant"];
const INSTANT_OFF = ["+data-instant", "-data-scrolled", "-data-instant"];

// ── перезагрузка и восстановление прокрутки ────────────────────────────────

test("перезагрузка посреди страницы: data-scrolled сразу и без переходов", () => {
  const page = start(2000);
  assert.ok(page.attrs.has("data-scrolled"));
  assert.ok(!page.attrs.has("data-instant"));
  assert.deepEqual(page.log, INSTANT_ON);
});

test("начало страницы: ничего не меняется", () => {
  const page = start(0);
  assert.equal(page.attrs.size, 0);
  assert.deepEqual(page.log, []);
});

test("браузер восстановил прокрутку после скрипта (DOMContentLoaded) — тоже без переходов", () => {
  const page = start(0);
  page.win.scrollY = 1500;
  page.fire("DOMContentLoaded");
  assert.deepEqual(page.log, INSTANT_ON);
});

test("восстановление прокрутки событием scroll до касания — без переходов", () => {
  const page = start(0);
  page.scrollTo(1500);
  assert.deepEqual(page.log, INSTANT_ON);
});

test("переход по #якорю в адресе и обратно наверх без участия пользователя — оба раза мгновенно", () => {
  const page = start(0);
  page.scrollTo(900);
  page.scrollTo(0);
  assert.deepEqual(page.log, [...INSTANT_ON, ...INSTANT_OFF]);
});

// ── прокрутка пользователем ────────────────────────────────────────────────

for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
  test(`после «${type}» — с анимацией, без data-instant`, () => {
    const page = start(0);
    page.fire(type);
    page.scrollTo(500);
    assert.deepEqual(page.log, ["+data-scrolled"]);
  });
}

test("после первого касания подписки на ввод снимаются, на прокрутку — остаются", () => {
  const page = start(0);
  page.fire("wheel");
  for (const type of ["wheel", "touchstart", "keydown", "pointerdown"])
    assert.equal(page.listeners.get(type)?.size ?? 0, 0, type);
  assert.equal(page.listeners.get("scroll")?.size, 1);
});

test("несколько событий scroll за кадр — один пересчёт", () => {
  const page = start(0);
  page.fire("wheel");
  let frames = 0;
  const raf = page.win.requestAnimationFrame;
  page.win.requestAnimationFrame = (fn) => {
    frames++;
    return raf(fn);
  };
  page.win.scrollY = 300;
  page.fire("scroll");
  page.fire("scroll");
  page.fire("scroll");
  assert.equal(frames, 1);
  page.scrollTo(310);
  assert.deepEqual(page.log, ["+data-scrolled"]);
});

test("атрибут пишется только при смене состояния", () => {
  const page = start(0);
  page.fire("wheel");
  for (const y of [100, 200, 300, 400, 500]) page.scrollTo(y);
  assert.deepEqual(page.log, ["+data-scrolled"]);
});

// ── пороги ─────────────────────────────────────────────────────────────────

test("включается только после SCROLL_ON", () => {
  const page = start(0);
  page.fire("wheel");
  page.scrollTo(SCROLL_ON);
  assert.ok(!page.attrs.has("data-scrolled"));
  page.scrollTo(SCROLL_ON + 1);
  assert.ok(page.attrs.has("data-scrolled"));
});

test("между порогами состояние не меняется — шапка не дрожит", () => {
  const middle = (SCROLL_ON + SCROLL_OFF) / 2;
  const down = start(0);
  down.fire("wheel");
  down.scrollTo(middle);
  assert.ok(!down.attrs.has("data-scrolled"));

  const up = start(500);
  up.fire("wheel");
  up.scrollTo(middle);
  assert.ok(up.attrs.has("data-scrolled"));
});

test("выключается на SCROLL_OFF и выше страницы", () => {
  const page = start(500);
  page.fire("wheel");
  page.scrollTo(SCROLL_OFF + 1);
  assert.ok(page.attrs.has("data-scrolled"));
  page.scrollTo(SCROLL_OFF);
  assert.ok(!page.attrs.has("data-scrolled"));
});

test("отрицательная прокрутка (оттягивание на iOS) — не прокручено", () => {
  const page = start(500);
  page.fire("touchstart");
  page.scrollTo(-40);
  assert.ok(!page.attrs.has("data-scrolled"));
});

test("дрожание у порога (инерция ±пара пикселей) не переключает туда-обратно", () => {
  const page = start(0);
  page.fire("touchstart");
  for (const y of [38, 42, 39, 41, 30, 44, 20, 17]) page.scrollTo(y);
  assert.deepEqual(page.log, ["+data-scrolled"]);
});

// ── переходы между страницами ──────────────────────────────────────────────

test("клик по логотипу в прокрутке: переход наверх — с анимацией, без data-instant", () => {
  const page = start(0);
  page.fire("pointerdown");
  page.scrollTo(2000);
  const after = page.mark();
  page.fire("pointerdown"); // клик по ссылке
  page.scrollTo(0); // Next прокручивает новую страницу наверх
  assert.deepEqual(after(), ["-data-scrolled"]);
});

test("«назад» на прокрученную страницу: шапка снова компактная", () => {
  const page = start(0);
  page.fire("pointerdown");
  page.scrollTo(2000);
  page.scrollTo(0);
  page.scrollTo(2000); // браузер восстановил прокрутку прежней страницы
  assert.ok(page.attrs.has("data-scrolled"));
});

test("переход на длинную страницу с сохранённой прокруткой и сразу наверх — без лишних смен", () => {
  const page = start(0);
  page.fire("pointerdown");
  page.win.scrollY = 1200;
  page.fire("scroll");
  page.win.scrollY = 0; // за тот же кадр страница уже наверху
  page.fire("scroll");
  page.scrollTo(0);
  assert.deepEqual(page.log, []);
});

// ── встроенный скрипт ──────────────────────────────────────────────────────

test("SCROLL_SCRIPT — самодостаточный текст: работает без модуля, с порогами внутри", () => {
  const page = fakeWindow(SCROLL_ON + 1);
  new Function("window", SCROLL_SCRIPT)(page.win);
  assert.deepEqual(page.log, INSTANT_ON);
  assert.ok(SCROLL_SCRIPT.endsWith(`(window,${SCROLL_ON},${SCROLL_OFF})`));
});
