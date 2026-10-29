// Переполнение: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — ряд меток с прокруткой
// вбок, широкая таблица на телефоне, скругление с обрезкой, список в окне, который не прокручивает страницу.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { OverflowBuilder } from "./_builder";
import { OVERFLOW_CLASSES } from "./_classes";

const HREF = "/docs/scss/overflow";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "chips", title: "Ряд с прокруткой вбок" },
  { id: "table", title: "Широкая таблица" },
  { id: "rounded", title: "Скругление с обрезкой" },
  { id: "overscroll", title: "Прокрутка не уходит странице" },
];

const CHIPS = [
  "Все",
  "Кнопки",
  "Формы",
  "Окна",
  "Навигация",
  "Таблицы",
  "Карточки",
  "Анимации",
  "Иконки",
];

export default async function OverflowPage() {
  const css = await classCss(OVERFLOW_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          Что делать, если содержимое не влезло: <Code>overflow-hidden</Code> —
          обрезать, <Code>overflow-auto</Code> — прокручивать, по одной оси —{" "}
          <Code>overflow-x-auto</Code>. <Code>scrollbar-thin</Code> и{" "}
          <Code>scrollbar-none</Code> — какой будет полоса.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="В блоке больше, чем влезает: выберите, что делать с лишним, по какой оси и какой будет полоса прокрутки."
        className="relative z-1"
      >
        <OverflowBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["overflow-visible", "лишнее торчит наружу (по умолчанию)"],
            ["overflow-hidden", "обрезать"],
            ["overflow-clip", "обрезать без прокрутки вовсе"],
            ["overflow-auto", "прокрутка, когда нужно"],
            ["overflow-scroll", "полоса прокрутки всегда"],
            ["overflow-x-auto", "только по горизонтали"],
            ["overflow-y-auto", "только по вертикали"],
            ["overscroll-contain", "докрутили до края — страница не едет"],
            ["overscroll-none", "и без «резинки» на краю"],
            ["scrollbar-thin", "тонкая полоса"],
            ["scrollbar-none", "без полосы, прокрутка остаётся"],
          ]}
        />
      </Part>

      <Part
        id="chips"
        title="Ряд с прокруткой вбок"
        lead={
          <>
            Метки, вкладки, карточки в один ряд:{" "}
            <Code>flex overflow-x-auto</Code> + <Code>scrollbar-none</Code> — на
            телефоне листаются пальцем, полосы не видно. <Code>shrink-0</Code> у
            детей — чтобы не сжимались.
          </>
        }
      >
        <Example
          title="flex gap-8 overflow-x-auto scrollbar-none"
          code={`<nav class="flex gap-8 overflow-x-auto scrollbar-none">
  <a class="shrink-0">…</a>
</nav>`}
        >
          <nav className="flex gap-8 overflow-x-auto scrollbar-none">
            {CHIPS.map((c, i) => (
              <span
                key={c}
                className={`shrink-0 px-14 py-8 br-full font-13 font-w-600 ${i === 0 ? "bg-foreground text-background" : "bg-foreground/6"}`}
              >
                {c}
              </span>
            ))}
          </nav>
        </Example>
      </Part>

      <Part
        id="table"
        title="Широкая таблица"
        lead={
          <>
            Таблица не сожмётся на телефоне — обёртка{" "}
            <Code>overflow-x-auto</Code> прокручивает её вбок, а страница
            остаётся своей ширины.
          </>
        }
      >
        <Example
          title="overflow-x-auto вокруг table"
          code={`<div class="overflow-x-auto">
  <table class="min-w-560">…</table>
</div>`}
        >
          <div className="overflow-x-auto scrollbar-thin br-lg border">
            <table className="min-w-560 w-full font-13 [border-collapse:collapse]">
              <thead className="bg-surface-muted">
                <tr>
                  {["Тариф", "Цена", "Проекты", "Место", "Поддержка"].map(
                    (h) => (
                      <th key={h} className="px-12 py-8 text-left font-12">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Старт", "0 ₽", "1", "1 ГБ", "почта"],
                  ["Команда", "990 ₽", "10", "50 ГБ", "чат"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t">
                    {row.map((cell) => (
                      <td key={cell} className="px-12 py-8">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Example>
      </Part>

      <Part
        id="rounded"
        title="Скругление с обрезкой"
        lead={
          <>
            Картинка в карточке со скруглёнными углами торчит углами наружу.{" "}
            <Code>overflow-hidden</Code> у карточки срезает её по скруглению.
          </>
        }
      >
        <Example
          title="br-xl overflow-hidden"
          code={`<article class="br-xl overflow-hidden">
  <img class="w-full aspect-video object-cover" …>
</article>`}
        >
          <article className="max-w-280 br-xl border bg-surface overflow-hidden">
            {/* biome-ignore lint/performance/noImgElement: пример — обычный <img>, как в любом проекте */}
            <img
              src="/samples/landscape.svg"
              alt="Горы на закате"
              className="w-full aspect-video object-cover"
            />
            <p className="p-12 font-13 font-w-600">Углы картинки срезаны</p>
          </article>
        </Example>
      </Part>

      <Part
        id="overscroll"
        title="Прокрутка не уходит странице"
        lead={
          <>
            Докрутили список в окне до конца — и страница под ним поехала. Не
            поедет с <Code>overscroll-contain</Code>: так сделаны окна и меню
            этого сайта.
          </>
        }
      >
        <Example
          title="max-h-180 overflow-y-auto overscroll-contain"
          code={`<ul class="max-h-180 overflow-y-auto overscroll-contain">`}
        >
          <ul className="max-h-180 overflow-y-auto overscroll-contain scrollbar-thin br-lg border bg-surface font-13">
            {CHIPS.map((c) => (
              <li key={c} className="px-12 py-8 border-b last:border-b-0">
                {c}
              </li>
            ))}
          </ul>
        </Example>
      </Part>
    </ClassPage>
  );
}
