// Позиция: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — значок на карточке, слой на
// весь блок, центр через absolute, прилипающие заголовки (sticky), кнопка поверх страницы (fixed).

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { PositionBuilder } from "./_builder";
import { POSITION_CLASSES } from "./_classes";

const HREF = "/docs/scss/position";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "badge", title: "Значок на карточке" },
  { id: "overlay", title: "Слой на весь блок" },
  { id: "center", title: "Точно по центру" },
  { id: "sticky", title: "Прилипающие заголовки" },
  { id: "fixed", title: "Поверх страницы" },
];

export default async function PositionPage() {
  const css = await classCss(POSITION_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>relative</Code> у родителя + <Code>absolute</Code> у ребёнка — и
          ребёнка можно поставить в любой угол. <Code>sticky</Code> прилипает
          при прокрутке, <Code>fixed</Code> держится окна.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Метка внутри карточки: поменяйте её позицию, место и уберите relative у карточки — смещения начнут считаться от другого предка. Прокрутите блок, чтобы увидеть sticky и fixed."
        className="relative z-1"
      >
        <PositionBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Смещения <Code>top-</Code>, <Code>left-</Code>, <Code>inset-</Code>{" "}
            — на странице «Смещение», слои <Code>z-</Code> — «Наложение».
          </>
        }
      >
        <ClassTable
          rows={[
            ["static", "обычный поток, смещения не действуют"],
            ["relative", "на своём месте; опора для absolute внутри"],
            ["absolute", "вне потока, от ближайшего relative"],
            ["fixed", "вне потока, от окна"],
            ["sticky", "прилипает при прокрутке (нужен top-…)"],
          ]}
        />
      </Part>

      <Part
        id="badge"
        title="Значок на карточке"
        lead={
          <>
            Карточке — <Code>relative</Code>, значку —{" "}
            <Code>absolute -top-8 -right-8</Code>: отрицательные смещения
            выносят его за угол.
          </>
        }
      >
        <Example
          title="relative + absolute -top-8 -right-8"
          code={`<button class="relative">
  Корзина <span class="absolute -top-8 -right-8">3</span>
</button>`}
        >
          <button
            type="button"
            className="relative px-16 py-10 br-lg border bg-surface font-14 font-w-600"
          >
            Корзина
            <span className="absolute -top-8 -right-8 min-w-22 h-22 px-6 br-full bg-pink-500 text-white grid place-items-center font-11 font-w-700">
              3
            </span>
          </button>
        </Example>
      </Part>

      <Part
        id="overlay"
        title="Слой на весь блок"
        lead={
          <>
            <Code>absolute inset-0</Code> растягивает слой на весь родитель:
            затемнение картинки, подпись поверх, ссылка на всю карточку.
          </>
        }
      >
        <Example
          title="relative + absolute inset-0"
          code={`<figure class="relative">
  <img …>
  <figcaption class="absolute inset-0 flex items-end bg-[linear-gradient(transparent,rgb(0_0_0/0.6))]">…</figcaption>
</figure>`}
        >
          <figure className="relative h-180 max-w-360 br-lg overflow-hidden">
            {/* biome-ignore lint/performance/noImgElement: пример — обычный <img>, как в любом проекте */}
            <img
              src="/samples/landscape.svg"
              alt="Горы на закате"
              className="size-full object-cover"
            />
            <figcaption className="absolute inset-0 flex items-end p-14 bg-[linear-gradient(transparent,rgb(0_0_0/0.6))] text-white font-14 font-w-600">
              Подпись поверх картинки
            </figcaption>
          </figure>
        </Example>
      </Part>

      <Part
        id="center"
        title="Точно по центру"
        lead={
          <>
            <Code>top-1/2 left-1/2</Code> ставит угол элемента в центр, а{" "}
            <Code>-translate-x-1/2 -translate-y-1/2</Code> сдвигает на половину
            его же размера. Во flex и grid проще <Code>place-items-center</Code>
            .
          </>
        }
      >
        <Example
          title="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          code={`<span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">`}
        >
          <div className="relative h-140 br-lg border border-dashed">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-12 py-6 br-full bg-blue-500 text-white font-13 font-w-600">
              По центру
            </span>
          </div>
        </Example>
      </Part>

      <Part
        id="sticky"
        title="Прилипающие заголовки"
        lead={
          <>
            <Code>sticky top-0</Code> — заголовок группы прилипает, пока
            листаете её, и уступает место следующему. Так же — шапка таблицы и
            меню сбоку.
          </>
        }
      >
        <Example
          title="sticky top-0 в прокручиваемом списке"
          code={`<h3 class="sticky top-0 bg-surface">А</h3>`}
        >
          <div className="h-200 overflow-y-auto overscroll-contain br-lg border bg-surface font-13">
            {["А", "Б", "В"].map((letter) => (
              <section key={letter}>
                <h3 className="sticky top-0 px-12 py-6 bg-surface-muted font-12 font-w-700">
                  {letter}
                </h3>
                {[1, 2, 3, 4].map((n) => (
                  <p key={n} className="px-12 py-6 border-b">
                    {letter}-контакт {n}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="fixed"
        title="Поверх страницы"
        lead={
          <>
            <Code>fixed bottom-16 right-16</Code> — кнопка в углу окна, не
            уезжает при прокрутке. На телефоне добавьте отступ от полосы
            «Домой»:{" "}
            <Code>bottom-[calc(16px+env(safe-area-inset-bottom))]</Code>.
          </>
        }
      >
        <Example
          title="fixed bottom-16 right-16"
          note="В примере кнопка держится рамки, а не окна: у рамки transform — он становится опорой для fixed."
          code={`<button class="fixed bottom-16 right-16">Чат</button>`}
        >
          <div className="relative h-140 br-lg border border-dashed [transform:translateZ(0)]">
            <span className="fixed bottom-16 right-16 px-14 py-8 br-full bg-primary text-primary-foreground font-13 font-w-600 shadow-4">
              Чат
            </span>
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
