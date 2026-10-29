"use client";

// Конструктор выравнивания: пять детей во flex с переносом или в grid на 3 колонки, контейнер выше детей.
// justify- — вдоль ряда, items- — поперёк внутри строки, content- — сами строки в контейнере, justify-items- —
// внутри ячеек grid, self- — один ребёнок (розовый) не как все.

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
import {
  CONTENT,
  ITEMS,
  JUSTIFY,
  JUSTIFY_ITEMS,
  KINDS,
  type Kind,
  SELF,
} from "./_classes";

const KIDS = ["py-8", "py-14", "py-6", "py-12", "py-10"];

export function AlignBuilder({ css }: { css: CssMap }) {
  const [kind, setKind] = useState<Kind>("flex flex-wrap");
  const [justify, setJustify] = useState("justify-center");
  const [items, setItems] = useState("items-center");
  const [content, setContent] = useState("content-center");
  const [justifyItems, setJustifyItems] = useState("");
  const [self, setSelf] = useState("self-end");

  const grid = kind.startsWith("grid");
  const container = [
    ...kind.split(" "),
    justify,
    items,
    content,
    grid ? justifyItems : "",
  ].filter(Boolean);
  const classes = [...container, self].filter(Boolean);

  return (
    <Builder
      controls={
        <>
          <Field label="Контейнер">
            <Seg value={kind} options={KINDS} onChange={setKind} />
          </Field>
          <Field label="Вдоль ряда" note={justify}>
            <Seg
              value={justify}
              options={classOptions(JUSTIFY)}
              onChange={setJustify}
            />
          </Field>
          <Field label="Поперёк, в строке" note={items}>
            <Seg
              value={items}
              options={classOptions(ITEMS)}
              onChange={setItems}
            />
          </Field>
          <Field label="Строки в контейнере" note={content}>
            <Seg
              value={content}
              options={classOptions(CONTENT)}
              onChange={setContent}
            />
          </Field>
          {grid && (
            <Field label="Внутри ячейки" note={justifyItems || "—"}>
              <Seg
                value={justifyItems}
                options={classOptions(JUSTIFY_ITEMS)}
                onChange={setJustifyItems}
              />
            </Field>
          )}
          <Field label="Розовый — сам по себе" note={self || "—"}>
            <Seg value={self} options={classOptions(SELF)} onChange={setSelf} />
          </Field>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          <div
            className={`${container.join(" ")} h-240 gap-8 p-8 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)]`}
          >
            {KIDS.map((py, i) => (
              <span
                key={py}
                className={`${py} ${i === 1 ? `${self} bg-pink-500` : "bg-blue-500"} w-72 grid place-items-center br-md text-white font-13 font-w-700`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </Canvas>
      }
      output={
        <Output
          classes={classes}
          css={css}
          code={(attr) => `<div ${attr}="${container.join(" ")}">
  <span>1</span>
  <span ${attr}="${self}">2</span>
  …
</div>`}
        />
      }
    />
  );
}
