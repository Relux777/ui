"use client";

// Конструктор появления: выберите эффект и длительность, нажмите «Показать» — элемент монтируется заново,
// поэтому @starting-style срабатывает каждый раз. Всё на классах движка.

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
import { BASE, DURATIONS, EFFECTS } from "./_classes";

type Effect = (typeof EFFECTS)[number]["id"];

export function EnterBuilder({ css }: { css: CssMap }) {
  const [effect, setEffect] = useState<Effect>("up");
  const [duration, setDuration] = useState("duration-300");
  const [n, setN] = useState(0);

  const current = EFFECTS.find((e) => e.id === effect) ?? EFFECTS[1];
  const classes = [...BASE, ...current.cls.split(" "), duration];

  return (
    <Builder
      controls={
        <>
          <Field label="Появление">
            <Seg
              value={effect}
              options={EFFECTS.map((e) => ({ id: e.id, title: e.title }))}
              onChange={setEffect}
            />
          </Field>
          <Field label="Длительность" note={duration}>
            <Seg
              value={duration}
              options={DURATIONS.map((d) => ({
                id: d,
                title: `${d.replace("duration-", "")} мс`,
              }))}
              onChange={setDuration}
            />
          </Field>
          <button
            type="button"
            onClick={() => setN((v) => v + 1)}
            className="self-start h-40 px-20 br-full bg-primary text-primary-foreground font-13 font-w-600 transition-transform active:scale-95 motion-reduce:transition-none"
          >
            Показать
          </button>
        </>
      }
      preview={
        <Canvas className="grid place-items-center">
          <ClassStyle css={css} classes={classes} />
          <div
            key={n}
            className={`w-full max-w-320 p-20 br-xl bg-gradient-brand text-white font-14 font-w-600 shadow-3 ${classes.join(" ")}`}
          >
            Появилось
          </div>
        </Canvas>
      }
      output={
        <Output
          classes={classes}
          css={css}
          code={(attr) => `<div ${attr}="${classes.join(" ")}">Появилось</div>`}
        />
      }
    />
  );
}
