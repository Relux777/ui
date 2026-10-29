// Подсказки RenDit Code в VS Code: расширение rendit-code/vscode.

import type { Metadata } from "next";
import {
  Callout,
  Code,
  CodeBlock,
  DocHeader,
  Heading,
  Lead,
} from "../../../../_docs/docs";

export const metadata: Metadata = { title: "VS Code" };

export default function VscodePage() {
  return (
    <>
      <DocHeader
        path={["Движок RenDit Code", "VS Code"]}
        title="Подсказки в VS Code"
        lead={
          <>
            Расширение RenDit Code IntelliSense дописывает классы и варианты (
            <Code>hover:</Code>, <Code>md:</Code>, <Code>dark:</Code>) в{" "}
            <Code>className</Code>, <Code>class</Code> и <Code>cn()</Code>,
            показывает CSS класса при наведении и образцы цвета рядом с{" "}
            <Code>bg-…</Code>, <Code>text-…</Code>.
          </>
        }
      />

      <section className="flex flex-col gap-14">
        <Heading id="install">Установка</Heading>
        <Lead>
          Своих правил у расширения нет — оно спрашивает движок вашего проекта,
          поэтому подсказки всегда совпадают с CSS.
        </Lead>
        <CodeBlock terminal code="node rendit-code/vscode/install.mjs" />
        <Lead>Потом в VS Code — Ctrl+Shift+P → Developer: Reload Window.</Lead>
        <Callout tone="warning">
          Нужна команда <Code>code</Code> в PATH. Расширение работает только в
          доверенных папках (Workspace Trust): оно запускает движок из папки
          проекта.
        </Callout>
      </section>
    </>
  );
}
