// Цвета RenDit SCSS: как устроены (палитра → смысловые токены → классы), смысловые цвета в двух темах,
// палитра с копированием, конструктор класса цвета, прозрачность, статусы, готовые сочетания, градиенты,
// проверка контраста и свои цвета. Живые инструменты — _tools.tsx; тёмная тема — отдельная страница.

import { AlertTriangle } from "@boxicons/react/AlertTriangle";
import { CheckCircle } from "@boxicons/react/CheckCircle";
import { InfoCircle } from "@boxicons/react/InfoCircle";
import { XCircle } from "@boxicons/react/XCircle";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Code,
  CodeBlock,
  DocHeader,
  Example,
  Heading,
  Lead,
} from "../../../../_docs/docs";
import { Toc, type TocItem } from "../../../../_docs/toc";
import {
  ColorBuilder,
  ContrastChecker,
  PaletteTool,
  StyleBuilder,
  TokenGrid,
} from "./_tools";

export const metadata: Metadata = { title: "Цвета" };

const TOC: TocItem[] = [
  { id: "style", title: "Конструктор стиля" },
  { id: "builder", title: "Класс цвета" },
  { id: "contrast", title: "Контраст" },
  { id: "how", title: "Как устроены" },
  { id: "semantic", title: "Смысловые цвета" },
  { id: "palette", title: "Палитра" },
  { id: "opacity", title: "Прозрачность" },
  { id: "status", title: "Статусы" },
  { id: "recipes", title: "Готовые сочетания" },
  { id: "gradients", title: "Градиенты" },
  { id: "custom", title: "Свои цвета" },
];

const FLOW = [
  {
    step: "Палитра",
    code: "--violet-500",
    text: "14 цветов × 11 оттенков в OKLCH: оттенки одного номера одинаково светлые на глаз.",
  },
  {
    step: "Смысловые токены",
    code: "--secondary",
    text: "Что цвет значит: фон, текст, главная кнопка. В тёмной теме — свои значения.",
  },
  {
    step: "Классы",
    code: "bg-secondary/10",
    text: "Движок делает класс из любого токена и цвета палитры, прозрачность — через /N.",
  },
];

const STATUSES = [
  {
    Icon: CheckCircle,
    title: "Сохранено",
    text: "Изменения применятся сразу.",
    cls: "border-success/25 bg-success/8 text-success",
  },
  {
    Icon: InfoCircle,
    title: "Подсказка",
    text: "Цвет меняется вместе с темой.",
    cls: "border-info/25 bg-info/8 text-info",
  },
  {
    Icon: AlertTriangle,
    title: "Внимание",
    text: "Пакета в npm пока нет.",
    cls: "border-warning/35 bg-warning/10 text-warning",
  },
  {
    Icon: XCircle,
    title: "Ошибка",
    text: "Класс не найден в коде.",
    cls: "border-danger/25 bg-danger/8 text-danger",
  },
];

