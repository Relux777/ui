"use client";

// Конструктор размытия: сам элемент (blur-N) или стекло — то, что под элементом (backdrop-blur-N).
// Превью на цветных кругах: у стекла видно, как размывается фон, у элемента — его собственный текст.

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
import { BLUR_VALUES } from "./_classes";

const MODES = [
  { id: "blur", title: "Сам элемент" },
  { id: "backdrop-blur", title: "Стекло · под элементом" },
] as const;
type Mode = (typeof MODES)[number]["id"];

export function BlurBuilder({ css }: { css: CssMap }) {
  const [mode, setMode] = useState<Mode>("backdrop-blur");
  const [value, setValue] = useState("backdrop-blur-12");

  const set = (next: Mode) => {
    const n = value.replace(/^(?:backdrop-)?blur-/, "");
    setMode(next);
    setValue(`${next}-${n}`);
  };

  const classes =
    mode === "backdrop-blur" ? [value, "bg-surface/60", "border"] : [value];

  return (
    <Builder
      controls={
        <>
          <Field label="Что размывать">
            <Seg value={mode} options={MODES} onChange={set} />
          </Field>
          <Field label="Радиус" note={value}>
            <Range
              label="Радиус"
              values={BLUR_VALUES.map((n) => `${mode}-${n}`)}
              value={value}
              onChange={setValue}
            />
          </Field>
        </>
      }
      preview={
        <Canvas className="grid place-items-center">
          <ClassStyle css={css} classes={classes} />
          <div className="relative grid place-items-center w-full min-h-220 br-lg overflow-hidden bg-background border">
            <span className="absolute -top-10 left-10 size-120 br-full bg-violet-400 blur-40" />
            <span className="absolute bottom-0 right-6 size-96 br-full bg-orange-400 blur-40" />
            <span className="absolute top-20 right-40 size-64 br-full bg-lime-300 blur-40" />
            {mode === "backdrop-blur" ? (
              <div
                className={`relative p-20 br-xl ${classes.join(" ")} font-14 font-w-600`}
              >
                Стекло: видно размытые круги под ним
              </div>
            ) : (
              <div
                className={`relative p-20 br-xl border bg-surface font-14 font-w-600 ${classes.join(" ")}`}
              >
                Размыт сам блок вместе с текстом
              </div>
            )}
          </div>
        </Canvas>
      }
      output={
        <Output
          classes={classes}
          css={css}
          code={(attr) => `<div ${attr}="${classes.join(" ")}">Стекло</div>`}
        />
      }
    />
  );
}
