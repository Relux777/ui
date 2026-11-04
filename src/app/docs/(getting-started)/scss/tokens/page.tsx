// Токены RenDit SCSS: что это, как из них появляются классы, где лежат и как завести свой. Живые примеры
// каждого вида токенов — на отдельных страницах (Цвета, Тени, Скругления, Градиенты, Переходы), чтобы не
// было повторов: здесь только общее и генератор своего токена.

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
import { TokenGenerator } from "./_tools";

export const metadata: Metadata = { title: "Токены" };

const TOC: TocItem[] = [
  { id: "what", title: "Что такое токен" },
  { id: "classes", title: "Какие классы получаются" },
  { id: "kinds", title: "Виды токенов" },
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

const KINDS = [
  ["/docs/scss/colors", "Цвета", "Палитра, смысловые цвета, контраст"],
  ["/docs/scss/shadows", "Тени", "shadow-1…12, обе темы"],
  ["/docs/scss/radius", "Скругления", "br-* — шкала и br-full"],
  ["/docs/scss/gradients", "Градиенты", "bg-gradient-* и градиентный текст"],
  ["/docs/scss/transition", "Переходы", "duration, ease-*, пружины"],
];

export default function TokensPage() {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["Основы", "Токены"]}
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
          <Heading id="kinds">Виды токенов</Heading>
          <Lead>
            Каждый вид — на своей странице с живыми примерами и таблицей «класс
            → CSS», чтобы ничего не повторялось.
          </Lead>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {KINDS.map(([href, title, text]) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col gap-4 p-16 br-xl border bg-surface transition-[translate,box-shadow] duration-300 hover:-translate-y-4 hover:shadow-4 motion-reduce:transition-none"
              >
                <span className="font-14 font-w-600 text-secondary">
                  {title}
                </span>
                <span className="font-12 text-foreground-muted">{text}</span>
              </Link>
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
