"use client";

// Конструктор переноса: длинный текст с адресом-«колбасой» в узком блоке. Что с ним делать — обрезать
// многоточием в одну строку или после N строк, не переносить вовсе, сохранить переносы как набрано; длинные слова
// и адреса — ломать, переносы по слогам. Блок сужается ползунком.

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
import { BREAKS, CLAMP, MODES, type Mode } from "./_classes";

const WIDTHS = ["40", "55", "70", "85", "100"];
const TEXT = `Скачайте архив по ссылке https://github.com/Relux777/ui/releases/latest/download/rendit-ui.zip — внутри движок, стили и готовый CSS.
Распакуйте его в папку проекта.`;

export function WrapBuilder({ css }: { css: CssMap }) {
  const [mode, setMode] = useState<Mode>("line-clamp");
  const [clamp, setClamp] = useState("line-clamp-2");
  const [brk, setBrk] = useState("break-words");
  const [hyphens, setHyphens] = useState(false);
  const [width, setWidth] = useState("55");

  const classes = [
    mode === "line-clamp" ? clamp : mode,
    mode === "truncate" ? "" : brk,
    hyphens ? "hyphens-auto" : "",
  ].filter(Boolean);

  return (
    <Builder
      controls={
        <>
          <Field label="Длинный текст">
            <Seg value={mode} options={MODES} onChange={setMode} />
          </Field>
          {mode === "line-clamp" && (
            <Field label="Строк до многоточия" note={clamp}>
              <Range
                label="Строк до многоточия"
                values={CLAMP}
                value={clamp}
                onChange={setClamp}
              />
            </Field>
          )}
          {mode !== "truncate" && (
            <Field label="Длинные слова и адреса" note={brk || "—"}>
              <Seg
                value={brk}
                options={classOptions(BREAKS)}
                onChange={setBrk}
              />
            </Field>
          )}
          <Switch checked={hyphens} onChange={setHyphens}>
            Переносы по слогам (hyphens-auto)
          </Switch>
          <Field label="Ширина блока" note={`${width}%`}>
            <Range
              label="Ширина блока"
              values={WIDTHS}
              value={width}
              onChange={setWidth}
            />
          </Field>
        </>
      }
      preview={
        <Canvas className="pb-48!">
          <ClassStyle css={css} classes={classes} />
          <div
            style={{ width: `${width}%` }}
            className="p-10 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)] transition-[width] duration-300 motion-reduce:transition-none"
          >
            <p lang="ru" className={`${classes.join(" ")} font-14 leading-1.5`}>
              {TEXT}
            </p>
          </div>
        </Canvas>
      }
      output={<Output classes={classes} css={css} tag="p" inner="…" />}
    />
  );
}
