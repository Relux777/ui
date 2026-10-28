// Токены RenDit SCSS: что это и зачем, какие классы из них получаются, все виды токенов с живыми примерами
// (цвета, тени, скругления, движение, градиенты), где лежат, генератор своего токена и как поменять тему.
// Живые инструменты — _tools.tsx.

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Code,
  CodeBlock,
  DocHeader,
  FileTree,
  Heading,
  Lead,
  Table,
} from "../../../../_docs/docs";
import { Toc, type TocItem } from "../../../../_docs/toc";
import { MotionPlayground, TokenGenerator } from "./_tools";

export const metadata: Metadata = { title: "Токены" };

const TOC: TocItem[] = [
  { id: "what", title: "Что такое токен" },
  { id: "classes", title: "Какие классы получаются" },
  { id: "colors", title: "Цвета" },
  { id: "shadows", title: "Тени" },
  { id: "radius", title: "Скругления" },
  { id: "motion", title: "Движение" },
  { id: "gradients", title: "Градиенты" },
  { id: "own", title: "Свой токен" },
  { id: "files", title: "Где лежат" },
];

const ROWS: ReactNode[][] = [
  [
    <Code key="k">--ИМЯ: цвет</Code>,
    "bg-ИМЯ, text-ИМЯ, border-ИМЯ, fill-ИМЯ и прозрачность: bg-ИМЯ/50",
  ],
  [<Code key="k">--shadow-ИМЯ</Code>, "shadow-ИМЯ"],
  [<Code key="k">--radius-ИМЯ</Code>, "br-ИМЯ"],
  [<Code key="k">--gradient-ИМЯ</Code>, "bg-gradient-ИМЯ"],
  [<Code key="k">--ease-ИМЯ</Code>, "ease-ИМЯ"],
];

// классы написаны строками целиком — движок их видит
const SHADOWS = [
  ["shadow-1", "чуть приподнята: карточки"],
  ["shadow-2", "кнопки, чипы"],
  ["shadow-3", "под курсором"],
  ["shadow-4", "выпадающие меню"],
  ["shadow-5", "всплывающие панели"],
  ["shadow-6", "окна поверх страницы"],
  ["shadow-7", "кромка стеклянной таблетки"],
  ["shadow-8", "мягкая, из ReluxCode"],
  ["shadow-9", "стекло маленьких элементов"],
  ["shadow-10", "глубокая, из ReluxCode"],
  ["shadow-11", "парящая, из ReluxCode"],
  ["shadow-12", "самая глубокая"],
];

const RADII = [
  ["br-xs", "6px"],
  ["br-sm", "8px"],
  ["br-md", "12px"],
  ["br-lg", "16px"],
  ["br-xl", "24px"],
  ["br-2xl", "32px"],
  ["br-full", "круг, таблетка"],
];

