"use client";

// Установка: выбор платформы (карточки с логотипом и версией) и ответы на её вопросы — язык, стили, движок,
// редактор (с движком), скрипты (choice.ts). Карточка выбора — в 3D: наклоняется за курсором, по ней бежит
// мягкий свет цветов RenDit (components/Tilt).
// Вопросы, которых у платформы нет, плавно сворачиваются. Переключатели — как в iOS: бегунок переезжает
// на пружине; под каждым — что значит выбранный вариант. Под выбором — сколько шагов и что понадобится, затем
// шаги ровно для этого набора (steps.tsx), собираются в браузере мгновенно, без запросов к серверу. Выбор
// запоминается: в адресе (?stack=react&lang=js… — ссылкой можно поделиться, кнопка «Ссылка») и в браузере.
// Всё на радиокнопках: стрелки на клавиатуре переключают, скринридер читает «1 из 4».

import { CheckCircle } from "@boxicons/react/CheckCircle";
import { Html5 } from "@boxicons/react/Html5";
import { Link as LinkIcon } from "@boxicons/react/Link";
import { ListOl } from "@boxicons/react/ListOl";
import { NextJs } from "@boxicons/react/NextJs";
import { Nodejs } from "@boxicons/react/Nodejs";
import { ReactIcon } from "@boxicons/react/ReactIcon";
import { Window } from "@boxicons/react/Window";
import { type ReactNode, useEffect, useId, useState } from "react";
import { Tilt } from "@/components/Tilt";
import {
  COPIED_RING,
  Copied,
  CopyIcon,
  useCopy,
} from "../../../_docs/copy-button";
import { Steps } from "../../../_docs/docs";
import {
  type Choice,
  choiceKey,
  choiceParams,
  DEFAULT_CHOICE,
  OPTIONS,
  PLATFORMS,
  type Platform,
  parseChoice,
  QUESTION_TITLES,
  type Question,
  questionsFor,
} from "./choice";
import { buildGuide } from "./steps";

const KEY = "install-choice";

// логотипы — в фирменных цветах
const ICONS: Record<Platform, { Icon: typeof NextJs; color: string }> = {
  nextjs: { Icon: NextJs, color: "text-foreground" },
  react: { Icon: ReactIcon, color: "text-cyan-500" },
  node: { Icon: Nodejs, color: "text-green-600" },
  html: { Icon: Html5, color: "text-orange-500" },
};

const ALL_QUESTIONS = Object.keys(OPTIONS) as Question[];

const LABEL = "font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle";
const CHIP = "flex items-center gap-6 h-30 px-12 br-full border";
// клавиатурный фокус: сама радиокнопка спрятана, рамку получает её карточка
const FOCUS =
  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-offset-2";

