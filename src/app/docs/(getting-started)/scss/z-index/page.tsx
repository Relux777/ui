// Наложение: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — фон за содержимым (-z-1 +
// isolate), почему z-index «не работает» (контекст наложения), шкала слоёв сайта.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example, Table } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { ZBuilder } from "./_builder";
import { Z_CLASSES } from "./_classes";

const HREF = "/docs/scss/z-index";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "behind", title: "Фон за содержимым" },
  { id: "context", title: "Почему z не работает" },
  { id: "scale", title: "Шкала слоёв" },
];

export default async function ZIndexPage() {
  const css = await classCss(Z_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>z-10</Code> над <Code>z-0</Code>, <Code>-z-1</Code> — под
          соседями. Работает у элементов с позицией (<Code>relative</Code>,{" "}
          <Code>absolute</Code>…) и у детей flex и grid.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Три карточки заходят друг на друга: поменяйте им z- или нажмите на карточку — она поднимется наверх."
        className="relative z-1"
      >
        <ZBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["z-0", "свой слой на уровне 0"],
            ["z-1", "чуть выше соседей"],
            ["z-10", "выше z-0 … z-9"],
            ["z-50", "любое число"],
            ["-z-1", "под соседями (внутри своего контекста)"],
            ["z-auto", "без своего слоя (по умолчанию)"],
            ["isolate", "свой контекст наложения: z детей не выходит наружу"],
          ]}
        />
      </Part>

      <Part
        id="behind"
        title="Фон за содержимым"
        lead={
          <>
            Декоративный слой — <Code>absolute inset-0 -z-1</Code>, а родителю —{" "}
            <Code>isolate</Code>: без него слой ушёл бы под фон всей страницы и
            пропал.
          </>
        }
      >
        <Example
          title="isolate + -z-1"
          code={`<section class="relative isolate">
  <div class="absolute inset-0 -z-1 bg-[radial-gradient(…)]"></div>
  Текст поверх
</section>`}
        >
          <section className="relative isolate p-24 br-lg border overflow-hidden">
            <span className="absolute inset-0 -z-1 bg-[radial-gradient(60%_80%_at_20%_0%,color-mix(in_oklab,var(--violet-400)_35%,transparent),transparent)]" />
            <h3 className="font-18 font-w-700">Текст поверх свечения</h3>
            <p className="font-13 text-foreground-muted">
              Свечение — отдельный слой за текстом.
            </p>
          </section>
        </Example>
      </Part>

      <Part
        id="context"
        title="Почему z не работает"
        lead={
          <>
            z сравнивается только внутри одного контекста наложения. Его создают{" "}
            <Code>isolate</Code>, <Code>z-</Code> вместе с позицией,{" "}
            <Code>opacity</Code> меньше 1, <Code>transform</Code>,{" "}
            <Code>filter</Code>, <Code>backdrop-blur</Code>. Ребёнок с{" "}
            <Code>z-50</Code> внутри карточки с <Code>z-0</Code> не поднимется
            выше соседней карточки с <Code>z-10</Code>.
          </>
        }
      >
        <Example
          title="z-50 внутри z-0 ниже соседа с z-10"
          code={`<div class="relative z-0">  <span class="relative z-50">…</span>  </div>
<div class="relative z-10 -mt-24">…</div>`}
        >
          <div className="flex flex-col font-13 font-w-600 text-white">
            <div className="relative z-0 p-12 pb-32 br-lg bg-violet-500">
              Карточка z-0
              <span className="relative z-50 block w-fit mt-8 px-10 py-4 br-full bg-pink-500">
                ребёнок z-50
              </span>
            </div>
            <div className="relative z-10 -mt-24 ml-40 p-12 br-lg bg-blue-500 shadow-5">
              Соседка z-10 — всё равно сверху
            </div>
          </div>
        </Example>
      </Part>

      <Part
        id="scale"
        title="Шкала слоёв"
        lead="Числа удобно держать по шкале, чтобы не гадать, что над чем. Так на этом сайте:"
      >
        <Table
          head={["Слой", "Класс", "Что"]}
          rows={[
            ["Содержимое", <Code key="c">z-0 … z-1</Code>, "карточки, примеры"],
            [
              "Выпадающие",
              <Code key="c">z-20</Code>,
              "меню, подсказки, списки",
            ],
            [
              "Шапка и нижнее меню",
              <Code key="c">z-30</Code>,
              "прилипают к краям экрана",
            ],
            ["Окна", "—", "<dialog> в верхнем слое браузера, выше любого z"],
          ]}
        />
      </Part>
    </ClassPage>
  );
}
