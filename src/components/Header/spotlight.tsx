"use client";

// «Прожектор» (класс .spotlight, RenDit SCSS components/_spotlight.scss): мягкое пятно света по стеклу
// и подсвеченный кусок кромки идут за курсором. Кладётся внутрь элемента с relative и isolate. Только для мыши/трекпада (на телефоне курсора нет).
// Координаты пишутся в --mx/--my родителя раз в кадр, плавность даёт CSS.

import { useEffect, useRef } from "react";

export function Spotlight({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || !matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      host.style.setProperty("--mx", `${x}px`);
      host.style.setProperty("--my", `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onEnter = (e: PointerEvent) => {
      onMove(e);
      host.dataset.spot = "";
    };
    const onLeave = () => host.removeAttribute("data-spot");
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span ref={ref} className={`spotlight ${className}`} aria-hidden="true" />
  );
}
