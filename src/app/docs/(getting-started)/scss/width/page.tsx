// Ширина: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — пиксели и доли, по содержимому,
// ограничения min- и max- (и min-w-0 для обрезки во flex), квадрат size-, ширина под экран, свои значения.
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
import { WidthBuilder } from "./_builder";
import { WIDTH_CLASSES } from "./_classes";

const HREF = "/docs/scss/width";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "px", title: "Пиксели и доли" },
  { id: "content", title: "По содержимому" },
  { id: "limits", title: "Ограничения" },
  { id: "min-w-0", title: "Обрезка во flex" },
  { id: "size", title: "Квадрат size-" },
  { id: "responsive", title: "Под экран" },
  { id: "custom", title: "Свои значения" },
];

const BOX =
  "flex items-center min-h-40 px-12 br-md bg-blue-500 text-white font-13 font-w-600";

export default async function WidthPage() {
  const css = await classCss(WIDTH_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>w-240</Code> — 240px, <Code>w-1/2</Code> — половина родителя,{" "}
          <Code>w-fit</Code> — по содержимому. <Code>min-w-</Code> и{" "}
          <Code>max-w-</Code> держат ширину в рамках, <Code>size-40</Code> —
          ширина и высота сразу.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите, как задать ширину, добавьте ограничения и поменяйте ширину родителя — над примером видно, сколько пикселей получилось."
        className="relative z-1"
      >
        <WidthBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Число — всегда пиксели, любое: <Code>w-37</Code> тоже работает. CSS
            в таблице пишет сам движок.
          </>
        }
      >
        <ClassTable
          rows={[
            ["w-0", "ширина 0"],
            ["w-240", "любое число — пиксели"],
            ["w-1/2", "доля родителя: 1/2, 1/3, 2/3, 1/4, 3/4…"],
            ["w-full", "во всю ширину родителя"],
            ["w-auto", "как решит браузер (по умолчанию)"],
            ["w-fit", "по содержимому, но не шире родителя"],
            ["w-min", "по самому длинному слову"],
            ["w-max", "в одну строку, хоть шире родителя"],
            ["w-screen", "во всю ширину окна"],
            ["w-dvw", "ширина экрана телефона"],
            ["w-72ch", "72 знака — удобная строка для чтения"],
            ["min-w-0", "разрешить сжиматься во flex и grid"],
            ["min-w-120", "не уже 120px"],
            ["min-w-full", "не уже родителя"],
            ["max-w-720", "не шире 720px"],
            ["max-w-full", "не шире родителя"],
            ["max-w-none", "без ограничения"],
            ["size-40", "ширина и высота 40px"],
            ["size-full", "во весь родитель"],
            ["w-[calc(100%-40px)]", "своё значение"],
          ]}
        />
      </Part>

      <Part
        id="px"
        title="Пиксели и доли"
        lead={
          <>
            Пиксели — для того, что не должно меняться (иконки, аватары, меню),
            доли — для колонок, которые растут вместе с родителем.
          </>
        }
      >
        <Example
          title="w-120, w-1/2, w-full"
          code={`<div class="w-120">  <div class="w-1/2">  <div class="w-full">`}
        >
          <div className="flex flex-col gap-8">
            <div className={`${BOX} w-120`}>w-120</div>
            <div className={`${BOX} w-1/2`}>w-1/2</div>
            <div className={`${BOX} w-full`}>w-full</div>
          </div>
        </Example>
      </Part>

      <Part
        id="content"
        title="По содержимому"
        lead={
          <>
            <Code>w-fit</Code> — блок обнимает содержимое (кнопки, метки),{" "}
            <Code>w-max</Code> — строка не переносится, <Code>w-min</Code> —
            переносится по каждому слову.
          </>
        }
      >
        <Example
          title="w-fit, w-max, w-min"
          code={`<div class="w-fit">  <div class="w-max">  <div class="w-min">`}
        >
          <div className="flex flex-col gap-8">
            <div className={`${BOX} w-fit`}>w-fit: по тексту</div>
            <div className={`${BOX} w-max`}>w-max: всё в одну строку</div>
            <div className={`${BOX} w-min py-8`}>
              w-min: по самому длинному слову
            </div>
          </div>
        </Example>
      </Part>

      <Part
        id="limits"
        title="Ограничения"
        lead={
          <>
            <Code>max-w-</Code> не даёт растянуться на широком экране,{" "}
            <Code>min-w-</Code> — сжаться на узком. Вместе с <Code>w-full</Code>
            : на телефоне во всю ширину, на компьютере не шире 360px.
          </>
        }
      >
        <Example
          title="w-full max-w-360 и min-w-160"
          code={`<form class="w-full max-w-360">  <button class="min-w-160">`}
        >
          <div className="flex flex-col gap-10">
            <div className="w-full max-w-360 flex flex-col gap-8 p-14 br-lg border bg-surface">
              <span className="font-13 font-w-600">Форма w-full max-w-360</span>
              <span className="h-36 br-md border bg-background" />
              <button
                type="button"
                className="self-start min-w-160 h-36 px-14 br-full bg-primary text-primary-foreground font-13 font-w-600"
              >
                OK — min-w-160
              </button>
            </div>
          </div>
        </Example>
      </Part>

      <Part
        id="min-w-0"
        title="Обрезка во flex"
        lead={
          <>
            Частая ловушка: длинный текст во flex не обрезается многоточием, а
            раздвигает блок. Элементы flex по умолчанию не уже содержимого —{" "}
            <Code>min-w-0</Code> разрешает им сжиматься, и <Code>truncate</Code>{" "}
            начинает работать.
          </>
        }
      >
        <Example
          title="без min-w-0 и с ним"
          code={`<div class="flex gap-10">
  <img class="size-36 shrink-0">
  <p class="min-w-0 truncate">…</p>
</div>`}
        >
          <div className="flex flex-col gap-10 max-w-320">
            {[
              ["truncate", "без min-w-0 — текст вылезает"],
              ["min-w-0 truncate", "с min-w-0 — многоточие"],
            ].map(([cls, title]) => (
              <div
                key={cls}
                className="flex items-center gap-10 p-10 br-lg border bg-surface overflow-hidden"
              >
                <span className="size-36 shrink-0 br-full bg-violet-400" />
                <span className="flex flex-col min-w-0">
                  <span className="font-12 text-foreground-muted">{title}</span>
                  <span className={`${cls} font-14 font-w-600`}>
                    Очень_длинное_название_файла_без_пробелов.png
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="size"
        title="Квадрат size-"
        lead={
          <>
            <Code>size-40</Code> = <Code>w-40 h-40</Code> одним классом: иконки,
            аватары, круглые кнопки (вместе с <Code>br-full</Code>).
          </>
        }
      >
        <Example
          title="size-24 … size-64"
          code={`<img class="size-40 br-full">`}
        >
          <div className="flex items-end gap-12">
            {["size-24", "size-32", "size-40", "size-48", "size-64"].map(
              (s) => (
                <span key={s} className="flex flex-col items-center gap-6">
                  <span
                    className={`${s} br-full bg-[linear-gradient(135deg,var(--violet-400),var(--pink-400))]`}
                  />
                  <code className="font-11 font-mono text-foreground-muted">
                    {s}
                  </code>
                </span>
              ),
            )}
          </div>
        </Example>
      </Part>

      <Part
        id="responsive"
        title="Под экран"
        lead={
          <>
            Ширина с брейкпоинтом: на телефоне карточки во всю ширину, с 620px —
            по две, с 990px — по три. Поменяйте ширину окна.
          </>
        }
      >
        <Example
          title="w-full sm:w-1/2 lg:w-1/3"
          code={`<div class="flex flex-wrap">
  <article class="w-full sm:w-1/2 lg:w-1/3 p-6">…</article>
</div>`}
        >
          <div className="flex flex-wrap -m-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full sm:w-1/2 lg:w-1/3 p-6">
                <div className={`${BOX} justify-center h-56`}>Карточка {n}</div>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="custom"
        title="Свои значения"
        lead={
          <>
            Что нет в шкале — в квадратных скобках, пробелы через <Code>_</Code>
            : <Code>w-[calc(100%-40px)]</Code>,{" "}
            <Code>w-[clamp(200px,50%,480px)]</Code>.
          </>
        }
      >
        <Example
          title="w-[calc(100%-40px)] и w-[clamp(200px,50%,480px)]"
          code={`<div class="w-[calc(100%-40px)]">  <div class="w-[clamp(200px,50%,480px)]">`}
        >
          <div className="flex flex-col gap-8">
            <div className={`${BOX} w-[calc(100%-40px)]`}>
              w-[calc(100%-40px)]
            </div>
            <div className={`${BOX} w-[clamp(200px,50%,480px)]`}>
              clamp: от 200 до 480px
            </div>
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
