// Фон: конструктор картинки сверху (размер и позиция), таблица «класс → CSS», затем своя картинка,
// градиент и текст с фоном внутри букв.

import { classCss } from "../../../../_docs/class-css";
import type { LabGroup } from "../../../../_docs/class-lab";
import { ClassLab } from "../../../../_docs/class-lab";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, CodeBlock, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";

const HREF = "/docs/scss/background";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "image", title: "Своя картинка" },
  { id: "gradient", title: "Градиент" },
  { id: "text", title: "Текст с фоном" },
];

const BASE = ["bg-no-repeat"];

const GROUPS: LabGroup[] = [
  { label: "Размер", options: ["bg-cover", "bg-contain"] },
  {
    label: "Позиция",
    options: [
      "bg-center",
      "bg-[position:top]",
      "bg-[position:bottom]",
      "bg-[position:left]",
      "bg-[position:right]",
    ],
  },
];

const LAB_CLASSES = [
  ...BASE,
  ...GROUPS.flatMap((g) => ("options" in g ? g.options : [])),
];

export default async function BackgroundPage() {
  const css = await classCss(LAB_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>bg-cover</Code> заполняет блок без пустых краёв,{" "}
          <Code>bg-contain</Code> показывает картинку целиком,{" "}
          <Code>bg-center</Code> держит середину. Своя картинка —{" "}
          <Code>bg-[url(…)]</Code>.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите размер и позицию — картинка в превью настоящая, классы и CSS от движка."
        className="relative z-1"
      >
        <ClassLab
          css={css}
          groups={GROUPS}
          base={BASE}
          preview="image"
          tag="div"
          inner=""
        />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Размер и позиция — классами, своя картинка — в скобках:{" "}
            <Code>bg-[url(/photo.jpg)]</Code>. Пробелы внутри — <Code>_</Code>.
          </>
        }
      >
        <ClassTable
          rows={[
            ["bg-cover", "заполнить блок, края обрезаются"],
            ["bg-contain", "картинка целиком"],
            ["bg-center", "середина по центру"],
            ["bg-no-repeat", "не повторять"],
            ["bg-none", "без картинки"],
            ["bg-[url(/samples/landscape.svg)]", "своя картинка"],
            ["bg-[size:100%_auto]", "свой размер"],
            ["bg-[position:top]", "своя позиция"],
            ["bg-clip-text", "фон внутри букв"],
            ["bg-gradient-brand", "градиент из токена"],
          ]}
        />
      </Part>

      <Part
        id="image"
        title="Своя картинка"
        lead={
          <>
            Путь — от <Code>public</Code>: файл <Code>public/photo.jpg</Code> —
            это <Code>/photo.jpg</Code>. Вместе с <Code>bg-cover</Code> и{" "}
            <Code>bg-center</Code> картинка заполняет карточку.
          </>
        }
      >
        <Example
          title="bg-[url(/samples/landscape.svg)] bg-cover bg-center"
          code={`<div className="h-220 br-xl bg-[url(/samples/landscape.svg)] bg-cover bg-center" />`}
        >
          <div className="h-220 br-xl border bg-[url(/samples/landscape.svg)] bg-cover bg-center" />
        </Example>
      </Part>

      <Part
        id="gradient"
        title="Градиент"
        lead={
          <>
            Готовый — <Code>bg-gradient-brand</Code>, свой —{" "}
            <Code>bg-[linear-gradient(135deg,#ed70a7,#f7ae49)]</Code>.
          </>
        }
      >
        <CodeBlock
          lang="html"
          code={`<div className="h-160 br-xl bg-[linear-gradient(135deg,#ed70a7,#f7ae49)]" />`}
        />
      </Part>

      <Part
        id="text"
        title="Текст с фоном"
        lead={
          <>
            <Code>bg-clip-text</Code> обрезает фон по буквам, а{" "}
            <Code>text-transparent</Code> делает сами буквы прозрачными.
          </>
        }
      >
        <Example
          title="Градиент в буквах"
          code={`<h2 className="font-40 font-w-700 bg-gradient-brand bg-clip-text text-transparent">
  RenDit UI
</h2>`}
        >
          <h2 className="font-40 font-w-700 bg-gradient-brand bg-clip-text text-transparent">
            RenDit UI
          </h2>
        </Example>
      </Part>
    </ClassPage>
  );
}
