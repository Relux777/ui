// npm test — node:test, TypeScript без сборки (Node 24 сам убирает типы)

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clampIndex,
  dropAmplitude,
  FLICK_MS,
  flickIndex,
  indexAt,
  lensTarget,
  MAX_STRETCH,
  OVERDRAG,
  stretch,
} from "./lens.ts";

const W = 68; // ширина пункта, как в меню
const N = 4; // пунктов

test("номер пункта не выходит за края", () => {
  assert.equal(clampIndex(-3, N), 0);
  assert.equal(clampIndex(0, N), 0);
  assert.equal(clampIndex(3, N), 3);
  assert.equal(clampIndex(9, N), 3);
});

test("пункт под пальцем: границы пунктов и края панели", () => {
  assert.equal(indexAt(0, W, N), 0);
  assert.equal(indexAt(W - 1, W, N), 0);
  assert.equal(indexAt(W, W, N), 1);
  assert.equal(indexAt(W * 3.5, W, N), 3);
  assert.equal(indexAt(-20, W, N), 0); // левее панели
  assert.equal(indexAt(W * 10, W, N), 3); // правее панели
});

test("линза центром под пальцем: в середине пункта стоит ровно на нём", () => {
  for (let i = 0; i < N; i++)
    assert.equal(lensTarget(i * W + W / 2, W, N), i * W);
});

test("у пункта линзу притягивает, между пунктами — нет", () => {
  const nearFirst = lensTarget(W / 2 + 10, W, N); // палец на 10px правее центра первого
  assert.ok(
    nearFirst > 0 && nearFirst < 10,
    `притянута к пункту: ${nearFirst}`,
  );
  const between = lensTarget(W, W, N); // ровно между первым и вторым
  assert.equal(between, W / 2);
});

test("за краями — с сопротивлением и не дальше OVERDRAG", () => {
  const left = lensTarget(-1000, W, N);
  const right = lensTarget(10000, W, N);
  assert.equal(left, -W * OVERDRAG);
  assert.equal(right, (N - 1) * W + W * OVERDRAG);
  // чуть за краем — сдвиг меньше, чем у пальца
  const slight = lensTarget(W / 2 - 20, W, N);
  assert.ok(slight < 0 && slight > -20, `сопротивление: ${slight}`);
});

test("бросок докатывает линзу по инерции и не выкидывает за края", () => {
  assert.equal(flickIndex(W * 1.2, 0, W, N), 1); // без скорости — ближайший
  assert.equal(flickIndex(W * 1.2, (W * 1.5) / FLICK_MS, W, N), 3); // быстро вправо
  assert.equal(flickIndex(W * 1.2, -(W * 1.5) / FLICK_MS, W, N), 0); // быстро влево
  assert.equal(flickIndex(W * 2, 100, W, N), 3);
  assert.equal(flickIndex(W, -100, W, N), 0);
});

test("растяжение от скорости — в обе стороны одинаково и не больше MAX_STRETCH", () => {
  assert.equal(stretch(0), 0);
  assert.equal(stretch(0.5), stretch(-0.5));
  assert.equal(stretch(100), MAX_STRETCH);
});

test("«капля» сильнее при дальнем переезде, но не больше MAX_STRETCH", () => {
  assert.ok(dropAmplitude(0, 1) < dropAmplitude(0, 3));
  assert.equal(dropAmplitude(2, 1), dropAmplitude(1, 2));
  assert.ok(dropAmplitude(0, 100) <= MAX_STRETCH);
});
