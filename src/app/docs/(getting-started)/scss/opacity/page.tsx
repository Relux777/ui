// Прозрачность: конструктор с ползунком, таблица классов, отличие opacity от прозрачности цвета /N,
// плавное появление и что opacity делает с детьми.

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

const HREF = "/docs/scss/opacity";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "or-alpha", title: "opacity или /N" },
  { id: "appear", title: "Появление" },
  { id: "children", title: "Дети и слои" },
];

const VALUES = [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100];

const GROUPS: LabGroup[] = [
  { label: "Прозрачность", prefix: "opacity", values: VALUES },
];

const LAB_CLASSES = VALUES.map((n) => `opacity-${n}`);

export default async function OpacityPage() {
  const css = await classCss(LAB_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>opacity-50</Code> — полупрозрачный весь элемент вместе с детьми.{" "}
          <Code>bg-primary/50</Code> — только фон: текст внутри остаётся
          непрозрачным. Числа — проценты: <Code>opacity-25</Code> = 0,25.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Ползунок меняет прозрачность карточки целиком — видно и фон, и текст, и круги внутри."
        className="relative z-1"
      >
        <ClassLab css={css} groups={GROUPS} preview="opacity" />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Числа от 0 до 100 — проценты. Своё значение —{" "}
            <Code>opacity-[0.35]</Code>.
          </>
        }
      >
        <ClassTable
          rows={[
            ["opacity-0", "не видно, но место занимает"],
            ["opacity-25", "четверть"],
            ["opacity-50", "половина"],
            ["opacity-75", "чуть прозрачный"],
            ["opacity-100", "полностью видно"],
            ["opacity-[0.35]", "своё значение"],
          ]}
        />
      </Part>

      <Part
        id="or-alpha"
        title="opacity или /N"
        lead={
          <>
            Если прозрачным должен быть только фон — прозрачность цвета через{" "}
            <Code>/N</Code>. <Code>opacity</Code> гасит всё подряд, включая
            текст и картинки.
          </>
        }
      >
        <Example
          title="opacity-50 и bg-primary/50"
          code={`<div className="bg-primary opacity-50">Текст тоже бледный</div>
<div className="bg-primary/50">Текст обычный</div>`}
        >
          <div className="grid sm:grid-cols-2 gap-12">
            <div className="p-16 br-lg bg-primary opacity-50 text-primary-foreground font-13 font-w-600">
              opacity-50: текст бледный
            </div>
            <div className="p-16 br-lg bg-primary/50 text-foreground font-13 font-w-600">
              bg-primary/50: текст обычный
            </div>
          </div>
        </Example>
      </Part>

      <Part
        id="appear"
        title="Появление"
        lead={
          <>
            Прозрачность анимируется дёшево: у предка <Code>group</Code>, у
            элемента{" "}
            <Code>opacity-0 transition-opacity group-hover:opacity-100</Code>.
            На телефоне наведения нет — там появление по <Code>data-show</Code>.
          </>
        }
      >
        <Example
          title="group-hover:opacity-100"
          code={`<div className="group p-16">
  <span className="opacity-0 transition-opacity group-hover:opacity-100">
    Появилось
  </span>
</div>`}
        >
          <div className="group grid place-items-center h-80 br-lg border bg-surface cursor-pointer font-13 font-w-600">
            <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none">
              Наведите на карточку
            </span>
          </div>
        </Example>
      </Part>

      <Part id="children" title="Дети и слои">
        <Callout tone="warning">
          <Code>opacity</Code> меньше 1 у предка делает его новым контекстом
          наложения: <Code>z-index</Code> детей считается внутри, а стекло
          внутри перестаёт размывать страницу. Для стеклянных панелей не
          анимируйте прозрачность предков.
        </Callout>
        <Callout tone="tip">
          Плавное появление лучше держать на одном элементе и только на{" "}
          <Code>opacity</Code> — так браузер считает анимацию на видеокарте.
        </Callout>
      </Part>
    </ClassPage>
  );
}