export default function ColorsPage() {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["RenDit SCSS", "Цвета"]}
          title="Цвета"
          lead={
            <>
              В разметке пишут не «синий», а смысл: <Code>bg-surface</Code>,{" "}
              <Code>text-foreground-muted</Code>, <Code>bg-primary</Code>. Тема
              меняет значения в одном месте — светлая и тёмная переключаются
              сами. Сверху — конструкторы и проверка контраста, ниже — все цвета
              с примерами.
            </>
          }
        />

        <section className="relative z-3 flex flex-col gap-16">
          <Heading id="style">Конструктор стиля</Heading>
          <Lead>
            Выберите цвет, стиль и элемент — получите готовые классы: кнопка,
            метка, сообщение или карточка в светлой и тёмной теме. Справа видно
            контраст текста к фону; «Случайный» подскажет сочетание.
          </Lead>
          <StyleBuilder />
        </section>
        <section className="relative z-2 flex flex-col gap-16">
          <Heading id="builder">Класс цвета</Heading>
          <Lead>
            Соберите класс цвета: что красим, каким цветом, насколько прозрачно
            и когда. Справа — как это выглядит в обеих темах и какой CSS напишет
            движок.
          </Lead>
          <ColorBuilder />
        </section>

        <section className="relative z-1 flex flex-col gap-16">
          <Heading id="contrast">Контраст</Heading>
          <Lead>
            Выберите цвет текста и фона — контраст посчитается сразу для обеих
            тем.
          </Lead>
          <ContrastChecker />
        </section>

        <section className="reveal flex flex-col gap-16">
          <Heading id="how">Как устроены</Heading>
          <Lead>
            Три ступени: из палитры собраны смысловые токены, из токенов и
            палитры движок делает классы. Компоненты берут токены — поэтому
            тёмная тема и свой фирменный цвет меняются в одном файле.
          </Lead>
          <ol className="grid md:grid-cols-3 gap-12">
            {FLOW.map((f, i) => (
              <li
                key={f.step}
                className="relative flex flex-col gap-8 p-16 br-xl border bg-surface shadow-1"
              >
                <span className="flex items-center gap-8 font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
                  <span className="size-22 br-full grid place-items-center bg-secondary/12 text-secondary tabular-nums">
                    {i + 1}
                  </span>
                  {f.step}
                </span>
                <code className="self-start px-8 py-2 br-sm bg-surface-muted font-13 font-mono">
                  {f.code}
                </code>
                <p className="font-14 text-foreground-muted">{f.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="reveal flex flex-col gap-16">
          <Heading id="semantic">Смысловые цвета</Heading>
          <Lead>
            Каждый — в светлой и тёмной теме рядом. Пишите их в разметке:{" "}
            <Code>bg-…</Code>, <Code>text-…</Code>, <Code>border-…</Code>.
            Нажмите на класс — он скопируется.
          </Lead>
          <TokenGrid />
        </section>

        <section className="reveal flex flex-col gap-16">
          <Heading id="palette">Палитра</Heading>
          <Lead>
            14 цветов × 11 оттенков — сырьё для токенов и редких случаев
            (иллюстрации, графики, свой акцент). Выберите, как копировать, и
            нажмите на цвет.
          </Lead>
          <PaletteTool />
        </section>

        <section className="reveal flex flex-col gap-16">
          <Heading id="opacity">Прозрачность</Heading>
          <Lead>
            Любой цвет — токен, палитра, свой hex — через <Code>/N</Code>, где N
            — проценты. Мягкие подложки обычно 5–15%.
          </Lead>
          <Example
            title="От 5 до 100%"
            note="bg-secondary/5 … bg-secondary — одна строка, без новых токенов."
            code={`<div class="bg-secondary/5">  <div class="bg-secondary/10">  <div class="bg-secondary/20">
<div class="bg-secondary/40">  <div class="bg-secondary/70">  <div class="bg-secondary">
<div class="bg-[#ed70a7]/60">  <div class="bg-danger/[0.15]">`}
          >
            <div className="flex flex-wrap gap-10">
              {[
                ["bg-secondary/5", "5"],
                ["bg-secondary/10", "10"],
                ["bg-secondary/20", "20"],
                ["bg-secondary/40", "40"],
                ["bg-secondary/70", "70"],
                ["bg-secondary", "100"],
                ["bg-[#ed70a7]/60", "#ed70a7/60"],
                ["bg-danger/[0.15]", "0.15"],
              ].map(([cls, label]) => (
                <span key={cls} className="flex flex-col items-center gap-6">
                  <span className={`size-56 br-lg border ${cls}`} />
                  <span className="font-11 font-mono text-foreground-muted">
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </Example>
        </section>

        <section className="reveal flex flex-col gap-16">
          <Heading id="status">Статусы</Heading>
          <Lead>
            success, warning, danger, info — для сообщений и меток. Мягкая
            подложка <Code>/8</Code>, рамка <Code>/25</Code>, текст — сам цвет.
          </Lead>
          <Example
            title="Сообщения"
            code={`<div class="flex gap-10 p-14 br-lg border border-success/25 bg-success/8 text-success">
  <CheckCircle /> Сохранено
</div>`}
          >
            <div className="grid sm:grid-cols-2 gap-10">
              {STATUSES.map(({ Icon, title, text, cls }) => (
                <div
                  key={title}
                  className={`flex gap-10 p-14 br-lg border ${cls}`}
                >
                  <Icon
                    width={20}
                    height={20}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <span className="font-14 font-w-600">{title}</span>
                    <span className="font-13 text-foreground-muted">
                      {text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Example>
          <Example
            title="Метки"
            code={`<span class="px-8 py-2 br-full bg-success/12 text-success">Готово</span>
<span class="px-8 py-2 br-full bg-accent text-accent-foreground">Новое</span>`}
          >
            <div className="flex flex-wrap gap-8 font-12 font-w-600">
              <span className="px-8 py-2 br-full bg-success/12 text-success">
                Готово
              </span>
              <span className="px-8 py-2 br-full bg-warning/15 text-warning">
                В работе
              </span>
              <span className="px-8 py-2 br-full bg-danger/10 text-danger">
                Ошибка
              </span>
              <span className="px-8 py-2 br-full bg-info/10 text-info">
                Бета
              </span>
              <span className="px-8 py-2 br-full bg-accent text-accent-foreground">
                Новое
              </span>
              <span className="px-8 py-2 br-full bg-secondary/12 text-secondary">
                Pro
              </span>
              <span className="px-8 py-2 br-full bg-foreground/5 text-foreground-muted">
                Черновик
              </span>
            </div>
          </Example>
        </section>

        <section className="reveal flex flex-col gap-16">
          <Heading id="recipes">Готовые сочетания</Heading>
          <Lead>
            Пары фона и текста, которые уже проверены на контраст в обеих темах:
            к каждому фону — свой <Code>…-foreground</Code>.
          </Lead>
          <Example
            title="Кнопки"
            note="primary — чёрная в светлой теме и белая в тёмной; secondary — фиолетовая; accent — лаймовая."
            code={`<button class="bg-primary text-primary-foreground hover:bg-primary-hover">
<button class="bg-secondary text-secondary-foreground">
<button class="bg-accent text-accent-foreground">
<button class="border bg-surface hover:bg-surface-muted">
<button class="text-secondary hover:bg-secondary/10">`}
          >
            <div className="flex flex-wrap gap-10 font-14 font-w-600">
              <button
                type="button"
                className="h-40 px-18 br-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover active:scale-97"
              >
                Главная
              </button>
              <button
                type="button"
                className="h-40 px-18 br-full bg-secondary text-secondary-foreground transition active:scale-97"
              >
                Второй акцент
              </button>
              <button
                type="button"
                className="h-40 px-18 br-full bg-accent text-accent-foreground transition active:scale-97"
              >
                Акцент
              </button>
              <button
                type="button"
                className="h-40 px-18 br-full border bg-surface transition-colors hover:bg-surface-muted active:scale-97"
              >
                Обычная
              </button>
              <button
                type="button"
                className="h-40 px-18 br-full text-secondary transition-colors hover:bg-secondary/10 active:scale-97"
              >
                Ссылка
              </button>
            </div>
          </Example>
          <Example
            title="Карточки и секции"
            note="surface — карточка на фоне страницы, surface-muted — «утопленный» блок, surface-inverse — тёмная секция на светлой странице."
            code={`<div class="bg-surface border shadow-1">
<div class="bg-surface-muted">
<div class="bg-surface-inverse text-foreground-inverse">`}
          >
            <div className="grid sm:grid-cols-3 gap-10">
              <div className="flex flex-col gap-4 p-16 br-xl border bg-surface shadow-1">
                <span className="font-15 font-w-600">surface</span>
                <span className="font-13 text-foreground-muted">
                  Карточка, меню, окно
                </span>
              </div>
              <div className="flex flex-col gap-4 p-16 br-xl bg-surface-muted">
                <span className="font-15 font-w-600">surface-muted</span>
                <span className="font-13 text-foreground-muted">
                  Поле, чип, подложка
                </span>
              </div>
              <div className="flex flex-col gap-4 p-16 br-xl bg-surface-inverse text-foreground-inverse">
                <span className="font-15 font-w-600">surface-inverse</span>
                <span className="font-13 opacity-70">Тёмная секция</span>
              </div>
            </div>
          </Example>
        </section>

        <section className="reveal flex flex-col gap-16">
          <Heading id="gradients">Градиенты</Heading>
          <Lead>
            Токены <Code>--gradient-ИМЯ</Code> становятся классами{" "}
            <Code>bg-gradient-ИМЯ</Code>; с <Code>bg-clip-text</Code> — для
            текста.
          </Lead>
          <Example
            title="brand, dark, accent"
            code={`<div class="bg-gradient-brand">  <div class="bg-gradient-dark">  <div class="bg-gradient-accent">
<h2 class="bg-gradient-brand bg-clip-text">RenDit</h2>`}
          >
            <div className="flex flex-wrap items-center gap-12">
              <span className="w-120 h-64 br-lg bg-gradient-brand" />
              <span className="w-120 h-64 br-lg bg-gradient-dark" />
              <span className="w-120 h-64 br-lg bg-gradient-accent" />
              <span className="font-32 font-w-700 bg-gradient-brand bg-clip-text">
                RenDit
              </span>
            </div>
          </Example>
        </section>

        <section className="reveal flex flex-col gap-16">
          <Heading id="custom">Свои цвета</Heading>
          <Lead>
            Свой фирменный цвет — один токен в двух темах. Класс{" "}
            <Code>bg-brand</Code>, <Code>text-brand</Code>,{" "}
            <Code>border-brand/30</Code> движок сделает сам.
          </Lead>
          <CodeBlock
            file="src/assets/scss/settings/_tokens.semantic.scss"
            code={`:root, [data-theme='light'] {
  --brand: var(--pink-500);
  --brand-foreground: var(--white);
}

[data-theme='dark'] {
  --brand: var(--pink-400);      // светлее — контраст на тёмном фоне
  --brand-foreground: var(--gray-950);
}`}
          />
          <Lead>
            Поменять сам оттенок палитры — одной строкой в{" "}
            <Code>settings/_palette.scss</Code>: тон и насыщенность, остальные
            10 оттенков посчитаются. Как работает тёмная тема —{" "}
            <Link
              href="/docs/scss/dark"
              className="text-secondary underline underline-offset-3"
            >
              «Тёмная тема»
            </Link>
            .
          </Lead>
        </section>
      </div>

      <aside className="max-xl:hidden">
        <div className="sticky top-80">
          <Toc items={TOC} />
        </div>
      </aside>
    </div>
  );
}
