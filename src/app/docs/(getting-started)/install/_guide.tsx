"use client";

// Установка: выбор стека (карточки с логотипами, как у shadcn/ui) и способа подключения, под ними — шаги
// только для выбранной пары. Шаги всех пар готовит сервер (page.tsx), здесь решается только, какие показать.
// Стек и способ — радиокнопки: стрелки на клавиатуре переключают, скринридер читает «1 из 5». Выбор
// запоминается: в адресе (?stack=react&mode=plain — ссылкой можно поделиться) и в браузере (вернулись — тот же).

import { Css3 } from "@boxicons/react/Css3";
import { Html5 } from "@boxicons/react/Html5";
import { NextJs } from "@boxicons/react/NextJs";
import { ReactIcon } from "@boxicons/react/ReactIcon";
import { Sass } from "@boxicons/react/Sass";
import { type ReactNode, useEffect, useId, useState } from "react";
import { ENGINE_MODES, STACKS, type StackId } from "../../_nav";

type ModeId = (typeof ENGINE_MODES)[number]["id"];

// иконки стеков — в фирменных цветах
const ICONS = {
  nextjs: { Icon: NextJs, color: "text-foreground" },
  react: { Icon: ReactIcon, color: "text-cyan-500" },
  html: { Icon: Html5, color: "text-orange-500" },
  css: { Icon: Css3, color: "text-blue-500" },
  scss: { Icon: Sass, color: "text-pink-500" },
};

const MODE_TEXT: Record<ModeId, string> = {
  engine: "Пишете классы в разметке — движок соберёт CSS только из них.",
  plain: "Готовые стили RenDit SCSS и свой CSS на токенах.",
};

const KEY = "install-choice";
const isStack = (v: unknown): v is StackId => STACKS.some((s) => s.id === v);
const isMode = (v: unknown): v is ModeId =>
  ENGINE_MODES.some((m) => m.id === v);

// подсветка клавиатурного фокуса: сама радиокнопка спрятана, рамку получает её карточка
const FOCUS =
  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-offset-2";
// выбранная карточка: рамка secondary и мягкое кольцо вокруг
const PICKED =
  "has-checked:border-secondary has-checked:bg-secondary/5 has-checked:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]";
const LEGEND =
  "[float:left] w-full mb-10 font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle";

export function InstallGuide({
  leads,
  panels,
}: {
  leads: Record<StackId, ReactNode>;
  /** шаги по ключу «стек:способ» */
  panels: Record<string, ReactNode>;
}) {
  const [stack, setStack] = useState<StackId>("nextjs");
  const [mode, setMode] = useState<ModeId>("engine");
  const name = useId();

  // ссылка с ?stack= важнее запомненного
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    let saved: { stack?: unknown; mode?: unknown } = {};
    try {
      saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    } catch {}
    const s = query.get("stack") ?? saved.stack;
    const m = query.get("mode") ?? saved.mode;
    if (isStack(s)) setStack(s);
    if (isMode(m)) setMode(m);
  }, []);

  const choose = (next: { stack: StackId; mode: ModeId }) => {
    setStack(next.stack);
    setMode(next.mode);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    const url = new URL(location.href);
    url.searchParams.set("stack", next.stack);
    url.searchParams.set("mode", next.mode);
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="flex flex-col gap-24">
      <fieldset className="min-w-0 m-0 p-0 border-0">
        <legend className={LEGEND}>Стек</legend>
        <div className="[clear:both] grid grid-cols-5 gap-6 sm:gap-10">
          {STACKS.map(({ id, title }) => {
            const { Icon, color } = ICONS[id];
            return (
              <label
                key={id}
                className={`group flex flex-col items-center gap-8 py-12 sm:py-16 br-xl border bg-surface shadow-1 cursor-pointer select-none font-12 sm:font-14 font-w-600 text-foreground-muted transition-[border-color,background-color,box-shadow,color,translate,scale] duration-300 ease-spring hover:-translate-y-1 hover:border-border-strong hover:text-foreground active:scale-96 has-checked:text-foreground ${PICKED} ${FOCUS}`}
              >
                <input
                  type="radio"
                  name={`${name}-stack`}
                  value={id}
                  checked={stack === id}
                  onChange={() => choose({ stack: id, mode })}
                  className="sr-only"
                />
                <span className="size-36 sm:size-44 br-full grid place-items-center bg-surface-muted transition-transform duration-500 ease-spring-bouncy group-[:has(:checked)]:scale-110">
                  <Icon
                    width={24}
                    height={24}
                    className={color}
                    aria-hidden="true"
                  />
                </span>
                {title}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="min-w-0 m-0 p-0 border-0">
        <legend className={LEGEND}>Способ</legend>
        <div className="[clear:both] grid sm:grid-cols-2 gap-10">
          {ENGINE_MODES.map(({ id, title }) => (
            <label
              key={id}
              className={`flex items-start gap-12 p-16 br-xl border bg-surface shadow-1 cursor-pointer select-none transition-[border-color,background-color,box-shadow] duration-300 hover:border-border-strong ${PICKED} ${FOCUS}`}
            >
              <input
                type="radio"
                name={`${name}-mode`}
                value={id}
                checked={mode === id}
                onChange={() => choose({ stack, mode: id })}
                className="peer sr-only"
              />
              {/* свой кружок радиокнопки: точка внутри вырастает на пружине */}
              <span
                aria-hidden="true"
                className="mt-1 size-20 shrink-0 br-full border-2 border-border-strong grid place-items-center transition-colors peer-checked:border-secondary after:size-10 after:br-full after:bg-secondary after:scale-0 after:transition-[scale] after:duration-400 after:ease-spring-bouncy peer-checked:after:scale-100"
              />
              <span className="flex flex-col gap-4">
                <span className="flex flex-wrap items-center gap-8 font-15 font-w-600">
                  {title}
                  {id === "engine" && (
                    <span className="px-8 py-2 br-full bg-accent text-accent-foreground font-11 font-w-700">
                      Рекомендуем
                    </span>
                  )}
                </span>
                <span className="font-13 text-foreground-muted">
                  {MODE_TEXT[id]}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="font-15 text-foreground-muted">{leads[stack]}</p>

      {/* в странице — только шаги выбранной пары: остальные девять браузеру не нужно ни рисовать, ни оживлять
          (на телефоне это заметно быстрее). Новые шаги проявляются (@starting-style) */}
      <div
        key={`${stack}:${mode}`}
        className="transition-[opacity,translate] duration-400 ease-spring [@starting-style]:opacity-0 [@starting-style]:translate-y-8 motion-reduce:transition-none"
      >
        {panels[`${stack}:${mode}`]}
      </div>
    </div>
  );
}
