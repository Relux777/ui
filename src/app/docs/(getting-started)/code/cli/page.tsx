// Команды движка RenDit Code (rendit-code/cli.mjs) и как завести их в package.json.

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

export const metadata: Metadata = { title: "Команды" };

const ROWS: ReactNode[][] = [
  [
    <Code key="k">node rendit-code/cli.mjs dev</Code>,
    "собрать CSS, следить за файлами и запустить next dev",
  ],
  [
    <Code key="k">node rendit-code/cli.mjs build</Code>,
    "собрать CSS один раз — перед next build или vite build",
  ],
  [
    <Code key="k">node rendit-code/cli.mjs watch</Code>,
    "собирать при каждом сохранении — для Vite и HTML",
  ],
  [
    <Code key="k">node rendit-code/cli.mjs check p-20</Code>,
    "показать CSS для классов",
  ],
  [<Code key="k">node rendit-code/test.mjs</Code>, "тесты движка"],
  [
    <Code key="k">node rendit-code/vscode/install.mjs</Code>,
    "собрать и поставить подсказки для VS Code",
  ],
];

export default function CliPage() {
  return (
    <>
      <DocHeader
        path={["RenDit Code", "Команды"]}
        title="Команды"
        lead={
          <>
            Обычные скрипты Node.js из папки <Code>rendit-code/</Code>. Удобно
            завести под них строки в <Code>scripts</Code> вашего package.json.
          </>
        }
      />

      <section className="flex flex-col gap-14">
        <Heading id="list">Все команды</Heading>
        <Table head={["Команда", "Что делает"]} rows={ROWS} />
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="scripts">В package.json</Heading>
        <Lead>Так устроен и этот сайт:</Lead>
        <CodeBlock
          file="package.json"
          code={`"scripts": {
  "dev": "node rendit-code/cli.mjs dev",
  "build": "node rendit-code/cli.mjs build && next build",
  "rendit-code": "node rendit-code/cli.mjs build",
  "rendit-code:watch": "node rendit-code/cli.mjs watch"
}`}
        />
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="check">check — что получится из классов</Heading>
        <Lead>
          Покажите движку классы — он ответит готовым CSS. Класс с ошибкой он
          отметит строкой «✖ не утилита».
        </Lead>
        <CodeBlock
          terminal
          code="node rendit-code/cli.mjs check p-20 md:hover:bg-primary/50"
        />
      </section>
    </>
  );
}
