"use client";

// Набор для конструкторов страниц классов. Пример в конструкторе — настоящие классы с настоящим CSS: страница
// заранее просит у движка CSS всех классов, которые конструктор может выбрать (class-css.ts), а ClassStyle
// вставляет правила выбранных в <style>. Так пример выглядит ровно как в проекте, а вкладка «CSS» показывает,
// что движок напишет. Кусочки:
//   Builder — рамка: настройки слева, справа пример и результат (на телефоне — друг под другом);
//   Field, Seg, Range, Switch — подпись, сегменты, ползунок по списку классов, переключатель;
//   Output — классы (копировать), код под платформу справки (JSX или HTML) и CSS от движка; для HTML без сборки —
//            каких классов нет в готовом CSS и ссылка в CSS-конструктор, которая сразу их вписывает;
//   HtmlHint — та же подсказка для HTML у конструкторов без карты CSS (цвета, текст, отступы);
//   ClassCopy — класс-кнопка: нажали — скопирован (в таблицах «класс → CSS»);
//   useBox — настоящий размер элемента примера в пикселях (подписи «240px»).

import Link from "next/link";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { useDocsPlatform, usesJsx } from "../docs/_platform";
import type { CssMap } from "./class-css";
import {
  COPIED_RING,
  Copied,
  CopyButton,
  CopyIcon,
  useCopy,
} from "./copy-button";

export const LABEL =
  "font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle";
const SEG =
  "h-30 px-10 br-full font-12 font-w-600 text-foreground-muted whitespace-nowrap transition hover:text-foreground aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2";

