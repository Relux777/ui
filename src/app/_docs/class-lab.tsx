"use client";

// Общий конструктор для страниц, где выбирают готовые классы: у каждой группы один класс ("" — «нет»),
// диапазон — ползунок по числам. Превью — настоящие классы с настоящим CSS: страница заранее просит
// у движка CSS всех вариантов (class-css.ts), ClassStyle вставляет правила выбранных в <style>.
// Готовые виды превью — box, button, card, cursor, icon, image, opacity; особые случаи (адаптив,
// сетка .row, стекло, появление, прокрутка, формы) — своими конструкторами рядом со страницей.

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
} from "./builder";
import type { CssMap } from "./class-css";

export type LabGroup =
  | { label: string; options: readonly string[] }
  | { label: string; prefix: string; values: readonly number[] };

export type LabPreview =
  | "box"
  | "button"
  | "card"
  | "cursor"
  | "icon"
  | "image"
  | "opacity";

// translate-x с отрицательным числом — класс -translate-x-20
const classOf = (prefix: string, value: number) =>
  value < 0 ? `-${prefix}-${Math.abs(value)}` : `${prefix}-${value}`;

const initial = (group: LabGroup) =>
  "options" in group
    ? (group.options[0] ?? "")
    : classOf(group.prefix, group.values[0]);

function Preview({ kind, cls }: { kind: LabPreview; cls: string }) {
  switch (kind) {
    case "button":
      return (
        <button
          type="button"
          className={`h-44 px-20 br-full bg-primary text-primary-foreground font-13 font-w-600 ${cls}`}
        >
          Нажмите
        </button>
      );
    case "cursor":
      return (
        <div
          className={`grid place-items-center h-120 w-full br-lg border bg-surface font-13 font-w-600 ${cls}`}
        >
          Наведите курсор
        </div>
      );
    case "icon":
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`size-96 transition-colors ${cls}`}
        >
          <path d="M12 2.6l2.8 6.1 6.6.7-4.9 4.4 1.4 6.5L12 17l-5.9 3.3 1.4-6.5-4.9-4.4 6.6-.7z" />
        </svg>
      );
    case "image":
      return (
        <div
          style={{ backgroundImage: "url(/samples/landscape.svg)" }}
          className={`w-full h-220 br-lg border ${cls}`}
        />
      );
    case "opacity":
      return (
        <div
          className={`relative overflow-hidden w-full max-w-320 p-16 br-lg border bg-surface shadow-1 ${cls}`}
        >
          <span className="absolute -top-10 -right-6 size-72 br-full bg-secondary/40" />
          <span className="absolute -bottom-8 left-10 size-48 br-full bg-accent/60" />
          <span className="relative flex flex-col gap-4">
            <span className="font-14 font-w-600">Прозрачность</span>
            <span className="font-12 text-foreground-muted">
              Сквозь блок видно фон и соседей
            </span>
          </span>
        </div>
      );
    case "card":
      return (
        <div
          className={`flex flex-col gap-6 w-full max-w-320 p-16 br-lg border bg-surface shadow-1 ${cls}`}
        >
          <span className="font-14 font-w-600">Карточка</span>
          <span className="font-12 text-foreground-muted">
            Текст и ссылка внутри реагируют вместе с ней
          </span>
          <a
            href="#preview"
            className="self-start font-12 font-w-600 text-secondary"
          >
            Ссылка →
          </a>
        </div>
      );
    default:
      return (
        <div
          className={`grid place-items-center min-h-80 w-full max-w-320 p-12 br-lg bg-secondary/10 font-13 font-w-600 text-center ${cls}`}
        >
          Пример
        </div>
      );
  }
}

export function ClassLab({
  css,
  groups,
  base = [],
  preview = "box",
  tag = "div",
  inner = "Пример",
}: {
  css: CssMap;
  groups: readonly LabGroup[];
  /** классы, которые есть всегда */
  base?: readonly string[];
  preview?: LabPreview;
  /** тег и содержимое в коде результата */
  tag?: string;
  inner?: string;
}) {
  const [picked, setPicked] = useState(() => groups.map(initial));
  const set = (i: number, value: string) =>
    setPicked((list) => list.map((v, j) => (j === i ? value : v)));

  const classes = [...base, ...picked].filter(Boolean);

  return (
    <Builder
      controls={groups.map((group, i) => (
        <Field key={group.label} label={group.label} note={picked[i] || "нет"}>
          {"options" in group ? (
            <Seg
              value={picked[i]}
              options={classOptions(group.options)}
              onChange={(v) => set(i, v)}
            />
          ) : (
            <Range
              label={group.label}
              values={group.values.map((v) => classOf(group.prefix, v))}
              value={picked[i]}
              onChange={(v) => set(i, v)}
            />
          )}
        </Field>
      ))}
      preview={
        <Canvas className="grid place-items-center">
          <ClassStyle css={css} classes={classes} />
          <Preview kind={preview} cls={picked.filter(Boolean).join(" ")} />
        </Canvas>
      }
      output={
        <Output
          classes={classes}
          css={css}
          tag={tag}
          inner={inner}
          code={(attr) =>
            `<${tag} ${attr}="${classes.join(" ")}">${inner}</${tag}>`
          }
        />
      }
    />
  );
}
