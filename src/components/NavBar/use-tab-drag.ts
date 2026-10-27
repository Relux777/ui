"use client";

import {
  type PointerEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  clampIndex as clamp,
  dropAmplitude,
  flickIndex,
  indexAt,
  lensTarget,
  stretch,
} from "./lens";

// Перетаскивание линзы нижнего меню пальцем или мышью (перенесено из ozon: navbar1/_lab/useTabDrag.ts).
// Положение линзы живёт в CSS-переменных панели: --nb-i (номер пункта, его ставит React) и --nb-x (сдвиг в px).
// Пока палец ведёт линзу, --nb-x пишется сюда каждый кадр (мимо React — без лишних рендеров); отпустили —
// --nb-x убирается, и CSS сам доводит его пружиной до calc(--nb-i × ширина пункта). Ещё --nb-st — растяжение
// от скорости, атрибуты data-dragging / data-pressed / data-hold — для стилей «поднятой» линзы.
// Вся математика (сопротивление, притяжение, бросок) — в lens.ts, под тестами.

type Options = {
  count: number;
  active: number;
  /** false — пункт не выбран, линза вернётся на прежний */
  onSelect: (index: number) => boolean;
  /** нажали (не перетащили) на уже выбранный пункт */
  onReselect?: (index: number) => void;
};

const DRAG_START = 6; // px: сдвиг дальше — уже перетаскивание, а не нажатие
const HOLD_MS = 300; // через сколько линза начинает расти дальше, если палец держат

const tick = () => {
  // короткая вибрация на Android; iPhone вибрацию из браузера не даёт
  if ("vibrate" in navigator) navigator.vibrate(5);
};

export function useTabDrag(
  barRef: RefObject<HTMLElement | null>,
  { count, active, onSelect, onReselect }: Options,
) {
  // пункт под линзой, пока палец прижат; null — линза стоит на выбранном пункте
  const [pointed, setPointed] = useState<number | null>(null);
  const st = useRef({
    id: -1,
    startX: 0,
    startY: 0,
    pointerX: 0,
    x: 0,
    vx: 0,
    t: 0,
    left: 0,
    w: 1,
    dragging: false,
    justDragged: false,
    raf: 0,
    hold: 0,
    pointed: -1,
  });
  const shown = pointed ?? active;

  const clampIndex = (i: number) => clamp(i, count);

  const frame = (time: number) => {
    const s = st.current;
    const bar = barRef.current;
    if (!bar || !s.dragging) return;

    // линза центром под пальцем, за краями — с сопротивлением, у пунктов — лёгкое притяжение
    const target = lensTarget(s.pointerX - s.left, s.w, count);

    // линза «догоняет» палец за 2–3 кадра — движение жидкое, без рывков
    const x = s.x + (target - s.x) * 0.55;
    const dt = Math.max(1, time - s.t);
    s.vx += ((x - s.x) / dt - s.vx) * 0.3; // px/мс, сглаженная
    s.x = x;
    s.t = time;

    bar.style.setProperty("--nb-x", `${x.toFixed(2)}px`);
    bar.style.setProperty("--nb-st", stretch(s.vx).toFixed(3));

    const i = clampIndex(Math.round(x / s.w));
    if (i !== s.pointed) {
      s.pointed = i;
      setPointed(i);
      tick();
    }
    s.raf = requestAnimationFrame(frame);
  };

  const finish = (commit: boolean) => {
    const s = st.current;
    const bar = barRef.current;
    cancelAnimationFrame(s.raf);
    clearTimeout(s.hold);

    let target = active;
    if (s.dragging) {
      // бросок: куда линза доехала бы по инерции
      if (commit) target = flickIndex(s.x, s.vx, s.w, count);
      s.justDragged = true;
      // клик, который браузер присылает после отпускания, — не выбор пункта
      setTimeout(() => {
        s.justDragged = false;
      }, 400);
    } else if (commit && s.pointed >= 0) {
      target = s.pointed;
      if (target === active) onReselect?.(target);
    }
    // пункт без своей страницы (onSelect вернул false) — линза возвращается на выбранный
    if (target !== active) {
      if (onSelect(target) === false) target = active;
      else tick();
    }

    if (bar) {
      // номер — сразу, не дожидаясь рендера: иначе линза на кадр поехала бы к прежнему пункту
      bar.style.setProperty("--nb-i", String(target));
      bar.style.removeProperty("--nb-x");
      bar.style.removeProperty("--nb-st");
      bar.removeAttribute("data-dragging");
      bar.removeAttribute("data-pressed");
      bar.removeAttribute("data-hold");
    }
    s.dragging = false;
    s.id = -1;
    s.pointed = -1;
    setPointed(null);
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || !e.isPrimary) return;
    const s = st.current;
    const bar = barRef.current;
    const first = bar
      ?.querySelector<HTMLElement>("[data-nav-item]")
      ?.getBoundingClientRect();
    if (!bar || !first) return;

    s.left = first.left;
    s.w = first.width || 1;
    s.id = e.pointerId;
    s.startX = s.pointerX = e.clientX;
    s.startY = e.clientY;
    s.dragging = false;
    s.justDragged = false;
    // нажатие сразу переносит линзу под палец, выбор — когда отпустили (как в iOS)
    s.pointed = indexAt(e.clientX - s.left, s.w, count);
    s.x = s.pointed * s.w;
    s.vx = 0;
    setPointed(s.pointed);
    bar.setAttribute("data-pressed", "");
    s.hold = window.setTimeout(
      () => bar.setAttribute("data-hold", ""),
      HOLD_MS,
    );
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const s = st.current;
    if (e.pointerId !== s.id) return;
    s.pointerX = e.clientX;
    if (s.dragging) return;

    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (Math.abs(dx) > DRAG_START && Math.abs(dx) > Math.abs(dy)) {
      const bar = barRef.current;
      if (!bar) return;
      s.dragging = true;
      s.t = performance.now();
      bar.setPointerCapture(e.pointerId);
      bar.setAttribute("data-dragging", "");
      s.raf = requestAnimationFrame(frame);
    } else if (Math.abs(dy) > DRAG_START * 2) {
      finish(false); // повели вверх-вниз — это прокрутка, а не меню
    }
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerId === st.current.id) finish(true);
  };

  const onPointerCancel = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerId === st.current.id) finish(false);
  };

  // клик с клавиатуры или мышью; клик сразу после перетаскивания пропускаем (false)
  const onItemClick = (index: number) => {
    if (st.current.justDragged) return false;
    onSelect(index);
    return true;
  };

  // «капля» по пути: при выборе нажатием линза вытягивается и пружинисто собирается обратно
  const prevShown = useRef(shown);
  useEffect(() => {
    const from = prevShown.current;
    prevShown.current = shown;
    const bar = barRef.current;
    if (!bar || from === shown || st.current.dragging) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const amp = dropAmplitude(from, shown);
    bar.animate(
      [
        { "--nb-st": "0" },
        { "--nb-st": String(amp), offset: 0.3 },
        { "--nb-st": "0" },
      ],
      { duration: 560, easing: "cubic-bezier(0.3, 0.7, 0.3, 1)" },
    );
  }, [shown, barRef]);

  useEffect(() => {
    const s = st.current;
    return () => {
      cancelAnimationFrame(s.raf);
      clearTimeout(s.hold);
    };
  }, []);

  return {
    shown,
    bind: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
    onItemClick,
  };
}
