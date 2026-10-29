// Выравнивание: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — центр одной строкой
// (place-items-center), подпись по линии текста (items-baseline), одна кнопка справа (ml-auto / justify-self-end),
// равные промежутки (justify-between / evenly).

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { AlignBuilder } from "./_builder";
import { ALIGN_CLASSES } from "./_classes";

const HREF = "/docs/scss/align";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "center", title: "По центру одной строкой" },
  { id: "baseline", title: "По линии текста" },
  { id: "one", title: "Один в сторону" },
  { id: "spread", title: "Равные промежутки" },
];

const DOT =
  "grid place-items-center size-40 br-md bg-blue-500 text-white font-13 font-w-700";

export default async function AlignPage() {
  const css = await classCss(ALIGN_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>justify-</Code> — вдоль ряда, <Code>items-</Code> — поперёк,{" "}
          <Code>self-</Code> — у одного ребёнка, <Code>content-</Code> — строки
          целиком, <Code>place-</Code> — обе оси сразу. Работает во flex и grid.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Пять детей во flex с переносом или в сетке: меняйте выравнивание вдоль, поперёк, строк целиком — и отдельно для розового."
        className="relative z-1"
      >
        <AlignBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["justify-start", "вдоль ряда: к началу"],
            ["justify-center", "по центру"],
            ["justify-between", "крайние к краям, промежутки поровну"],
            ["justify-around", "вокруг каждого поровну"],
            ["justify-evenly", "все промежутки равные"],
            ["items-start", "поперёк: к началу"],
            ["items-center", "поперёк: по центру"],
            ["items-stretch", "растянуть по высоте строки"],
            ["items-baseline", "по линии текста"],
            ["self-end", "один ребёнок — к концу"],
            ["content-between", "строки при переносе — к краям"],
            ["justify-items-center", "grid: внутри ячеек по центру"],
            ["justify-self-end", "grid: один — к концу ячейки"],
            ["place-items-center", "grid: по центру по обеим осям"],
            ["place-content-center", "вся сетка по центру"],
            ["place-self-center", "один — по центру ячейки"],
          ]}
        />
      </Part>

      <Part
        id="center"
        title="По центру одной строкой"
        lead={
          <>
            <Code>grid place-items-center</Code> — ребёнок ровно по центру. Так
            сделаны иконки в круглых кнопках по всему сайту.
          </>
        }
      >
        <Example
          title="grid place-items-center"
          code={`<button class="size-40 br-full grid place-items-center">…</button>`}
        >
          <div className="flex gap-10">
            <span className="size-48 br-full border bg-surface grid place-items-center font-18">
              ★
            </span>
            <span className="h-120 w-200 br-lg border border-dashed grid place-items-center font-13">
              по центру
            </span>
          </div>
        </Example>
      </Part>

      <Part
        id="baseline"
        title="По линии текста"
        lead={
          <>
            Цена крупно и подпись мелко: <Code>items-center</Code> ставит их
            середины на одну высоту, а <Code>items-baseline</Code> — сами буквы
            на одну линию. Так ровнее.
          </>
        }
      >
        <Example
          title="items-center и items-baseline"
          code={`<p class="flex items-baseline gap-6">`}
        >
          <div className="flex flex-col gap-8">
            {(["items-center", "items-baseline"] as const).map((cls) => (
              <p key={cls} className={`flex ${cls} gap-6`}>
                <span className="font-36 font-w-700">990 ₽</span>
                <span className="font-13 text-foreground-muted">в месяц</span>
                <code className="ml-auto font-11 text-foreground-subtle">
                  {cls}
                </code>
              </p>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="one"
        title="Один в сторону"
        lead={
          <>
            Во flex один ребёнок уходит вправо от <Code>ml-auto</Code> — он
            забирает свободное место. В grid — <Code>justify-self-end</Code>.
          </>
        }
      >
        <Example
          title="ml-auto во flex"
          code={`<nav class="flex gap-8">  <a>…</a> <a>…</a>  <a class="ml-auto">Войти</a>  </nav>`}
        >
          <nav className="flex gap-8 p-10 br-lg border bg-surface font-13">
            <span>Справка</span>
            <span>Блог</span>
            <span className="ml-auto font-w-600">Войти</span>
          </nav>
        </Example>
      </Part>

      <Part
        id="spread"
        title="Равные промежутки"
        lead={
          <>
            <Code>justify-between</Code> — крайние у краёв,{" "}
            <Code>justify-evenly</Code> — все промежутки, и у краёв тоже,
            одинаковые.
          </>
        }
      >
        <Example
          title="justify-between, justify-around, justify-evenly"
          code={`<div class="flex justify-between">`}
        >
          <div className="flex flex-col gap-8">
            {(
              ["justify-between", "justify-around", "justify-evenly"] as const
            ).map((cls) => (
              <div
                key={cls}
                className={`flex ${cls} p-6 br-lg border border-dashed`}
              >
                {[1, 2, 3].map((n) => (
                  <span key={n} className={DOT}>
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
