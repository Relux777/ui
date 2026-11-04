// Состояния: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — наведение (только мышь,
// и через .group), фокус, нажатие, состояния атрибутами, формы, дети и соседи, before/after.
// Все классы в примерах написаны строками целиком — так их находит движок.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { StatesBuilder } from "./_builder";
import { STATE_CLASSES } from "./_classes";

const HREF = "/docs/scss/states";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "hover", title: "Наведение" },
  { id: "focus", title: "Фокус" },
  { id: "press", title: "Нажатие" },
  { id: "attrs", title: "Состояния атрибутами" },
  { id: "forms", title: "Формы" },
  { id: "siblings", title: "Дети и соседи" },
  { id: "before-after", title: "Перед и после" },
];

export default async function StatesPage() {
  const css = await classCss(STATE_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>hover:</Code>, <Code>active:</Code>, <Code>focus-visible:</Code>{" "}
          — состояния префиксами. <Code>hover:</Code> срабатывает только на
          устройствах с мышью, <Code>aria-[…]:</Code> и <Code>data-…:</Code> —
          по атрибутам, <Code>group-hover:</Code> и <Code>has-…:</Code> — по
          родителю и содержимому.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите «когда» — вариант-состояние, и «что применить» — вид. Превью показывает состояние по-настоящему: наводите, нажимайте Tab, выключайте флажки и атрибуты."
        className="relative z-1"
      >
        <StatesBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Вариант-состояние ставится перед любым классом: <Code>hover:</Code>,{" "}
            <Code>checked:</Code>, <Code>aria-[current=page]:</Code>,{" "}
            <Code>group-hover/card:</Code>… CSS в таблице пишет сам движок.
          </>
        }
      >
        <ClassTable
          rows={[
            ["hover:bg-primary", "наведение — только устройства с мышью"],
            ["hover:text-primary-foreground", "цвет текста при наведении"],
            ["focus-visible:outline-2", "кольцо фокуса — только с клавиатуры"],
            ["active:scale-95", "нажато — чуть меньше"],
            ["disabled:opacity-50", "заблокировано — полупрозрачно"],
            ["checked:accent-secondary", "выбранный флажок — в цвет сайта"],
            [
              "aria-[current=page]:text-secondary",
              "выбранное по aria-атрибуту",
            ],
            ["data-active:opacity-100", "по data-атрибуту: data-active"],
            [
              "group-hover:opacity-100",
              "наведение на родителя с классом group",
            ],
            ["group-hover/card:opacity-100", "именованная группа: group/card"],
            ["peer-checked:line-through", "сосед с классом peer выбран"],
            ["has-checked:border-secondary", "внутри есть выбранный флажок"],
            ["has-[>img]:p-0", "внутри картинка — без внутреннего отступа"],
            ["first:mt-0", "первый в списке — без отступа сверху"],
            ["last:border-b-0", "последнему — без нижней рамки"],
            ["odd:bg-surface-muted", "нечётные строки — серые"],
            ["even:bg-surface", "чётные — обычные"],
            ["empty:hidden", "пустой элемент скрыт"],
            ["open:bg-surface-muted", "details раскрыт"],
            [
              "placeholder-shown:border-secondary",
              "поле пустое, виден placeholder",
            ],
            ["invalid:border-danger", "значение не проходит проверку"],
            ["focus-within:border-secondary", "фокус на любом элементе внутри"],
            ["not-first:border-t", "все, кроме первого"],
            ["before:content-['→']", "стрелка перед текстом"],
            ["dark:bg-gray-900", "только в тёмной теме"],
          ]}
        />
      </Part>

      <Part
        id="hover"
        title="Наведение"
        lead={
          <>
            <Code>hover:</Code> обёрнут в{" "}
            <Code>@media (hover: hover) and (pointer: fine)</Code> — на телефоне
            после касания ничего не «залипает». Для интерактивного — переход:{" "}
            <Code>transition-colors</Code>.
          </>
        }
      >
        <Example
          title="hover:bg-secondary hover:text-secondary-foreground"
          code={`<button class="bg-primary text-primary-foreground transition-colors
  hover:bg-secondary hover:text-secondary-foreground">`}
        >
          <button
            type="button"
            className="h-40 px-20 br-full bg-primary text-primary-foreground font-14 font-w-600 transition-colors duration-200 hover:bg-secondary hover:text-secondary-foreground motion-reduce:transition-none"
          >
            Наведите курсор
          </button>
        </Example>
        <Example
          title="group-hover:opacity-100 — по наведению на родителя"
          note="У родителя — класс group, у элемента — групповой вариант. Наведите на карточку, а не на текст."
          code={`<div class="group p-20">
  <span class="opacity-0 transition-opacity group-hover:opacity-100">→</span>
</div>`}
        >
          <div className="group flex items-center justify-center h-80 br-lg border bg-surface cursor-pointer">
            <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 font-14 font-w-600 text-secondary motion-reduce:transition-none">
              Появляется при наведении на карточку
            </span>
          </div>
        </Example>
      </Part>

      <Part
        id="focus"
        title="Фокус"
        lead={
          <>
            <Code>focus-visible:</Code> — фокус только с клавиатуры, мышью
            кольцо не появляется. <Code>focus-within:</Code> — когда фокус на
            любом элементе внутри: так подсвечивается всё поле, а не только само{" "}
            <Code>&lt;input&gt;</Code>.
          </>
        }
      >
        <Example
          title="focus-visible:outline-offset-4 focus-visible:outline-secondary"
          note="Нажмите Tab — кольцо появится; клик мышью кольца не даст."
          code={`<button class="focus-visible:outline-offset-4 focus-visible:outline-secondary">`}
        >
          <button
            type="button"
            className="h-40 px-20 br-full bg-surface-muted font-14 font-w-600 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            Нажмите Tab
          </button>
        </Example>
        <Example
          title="focus-within:border-secondary"
          code={`<label class="border transition-colors focus-within:border-secondary">
  <input>
</label>`}
        >
          <label className="flex items-center gap-8 h-44 px-12 br-lg border bg-surface transition-colors focus-within:border-secondary cursor-text">
            <span className="font-12 text-foreground-muted">Поиск</span>
            <input
              type="text"
              placeholder="кликните в поле"
              className="flex-1 min-w-0 font-14 text-foreground"
            />
          </label>
        </Example>
      </Part>

      <Part
        id="press"
        title="Нажатие"
        lead={
          <>
            <Code>active:</Code> срабатывает и мышью, и пальцем — нажали, кнопка
            сжалась. Работает с <Code>transition-transform</Code> плавно.
          </>
        }
      >
        <Example
          title="active:scale-95"
          code={`<button class="transition-transform active:scale-95">`}
        >
          <button
            type="button"
            className="h-48 px-24 br-full bg-primary text-primary-foreground font-14 font-w-600 transition-transform duration-200 active:scale-95 motion-reduce:transition-none"
          >
            Нажмите и держите
          </button>
        </Example>
      </Part>

      <Part
        id="attrs"
        title="Состояния атрибутами"
        lead={
          <>
            Состояние, которое ставит не браузер, а разметка или скрипт, —
            атрибутом: <Code>aria-[current=page]:</Code>,{" "}
            <Code>data-[state=open]:</Code>. У <Code>&lt;details&gt;</Code>{" "}
            готовое состояние — <Code>open:</Code>.
          </>
        }
      >
        <Example
          title="aria-[current=page]:text-secondary"
          code={`<a aria-current="page" class="aria-[current=page]:text-secondary">`}
        >
          <nav className="flex gap-8">
            {["Установка", "Токены", "Цвета"].map((label, i) => (
              <a
                key={label}
                href="#attrs"
                aria-current={i === 1 ? "page" : undefined}
                className="px-12 py-6 br-full font-13 text-foreground-muted transition-colors hover:text-foreground aria-[current=page]:bg-secondary/12 aria-[current=page]:text-secondary"
              >
                {label}
              </a>
            ))}
          </nav>
        </Example>
        <Example
          title="data-[state=open]:bg-secondary"
          note="Атрибут ставит и снимает скрипт — класс реагирует сам."
          code={`<span data-state="open"
  class="data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground">`}
        >
          <span
            data-state="open"
            className="px-12 py-6 br-full bg-surface-muted font-13 font-w-600 data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground"
          >
            Открыто
          </span>
        </Example>
        <Example
          title="open:bg-surface-muted"
          code={`<details open class="open:bg-surface-muted">`}
        >
          <details
            open
            className="br-lg border bg-surface open:bg-surface-muted transition-colors"
          >
            <summary className="px-14 py-10 font-14 font-w-600 cursor-pointer">
              Что в коробке
            </summary>
            <p className="px-14 pb-12 font-13 text-foreground-muted">
              open: — пока details раскрыт. Закройте — фон вернётся.
            </p>
          </details>
        </Example>
      </Part>

      <Part
        id="forms"
        title="Формы"
        lead={
          <>
            У полей и флажков свои состояния: <Code>checked:</Code>,{" "}
            <Code>disabled:</Code>, <Code>invalid:</Code>,{" "}
            <Code>placeholder-shown:</Code>.
          </>
        }
      >
        <Example
          title="checked:accent-secondary"
          code={`<input type="checkbox" checked class="checked:accent-secondary">`}
        >
          <label className="flex items-center gap-10 font-14 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="size-22 checked:accent-secondary cursor-pointer"
            />
            Выключите — акцент станет стандартным
          </label>
        </Example>
        <Example
          title="disabled:opacity-50"
          code={`<button disabled class="disabled:opacity-50">`}
        >
          <button
            type="button"
            disabled
            className="h-40 px-20 br-full bg-primary text-primary-foreground font-14 font-w-600 disabled:opacity-50"
          >
            Недоступно
          </button>
        </Example>
        <Example
          title="invalid:border-danger"
          note="Поле type=email required — пустое или неверное значение даёт красную рамку."
          code={`<input type="email" required class="invalid:border-danger">`}
        >
          <input
            type="email"
            required
            placeholder="введите e-mail"
            className="h-40 px-12 br-lg border bg-surface font-14 invalid:border-danger"
          />
        </Example>
        <Example
          title="placeholder-shown:border-secondary"
          note="Начните печатать — placeholder исчезнет, и рамка вернётся к обычной."
          code={`<input placeholder="…" class="placeholder-shown:border-secondary">`}
        >
          <input
            type="text"
            placeholder="поле пустое — рамка вторичного цвета"
            className="h-40 px-12 br-lg border bg-surface font-14 transition-colors placeholder-shown:border-secondary"
          />
        </Example>
      </Part>

      <Part
        id="siblings"
        title="Дети и соседи"
        lead={
          <>
            Место в списке — <Code>first:</Code>, <Code>last:</Code>,{" "}
            <Code>odd:</Code>, <Code>even:</Code>, <Code>not-first:</Code>.
            Соседа видит <Code>peer-checked:</Code> (класс <Code>peer</Code> на
            флажке), содержимое — <Code>has-checked:</Code>.
          </>
        }
      >
        <Example
          title="last:border-b-0 — у последнего пункта нет нижней рамки"
          code={`<ul>
  <li class="border-b">…
  <li class="border-b last:border-b-0">`}
        >
          <ul className="flex flex-col br-lg border bg-surface overflow-hidden">
            {["Начало", "Цвета", "Тени"].map((label) => (
              <li
                key={label}
                className="px-12 py-10 border-b last:border-b-0 font-13 text-foreground-muted"
              >
                {label}
              </li>
            ))}
          </ul>
        </Example>
        <Example
          title="odd:bg-surface-muted — полосатые строки"
          code={`<li class="odd:bg-surface-muted">`}
        >
          <ul className="flex flex-col br-lg border bg-surface overflow-hidden">
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className="px-12 py-8 font-13 odd:bg-surface-muted">
                Строка {n}
              </li>
            ))}
          </ul>
        </Example>
        <Example
          title="peer-checked:line-through"
          note="Флажок с классом peer, текст — следом за ним."
          code={`<input type="checkbox" class="peer">
<span class="peer-checked:line-through peer-checked:text-foreground-muted">`}
        >
          <label className="flex items-center gap-10 font-15 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="peer size-22 accent-secondary cursor-pointer"
            />
            <span className="peer-checked:line-through peer-checked:text-foreground-muted transition-colors">
              Куплено
            </span>
          </label>
        </Example>
        <Example
          title="has-checked:border-secondary"
          note="Карточка реагирует на флажок внутри себя."
          code={`<label class="has-checked:border-secondary">
  <input type="checkbox">
</label>`}
        >
          <label className="flex items-center gap-10 min-h-44 px-12 br-lg border bg-surface font-14 font-w-600 cursor-pointer transition-colors has-checked:border-secondary">
            <input
              type="checkbox"
              defaultChecked
              className="size-22 accent-secondary cursor-pointer"
            />
            Отметьте меня
          </label>
        </Example>
        <Example
          title="not-first:ml-6 — отступ у всех, кроме первого"
          code={`<span class="not-first:ml-6">`}
        >
          <div className="flex flex-wrap items-center">
            {["Метка 1", "Метка 2", "Метка 3"].map((label) => (
              <span
                key={label}
                className="px-12 py-6 br-full bg-surface-muted font-13 not-first:ml-6"
              >
                {label}
              </span>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="before-after"
        title="Перед и после"
        lead={
          <>
            <Code>before:</Code> и <Code>after:</Code> подставляют{" "}
            <Code>content</Code> сами — стрелки и значки без лишней разметки.
            Пробел внутри — через <Code>_</Code>.
          </>
        }
      >
        <Example
          title="before:content-['→_'] и after:content-['_↗']"
          code={`<a class="before:content-['→_'] before:mr-6">Ссылка</a>
<a class="after:content-['_↗'] after:ml-6">Внешняя ссылка</a>`}
        >
          <div className="flex flex-col gap-10 font-14 font-w-600">
            <a
              href="#before-after"
              className="self-start text-secondary hover:underline before:content-['→_'] before:mr-6"
            >
              Ссылка со стрелкой
            </a>
            <a
              href="#before-after"
              className="self-start text-secondary hover:underline after:content-['_↗'] after:ml-6"
            >
              Внешняя ссылка
            </a>
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
