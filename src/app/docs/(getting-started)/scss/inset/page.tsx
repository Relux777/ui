// Смещение: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — растянуть между сторонами,
// вынести за край (отрицательные), проценты, start/end для письма справа налево, свои значения.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { InsetBuilder } from "./_builder";
import { INSET_CLASSES } from "./_classes";

const HREF = "/docs/scss/inset";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "stretch", title: "Растянуть" },
  { id: "negative", title: "За край" },
  { id: "start-end", title: "start и end" },
  { id: "custom", title: "Свои значения" },
];

const AREA = "relative h-120 br-lg border-2 border-dashed border-blue-400";
const BLOCK =
  "grid place-items-center px-10 br-md bg-pink-500 text-white font-12 font-w-700";

export default async function InsetPage() {
  const css = await classCss(INSET_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>top-16</Code>, <Code>right-0</Code>, <Code>inset-0</Code> — где
          встать элементу с <Code>absolute</Code>, <Code>fixed</Code> или{" "}
          <Code>sticky</Code>. Числа — пиксели, дроби — проценты, минус —
          наружу.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Задайте смещение каждой стороне: с одной — блок сдвигается, с двух противоположных — растягивается между ними."
        className="relative z-1"
      >
        <InsetBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["top-0", "к верху родителя"],
            ["top-16", "16px от верха"],
            ["top-1/2", "50% высоты родителя"],
            ["-top-12", "12px наружу"],
            ["right-0", "к правому краю"],
            ["bottom-0", "к низу"],
            ["left-0", "к левому краю"],
            ["inset-0", "все четыре стороны: на весь родитель"],
            ["inset-x-0", "слева и справа: во всю ширину"],
            ["inset-y-0", "сверху и снизу: во всю высоту"],
            ["start-0", "к началу строки (слева, а в арабском — справа)"],
            ["end-0", "к концу строки"],
            ["top-auto", "сбросить"],
            ["top-[calc(100%+8px)]", "своё значение: под родителем"],
          ]}
        />
      </Part>

      <Part
        id="stretch"
        title="Растянуть"
        lead={
          <>
            Две противоположные стороны — и ширина или высота не нужна:{" "}
            <Code>inset-x-0 bottom-0</Code> — полоса снизу,{" "}
            <Code>inset-y-0 right-0 w-80</Code> — колонка справа.
          </>
        }
      >
        <Example
          title="inset-x-0 bottom-0 и inset-y-0 right-0"
          code={`<div class="absolute inset-x-0 bottom-0 h-32">  <div class="absolute inset-y-0 right-0 w-80">`}
        >
          <div className={AREA}>
            <span className={`absolute inset-x-0 bottom-0 h-32 ${BLOCK}`}>
              inset-x-0 bottom-0
            </span>
            <span
              className={`absolute inset-y-0 right-0 w-80 ${BLOCK} bg-violet-500`}
            >
              inset-y-0
            </span>
          </div>
        </Example>
      </Part>

      <Part
        id="negative"
        title="За край"
        lead={
          <>
            Минус перед классом — наружу: <Code>-top-8 -right-8</Code> выносит
            значок за угол, <Code>-bottom-12</Code> — подсказку под блок.
          </>
        }
      >
        <Example
          title="-top-8 -right-8"
          code={`<span class="absolute -top-8 -right-8">`}
        >
          <div className="p-12">
            <div className={`${AREA} max-w-240`}>
              <span
                className={`absolute -top-8 -right-8 size-24 br-full ${BLOCK} p-0`}
              >
                5
              </span>
            </div>
          </div>
        </Example>
      </Part>

      <Part
        id="start-end"
        title="start и end"
        lead={
          <>
            <Code>start-</Code> и <Code>end-</Code> — смещения по направлению
            текста: в русском <Code>start</Code> — слева, в арабском и иврите —
            справа. Компонент для всех языков — с ними.
          </>
        }
      >
        <Example
          title="start-8 в обычном тексте и в dir=rtl"
          code={`<span class="absolute start-8">   <div dir="rtl"> … <span class="absolute start-8">`}
        >
          <div className="grid grid-cols-2 gap-10">
            {(["ltr", "rtl"] as const).map((dir) => (
              <div key={dir} dir={dir} className={AREA}>
                <span className={`absolute top-8 start-8 h-28 ${BLOCK}`}>
                  start-8 · {dir}
                </span>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="custom"
        title="Свои значения"
        lead={
          <>
            Выпадающая панель ровно под кнопкой с зазором 8px —{" "}
            <Code>top-[calc(100%+8px)]</Code>.
          </>
        }
      >
        <Example
          title="top-[calc(100%+8px)]"
          code={`<div class="relative">
  <button>Меню</button>
  <ul class="absolute top-[calc(100%+8px)] left-0">…</ul>
</div>`}
        >
          {/* снизу — место под панель: она вне потока и высоту примера не добавляет */}
          <div className="pb-110">
            <div className="relative w-fit">
              <span className="block px-14 py-8 br-full border bg-surface font-13 font-w-600">
                Меню ▾
              </span>
              <span className="absolute top-[calc(100%+8px)] left-0 flex flex-col gap-2 w-160 p-4 br-lg border bg-surface shadow-4 font-12">
                <span className="px-8 py-5 br-md bg-foreground/5">Профиль</span>
                <span className="px-8 py-5">Настройки</span>
                <span className="px-8 py-5">Выйти</span>
              </span>
            </div>
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
