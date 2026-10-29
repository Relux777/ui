// Перенос и обрезка: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — название в карточке
// (truncate), описание в 2 строки (line-clamp), адрес-«колбаса», код и стихи как набраны (whitespace-pre-wrap),
// переносы по слогам в узкой колонке.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { WrapBuilder } from "./_builder";
import { WRAP_CLASSES } from "./_classes";

const HREF = "/docs/scss/wrap";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "truncate", title: "Название в одну строку" },
  { id: "clamp", title: "Описание в 2 строки" },
  { id: "long", title: "Длинный адрес" },
  { id: "pre", title: "Как набрано" },
  { id: "hyphens", title: "Переносы по слогам" },
];

export default async function WrapPage() {
  const css = await classCss(WRAP_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>truncate</Code> — одна строка с многоточием,{" "}
          <Code>line-clamp-2</Code> — две, <Code>whitespace-nowrap</Code> — без
          переноса, <Code>break-words</Code> — длинные адреса не вылезают из
          блока, <Code>hyphens-auto</Code> — переносы по слогам.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Длинный текст с адресом в узком блоке: выберите, обрезать его, ограничить строками или переносить, и сужайте блок."
        className="relative z-1"
      >
        <WrapBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["truncate", "одна строка, лишнее — многоточием"],
            ["line-clamp-2", "не больше N строк, дальше многоточие"],
            ["whitespace-nowrap", "без переноса строк"],
            [
              "whitespace-pre-wrap",
              "пробелы и переносы как набраны, длинное — переносится",
            ],
            ["whitespace-pre", "как набрано, без переноса — код"],
            [
              "whitespace-pre-line",
              "переносы как набраны, лишние пробелы схлопываются",
            ],
            ["break-words", "длинное слово переносится, если не влезает"],
            ["break-all", "переносится где угодно — для кода и хешей"],
            ["break-normal", "как обычно"],
            ["hyphens-auto", "переносы по слогам (нужен lang у страницы)"],
            ["hyphens-manual", "только там, где стоит &shy;"],
          ]}
        />
      </Part>

      <Part
        id="truncate"
        title="Название в одну строку"
        lead={
          <>
            Во flex-строке <Code>truncate</Code> работает вместе с{" "}
            <Code>min-w-0</Code> у родителя текста — иначе flex не даёт ему
            сжаться (подробно — «Ширина»).
          </>
        }
      >
        <Example
          title="min-w-0 + truncate"
          code={`<div class="flex items-center gap-10">
  <img class="size-36 shrink-0">
  <p class="min-w-0 truncate">…</p>
</div>`}
        >
          <div className="flex items-center gap-10 max-w-280 p-10 br-lg border bg-surface">
            <span className="size-36 shrink-0 br-md bg-blue-500" />
            <p className="min-w-0 truncate font-14 font-w-600">
              Презентация_RenDit_UI_финальная_версия_2.pdf
            </p>
          </div>
        </Example>
      </Part>

      <Part
        id="clamp"
        title="Описание в 2 строки"
        lead={
          <>
            Карточки товаров и статей: описание разной длины, а карточки — одной
            высоты. <Code>line-clamp-2</Code> обрежет после второй строки.
          </>
        }
      >
        <Example title="line-clamp-2" code={`<p class="line-clamp-2">…</p>`}>
          <div className="grid grid-cols-2 gap-10 max-w-420 font-13">
            {[
              "Короткое описание.",
              "Длинное описание товара: состав, размеры, уход, доставка, гарантия и всё остальное, что не влезет.",
            ].map((t) => (
              <article
                key={t}
                className="flex flex-col gap-4 p-10 br-lg border bg-surface"
              >
                <span className="font-14 font-w-600">Товар</span>
                <p className="line-clamp-2 text-foreground-muted">{t}</p>
              </article>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="long"
        title="Длинный адрес"
        lead={
          <>
            Адрес, почта или хеш без пробелов вылезают из блока и ломают
            раскладку на телефоне. <Code>break-words</Code> переносит их, только
            если не влезают; <Code>break-all</Code> — всегда, где угодно.
          </>
        }
      >
        <Example
          title="без класса и break-words"
          code={`<p class="break-words">https://…</p>`}
        >
          <div className="flex flex-col gap-8 max-w-240 font-13">
            {["", "break-words"].map((cls) => (
              <p
                key={cls || "none"}
                className={`${cls} p-8 br-md border border-dashed overflow-hidden`}
              >
                <code className="text-foreground-muted">
                  {cls || "без класса"}:
                </code>{" "}
                https://github.com/Relux777/ui/releases/latest/download/rendit-ui.zip
              </p>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="pre"
        title="Как набрано"
        lead={
          <>
            Стихи, адреса, текст из поля ввода — с переносами строк, как их
            набрали: <Code>whitespace-pre-wrap</Code>. Длинные строки всё равно
            переносятся по ширине.
          </>
        }
      >
        <Example
          title="whitespace-pre-wrap"
          code={`<p class="whitespace-pre-wrap">{text}</p>`}
        >
          <p className="whitespace-pre-wrap font-14 text-foreground-muted">
            {"Москва,\nул. Тверская, 1\nподъезд 2, этаж 5"}
          </p>
        </Example>
      </Part>

      <Part
        id="hyphens"
        title="Переносы по слогам"
        lead={
          <>
            В узкой колонке длинные русские слова оставляют дыры.{" "}
            <Code>hyphens-auto</Code> переносит их по слогам — у страницы должен
            быть язык: <Code>&lt;html lang="ru"&gt;</Code>.
          </>
        }
      >
        <Example
          title="hyphens-auto"
          code={`<html lang="ru"> … <p class="hyphens-auto">…</p>`}
        >
          <div className="grid grid-cols-2 gap-12 max-w-320 font-14">
            {["", "hyphens-auto"].map((cls) => (
              <p
                key={cls || "none"}
                lang="ru"
                className={`${cls} text-justify text-foreground-muted`}
              >
                Высокопроизводительная многофункциональная интернационализация
              </p>
            ))}
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
