"use client";

// Конструктор ячеек: сетка 4 колонки, восемь карточек, розовая растягивается на несколько колонок и строк и
// может начинаться с нужной колонки. grid-flow-dense — сетка заполняет дыры, которые остались после широкой
// карточки; grid-flow-col — заполняет по столбцам.

import { useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  classOptions,
  Field,
  Output,
  Seg,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { COL_SPAN, COL_START, FLOW, ROW_SPAN } from "./_classes";

const CELLS = [1, 2, 3, 4, 5, 6, 7, 8];
// розовая — вторая карточка
const PICKED = 2;

export function GridCellsBuilder({ css }: { css: CssMap }) {
  const [colSpan, setColSpan] = useState("col-span-3");
  const [rowSpan, setRowSpan] = useState("");
  const [colStart, setColStart] = useState("col-start-2");
  const [flow, setFlow] = useState("grid-flow-row");

  const cell = [colSpan, rowSpan, colStart].filter(Boolean);
  const container = [
    "grid",
    "grid-cols-4",
    flow,
    ...(flow === "grid-flow-col" ? ["grid-rows-3"] : []),
  ];
  const classes = [...container, ...cell];

  return (
    <Builder
      controls={
        <>
          <Field label="На сколько колонок" note={colSpan || "—"}>
            <Seg
              value={colSpan}
              options={classOptions(COL_SPAN)}
              onChange={setColSpan}
            />
          </Field>
          <Field label="На сколько строк" note={rowSpan || "—"}>
            <Seg
              value={rowSpan}
              options={classOptions(ROW_SPAN)}
              onChange={setRowSpan}
            />
          </Field>
          <Field label="С какой колонки" note={colStart || "—"}>
            <Seg
              value={colStart}
              options={classOptions(COL_START)}
              onChange={setColStart}
            />
          </Field>
          <Field label="Как заполнять сетку" note={flow}>
            <Seg value={flow} options={classOptions(FLOW)} onChange={setFlow} />
          </Field>
          <p className="font-13 text-foreground-muted">
            Розовая с col-start-2 и шириной в 3 колонки не влезает после первой
            — встаёт на новую строку, и остаётся дыра. grid-flow-dense её
            заполнит.
          </p>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          <div
            className={`${container.join(" ")} [grid-auto-rows:48px] gap-6 p-6 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)]`}
          >
            {CELLS.map((n) => (
              <span
                key={n}
                className={`${n === PICKED ? `${cell.join(" ")} bg-pink-500` : "bg-blue-500"} grid place-items-center br-md text-white font-13 font-w-700`}
              >
                {n}
              </span>
            ))}
          </div>
        </Canvas>
      }
      output={
        <Output
          classes={classes}
          css={css}
          code={(attr) => `<div ${attr}="${container.join(" ")} gap-6">
  <div>1</div>
  <div ${attr}="${cell.join(" ")}">2</div>
  …
</div>`}
        />
      }
    />
  );
}
