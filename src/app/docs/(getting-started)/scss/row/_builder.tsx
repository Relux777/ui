"use client";

// Конструктор сетки .row: сколько колонок и какой промежуток. Колонки — классы движка col-N,
// они сильнее базовых правил .row из слоя layout, поэтому ширина задаётся прямо в разметке.

import { useState } from "react";
import {
  Builder,
  Canvas,
  Field,
  Output,
  Range,
  Seg,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { GUTTERS, SETS } from "./_classes";

type SetId = (typeof SETS)[number]["id"];

export function RowBuilder({ css }: { css: CssMap }) {
  const [setId, setSetId] = useState<SetId>("3");
  const [gutter, setGutter] = useState("gutter-20");

  const set = SETS.find((s) => s.id === setId) ?? SETS[1];

  return (
    <Builder
      controls={
        <>
          <Field label="Колонки">
            <Seg
              value={setId}
              options={SETS.map((s) => ({ id: s.id, title: s.title }))}
              onChange={setSetId}
            />
          </Field>
          <Field label="Промежуток" note={gutter}>
            <Range
              label="Промежуток"
              values={GUTTERS.map((n) => `gutter-${n}`)}
              value={gutter}
              onChange={setGutter}
            />
          </Field>
        </>
      }
      preview={
        <Canvas>
          <div className={`row ${gutter}`}>
            {Array.from({ length: set.cards }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: колонки примера одинаковые
              <div key={i} className={set.col}>
                <div className="grid place-items-center min-h-64 br-md bg-blue-500/15 border border-blue-500/30 font-12 font-w-600">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </Canvas>
      }
      output={
        <Output
          classes={["row", gutter, set.col]}
          css={css}
          code={(attr) => `<div ${attr}="row ${gutter}">
  <div ${attr}="${set.col}">…</div>
  <div ${attr}="${set.col}">…</div>
</div>`}
        />
      }
    />
  );
}
