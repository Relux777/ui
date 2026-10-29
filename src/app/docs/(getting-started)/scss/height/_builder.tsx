"use client";

// Конструктор высоты: пиксели, доля родителя или по содержимому, ограничения min- и max-, сколько текста внутри
// и прокрутка внутри блока (overflow-y-auto) — видно, когда текст вылезает, а когда блок растёт или
// прокручивается. Родитель — 280px (пунктир), над примером — настоящая высота в пикселях.

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
import { H_FRACTIONS, H_PX, H_WORDS, MAX_H, MIN_H, SCROLL } from "./_classes";

const MODES = [
  { id: "px", title: "Пиксели" },
  { id: "fraction", title: "Доля" },
  { id: "word", title: "По содержимому" },
] as const;
type Mode = (typeof MODES)[number]["id"];

const LINES = ["1", "2", "3", "4", "5", "6", "8", "10"];
const TEXT = "Строка текста внутри блока";

export function HeightBuilder({ css }: { css: CssMap }) {
  const [mode, setMode] = useState<Mode>("px");
  const [px, setPx] = useState("h-120");
  const [fraction, setFraction] = useState("h-1/2");
  const [word, setWord] = useState("h-auto");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [lines, setLines] = useState("3");
  const [scroll, setScroll] = useState(false);
  const [boxRef, box] = useBox();

  const h = mode === "px" ? px : mode === "fraction" ? fraction : word;
  const classes = [h, min, max, scroll ? SCROLL : ""].filter(Boolean);

  return (
    <Builder
      controls={
        <>
          <Field label="Высота">
            <Seg value={mode} options={MODES} onChange={setMode} />
          </Field>
          {mode === "px" && (
            <Field label="Пиксели" note={px}>
              <Range
                label="Высота в пикселях"
                values={H_PX}
                value={px}
                onChange={setPx}
              />
            </Field>
          )}
          {mode === "fraction" && (
            <Field label="Доля родителя" note={fraction}>
              <Seg
                value={fraction}
                options={classOptions(H_FRACTIONS)}
                onChange={setFraction}
              />
            </Field>
          )}
          {mode === "word" && (
            <Field label="По содержимому" note={word}>
              <Seg
                value={word}
                options={classOptions(H_WORDS)}
                onChange={setWord}
              />
            </Field>
          )}
          <Field label="Не ниже чем">
            <Seg value={min} options={classOptions(MIN_H)} onChange={setMin} />
          </Field>
          <Field label="Не выше чем">
            <Seg value={max} options={classOptions(MAX_H)} onChange={setMax} />
          </Field>
          <Field label="Строк текста" note={lines}>
            <Range
              label="Строк текста"
              values={LINES}
              value={lines}
              onChange={setLines}
            />
          </Field>
          <Switch checked={scroll} onChange={setScroll}>
            Прокрутка внутри ({SCROLL})
          </Switch>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          {/* родитель 280px — пунктиром; его высота задана здесь style, это не класс примера */}
          <div className="flex flex-col h-[280px] p-8 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)]">
            <span className="shrink-0 pb-6 font-11 font-mono text-foreground-subtle">
              родитель · 280px
            </span>
            <div className="flex-1 min-h-0">
              <div
                ref={boxRef}
                className={`${classes.join(" ")} flex flex-col gap-4 p-12 br-lg bg-blue-500/85 text-white font-13`}
              >
                <span className="shrink-0 font-11 font-mono opacity-80">
                  {box.height}px
                </span>
                {Array.from({ length: Number(lines) }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: строки одинаковые, меняется только их число
                  <span key={i} className="shrink-0">
                    {i + 1}. {TEXT}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Canvas>
      }
      output={<Output classes={classes} css={css} inner="…" />}
    />
  );
}
