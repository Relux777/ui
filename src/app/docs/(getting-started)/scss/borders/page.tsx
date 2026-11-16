// Рамки: конструктор стороны, толщины, стиля и цвета, таблица «класс → CSS», примеры — одна сторона,
// стиль линии, цвет и прозрачность.

import { classCss } from "../../../../_docs/class-css";
import type { LabGroup } from "../../../../_docs/class-lab";
import { ClassLab } from "../../../../_docs/class-lab";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Callout, Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";

const HREF = "/docs/scss/borders";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "side", title: "Одна сторона" },
  { id: "style", title: "Стиль линии" },
  { id: "color", title: "Цвет и прозрачность" },
];

const SIDES = ["", "border-t-4", "border-r-4", "border-b-4", "border-l-4"];
const WIDTHS = [1, 2, 3, 4, 6, 8];
const STYLES = ["border-solid", "border-dashed", "border-dotted"];
const COLORS = [
  "border-border",
  "border-primary",
  "border-secondary",
  "border-accent",
  "border-danger",
  "border-transparent",
];

const GROUPS: LabGroup[] = [
  { label: "Сторона", options: SIDES },
  { label: "Толщина", prefix: "border", values: WIDTHS },
  { label: "Стиль", options: STYLES },
  { label: "Цвет", options: COLORS },
];

const LAB_CLASSES = [
  ...SIDES,
  ...WIDTHS.map((n) => `border-${n}`),
  ...STYLES,
  ...COLORS,
].filter(Boolean);

export default async function BordersPage() {
  const css = await classCss(LAB_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>border</Code> — 1px со всех сторон, <Code>border-2</Code> —
          толще, <Code>border-b</Code> — только снизу. Стиль —{" "}
          <Code>border-dashed</Code>, цвет — <Code>border-primary/20</Code>.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Сторона, толщина, стиль и цвет. Без рамки блок не меняет размер — рамка рисуется по краю, а не сдвигает соседей."
        className="relative z-1"
      >
        <ClassLab css={css} groups={GROUPS} preview="box" />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Толщина — пиксели: <Code>border-3</Code> тоже работает. Цвет —
            токены, прозрачность — <Code>/N</Code>.
          </>
        }
      >
        <ClassTable
          rows={[
            ["border", "1px со всех сторон"],
            ["border-2", "2px со всех сторон"],
            ["border-t", "только сверху"],
            ["border-b-2", "снизу 2px"],
            ["border-x", "слева и справа"],
            ["border-l-4", "слева 4px"],
            ["border-dashed", "пунктир"],
            ["border-dotted", "точки"],
            ["border-primary", "цвет primary"],
            ["border-primary/20", "primary с прозрачностью"],
            ["border-transparent", "невидимая"],
          ]}
        />
      </Part>

      <Part
        id="side"
        title="Одна сторона"
        lead={
          <>
            <Code>border-b</Code> ставит стиль только своей стороне — иначе{" "}
            <Code>border-style: solid</Code> включил бы все стороны с толщиной
            по умолчанию.
          </>
        }
      >
        <Example
          title="border-b last:border-b-0"
          code={`<ul>
  <li className="border-b">Первый</li>
  <li className="border-b last:border-b-0">Последний</li>
</ul>`}
        >
          <ul className="br-lg border bg-surface overflow-hidden">
            {["Начало", "Цвета", "Тени"].map((t) => (
              <li
                key={t}
                className="px-14 py-10 border-b last:border-b-0 font-13 text-foreground-muted"
              >
                {t}
              </li>
            ))}
          </ul>
        </Example>
        <Example
          title="border-l-2 border-secondary"
          code={`<div className="border-l-2 border-secondary pl-14">Важно</div>`}
        >
          <div className="border-l-2 border-secondary bg-secondary/6 pl-14 py-10 br-r-md font-13">
            Полоса слева — тот же <Code>border</Code>, только одной стороны.
          </div>
        </Example>
      </Part>

      <Part id="style" title="Стиль линии">
        <Example
          title="solid, dashed, dotted"
          code={`<div className="border border-solid">…</div>
<div className="border border-dashed">…</div>
<div className="border border-dotted">…</div>`}
        >
          <div className="grid sm:grid-cols-3 gap-12">
            {["border-solid", "border-dashed", "border-dotted"].map((s) => (
              <div
                key={s}
                className={`grid place-items-center h-64 br-md border ${s} font-12 font-w-600`}
              >
                {s.replace("border-", "")}
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="color"
        title="Цвет и прозрачность"
        lead={
          <>
            Цвет рамки — такой же токен, как фон: <Code>border-danger/40</Code>.
            Прозрачная рамка занимает место, но не видна — удобно для
            выравнивания.
          </>
        }
      >
        <Example
          title="border-primary/20 и border-transparent"
          code={`<div className="border border-primary/20">…</div>
<div className="border border-transparent">…</div>`}
        >
          <div className="grid sm:grid-cols-2 gap-12">
            <div className="grid place-items-center h-64 br-md border border-primary/20 bg-surface font-12 font-w-600">
              border-primary/20
            </div>
            <div className="grid place-items-center h-64 br-md border border-transparent bg-surface font-12 font-w-600">
              border-transparent
            </div>
          </div>
        </Example>
        <Callout tone="tip">
          Для кольца фокуса берите <Code>outline</Code> — оно не занимает место
          и не двигает раскладку.
        </Callout>
      </Part>
    </ClassPage>
  );
}
