// Свои значения и варианты в […]: конструктор с готовыми примерами сверху, таблица «класс → CSS»,
// затем пробелы и переменные, свои свойства и варианты, что движок отбрасывает ради безопасности.

import { classCss } from "../../../../_docs/class-css";
import type { LabGroup } from "../../../../_docs/class-lab";
import { ClassLab } from "../../../../_docs/class-lab";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Callout, Code, CodeBlock, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";

const HREF = "/docs/code/arbitrary";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "spaces", title: "Пробелы и переменные" },
  { id: "own", title: "Свойства и варианты" },
  { id: "safe", title: "Что отбрасывается" },
];

const BASE =
  "p-12 br-lg bg-secondary/10 font-13 font-w-600 transition-[width,rotate]";

const VALUES = [
  "w-[calc(100%-80px)]",
  "w-[clamp(160px,50%,360px)]",
  "bg-[#ed70a7]",
  "bg-[color-mix(in_oklab,var(--secondary)_20%,transparent)]",
  "text-[18px]",
  "rotate-[8deg]",
  "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)]",
  "p-[clamp(8px,3vw,28px)]",
];

const GROUPS: LabGroup[] = [{ label: "Значение", options: VALUES }];

const LAB_CLASSES = [...BASE.split(" "), ...VALUES];

export default async function ArbitraryPage() {
  const css = await classCss(LAB_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          Чего нет в шкале — пишется в квадратных скобках:{" "}
          <Code>w-[calc(100%-20px)]</Code>, <Code>bg-[#ed70a7]</Code>. Пробел
          внутри заменяется на <Code>_</Code>, а движок выбрасывает всё, чем
          можно дописать в CSS лишнее.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Готовые свои значения: ширина, цвет, тень, поворот. Классы и CSS — настоящие, от движка."
        className="relative z-1"
      >
        <ClassLab css={css} groups={GROUPS} base={BASE.split(" ")} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Своё значение работает у любого класса: размеры, цвета, отступы,
            сетка. Своё свойство целиком — <Code>[mask-type:alpha]</Code>.
          </>
        }
      >
        <ClassTable
          rows={[
            ["w-[calc(100%-20px)]", "своя ширина"],
            ["h-[calc(100dvh-80px)]", "высота под телефон"],
            ["bg-[#ed70a7]", "свой цвет"],
            [
              "bg-[color-mix(in_oklab,var(--secondary)_20%,transparent)]",
              "цвет из токена",
            ],
            ["text-[18px]", "свой размер текста"],
            ["grid-cols-[1fr_auto]", "свои колонки"],
            ["p-[clamp(12px,4vw,32px)]", "поля, растущие с экраном"],
            ["[float:left]", "своё свойство"],
            ["[&>li]:pl-16", "свой вариант — дети списка"],
            ["[@starting-style]:opacity-0", "появление с нуля"],
            ["supports-[display:grid]:flex", "если браузер умеет grid"],
          ]}
        />
      </Part>

      <Part
        id="spaces"
        title="Пробелы и переменные"
        lead={
          <>
            Пробел в значении — <Code>_</Code>, настоящее подчёркивание —{" "}
            <Code>\_</Code>. Имя CSS-переменной в скобках превращается в{" "}
            <Code>var(--ИМЯ)</Code>.
          </>
        }
      >
        <CodeBlock
          lang="html"
          code={`<!-- записываем -->
<div className="grid-cols-[1fr_auto] bg-[var(--brand)]">

<!-- движок пишет -->
.grid-cols-\\[1fr_auto\\] { grid-template-columns: 1fr auto; }
.bg-\\[var\\(--brand\\)\\] { background-color: var(--brand); }`}
        />
      </Part>

      <Part
        id="own"
        title="Свойства и варианты"
        lead={
          <>
            Своё свойство — в скобках без значения класса:{" "}
            <Code>[mask-type:alpha]</Code>. Свой вариант — селектор с{" "}
            <Code>{"&"}</Code>: <Code>{"[&>li]:pl-16"}</Code>,{" "}
            <Code>[&:nth-child(3)]:opacity-50</Code>.
          </>
        }
      >
        <Example
          title="[&>li]:pl-16 — отступ только у детей списка"
          code={`<ul className="[&>li]:pl-16">
  <li>Первый</li>
  <li>Второй</li>
</ul>`}
        >
          <ul className="flex flex-col gap-6 p-12 br-lg border bg-surface font-13 [&>li]:pl-16">
            <li>Первый пункт</li>
            <li>Второй пункт</li>
            <li>Третий пункт</li>
          </ul>
        </Example>
        <Example
          title="[float:left] — картинка обтекается текстом"
          code={`<span className="[float:left] mr-10 size-48 br-md bg-secondary" />
<p>Текст обтекает картинку…</p>`}
        >
          <div className="max-w-360 font-13 text-foreground-muted">
            <span className="[float:left] mr-10 size-48 br-md bg-secondary" />
            <p>
              Текст обтекает картинку справа. Так можно ставить любое свойство,
              для которого у движка нет готового класса.
            </p>
          </div>
        </Example>
      </Part>

      <Part
        id="safe"
        title="Что отбрасывается"
        lead={
          <>
            Свои значения попадают в CSS как есть, поэтому движок пропускает
            класс, если в нём есть то, что закрывает блок или открывает новый.
          </>
        }
      >
        <Callout tone="warning">
          Не попадут в CSS: <Code>{"{ } ;"}</Code>, комментарии{" "}
          <Code>{"/* */"}</Code> и <Code>{"//"}</Code>, управляющие символы,{" "}
          <Code>&lt;/</Code> и <Code>&lt;!--</Code>, непарная кавычка. Это
          защита от чужого ввода — из конструктора или вставленного кода.
        </Callout>
        <Callout tone="tip">
          Если одно значение повторяется — лучше токен (<Code>--brand</Code>)
          или свой класс в RenDit SCSS, а не длинная строка в каждом элементе.
        </Callout>
      </Part>
    </ClassPage>
  );
}
