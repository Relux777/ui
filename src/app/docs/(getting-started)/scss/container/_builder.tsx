"use client";

// Конструктор контейнерных запросов: меняйте ширину блока (не окна!) — карточка внутри перестраивается, как
// только блок шире порога. Так один компонент подходит и в узкую колонку, и в широкую — без брейкпоинтов экрана.

import { useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  Field,
  Output,
  Range,
  Seg,
  useBox,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { cardClasses, QUERIES, type Query, WIDTHS } from "./_classes";

export function ContainerBuilder({ css }: { css: CssMap }) {
  const [query, setQuery] = useState<Query>("@md");
  const [width, setWidth] = useState("360");
  const [boxRef, box] = useBox();
  const c = cardClasses(query);
  const px = QUERIES.find((q) => q.id === query)?.px ?? 0;
  const wide = box.width >= px;

  return (
    <Builder
      controls={
        <>
          <Field label="Ширина блока" note={`${width}px`}>
            <Range
              label="Ширина блока"
              values={WIDTHS}
              value={width}
              onChange={setWidth}
            />
          </Field>
          <Field label="Порог перестройки">
            <Seg value={query} options={QUERIES} onChange={setQuery} />
          </Field>
          <p className="font-13 text-foreground-muted">
            Блок {box.width}px — {wide ? "шире" : "уже"} порога {px}px: карточка{" "}
            {wide ? "в ряд" : "столбиком"}.
          </p>
        </>
      }
      preview={
        <Canvas className="overflow-x-auto!">
          <ClassStyle css={css} classes={[...c.card, ...c.body, ...c.image]} />
          {/* ширина блока — style: это ручка примера, а не класс */}
          <div
            ref={boxRef}
            style={{ width: `${width}px` }}
            className="@container max-w-full p-8 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)] transition-[width] duration-300 motion-reduce:transition-none"
          >
            <article
              className={`${c.body.join(" ")} gap-12 p-12 br-lg border bg-surface`}
            >
              <span
                className={`${c.image.join(" ")} shrink-0 br-md bg-[linear-gradient(135deg,var(--violet-400),var(--pink-400)_60%,var(--orange-300))]`}
              />
              <span className="flex flex-col gap-4 min-w-0">
                <span className="font-15 font-w-700">Карточка</span>
                <span className="font-13 text-foreground-muted">
                  Перестраивается по ширине блока, а не окна.
                </span>
              </span>
            </article>
          </div>
        </Canvas>
      }
      output={
        <Output
          classes={[...c.card, ...c.body, ...c.image]}
          css={css}
          code={(attr) => `<div ${attr}="${c.card.join(" ")}">
  <article ${attr}="${c.body.join(" ")} gap-12">
    <img ${attr}="${c.image.join(" ")}" …>
    <div>…</div>
  </article>
</div>`}
        />
      }
    />
  );
}
