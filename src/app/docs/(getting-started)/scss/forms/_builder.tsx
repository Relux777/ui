"use client";

// Конструктор полей формы: цвет флажков и ползунков, курсор ввода, изменение размера и высота по тексту.
// Каждый класс ставится на своё поле: accent-* — на флажок, переключатель и ползунок, caret-* — на поле ввода,
// resize-* и field-sizing-content — на многострочное поле.

import { useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  classOptions,
  Field,
  Output,
  Seg,
  Switch,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { ACCENT, CARET, RESIZE } from "./_classes";

const FIELD =
  "h-40 px-12 br-md border bg-surface font-14 placeholder:text-foreground-subtle focus:border-secondary focus:outline-none";

export function FormsBuilder({ css }: { css: CssMap }) {
  const [accent, setAccent] = useState("accent-secondary");
  const [caret, setCaret] = useState("caret-secondary");
  const [resize, setResize] = useState("resize-y");
  const [grow, setGrow] = useState(true);

  const classes = [
    accent,
    caret,
    resize,
    grow ? "field-sizing-content" : "",
  ].filter(Boolean);

  return (
    <Builder
      controls={
        <>
          <Field label="Флажки и ползунки" note={accent}>
            <Seg
              value={accent}
              options={classOptions(ACCENT)}
              onChange={setAccent}
            />
          </Field>
          <Field label="Курсор ввода" note={caret}>
            <Seg
              value={caret}
              options={classOptions(CARET)}
              onChange={setCaret}
            />
          </Field>
          <Field label="Изменение размера" note={resize}>
            <Seg
              value={resize}
              options={classOptions(RESIZE)}
              onChange={setResize}
            />
          </Field>
          <Switch checked={grow} onChange={setGrow}>
            Высота по тексту — field-sizing-content
          </Switch>
        </>
      }
      preview={
        <Canvas className="min-h-260">
          <ClassStyle css={css} classes={classes} />
          <div className="flex flex-col gap-12 max-w-360">
            <span className="flex flex-wrap items-center gap-x-16 gap-y-8">
              <label className="flex items-center gap-8 font-14">
                <input
                  type="checkbox"
                  defaultChecked
                  className={`size-18 ${accent}`}
                />
                Флажок
              </label>
              <label className="flex items-center gap-8 font-14">
                <input
                  type="radio"
                  name="forms-accent"
                  defaultChecked
                  className={`size-18 ${accent}`}
                />
                Переключатель
              </label>
            </span>
            <input
              type="range"
              defaultValue={60}
              aria-label="Ползунок"
              className={`w-full ${accent}`}
            />
            <input
              type="text"
              defaultValue="Нажмите и наберите текст"
              aria-label="Поле ввода"
              className={`${FIELD} ${caret}`}
            />
            <textarea
              rows={2}
              defaultValue={"Напишите пару строк —\nполе вырастет по тексту."}
              aria-label="Многострочное поле"
              className={`w-full min-h-72 max-h-160 p-12 br-md border bg-surface font-14 leading-20 ${resize} ${grow ? "field-sizing-content" : ""}`}
            />
          </div>
        </Canvas>
      }
      output={
        <Output
          classes={classes}
          css={css}
          code={(attr) => `<input type="checkbox" ${attr}="${accent}" />
<input type="range" ${attr}="w-full ${accent}" />
<input type="text" ${attr}="h-40 px-12 br-md border bg-surface ${caret}" />
<textarea ${attr}="w-full min-h-72 p-12 br-md border bg-surface ${resize}${grow ? " field-sizing-content" : ""}" />`}
        />
      }
    />
  );
}
