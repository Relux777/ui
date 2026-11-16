// Обводка: конструктор толщины, отступа и цвета, таблица классов, фокус с клавиатуры и почему
// outline-none без замены — плохо.

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

const HREF = "/docs/scss/outline";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "focus", title: "Фокус" },
  { id: "none", title: "Без обводки" },
];

const WIDTHS = [1, 2, 3, 4, 6];
const OFFSETS = [0, 2, 4, 8];
const COLORS = [
  "outline-secondary",
  "outline-primary",
  "outline-accent",
  "outline-danger",
  "outline-current",
];

const GROUPS: LabGroup[] = [
  { label: "Толщина", prefix: "outline", values: WIDTHS },
  { label: "Отступ", prefix: "outline-offset", values: OFFSETS },
  { label: "Цвет", options: COLORS },
];

const LAB_CLASSES = [
  ...WIDTHS.map((n) => `outline-${n}`),
  ...OFFSETS.map((n) => `outline-offset-${n}`),
  ...COLORS,
];

export default async function OutlinePage() {
  const css = await classCss(LAB_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>outline-2</Code> — обводка 2px, <Code>outline-offset-4</Code> —
          отступ от края, <Code>outline-secondary</Code> — цвет. Обводка не
          занимает место и не двигает раскладку.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Толщина, отступ и цвет. Отступ отодвигает обводку от края — её видно на любом фоне."
        className="relative z-1"
      >
        <ClassLab css={css} groups={GROUPS} preview="button" />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Толщина и отступ — пиксели. <Code>outline</Code> без числа — 1px,{" "}
            <Code>outline-none</Code> — убрать.
          </>
        }
      >
        <ClassTable
          rows={[
            ["outline", "1px сплошная"],
            ["outline-2", "2px"],
            ["outline-offset-4", "отступ 4px"],
            ["outline-secondary", "цвет secondary"],
            ["outline-danger", "цвет danger"],
            ["outline-current", "цвет текста"],
            ["outline-none", "убрать обводку"],
          ]}
        />
      </Part>

      <Part
        id="focus"
        title="Фокус"
        lead={
          <>
            <Code>focus-visible:</Code> показывает обводку только при переходе с
            клавиатуры. Мышью кольца нет — и это правильно: кликнув, вы и так
            знаете, где находитесь.
          </>
        }
      >
        <Example
          title="focus-visible:outline-offset-4 focus-visible:outline-secondary"
          note="Нажмите Tab, чтобы увидеть кольцо."
          code={`<button className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
  Нажмите Tab
</button>`}
        >
          <button
            type="button"
            className="h-44 px-20 br-full bg-surface-muted font-14 font-w-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            Нажмите Tab
          </button>
        </Example>
      </Part>

      <Part id="none" title="Без обводки">
        <Callout tone="warning">
          <Code>outline-none</Code> без замены лишает клавиатуру ориентира. Если
          убираете — сразу дайте другое заметное состояние:{" "}
          <Code>focus-visible:outline-2</Code> или смену фона.
        </Callout>
        <Example
          title="outline-none с заменой"
          code={`<button className="outline-none focus-visible:bg-secondary focus-visible:text-secondary-foreground">
  …
</button>`}
        >
          <button
            type="button"
            className="h-44 px-20 br-full bg-surface-muted font-14 font-w-600 outline-none focus-visible:bg-secondary focus-visible:text-secondary-foreground"
          >
            Фон вместо кольца
          </button>
        </Example>
      </Part>
    </ClassPage>
  );
}
