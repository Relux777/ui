// Цвета и тема: смысловые цвета RenDit SCSS, тёмная тема (data-theme на <html>), вариант dark:.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Code,
  CodeBlock,
  DocHeader,
  Heading,
  Lead,
  Table,
} from "../../../../_docs/docs";

export const metadata: Metadata = { title: "Цвета и тема" };

// образец цвета + имя: цвет — классом, чтобы он менялся вместе с темой
const swatch = (name: string, className: string) => (
  <span key="k" className="flex items-center gap-10">
    <span className={`size-20 br-xs border shrink-0 ${className}`} />
    <Code>{name}</Code>
  </span>
);

const ROWS: ReactNode[][] = [
  [swatch("background", "bg-background"), "фон страницы"],
  [swatch("surface", "bg-surface"), "карточки, меню, окна"],
  [
    swatch("surface-muted", "bg-surface-muted"),
    "чипы, поля, «утопленные» блоки",
  ],
  [swatch("foreground", "bg-foreground"), "основной текст"],
  [swatch("foreground-muted", "bg-foreground-muted"), "второстепенный текст"],
  [
    swatch("primary", "bg-primary"),
    "главные кнопки: чёрные в светлой теме, белые в тёмной",
  ],
  [
    swatch("secondary", "bg-secondary"),
    "второй акцент: ссылки, выбранные пункты",
  ],
  [swatch("accent", "bg-accent"), "яркий акцент: бейджи, выделение"],
  [swatch("border", "bg-border"), "рамки"],
];

export default function ColorsPage() {
  return (
    <>
      <DocHeader
        path={["RenDit SCSS", "Цвета и тема"]}
        title="Цвета и тема"
        lead={
          <>
            Компоненты пишут не «синий», а смысл: <Code>bg-surface</Code>,{" "}
            <Code>text-foreground-muted</Code>, <Code>bg-primary</Code>. Тема
            меняет значения в одном месте — светлая и тёмная переключаются сами.
          </>
        }
      />

      <section className="flex flex-col gap-14">
        <Heading id="semantic">Смысловые цвета</Heading>
        <Lead>
          Стиль — по мотивам boxicons.com: монохром, оттенки серого, один яркий
          акцент (лайм) и фиолетовый второй.
        </Lead>
        <Table head={["Токен", "Для чего"]} rows={ROWS} />
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="dark">Тёмная тема</Heading>
        <Lead>
          Включается атрибутом <Code>data-theme="dark"</Code> на{" "}
          <Code>&lt;html&gt;</Code>. В Next.js его удобно ставить через
          next-themes:
        </Lead>
        <CodeBlock
          file="src/app/layout.tsx"
          code={`<html lang="ru" suppressHydrationWarning>
  <body>
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  </body>
</html>`}
        />
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="variant">Вариант dark:</Heading>
        <Lead>
          Для частных случаев, когда в тёмной теме нужно не то же самое:
        </Lead>
        <CodeBlock
          lang="js"
          code={`<div className="bg-surface shadow-4 dark:shadow-none">…</div>`}
        />
        <Lead>
          Тема задаётся у вас иначе — укажите свой селектор в{" "}
          <Code>darkSelector</Code> конфига.
        </Lead>
      </section>
    </>
  );
}