// размер элемента в пикселях, обновляется при каждом изменении
export function useBox<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setBox({ width: Math.round(r.width), height: Math.round(r.height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, box] as const;
}

// у правила есть обёртка @media / @container / @supports — как в движке, такие идут после простых
const WRAPPED = /^@(media|container|supports)/;

// Правила выбранных классов — в <style>, и только внутри примера (@scope ([data-preview]) — его ставит Canvas):
// иначе, например, поздний .flex перебил бы max-sm:hidden у шапки и меню на всей странице. Порядок — как у
// движка: сначала простые правила, потом с брейкпоинтами, чтобы hidden sm:flex работал и в примере.
export function ClassStyle({
  css,
  classes,
}: {
  css: CssMap;
  classes: readonly string[];
}) {
  const picked = classes.map((c) => css[c]).filter(Boolean);
  const props = [...new Set(picked.flatMap((c) => c.props))];
  const rules = picked
    .map((c) => c.rule)
    .sort((a, b) => Number(WRAPPED.test(a)) - Number(WRAPPED.test(b)));
  return (
    <style>
      {`${props.join("\n")}
@layer utilities {
@scope ([data-preview]) {
${rules.join("\n")}
}
}`}
    </style>
  );
}

export function Builder({
  controls,
  preview,
  output,
}: {
  controls: ReactNode;
  preview: ReactNode;
  output: ReactNode;
}) {
  return (
    <div className="br-xl border bg-surface shadow-1 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="flex flex-col gap-16 p-16 sm:p-20 border-b lg:border-b-0 lg:border-r">
        {controls}
      </div>
      <div className="flex flex-col gap-14 p-16 sm:p-20 min-w-0">
        {preview}
        {output}
      </div>
    </div>
  );
}

// холст примера: точки на фоне, как у страницы; data-preview — граница, внутри которой работают правила ClassStyle
export function Canvas({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-preview
      className={`relative min-h-200 p-20 br-lg border bg-background bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  note,
  children,
}: {
  label: string;
  /** справа от подписи: выбранный класс или значение */
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <span className={`${LABEL} flex justify-between gap-8`}>
        {label}
        {note && (
          <span className="font-mono normal-case letter-s-0 text-secondary">
            {note}
          </span>
        )}
      </span>
      {children}
    </div>
  );
}

export function Seg<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly { id: T; title: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 p-3 br-xl bg-foreground/5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={SEG}
        >
          {o.title}
        </button>
      ))}
    </div>
  );
}

// варианты-классы для Seg: пустой класс — «нет»
export const classOptions = (list: readonly string[]) =>
  list.map((c) => ({ id: c, title: c || "нет" }));

// ползунок по списку: значение — номер в списке классов (шкала может быть неровной: 0, 4, 8 … 480)
export function Range({
  values,
  value,
  onChange,
  label,
}: {
  values: readonly string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const i = Math.max(0, values.indexOf(value));
  return (
    <input
      type="range"
      aria-label={label}
      aria-valuetext={value}
      min={0}
      max={values.length - 1}
      step={1}
      value={i}
      onChange={(e) => onChange(values[Number(e.target.value)])}
      className="w-full [accent-color:var(--secondary)]"
    />
  );
}

export function Switch({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex items-center justify-between gap-12 font-14 font-w-500 text-left"
    >
      {children}
      <span className="relative shrink-0 w-40 h-24 br-full bg-foreground/15 transition-colors group-[[aria-checked=true]]:bg-secondary before:absolute before:top-3 before:left-3 before:size-18 before:br-full before:bg-white before:shadow-2 before:transition-[translate] before:duration-300 before:ease-spring group-[[aria-checked=true]]:before:translate-x-16 motion-reduce:before:transition-none" />
    </button>
  );
}

const TABS = [
  { id: "classes", title: "Классы" },
  { id: "code", title: "Код" },
  { id: "css", title: "CSS" },
] as const;

type Tab = (typeof TABS)[number]["id"];

// результат: классы, код под платформу (className или class) и CSS, который напишет движок
export function Output({
  classes,
  css,
  tag = "div",
  inner = "",
  code: customCode,
}: {
  classes: readonly string[];
  css: CssMap;
  /** тег элемента в коде */
  tag?: string;
  /** содержимое элемента в коде */
  inner?: string;
  /** свой код из нескольких элементов; attr — className для JSX или class для HTML */
  code?: (attr: "className" | "class") => string;
}) {
  const id = useId();
  const [tab, setTab] = useState<Tab>("classes");
  const platform = useDocsPlatform();
  const attr = usesJsx(platform) ? "className" : "class";
  const list = classes.filter(Boolean);
  const joined = list.join(" ");
  const code =
    customCode?.(attr) ?? `<${tag} ${attr}="${joined}">${inner}</${tag}>`;
  const rules = list
    .map((c) => css[c]?.show && `/* ${c} */\n${css[c].show}`)
    .filter(Boolean)
    .join("\n\n");
  const text = tab === "classes" ? joined : tab === "code" ? code : rules;
  // HTML без сборки берёт готовый CSS: каких классов в нём нет — их соберёт CSS-конструктор
  const missing =
    platform === "html" ? list.filter((c) => css[c] && !css[c].ready) : [];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <div role="tablist" aria-label="Результат" className="flex gap-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`${id}-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`${id}-panel`}
            onClick={() => setTab(t.id)}
            className="h-28 px-10 br-full font-12 font-w-600 text-foreground-muted transition hover:text-foreground aria-selected:bg-foreground aria-selected:text-background"
          >
            {t.title}
          </button>
        ))}
      </div>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-${tab}`}
        className="flex items-start gap-10 p-12 br-lg border bg-surface-muted/50"
      >
        <pre className="flex-1 min-w-0 max-h-200 overflow-auto pt-6 font-13/20 font-mono whitespace-pre-wrap break-words">
          {text || "—"}
        </pre>
        <CopyButton text={text} className="shrink-0" />
      </div>
      <MissingHint missing={missing} />
    </div>
  );
}

// «Для HTML без сборки: в готовом CSS нет …» и ссылка, которая вписывает эти классы в CSS-конструктор
function MissingHint({ missing }: { missing: readonly string[] }) {
  if (!missing.length) return null;
  return (
    <p className="flex flex-wrap items-center gap-x-6 gap-y-4 px-12 py-8 br-lg bg-warning/10 font-12 text-foreground-muted">
      Для HTML без сборки: в готовом CSS нет
      {missing.map((c) => (
        <code key={c} className="px-6 br-sm bg-foreground/6 text-foreground">
          {c}
        </code>
      ))}
      <Link
        href={`/docs/css?add=${missing.map(encodeURIComponent).join("+")}`}
        className="font-w-600 text-secondary hover:underline"
      >
        добавить в CSS-конструкторе →
      </Link>
    </p>
  );
}

// классы готового CSS — один раз на страницу и только для платформы HTML (/rendit/ready)
let ready: Promise<Set<string>> | undefined;
const readyClasses = () =>
  (ready ??= fetch("/rendit/ready")
    .then((r) => r.json())
    .then((list: string[]) => new Set(list)));

// та же подсказка для конструкторов без карты CSS (цвета, текст, отступы): какие классы есть в готовом CSS,
// узнаёт у сайта сама
export function HtmlHint({ classes }: { classes: readonly string[] }) {
  const html = useDocsPlatform() === "html";
  const [set, setSet] = useState<Set<string>>();
  useEffect(() => {
    if (html) readyClasses().then(setSet, () => {});
  }, [html]);
  if (!html || !set) return null;
  return <MissingHint missing={classes.filter((c) => c && !set.has(c))} />;
}

// класс в таблице: нажали — скопирован, рядом отклик «Скопировано»
export function ClassCopy({ cls }: { cls: string }) {
  const [copied, copy] = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(cls)}
      aria-label={copied ? `${cls} скопирован` : `Скопировать ${cls}`}
      className={`group relative inline-flex items-center gap-6 -mx-6 px-6 py-2 br-md font-mono font-w-600 text-secondary hover:bg-secondary/8 ${COPIED_RING(copied)}`}
    >
      {cls}
      <span className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <CopyIcon copied={copied} />
      </span>
      <Copied copied={copied} side="top" />
    </button>
  );
}
