// Высота: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — экран телефона (dvh), блок во
// всю высоту родителя, ограничения и прокрутка внутри, высота по содержимому, свои значения.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { HeightBuilder } from "./_builder";
import { HEIGHT_CLASSES } from "./_classes";

const HREF = "/docs/scss/height";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "screen", title: "Экран телефона" },
  { id: "full", title: "Во всю высоту" },
  { id: "scroll", title: "Прокрутка внутри" },
  { id: "content", title: "По содержимому" },
  { id: "custom", title: "Свои значения" },
];

const BOX =
  "flex items-center justify-center px-12 br-md bg-blue-500 text-white font-13 font-w-600";

export default async function HeightPage() {
  const css = await classCss(HEIGHT_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>h-48</Code> — 48px, <Code>h-full</Code> — во всю высоту
          родителя, <Code>h-dvh</Code> — во весь экран телефона.{" "}
          <Code>min-h-</Code> и <Code>max-h-</Code> держат высоту в рамках, а{" "}
          <Code>overflow-y-auto</Code> прокручивает то, что не влезло.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Задайте высоту, добавьте строк текста и посмотрите, что происходит: блок растёт, текст вылезает или появляется прокрутка."
        className="relative z-1"
      >
        <HeightBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Число — пиксели, любое. Для экрана лучше <Code>dvh</Code>, чем{" "}
            <Code>screen</Code>: на телефоне панель браузера то прячется, то
            появляется, и <Code>100vh</Code> оказывается выше видимой части.
          </>
        }
      >
        <ClassTable
          rows={[
            ["h-48", "любое число — пиксели"],
            ["h-1/2", "доля высоты родителя"],
            ["h-full", "во всю высоту родителя"],
            ["h-auto", "по содержимому (по умолчанию)"],
            ["h-fit", "по содержимому, не выше родителя"],
            ["h-screen", "высота окна (100vh)"],
            ["h-dvh", "видимая часть экрана телефона, меняется с панелью"],
            ["h-svh", "экран с открытой панелью браузера — самый низкий"],
            ["h-lvh", "экран со спрятанной панелью — самый высокий"],
            ["min-h-0", "разрешить сжиматься во flex и grid"],
            ["min-h-dvh", "страница не короче экрана"],
            ["min-h-full", "не ниже родителя"],
            ["max-h-200", "не выше 200px"],
            ["max-h-dvh", "не выше экрана — окна и меню"],
            ["max-h-none", "без ограничения"],
            ["h-[calc(100dvh-64px)]", "своё значение: экран минус шапка"],
          ]}
        />
      </Part>

      <Part
        id="screen"
        title="Экран телефона"
        lead={
          <>
            <Code>min-h-dvh</Code> на странице — подвал не поднимается на
            середину экрана, если текста мало. На телефоне это видимая часть без
            панели браузера, поэтому ничего не уезжает под неё.
          </>
        }
      >
        <Example
          title="min-h-dvh: подвал прижат к низу"
          code={`<body class="min-h-dvh flex flex-col">
  <main class="flex-1">…</main>
  <footer>…</footer>
</body>`}
        >
          <div className="flex flex-col h-240 br-lg border overflow-hidden font-13">
            <span className="px-12 py-8 border-b bg-surface font-w-600">
              Шапка
            </span>
            <span className="flex-1 p-12 text-foreground-muted">
              Мало текста — а подвал всё равно внизу.
            </span>
            <span className="px-12 py-8 border-t bg-surface-muted">Подвал</span>
          </div>
        </Example>
      </Part>

      <Part
        id="full"
        title="Во всю высоту"
        lead={
          <>
            <Code>h-full</Code> работает, только если у родителя есть высота. Во
            flex и grid проще: дети и так растягиваются по высоте ряда (
            <Code>items-stretch</Code>), а <Code>flex-1</Code> забирает остаток.
          </>
        }
      >
        <Example
          title="карточки одной высоты в ряду"
          code={`<div class="grid grid-cols-3 gap-12">
  <article class="flex flex-col">… <a class="mt-auto">…</a></article>
</div>`}
        >
          <div className="grid grid-cols-3 gap-10 font-13">
            {[
              "Коротко.",
              "Текст подлиннее, на две-три строки.",
              "Самый длинный текст в ряду, на несколько строк, — остальные карточки всё равно такой же высоты.",
            ].map((text) => (
              <div
                key={text}
                className="flex flex-col gap-8 p-12 br-lg border bg-surface"
              >
                <span className="text-foreground-muted">{text}</span>
                <span className="mt-auto font-w-600 text-secondary">
                  Подробнее →
                </span>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="scroll"
        title="Прокрутка внутри"
        lead={
          <>
            Список не должен растягивать окно: <Code>max-h-200</Code> +{" "}
            <Code>overflow-y-auto</Code> — выше 200px не растёт, остальное
            прокручивается. <Code>overscroll-contain</Code> — прокрутка не
            уходит странице.
          </>
        }
      >
        <Example
          title="max-h-200 overflow-y-auto"
          code={`<ul class="max-h-200 overflow-y-auto overscroll-contain">`}
        >
          <ul className="max-h-200 overflow-y-auto overscroll-contain br-lg border bg-surface font-13">
            {Array.from({ length: 12 }, (_, i) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: статичный список
                key={i}
                className="px-12 py-8 border-b last:border-b-0"
              >
                Пункт списка {i + 1}
              </li>
            ))}
          </ul>
        </Example>
      </Part>

      <Part
        id="content"
        title="По содержимому"
        lead={
          <>
            Чаще всего высоту не задают вовсе: блок сам растёт под текст.
            Задайте <Code>min-h-</Code>, если блок не должен быть ниже, —
            например, у кнопок и полей.
          </>
        }
      >
        <Example
          title="h-40 у кнопки и min-h-96 у поля"
          code={`<button class="h-40">  <textarea class="min-h-96">`}
        >
          <div className="flex flex-col gap-10 max-w-320">
            <button type="button" className={`${BOX} h-40 br-full`}>
              h-40
            </button>
            <span className="min-h-96 p-12 br-lg border bg-surface font-13 text-foreground-subtle">
              min-h-96: поле не ниже 96px, а с длинным текстом растёт
            </span>
          </div>
        </Example>
      </Part>

      <Part
        id="custom"
        title="Свои значения"
        lead={
          <>
            Экран минус шапка — <Code>h-[calc(100dvh-64px)]</Code>, высота по
            ширине — лучше <Code>aspect-</Code> (страница «Пропорции»).
          </>
        }
      >
        <Example
          title="h-[calc(100%-32px)]"
          code={`<div class="h-[calc(100%-32px)]">`}
        >
          <div className="h-160 p-8 br-lg [outline:1px_dashed_color-mix(in_oklab,var(--foreground)_30%,transparent)]">
            <div className={`${BOX} h-[calc(100%-32px)]`}>
              h-[calc(100%-32px)] — родитель минус 32px
            </div>
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
