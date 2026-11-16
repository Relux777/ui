// SVG: конструктор цвета и толщины линии, таблица fill-*/stroke-*, затем currentColor, контурная
// иконка и толщина линии.

import { classCss } from "../../../../_docs/class-css";
import type { LabGroup } from "../../../../_docs/class-lab";
import { ClassLab } from "../../../../_docs/class-lab";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";

const HREF = "/docs/scss/svg";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "current", title: "currentColor" },
  { id: "outline", title: "Заливка и линия" },
  { id: "width", title: "Толщина" },
];

const BASE = ["size-96", "text-secondary"];

const FILL = [
  "fill-current",
  "fill-secondary",
  "fill-accent",
  "fill-blue-500",
  "fill-transparent",
];
const STROKE = [
  "stroke-current",
  "stroke-secondary",
  "stroke-accent",
  "stroke-blue-500",
  "stroke-transparent",
];
const WIDTHS = [0, 1, 2, 3, 4];

const GROUPS: LabGroup[] = [
  { label: "Заливка", options: FILL },
  { label: "Линия", options: STROKE },
  { label: "Толщина линии", prefix: "stroke", values: WIDTHS },
];

const LAB_CLASSES = [
  ...BASE,
  ...FILL,
  ...STROKE,
  ...WIDTHS.map((n) => `stroke-${n}`),
];

const STAR =
  "M12 2.6l2.8 6.1 6.6.7-4.9 4.4 1.4 6.5L12 17l-5.9 3.3 1.4-6.5-4.9-4.4 6.6-.7z";

export default async function SvgPage() {
  const css = await classCss(LAB_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          Цвет иконки — <Code>fill-*</Code>, линия — <Code>stroke-*</Code>, её
          толщина — <Code>stroke-N</Code>. <Code>fill-current</Code> и{" "}
          <Code>stroke-current</Code> берут цвет текста, поэтому иконка меняется
          вместе со ссылкой.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Заливка, линия и её толщина. Если заливка прозрачная, видна только линия — так делают контурные иконки."
        className="relative z-1"
      >
        <ClassLab
          css={css}
          groups={GROUPS}
          base={BASE}
          preview="icon"
          tag="svg"
          inner='<path d="…" />'
        />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Цвета — токены, как у текста и фона: <Code>fill-secondary</Code>,{" "}
            <Code>stroke-danger/60</Code>. Толщина — пиксели.
          </>
        }
      >
        <ClassTable
          rows={[
            ["fill-current", "цвет текста"],
            ["fill-secondary", "вторичный акцент"],
            ["fill-accent", "лаймовый акцент"],
            ["fill-blue-500", "цвет палитры"],
            ["fill-transparent", "без заливки"],
            ["stroke-current", "линия цветом текста"],
            ["stroke-secondary", "линия вторичным"],
            ["stroke-2", "толщина 2px"],
            ["stroke-0", "без линии"],
          ]}
        />
      </Part>

      <Part
        id="current"
        title="currentColor"
        lead={
          <>
            <Code>fill-current</Code> и <Code>stroke-current</Code> — иконка
            наследует <Code>color</Code>. Поставили ссылке{" "}
            <Code>hover:text-secondary</Code> — иконка поменялась вместе с
            текстом.
          </>
        }
      >
        <Example
          title="Иконка в цвет текста"
          code={`<a className="flex items-center gap-6 text-secondary hover:text-accent">
  <svg className="size-24 fill-current">…</svg>
  Ссылка
</a>`}
        >
          <a
            href="#current"
            className="flex items-center gap-6 text-secondary hover:text-accent transition-colors font-14 font-w-600"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-24 fill-current"
            >
              <path d={STAR} />
            </svg>
            Ссылка с иконкой
          </a>
        </Example>
      </Part>

      <Part
        id="outline"
        title="Заливка и линия"
        lead={
          <>
            Сплошная — заливка цветом. Контурная —{" "}
            <Code>fill-transparent stroke-2</Code>.
          </>
        }
      >
        <Example
          title="fill-accent и fill-transparent stroke-secondary stroke-2"
          code={`<svg className="size-64 fill-accent">…</svg>
<svg className="size-64 fill-transparent stroke-secondary stroke-2">…</svg>`}
        >
          <div className="flex items-center gap-20 text-secondary">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-64 fill-accent"
            >
              <path d={STAR} />
            </svg>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-64 fill-transparent stroke-secondary stroke-2"
            >
              <path d={STAR} />
            </svg>
          </div>
        </Example>
      </Part>

      <Part
        id="width"
        title="Толщина"
        lead={
          <>
            <Code>stroke-1…4</Code> — пиксели. Толстая линия на маленькой иконке
            сливается, держите 1–2px.
          </>
        }
      >
        <Example
          title="stroke-1 … stroke-4"
          code={`<svg className="size-48 fill-transparent stroke-secondary stroke-2">…</svg>`}
        >
          <div className="flex items-end gap-16 text-secondary">
            {["stroke-1", "stroke-2", "stroke-3", "stroke-4"].map((s) => (
              <span key={s} className="flex flex-col items-center gap-6">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={`size-48 fill-transparent stroke-secondary ${s}`}
                >
                  <path d={STAR} />
                </svg>
                <code className="font-11 font-mono text-foreground-muted">
                  {s}
                </code>
              </span>
            ))}
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
