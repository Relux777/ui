// Оформление: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — аккуратные ссылки
// (подчёркивание при наведении, отступ линии), старая цена зачёркнутой, подписи заглавными, курсив, цифры
// одной ширины.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { DecorationBuilder } from "./_builder";
import { DECORATION_CLASSES } from "./_classes";

const HREF = "/docs/scss/decoration";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "links", title: "Ссылки" },
  { id: "price", title: "Старая цена" },
  { id: "caps", title: "Подписи заглавными" },
  { id: "numbers", title: "Цифры одной ширины" },
];

export default async function DecorationPage() {
  const css = await classCss(DECORATION_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>underline</Code> и <Code>line-through</Code> — линия,{" "}
          <Code>decoration-wavy</Code>, <Code>decoration-2</Code>,{" "}
          <Code>decoration-secondary</Code> — её стиль, толщина и цвет,{" "}
          <Code>underline-offset-4</Code> — отступ от букв.{" "}
          <Code>uppercase</Code> и <Code>italic</Code> — регистр и курсив.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Соберите оформление ссылки: линия, её стиль, толщина, цвет и отступ, регистр и курсив."
        className="relative z-1"
      >
        <DecorationBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["underline", "подчеркнуть"],
            ["overline", "линия над текстом"],
            ["line-through", "зачеркнуть"],
            ["no-underline", "без линии"],
            ["decoration-wavy", "стиль: solid, dotted, dashed, wavy, double"],
            ["decoration-2", "толщина линии, px"],
            ["decoration-secondary", "цвет линии — любой цвет токенов"],
            ["decoration-foreground/30", "цвет с прозрачностью"],
            ["underline-offset-4", "отступ подчёркивания от букв"],
            ["uppercase", "ЗАГЛАВНЫМИ"],
            ["lowercase", "строчными"],
            ["capitalize", "Каждое Слово С Заглавной"],
            ["normal-case", "как написано"],
            ["italic", "курсив"],
            ["not-italic", "без курсива"],
            ["tabular-nums", "цифры одной ширины"],
          ]}
        />
      </Part>

      <Part
        id="links"
        title="Ссылки"
        lead={
          <>
            Тонкая линия с отступом читается легче, чем стандартная:{" "}
            <Code>underline decoration-foreground/30 underline-offset-4</Code>,
            а при наведении линия темнеет —{" "}
            <Code>hover:decoration-foreground</Code>.
          </>
        }
      >
        <Example
          title="underline decoration-foreground/30 underline-offset-4"
          code={`<a class="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground transition-colors">`}
        >
          <p className="font-15 text-foreground-muted">
            Подробнее — в{" "}
            <span className="underline decoration-foreground/30 underline-offset-4 text-foreground transition-colors hover:decoration-foreground cursor-pointer">
              справке по установке
            </span>
            .
          </p>
        </Example>
      </Part>

      <Part
        id="price"
        title="Старая цена"
        lead={
          <>
            Старая цена — <Code>line-through</Code> и приглушённым цветом, новая
            — крупно рядом.
          </>
        }
      >
        <Example
          title="line-through text-foreground-subtle"
          code={`<s class="line-through text-foreground-subtle">2 490 ₽</s> <b>1 990 ₽</b>`}
        >
          <p className="flex items-baseline gap-10">
            <span className="font-24 font-w-700">1 990 ₽</span>
            <span className="line-through text-foreground-subtle">2 490 ₽</span>
          </p>
        </Example>
      </Part>

      <Part
        id="caps"
        title="Подписи заглавными"
        lead={
          <>
            Мелкие подписи групп — <Code>uppercase</Code> с разрядкой (
            <Code>letter-s-6</Code>): заглавные без разрядки слипаются. Так
            сделаны заголовки групп в левом меню.
          </>
        }
      >
        <Example
          title="uppercase letter-s-6"
          code={`<h3 class="font-12 font-w-700 uppercase letter-s-6">Основы</h3>`}
        >
          <h3 className="font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
            Основы
          </h3>
        </Example>
      </Part>

      <Part
        id="numbers"
        title="Цифры одной ширины"
        lead={
          <>
            В таймерах и счётчиках цифры разной ширины «дрожат» при каждом
            изменении. <Code>tabular-nums</Code> делает их одинаковыми.
          </>
        }
      >
        <Example
          title="tabular-nums"
          code={`<span class="tabular-nums">01:11</span>`}
        >
          <div className="flex gap-24 font-28 font-w-700">
            <span className="flex flex-col">
              <span>01:11</span>
              <span>08:88</span>
              <code className="font-11 font-w-500 text-foreground-muted">
                обычные
              </code>
            </span>
            <span className="flex flex-col tabular-nums">
              <span>01:11</span>
              <span>08:88</span>
              <code className="font-11 font-w-500 text-foreground-muted">
                tabular-nums
              </code>
            </span>
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
