// Адаптив: конструктор сверху (раскладка меняется вместе с окном), таблица «класс → CSS», затем примеры —
// mobile-first, max- и диапазоны, телефон, свои брейкпоинты. Все классы строками целиком.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Callout, Code, CodeBlock, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { ResponsiveBuilder } from "./_builder";
import { RESPONSIVE_CLASSES } from "./_classes";

const HREF = "/docs/scss/responsive";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "mobile", title: "Mobile-first" },
  { id: "max", title: "max- и диапазоны" },
  { id: "phone", title: "Телефон" },
  { id: "own", title: "Свои брейкпоинты" },
];

export default async function ResponsivePage() {
  const css = await classCss(RESPONSIVE_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>sm:</Code> 620 · <Code>md:</Code> 770 · <Code>lg:</Code> 990 ·{" "}
          <Code>xl:</Code> 1200 · <Code>2xl:</Code> 1400. Брейкпоинт — это «от
          этой ширины и больше», поэтому классы пишут от телефона к компьютеру,
          а <Code>max-md:</Code> — наоборот, для узких экранов.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите раскладку и число карточек. Превью настоящее: потяните окно — карточки перестроятся, а сверху подсветится текущий брейкпоинт."
        className="relative z-1"
      >
        <ResponsiveBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Вариант ставится перед классом: <Code>sm:w-1/2</Code>,{" "}
            <Code>md:flex-row</Code>. Брейкпоинты можно соединять с другими
            вариантами: <Code>dark:lg:p-32</Code>.
          </>
        }
      >
        <ClassTable
          rows={[
            ["font-14", "основной текст"],
            ["sm:font-16", "с 620px — крупнее текст"],
            ["flex-col", "столбиком"],
            ["md:flex-row", "с 770px — в ряд"],
            ["grid-cols-2", "две колонки"],
            ["lg:grid-cols-4", "с 990px — четыре колонки"],
            ["hidden", "скрыто"],
            ["xl:block", "с 1200px — показать"],
            ["p-12", "поля 12px"],
            ["2xl:p-24", "с 1400px — больше полей"],
            ["max-sm:hidden", "скрыть уже 620px"],
            ["max-md:flex-col", "уже 770px — столбиком"],
            ["max-lg:p-12", "до 990px — меньше полей"],
            ["min-[500px]:p-24", "свой брейкпоинт — 500px"],
            ["max-[500px]:hidden", "уже 500px — скрыть"],
            ["portrait:flex-col", "телефон вертикально"],
            ["print:hidden", "не печатать"],
          ]}
        />
      </Part>

      <Part
        id="mobile"
        title="Mobile-first"
        lead={
          <>
            Сначала стиль для телефона — без префикса. Потом <Code>md:</Code> и{" "}
            <Code>lg:</Code> уточняют его на широких экранах. Так не нужно
            перебивать телефонные стили и меньше классов.
          </>
        }
      >
        <Example
          title="p-12 md:p-24 lg:p-40"
          code={`<div className="p-12 md:p-24 lg:p-40 border br-lg">
  Поля растут вместе с экраном
</div>`}
        >
          <div className="p-12 md:p-24 lg:p-40 br-lg border bg-surface text-center font-13 font-w-600">
            Поля растут вместе с экраном
          </div>
        </Example>
      </Part>

      <Part
        id="max"
        title="max- и диапазоны"
        lead={
          <>
            <Code>max-md:</Code> — от нуля до 770px, <Code>max-sm:</Code> — уже
            620px. Диапазон собирается из двух вариантов:{" "}
            <Code>md:max-lg:</Code> работает только от 770 до 990px.
          </>
        }
      >
        <Example
          title="max-sm:hidden и md:max-lg:opacity-50"
          code={`<span className="max-sm:hidden">Видно с 620px</span>
<span className="md:max-lg:opacity-50">Между 770 и 990px</span>`}
        >
          <div className="flex flex-wrap items-center gap-10 font-13 font-w-600">
            <span className="px-12 py-6 br-full bg-secondary/12 text-secondary max-sm:hidden">
              Видно с 620px
            </span>
            <span className="px-12 py-6 br-full bg-primary text-primary-foreground md:max-lg:opacity-50">
              Между 770 и 990px
            </span>
          </div>
        </Example>
      </Part>

      <Part
        id="phone"
        title="Телефон"
        lead={
          <>
            Поля ввода — не меньше <Code>font-16</Code>, иначе iOS приближает
            страницу при фокусе. Касание — от 44px, а <Code>hover:</Code> уже
            работает только с мышью.
          </>
        }
      >
        <Example
          title="min-h-44 и font-16"
          code={`<button className="min-h-44 px-20">Кнопка</button>
<input className="h-44 px-12 font-16" placeholder="Поиск" />`}
        >
          <div className="flex flex-col gap-10 max-w-320">
            <input
              type="text"
              placeholder="Поиск"
              className="h-44 px-12 br-lg border bg-surface font-16"
            />
            <button
              type="button"
              className="min-h-44 px-20 br-full bg-primary text-primary-foreground font-14 font-w-600"
            >
              Кнопка — удобно нажимать
            </button>
          </div>
        </Example>
        <Callout tone="tip">
          Вырезу и полоске «Домой» — <Code>pt-safe</Code>, <Code>pb-safe</Code>,{" "}
          <Code>pl-safe</Code>, <Code>pr-safe</Code>: это{" "}
          <Code>env(safe-area-inset-*)</Code>.
        </Callout>
      </Part>

      <Part
        id="own"
        title="Свои брейкпоинты"
        lead={
          <>
            Свои границы — в <Code>rendit.config.mjs</Code>. Имя становится
            вариантом: <Code>xs:</Code>, <Code>3xl:</Code>.
          </>
        }
      >
        <CodeBlock
          file="rendit.config.mjs"
          code={`export default {
  screens: { xs: "480px", "3xl": "1600px" },
};`}
        />
        <Callout>
          Для ширины не окна, а родителя — контейнерные запросы:{" "}
          <Code>@container</Code> у родителя и <Code>@md:</Code> у детей. Они не
          зависят от окна и работают в колонках и карточках.
        </Callout>
      </Part>
    </ClassPage>
  );
}
