"use client";

// Конструктор выравнивания текста: по краю, по центру, по ширине, по началу строки (для письма справа налево)
// и как переносить строки — обычно, ровно для заголовков (balance), без висячих слов в абзацах (pretty) или
// в одну строку. Узкий блок — заголовок переносится, и разница видна сразу.

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
import { ALIGN, WRAP } from "./_classes";

const WIDTHS = ["50", "65", "80", "100"];
const TITLE = "RenDit UI — классы, токены и компоненты для быстрых сайтов";
const TEXT =
  "Строки абзаца переносятся по ширине блока. С text-pretty браузер старается не оставлять в последней строке одно короткое слово, с text-balance — делает строки почти одинаковой длины.";

export function TextAlignBuilder({ css }: { css: CssMap }) {
  const [align, setAlign] = useState("text-left");
  const [wrap, setWrap] = useState("text-balance");
  const [width, setWidth] = useState("65");
  const [rtl, setRtl] = useState(false);

  const classes = [align, wrap];

  return (
    <Builder
      controls={
        <>
          <Field label="Выравнивание" note={align}>
            <Seg
              value={align}
              options={classOptions(ALIGN)}
              onChange={setAlign}
            />
          </Field>
          <Field label="Перенос строк" note={wrap}>
            <Seg value={wrap} options={classOptions(WRAP)} onChange={setWrap} />
          </Field>
          <Field label="Ширина блока" note={`${width}%`}>
            <Range
              label="Ширина блока"
              values={WIDTHS}
              value={width}
              onChange={setWidth}
            />
          </Field>
          <Switch checked={rtl} onChange={setRtl}>
            Письмо справа налево (dir=rtl)
          </Switch>
          <p className="font-13 text-foreground-muted">
            text-start и text-end — по началу и концу строки: в русском это лево
            и право, в арабском — наоборот.
          </p>
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={classes} />
          <div
            dir={rtl ? "rtl" : "ltr"}
            style={{ width: `${width}%` }}
            className={`${classes.join(" ")} flex flex-col gap-10 p-12 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)] transition-[width] duration-300 motion-reduce:transition-none`}
          >
            <h3 className="font-22 font-w-700 leading-1.2">{TITLE}</h3>
            <p className="font-14 text-foreground-muted">{TEXT}</p>
          </div>
        </Canvas>
      }
      output={<Output classes={classes} css={css} tag="h1" inner={TITLE} />}
    />
  );
}
