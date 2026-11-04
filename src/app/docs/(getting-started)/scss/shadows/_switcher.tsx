"use client";

// Тени в светлой и тёмной теме рядом. «Система» — как на сайте (без data-theme), «Светлая»/«Тёмная» — свой
// data-theme на обёртке меняет токены внутри неё (и surface, и --shadow-*), тему сайта не трогает.

import { useState } from "react";

const SEG =
  "h-30 px-12 br-full font-12 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2";

const SHADOWS = [
  ["shadow-1", "чуть приподнята: карточки"],
  ["shadow-2", "кнопки, чипы"],
  ["shadow-3", "под курсором"],
  ["shadow-4", "выпадающие меню"],
  ["shadow-5", "всплывающие панели"],
  ["shadow-6", "окна поверх страницы"],
  ["shadow-7", "кромка стеклянной таблетки"],
  ["shadow-8", "мягкая, из ReluxCode"],
  ["shadow-9", "стекло маленьких элементов"],
  ["shadow-10", "глубокая, из ReluxCode"],
  ["shadow-11", "парящая, из ReluxCode"],
  ["shadow-12", "самая глубокая"],
];

export function ShadowSwitcher() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const THEMES = [
    { id: "system", title: "Система" },
    { id: "light", title: "Светлая" },
    { id: "dark", title: "Тёмная" },
  ] as const;
  return (
    <div className="flex flex-col gap-12">
      <div className="flex gap-4 p-3 br-full bg-foreground/5 self-start">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={theme === t.id}
            onClick={() => setTheme(t.id)}
            className={SEG}
          >
            {t.title}
          </button>
        ))}
      </div>
      <div
        data-theme={theme === "system" ? undefined : theme}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12 p-16 sm:p-24 br-2xl bg-surface-muted/60"
      >
        {SHADOWS.map(([cls, note]) => (
          <div
            key={cls}
            className="flex flex-col gap-8 p-10 br-lg bg-surface-muted"
          >
            <span className={`mx-auto size-56 br-xl bg-surface ${cls}`} />
            <div className="flex flex-col gap-1 px-2">
              <code className="font-12 font-mono font-w-600">{cls}</code>
              <span className="font-11 text-foreground-muted">{note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
