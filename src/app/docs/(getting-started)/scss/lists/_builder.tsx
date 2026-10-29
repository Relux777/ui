"use client";

// Конструктор списка: маркер (точка, номер, без маркера), где он стоит (снаружи или внутри строки), цвет и
// начертание маркера (вариант marker:), расстояние между пунктами и отступ слева. Сброс стилей RenDit убирает
// маркеры у всех списков — list-disc и list-decimal возвращают их там, где нужно.

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
import { MARKERS, PADS, POSITIONS, SPACES, TYPES } from "./_classes";

const ITEMS = [
  "Скачайте архив версии",
  "Распакуйте его в папку проекта — длинный пункт, чтобы было видно, где начинается вторая строка",
  "Подключите стили",
];

export function ListsBuilder({ css }: { css: CssMap }) {
  const [type, setType] = useState("list-disc");
  const [position, setPosition] = useState("list-outside");
  const [marker, setMarker] = useState("marker:text-secondary");
  const [space, setSpace] = useState("space-y-8");
  const [pad, setPad] = useState("pl-20");

  const classes = [type, position, marker, space, pad].filter(Boolean);

  return (
    <Builder
      controls={
        <>
          <Field label="Маркер" note={type}>
            <Seg
              value={type}
              options={classOptions(TYPES)}
              onChange={setType}
            />
          </Field>
          <Field label="Где маркер" note={position}>
            <Seg
              value={position}
              options={classOptions(POSITIONS)}
              onChange={setPosition}
            />
          </Field>
          <Field label="Цвет и начертание маркера" note={marker || "—"}>
            <Seg
              value={marker}
              options={classOptions(MARKERS)}
              onChange={setMarker}
            />
          </Field>
          <Field label="Между пунктами" note={space}>
            <Seg
              value={space}
              options={classOptions(SPACES)}
              onChange={setSpace}
            />
          </Field>
          <Field label="Отступ слева" note={pad}>
            <Seg value={pad} options={classOptions(PADS)} onChange={setPad} />
          </Field>
          <p className="font-13 text-foreground-muted">
            Снаружи (list-outside) маркеру нужен отступ слева — иначе он уйдёт
            за край. Внутри (list-inside) вторая строка начинается под маркером.
          </p>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          <ul
            className={`${classes.join(" ")} max-w-360 p-10 br-lg font-14 [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)]`}
          >
            {ITEMS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Canvas>
      }
      output={
        <Output
          classes={classes}
          css={css}
          code={(attr) => `<ul ${attr}="${classes.join(" ")}">
  <li>Скачайте архив версии</li>
  <li>Распакуйте его в папку проекта</li>
  <li>Подключите стили</li>
</ul>`}
        />
      }
    />
  );
}
