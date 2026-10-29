"use client";

// Конструктор flex-элементов: три ребёнка в ряд, у каждого — как он делит место (flex-1, flex-none, shrink-0,
// basis-…) и порядок. Сужайте родителя — видно, кто сжимается, а кто держит ширину; над каждым — его ширина.

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
  useBox,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { GROW, ORDER } from "./_classes";

const KIDS = [
  { id: "a", title: "Иконка", text: "★", color: "bg-violet-500" },
  { id: "b", title: "Текст", text: "Название документа", color: "bg-blue-500" },
  { id: "c", title: "Кнопка", text: "Открыть", color: "bg-pink-500" },
] as const;

type Id = (typeof KIDS)[number]["id"];

const PARENT = ["40", "55", "70", "85", "100"];

function Kid({
  cls,
  text,
  color,
}: {
  cls: string;
  text: string;
  color: string;
}) {
  const [ref, box] = useBox<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={`${cls} ${color} min-w-0 flex flex-col gap-2 px-10 py-8 br-md text-white font-13 font-w-600 overflow-hidden`}
    >
      <span className="font-10 font-mono opacity-80">{box.width}px</span>
      <span className="truncate">{text}</span>
    </span>
  );
}

export function FlexItemsBuilder({ css }: { css: CssMap }) {
  const [grow, setGrow] = useState<Record<Id, string>>({
    a: "shrink-0",
    b: "flex-1",
    c: "",
  });
  const [order, setOrder] = useState("");
  const [parent, setParent] = useState("100");

  const kidClass = (id: Id) =>
    [grow[id], id === "c" ? order : ""].filter(Boolean).join(" ");
  const classes = [
    ...new Set(KIDS.flatMap((k) => kidClass(k.id).split(" "))),
  ].filter(Boolean);

  return (
    <Builder
      controls={
        <>
          {KIDS.map((k) => (
            <Field key={k.id} label={k.title} note={grow[k.id] || "—"}>
              <Seg
                value={grow[k.id]}
                options={classOptions(GROW)}
                onChange={(v) => setGrow({ ...grow, [k.id]: v })}
              />
            </Field>
          ))}
          <Field label="Порядок кнопки" note={order || "—"}>
            <Seg
              value={order}
              options={classOptions(ORDER)}
              onChange={setOrder}
            />
          </Field>
          <Field label="Ширина родителя" note={`${parent}%`}>
            <Range
              label="Ширина родителя"
              values={PARENT}
              value={parent}
              onChange={setParent}
            />
          </Field>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          {/* ширина родителя — style: ручка примера, а не класс */}
          <div
            style={{ width: `${parent}%` }}
            className="flex items-stretch gap-8 p-8 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)] transition-[width] duration-300 motion-reduce:transition-none"
          >
            {KIDS.map((k) => (
              <Kid
                key={k.id}
                cls={kidClass(k.id)}
                text={k.text}
                color={k.color}
              />
            ))}
          </div>
        </Canvas>
      }
      output={
        <Output
          classes={classes}
          css={css}
          code={(attr) => `<div ${attr}="flex gap-8">
${KIDS.map((k) => `  <span ${attr}="${kidClass(k.id)}">${k.text}</span>`).join("\n")}
</div>`}
        />
      }
    />
  );
}
