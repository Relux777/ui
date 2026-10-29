"use client";

// Конструктор ширины: как задать ширину (пиксели, доля родителя, по содержимому), ограничения min- и max-,
// ширина родителя и длина текста внутри — пример меняется сразу, над ним — настоящая ширина в пикселях.
// Пример — на настоящих классах: CSS выбранных даёт движок (ClassStyle), вкладка «CSS» показывает его же.

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
import { MAX_W, MIN_W, W_FRACTIONS, W_PX, W_WORDS } from "./_classes";

const MODES = [
  { id: "px", title: "Пиксели" },
  { id: "fraction", title: "Доля" },
  { id: "word", title: "По содержимому" },
] as const;
type Mode = (typeof MODES)[number]["id"];

const PARENTS = [
  { id: "100", title: "100%" },
  { id: "70", title: "70%" },
  { id: "40", title: "40%" },
] as const;
type Parent = (typeof PARENTS)[number]["id"];

// текст внутри — от него зависят w-fit, w-min и w-max
const SHORT = "Кнопка";
const LONG = "Длинная подпись, которая не помещается в узкий блок";

export function WidthBuilder({ css }: { css: CssMap }) {
  const [mode, setMode] = useState<Mode>("px");
  const [px, setPx] = useState("w-240");
  const [fraction, setFraction] = useState("w-1/2");
  const [word, setWord] = useState("w-fit");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("max-w-full");
  const [parent, setParent] = useState<Parent>("100");
  const [long, setLong] = useState(false);
  const [boxRef, box] = useBox();
  const [parentRef, parentBox] = useBox();

  const w = mode === "px" ? px : mode === "fraction" ? fraction : word;
  const classes = [w, min, max].filter(Boolean);

  return (
    <Builder
      controls={
        <>
          <Field label="Ширина">
            <Seg value={mode} options={MODES} onChange={setMode} />
          </Field>
          {mode === "px" && (
            <Field label="Пиксели" note={px}>
              <Range
                label="Ширина в пикселях"
                values={W_PX}
                value={px}
                onChange={setPx}
              />
            </Field>
          )}
          {mode === "fraction" && (
            <Field label="Доля родителя" note={fraction}>
              <Seg
                value={fraction}
                options={classOptions(W_FRACTIONS)}
                onChange={setFraction}
              />
            </Field>
          )}
          {mode === "word" && (
            <Field label="По содержимому" note={word}>
              <Seg
                value={word}
                options={classOptions(W_WORDS)}
                onChange={setWord}
              />
            </Field>
          )}
          <Field label="Не уже чем">
            <Seg value={min} options={classOptions(MIN_W)} onChange={setMin} />
          </Field>
          <Field label="Не шире чем">
            <Seg value={max} options={classOptions(MAX_W)} onChange={setMax} />
          </Field>
          <Field label="Ширина родителя">
            <Seg value={parent} options={PARENTS} onChange={setParent} />
          </Field>
          <Switch checked={long} onChange={setLong}>
            Длинный текст внутри
          </Switch>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          {/* родитель — пунктиром, его ширина задаётся здесь style: это не класс примера */}
          <div
            ref={parentRef}
            style={{ width: `${parent}%` }}
            className="flex flex-col gap-8 p-8 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)] transition-[width] duration-500 ease-spring motion-reduce:transition-none"
          >
            <span className="font-11 font-mono text-foreground-subtle">
              родитель · {parentBox.width}px
            </span>
            <div
              ref={boxRef}
              className={`${classes.join(" ")} flex items-center min-h-56 px-14 br-lg bg-blue-500 text-white font-14 font-w-600 overflow-hidden`}
            >
              <span className="flex flex-col">
                <span className="font-11 font-mono opacity-80">
                  {box.width}px
                </span>
                {long ? LONG : SHORT}
              </span>
            </div>
          </div>
        </Canvas>
      }
      output={
        <Output classes={classes} css={css} inner={long ? LONG : SHORT} />
      }
    />
  );
}
