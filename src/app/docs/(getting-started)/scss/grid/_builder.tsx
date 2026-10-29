"use client";

// Конструктор сетки: число колонок, автозаполнение без брейкпоинтов (grid-fill — пустые колонки остаются,
// grid-fit — карточки растягиваются на всё место) или свой шаблон. Меняйте ширину родителя и число карточек —
// видно, когда сетка сама перестраивается.

import { useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  classOptions,
  Field,
  Output,
  Range,
  Seg,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { COLS, FILL, FIT, GAPS, MODES, type Mode, TEMPLATES } from "./_classes";

const COUNTS = ["1", "2", "3", "4", "5", "6", "8", "9"];
const PARENT = ["40", "55", "70", "85", "100"];

const NOTES: Record<Mode, string> = {
  cols: "Ровно столько колонок, сколько сказано, при любой ширине.",
  fill: "Колонок столько, сколько влезет (не уже N px). Мало карточек — справа остаются пустые колонки.",
  fit: "Как fill, но пустые колонки схлопываются: мало карточек — они растягиваются на всю ширину.",
  template:
    "Свои размеры колонок: px — ровно, fr — доля остатка, auto — по содержимому.",
};

export function GridBuilder({ css }: { css: CssMap }) {
  const [mode, setMode] = useState<Mode>("fill");
  const [cols, setCols] = useState("grid-cols-3");
  const [fill, setFill] = useState("grid-fill-120");
  const [fit, setFit] = useState("grid-fit-120");
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [gap, setGap] = useState("gap-8");
  const [count, setCount] = useState("3");
  const [parent, setParent] = useState("100");

  const track =
    mode === "cols"
      ? cols
      : mode === "fill"
        ? fill
        : mode === "fit"
          ? fit
          : template;
  const classes = ["grid", track, gap];

  return (
    <Builder
      controls={
        <>
          <Field label="Как задать колонки">
            <Seg value={mode} options={MODES} onChange={setMode} />
          </Field>
          {mode === "cols" && (
            <Field label="Колонок" note={cols}>
              <Range
                label="Колонок"
                values={COLS}
                value={cols}
                onChange={setCols}
              />
            </Field>
          )}
          {mode === "fill" && (
            <Field label="Не уже чем" note={fill}>
              <Seg
                value={fill}
                options={classOptions(FILL)}
                onChange={setFill}
              />
            </Field>
          )}
          {mode === "fit" && (
            <Field label="Не уже чем" note={fit}>
              <Seg value={fit} options={classOptions(FIT)} onChange={setFit} />
            </Field>
          )}
          {mode === "template" && (
            <Field label="Шаблон" note={template}>
              <Seg
                value={template}
                options={classOptions(TEMPLATES)}
                onChange={setTemplate}
              />
            </Field>
          )}
          <Field label="Промежуток" note={gap}>
            <Range
              label="Промежуток"
              values={GAPS}
              value={gap}
              onChange={setGap}
            />
          </Field>
          <Field label="Карточек" note={count}>
            <Range
              label="Карточек"
              values={COUNTS}
              value={count}
              onChange={setCount}
            />
          </Field>
          <Field label="Ширина родителя" note={`${parent}%`}>
            <Range
              label="Ширина родителя"
              values={PARENT}
              value={parent}
              onChange={setParent}
            />
          </Field>
          <p className="font-13 text-foreground-muted">{NOTES[mode]}</p>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          <div
            style={{ width: `${parent}%` }}
            className={`${classes.join(" ")} p-8 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)] transition-[width] duration-300 motion-reduce:transition-none`}
          >
            {Array.from({ length: Number(count) }, (_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: карточки пронумерованы, порядок не меняется
                key={i}
                className="grid place-items-center h-56 px-8 br-md bg-blue-500 text-white font-13 font-w-700"
              >
                {i + 1}
              </span>
            ))}
          </div>
        </Canvas>
      }
      output={<Output classes={classes} css={css} inner="…" />}
    />
  );
}
