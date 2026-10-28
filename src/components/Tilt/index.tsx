"use client";

// 3D-наклон карточки за курсором (.tilt, RenDit SCSS components/_tilt.scss) и мягкий свет цветов RenDit,
// который бежит по ней за курсором (.tilt-light):
//   <div className="tilt relative isolate …"><Tilt />…</div>
// Кладётся внутрь карточки и раз в кадр пишет на неё углы --tilt-x / --tilt-y и место света --mx / --my —
// плавность даёт CSS. Только мышь и трекпад: на телефоне курсора нет, а наклон под пальцем мешал бы нажимать.

import { useEffect, useRef } from "react";

export function Tilt({
  max = 4,
}: {
  /** наибольший наклон, градусы */
  max?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = ref.current?.parentElement;
    if (!card || !matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      // сторона под курсором уходит вглубь: курсор у верха — верх от нас, у левого края — левый край
      const fx = x / card.offsetWidth - 0.5;
      const fy = y / card.offsetHeight - 0.5;
      card.style.setProperty("--tilt-x", `${(-fy * 2 * max).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(fx * 2 * max).toFixed(2)}deg`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      // от центра: рамка наклонённой карточки на экране чуть больше самой карточки
      const r = card.getBoundingClientRect();
      x = e.clientX - r.left - r.width / 2 + card.offsetWidth / 2;
      y = e.clientY - r.top - r.height / 2 + card.offsetHeight / 2;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      onMove(e);
      card.dataset.spot = "";
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      card.removeAttribute("data-spot");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [max]);

  return <span ref={ref} className="tilt-light" aria-hidden="true" />;
}
