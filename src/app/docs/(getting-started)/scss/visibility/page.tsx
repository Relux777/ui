// Видимость: конструктор сверху (пять способов спрятать и чем они отличаются), таблица «класс → CSS» от движка,
// затем примеры — подпись для скринридера у кнопки-иконки, кнопка с загрузкой без прыжка ширины, isolate.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { VisibilityBuilder } from "./_builder";
import { VISIBILITY_CLASSES } from "./_classes";

const HREF = "/docs/scss/visibility";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "sr-only", title: "Подпись для скринридера" },
  { id: "loading", title: "Загрузка без прыжка" },
  { id: "isolate", title: "isolate" },
];

export default async function VisibilityPage() {
  const css = await classCss(VISIBILITY_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          Спрятать можно по-разному: <Code>invisible</Code> — место остаётся,{" "}
          <Code>hidden</Code> — нет ни места, ни элемента, <Code>sr-only</Code>{" "}
          — не видно глазами, но слышно скринридером.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Спрячьте вторую кнопку разными способами и сравните: остаётся ли место, нажимается ли она, читает ли её скринридер."
        className="relative z-1"
      >
        <VisibilityBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["visible", "видно (по умолчанию)"],
            ["invisible", "не видно, место остаётся, нажатия не ловит"],
            ["sr-only", "только для скринридера"],
            ["not-sr-only", "снова видно — например, на фокусе"],
            ["isolate", "свой контекст наложения (страница «Наложение»)"],
          ]}
        />
      </Part>

      <Part
        id="sr-only"
        title="Подпись для скринридера"
        lead={
          <>
            У кнопки-иконки нет текста — скринридер скажет просто «кнопка».{" "}
            <Code>sr-only</Code> добавляет подпись, которую не видно, но слышно.
            Ещё вариант — <Code>aria-label</Code>.
          </>
        }
      >
        <Example
          title="sr-only внутри кнопки-иконки"
          code={`<button>
  <svg aria-hidden="true">…</svg>
  <span class="sr-only">Удалить</span>
</button>`}
        >
          <button
            type="button"
            className="size-40 br-full grid place-items-center border bg-surface font-18"
          >
            <span aria-hidden="true">🗑</span>
            <span className="sr-only">Удалить</span>
          </button>
        </Example>
        <Example
          title="«Перейти к содержимому» — видно только с клавиатуры"
          note="Нажмите Tab на странице: ссылка появляется на фокусе (focus:not-sr-only)."
          code={`<a href="#main" class="sr-only focus:not-sr-only">Перейти к содержимому</a>`}
        >
          <a
            href="#classes"
            className="sr-only focus:not-sr-only inline-block px-14 py-8 br-full bg-primary text-primary-foreground font-13 font-w-600"
          >
            Перейти к таблице классов
          </a>
          <span className="font-13 text-foreground-muted">
            Ссылка здесь — нажмите Tab, чтобы увидеть.
          </span>
        </Example>
      </Part>

      <Part
        id="loading"
        title="Загрузка без прыжка"
        lead={
          <>
            Пока идёт загрузка, подпись кнопки — <Code>invisible</Code>, а
            поверх — крутилка. Место подписи остаётся, и кнопка не меняет
            ширину.
          </>
        }
      >
        <Example
          title="invisible у подписи, крутилка absolute"
          code={`<button class="relative">
  <span class="invisible">Сохранить изменения</span>
  <span class="absolute inset-0 grid place-items-center">…</span>
</button>`}
        >
          <div className="flex gap-10">
            <button
              type="button"
              className="relative h-40 px-16 br-full bg-primary text-primary-foreground font-13 font-w-600"
            >
              Сохранить изменения
            </button>
            <button
              type="button"
              className="relative h-40 px-16 br-full bg-primary text-primary-foreground font-13 font-w-600"
            >
              <span className="invisible">Сохранить изменения</span>
              <span className="absolute inset-0 grid place-items-center">
                <span className="size-18 br-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              </span>
            </button>
          </div>
        </Example>
      </Part>

      <Part
        id="isolate"
        title="isolate"
        lead={
          <>
            <Code>isolate</Code> не прячет, а отделяет: z-index детей не выходит
            за блок. Нужен вместе с <Code>-z-1</Code> у фона — иначе фон уйдёт
            под страницу (подробно — «Наложение»).
          </>
        }
      >
        <Example
          title="relative isolate + -z-1"
          code={`<div class="relative isolate">  <span class="absolute inset-0 -z-1">…</span>  </div>`}
        >
          <div className="relative isolate p-20 br-lg font-14 font-w-600">
            <span className="absolute inset-0 -z-1 br-lg bg-[linear-gradient(135deg,color-mix(in_oklab,var(--violet-400)_30%,transparent),color-mix(in_oklab,var(--lime-300)_30%,transparent))]" />
            Фон за текстом, внутри блока
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
