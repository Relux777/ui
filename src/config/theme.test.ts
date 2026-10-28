// npm test — цвет панели браузера ставится по теме сайта до первой отрисовки

import assert from "node:assert/strict";
import { test } from "node:test";
import { THEME_COLOR_SCRIPT, THEME_COLORS } from "./theme.ts";

// выполнить встроенный скрипт: сохранённая тема, тема системы → цвета метатегов
function run(stored: string | null, systemDark: boolean, storage = true) {
  const metas = [{ content: "?" }, { content: "?" }];
  const localStorage = {
    getItem: () => {
      if (!storage) throw new Error("нет доступа");
      return stored;
    },
  };
  const matchMedia = () => ({ matches: systemDark });
  const document = { querySelectorAll: () => metas };
  new Function("localStorage", "matchMedia", "document", THEME_COLOR_SCRIPT)(
    localStorage,
    matchMedia,
    document,
  );
  return metas.map((m) => m.content);
}

test("тема сайта важнее темы системы", () => {
  const light = THEME_COLORS.light;
  const dark = THEME_COLORS.dark;
  assert.deepEqual(run("light", true), [light, light]);
  assert.deepEqual(run("dark", false), [dark, dark]);
});

test("системная или ещё не выбранная тема — по системе", () => {
  assert.deepEqual(run("system", true), [THEME_COLORS.dark, THEME_COLORS.dark]);
  assert.deepEqual(run(null, false), [THEME_COLORS.light, THEME_COLORS.light]);
});

test("без доступа к localStorage скрипт не падает и ничего не трогает", () => {
  assert.deepEqual(run("dark", false, false), ["?", "?"]);
});
