"use client";

// Вопрос-ответ на <details>: открывается и закрывается плавно — высота ответа едет на пружине (Web Animations
// API), стрелка поворачивается. Работает везде, в т. ч. в Safari на iPhone: ::details-content и
// interpolate-size есть не во всех браузерах. Нажали снова посреди анимации — она разворачивается с того же
// места. Без JS и при «уменьшении движения» — обычный <details>.

import { ChevronDown } from "@boxicons/react/ChevronDown";
import { type MouseEvent, type ReactNode, useRef } from "react";

const OPEN_MS = 520;
const CLOSE_MS = 300;

// та же пружина, что у класса ease-spring: linear(…) или запасная cubic-bezier (settings/_motion.scss)
const spring = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue("--ease-spring")
    .trim() || "ease-out";

export function Accordion({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const anim = useRef<Animation | null>(null);

  const toggle = (e: MouseEvent) => {
    const details = ref.current;
    const body = bodyRef.current;
    if (!details || !body) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    // высота сейчас — в том числе посреди прошлой анимации
    const from = details.open ? body.getBoundingClientRect().height : 0;
    anim.current?.cancel();

    if (!details.open || details.dataset.closing !== undefined) {
      delete details.dataset.closing;
      details.open = true;
      anim.current = body.animate(
        [
          { height: `${from}px`, opacity: from ? 1 : 0 },
          { height: `${body.scrollHeight}px`, opacity: 1 },
        ],
        { duration: OPEN_MS, easing: spring() },
      );
      return;
    }

    details.dataset.closing = "";
    anim.current = body.animate(
      [
        { height: `${from}px`, opacity: 1 },
        { height: "0px", opacity: 0 },
      ],
      { duration: CLOSE_MS, easing: "cubic-bezier(0.4, 0, 1, 1)" },
    );
    anim.current.onfinish = () => {
      details.open = false;
      delete details.dataset.closing;
    };
  };

  // «открыт» для оформления — пока не начал закрываться
  return (
    <details
      ref={ref}
      className="group br-lg border bg-surface shadow-1 transition-shadow duration-300 [&[open]:not([data-closing])]:shadow-3"
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: <summary> — интерактивный сам: фокус, Enter и пробел у браузера */}
      <summary
        onClick={toggle}
        className="flex items-center justify-between gap-12 px-16 py-14 font-15 font-w-600 cursor-pointer select-none [&::-webkit-details-marker]:hidden"
      >
        {question}
        <ChevronDown
          size="sm"
          aria-hidden="true"
          className="shrink-0 text-foreground-muted transition-[rotate] duration-400 ease-spring group-[[open]:not([data-closing])]:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div ref={bodyRef} className="overflow-hidden">
        <div className="flex flex-col gap-10 px-16 pb-16 font-14 text-foreground-muted">
          {children}
        </div>
      </div>
    </details>
  );
}
