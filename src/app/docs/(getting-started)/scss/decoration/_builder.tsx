"use client";

// Конструктор оформления текста: линия (подчёркивание, надчёркивание, зачёркивание), её стиль, толщина, отступ
// от букв и цвет, регистр и курсив. Пример — ссылка в абзаце: так оформление выглядит в настоящем тексте.

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
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { CASES, COLORS, LINES, OFFSET, STYLES, THICKNESS } from "./_classes";

export function DecorationBuilder({ css }: { css: CssMap }) {
  const [line, setLine] = useState("underline");
  const [style, setStyle] = useState("decoration-wavy");
  const [thickness, setThickness] = useState("decoration-2");
  const [offset, setOffset] = useState("underline-offset-4");
  const [color, setColor] = useState("decoration-secondary");
  const [textCase, setTextCase] = useState("normal-case");
  const [italic, setItalic] = useState(false);

  const hasLine = line !== "no-underline";
  const classes = [
    line,
    ...(hasLine ? [style, thickness, color] : []),
    ...(line === "underline" ? [offset] : []),
    ...(textCase !== "normal-case" ? [textCase] : []),
    ...(italic ? ["italic"] : []),
  ];

  return (
    <Builder
      controls={
        <>
          <Field label="Линия" note={line}>
            <Seg
              value={line}
              options={classOptions(LINES)}
              onChange={setLine}
            />
          </Field>
          {hasLine && (
            <>
              <Field label="Стиль линии" note={style}>
                <Seg
                  value={style}
                  options={classOptions(STYLES)}
                  onChange={setStyle}
                />
              </Field>
              <Field label="Толщина" note={thickness}>
                <Range
                  label="Толщина линии"
                  values={THICKNESS}
                  value={thickness}
                  onChange={setThickness}
                />
              </Field>
              <Field label="Цвет линии" note={color}>
                <Seg
                  value={color}
                  options={classOptions(COLORS)}
                  onChange={setColor}
                />
              </Field>
            </>
          )}
          {line === "underline" && (
            <Field label="Отступ от букв" note={offset}>
              <Range
                label="Отступ линии от букв"
                values={OFFSET}
                value={offset}
                onChange={setOffset}
              />
            </Field>
          )}
          <Field label="Регистр" note={textCase}>
            <Seg
              value={textCase}
              options={classOptions(CASES)}
              onChange={setTextCase}
            />
          </Field>
          <Switch checked={italic} onChange={setItalic}>
            Курсив (italic)
          </Switch>
        </>
      }
      preview={
        <Canvas className="grid place-items-center">
          <ClassStyle css={css} classes={classes} />
          <p className="max-w-420 font-17 leading-1.6 text-foreground-muted">
            Подробности — в{" "}
            <span className={`${classes.join(" ")} text-foreground font-w-600`}>
              справке по оформлению текста
            </span>
            , там же примеры.
          </p>
        </Canvas>
      }
      output={
        <Output
          classes={classes}
          css={css}
          tag="a"
          inner="справке по оформлению"
        />
      }
    />
  );
}
