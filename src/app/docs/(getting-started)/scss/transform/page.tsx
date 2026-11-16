// Трансформации: конструктор сдвига, масштаба, поворота и точки опоры, таблица классов, нажатие,
// проценты и почему transform не двигает раскладку.

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

const HREF = "/docs/scss/transform";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "press", title: "Нажатие" },
  { id: "percent", title: "Проценты" },
  { id: "origin", title: "Точка опоры" },
  { id: "layout", title: "Раскладка" },
];

const BASE = ["transition-transform", "duration-300", "ease-spring"];

const X = [-80, -40, -20, -10, 0, 10, 20, 40, 80];
const Y = [-40, -20, -10, 0, 10, 20, 40];
const SCALE = [50, 75, 90, 95, 100, 105, 110, 125, 150];
const ROTATE = [-45, -30, -15, 0, 15, 30, 45, 90, 180];
const ORIGIN = [
  "origin-center",
  "origin-top",
  "origin-bottom",
  "origin-left",
  "origin-right",
];

const GROUPS: LabGroup[] = [
  { label: "Сдвиг по X", prefix: "translate-x", values: X },
  { label: "Сдвиг по Y", prefix: "translate-y", values: Y },
  { label: "Масштаб, %", prefix: "scale", values: SCALE },
  { label: "Поворот, °", prefix: "rotate", values: ROTATE },
  { label: "Точка опоры", options: ORIGIN },
];

const classOf = (prefix: string, n: number) =>
  n < 0 ? `-${prefix}-${Math.abs(n)}` : `${prefix}-${n}`;

const LAB_CLASSES = [
  ...BASE,
  ...X.map((n) => classOf("translate-x", n)),
  ...Y.map((n) => classOf("translate-y", n)),
  ...SCALE.map((n) => `scale-${n}`),
  ...ROTATE.map((n) => classOf("rotate", n)),
  ...ORIGIN,
];

export default async function TransformPage() {
  const css = await classCss(LAB_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>translate-x-20</Code> — сдвиг на 20px,{" "}
          <Code>-translate-y-1/2</Code> — вверх на половину высоты,{" "}
          <Code>scale-95</Code> — нажатие, <Code>rotate-45</Code> — поворот. Всё
          это не меняет раскладку.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Двигайте, масштабируйте и поворачивайте карточку. Обратите внимание: соседи не сдвигаются — место карточки остаётся прежним."
        className="relative z-1"
      >
        <ClassLab
          css={css}
          groups={GROUPS}
          base={BASE}
          preview="box"
          tag="div"
          inner="Карточка"
        />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            <Code>translate-*</Code> — пиксели или доли, <Code>scale-*</Code> —
            проценты, <Code>rotate-*</Code> — градусы. Отрицательное значение —
            минус перед классом.
          </>
        }
      >
        <ClassTable
          rows={[
            ["translate-x-20", "вправо на 20px"],
            ["-translate-x-10", "влево на 10px"],
            ["translate-y-1/2", "вниз на половину высоты"],
            ["scale-95", "чуть меньше — нажатие"],
            ["scale-110", "чуть больше"],
            ["rotate-45", "поворот на 45°"],
            ["-rotate-15", "против часовой"],
            ["origin-top", "опора сверху"],
            ["origin-left", "опора слева"],
          ]}
        />
      </Part>

      <Part
        id="press"
        title="Нажатие"
        lead={
          <>
            <Code>active:scale-95</Code> плюс <Code>transition-transform</Code>{" "}
            — кнопка «проваливается» под пальцем и возвращается пружиной.
          </>
        }
      >
        <Example
          title="active:scale-95 ease-spring"
          code={`<button className="transition-transform duration-200 ease-spring active:scale-95 motion-reduce:transition-none">
  Нажмите и держите
</button>`}
        >
          <button
            type="button"
            className="h-48 px-24 br-full bg-primary text-primary-foreground font-14 font-w-600 transition-transform duration-200 ease-spring active:scale-95 motion-reduce:transition-none"
          >
            Нажмите и держите
          </button>
        </Example>
      </Part>

      <Part
        id="percent"
        title="Проценты"
        lead={
          <>
            Проценты считаются от размера самого элемента:{" "}
            <Code>translate-x-1/2</Code> сдвигает на половину его ширины. Так
            центрируют и ставят бейджи на край.
          </>
        }
      >
        <Example
          title="translate-x-1/2 и -translate-y-1/2"
          code={`<div className="relative">
  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">Центр</span>
</div>`}
        >
          <div className="relative h-96 br-lg border bg-surface">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-14 py-6 br-full bg-secondary text-secondary-foreground font-12 font-w-600">
              Ровно в центре
            </span>
          </div>
        </Example>
      </Part>

      <Part
        id="origin"
        title="Точка опоры"
        lead={
          <>
            <Code>origin-*</Code> задаёт, вокруг чего идёт поворот и масштаб. По
            умолчанию — центр.
          </>
        }
      >
        <Example
          title="rotate-45 с разной точкой опоры"
          code={`<span className="rotate-45 origin-center">…</span>
<span className="rotate-45 origin-top">…</span>`}
        >
          <div className="flex flex-wrap items-center gap-20">
            {["origin-center", "origin-top", "origin-left"].map((o) => (
              <span key={o} className="flex flex-col items-center gap-6">
                <span
                  className={`size-48 br-md bg-blue-500/30 border border-blue-500/50 rotate-45 ${o}`}
                />
                <code className="font-11 font-mono text-foreground-muted">
                  {o}
                </code>
              </span>
            ))}
          </div>
        </Example>
      </Part>

      <Part id="layout" title="Раскладка">
        <Callout>
          <Code>transform</Code> не меняет место элемента в раскладке: соседи
          стоят как стояли. Поэтому сдвиг и масштаб дешёвые — браузер не
          пересчитывает страницу.
        </Callout>
      </Part>
    </ClassPage>
  );
}
