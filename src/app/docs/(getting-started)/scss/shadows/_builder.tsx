"use client";

// Конструктор теней: тень, фон позади, цвет кнопки, элемент (SVG / кнопка) и тема. Превью и CSS — от движка.
// data-theme оборачивает холст, чтобы токены кнопки (bg-surface и другие) перекрашивались вместе с темой.
// Фон и цвет выбираются цветными свотчами — сразу видно, что выбираешь.

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

// цвет кнопки/элемента: семантические токены, меняются с темой
const COLORS = [
  {
    id: "surface",
    title: "Поверхность",
    bg: "bg-surface",
    text: "text-foreground",
  },
  {
    id: "muted",
    title: "Приглушённый",
    bg: "bg-surface-muted",
    text: "text-foreground",
  },
  {
    id: "inverse",
    title: "Инверсия",
    bg: "bg-surface-inverse",
    text: "text-foreground-inverse",
  },
  {
    id: "primary",
    title: "Primary",
    bg: "bg-primary",
    text: "text-primary-foreground",
  },
  {
    id: "secondary",
    title: "Secondary",
    bg: "bg-secondary",
    text: "text-secondary-foreground",
  },
  {
    id: "accent",
    title: "Accent",
    bg: "bg-accent",
    text: "text-accent-foreground",
  },
  {
    id: "transparent",
    title: "Прозрачный",
    bg: "bg-transparent",
    text: "text-foreground",
  },
] as const;
type Color = (typeof COLORS)[number]["id"];

// фон позади — куда падает тень
const FONDS = [
  { id: "white", title: "Белый", color: "#ffffff" },
  { id: "gray", title: "Светло-серый", color: "#eeeeee" },
  { id: "graphite", title: "Графит", color: "#1a1a1a" },
  { id: "black", title: "Чёрный", color: "#070707" },
] as const;
type Fond = (typeof FONDS)[number]["id"];

const ELEMENTS = [
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

// свотч: круг с цветом, у выбранного — кольцо secondary
const SWATCH =
  "size-28 br-full border-2 border-border transition-[border-color,scale] duration-200 hover:scale-110 aria-pressed:border-secondary motion-reduce:transition-none";

const CHECKER =
  "conic-gradient(#c8c8c8 25%, transparent 0 50%, #c8c8c8 0 75%, transparent 0)";

export function ShadowBuilder({ css }: { css: CssMap }) {
  const [shadow, setShadow] = useState("shadow-4");
  const [fond, setFond] = useState<Fond>("white");
  const [color, setColor] = useState<Color>("surface");
  const [el, setEl] = useState<Element>("button");
  const [theme, setTheme] = useState<Theme>("system");

  const c = COLORS.find((x) => x.id === color) ?? COLORS[0];
  const f = FONDS.find((x) => x.id === fond) ?? FONDS[0];

  const preview =
    el === "svg" ? (
      <span
        className={`size-56 br-xl grid place-items-center ${c.bg} ${c.text} ${shadow}`}
      >
        <Layers width={24} height={24} aria-hidden="true" />
      </span>
    ) : (
      <button
        type="button"
        className={`px-20 py-10 br-full ${c.bg} ${c.text} ${shadow} font-13 font-w-600`}
      >
        Кнопка
      </button>
    );

  const cls = `${c.bg} ${c.text} ${shadow}`;
  const code = (attr: "className" | "class") =>
    el === "svg"
      ? `<span ${attr}="${cls}">…</span>`
      : `<button ${attr}="${cls}">Кнопка</button>`;

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
          <Field label="Фон" note={f.title}>
            <div className="flex gap-8">
              {FONDS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  title={x.title}
                  aria-label={x.title}
                  aria-pressed={fond === x.id}
                  onClick={() => setFond(x.id)}
                  style={{ background: x.color }}
                  className={SWATCH}
                />
              ))}
            </div>
          </Field>
          <Field label="Цвет кнопки" note={c.title}>
            <div className="flex gap-8">
              {COLORS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  title={x.title}
                  aria-label={x.title}
                  aria-pressed={color === x.id}
                  onClick={() => setColor(x.id)}
                  style={{
                    background:
                      x.id === "transparent"
                        ? CHECKER
                        : `var(${x.bg.replace("bg-", "--")})`,
                  }}
                  className={SWATCH}
                />
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
        <div
          data-theme={theme === "system" ? undefined : theme}
          className="min-w-0"
        >
          <Canvas className="min-h-180">
            <ClassStyle css={css} classes={[shadow]} />
            <div
              style={{ background: f.color }}
              className="flex items-center justify-center min-h-140 br-lg"
            >
              {preview}
            </div>
          </Canvas>
        </div>
      }
      output={<Output classes={cls.split(" ")} css={css} code={code} />}
    />
  );
}
