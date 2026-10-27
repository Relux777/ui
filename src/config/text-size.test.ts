// npm test — node:test, TypeScript без сборки (Node 24 сам убирает типы)

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_TEXT_SIZE,
  parseTextSize,
  TEXT_SIZE_SCRIPT,
  textScale,
} from "./text-size.ts";

test("размер текста: сохранённое значение", () => {
  assert.equal(parseTextSize("16"), 16);
  assert.equal(parseTextSize("13"), 13);
});

test("размер текста: мусор и пустое — по умолчанию", () => {
  for (const raw of [null, undefined, "", "abc", "12", "19", "15.5", "1e1"])
    assert.equal(parseTextSize(raw), DEFAULT_TEXT_SIZE);
});

test("масштаб: размер / 14", () => {
  assert.equal(textScale(14), "1");
  assert.equal(textScale(18), "1.2857");
  assert.equal(textScale(13), "0.9286");
});

test("скрипт до отрисовки ставит тот же масштаб и не падает без localStorage", () => {
  const set = new Map<string, string>();
  const run = (stored: string | null, storage = true) => {
    set.clear();
    const localStorage = storage
      ? { getItem: () => stored }
      : {
          getItem: () => {
            throw new Error("нет доступа");
          },
        };
    const document = {
      documentElement: {
        style: { setProperty: (k: string, v: string) => set.set(k, v) },
      },
    };
    new Function("localStorage", "document", TEXT_SIZE_SCRIPT)(
      localStorage,
      document,
    );
    return set.get("--text-scale");
  };
  assert.equal(run("18"), textScale(18));
  assert.equal(run("14"), undefined); // размер по умолчанию — ничего не ставит
  assert.equal(run("99"), undefined);
  assert.equal(run("16", false), undefined);
});
