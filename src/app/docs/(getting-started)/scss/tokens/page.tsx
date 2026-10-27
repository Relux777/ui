// Токены RenDit SCSS: что это, где лежат, какие классы из них получаются, как добавить свой.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Code,
  CodeBlock,
  DocHeader,
  Files,
  Heading,
  Lead,
  Table,
} from "../../../../_docs/docs";

export const metadata: Metadata = { title: "Токены" };

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

export default function TokensPage() {
  return (
    <>
      <DocHeader
        path={["RenDit SCSS", "Токены"]}
        title="Токены"
        lead={
          <>
            Цвета, тени, скругления и пружины — CSS-переменные в{" "}
            <Code>src/assets/scss/settings/</Code>. Движок сам превращает их в
            классы: новая переменная становится классом сразу, даже в{" "}
            <Code>npm run dev</Code>.
          </>
        }
      />

      <section className="flex flex-col gap-14">
        <Heading id="classes">Какие классы получаются</Heading>
        <Table head={["Переменная", "Классы"]} rows={ROWS} />
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="files">Где лежат</Heading>
        <Lead>
          Всё собирает <Code>_index.scss</Code> — его и читает движок.
        </Lead>
        <Files
          items={[
            {
              path: "_palette.scss",
              text: "палитра 14 × 11 в OKLCH: --blue-500, --gray-950…",
            },
            {
              path: "_tokens.semantic.scss",
              text: "смысловые цвета светлой и тёмной темы, подсветка кода",
            },
            {
              path: "_shadows.scss",
              text: "shadow-1…12, inset, line, glass",
            },
            { path: "_radius.scss", text: "скругления xs…2xl" },
            {
              path: "_motion.scss",
              text: "пружины ease-spring, ease-spring-bouncy",
            },
          ]}
        />
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="own">Свой цвет</Heading>
        <Lead>
          Добавьте переменную — появятся классы. Смысловые цвета переключаются с
          темой: в тёмной задайте своё значение.
        </Lead>
        <CodeBlock
          file="src/assets/scss/settings/_tokens.semantic.scss"
          code={`@layer theme {
    :root {
        --primary: var(--blue-600);   /* все bg-primary, text-primary… — синие */
        --brand: #0d5ef5;             /* новый цвет → bg-brand, text-brand/70 */
    }

    [data-theme='dark'] {
        --brand: #5c9cff;             /* в тёмной теме — светлее */
    }
}`}
        />
        <Lead>
          Цвет без темы можно задать и в конфиге:{" "}
          <Code>{'theme: { colors: { brand: "#0d5ef5" } }'}</Code>.
        </Lead>
      </section>
    </>
  );
}
