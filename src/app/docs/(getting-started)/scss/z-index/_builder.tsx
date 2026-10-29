"use client";

// Конструктор наложения: три карточки заходят друг на друга, у каждой свой z-. Больше z — выше; одинаковый —
// выше та, что позже в разметке. Нажмите на карточку — она поднимется на самый верх (как окно в системе).

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
import { Z } from "./_classes";

const CARDS = [
  { id: "a", title: "Первая", color: "bg-violet-500", place: "top-16 left-16" },
  { id: "b", title: "Вторая", color: "bg-blue-500", place: "top-56 left-80" },
  { id: "c", title: "Третья", color: "bg-pink-500", place: "top-96 left-144" },
] as const;

type Id = (typeof CARDS)[number]["id"];

export function ZBuilder({ css }: { css: CssMap }) {
  const [z, setZ] = useState<Record<Id, string>>({
    a: "z-0",
    b: "z-0",
    c: "z-0",
  });
  const classes = CARDS.map((c) => z[c.id]);

  // нажатая карточка — на самый верх: на 10 выше самой высокой из остальных
  const raise = (id: Id) => {
    const top = Math.max(
      ...CARDS.filter((c) => c.id !== id).map((c) => Number(z[c.id].slice(2))),
    );
    const next = Z.find((v) => Number(v.slice(2)) > top) ?? Z.at(-1);
    if (next) setZ({ ...z, [id]: next });
  };

  return (
    <Builder
      controls={
        <>
          {CARDS.map((c) => (
            <Field key={c.id} label={c.title} note={z[c.id]}>
              <Seg
                value={z[c.id]}
                options={classOptions(Z)}
                onChange={(v) => setZ({ ...z, [c.id]: v })}
              />
            </Field>
          ))}
          <p className="font-13 text-foreground-muted">
            Одинаковый z — выше та карточка, что позже в разметке. Нажмите на
            карточку в примере — она поднимется наверх.
          </p>
        </>
      }
      preview={
        <Canvas className="isolate">
          <ClassStyle css={css} classes={classes} />
          <div className="relative h-220">
            {CARDS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => raise(c.id)}
                className={`${z[c.id]} absolute ${c.place} w-140 h-100 flex flex-col justify-between p-12 br-lg ${c.color} text-white text-left shadow-5 transition-[scale] active:scale-97`}
              >
                <span className="font-14 font-w-700">{c.title}</span>
                <span className="font-12 font-mono opacity-85">{z[c.id]}</span>
              </button>
            ))}
          </div>
        </Canvas>
      }
      output={<Output classes={["absolute", z.c]} css={css} inner="Третья" />}
    />
  );
}
