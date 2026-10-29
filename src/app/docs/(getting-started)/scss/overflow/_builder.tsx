"use client";

// Конструктор переполнения: блок 160px высотой, внутри — больше, чем влезает (длинный текст или широкий ряд).
// Что делать с лишним: видно (visible), обрезать (hidden, clip), прокручивать (auto, scroll) — по обеим осям или
// по одной; и какая полоса прокрутки — обычная, тонкая или никакой.

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
import { AXES, type Axis, SCROLLBARS, VALUES } from "./_classes";

const CONTENT = [
  { id: "text", title: "Длинный текст" },
  { id: "row", title: "Широкий ряд" },
] as const;
type Content = (typeof CONTENT)[number]["id"];

const NOTES: Record<string, string> = {
  visible: "Лишнее видно поверх соседей — по умолчанию.",
  hidden: "Лишнее обрезано, но блок можно прокрутить из кода (scrollTo).",
  clip: "Обрезано совсем, без прокрутки; не создаёт контекст прокрутки.",
  auto: "Полоса прокрутки — только когда есть что прокручивать. Обычно нужен он.",
  scroll: "Полоса прокрутки всегда, даже если всё влезло.",
};

const TEXT =
  "Переполнение — когда содержимого больше, чем места. Строки текста, карточки, таблица — всё, что не влезло в блок, по умолчанию торчит наружу и накрывает соседей. Классы overflow решают, что с этим делать: показать, обрезать или прокрутить. Добавьте scrollbar-thin — полоса станет тоньше, scrollbar-none — исчезнет, а прокрутка останется.";

const CHIPS = [
  "Дизайн",
  "Код",
  "Тексты",
  "Видео",
  "Звук",
  "Фото",
  "3D",
  "Игры",
];

export function OverflowBuilder({ css }: { css: CssMap }) {
  const [value, setValue] = useState("auto");
  const [axis, setAxis] = useState<Axis>("overflow");
  const [content, setContent] = useState<Content>("text");
  const [bar, setBar] = useState("");

  const classes = [`${axis}-${value}`, bar].filter(Boolean);

  return (
    <Builder
      controls={
        <>
          <Field label="Что делать с лишним" note={`${axis}-${value}`}>
            <Seg
              value={value}
              options={classOptions(VALUES)}
              onChange={setValue}
            />
          </Field>
          <Field label="По какой оси">
            <Seg value={axis} options={AXES} onChange={setAxis} />
          </Field>
          <Field label="Полоса прокрутки">
            <Seg
              value={bar}
              options={classOptions(SCROLLBARS)}
              onChange={setBar}
            />
          </Field>
          <Field label="Что внутри">
            <Seg value={content} options={CONTENT} onChange={setContent} />
          </Field>
          <p className="font-13 text-foreground-muted">{NOTES[value]}</p>
        </>
      }
      preview={
        <Canvas className="pb-60!">
          <ClassStyle css={css} classes={classes} />
          <div
            className={`${classes.join(" ")} relative h-160 p-12 br-lg border-2 border-dashed border-blue-400 bg-surface font-13`}
          >
            {content === "text" ? (
              <p className="w-[520px] max-w-none text-foreground-muted">
                {TEXT} {TEXT}
              </p>
            ) : (
              <div className="flex gap-8 w-max">
                {CHIPS.map((c) => (
                  <span
                    key={c}
                    className="px-14 py-8 br-full bg-blue-500 text-white font-w-600"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Canvas>
      }
      output={<Output classes={classes} css={css} inner="…" />}
    />
  );
}
