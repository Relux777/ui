// Списки: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — маркеры в тексте статьи, шаги
// с номерами, список без маркеров (меню, карточки), свой маркер-галочка.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { ListsBuilder } from "./_builder";
import { LIST_CLASSES } from "./_classes";

const HREF = "/docs/scss/lists";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "article", title: "Список в статье" },
  { id: "steps", title: "Шаги с номерами" },
  { id: "menu", title: "Без маркеров" },
  { id: "check", title: "Свой маркер" },
];

export default async function ListsPage() {
  const css = await classCss(LIST_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          Сброс стилей RenDit убирает маркеры у всех списков: меню и карточки не
          нужно чистить. В тексте — <Code>list-disc</Code> или{" "}
          <Code>list-decimal</Code>, цвет маркера — <Code>marker:</Code>.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите маркер, где он стоит, его цвет и расстояние между пунктами."
        className="relative z-1"
      >
        <ListsBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["list-disc", "точки"],
            ["list-decimal", "номера 1, 2, 3"],
            ["list-none", "без маркеров"],
            ["list-outside", "маркер снаружи — нужен отступ слева"],
            ["list-inside", "маркер внутри строки"],
            ["marker:text-secondary", "цвет маркера"],
            ["marker:font-w-700", "жирные номера"],
            ["space-y-8", "расстояние между пунктами"],
          ]}
        />
      </Part>

      <Part
        id="article"
        title="Список в статье"
        lead={
          <>
            <Code>list-disc pl-20 space-y-6</Code>: отступ под маркер и воздух
            между пунктами; маркер приглушённым цветом —{" "}
            <Code>marker:text-foreground-subtle</Code>.
          </>
        }
      >
        <Example
          title="list-disc pl-20 space-y-6 marker:text-foreground-subtle"
          code={`<ul class="list-disc pl-20 space-y-6 marker:text-foreground-subtle">`}
        >
          <ul className="list-disc pl-20 space-y-6 marker:text-foreground-subtle font-14 max-w-420">
            <li>Классы пишутся прямо в разметке.</li>
            <li>Цвета берутся из токенов и сами меняются в тёмной теме.</li>
            <li>Движок собирает CSS только из найденных классов.</li>
          </ul>
        </Example>
      </Part>

      <Part
        id="steps"
        title="Шаги с номерами"
        lead={
          <>
            <Code>list-decimal</Code> и жирные номера цветом акцента —{" "}
            <Code>marker:font-w-700 marker:text-secondary</Code>.
          </>
        }
      >
        <Example
          title="list-decimal marker:font-w-700 marker:text-secondary"
          code={`<ol class="list-decimal pl-20 space-y-6 marker:font-w-700 marker:text-secondary">`}
        >
          <ol className="list-decimal pl-20 space-y-6 marker:font-w-700 marker:text-secondary font-14">
            <li>Скачайте архив.</li>
            <li>Подключите стили.</li>
            <li>Пишите классы.</li>
          </ol>
        </Example>
      </Part>

      <Part
        id="menu"
        title="Без маркеров"
        lead={
          <>
            Меню, карточки, плитки — тоже списки, но маркеры им не нужны: сброс
            уже убрал их. Пишите раскладку — <Code>flex</Code> или{" "}
            <Code>grid</Code>.
          </>
        }
      >
        <Example
          title="ul class=&quot;flex gap-6&quot;"
          code={`<ul class="flex gap-6">  <li><a>…</a></li>  </ul>`}
        >
          <ul className="flex gap-6 font-13 font-w-600">
            {["Главная", "Справка", "Блог"].map((t) => (
              <li key={t} className="px-12 py-6 br-full bg-foreground/6">
                {t}
              </li>
            ))}
          </ul>
        </Example>
      </Part>

      <Part
        id="check"
        title="Свой маркер"
        lead={
          <>
            Галочка вместо точки — свой элемент в пункте, а список без маркеров:{" "}
            <Code>flex gap-8</Code> у пункта и значок в начале.
          </>
        }
      >
        <Example
          title="li class=&quot;flex gap-8&quot; + значок"
          code={`<li class="flex gap-8"><span class="text-success">✓</span> …</li>`}
        >
          <ul className="flex flex-col gap-6 font-14">
            {["Тёмная тема", "Адаптив", "Без JavaScript"].map((t) => (
              <li key={t} className="flex gap-8">
                <span className="text-success font-w-700">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </Example>
      </Part>
    </ClassPage>
  );
}
