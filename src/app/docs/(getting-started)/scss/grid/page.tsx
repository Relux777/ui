// Grid: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — карточки без брейкпоинтов
// (grid-fill), колонки по экрану, меню и содержимое (свой шаблон), строки одной высоты.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { GridBuilder } from "./_builder";
import { GRID_CLASSES } from "./_classes";

const HREF = "/docs/scss/grid";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "fill", title: "Карточки без брейкпоинтов" },
  { id: "responsive", title: "Колонки по экрану" },
  { id: "template", title: "Меню и содержимое" },
  { id: "rows", title: "Строки" },
];

const CARD =
  "grid place-items-center h-64 br-md bg-blue-500 text-white font-13 font-w-700";

export default async function GridPage() {
  const css = await classCss(GRID_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>grid grid-cols-3</Code> — три колонки,{" "}
          <Code>grid-fill-200</Code> — сколько влезет колонок не уже 200px, без
          брейкпоинтов. Свои размеры — <Code>grid-cols-[240px_1fr]</Code>.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Задайте колонки числом, автозаполнением или своим шаблоном и меняйте ширину родителя — сетка перестраивается сама."
        className="relative z-1"
      >
        <GridBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Растянуть ячейку на несколько колонок — «Ячейки grid», выравнивание
            в ячейках — «Выравнивание».
          </>
        }
      >
        <ClassTable
          rows={[
            ["grid", "контейнер-сетка"],
            ["grid-cols-3", "3 равные колонки"],
            ["grid-cols-12", "12 колонок — как у .row"],
            ["grid-fill-160", "сколько влезет, не уже 160px"],
            ["grid-fit-160", "то же, пустые колонки схлопываются"],
            ["grid-cols-[200px_1fr]", "свой шаблон"],
            ["grid-cols-none", "сбросить колонки"],
            ["grid-rows-3", "3 равные строки"],
          ]}
        />
      </Part>

      <Part
        id="fill"
        title="Карточки без брейкпоинтов"
        lead={
          <>
            <Code>grid-fill-200</Code> — на телефоне одна колонка, на планшете
            две-три, на компьютере четыре: сами, без <Code>sm:</Code> и{" "}
            <Code>lg:</Code>. Поменяйте ширину окна.
          </>
        }
      >
        <Example
          title="grid grid-fill-200 gap-10"
          code={`<ul class="grid grid-fill-200 gap-10">`}
        >
          <ul className="grid grid-fill-200 gap-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <li key={n} className={CARD}>
                Карточка {n}
              </li>
            ))}
          </ul>
        </Example>
      </Part>

      <Part
        id="responsive"
        title="Колонки по экрану"
        lead={
          <>
            Точное число колонок на каждом экране:{" "}
            <Code>grid-cols-1 sm:grid-cols-2 lg:grid-cols-4</Code>.
          </>
        }
      >
        <Example
          title="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          code={`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={CARD}>
                {n}
              </span>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="template"
        title="Меню и содержимое"
        lead={
          <>
            Меню фиксированной ширины и содержимое на остаток:{" "}
            <Code>lg:grid-cols-[240px_minmax(0,1fr)]</Code> — так устроена эта
            справка. <Code>minmax(0,1fr)</Code> вместо <Code>1fr</Code> — чтобы
            длинный код не раздвигал колонку.
          </>
        }
      >
        <Example
          title="grid-cols-[160px_minmax(0,1fr)]"
          code={`<div class="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-48">
  <aside>…</aside>
  <main>…</main>
</div>`}
        >
          <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-10 h-160 font-13 font-w-600">
            <aside className="p-10 br-md bg-foreground/6">Меню 160px</aside>
            <main className="p-10 br-md bg-blue-500/12 text-blue-600">
              Содержимое — всё остальное
            </main>
          </div>
        </Example>
      </Part>

      <Part
        id="rows"
        title="Строки"
        lead={
          <>
            Ячейки в строке одной высоты сами — по самой высокой.{" "}
            <Code>grid-rows-3</Code> делит высоту на равные строки, если она
            задана.
          </>
        }
      >
        <Example
          title="grid grid-cols-3 grid-rows-3 h-200"
          code={`<div class="grid grid-cols-3 grid-rows-3 h-200 gap-6">`}
        >
          <div className="grid grid-cols-3 grid-rows-3 h-200 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <span
                key={n}
                className="grid place-items-center br-md bg-blue-500 text-white font-12 font-w-700"
              >
                {n}
              </span>
            ))}
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
