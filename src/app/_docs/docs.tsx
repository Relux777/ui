// Строительные блоки страницы-документации: шапка страницы, заголовки-якоря, раздел, пример «превью + код»,
// палитра, блок кода с подсветкой, шаги, заметка, таблица, список файлов, карточки-ссылки.
// Классы в примерах написаны строками целиком — так RenDit Code находит их в исходнике.
// Заголовки с data-toc попадают в «На этой странице» окна быстрого доступа (components/ui/QuickNav).

import { AlertTriangle } from "@boxicons/react/AlertTriangle";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { Check } from "@boxicons/react/Check";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import { Eye } from "@boxicons/react/Eye";
import { File } from "@boxicons/react/File";
import { FileCode } from "@boxicons/react/FileCode";
import { Folder } from "@boxicons/react/Folder";
import { FolderOpen } from "@boxicons/react/FolderOpen";
import { InfoCircle } from "@boxicons/react/InfoCircle";
import { LightBulb } from "@boxicons/react/LightBulb";
import { Star } from "@boxicons/react/Star";
import { Terminal } from "@boxicons/react/Terminal";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { CopyButton } from "./copy-button";
import { highlight, type Kind, type Lang, langOf } from "./highlight";

export function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-toc={title}
      className="flex flex-col gap-20 scroll-mt-80"
    >
      <header className="flex flex-col gap-6">
        <h2 className="font-28 font-w-700 -letter-s-2">{title}</h2>
        <p className="font-15 text-foreground-muted max-w-72ch">{lead}</p>
      </header>
      {children}
    </section>
  );
}

export function Example({
  title,
  note,
  code,
  children,
}: {
  title: string;
  note?: ReactNode;
  code: string;
  children: ReactNode;
}) {
  return (
    <div className="br-xl border bg-surface overflow-hidden">
      <div className="flex flex-col gap-4 px-20 pt-16">
        <h3 className="font-16 font-w-500">{title}</h3>
        {note && <p className="font-13 text-foreground-muted">{note}</p>}
      </div>
      <div className="p-20">{children}</div>
      <div className="relative border-t bg-surface-muted">
        <pre className="p-16 pr-56 font-13/20 font-mono overflow-x-auto whitespace-pre">
          <code>{code}</code>
        </pre>
        <CopyButton text={code} />
      </div>
    </div>
  );
}

