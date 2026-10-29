"use client";

// Конструктор смещений: блок absolute внутри родителя с relative, у каждой стороны своё смещение. Видно главное:
// смещение с одной стороны — двигает блок, с двух противоположных — растягивает его между ними. Готовые
// наборы — inset-0, inset-x-0, inset-y-0.

import { useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  classOptions,
  Field,
  Output,
  Seg,
  useBox,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { SIDES, type Side, sideValues } from "./_classes";

const PRESETS: { title: string; value: Record<Side, string> }[] = [
  {
    title: "Угол",
    value: { top: "top-16", right: "", bottom: "", left: "left-16" },
  },
  {
    title: "inset-0",
    value: {
      top: "top-0",
      right: "right-0",
      bottom: "bottom-0",
      left: "left-0",
    },
  },
  {
    title: "Полоса снизу",
    value: { top: "", right: "right-0", bottom: "bottom-0", left: "left-0" },
  },
  {
    title: "За угол",
    value: { top: "-top-12", right: "-right-12", bottom: "", left: "" },
  },
];

// четыре стороны одним классом, если совпадают — как сократил бы человек
function short(v: Record<Side, string>) {
  const all = [v.top, v.right, v.bottom, v.left];
  if (all.every((c) => c && c.replace(/^-?\w+-/, "") === "0"))
    return ["inset-0"];
  return all.filter(Boolean);
}

export function InsetBuilder({ css }: { css: CssMap }) {
  const [sides, setSides] = useState<Record<Side, string>>(PRESETS[0].value);
  const [boxRef, box] = useBox();
  const classes = [...SIDES.map((s) => sides[s.id]).filter(Boolean)];
  const output = ["absolute", ...short(sides)];

  return (
    <Builder
      controls={
        <>
          <Field label="Готовые наборы">
            <div className="flex flex-wrap gap-6">
              {PRESETS.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => setSides(p.value)}
                  className="h-30 px-12 br-full border font-12 font-w-600 transition hover:bg-foreground/5 active:scale-95"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </Field>
          {SIDES.map((s) => (
            <Field key={s.id} label={s.title} note={sides[s.id] || "—"}>
              <Seg
                value={sides[s.id]}
                options={classOptions(sideValues(s.id))}
                onChange={(v) => setSides({ ...sides, [s.id]: v })}
              />
            </Field>
          ))}
        </>
      }
      preview={
        <Canvas className="p-28!">
          <ClassStyle css={css} classes={classes} />
          <div className="relative h-200 br-lg border-2 border-dashed border-blue-400 bg-blue-500/6">
            <span className="absolute top-6 left-8 font-11 font-mono text-blue-600">
              relative
            </span>
            <div
              ref={boxRef}
              className={`absolute ${classes.join(" ")} grid place-items-center min-w-64 min-h-40 px-10 br-lg bg-pink-500/90 text-white font-12 font-w-700`}
            >
              {box.width} × {box.height}
            </div>
          </div>
        </Canvas>
      }
      output={<Output classes={output} css={css} />}
    />
  );
}
