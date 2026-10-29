"use client";

// Конструктор промежутков: gap во flex и grid (по осям отдельно) и space-x / space-y для обычных блоков.
// Промежутки подсвечены штриховкой — видно, где они и что у крайних детей лишнего отступа нет.

import { useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  Field,
  Output,
  Range,
  Seg,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { GAP_X, GAP_Y, MODES, type Mode, SPACE_X, SPACE_Y } from "./_classes";

const COUNTS = ["2", "3", "4", "6", "8"];

// одинаковые классы, если по осям одно и то же: gap-x-12 gap-y-12 → gap-12
function short(x: string, y: string) {
  const n = x.split("-").at(-1);
  return n === y.split("-").at(-1) ? [`gap-${n}`] : [x, y];
}

export function GapBuilder({ css }: { css: CssMap }) {
  const [mode, setMode] = useState<Mode>("flex");
  const [x, setX] = useState("gap-x-16");
  const [y, setY] = useState("gap-y-8");
  const [spaceX, setSpaceX] = useState("space-x-12");
  const [spaceY, setSpaceY] = useState("space-y-12");
  const [count, setCount] = useState("6");

  const container =
    mode === "flex"
      ? ["flex", "flex-wrap", x, y]
      : mode === "grid"
        ? ["grid", "grid-cols-3", x, y]
        : mode === "space-x"
          ? ["flex", spaceX]
          : [spaceY];
  const shown =
    mode === "flex"
      ? ["flex", "flex-wrap", ...short(x, y)]
      : mode === "grid"
        ? ["grid", "grid-cols-3", ...short(x, y)]
        : container;

  return (
    <Builder
      controls={
        <>
          <Field label="Где промежутки">
            <Seg value={mode} options={MODES} onChange={setMode} />
          </Field>
          {(mode === "flex" || mode === "grid") && (
            <>
              <Field label="По горизонтали" note={x}>
                <Range
                  label="По горизонтали"
                  values={GAP_X}
                  value={x}
                  onChange={setX}
                />
              </Field>
              <Field label="По вертикали" note={y}>
                <Range
                  label="По вертикали"
                  values={GAP_Y}
                  value={y}
                  onChange={setY}
                />
              </Field>
            </>
          )}
          {mode === "space-x" && (
            <Field label="Между соседями" note={spaceX}>
              <Range
                label="Между соседями"
                values={SPACE_X}
                value={spaceX}
                onChange={setSpaceX}
              />
            </Field>
          )}
          {mode === "space-y" && (
            <Field label="Между строками" note={spaceY}>
              <Range
                label="Между строками"
                values={SPACE_Y}
                value={spaceY}
                onChange={setSpaceY}
              />
            </Field>
          )}
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
          <ClassStyle css={css} classes={container} />
          {/* штриховка фона — это и есть промежутки: дети закрывают её собой */}
          <div
            className={`${container.join(" ")} max-w-320 p-0 br-md bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--pink-500)_30%,transparent)_0_4px,transparent_4px_8px)]`}
          >
            {Array.from({ length: Number(count) }, (_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: дети пронумерованы, порядок не меняется
                key={i}
                className="grid place-items-center h-40 min-w-64 px-10 br-md bg-blue-500 text-white font-13 font-w-700"
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