// Палитра: цвета выводятся через style, а не классы — 154 класса ради одной таблицы не нужны.
// В разметке проекта те же цвета пишутся классами: bg-blue-500, text-gray-600, border-violet-300/40.
export const COLORS = [
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "purple",
  "pink",
];
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export function Palette() {
  return (
    <div className="flex flex-col gap-6 overflow-x-auto pb-4">
      <div className="grid grid-cols-[72px_repeat(11,minmax(44px,1fr))] gap-6 font-11 text-foreground-subtle min-w-640">
        <span />
        {STEPS.map((s) => (
          <span key={s} className="text-center">
            {s}
          </span>
        ))}
      </div>
      {COLORS.map((c) => (
        <div
          key={c}
          className="grid grid-cols-[72px_repeat(11,minmax(44px,1fr))] gap-6 items-center min-w-640"
        >
          <span className="font-12 text-foreground-muted">{c}</span>
          {STEPS.map((s) => (
            <span
              key={s}
              title={`bg-${c}-${s}`}
              className="h-36 br-sm border border-foreground/5"
              style={{ background: `var(--${c}-${s})` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Swatch({
  name,
  className,
  note,
}: {
  name: string;
  className: string;
  note: string;
}) {
  return (
    <div className="flex items-center gap-12">
      <span className={`size-44 br-md border shrink-0 ${className}`} />
      <div className="flex flex-col">
        <code className="font-13 font-mono">{name}</code>
        <span className="font-12 text-foreground-muted">{note}</span>
      </div>
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="px-6 py-2 br-xs bg-surface-muted font-mono font-13 text-foreground">
      {children}
    </code>
  );
}

// ── Страница документации ───────────────────────────────────────────────────

// шапка страницы: путь (Справка › раздел › страница), заголовок, вводный текст и что угодно под ними
export function DocHeader({
  path,
  title,
  lead,
  children,
}: {
  /** разделы после «Справки», последний — эта страница */
  path: string[];
  title: string;
  lead: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-14 max-w-720">
      <nav
        aria-label="Путь"
        className="flex flex-wrap items-center gap-4 font-13 text-foreground-muted"
      >
        <Link href="/docs" className="transition-colors hover:text-foreground">
          Справка
        </Link>
        {path.map((part, i) => (
          <span key={`${i}-${part}`} className="contents">
            <ChevronRight size="xs" aria-hidden="true" />
            <span
              aria-current={i === path.length - 1 ? "page" : undefined}
              className="aria-[current=page]:text-foreground"
            >
              {part}
            </span>
          </span>
        ))}
      </nav>
      <h1 className="font-36 md:font-48 font-w-700 -letter-s-3 leading-1.1 text-balance">
        {title}
      </h1>
      <p className="font-17 text-foreground-muted">{lead}</p>
      {children}
    </header>
  );
}

// заголовок раздела — ссылка на себя (#), как у HeroUI: удобно скопировать адрес раздела
export function Heading({
  id,
  level = 2,
  children,
}: {
  id: string;
  level?: 2 | 3;
  children: string;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      id={id}
      data-toc={children}
      data-toc-sub={level === 3 ? "" : undefined}
      className={`scroll-mt-80 ${level === 2 ? "font-24 md:font-28 -letter-s-2" : "font-19 -letter-s-1"} font-w-700`}
    >
      <a href={`#${id}`} className="group inline-flex items-baseline gap-8">
        {children}
        <span
          aria-hidden="true"
          className="font-w-400 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          #
        </span>
      </a>
    </Tag>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="font-15 text-foreground-muted max-w-72ch">{children}</p>;
}

// ── Код ─────────────────────────────────────────────────────────────────────

// цвета видов — токены --code-* (settings/_tokens.semantic.scss)
const TOKEN: Record<Kind, string> = {
  comment: "text-code-comment italic",
  keyword: "text-code-keyword",
  string: "text-code-string",
  number: "text-code-number",
  tag: "text-code-tag",
  attr: "text-code-attr",
  fn: "text-code-fn",
  punct: "text-code-punct",
};

function Highlighted({ code, lang }: { code: string; lang: Lang }) {
  return highlight(code, lang).map(({ text, kind }, i) =>
    kind ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: куски кода статичны
      <span key={i} className={TOKEN[kind]}>
        {text}
      </span>
    ) : (
      text
    ),
  );
}

// Блок кода с подсветкой. С file — шапка с именем файла и кнопкой копирования, язык — по расширению;
// terminal — шапка «Терминал», у команд приглашение $ (рисует CSS, в копию не попадает), строки с # —
// комментарии. Без шапки — кнопка в углу.
export function CodeBlock({
  code,
  file,
  terminal = false,
  lang,
}: {
  code: string;
  file?: string;
  terminal?: boolean;
  lang?: Lang;
}) {
  const label = terminal ? "Терминал" : file;
  const Icon = terminal ? Terminal : FileCode;
  return (
    <div className="relative min-w-0 br-lg border bg-surface overflow-hidden shadow-1">
      {label && (
        <div className="flex items-center gap-8 h-42 pl-14 pr-5 border-b bg-surface-muted/50 font-12 font-mono text-foreground-muted">
          <Icon size="xs" className="shrink-0" aria-hidden="true" />
          <span className="truncate">{label}</span>
          <CopyButton text={code} className="ml-auto" />
        </div>
      )}
      <pre
        className={`p-16 font-13/22 font-mono text-foreground overflow-x-auto whitespace-pre ${label ? "" : "pr-56"}`}
      >
        <code>
          {terminal ? (
            code.split("\n").map((line, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: строки статичны
                key={i}
                className={
                  line === "" || line.startsWith("#")
                    ? "block min-h-22"
                    : "block before:content-['$'] before:mr-10 before:text-foreground-subtle"
                }
              >
                <Highlighted code={line} lang="bash" />
              </span>
            ))
          ) : (
            <Highlighted code={code} lang={lang ?? langOf(file)} />
          )}
        </code>
      </pre>
      {!label && <CopyButton text={code} />}
    </div>
  );
}

// ── Шаги ────────────────────────────────────────────────────────────────────

export type Step = {
  title: string;
  text?: ReactNode;
  /** блок под текстом: CodeBlock, InstallCommand… */
  block?: ReactNode;
  /** шаг можно пропустить — у заголовка метка «по желанию» */
  optional?: boolean;
  /** необязательный, но советуем — метка «рекомендуем» */
  recommended?: boolean;
  /** живой результат кода из block — «так это выглядит» */
  result?: ReactNode;
};

function StepBody({ step }: { step: Step }) {
  return (
    <div className="min-w-0 flex flex-col gap-10 pt-3">
      <h3 className="flex flex-wrap items-center gap-8 font-16 font-w-600">
        {step.title}
        {step.recommended ? (
          <span className="flex items-center gap-4 px-8 py-2 br-full bg-secondary/12 font-11 font-w-600 text-secondary">
            <Star pack="filled" size="xs" aria-hidden="true" />
            рекомендуем
          </span>
        ) : (
          step.optional && (
            <span className="px-8 py-2 br-full bg-foreground/5 font-11 font-w-600 text-foreground-muted">
              по желанию
            </span>
          )
        )}
      </h3>
      {step.text && (
        <p className="font-14 text-foreground-muted">{step.text}</p>
      )}
      {step.block}
      {step.result && (
        <figure className="relative grid place-items-center min-h-120 m-0 px-20 pt-36 pb-24 br-lg border bg-surface shadow-1 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_9%,transparent)_1px,transparent_0)] [background-size:16px_16px]">
          <figcaption className="absolute top-10 left-12 flex items-center gap-6 font-12 font-w-500 text-foreground-subtle">
            <Eye size="xs" aria-hidden="true" />
            Так это выглядит
          </figcaption>
          {step.result}
        </figure>
      )}
    </div>
  );
}

// Шаги: номера в кружках, соединённые линией (гаснет к низу); последний — «Готово» с галочкой цвета акцента
const STEP =
  "relative grid grid-cols-[32px_minmax(0,1fr)] gap-x-16 pb-32 last:pb-0 before:absolute before:left-15 before:top-40 before:bottom-8 before:w-2 before:br-full before:bg-[linear-gradient(var(--border),color-mix(in_oklab,var(--border)_30%,transparent))] last:before:hidden";
const DOT =
  "size-32 br-full grid place-items-center font-13 font-w-700 tabular-nums";

export function Steps({ steps, done }: { steps: Step[]; done: Step }) {
  return (
    <ol>
      {steps.map((step, i) => (
        <li key={step.title} className={STEP}>
          <span className={`${DOT} bg-surface border shadow-1`}>{i + 1}</span>
          <StepBody step={step} />
        </li>
      ))}
      <li className={STEP}>
        <span className={`${DOT} bg-accent text-accent-foreground shadow-1`}>
          <Check width={18} height={18} aria-hidden="true" />
        </span>
        <StepBody step={done} />
      </li>
    </ol>
  );
}

// ── Заметки, таблицы, файлы, ссылки ─────────────────────────────────────────

const CALLOUT = {
  info: {
    Icon: InfoCircle,
    className: "border-info/25 bg-info/6 [&>svg]:text-info",
  },
  warning: {
    Icon: AlertTriangle,
    className: "border-warning/35 bg-warning/8 [&>svg]:text-warning",
  },
  tip: {
    Icon: LightBulb,
    className: "border-success/25 bg-success/6 [&>svg]:text-success",
  },
};

// Заметка: info — к сведению, warning — важно не пропустить, tip — совет
export function Callout({
  tone = "info",
  children,
}: {
  tone?: keyof typeof CALLOUT;
  children: ReactNode;
}) {
  const { Icon, className } = CALLOUT[tone];
  return (
    <div className={`flex gap-12 p-14 br-lg border font-14 ${className}`}>
      <Icon width={20} height={20} className="shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="min-w-0 overflow-x-auto br-lg border bg-surface shadow-1">
      <table className="w-full min-w-520 [border-collapse:collapse] font-14">
        <thead className="bg-surface-muted/50">
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="px-14 py-10 text-left font-12 font-w-600 uppercase letter-s-4 text-foreground-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: строки статичны
            <tr key={i} className="border-t [vertical-align:top]">
              {cells.map((cell, j) => (
                <td
                  // biome-ignore lint/suspicious/noArrayIndexKey: ячейки статичны
                  key={j}
                  className={`px-14 py-10 ${j === 0 ? "whitespace-nowrap" : "text-foreground-muted"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// что скопировать в проект: строки «иконка · путь · зачем»
export function Files({
  items,
}: {
  items: { path: string; text: string; folder?: boolean }[];
}) {
  return (
    <ul className="br-lg border bg-surface overflow-hidden shadow-1">
      {items.map(({ path, text, folder }) => {
        const Icon = folder ? Folder : File;
        return (
          <li
            key={path}
            className="flex flex-wrap items-center gap-x-10 gap-y-2 px-14 py-10 border-t first:border-t-0"
          >
            <Icon
              size="xs"
              pack={folder ? "filled" : "basic"}
              className={`shrink-0 ${folder ? "text-amber-500" : "text-foreground-muted"}`}
              aria-hidden="true"
            />
            <code className="font-13 font-mono font-w-500">{path}</code>
            <span className="font-13 text-foreground-muted">— {text}</span>
          </li>
        );
      })}
    </ul>
  );
}

// ── Дерево папок ────────────────────────────────────────────────────────────

export type TreeItem = {
  /** папка — с «/» на конце */
  name: string;
  note?: string;
  /** метка у имени: точка входа, не редактировать, необязательно */
  tag?: { text: string; tone: "accent" | "warning" | "muted" };
  children?: TreeItem[];
};

const TAG = {
  accent: "bg-accent/30 text-foreground",
  warning: "bg-warning/12 text-warning",
  muted: "bg-foreground/5 text-foreground-muted",
};

// цвет значка файла — по расширению, как в редакторе
const FILE_COLOR: Record<string, string> = {
  scss: "text-pink-500",
  css: "text-blue-500",
  mjs: "text-amber-500",
  js: "text-amber-500",
  ts: "text-blue-600",
  tsx: "text-blue-600",
  json: "text-lime-600",
};

type TreeRow = TreeItem & { depth: number };
const flatten = (items: TreeItem[], depth = 0): TreeRow[] =>
  items.flatMap((item) => [
    { ...item, depth },
    ...flatten(item.children ?? [], depth + 1),
  ]);

// Дерево папок проекта: строки с отступом по глубине, линии к родительской папке, имя моноширинным,
// пояснения ровной колонкой (на телефоне — под именем), метки. Шапка — корень проекта.
// Отступ и линии считаются от --depth строки: линия на каждый уровень — полоса повторяющегося градиента.
export function FileTree({ root, items }: { root: string; items: TreeItem[] }) {
  return (
    <div className="min-w-0 br-xl border bg-surface shadow-1 overflow-hidden">
      <div className="flex items-center gap-8 h-42 px-14 border-b bg-surface-muted/50 font-13 font-mono font-w-500">
        <FolderOpen
          size="xs"
          pack="filled"
          className="shrink-0 text-amber-500"
          aria-hidden="true"
        />
        {root}
      </div>
      <ul className="py-6">
        {flatten(items).map((row) => {
          const folder = row.name.endsWith("/");
          const ext = row.name.split(".").pop() ?? "";
          const Icon = folder ? Folder : FileCode;
          return (
            <li
              key={`${row.depth}-${row.name}`}
              style={{ "--depth": row.depth } as CSSProperties}
              className="grid sm:grid-cols-[minmax(0,300px)_minmax(0,1fr)] sm:items-center gap-x-16 gap-y-2 min-h-36 py-7 px-14 transition-colors hover:bg-foreground/4 bg-[repeating-linear-gradient(to_right,transparent_0_7px,var(--border)_7px_8px,transparent_8px_22px)] bg-no-repeat [background-position:14px_0] [background-size:calc(var(--depth)*22px)_100%]"
            >
              <span className="flex items-center gap-8 min-w-0 pl-[calc(var(--depth)*22px)]">
                <Icon
                  size="xs"
                  pack={folder ? "filled" : "basic"}
                  className={`shrink-0 ${folder ? "text-amber-500" : (FILE_COLOR[ext] ?? "text-foreground-muted")}`}
                  aria-hidden="true"
                />
                <code className="truncate font-13 font-mono font-w-500">
                  {row.name}
                </code>
                {row.tag && (
                  <span
                    className={`shrink-0 px-6 py-1 br-full font-11 font-w-600 whitespace-nowrap ${TAG[row.tag.tone]}`}
                  >
                    {row.tag.text}
                  </span>
                )}
              </span>
              {row.note && (
                <span className="font-13 text-foreground-muted max-sm:pl-[calc(var(--depth)*22px_+_24px)]">
                  {row.note}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// иконка Boxicons (у всех один тип)
type Icon = typeof ArrowRight;

// Карточки-ссылки «куда дальше»: иконка в цветной плашке, заголовок со стрелкой, строка описания.
// При наведении карточка приподнимается, стрелка уезжает вправо
export function LinkCards({
  label,
  items,
}: {
  label: string;
  items: { href: string; title: string; text: string; Icon: Icon }[];
}) {
  return (
    <nav
      aria-label={label}
      className="grid sm:grid-cols-2 xl:grid-cols-3 gap-12"
    >
      {items.map(({ href, title, text, Icon }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-col gap-8 p-18 br-xl border bg-surface shadow-1 transition-[translate,box-shadow,border-color] duration-300 ease-spring hover:-translate-y-2 hover:shadow-4 hover:border-border-strong active:scale-98"
        >
          <span className="size-40 br-lg grid place-items-center bg-secondary/10 text-secondary">
            <Icon width={22} height={22} aria-hidden="true" />
          </span>
          <span className="flex items-center gap-6 font-15 font-w-600">
            {title}
            <ArrowRight
              width={14}
              height={14}
              className="transition-transform duration-300 ease-spring group-hover:translate-x-3"
              aria-hidden="true"
            />
          </span>
          <span className="font-13 text-foreground-muted">{text}</span>
        </Link>
      ))}
    </nav>
  );
}