// Переключатель из двух вариантов: подложка-бегунок (::before) переезжает к выбранному на пружине
function Segmented({
  q,
  value,
  name,
  onChange,
}: {
  q: Question;
  value: string;
  name: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset
      aria-describedby={`${name}-${q}-hint`}
      className="relative grid grid-cols-2 min-w-0 m-0 p-3 br-full border border-foreground/5 bg-foreground/5 before:absolute before:top-3 before:bottom-3 before:left-3 before:w-[calc(50%-3px)] before:br-full before:bg-surface before:shadow-2 dark:before:bg-gray-700 before:transition-[translate] before:duration-500 before:ease-spring has-[label:nth-of-type(2)_input:checked]:before:translate-x-full motion-reduce:before:transition-none"
    >
      <legend className="sr-only">{QUESTION_TITLES[q]}</legend>
      {OPTIONS[q].map((o) => (
        <label
          key={o.id}
          className={`relative z-1 flex items-center justify-center gap-6 min-w-0 h-36 px-10 br-full cursor-pointer select-none font-13 font-w-600 text-foreground-muted transition-colors hover:text-foreground has-checked:text-foreground ${FOCUS}`}
        >
          <input
            type="radio"
            name={`${name}-${q}`}
            value={o.id}
            checked={value === o.id}
            onChange={() => onChange(o.id)}
            className="sr-only"
          />
          <span className="truncate">{o.title}</span>
          <span className="max-sm:hidden font-11 font-w-500 text-foreground-subtle whitespace-nowrap">
            {o.note}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

// Строка вопроса: название, переключатель и под ним — что значит выбранный вариант (для тех, кто выбирает
// впервые; новая подсказка проявляется). Сворачивается в ноль (строки сетки 0fr), если у платформы такого
// вопроса нет.
function Row({
  title,
  hint,
  hintId,
  shown,
  children,
}: {
  title: string;
  hint: string;
  hintId: string;
  shown: boolean;
  children: ReactNode;
}) {
  return (
    <div
      data-shown={shown || undefined}
      inert={!shown}
      className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-spring data-shown:grid-rows-[1fr] data-shown:opacity-100 motion-reduce:transition-none"
    >
      <div className="min-h-0 overflow-hidden -mx-4 px-4">
        <div className="grid sm:grid-cols-[72px_minmax(0,1fr)] sm:items-center gap-x-16 gap-y-8 pt-14 pb-4">
          <span className={LABEL}>{title}</span>
          {children}
          <p
            key={hint}
            id={hintId}
            className="sm:col-start-2 -mt-2 px-4 font-12 text-foreground-muted transition-opacity duration-300 [@starting-style]:opacity-0 motion-reduce:transition-none"
          >
            {hint}
          </p>
        </div>
      </div>
    </div>
  );
}

// «5 шагов», «2 шага»
const stepsLabel = (n: number) =>
  `${n} ${n % 10 === 1 && n % 100 !== 11 ? "шаг" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "шага" : "шагов"}`;

// «Ссылка» — скопировать адрес с выбранным набором
function ShareButton({ choice }: { choice: Choice }) {
  const [copied, copy] = useCopy();
  const share = () => {
    const url = new URL(location.href);
    url.search = choiceParams(choice).toString();
    url.hash = "install";
    copy(url.toString());
  };
  return (
    <button
      type="button"
      onClick={share}
      aria-label={copied ? "Ссылка скопирована" : "Ссылка на этот набор"}
      // z-10: «Скопировано» всегда над светом карточки (.tilt-light, z-index 5), даже пока кнопка сжата
      className={`relative z-10 shrink-0 flex items-center gap-6 h-32 px-12 br-full border bg-surface font-12 font-w-600 text-foreground-muted hover:text-foreground active:scale-95 ${COPIED_RING(copied)}`}
    >
      <CopyIcon copied={copied} Icon={LinkIcon} />
      Ссылка
      <Copied copied={copied} side="top" />
    </button>
  );
}

export function InstallGuide() {
  const [choice, setChoice] = useState<Choice>(DEFAULT_CHOICE);
  const name = useId();

  // ссылка с параметрами важнее запомненного
  useEffect(() => {
    let saved = DEFAULT_CHOICE;
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}");
      saved = parseChoice((p) => raw[p]);
    } catch {}
    const query = new URLSearchParams(location.search);
    setChoice(parseChoice((p) => query.get(p), saved));
  }, []);

  const update = (patch: Partial<Choice>) => {
    const next = { ...choice, ...patch };
    setChoice(next);
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify(Object.fromEntries(choiceParams(next))),
      );
    } catch {}
    const url = new URL(location.href);
    url.search = choiceParams(next).toString();
    window.history.replaceState(null, "", url);
  };

  const guide = buildGuide(choice);
  const optional = guide.steps.filter((s) => s.optional).length;
  const questions = questionsFor(choice);
  const platform = PLATFORMS.find((p) => p.id === choice.platform);
  const summary = [
    `${platform?.title} ${platform?.version}`,
    ...questions.map(
      (q) => OPTIONS[q].find((o) => o.id === choice[q])?.title ?? "",
    ),
  ];

  return (
    <div className="flex flex-col gap-24">
      {/* карточка выбора — в 3D: наклоняется за курсором, по ней бежит свет (.tilt + Tilt, как на boxicons.com) */}{" "}
      <div className="tilt relative isolate p-14 sm:p-20 br-2xl border bg-surface shadow-3 before:absolute before:inset-0 before:-z-1 before:br-2xl before:bg-[radial-gradient(60%_80%_at_0%_0%,color-mix(in_oklab,var(--secondary)_7%,transparent),transparent),radial-gradient(50%_70%_at_100%_100%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent)]">
        <Tilt />
        <fieldset className="min-w-0 m-0 p-0 border-0">
          <legend className={`${LABEL} [float:left] w-full mb-12`}>
            Платформа
          </legend>
          <div className="[clear:both] grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
            {PLATFORMS.map(({ id, title, version, note }) => {
              const { Icon, color } = ICONS[id];
              return (
                <label
                  key={id}
                  className={`group relative flex items-center sm:flex-col sm:items-start gap-8 sm:gap-10 p-12 sm:p-14 br-xl border bg-surface cursor-pointer select-none transition-[border-color,box-shadow,translate,scale] duration-300 ease-spring hover:-translate-y-1 hover:border-border-strong hover:shadow-2 active:scale-97 has-checked:border-secondary has-checked:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)] ${FOCUS}`}
                >
                  <input
                    type="radio"
                    name={`${name}-platform`}
                    value={id}
                    checked={choice.platform === id}
                    onChange={() => update({ platform: id })}
                    className="sr-only"
                  />
                  <span className="relative size-32 sm:size-40 shrink-0 br-full grid place-items-center bg-surface-muted transition-transform duration-500 ease-spring-bouncy group-[:has(:checked)]:scale-110">
                    <Icon
                      width={24}
                      height={24}
                      className={`size-20 sm:size-24 ${color}`}
                      aria-hidden="true"
                    />
                    {/* галочка выбранной — значком на логотипе (на узкой карточке текст не перекрывает),
                        выскакивает на пружине; кольцо цвета карточки отделяет её от логотипа */}
                    <CheckCircle
                      pack="filled"
                      width={18}
                      height={18}
                      aria-hidden="true"
                      className="absolute -right-4 -bottom-4 br-full bg-surface text-secondary scale-0 opacity-0 transition-[scale,opacity] duration-400 ease-spring-bouncy group-[:has(:checked)]:scale-100 group-[:has(:checked)]:opacity-100"
                    />
                  </span>
                  <span className="flex flex-col min-w-0">
                    {/* версия не помещается рядом — переносится под название, а не вылезает за карточку */}
                    <span className="flex flex-wrap items-center gap-x-6 font-14 sm:font-15 font-w-700">
                      {title}
                      <span className="px-6 py-1 br-full bg-foreground/5 font-11 font-w-600 text-foreground-muted whitespace-nowrap">
                        {version}
                      </span>
                    </span>
                    <span className="font-12 text-foreground-muted truncate">
                      {note}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {ALL_QUESTIONS.map((q) => (
          <Row
            key={q}
            title={QUESTION_TITLES[q]}
            hint={
              (OPTIONS[q] as readonly { id: string; hint: string }[]).find(
                (o) => o.id === choice[q],
              )?.hint ?? ""
            }
            hintId={`${name}-${q}-hint`}
            shown={questions.includes(q)}
          >
            <Segmented
              q={q}
              value={choice[q]}
              name={name}
              onChange={(id) => update({ [q]: id } as Partial<Choice>)}
            />
          </Row>
        ))}

        <div className="flex items-center gap-10 mt-16 pt-14 border-t">
          <CheckCircle
            width={18}
            height={18}
            className="shrink-0 text-success"
            aria-hidden="true"
          />
          <p
            aria-live="polite"
            className="flex-1 min-w-0 font-13 font-w-600 text-foreground"
          >
            {summary.join(" · ")}
          </p>
          <ShareButton choice={choice} />
        </div>
      </div>
      {/* под выбор: о чём эти шаги, сколько их и что понадобится */}
      <div className="flex flex-col gap-12">
        <p className="font-15 text-foreground-muted">{guide.lead}</p>
        {/* у каждой метки свой цвет: шаги — лиловый RenDit, Node.js — его зелёный, HTML — его оранжевый */}
        <ul className="flex flex-wrap gap-8 font-12 font-w-500">
          <li
            className={`${CHIP} border-violet-500/20 bg-violet-500/8 text-violet-600 dark:text-violet-400`}
          >
            <ListOl size="xs" aria-hidden="true" />
            {stepsLabel(guide.steps.filter((s) => !s.optional).length)}
            {optional > 0 && ` + ${optional} по желанию`}
          </li>
          {platform?.node ? (
            <li
              className={`${CHIP} border-green-500/20 bg-green-500/8 text-green-600 dark:text-green-500`}
            >
              <Nodejs size="xs" aria-hidden="true" />
              Нужен Node.js 20+
            </li>
          ) : (
            <li
              className={`${CHIP} border-orange-500/20 bg-orange-500/8 text-orange-600 dark:text-orange-400`}
            >
              <Window size="xs" aria-hidden="true" />
              Нужны только редактор и браузер
            </li>
          )}
        </ul>
      </div>
      {/* новые шаги проявляются (@starting-style) — смена набора видна, но не дёргает страницу */}
      <div
        key={choiceKey(choice)}
        className="transition-[opacity,translate] duration-400 ease-spring [@starting-style]:opacity-0 [@starting-style]:translate-y-8 motion-reduce:transition-none"
      >
        <Steps steps={guide.steps} done={guide.done} />
      </div>
    </div>
  );
}
