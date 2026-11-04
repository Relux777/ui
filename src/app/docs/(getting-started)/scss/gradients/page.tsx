// Градиенты --gradient-ИМЯ → bg-gradient-ИМЯ, свой — bg-[linear-gradient(…)] и градиентный текст.

import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, CodeBlock, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { TABLE_CLASSES } from "./_classes";

const HREF = "/docs/scss/gradients";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "samples", title: "Готовые градиенты" },
  { id: "classes", title: "Все классы" },
  { id: "text", title: "Градиентный текст" },
  { id: "own", title: "Свой градиент" },
];

export default function GradientsPage() {
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>--gradient-ИМЯ</Code> → <Code>bg-gradient-ИМЯ</Code>. Свой —{" "}
          <Code>bg-[linear-gradient(…)]</Code>, пробелы через подчёркивание.
        </>
      }
    >
      <Part id="samples" title="Готовые градиенты">
        <div className="grid sm:grid-cols-3 gap-12">
          {["bg-gradient-brand", "bg-gradient-dark", "bg-gradient-accent"].map(
            (g) => (
              <div key={g} className="flex flex-col gap-8">
                <span className={`h-80 br-xl ${g}`} />
                <code className="font-12 font-mono">{g}</code>
              </div>
            ),
          )}
        </div>
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Градиенты — тоже токены: <Code>--gradient-brand</Code> и{" "}
            <Code>--gradient-dark</Code> живут в{" "}
            <Code>_tokens.semantic.scss</Code>.
          </>
        }
      >
        <ClassTable rows={TABLE_CLASSES} />
      </Part>

      <Part id="text" title="Градиентный текст">
        <Example
          title="Текст с градиентом"
          note="bg-clip-text обрезает фон по буквам, text-transparent делает буквы прозрачными."
          code={`<h2 class="font-40 font-w-700 bg-gradient-brand bg-clip-text text-transparent">
  RenDit UI
</h2>`}
        >
          <h2 className="font-40 font-w-700 bg-gradient-brand bg-clip-text text-transparent">
            RenDit UI
          </h2>
        </Example>
      </Part>

      <Part id="own" title="Свой градиент">
        <CodeBlock
          lang="html"
          code={`<div class="bg-[linear-gradient(135deg,#ed70a7,#f7ae49)]">…</div>`}
        />
      </Part>
    </ClassPage>
  );
}
