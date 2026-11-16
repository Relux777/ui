// Поля форм: конструктор сверху, таблица «класс → CSS» и примеры — цвет флажков и ползунков, курсор ввода,
// изменение размера, высота по тексту и своё оформление через appearance-none. Все классы в примерах написаны
// строками целиком — так их находит движок.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Callout, Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { FormsBuilder } from "./_builder";
import { FORMS_CLASSES } from "./_classes";

const HREF = "/docs/scss/forms";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "accent", title: "Флажки и ползунки" },
  { id: "caret", title: "Курсор ввода" },
  { id: "resize", title: "Изменение размера" },
  { id: "grow", title: "Высота по тексту" },
  { id: "custom", title: "Своё оформление" },
  { id: "phone", title: "Телефон" },
];

const INPUT =
  "h-40 px-12 br-md border bg-surface font-14 placeholder:text-foreground-subtle focus:border-secondary focus:outline-none";

export default async function FormsPage() {
  const css = await classCss(FORMS_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>accent-secondary</Code> красит флажки, переключатели и ползунки
          в цвет сайта, <Code>caret-*</Code> — курсор ввода,{" "}
          <Code>resize-y</Code> разрешает тянуть многострочное поле, а{" "}
          <Code>field-sizing-content</Code> растит его по тексту.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Меняйте цвет и поведение полей — в превью настоящие флажок, переключатель, ползунок, поле ввода и многострочное поле."
        className="relative z-1"
      >
        <FormsBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Цвет — из токенов: <Code>accent-accent</Code>,{" "}
            <Code>accent-secondary</Code>, <Code>accent-danger</Code>. Свой —{" "}
            <Code>accent-[#0d5ef5]</Code>.
          </>
        }
      >
        <ClassTable
          rows={[
            ["accent-secondary", "флажки, радио и ползунки в цвет secondary"],
            ["accent-accent", "в лаймовый акцент сайта"],
            ["accent-primary", "в цвет главных кнопок"],
            ["accent-danger", "в красный — ошибка или удаление"],
            ["accent-success", "в зелёный — готово"],
            ["accent-[#0d5ef5]", "свой цвет"],
            ["caret-secondary", "курсор ввода в цвет secondary"],
            ["caret-accent", "курсор ввода в лаймовый акцент"],
            ["caret-danger", "курсор ввода в красный"],
            ["caret-transparent", "скрыть курсор ввода"],
            ["resize-none", "запретить менять размер"],
            ["resize-y", "тянуть только по высоте"],
            ["field-sizing-content", "высота по содержимому"],
            ["appearance-none", "убрать оформление браузера"],
          ]}
        />
      </Part>

      <Part
        id="accent"
        title="Флажки и ползунки"
        lead={
          <>
            <Code>accent-*</Code> перекрашивает то, что рисует сам браузер:
            флажок, переключатель, ползунок и индикатор выполнения. Один класс —
            и они в цвет сайта, без своей разметки.
          </>
        }
      >
        <Example
          title="accent-secondary"
          code={`<input type="checkbox" defaultChecked className="size-18 accent-secondary" />
<input type="radio" defaultChecked className="size-18 accent-secondary" />
<input type="range" className="w-full accent-secondary" />`}
        >
          <div className="grid gap-12 sm:grid-cols-2">
            {[
              ["", "Как в браузере"],
              ["accent-secondary", "accent-secondary"],
            ].map(([accent, title]) => (
              <div
                key={title}
                className="flex flex-col gap-10 p-14 br-lg border bg-surface"
              >
                <span className="font-12 font-w-600 uppercase letter-s-4 text-foreground-muted">
                  {title}
                </span>
                <label className="flex items-center gap-8 font-14">
                  <input
                    type="checkbox"
                    defaultChecked
                    className={`size-18 ${accent}`}
                  />
                  Флажок
                </label>
                <label className="flex items-center gap-8 font-14">
                  <input
                    type="radio"
                    defaultChecked
                    className={`size-18 ${accent}`}
                  />
                  Переключатель
                </label>
                <input
                  type="range"
                  defaultValue={60}
                  aria-label="Ползунок"
                  className={`w-full ${accent}`}
                />
              </div>
            ))}
          </div>
        </Example>
        <Callout>
          <Code>accent-*</Code> работает только у полей, которые рисует браузер.
          Если флажок собран через <Code>appearance-none</Code>, цвет ставьте
          сами — <Code>checked:bg-secondary</Code>.
        </Callout>
      </Part>

      <Part
        id="caret"
        title="Курсор ввода"
        lead={
          <>
            <Code>caret-*</Code> меняет цвет мигающей палочки в поле. Нажмите на
            поле и начните печатать — цвет виден только в фокусе.
          </>
        }
      >
        <Example
          title="caret-secondary и caret-danger"
          code={`<input className="… caret-secondary" defaultValue="12 500 ₽" />
<input className="… caret-danger" defaultValue="Неверный адрес" />`}
        >
          <div className="grid gap-10 max-w-360">
            <label className="flex flex-col gap-6">
              <span className="font-13 font-w-600">Сумма</span>
              <input
                type="text"
                defaultValue="12 500 ₽"
                className={`${INPUT} caret-secondary`}
              />
            </label>
            <label className="flex flex-col gap-6">
              <span className="font-13 font-w-600">Ошибка в адресе</span>
              <input
                type="text"
                defaultValue="Неверный адрес"
                aria-invalid
                className={`${INPUT} border-danger caret-danger`}
              />
            </label>
          </div>
        </Example>
      </Part>

      <Part
        id="resize"
        title="Изменение размера"
        lead={
          <>
            У многострочного поля есть ручка в углу. <Code>resize-y</Code>{" "}
            оставляет только высоту, <Code>resize-none</Code> убирает ручку
            совсем — размер задаёт страница.
          </>
        }
      >
        <Example
          title="resize-y и resize-none"
          code={`<textarea className="… resize-y" />
<textarea className="… resize-none" />`}
        >
          <div className="grid gap-12 sm:grid-cols-2">
            {[
              ["resize-y", "resize-y — тяните за угол"],
              ["resize-none", "resize-none — размер задан"],
            ].map(([resize, title]) => (
              <label key={resize} className="flex flex-col gap-6">
                <span className="font-12 font-w-600 text-foreground-muted">
                  {title}
                </span>
                <textarea
                  rows={4}
                  defaultValue="Потяните за правый нижний угол — это поле меняет только высоту."
                  className={`w-full p-12 br-lg border bg-surface font-14 leading-20 ${resize}`}
                />
              </label>
            ))}
          </div>
        </Example>
        <Callout>
          На телефоне ручки изменения размера нет: поле должно быть удобным
          сразу, а <Code>resize-y</Code> — только дополнительная возможность на
          компьютере.
        </Callout>
      </Part>

      <Part
        id="grow"
        title="Высота по тексту"
        lead={
          <>
            <Code>field-sizing-content</Code> считает высоту поля по
            содержимому: оно растёт, пока вы печатаете. Вместе с{" "}
            <Code>resize-none</Code> и <Code>max-h-</Code> это заменяет ручной
            пересчёт высоты на JavaScript.
          </>
        }
      >
        <Example
          title="field-sizing-content"
          code={`<textarea
  rows={1}
  placeholder="Начните печатать — поле вырастет"
  className="field-sizing-content resize-none w-full min-h-44 max-h-160 p-12 br-lg border bg-surface font-14"
/>`}
        >
          <textarea
            rows={1}
            placeholder="Начните печатать — поле вырастет"
            className="field-sizing-content resize-none w-full max-w-360 min-h-44 max-h-160 p-12 br-lg border bg-surface font-14"
          />
        </Example>
        <Callout>
          Где браузер ещё не умеет <Code>field-sizing</Code>, поле останется
          обычным: задайте <Code>rows</Code> и <Code>min-h-</Code>, чтобы оно
          выглядело нормально и без этой возможности.
        </Callout>
      </Part>

      <Part
        id="custom"
        title="Своё оформление"
        lead={
          <>
            <Code>appearance-none</Code> убирает родной флажок — дальше его
            рисуют классы. Галочку показываем соседним элементом через{" "}
            <Code>peer-checked:</Code>.
          </>
        }
      >
        <Example
          title="appearance-none и peer-checked"
          code={`<label className="flex items-center gap-10 cursor-pointer select-none">
  <span className="relative grid place-items-center">
    <input
      type="checkbox"
      defaultChecked
      className="peer appearance-none size-20 br-sm border-2 border-border-strong bg-surface checked:border-secondary checked:bg-secondary"
    />
    <svg className="absolute inset-0 m-auto size-12 text-secondary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  </span>
  <span className="font-14">Своё оформление — appearance-none</span>
</label>`}
        >
          <label className="flex items-center gap-10 cursor-pointer select-none">
            <span className="relative grid place-items-center">
              <input
                type="checkbox"
                defaultChecked
                className="peer appearance-none size-20 br-sm border-2 border-border-strong bg-surface transition-colors checked:border-secondary checked:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              />
              <svg
                className="absolute inset-0 m-auto size-12 text-secondary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M5 12.5l4.2 4.2L19 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
              </svg>
            </span>
            <span className="font-14">Своё оформление — appearance-none</span>
          </label>
        </Example>
      </Part>

      <Part
        id="phone"
        title="Телефон"
        lead={
          <>
            Поле мельче 16px iOS Safari приближает при фокусе и ломает вёрстку.
            Держите <Code>font-16</Code> и высоту от 44px — палец попадает без
            прицеливания.
          </>
        }
      >
        <Example
          title="font-16 и h-44"
          code={`<label className="flex flex-col gap-6">
  <span className="font-13 font-w-600">Почта для чека</span>
  <input
    type="email"
    inputMode="email"
    autoComplete="email"
    placeholder="you@example.com"
    className="w-full max-w-360 h-44 px-12 br-lg border bg-surface font-16 placeholder:text-foreground-subtle focus:border-secondary focus:outline-none"
  />
</label>`}
        >
          <label className="flex flex-col gap-6 max-w-360">
            <span className="font-13 font-w-600">Почта для чека</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full h-44 px-12 br-lg border bg-surface font-16 placeholder:text-foreground-subtle focus:border-secondary focus:outline-none"
            />
          </label>
        </Example>
      </Part>
    </ClassPage>
  );
}
