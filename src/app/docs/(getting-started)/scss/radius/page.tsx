// Скругления br-*: шкала 6…32px, круг br-full и отдельные углы. Свои — в settings/_radius.scss.

import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, CodeBlock, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { TABLE_CLASSES } from "./_classes";

const HREF = "/docs/scss/radius";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "scale", title: "Шкала" },
  { id: "classes", title: "Все классы" },
  { id: "round", title: "Круг и таблетка" },
  { id: "own", title: "Свои радиусы" },
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

export default function RadiusPage() {
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>br-N</Code> — скругление в пикселях, <Code>br-full</Code> — круг
          и таблетка. Токены <Code>--radius-ИМЯ</Code> дают <Code>br-ИМЯ</Code>.
          Любое число тоже работает: <Code>br-20</Code>.
        </>
      }
    >
      <Part
        id="scale"
        title="Шкала"
        lead="Маленьким элементам — маленькие радиусы, крупным секциям — большие."
      >
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
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Классы токенов (<Code>br-lg</Code> = 16px) и числа (
            <Code>br-20</Code> = 20px). Стороны и углы: <Code>br-t-*</Code>,{" "}
            <Code>br-tl-*</Code>.
          </>
        }
      >
        <ClassTable rows={TABLE_CLASSES} />
      </Part>

      <Part id="round" title="Круг и таблетка">
        <Example
          title="Таблетка и круг"
          note="br-full — полный круг независимо от размера."
          code={`<button class="px-20 py-8 br-full bg-primary text-primary-foreground">Кнопка</button>
<span class="size-48 br-full bg-accent"></span>`}
        >
          <div className="flex items-center gap-12">
            <span className="px-20 py-8 br-full bg-primary text-primary-foreground font-13 font-w-600">
              Кнопка
            </span>
            <span className="size-48 br-full bg-accent" />
          </div>
        </Example>
      </Part>

      <Part id="own" title="Свои радиусы">
        <CodeBlock
          file="src/assets/scss/settings/_radius.scss"
          code={`@layer theme {
  :root {
    --radius-card: 20px;   /* → br-card */
  }
}`}
        />
      </Part>
    </ClassPage>
  );
}
