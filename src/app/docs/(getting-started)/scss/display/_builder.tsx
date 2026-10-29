"use client";

// Конструктор отображения: как контейнер с тремя детьми стоит в тексте — блоком, в строку, flex, grid, исчезает
// обёртка (contents) или весь блок (hidden); и на каких экранах его показывать (sm:hidden, hidden sm:flex).
// Поменяйте ширину окна — выбор «Только телефон» / «С 620px» сработает в примере по-настоящему.

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
import { DISPLAY, displayClasses, SCREENS, type Screen } from "./_classes";

// что делает каждый вариант — под примером
const NOTES: Record<string, string> = {
  block: "Блок — на всю ширину, с новой строки. Дети внутри — обычным потоком.",
  "inline-block": "В строку с текстом, но со своей шириной, высотой и полями.",
  inline: "В строку с текстом, как слово: ширина и высота не задаются.",
  flex: "Блок, а дети — в ряд (flex). Дальше — выравнивание и промежутки.",
  "inline-flex": "Ряд детей, но сам — в строку с текстом: кнопки с иконкой.",
  grid: "Блок, а дети — по сетке (здесь grid-cols-3).",
  contents: "Обёртки нет: дети встают прямо в родителя, будто её и не было.",
  hidden: "Блока нет совсем: ни места, ни кликов, скринридер не читает.",
};

export function DisplayBuilder({ css }: { css: CssMap }) {
  const [display, setDisplay] = useState("flex");
  const [screen, setScreen] = useState<Screen>("always");

  const classes = [
    ...displayClasses(display, screen),
    ...(display === "grid" ? ["grid-cols-3"] : []),
  ];

  return (
    <Builder
      controls={
        <>
          <Field label="Как стоит контейнер" note={display}>
            <Seg
              value={display}
              options={classOptions(DISPLAY)}
              onChange={setDisplay}
            />
          </Field>
          <Field label="На каких экранах">
            <Seg value={screen} options={SCREENS} onChange={setScreen} />
          </Field>
          <p className="font-13 text-foreground-muted">{NOTES[display]}</p>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          <p className="font-14 leading-28 text-foreground-muted">
            Текст до контейнера{" "}
            <span
              className={`${classes.join(" ")} gap-6 p-6 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_35%,transparent)]`}
            >
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className="px-10 py-4 br-md bg-blue-500 text-white font-13 font-w-600"
                >
                  {n}
                </span>
              ))}
            </span>{" "}
            и текст после него.
          </p>
        </Canvas>
      }
      output={<Output classes={classes} css={css} inner="…" />}
    />
  );
}
