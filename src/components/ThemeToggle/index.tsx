"use client";

// Переключатель светлой/тёмной темы (подход из ozon: theme-switch).
//
// Почему иконка больше не дёргается: раньше кнопка ждала гидратации (useState mounted) и до неё всегда
// рисовала луну — в тёмной теме луна сразу менялась на солнце. Теперь в разметке обе иконки лежат друг
// на друге, а видимую выбирает CSS по data-theme на <html> (классы dark:…). next-themes ставит data-theme
// до первой отрисовки, поэтому нужная иконка видна сразу, без JS и без расхождения с серверным HTML.
//
// Анимация — Web Animations API только в момент клика: уходящая иконка проворачивается и гаснет,
// новая выкручивается навстречу и встаёт с пружинкой. На неё не действует disableTransitionOnChange
// провайдера (он на время смены темы отключает CSS-переходы). При «уменьшении движения» в системе — без анимации.

import { Moon } from "@boxicons/react/Moon";
import { Sun } from "@boxicons/react/Sun";
import { useTheme } from "next-themes";
import { useRef } from "react";

const ICON_IN_MS = 500;
const ICON_OUT_MS = 250;
// лёгкий «перелёт» в конце — иконка встаёт на место с пружинкой
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const ICON_SIZE = 20;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const sunRef = useRef<HTMLSpanElement>(null);
  const moonRef = useRef<HTMLSpanElement>(null);

  const animateIcons = (next: "light" | "dark") => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [incoming, outgoing] =
      next === "dark"
        ? [sunRef.current, moonRef.current]
        : [moonRef.current, sunRef.current];

    outgoing?.animate(
      [
        { opacity: 1, rotate: "0deg", scale: 1 },
        { opacity: 0, rotate: "90deg", scale: 0.4 },
      ],
      { duration: ICON_OUT_MS, easing: "ease-in" },
    );
    incoming?.animate(
      [
        { opacity: 0, rotate: "-90deg", scale: 0.4 },
        { opacity: 1, rotate: "0deg", scale: 1 },
      ],
      { duration: ICON_IN_MS, easing: SPRING },
    );
  };

  const toggleTheme = () => {
    // до гидратации resolvedTheme ещё нет — берём тему, которую next-themes уже поставил на <html>
    const current = resolvedTheme ?? document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    animateIcons(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Сменить тему"
      className="size-36 br-full grid place-items-center text-foreground transition opacity-80 hover:opacity-100 active:opacity-100 hover:shadow-7 active:shadow-7 active:bg-surface-muted/50  active:scale-92"
    >
      {/* солнце видно в тёмной теме, луна — в светлой; скрытая повёрнута и уменьшена — с этого места она «выкручивается» */}
      <span
        ref={sunRef}
        aria-hidden="true"
        className="[grid-area:1/1] flex opacity-0 -rotate-90 scale-40 dark:opacity-100 dark:rotate-0 dark:scale-100"
      >
        <Sun
          width={ICON_SIZE}
          height={ICON_SIZE}
          className="color-foreground-muted"
        />
      </span>
      <span
        ref={moonRef}
        aria-hidden="true"
        className="[grid-area:1/1] flex dark:opacity-0 dark:rotate-90 dark:scale-40"
      >
        <Moon width={ICON_SIZE} height={ICON_SIZE} />
      </span>
    </button>
  );
}