export default function TokensPage() {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["RenDit SCSS", "Токены"]}
          title="Токены"
          lead={
            <>
              Цвета, тени, скругления и движение — CSS-переменные в{" "}
              <Code>src/assets/scss/settings/</Code>. Меняете токен — меняется
              весь сайт; добавляете — движок сразу делает из него классы, даже в{" "}
              <Code>npm run dev</Code>.
            </>
          }
        />

        <section className="flex flex-col gap-16">
          <Heading id="what">Что такое токен</Heading>
          <Lead>
            Токен — значение с именем: не «#7c3aed», а <Code>--secondary</Code>.
            В разметке пишут имя, а значение живёт в одном месте — его можно
            поменять для всего сайта и задать своё для тёмной темы.
          </Lead>
          <ol className="grid md:grid-cols-3 gap-12">
            {[
              ["Значение", "--violet-500", "цвет палитры, тень, радиус"],
              ["Токен", "--secondary: var(--violet-500)", "имя по смыслу"],
              ["Класс", "bg-secondary/10", "движок сделал сам"],
            ].map(([title, code, note], i) => (
              <li
                key={title}
                className="flex flex-col gap-8 p-16 br-xl border bg-surface shadow-1"
              >
                <span className="flex items-center gap-8 font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
                  <span className="size-22 br-full grid place-items-center bg-secondary/12 text-secondary tabular-nums">
                    {i + 1}
                  </span>
                  {title}
                </span>
                <code className="self-start px-8 py-2 br-sm bg-surface-muted font-13 font-mono break-all">
                  {code}
                </code>
                <p className="font-14 text-foreground-muted">{note}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="classes">Какие классы получаются</Heading>
          <Lead>
            Имя переменной подсказывает движку, что это: цвет, тень, радиус,
            градиент или кривая движения.
          </Lead>
          <Table head={["Переменная", "Классы"]} rows={ROWS} />
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="colors">Цвета</Heading>
          <Lead>
            Палитра 14 × 11 и смысловые цвета светлой и тёмной темы — с
            конструктором, палитрой и проверкой контраста на странице{" "}
            <Link
              href="/docs/scss/colors"
              className="text-secondary underline underline-offset-3"
            >
              «Цвета»
            </Link>
            .
          </Lead>
          <div className="flex h-48 br-xl overflow-hidden border">
            {[
              "bg-background",
              "bg-surface-muted",
              "bg-foreground-muted",
              "bg-foreground",
              "bg-primary",
              "bg-secondary",
              "bg-accent",
              "bg-success",
              "bg-warning",
              "bg-danger",
              "bg-info",
            ].map((c) => (
              <span key={c} title={c} className={`flex-1 ${c}`} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="shadows">Тени</Heading>
          <Lead>
            <Code>shadow-1…6</Code> — высота: чем выше элемент над страницей,
            тем больше номер. 7 и 9 — для стекла, 8, 10–12 — мягкие тени из
            ReluxCode. В тёмной теме тени темнее и заметнее.
          </Lead>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-14 p-16 sm:p-24 br-2xl bg-surface-muted/60">
            {SHADOWS.map(([cls, note]) => (
              <div
                key={cls}
                className={`flex flex-col gap-2 p-14 br-lg bg-surface ${cls}`}
              >
                <code className="font-13 font-mono font-w-600">{cls}</code>
                <span className="font-12 text-foreground-muted">{note}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="radius">Скругления</Heading>
          <Lead>
            Шкала от 6 до 32 пикселей: маленьким элементам — маленькие радиусы,
            крупным секциям — большие. Любое число тоже работает:{" "}
            <Code>br-20</Code>.
          </Lead>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-12">
            {RADII.map(([cls, note]) => (
              <div key={cls} className="flex flex-col items-center gap-8">
                <span
                  className={`size-64 border-2 border-secondary/50 bg-secondary/10 ${cls}`}
                />
                <code className="font-12 font-mono font-w-600">{cls}</code>
                <span className="font-11 text-foreground-muted text-center">
                  {note}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="relative z-2 flex flex-col gap-16">
          <Heading id="motion">Движение</Heading>
          <Lead>
            Пружины <Code>ease-spring</Code> и <Code>ease-spring-bouncy</Code> —
            живее обычных кривых: элемент чуть перелетает и мягко встаёт на
            место. Нажмите «Запустить» и сравните; выберите строку — классы
            внизу.
          </Lead>
          <MotionPlayground />
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="gradients">Градиенты</Heading>
          <Lead>
            <Code>--gradient-ИМЯ</Code> → <Code>bg-gradient-ИМЯ</Code>. С{" "}
            <Code>bg-clip-text</Code> красят текст.
          </Lead>
          <div className="grid sm:grid-cols-3 gap-12">
            {[
              "bg-gradient-brand",
              "bg-gradient-dark",
              "bg-gradient-accent",
            ].map((g) => (
              <div key={g} className="flex flex-col gap-8">
                <span className={`h-80 br-xl ${g}`} />
                <code className="font-12 font-mono">{g}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="relative z-1 flex flex-col gap-16">
          <Heading id="own">Свой токен</Heading>
          <Lead>
            Дайте цвету имя и выберите значение для светлой и тёмной темы —
            получите строки для <Code>_tokens.semantic.scss</Code> и классы,
            которые сделает движок.
          </Lead>
          <TokenGenerator />
          <Lead>
            Цвет без темы можно задать и в конфиге:{" "}
            <Code>{'theme: { colors: { brand: "#0d5ef5" } }'}</Code>. Тени и
            скругления добавляются так же — <Code>--shadow-ИМЯ</Code>,{" "}
            <Code>--radius-ИМЯ</Code>:
          </Lead>
          <CodeBlock
            file="src/assets/scss/settings/_radius.scss"
            code={`:root {
  --radius-card: 20px;   /* → br-card */
}`}
          />
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="files">Где лежат</Heading>
          <Lead>
            Всё собирает <Code>_index.scss</Code> — его и читает движок.
          </Lead>
          <FileTree
            root="src/assets/scss/settings/"
            items={[
              {
                name: "_index.scss",
                note: "собирает всё ниже",
                tag: { text: "читает движок", tone: "accent" },
              },
              {
                name: "_palette.scss",
                note: "палитра 14 × 11 в OKLCH: --blue-500, --gray-950…",
              },
              {
                name: "_tokens.semantic.scss",
                note: "смысловые цвета обеих тем, градиенты, подсветка кода",
              },
              {
                name: "_shadows.scss",
                note: "shadow-1…12, inset, line, glass",
              },
              { name: "_radius.scss", note: "скругления xs…2xl" },
              {
                name: "_motion.scss",
                note: "пружины ease-spring, ease-spring-bouncy",
              },
            ]}
          />
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
