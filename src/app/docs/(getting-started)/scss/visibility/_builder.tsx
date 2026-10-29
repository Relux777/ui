"use client";

// Конструктор видимости: средняя из трёх кнопок прячется по-разному — invisible, hidden, opacity-0, sr-only.
// Рядом табличка: занимает ли место, нажимается ли, видит ли её скринридер. Нажмите на место кнопки — видно,
// ловит ли она нажатия.

import { Check } from "@boxicons/react/Check";
import { X } from "@boxicons/react/X";
import { useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  Field,
  Output,
  Seg,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { HIDE } from "./_classes";

type Cls = (typeof HIDE)[number]["cls"];

const FACTS = [
  ["seen", "Видно"],
  ["place", "Занимает место"],
  ["click", "Ловит нажатия"],
  ["reader", "Читает скринридер"],
] as const;

const BTN = "h-40 px-14 br-full text-white font-13 font-w-600";

export function VisibilityBuilder({ css }: { css: CssMap }) {
  const [cls, setCls] = useState<Cls>("invisible");
  const [clicks, setClicks] = useState(0);
  const facts = HIDE.find((h) => h.cls === cls) ?? HIDE[0];

  return (
    <Builder
      controls={
        <>
          <Field label="Как спрятать вторую кнопку" note={cls}>
            <Seg
              value={cls}
              options={HIDE.map((h) => ({ id: h.cls, title: h.cls }))}
              onChange={(v) => {
                setCls(v);
                setClicks(0);
              }}
            />
          </Field>
          <ul className="flex flex-col gap-6 font-14">
            {FACTS.map(([key, title]) => (
              <li key={key} className="flex items-center gap-8">
                <span
                  className={`size-22 br-full grid place-items-center ${facts[key] ? "bg-success/15 text-success" : "bg-danger/12 text-danger"}`}
                >
                  {facts[key] ? (
                    <Check size="xs" aria-hidden="true" />
                  ) : (
                    <X size="xs" aria-hidden="true" />
                  )}
                </span>
                {title}
              </li>
            ))}
          </ul>
        </>
      }
      preview={
        <Canvas className="grid place-items-center">
          <ClassStyle css={css} classes={[cls]} />
          <div className="flex flex-col items-center gap-14">
            <div className="flex items-center gap-8 p-8 br-full [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)]">
              <button type="button" className={`${BTN} bg-blue-500`}>
                Первая
              </button>
              <button
                type="button"
                onClick={() => setClicks((n) => n + 1)}
                className={`${cls} ${BTN} bg-pink-500`}
              >
                Вторая
              </button>
              <button type="button" className={`${BTN} bg-blue-500`}>
                Третья
              </button>
            </div>
            <span className="font-12 font-mono text-foreground-muted">
              нажатий на вторую: {clicks}
            </span>
          </div>
        </Canvas>
      }
      output={<Output classes={[cls]} css={css} tag="button" inner="Вторая" />}
    />
  );
}
