"use client";

// Конструктор теней: выберите тень, элемент (текст / SVG / кнопка) и тему — превью и CSS от движка.
// data-theme на превью меняет токены внутри него, тему сайта не трогает.

import { Layers } from "@boxicons/react/Layers";
import { useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  Field,
  Output,
  Seg,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";

const SHADOWS = [
  "shadow-1",
  "shadow-2",
  "shadow-3",
  "shadow-4",
  "shadow-5",
  "shadow-6",
  "shadow-7",
  "shadow-9",
  "shadow-8",
  "shadow-10",
  "shadow-11",
  "shadow-12",
  "shadow-inset",
  "shadow-line",
  "shadow-glass",
  "shadow-none",
];

const ELEMENTS = [
  { id: "card", title: "Текст" },
  { id: "svg", title: "SVG" },
  { id: "button", title: "Кнопка" },
] as const;
type Element = (typeof ELEMENTS)[number]["id"];

const THEMES = [
  { id: "system", title: "Система" },
  { id: "light", title: "Светлая" },
  { id: "dark", title: "Тёмная" },
] as const;
type Theme = (typeof THEMES)[number]["id"];

const CHIP =
  "h-30 px-10 br-full font-mono font-12 font-w-600 text-foreground-muted transition hover:text-foreground aria-pressed:bg-secondary aria-pressed:text-secondary-foreground";

export function ShadowBuilder({ css }: { css: CssMap }) {
  const [shadow, setShadow] = useState("shadow-4");
  const [el, setEl] = useState<Element>("card");
  const [theme, setTheme] = useState<Theme>("system");

  const preview =
    el === "card" ? (
      <div className={`p-20 br-xl bg-surface ${shadow} font-14`}>
        Карточка с текстом
      </div>
    ) : el === "svg" ? (
      <span
        className={`size-56 br-xl grid place-items-center bg-surface ${shadow}`}
      >
        <Layers width={24} height={24} aria-hidden="true" />
      </span>
    ) : (
      <span
        className={`px-20 py-10 br-full bg-surface ${shadow} font-13 font-w-600`}
      >
        Кнопка
      </span>
    );

  const code = (attr: "className" | "class") =>
    el === "card"
      ? `<div ${attr}="${shadow}">Карточка с текстом</div>`
      : el === "svg"
        ? `<span ${attr}="${shadow}">…</span>`
        : `<button ${attr}="${shadow}">Кнопка</button>`;

  return (
    <Builder
      controls={
        <>
          <Field label="Тень" note={shadow}>
            <div className="flex flex-wrap gap-4 p-3 br-xl bg-foreground/5">
              {SHADOWS.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={shadow === s}
                  onClick={() => setShadow(s)}
                  className={CHIP}
                >
                  {s.replace("shadow-", "")}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Элемент">
            <Seg value={el} options={ELEMENTS} onChange={setEl} />
          </Field>
          <Field label="Тема">
            <Seg value={theme} options={THEMES} onChange={setTheme} />
          </Field>
        </>
      }
      preview={
        <Canvas>
          <div
            data-theme={theme === "system" ? undefined : theme}
            className="flex items-center justify-center min-h-160"
          >
            <ClassStyle css={css} classes={[shadow]} />
            {preview}
          </div>
        </Canvas>
      }
      output={<Output classes={[shadow]} css={css} code={code} />}
    />
  );
}
