// Конфиг RenDit Code: rendit.config.mjs, все поля и значения по умолчанию (rendit-code/core/config.mjs).

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

export const metadata: Metadata = { title: "Конфиг" };

const ROWS: ReactNode[][] = [
  [<Code key="k">content</Code>, '["src"]', "папки, где движок ищет классы"],
  [
    <Code key="k">extensions</Code>,
    "tsx, ts, jsx, js, mjs, mdx, md, html",
    "какие файлы читать",
  ],
  [
    <Code key="k">ignore</Code>,
    "node_modules, .next, .git, generated",
    "какие папки пропускать",
  ],
  [
    <Code key="k">output</Code>,
    "src/assets/scss/generated/rendit-code.css",
    "куда писать CSS классов",
  ],
  [
    <Code key="k">tokens</Code>,
    "src/assets/scss/settings/_index.scss",
    "SCSS с токенами: из него берутся цвета, тени, скругления",
  ],
  [
    <Code key="k">screens</Code>,
    "sm 620 · md 770 · lg 990 · xl 1200 · 2xl 1400",
    "брейкпоинты; если задать — заменяют набор целиком",
  ],
  [
    <Code key="k">containers</Code>,
    "xs 320 … 2xl 672",
    "ширины для контейнерных запросов @md: и других",
  ],
  [
    <Code key="k">darkSelector</Code>,
    '[data-theme="dark"]',
    "где включена тёмная тема — для варианта dark:",
  ],
  [<Code key="k">layer</Code>, "utilities", "каскадный слой классов"],
  [
    <Code key="k">theme.colors</Code>,
    "{}",
    'цвета сверх токенов: { brand: "#0d5ef5" } → bg-brand',
  ],
  [
    <Code key="k">theme.spacing</Code>,
    "{}",
    'именованные отступы: { section: "120px" } → py-section',
  ],
  [<Code key="k">theme.columns</Code>, "12", "колонок в сетке .row (col-N)"],
  [
    <Code key="k">safelist</Code>,
    "[]",
    "классы, которых нет в исходниках целиком",
  ],
];

export default function ConfigPage() {
  return (
    <>
      <DocHeader
        path={["RenDit Code", "Конфиг"]}
        title="Конфиг"
        lead={
          <>
            <Code>rendit.config.mjs</Code> в корне проекта. Все поля
            необязательны, правки движок подхватывает на лету — перезапускать
            ничего не нужно.
          </>
        }
      />

      <section className="flex flex-col gap-14">
        <Heading id="example">Пример</Heading>
        <CodeBlock
          file="rendit.config.mjs"
          code={`/** @type {import("./rendit-code/types").RenDitConfig} */
export default {
  // mobile-first: md: — от 770px и шире, max-md: — уже 770px
  screens: { sm: "620px", md: "770px", lg: "990px", xl: "1200px", "2xl": "1400px" },
  // классы, которых нет в исходниках целиком
  safelist: ["bg-red-500", "bg-green-500"],
};`}
        />
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="fields">Все поля</Heading>
        <Lead>
          Подсказки по полям в редакторе даёт{" "}
          <Code>rendit-code/types.d.ts</Code> — строка <Code>@type</Code> в
          начале файла.
        </Lead>
        <Table head={["Поле", "По умолчанию", "Что делает"]} rows={ROWS} />
      </section>
    </>
  );
}
