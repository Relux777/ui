// npm test — разбор CHANGELOG.md для вкладки «Обновления»

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { inlineParts, parseChangelog } from "./changelog.ts";

const SAMPLE = `# Changelog

## [Unreleased]

### Добавлено
- Новый пункт,
  продолжение строки.

## [0.2.0] — 2026-10-28

Версия с конструкторами.

### Изменено
- Пункт с \`кодом\` и **жирным**.
`;

test("версии, даты, группы, продолжение пункта", () => {
  const [next, v2] = parseChangelog(SAMPLE);
  assert.equal(next.unreleased, true);
  assert.deepEqual(next.groups[0], {
    title: "Добавлено",
    items: ["Новый пункт, продолжение строки."],
  });
  assert.equal(v2.version, "0.2.0");
  assert.equal(v2.date, "2026-10-28");
  assert.equal(v2.unreleased, false);
  assert.equal(v2.note, "Версия с конструкторами.");
});

test("код и жирный в пункте", () => {
  assert.deepEqual(inlineParts("Пункт с `кодом` и **жирным**."), [
    { kind: "text", text: "Пункт с " },
    { kind: "code", text: "кодом" },
    { kind: "text", text: " и " },
    { kind: "bold", text: "жирным" },
    { kind: "text", text: "." },
  ]);
});

test("настоящий CHANGELOG.md разбирается: есть выпущенные версии с изменениями", () => {
  const text = readFileSync(
    join(import.meta.dirname, "../../../../CHANGELOG.md"),
    "utf8",
  );
  const released = parseChangelog(text).filter((r) => !r.unreleased);
  assert.ok(released.length > 0);
  for (const r of released) {
    assert.match(r.version, /^\d+\.\d+\.\d+$/, r.version);
    assert.ok(
      r.groups.some((g) => g.items.length),
      r.version,
    );
  }
});
