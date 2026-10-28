// npm test — накладка смены страниц не играет при первой загрузке: data-first-load снимается первым действием
// человека, но только когда разметка загружена целиком

import assert from "node:assert/strict";
import { test } from "node:test";
import { firstLoadGate, ROUTE_ENTER_SCRIPT } from "./route-enter.ts";

// окно-заглушка: атрибуты <html>, состояние загрузки, обработчики событий
function fakeWindow() {
  const attrs = new Set<string>();
  const listeners = new Map<string, Set<() => void>>();
  const w = {
    document: {
      readyState: "loading",
      documentElement: {
        setAttribute: (name: string) => attrs.add(name),
        removeAttribute: (name: string) => attrs.delete(name),
      },
    },
    addEventListener: (type: string, fn: () => void) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)?.add(fn);
    },
    removeEventListener: (type: string, fn: () => void) =>
      listeners.get(type)?.delete(fn),
  };
  const fire = (type: string) => {
    for (const fn of [...(listeners.get(type) ?? [])]) fn();
  };
  const count = () =>
    [...listeners.values()].reduce((n, set) => n + set.size, 0);
  return { w, attrs, fire, count };
}

test("с начала загрузки — data-first-load", () => {
  const { w, attrs } = fakeWindow();
  firstLoadGate(w as unknown as Window);
  assert.ok(attrs.has("data-first-load"));
});

test("пока разметка грузится, касание и клавиши атрибут не снимают", () => {
  const { w, attrs, fire } = fakeWindow();
  firstLoadGate(w as unknown as Window);
  fire("pointerdown");
  fire("keydown");
  assert.ok(attrs.has("data-first-load"));
});

test("после загрузки первое действие снимает атрибут и слушателей", () => {
  for (const type of ["pointerdown", "keydown", "popstate"]) {
    const { w, attrs, fire, count } = fakeWindow();
    firstLoadGate(w as unknown as Window);
    w.document.readyState = "interactive";
    fire(type);
    assert.ok(!attrs.has("data-first-load"), type);
    assert.equal(count(), 0, `${type}: слушатели сняты`);
  }
});

test("встроенный скрипт — та же функция", () => {
  assert.ok(ROUTE_ENTER_SCRIPT.startsWith("(function firstLoadGate"));
  assert.ok(ROUTE_ENTER_SCRIPT.endsWith(")(window)"));
});
