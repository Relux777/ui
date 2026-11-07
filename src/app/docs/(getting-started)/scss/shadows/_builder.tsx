"use client";

// Конструктор теней: тень, фон, цвет кнопки и элемент (SVG / кнопка). Превью — два примера рядом,
// как на странице «Токены»: слева светлая тема, справа тёмная — видно тень на любом фоне и как
// цвет кнопки (токен) меняется с темой. CSS — от движка.

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

// цвет кнопки/элемента: семантические токены, в каждой половине превью — свой (светлый/тёмный)
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

// фон позади — куда падает тень; у каждого фона пара: светлая и тёмная половина
const FONDS = [
  { id: "white", title: "Белый", light: "#ffffff", dark: "#141414" },
  { id: "gray", title: "Серый", light: "#eeeeee", dark: "#1f1f1f" },
  { id: "black", title: "Чёрный", light: "#141414", dark: "#070707" },
] as const;
type Fond = (typeof FONDS)[number]["id"];

const ELEMENTS = [
  { id: "svg", title: "SVG" },
  { id: "button", title: "Кнопка" },
] as const;
type Element = (typeof ELEMENTS)[number]["id"];

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

  const c = COLORS.find((x) => x.id === color) ?? COLORS[0];
  const f = FONDS.find((x) => x.id === fond) ?? FONDS[0];

  const element =
    el === "svg" ? (
      <span
        className={`size-56 br-[100%] grid place-items-center ${c.bg} ${c.text} ${shadow}`}
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

  const side = (theme: "light" | "dark", label: string) => (
    <div
      data-theme={theme}
      style={{ background: f[theme] }}
      className="flex flex-col items-center justify-center gap-10 min-h-140 p-8"
    >
      <span className="font-11 font-w-600 uppercase letter-s-6 text-foreground-subtle">
        {label}
      </span>
      {element}
    </div>
  );

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
                  style={{
                    background: `linear-gradient(90deg, ${x.light} 50%, ${x.dark} 50%)`,
                  }}
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
        </>
      }
      preview={
        <Canvas className="min-h-180">
          <ClassStyle css={css} classes={[shadow]} />
          <div className="grid grid-cols-2 overflow-hidden br-lg">
            {side("light", "Светлая")}
            {side("dark", "Тёмная")}
          </div>
        </Canvas>
      }
      output={<Output classes={cls.split(" ")} css={css} code={code} />}
    />
  );
}
