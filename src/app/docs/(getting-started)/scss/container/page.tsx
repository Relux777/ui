// Контейнер: конструктор контейнерных запросов сверху, таблица «класс → CSS» от движка, контейнер страницы
// .container из RenDit SCSS (ширины по брейкпоинтам), затем примеры — карточка в узкой и широкой колонке,
// спрятать по ширине блока, свой порог @[500px]:.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, CodeBlock, Example, Table } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { ContainerBuilder } from "./_builder";
import { CONTAINER_CLASSES } from "./_classes";

const HREF = "/docs/scss/container";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "page", title: "Контейнер страницы" },
  { id: "columns", title: "Узкая и широкая колонка" },
  { id: "hide", title: "Спрятать по ширине блока" },
  { id: "custom", title: "Свой порог" },
];

const COVER =
  "bg-[linear-gradient(135deg,var(--violet-400),var(--pink-400)_60%,var(--orange-300))]";

export default async function ContainerPage() {
  const css = await classCss(CONTAINER_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>.container</Code> — ширина страницы по брейкпоинтам и поля по
          краям. <Code>@container</Code> — блок, по ширине которого
          перестраиваются дети: <Code>@md:flex-row</Code> срабатывает, когда
          шире 448px сам блок, а не окно.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Меняйте ширину блока — карточка внутри встанет в ряд, когда блок станет шире порога. Окно при этом не меняется."
        className="relative z-1"
      >
        <ContainerBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Пороги блока: <Code>@xs</Code> 320 · <Code>@sm</Code> 384 ·{" "}
            <Code>@md</Code> 448 · <Code>@lg</Code> 512 · <Code>@xl</Code> 576 ·{" "}
            <Code>@2xl</Code> 672px — свои задаются в{" "}
            <Code>rendit.config.mjs</Code> (<Code>containers</Code>).
          </>
        }
      >
        <ClassTable
          rows={[
            ["@container", "блок, по ширине которого меряют дети"],
            ["@md:flex-row", "с 448px ширины блока"],
            ["@max-md:hidden", "уже 448px — спрятать"],
            ["@[500px]:grid-cols-2", "свой порог"],
          ]}
        />
      </Part>

      <Part
        id="page"
        title="Контейнер страницы"
        lead={
          <>
            <Code>.container</Code> из RenDit SCSS: по центру, на всю ширину до
            620px, дальше — не шире своей ширины. Поля по краям — не меньше 10px
            и не меньше «чёлки» телефона.
          </>
        }
      >
        <Table
          head={["Экран", "Ширина .container"]}
          rows={[
            ["до 620px", "100%"],
            [<Code key="c">sm</Code>, "700px"],
            [<Code key="c">md</Code>, "720px"],
            [<Code key="c">lg</Code>, "960px"],
            [<Code key="c">xl</Code>, "1140px"],
            [<Code key="c">2xl</Code>, "1320px"],
          ]}
        />
        <CodeBlock
          code={`<main class="container py-48">…</main>

/* поля по краям — своя переменная */
:root { --container-gutter: 16px; }`}
        />
      </Part>

      <Part
        id="columns"
        title="Узкая и широкая колонка"
        lead={
          <>
            Одна и та же карточка с <Code>@container</Code>: в узкой боковой
            колонке — столбиком, в широкой — в ряд. Брейкпоинты экрана так не
            умеют: экран один, а колонки разные.
          </>
        }
      >
        <Example
          title="одна карточка в колонках 240px и 1fr"
          code={`<div class="@container">
  <article class="flex flex-col @md:flex-row gap-12">…</article>
</div>`}
        >
          <div className="grid grid-cols-[240px_minmax(0,1fr)] gap-12 max-sm:grid-cols-1">
            {["узкая", "широкая"].map((col) => (
              <div key={col} className="@container">
                <article className="flex flex-col @md:flex-row gap-10 p-10 br-lg border bg-surface">
                  <span
                    className={`w-full @md:w-120 aspect-video @md:aspect-square shrink-0 br-md ${COVER}`}
                  />
                  <span className="font-13 text-foreground-muted">
                    Колонка {col}
                  </span>
                </article>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="hide"
        title="Спрятать по ширине блока"
        lead={
          <>
            <Code>@max-md:hidden</Code> — подпись исчезает, когда блок уже
            448px: в узкой колонке остаются только иконки.
          </>
        }
      >
        <Example
          title="@max-md:hidden"
          code={`<div class="@container">  <span class="@max-md:hidden">Подпись</span>  </div>`}
        >
          <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-12 max-sm:grid-cols-1">
            {["узкий", "широкий"].map((col) => (
              <div key={col} className="@container">
                <div className="flex items-center gap-8 p-10 br-lg border bg-surface font-13">
                  <span className="size-28 br-md bg-secondary/15 grid place-items-center">
                    ★
                  </span>
                  <span className="@max-md:hidden">
                    Подпись видна — блок {col}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="custom"
        title="Свой порог"
        lead={
          <>
            Порог в квадратных скобках: <Code>@[500px]:grid-cols-2</Code> — две
            колонки, когда блок шире 500px.
          </>
        }
      >
        <Example
          title="@[500px]:grid-cols-2"
          code={`<div class="@container">  <ul class="grid @[500px]:grid-cols-2 gap-8">`}
        >
          <div className="@container">
            <ul className="grid @[500px]:grid-cols-2 gap-8 font-13">
              {["Первый", "Второй", "Третий", "Четвёртый"].map((t) => (
                <li key={t} className="px-12 py-8 br-md bg-foreground/5">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
