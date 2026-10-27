"use client";

// «Окно браузера» для одного варианта шапки: внутри прокручивается страница-заглушка, шапка стоит поверх.
// Прокрутку окна переводит в CSS — без перерисовок React, прямо в style и атрибуты рамки:
//   --p           0…1 — первые 160px прокрутки (для анимаций «вместе с прокруткой»);
//   --progress    0…1 — сколько страницы прочитано;
//   data-scrolled — прокручено больше 24px;
//   data-dir      down | up — куда крутят сейчас.

import type { CSSProperties, ReactNode, UIEvent } from "react";
import { useRef } from "react";
import s from "../header.module.scss";

const RANGE = 160;

// цветные плитки под стеклом — на них видно размытие и преломление
const TILES = [
  "#7a5af8",
  "#ed70a7",
  "#f7ae49",
  "#0ca678",
  "#1c7ed6",
  "#b8e04a",
  "#f06548",
  "#0d5ef5",
];

export function Stage({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  const raf = useRef(0);

  const update = (el: HTMLDivElement) => {
    raf.current = 0;
    const frame = frameRef.current;
    if (!frame) return;
    const y = el.scrollTop;
    const max = el.scrollHeight - el.clientHeight;
    frame.style.setProperty("--p", String(Math.min(y / RANGE, 1)));
    frame.style.setProperty(
      "--progress",
      String(max > 0 ? Math.min(y / max, 1) : 0),
    );
    frame.toggleAttribute("data-scrolled", y > 24);
    const d = y - lastY.current;
    if (y <= 0) frame.dataset.dir = "up";
    else if (Math.abs(d) > 6) frame.dataset.dir = d > 0 ? "down" : "up";
    if (Math.abs(d) > 6 || y <= 0) lastY.current = y;
  };

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!raf.current) raf.current = requestAnimationFrame(() => update(el));
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: группа «окно-пример», fieldset здесь не по смыслу
    <div ref={frameRef} className={s.frame} role="group" aria-label={label}>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: окно прокручивается с клавиатуры */}
      <div className={s.screen} onScroll={onScroll} tabIndex={0}>
        <FakePage />
      </div>
      {children}
    </div>
  );
}

// Страница-заглушка без текста: полосы вместо строк, яркий баннер, плитки и крупные буквы
function FakePage() {
  const lines = (widths: number[]) => (
    <div className={s.lines}>
      {widths.map((w) => (
        <span key={w} className={s.line} style={{ inlineSize: `${w}%` }} />
      ))}
    </div>
  );
  const tiles = (from: number) => (
    <div className={s.tiles}>
      {[0, 1, 2, 3].map((k) => (
        <span
          key={k}
          className={s.tile}
          style={{ "--c": TILES[(from + k) % TILES.length] } as CSSProperties}
        />
      ))}
    </div>
  );

  return (
    <div className={s.page} aria-hidden="true">
      <div className={s.hero}>
        <span className={s.heroLine} style={{ inlineSize: "64%" }} />
        <span className={s.heroLine} style={{ inlineSize: "46%" }} />
        <span className={s.heroSub} style={{ inlineSize: "38%" }} />
        <div className={s.heroBtns}>
          <span />
          <span />
        </div>
      </div>
      {tiles(0)}
      {lines([92, 84, 70, 40])}
      <div className={s.bigText}>Liquid · Glass</div>
      <div className={s.stripes} />
      {tiles(4)}
      {lines([88, 95, 72, 56, 30])}
      <div className={s.bigText}>Water · Drop</div>
      {tiles(2)}
      {lines([90, 78, 60])}
    </div>
  );
}
