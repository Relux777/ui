"use client";

// Конструктор адаптива: способ раскладки и сколько карточек. Превью живёт по-настоящему — меняет
// раскладку вместе с окном, а сверху видно, какой сейчас брейкпоинт. Классы строкой целиком.

import { useEffect, useState } from "react";
import { Builder, Canvas, Field, Output, Seg } from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { FLEX_CARD, FLEX_PARENT, GRID_PARENT } from "./_classes";

const MODES = [
  { id: "flex", title: "Доли · flex" },
  { id: "grid", title: "Сетка · grid" },
] as const;
type Mode = (typeof MODES)[number]["id"];

const COUNTS = [3, 6] as const;

const BREAKPOINTS = [
  { id: "base", title: "телефон", from: 0, to: 619 },
  { id: "sm", title: "sm", from: 620, to: 769 },
  { id: "md", title: "md", from: 770, to: 989 },
  { id: "lg", title: "lg", from: 990, to: 1199 },
  { id: "xl", title: "xl", from: 1200, to: 1399 },
  { id: "2xl", title: "2xl", from: 1400, to: Number.POSITIVE_INFINITY },
];

// ширина окна и брейкпоинт: на сервере окна нет — до первого кадра «—»
function useBreakpoint() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return {
    width,
    current: BREAKPOINTS.find((b) => width >= b.from && width <= b.to)?.id,
  };
}

export function ResponsiveBuilder({ css }: { css: CssMap }) {
  const [mode, setMode] = useState<Mode>("flex");
  const [count, setCount] = useState<number>(6);
  const { width, current } = useBreakpoint();

  const parent = mode === "flex" ? FLEX_PARENT : GRID_PARENT;
  const card = mode === "flex" ? FLEX_CARD : "";
  const classes = [parent, card].filter(Boolean);

  const code = (attr: "className" | "class") =>
    mode === "flex"
      ? `<div ${attr}="${FLEX_PARENT}">
  <article ${attr}="${FLEX_CARD}">…</article>
  <article ${attr}="${FLEX_CARD}">…</article>
</div>`
      : `<div ${attr}="${GRID_PARENT}">
  <article>…</article>
  <article>…</article>
</div>`;

  return (
    <Builder
      controls={
        <>
          <Field label="Раскладка">
            <Seg value={mode} options={MODES} onChange={setMode} />
          </Field>
          <Field label="Карточек">
            <Seg
              value={String(count)}
              options={COUNTS.map((n) => ({ id: String(n), title: String(n) }))}
              onChange={(v) => setCount(Number(v))}
            />
          </Field>
          <div className="flex flex-col gap-8">
            <span className="font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
              Сейчас · {width ? `${width}px` : "—"}
            </span>
            <div className="flex flex-wrap gap-4">
              {BREAKPOINTS.map((b) => (
                <span
                  key={b.id}
                  aria-current={current === b.id ? "true" : undefined}
                  className="px-8 py-3 br-full border font-12 font-w-600 text-foreground-muted aria-[current=true]:border-secondary aria-[current=true]:bg-secondary/10 aria-[current=true]:text-secondary"
                >
                  {b.title}
                </span>
              ))}
            </div>
            <span className="font-12 text-foreground-muted">
              Потяните окно — карточки перестроятся сами.
            </span>
          </div>
        </>
      }
      preview={
        <Canvas>
          {mode === "flex" ? (
            <div className={FLEX_PARENT}>
              {Array.from({ length: count }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: карточки примера одинаковые
                <article key={i} className={FLEX_CARD}>
                  <div className="grid place-items-center h-64 br-md bg-blue-500 text-white font-12 font-w-600">
                    Карточка {i + 1}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={GRID_PARENT}>
              {Array.from({ length: count }, (_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: карточки примера одинаковые
                  key={i}
                  className="grid place-items-center h-64 br-md bg-blue-500 text-white font-12 font-w-600"
                >
                  Карточка {i + 1}
                </div>
              ))}
            </div>
          )}
        </Canvas>
      }
      output={<Output classes={classes} css={css} code={code} />}
    />
  );
}
