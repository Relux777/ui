"use client";

// Конструктор состояний: «когда» — вариант-состояние, «что применить» — вид из групп (фон, текст, масштаб,
// прозрачность, рамка). Класс собирается из двух полных строк, поэтому движок видит его целиком; CSS
// выбранного даёт движок (ClassStyle), вкладка «CSS» показывает его же.
// Превью — под состояние: hover, active и focus-visible работают мышью и клавиатурой, checked и disabled —
// настоящими атрибутами, aria- и data- включаются переключателем, has-checked — флажок внутри карточки,
// group-hover — внутри .group, not-first — второй из пары, dark — видно в тёмной теме сайта.

import { useState } from "react";
import {
  Builder,
  Canvas,
  ClassStyle,
  classOptions,
  Field,
  Output,
  Seg,
  Switch,
} from "../../../../_docs/builder";
import type { CssMap } from "../../../../_docs/class-css";
import { WHEN } from "./_classes";

const KINDS = [
  { id: "bg", title: "Фон" },
  { id: "text", title: "Текст" },
  { id: "scale", title: "Масштаб" },
  { id: "opacity", title: "Прозрачность" },
  { id: "border", title: "Рамка" },
] as const;
type Kind = (typeof KINDS)[number]["id"];

const WHATS: Record<Kind, readonly string[]> = {
  bg: ["bg-secondary", "bg-danger", "bg-surface-muted", "bg-gray-900"],
  text: ["text-secondary", "text-danger", "text-primary-foreground"],
  scale: ["scale-95", "scale-105"],
  opacity: ["opacity-50", "opacity-100"],
  border: ["border-secondary", "border-danger"],
};

// карточка превью: bg-primary с рамкой — так видны и цвета, и border-*
const BASE =
  "flex items-center justify-center min-h-56 px-24 br-full border bg-primary text-primary-foreground font-14 font-w-600 transition-[background-color,color,opacity,scale,border-color] duration-200 motion-reduce:transition-none";
const CARD =
  "flex items-center justify-center min-h-96 br-lg border bg-surface [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_25%,transparent)]";

export function StatesBuilder({ css }: { css: CssMap }) {
  const [when, setWhen] = useState<string>(WHEN[0].id);
  const [kind, setKind] = useState<Kind>("bg");
  const [what, setWhat] = useState(WHATS.bg[0]);
  const [attrOn, setAttrOn] = useState(true);

  const cls = `${when}:${what}`;
  const isAria = when === "aria-[current=page]";
  const isData = when === "data-[state=open]";

  const preview =
    when === "checked" ? (
      <label className="flex items-center gap-10 font-14 font-w-600 cursor-pointer">
        <input
          type="checkbox"
          defaultChecked
          aria-label="Флажок"
          className={`${cls} size-44 br-sm accent-secondary cursor-pointer`}
        />
        Выключите флажок — состояние пропадёт
      </label>
    ) : when === "has-checked" ? (
      <label
        className={`${cls} ${CARD} gap-10 px-20 font-14 font-w-600 cursor-pointer`}
      >
        <input
          type="checkbox"
          defaultChecked
          className="size-22 accent-secondary cursor-pointer"
        />
        Флажок внутри карточки
      </label>
    ) : when === "group-hover" ? (
      <div className={`group ${CARD}`}>
        <button type="button" className={`${cls} ${BASE}`}>
          Наведите на карточку
        </button>
      </div>
    ) : when === "not-first" ? (
      <div className="flex flex-wrap gap-10">
        {["Первый", "Второй", "Третий"].map((label) => (
          <span key={label} className={`${cls} ${BASE} min-h-48 px-18 font-13`}>
            {label}
          </span>
        ))}
      </div>
    ) : (
      <button
        type="button"
        disabled={when === "disabled"}
        aria-current={isAria && attrOn ? "page" : undefined}
        data-state={isData && attrOn ? "open" : undefined}
        className={`${cls} ${BASE}`}
      >
        {when === "disabled" ? "Заблокирована" : "Кнопка"}
      </button>
    );

  return (
    <Builder
      controls={
        <>
          <Field label="Когда" note={cls}>
            <Seg value={when} options={WHEN} onChange={setWhen} />
          </Field>
          <Field label="Вид">
            <Seg
              value={kind}
              options={KINDS}
              onChange={(k) => {
                setKind(k);
                setWhat(WHATS[k][0]);
              }}
            />
          </Field>
          <Field label="Что применить" note={what}>
            <Seg
              value={what}
              options={classOptions(WHATS[kind])}
              onChange={setWhat}
            />
          </Field>
          {(isAria || isData) && (
            <Switch checked={attrOn} onChange={setAttrOn}>
              {isAria ? 'aria-current="page"' : 'data-state="open"'} на кнопке
            </Switch>
          )}
        </>
      }
      preview={
        <Canvas>
          <ClassStyle css={css} classes={[cls]} />
          <div className="flex flex-col items-center gap-10">
            {preview}
            {when === "dark" && (
              <p className="font-12 text-foreground-muted">
                dark: видно в тёмной теме сайта — переключите тему в быстром
                меню у стрелки
              </p>
            )}
            {when === "focus-visible" && (
              <p className="font-12 text-foreground-muted">
                focus-visible: нажмите Tab — кольцо появится только с клавиатуры
              </p>
            )}
          </div>
        </Canvas>
      }
      output={<Output classes={[cls]} css={css} tag="button" inner="Кнопка" />}
    />
  );
}
