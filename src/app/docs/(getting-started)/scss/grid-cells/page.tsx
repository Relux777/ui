// Ячейки grid: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — плитки разного размера
// (bento), шапка на всю ширину, колонка с заданной позиции, галерея без дыр (grid-flow-dense).

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { GridCellsBuilder } from "./_builder";
import { GRID_CELL_CLASSES } from "./_classes";

const HREF = "/docs/scss/grid-cells";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "bento", title: "Плитки разного размера" },
  { id: "full", title: "На всю ширину" },
  { id: "dense", title: "Без дыр" },
];

const TILE = "grid place-items-center br-lg text-white font-13 font-w-700";

export default async function GridCellsPage() {
  const css = await classCss(GRID_CELL_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>col-span-2</Code> — ячейка на две колонки,{" "}
          <Code>row-span-2</Code> — на две строки, <Code>col-start-3</Code> —
          начать с третьей колонки. <Code>col-span-full</Code> — во всю ширину
          сетки.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Растяните розовую карточку на несколько колонок и строк, сдвиньте её начало и посмотрите, как сетка обходит дыры."
        className="relative z-1"
      >
        <GridCellsBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["col-span-2", "на 2 колонки"],
            ["col-span-full", "на все колонки"],
            ["col-start-2", "начать со 2-й линии"],
            ["col-end-3", "закончить на 3-й линии"],
            ["row-span-2", "на 2 строки"],
            ["row-start-1", "начать с 1-й строки"],
            ["row-end-3", "закончить на 3-й линии строк"],
            ["grid-flow-row", "заполнять по строкам (по умолчанию)"],
            ["grid-flow-col", "заполнять по столбцам"],
            ["grid-flow-dense", "заполнять дыры"],
          ]}
        />
      </Part>

      <Part
        id="bento"
        title="Плитки разного размера"
        lead={
          <>
            Сетка из 4 колонок: главная плитка —{" "}
            <Code>col-span-2 row-span-2</Code>, широкая —{" "}
            <Code>col-span-2</Code>, остальные по одной.
          </>
        }
      >
        <Example
          title="col-span-2 row-span-2 и col-span-2"
          code={`<div class="grid grid-cols-4 [grid-auto-rows:80px] gap-8">
  <div class="col-span-2 row-span-2">…</div>
  <div class="col-span-2">…</div>
  <div>…</div> <div>…</div>
</div>`}
        >
          <div className="grid grid-cols-4 [grid-auto-rows:80px] gap-8">
            <span className={`${TILE} col-span-2 row-span-2 bg-violet-500`}>
              Главное
            </span>
            <span className={`${TILE} col-span-2 bg-pink-500`}>Широкая</span>
            <span className={`${TILE} bg-blue-500`}>3</span>
            <span className={`${TILE} bg-blue-500`}>4</span>
          </div>
        </Example>
      </Part>

      <Part
        id="full"
        title="На всю ширину"
        lead={
          <>
            Заголовок группы в сетке карточек — <Code>col-span-full</Code>: на
            всю ширину, сколько бы колонок ни было.
          </>
        }
      >
        <Example
          title="col-span-full в grid-fill"
          code={`<ul class="grid grid-fill-140 gap-8">
  <li class="col-span-full">Заголовок</li>
  <li>…</li>
</ul>`}
        >
          <ul className="grid grid-fill-140 gap-8">
            <li className="col-span-full font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
              Формы
            </li>
            {["Поле", "Флажок", "Выбор", "Ползунок"].map((t) => (
              <li key={t} className={`${TILE} h-56 bg-blue-500`}>
                {t}
              </li>
            ))}
          </ul>
        </Example>
      </Part>

      <Part
        id="dense"
        title="Без дыр"
        lead={
          <>
            Широкая плитка не влезла в конец строки — осталась дыра.{" "}
            <Code>grid-flow-dense</Code> переставит в неё следующую маленькую.
            Порядок на экране меняется — для галерей это нормально.
          </>
        }
      >
        <Example
          title="grid-flow-row и grid-flow-dense"
          code={`<div class="grid grid-cols-4 grid-flow-dense">`}
        >
          <div className="flex flex-col gap-12">
            {(["grid-flow-row", "grid-flow-dense"] as const).map((flow) => (
              <div key={flow} className="flex flex-col gap-4">
                <code className="font-11 text-foreground-muted">{flow}</code>
                <div className={`grid grid-cols-4 ${flow} gap-6 font-12`}>
                  {["1", "2", "3 широкая", "4", "5"].map((t) => (
                    <span
                      key={t}
                      className={`${TILE} h-40 ${t.includes("широкая") ? "col-span-3 bg-pink-500" : "bg-blue-500"}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
