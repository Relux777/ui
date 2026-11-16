"use client";

// Конструктор прокрутки: тонкая полоса или без неё, плавный переход к якорю и отступ цели под липкую шапку.
// Внутри превью — настоящая прокрутка: нажмите «К цели» и посмотрите, где остановится заголовок.

import { useRef, useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  Field,
  Output,
  Range,
  Seg,
  Switch,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { BARS, SCROLL_MT } from "./_classes";

type Bar = (typeof BARS)[number]["id"];

export function ScrollBuilder({ css }: { css: CssMap }) {
  const [bar, setBar] = useState<Bar>("scrollbar-thin");
  const [smooth, setSmooth] = useState(true);
  const [mt, setMt] = useState("scroll-mt-80");
  const target = useRef<HTMLDivElement>(null);

  const classes = [bar, smooth ? "scroll-smooth" : "", mt].filter(Boolean);

  return (
    <Builder
      controls={
        <>
          <Field label="Полоса прокрутки">
            <Seg value={bar} options={BARS} onChange={setBar} />
          </Field>
          <Switch checked={smooth} onChange={setSmooth}>
            Плавно к якорю — scroll-smooth
          </Switch>
          <Field label="Отступ цели" note={mt}>
            <Range
              label="Отступ цели"
              values={SCROLL_MT.map((n) => `scroll-mt-${n}`)}
              value={mt}
              onChange={setMt}
            />
          </Field>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          <div
            className={`h-240 overflow-y-auto overscroll-contain br-lg border bg-surface ${bar} ${smooth ? "scroll-smooth" : ""}`}
          >
            <div className="sticky top-0 z-1 flex items-center h-40 px-12 border-b bg-surface/90 backdrop-blur-4 font-12 font-w-600">
              Шапка списка
            </div>
            <div className="flex flex-col gap-6 p-12">
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: строки списка одинаковые
                  key={i}
                  className="flex items-center h-40 px-10 br-md bg-surface-muted font-12 text-foreground-muted"
                >
                  Строка {i + 1}
                </span>
              ))}
              <div
                ref={target}
                className={`${mt} p-12 br-md bg-secondary/12 font-13 font-w-600 text-secondary`}
              >
                Цель — заголовок останавливается под шапкой
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => target.current?.scrollIntoView({ block: "start" })}
            className="mt-12 h-40 px-20 br-full bg-primary text-primary-foreground font-13 font-w-600 transition-transform active:scale-95 motion-reduce:transition-none"
          >
            К цели
          </button>
        </Canvas>
      }
      output={
        <Output
          classes={classes}
          css={css}
          code={(attr) => `<div ${attr}="${classes.join(" ")}">
  <h2>Цель</h2>
</div>`}
        />
      }
    />
  );
}
