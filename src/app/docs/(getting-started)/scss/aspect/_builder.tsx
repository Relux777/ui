"use client";

// Конструктор пропорций: соотношение сторон и ширина — высота считается сама, над примером настоящий размер.
// Ниже — как считается размер с полями и рамкой: box-border (поля внутри ширины, по умолчанию в RenDit SCSS)
// или box-content (поля и рамка прибавляются к ширине).

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
  Switch,
  useBox,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { RATIOS, SIZING, WIDTHS } from "./_classes";

// поля и рамка примера — чтобы было видно разницу box-border и box-content
const FRAME = "p-16 border-6 border-blue-300";

export function AspectBuilder({ css }: { css: CssMap }) {
  const [ratio, setRatio] = useState("aspect-video");
  const [width, setWidth] = useState("w-240");
  const [frame, setFrame] = useState(false);
  const [sizing, setSizing] = useState("box-border");
  const [boxRef, box] = useBox();

  const classes = [ratio, width, frame ? sizing : ""].filter(Boolean);

  return (
    <Builder
      controls={
        <>
          <Field label="Пропорции" note={ratio}>
            <Seg
              value={ratio}
              options={classOptions(RATIOS)}
              onChange={setRatio}
            />
          </Field>
          <Field label="Ширина" note={width}>
            <Range
              label="Ширина"
              values={WIDTHS}
              value={width}
              onChange={setWidth}
            />
          </Field>
          <Switch checked={frame} onChange={setFrame}>
            Поля и рамка (p-16 border-6)
          </Switch>
          {frame && (
            <Field label="Как считать ширину" note={sizing}>
              <Seg
                value={sizing}
                options={classOptions(SIZING)}
                onChange={setSizing}
              />
            </Field>
          )}
        </>
      }
      preview={
        <Canvas className="grid place-items-center">
          <ClassStyle css={css} classes={classes} />
          <div
            ref={boxRef}
            className={`${classes.join(" ")} ${frame ? FRAME : ""} max-w-full grid place-items-center br-lg bg-[linear-gradient(135deg,var(--violet-400),var(--pink-400)_60%,var(--orange-300))] [background-clip:padding-box] text-white font-13 font-w-700 transition-[width] duration-300 motion-reduce:transition-none`}
          >
            {box.width} × {box.height}
          </div>
        </Canvas>
      }
      output={
        <Output
          classes={[...classes, ...(frame ? FRAME.split(" ") : [])]}
          css={css}
        />
      }
    />
  );
}
