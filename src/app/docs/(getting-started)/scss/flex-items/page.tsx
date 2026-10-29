// Flex-элементы: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — поле поиска забирает
// остаток, колонки поровну, иконка не сжимается, стартовая ширина basis, порядок на телефоне.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { FlexItemsBuilder } from "./_builder";
import { FLEX_ITEM_CLASSES } from "./_classes";

const HREF = "/docs/scss/flex-items";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "rest", title: "Забрать остаток" },
  { id: "equal", title: "Поровну" },
  { id: "basis", title: "Стартовая ширина" },
  { id: "order", title: "Порядок" },
];

const BOX =
  "grid place-items-center h-40 px-10 br-md bg-blue-500 text-white font-13 font-w-600";

export default async function FlexItemsPage() {
  const css = await classCss(FLEX_ITEM_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          Как дети flex делят место: <Code>flex-1</Code> — забирает остаток,{" "}
          <Code>shrink-0</Code> — не сжимается, <Code>basis-200</Code> —
          стартовая ширина, <Code>order-</Code> — порядок без перестановки в
          разметке.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Иконка, текст и кнопка в ряд: выберите каждому, как он делит место, и сужайте родителя — над каждым его ширина."
        className="relative z-1"
      >
        <FlexItemsBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["flex-1", "растёт и сжимается, стартует с нуля — делят поровну"],
            ["flex-auto", "растёт и сжимается от своей ширины"],
            ["flex-initial", "только сжимается (по умолчанию)"],
            ["flex-none", "своей ширины, не растёт и не сжимается"],
            ["grow", "растёт"],
            ["grow-0", "не растёт"],
            ["shrink", "сжимается"],
            ["shrink-0", "не сжимается"],
            ["basis-160", "стартовая ширина 160px"],
            ["basis-1/2", "стартовая ширина — половина"],
            ["order-first", "первым"],
            ["order-last", "последним"],
            ["order-1", "любой номер"],
          ]}
        />
      </Part>

      <Part
        id="rest"
        title="Забрать остаток"
        lead={
          <>
            Поле поиска тянется, кнопка — своей ширины: полю{" "}
            <Code>flex-1 min-w-0</Code>, кнопке ничего не нужно.
          </>
        }
      >
        <Example
          title="flex-1 min-w-0 у поля"
          code={`<form class="flex gap-8">
  <input class="flex-1 min-w-0">
  <button>Найти</button>
</form>`}
        >
          <div className="flex gap-8 max-w-420">
            <span className="flex-1 min-w-0 h-40 px-12 br-full border bg-surface grid items-center font-13 text-foreground-subtle">
              Поиск по справке
            </span>
            <span className={`${BOX} br-full`}>Найти</span>
          </div>
        </Example>
      </Part>

      <Part
        id="equal"
        title="Поровну"
        lead={
          <>
            <Code>flex-1</Code> у всех — одинаковая ширина, сколько бы ни было
            текста. У <Code>flex-auto</Code> длинный текст получает больше.
          </>
        }
      >
        <Example
          title="flex-1 и flex-auto"
          code={`<div class="flex gap-8">  <span class="flex-1">…</span> × 3  </div>`}
        >
          <div className="flex flex-col gap-8">
            {(["flex-1", "flex-auto"] as const).map((cls) => (
              <div key={cls} className="flex gap-8 font-12">
                {["Да", "Может быть", "Нет, спасибо, в другой раз"].map((t) => (
                  <span key={t} className={`${cls} ${BOX} text-center`}>
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="basis"
        title="Стартовая ширина"
        lead={
          <>
            <Code>basis-200 grow</Code> — карточки не уже 200px и растягиваются
            на свободное место; с <Code>flex-wrap</Code> переносятся, когда не
            влезают.
          </>
        }
      >
        <Example
          title="flex flex-wrap, basis-200 grow"
          code={`<div class="flex flex-wrap gap-8">
  <article class="basis-200 grow">…</article>
</div>`}
        >
          <div className="flex flex-wrap gap-8">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={`basis-200 grow ${BOX} h-56`}>
                Карточка {n}
              </span>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="order"
        title="Порядок"
        lead={
          <>
            На телефоне картинка над текстом, на компьютере — справа:{" "}
            <Code>order-first sm:order-last</Code>. В разметке порядок один —
            скринридер читает его, а глазами — как удобно.
          </>
        }
      >
        <Example
          title="flex flex-col sm:flex-row, order-first sm:order-last"
          code={`<div class="flex flex-col sm:flex-row gap-12">
  <p>…</p>
  <img class="order-first sm:order-last">
</div>`}
        >
          <div className="flex flex-col sm:flex-row gap-12 font-13">
            <span className="flex-1 p-12 br-lg border bg-surface text-foreground-muted">
              Текст первым в разметке.
            </span>
            <span className="order-first sm:order-last h-80 sm:w-160 br-lg bg-[linear-gradient(135deg,var(--violet-400),var(--pink-400))]" />
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
