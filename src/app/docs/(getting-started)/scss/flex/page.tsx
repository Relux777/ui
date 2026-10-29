// Flex: конструктор сверху, таблица «класс → CSS» от движка, затем частые раскладки — шапка, строка списка,
// карточка с кнопкой внизу, всё по центру, метки с переносом, столбик на телефоне и ряд на компьютере.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { FlexBuilder } from "./_builder";
import { FLEX_CLASSES } from "./_classes";

const HREF = "/docs/scss/flex";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "header", title: "Шапка" },
  { id: "row", title: "Строка списка" },
  { id: "card", title: "Кнопка внизу карточки" },
  { id: "center", title: "Всё по центру" },
  { id: "wrap", title: "Метки с переносом" },
  { id: "responsive", title: "Столбик и ряд" },
];

const CHIP = "px-10 py-4 br-full bg-foreground/6 font-12 font-w-600";

export default async function FlexPage() {
  const css = await classCss(FLEX_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>flex</Code> ставит детей в ряд, <Code>flex-col</Code> — в
          столбик. <Code>justify-</Code> — где они вдоль ряда,{" "}
          <Code>items-</Code> — поперёк, <Code>gap-</Code> — промежуток между
          ними. Этого хватает на большую часть интерфейса.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Меняйте направление, выравнивание и перенос — дети разной высоты, поэтому видна разница между items-start, center, stretch и baseline."
        className="relative z-1"
      >
        <FlexBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Как делят место сами дети (<Code>flex-1</Code>,{" "}
            <Code>shrink-0</Code>) — «Flex-элементы», выравнивание подробно —
            «Выравнивание».
          </>
        }
      >
        <ClassTable
          rows={[
            ["flex", "контейнер, дети в ряд"],
            ["inline-flex", "то же, сам в строку с текстом"],
            ["flex-row", "в ряд (по умолчанию)"],
            ["flex-col", "в столбик"],
            ["flex-row-reverse", "в ряд справа налево"],
            ["flex-col-reverse", "в столбик снизу вверх"],
            ["flex-wrap", "не влезли — на новую строку"],
            ["flex-nowrap", "в одну строку (по умолчанию)"],
            ["justify-between", "первый у начала, последний у конца"],
            ["justify-center", "по центру ряда"],
            ["items-center", "по центру поперёк"],
            ["items-baseline", "по линии текста"],
            ["gap-12", "промежуток между детьми"],
          ]}
        />
      </Part>

      <Part
        id="header"
        title="Шапка"
        lead={
          <>
            <Code>flex items-center justify-between</Code> — логотип слева, меню
            справа, всё по одной линии.
          </>
        }
      >
        <Example
          title="flex items-center justify-between"
          code={`<header class="flex items-center justify-between">
  <a>Логотип</a>
  <nav class="flex gap-16">…</nav>
</header>`}
        >
          <div className="flex items-center justify-between px-14 py-10 br-lg border bg-surface font-13">
            <span className="font-16 font-w-700">RenDit</span>
            <nav className="flex gap-16 text-foreground-muted">
              <span>Справка</span>
              <span>Блог</span>
              <span className="text-foreground font-w-600">Войти</span>
            </nav>
          </div>
        </Example>
      </Part>

      <Part
        id="row"
        title="Строка списка"
        lead={
          <>
            Иконка, текст и кнопка: текст забирает остаток (
            <Code>flex-1 min-w-0</Code>) и обрезается многоточием, иконка и
            кнопка не сжимаются (<Code>shrink-0</Code>).
          </>
        }
      >
        <Example
          title="flex items-center gap-12, flex-1 min-w-0"
          code={`<li class="flex items-center gap-12">
  <img class="size-40 shrink-0">
  <div class="flex-1 min-w-0"><p class="truncate">…</p></div>
  <button class="shrink-0">…</button>
</li>`}
        >
          <div className="flex items-center gap-12 max-w-420 p-10 br-lg border bg-surface">
            <span className="size-40 shrink-0 br-full bg-violet-400" />
            <span className="flex-1 min-w-0 flex flex-col">
              <span className="truncate font-14 font-w-600">
                Отчёт за октябрь с длинным названием файла.pdf
              </span>
              <span className="font-12 text-foreground-muted">2,4 МБ</span>
            </span>
            <span className="shrink-0 px-12 py-6 br-full bg-foreground/6 font-12 font-w-600">
              Скачать
            </span>
          </div>
        </Example>
      </Part>

      <Part
        id="card"
        title="Кнопка внизу карточки"
        lead={
          <>
            Карточки разной длины в ряд, а кнопки — на одной линии: карточке{" "}
            <Code>flex flex-col</Code>, кнопке <Code>mt-auto</Code> — она
            забирает всё свободное место сверху.
          </>
        }
      >
        <Example
          title="flex flex-col + mt-auto"
          code={`<article class="flex flex-col gap-8">
  … <a class="mt-auto">Подробнее</a>
</article>`}
        >
          <div className="grid grid-cols-2 gap-10 max-w-420 font-13">
            {[
              "Коротко.",
              "Описание подлиннее, на три строки, — а кнопка всё равно внизу.",
            ].map((t) => (
              <article
                key={t}
                className="flex flex-col gap-8 p-12 br-lg border bg-surface"
              >
                <span className="text-foreground-muted">{t}</span>
                <span className="mt-auto font-w-600 text-secondary">
                  Подробнее →
                </span>
              </article>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="center"
        title="Всё по центру"
        lead={
          <>
            <Code>flex items-center justify-center</Code> — по центру по обеим
            осям. Короче — <Code>grid place-items-center</Code>.
          </>
        }
      >
        <Example
          title="flex items-center justify-center"
          code={`<div class="flex items-center justify-center h-160">`}
        >
          <div className="flex items-center justify-center h-160 br-lg border border-dashed">
            <span className="px-14 py-8 br-full bg-blue-500 text-white font-13 font-w-600">
              По центру
            </span>
          </div>
        </Example>
      </Part>

      <Part
        id="wrap"
        title="Метки с переносом"
        lead={
          <>
            <Code>flex flex-wrap gap-6</Code> — метки встают в ряд и
            переносятся, когда место кончилось; промежутки одинаковые и между
            строками.
          </>
        }
      >
        <Example
          title="flex flex-wrap gap-6"
          code={`<ul class="flex flex-wrap gap-6">`}
        >
          <ul className="flex flex-wrap gap-6 max-w-320">
            {[
              "Next.js",
              "React",
              "SCSS",
              "Тёмная тема",
              "Адаптив",
              "Анимации",
              "Доступность",
            ].map((t) => (
              <li key={t} className={CHIP}>
                {t}
              </li>
            ))}
          </ul>
        </Example>
      </Part>

      <Part
        id="responsive"
        title="Столбик и ряд"
        lead={
          <>
            На телефоне — столбиком, с 620px — в ряд:{" "}
            <Code>flex flex-col sm:flex-row</Code>. Поменяйте ширину окна.
          </>
        }
      >
        <Example
          title="flex flex-col sm:flex-row gap-10"
          code={`<div class="flex flex-col sm:flex-row gap-10">`}
        >
          <div className="flex flex-col sm:flex-row gap-10">
            {["Первый", "Второй", "Третий"].map((t) => (
              <span
                key={t}
                className="flex-1 grid place-items-center h-56 br-md bg-blue-500 text-white font-13 font-w-600"
              >
                {t}
              </span>
            ))}
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
