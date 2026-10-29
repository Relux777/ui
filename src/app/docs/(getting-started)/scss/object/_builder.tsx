"use client";

// Конструктор картинки в рамке: картинка 3 : 2 в рамке других пропорций. Как вписать — обрезать по краям
// (cover), целиком с полями (contain), растянуть (fill), как есть (none) — и какой частью картинки
// дорожить при обрезке (object-position).

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
import { FITS, FRAMES, POSITIONS, type Position } from "./_classes";

const NOTES: Record<string, string> = {
  "object-cover": "Заполняет рамку, лишнее обрезано — для обложек и аватаров.",
  "object-contain": "Видно целиком, по краям — пустые поля. Логотипы, товары.",
  "object-fill": "Растянута по рамке — пропорции ломаются. Почти не нужен.",
  "object-none": "Своего размера, рамка показывает кусок.",
  "object-scale-down": "Как contain, но не крупнее своего размера.",
};

export function ObjectBuilder({ css }: { css: CssMap }) {
  const [fit, setFit] = useState("object-cover");
  const [position, setPosition] = useState<Position>("object-center");
  const [frame, setFrame] = useState("aspect-square");

  const imgClasses = [fit, position];

  return (
    <Builder
      controls={
        <>
          <Field label="Как вписать" note={fit}>
            <Seg value={fit} options={classOptions(FITS)} onChange={setFit} />
          </Field>
          <Field label="Чем дорожить при обрезке" note={position}>
            <Seg value={position} options={POSITIONS} onChange={setPosition} />
          </Field>
          <Field label="Рамка" note={frame}>
            <Seg
              value={frame}
              options={classOptions(FRAMES)}
              onChange={setFrame}
            />
          </Field>
          <p className="font-13 text-foreground-muted">{NOTES[fit]}</p>
        </>
      }
      preview={
        <Canvas className="grid place-items-center">
          <ClassStyle css={css} classes={[...imgClasses, frame]} />
          <div
            className={`${frame} w-200 br-lg border-2 border-dashed border-blue-400 bg-blue-500/6 overflow-hidden`}
          >
            {/* biome-ignore lint/performance/noImgElement: пример — обычный <img>, как в любом проекте */}
            <img
              src="/samples/landscape.svg"
              alt="Горы на закате"
              className={`${imgClasses.join(" ")} size-full`}
            />
          </div>
        </Canvas>
      }
      output={
        <Output
          classes={[...imgClasses, "size-full"]}
          css={css}
          code={(attr) => `<div ${attr}="${frame} overflow-hidden">
  <img ${attr}="size-full ${imgClasses.join(" ")}" src="…" alt="…">
</div>`}
        />
      }
    />
  );
}
