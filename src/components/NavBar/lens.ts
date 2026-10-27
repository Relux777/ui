// Математика линзы нижнего меню — без DOM и React, проверяется тестом (lens.test.ts).
// Координаты — в px от левого края первого пункта, w — ширина пункта, count — сколько пунктов.

export const RUBBER = 0.3; // сопротивление за краями панели
export const OVERDRAG = 0.35; // насколько (в ширинах пункта) линза может уйти за край
export const SNAP_ZONE = 0.22; // ближе этой доли ширины пункта — линзу притягивает к пункту
export const SNAP_PULL = 0.35; // сила притяжения
export const FLICK_MS = 120; // на сколько мс вперёд «докатывается» линза после броска
export const MAX_STRETCH = 0.3; // растяжение «каплей» не больше 30 %

export const clampIndex = (i: number, count: number) =>
  Math.min(count - 1, Math.max(0, i));

/** пункт под точкой x */
export const indexAt = (x: number, w: number, count: number) =>
  clampIndex(Math.floor(x / w), count);

/** куда встать линзе, когда палец в точке pointer: центр под пальцем, за краями — с сопротивлением,
 *  у пунктов — лёгкое притяжение */
export function lensTarget(pointer: number, w: number, count: number) {
  const max = (count - 1) * w;
  let target = pointer - w / 2;
  if (target < 0) target = Math.max(target * RUBBER, -w * OVERDRAG);
  else if (target > max)
    target = Math.min(max + (target - max) * RUBBER, max + w * OVERDRAG);
  const near = Math.round(target / w) * w;
  if (Math.abs(near - target) < w * SNAP_ZONE)
    target += (near - target) * SNAP_PULL;
  return target;
}

/** пункт после броска: куда линза доехала бы по инерции (vx — px/мс) */
export const flickIndex = (x: number, vx: number, w: number, count: number) =>
  clampIndex(Math.round((x + vx * FLICK_MS) / w), count);

/** растяжение линзы от скорости пальца (vx — px/мс) */
export const stretch = (vx: number) =>
  Math.min(MAX_STRETCH, Math.abs(vx) * 0.16);

/** «капля» при переезде нажатием: чем дальше пункт, тем сильнее тянется */
export const dropAmplitude = (from: number, to: number) =>
  Math.min(MAX_STRETCH, 0.1 + 0.07 * Math.abs(to - from));
