// npm test — поиск и перемещение по выпадающему списку

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  filterItems,
  flattenItems,
  nextEnabled,
  type SelectItem,
} from "./options.ts";

const ITEMS: SelectItem[] = [
  { value: "next", label: "Next.js", hint: "App Router" },
  { value: "react", label: "React" },
  {
    label: "Стили",
    options: [
      { value: "scss", label: "RenDit SCSS" },
      { value: "css", label: "Готовый CSS" },
    ],
  },
];

test("плоский список сохраняет порядок групп", () => {
  assert.deepEqual(
    flattenItems(ITEMS).map((o) => o.value),
    ["next", "react", "scss", "css"],
  );
});

test("поиск идёт по названию и подсказке, группа остаётся с совпавшими", () => {
  const found = filterItems(ITEMS, "router");
  assert.equal(found.length, 1);
  assert.equal(flattenItems(found)[0].value, "next");

  const group = filterItems(ITEMS, "готовый");
  assert.equal(group.length, 1);
  assert.deepEqual(
    flattenItems(group).map((o) => o.value),
    ["css"],
  );
});

test("название группы показывает все её пункты, пустой запрос — всё", () => {
  assert.deepEqual(
    flattenItems(filterItems(ITEMS, "стили")).map((o) => o.value),
    ["scss", "css"],
  );
  assert.equal(filterItems(ITEMS, "  ").length, ITEMS.length);
});

test("стрелки пропускают выключенные пункты и идут по кругу", () => {
  const options = [
    { value: "a", label: "A" },
    { value: "b", label: "B", disabled: true },
    { value: "c", label: "C" },
  ];
  assert.equal(nextEnabled(options, -1, 1), 0);
  assert.equal(nextEnabled(options, 0, 1), 2);
  assert.equal(nextEnabled(options, 2, 1), 0);
  assert.equal(nextEnabled(options, 2, -1), 0);
  assert.equal(nextEnabled(options, 0, -1), 2);
  assert.equal(nextEnabled([], 0, 1), -1);
  assert.equal(
    nextEnabled([{ value: "x", label: "X", disabled: true }], 0, 1),
    -1,
  );
});
