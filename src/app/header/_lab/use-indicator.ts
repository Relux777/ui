"use client";

// Плашка-указатель под пунктом меню: стоит под выбранным, при наведении едет к пункту под курсором,
// курсор ушёл — возвращается. Пишет на nav CSS-переменные: --il и --ir (левый и правый край пункта), --iw (ширина),
// и data-dir — куда едет (right | left): «тянучке» нужно, какой край догоняет.

import {
  type PointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useState,
} from "react";

export function useIndicator(navRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(0);

  const moveTo = useCallback(
    (i: number) => {
      const nav = navRef.current;
      const el = nav?.querySelector<HTMLElement>(`[data-item="${i}"]`);
      if (!nav || !el) return;
      const prev = Number.parseFloat(nav.style.getPropertyValue("--il"));
      const left = el.offsetLeft;
      if (!Number.isNaN(prev) && left !== prev)
        nav.dataset.dir = left > prev ? "right" : "left";
      nav.style.setProperty("--il", `${left}px`);
      nav.style.setProperty("--ir", `${left + el.offsetWidth}px`);
      nav.style.setProperty("--iw", `${el.offsetWidth}px`);
    },
    [navRef],
  );

  useEffect(() => {
    moveTo(active);
    const nav = navRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(() => moveTo(active));
    ro.observe(nav);
    return () => ro.disconnect();
  }, [active, moveTo, navRef]);

  const bind = {
    onPointerOver: (e: PointerEvent<HTMLElement>) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-item]",
      );
      if (item) moveTo(Number(item.dataset.item));
    },
    onPointerLeave: () => moveTo(active),
  };

  return { active, setActive, bind };
}
