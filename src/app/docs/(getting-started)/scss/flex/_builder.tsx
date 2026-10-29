"use client";

// Конструктор flex: направление, перенос, выравнивание по главной оси (justify-) и поперёк (items-), промежуток
// и сколько детей. Дети разной высоты — видно, как работают items-stretch и items-baseline; много детей и
// flex-wrap — переносятся на новую строку.

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
import { DIRECTIONS, GAPS, ITEMS, JUSTIFY, WRAPS } from "./_classes";

const COUNTS = ["2", "3", "4", "5", "6", "8", "10"];
// дети разной высоты и ширины: так видно выравнивание поперёк и перенос
const SIZES = [
  "py-8 w-56",
  "py-16 w-72",
  "py-12 w-48",
  "py-20 w-64",
  "py-10 w-80",
];

export function FlexBuilder({ css }: { css: CssMap }) {
  const [direction, setDirection] = useState("flex-row");
  const [wrap, setWrap] = useState("flex-nowrap");
  const [justify, setJustify] = useState("justify-start");
  const [items, setItems] = useState("items-center");
  const [gap, setGap] = useState("gap-8");
  const [count, setCount] = useState("4");

  const classes = ["flex", direction, wrap, justify, items, gap];
  const shown = classes.filter(
    (c) =>
      !["flex-row", "flex-nowrap", "justify-start", "items-stretch"].includes(
        c,
      ),
  );

  return (
    <Builder
      controls={
        <>
          <Field label="Направление" note={direction}>
            <Seg
              value={direction}
              options={classOptions(DIRECTIONS)}
              onChange={setDirection}
            />
          </Field>
          <Field label="Главная ось" note={justify}>
            <Seg
              value={justify}
              options={classOptions(JUSTIFY)}
              onChange={setJustify}
            />
          </Field>
          <Field label="Поперёк" note={items}>
            <Seg
              value={items}
              options={classOptions(ITEMS)}
              onChange={setItems}
            />
          </Field>
          <Field label="Перенос" note={wrap}>
            <Seg
              value={wrap}
              options={classOptions(WRAPS)}
              onChange={setWrap}
            />
          </Field>
          <Field label="Промежуток" note={gap}>
            <Range
              label="Промежуток"
              values={GAPS}
              value={gap}
              onChange={setGap}
            />
          </Field>
          <Field label="Сколько детей" note={count}>
            <Range
              label="Сколько детей"
              values={COUNTS}
              value={count}
              onChange={setCount}
            />
          </Field>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          <div
            className={`${classes.join(" ")} min-h-200 p-8 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)]`}
          >
            {Array.from({ length: Number(count) }, (_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: дети пронумерованы, порядок не меняется
                key={i}
                className={`${SIZES[i % SIZES.length]} shrink-0 grid place-items-center br-md bg-blue-500 text-white font-13 font-w-700`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </Canvas>
      }
      output={<Output classes={shown} css={css} inner="…" />}
    />
  );
}
