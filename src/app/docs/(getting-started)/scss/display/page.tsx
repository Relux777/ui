// Отображение: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — показать и спрятать по
// экрану, кнопка inline-flex, contents (обёртка без следа), hidden или invisible.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { DisplayBuilder } from "./_builder";
import { DISPLAY_CLASSES } from "./_classes";

const HREF = "/docs/scss/display";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "screens", title: "Показать по экрану" },
  { id: "inline-flex", title: "Кнопка с иконкой" },
  { id: "contents", title: "Обёртка без следа" },
  { id: "hidden", title: "hidden или invisible" },
];

const CHIP = "px-10 py-6 br-md bg-blue-500 text-white font-13 font-w-600";

export default async function DisplayPage() {
  const css = await classCss(DISPLAY_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>block</Code> — с новой строки, <Code>inline-block</Code> — в
          строку с текстом, <Code>flex</Code> и <Code>grid</Code> — контейнеры
          для раскладки, <Code>hidden</Code> — убрать. С брейкпоинтом — показать
          только на нужных экранах: <Code>max-sm:hidden</Code>.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите, как стоит контейнер с тремя детьми посреди текста, и на каких экранах его показывать. Поменяйте ширину окна — пример послушается."
        className="relative z-1"
      >
        <DisplayBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["block", "с новой строки, на всю ширину"],
            ["inline-block", "в строку, но со своими размерами"],
            ["inline", "в строку, как слово"],
            ["flex", "контейнер: дети в ряд"],
            ["inline-flex", "ряд, сам в строку: кнопки, метки"],
            ["grid", "контейнер: дети по сетке"],
            ["inline-grid", "сетка в строку"],
            ["flow-root", "блок, внутри которого не «вытекают» float"],
            ["contents", "обёртки нет, дети встают в родителя"],
            ["list-item", "как пункт списка, с маркером"],
            ["table", "как таблица"],
            ["hidden", "нет совсем"],
          ]}
        />
      </Part>

      <Part
        id="screens"
        title="Показать по экрану"
        lead={
          <>
            Брейкпоинты — mobile-first: <Code>sm:</Code> значит «с 620px».{" "}
            <Code>hidden sm:flex</Code> — спрятано на телефоне, с 620px — flex.{" "}
            <Code>sm:hidden</Code> — наоборот, только на телефоне.
          </>
        }
      >
        <Example
          title="hidden sm:flex и sm:hidden"
          note="Поменяйте ширину окна: на узком видна одна строка, на широком — другая."
          code={`<nav class="hidden sm:flex">…</nav>
<button class="sm:hidden">Меню</button>`}
        >
          <div className="flex flex-col gap-8 font-13">
            <div className="hidden sm:flex gap-6">
              {["Главная", "Справка", "Блог"].map((t) => (
                <span key={t} className={CHIP}>
                  {t}
                </span>
              ))}
              <span className="self-center text-foreground-muted">
                — видно с 620px
              </span>
            </div>
            <div className="sm:hidden flex items-center gap-8">
              <span className={CHIP}>☰ Меню</span>
              <span className="text-foreground-muted">
                — только на телефоне
              </span>
            </div>
          </div>
        </Example>
      </Part>

      <Part
        id="inline-flex"
        title="Кнопка с иконкой"
        lead={
          <>
            <Code>inline-flex items-center gap-6</Code> — иконка и подпись в
            ряд, по центру, а сама кнопка стоит в строке с текстом.
          </>
        }
      >
        <Example
          title="inline-flex items-center gap-6"
          code={`<a class="inline-flex items-center gap-6">Скачать <svg>…</svg></a>`}
        >
          <p className="font-14 text-foreground-muted">
            Готовый CSS можно{" "}
            <span className="inline-flex items-center gap-6 px-10 py-2 br-full bg-secondary/12 text-secondary font-w-600">
              скачать ↓
            </span>{" "}
            одним файлом.
          </p>
        </Example>
      </Part>

      <Part
        id="contents"
        title="Обёртка без следа"
        lead={
          <>
            <Code>contents</Code> — обёртка остаётся в разметке (для логики,
            ссылки, группы), но для раскладки её нет: дети встают прямо в сетку
            родителя.
          </>
        }
      >
        <Example
          title="grid grid-cols-3 и обёртка contents"
          code={`<div class="grid grid-cols-3 gap-8">
  <div class="contents">  <span>1</span> <span>2</span>  </div>
  <span>3</span>
</div>`}
        >
          <div className="grid grid-cols-3 gap-8">
            <div className="contents">
              <span className={CHIP}>1 — в обёртке</span>
              <span className={CHIP}>2 — в обёртке</span>
            </div>
            <span className={CHIP}>3</span>
          </div>
        </Example>
      </Part>

      <Part
        id="hidden"
        title="hidden или invisible"
        lead={
          <>
            <Code>hidden</Code> убирает блок вместе с местом.{" "}
            <Code>invisible</Code> прячет, но место остаётся — соседи не прыгают
            (подробнее — «Видимость»).
          </>
        }
      >
        <Example
          title="hidden и invisible у второго"
          code={`<span class="hidden">2</span>   <span class="invisible">2</span>`}
        >
          <div className="flex flex-col gap-10 font-12 text-foreground-muted">
            {(["hidden", "invisible"] as const).map((cls) => (
              <div key={cls} className="flex items-center gap-6">
                <span className="w-72">{cls}:</span>
                <span className={CHIP}>1</span>
                <span className={`${CHIP} ${cls}`}>2</span>
                <span className={CHIP}>3</span>
              </div>
            ))}
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
