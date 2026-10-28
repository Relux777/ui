// Отступы и размеры: конструктор сверху, затем шкала, внутренние и внешние отступы по сторонам, центрирование,
// отрицательные отступы, промежутки gap, ширина и высота, ограничения min/max, отступы под экран.
// Все примеры — классы RenDit Code, написанные строками целиком.

import type { Metadata } from "next";
import {
  Code,
  DocHeader,
  Example,
  Heading,
  Lead,
} from "../../../../_docs/docs";
import { Toc, type TocItem } from "../../../../_docs/toc";
import { SpacingBuilder } from "./_builder";

export const metadata: Metadata = { title: "Отступы" };

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "scale", title: "Шкала" },
  { id: "padding", title: "Внутренние отступы" },
  { id: "margin", title: "Внешние отступы" },
  { id: "gap", title: "Промежутки" },
  { id: "size", title: "Ширина и высота" },
  { id: "limits", title: "Ограничения" },
  { id: "responsive", title: "Под экран" },
];

// шкала: класс и ширина полоски — строками целиком
const SCALE = [
  ["4", "w-4"],
  ["8", "w-8"],
  ["12", "w-12"],
  ["16", "w-16"],
  ["20", "w-20"],
  ["24", "w-24"],
  ["32", "w-32"],
  ["40", "w-40"],
  ["48", "w-48"],
  ["64", "w-64"],
];

const BOX = "br-md bg-blue-500 text-white font-12 font-w-600";
const AREA =
  "br-lg bg-[color-mix(in_oklab,var(--green-400)_22%,transparent)] [outline:1px_dashed_color-mix(in_oklab,var(--green-500)_50%,transparent)]";

export default function SpacingPage() {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["RenDit SCSS", "Отступы"]}
          title="Отступы"
          lead={
            <>
              Все числа — в пикселях: <Code>p-20</Code> — 20px внутри,{" "}
              <Code>m-16</Code> — 16px снаружи, <Code>gap-12</Code> — 12px между
              детьми. Соберите отступы в конструкторе — схема покажет, где
              какой.
            </>
          }
        />

        <section className="relative z-1 flex flex-col gap-16">
          <Heading id="builder">Конструктор</Heading>
          <Lead>
            Внешний отступ — оранжевым, внутренний — зелёным, промежутки между
            детьми — фиолетовым. Двигайте ползунки и копируйте классы.
          </Lead>
          <SpacingBuilder />
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="scale">Шкала</Heading>
          <Lead>
            Подойдёт любое число, но интерфейс выглядит ровнее, когда отступы
            кратны 4: 4, 8, 12, 16, 20, 24, 32…
          </Lead>
          <div className="flex flex-col gap-6 p-16 sm:p-20 br-xl border bg-surface shadow-1">
            {SCALE.map(([n, w]) => (
              <div key={n} className="flex items-center gap-14">
                <code className="w-48 shrink-0 font-12 font-mono text-foreground-muted">
                  {n}px
                </code>
                <span className={`h-14 br-xs bg-secondary ${w}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="padding">Внутренние отступы</Heading>
          <Lead>
            <Code>p-N</Code> — со всех сторон, <Code>px-N</Code> /{" "}
            <Code>py-N</Code> — по осям, <Code>pt</Code>, <Code>pr</Code>,{" "}
            <Code>pb</Code>, <Code>pl</Code> — по одной стороне.
          </Lead>
          <Example
            title="p, px, py, pt"
            code={`<div class="p-20">  <div class="px-32 py-12">  <div class="pt-32 pb-8">`}
          >
            <div className="grid sm:grid-cols-3 gap-12">
              {[
                ["p-20", "p-20"],
                ["px-32 py-12", "px-32 py-12"],
                ["pt-32 pb-8", "pt-32 pb-8"],
              ].map(([cls, label]) => (
                <div key={label} className={`${AREA} ${cls}`}>
                  <div className={`${BOX} grid place-items-center h-40`}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="margin">Внешние отступы</Heading>
          <Lead>
            <Code>m-N</Code> отодвигает элемент от соседей. <Code>mx-auto</Code>{" "}
            ставит блок по центру, отрицательный <Code>-mx-16</Code> —
            вытягивает его за поля родителя.
          </Lead>
          <Example
            title="mx-auto и отрицательный отступ"
            code={`<div class="max-w-240 mx-auto">  <div class="-mx-16">`}
          >
            <div className="flex flex-col gap-12">
              <div className="p-12 br-lg border border-dashed">
                <div className={`${BOX} max-w-240 mx-auto py-10 text-center`}>
                  max-w-240 mx-auto — по центру
                </div>
              </div>
              <div className="px-16 py-12 br-lg border border-dashed">
                <div className={`${BOX} -mx-16 py-10 text-center`}>
                  -mx-16 — за поля родителя
                </div>
              </div>
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="gap">Промежутки</Heading>
          <Lead>
            Между детьми flex и grid — <Code>gap-N</Code>, раздельно по осям —{" "}
            <Code>gap-x-N</Code> и <Code>gap-y-N</Code>. Лучше, чем отступы у
            каждого ребёнка: у крайних лишнего нет.
          </Lead>
          <Example
            title="gap-8, gap-24, gap-x-24 gap-y-8"
            code={`<div class="flex gap-8">  <div class="flex gap-24">  <div class="grid grid-cols-3 gap-x-24 gap-y-8">`}
          >
            <div className="flex flex-col gap-16">
              {["flex gap-8", "flex gap-24"].map((cls) => (
                <div key={cls} className={cls}>
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={`${BOX} flex-1 grid place-items-center h-36`}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              ))}
              <div className="grid grid-cols-3 gap-x-24 gap-y-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <span
                    key={n}
                    className={`${BOX} grid place-items-center h-32`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="size">Ширина и высота</Heading>
          <Lead>
            <Code>w-N</Code>, <Code>h-N</Code> — в пикселях, <Code>size-N</Code>{" "}
            — квадрат сразу. Слова: <Code>w-full</Code>, <Code>h-screen</Code>,{" "}
            <Code>h-dvh</Code> (высота экрана телефона без панелей браузера),{" "}
            <Code>w-fit</Code>, <Code>w-1/2</Code>.
          </Lead>
          <Example
            title="size, w-full, w-1/2, w-fit"
            code={`<span class="size-40">  <div class="w-full">  <div class="w-1/2">  <div class="w-fit">`}
          >
            <div className="flex flex-col gap-10">
              <div className="flex items-end gap-10">
                {["size-24", "size-32", "size-40", "size-56"].map((s) => (
                  <span key={s} className={`${BOX} ${s}`} />
                ))}
              </div>
              <div className={`${BOX} w-full py-8 px-12`}>w-full</div>
              <div className={`${BOX} w-1/2 py-8 px-12`}>w-1/2</div>
              <div className={`${BOX} w-fit py-8 px-12`}>
                w-fit — по содержимому
              </div>
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="limits">Ограничения</Heading>
          <Lead>
            <Code>max-w-N</Code> не даёт строке растянуться — абзацы удобно
            держать в 60–75 знаков (<Code>max-w-72ch</Code>).{" "}
            <Code>min-h-dvh</Code> — страница не короче экрана.
          </Lead>
          <Example
            title="max-w-480 и max-w-72ch"
            code={`<div class="max-w-480">  <p class="max-w-72ch">`}
          >
            <div className="flex flex-col gap-10">
              <div className={`${BOX} max-w-480 py-8 px-12`}>max-w-480</div>
              <p className="max-w-72ch font-14 text-foreground-muted">
                max-w-72ch: строка этого абзаца не длиннее 72 знаков — глазу не
                приходится далеко возвращаться к началу следующей строки, и
                длинный текст читается легче.
              </p>
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="responsive">Под экран</Heading>
          <Lead>
            На телефоне отступы меньше, на большом экране — больше: брейкпоинт
            префиксом. Поменяйте ширину окна — блок ниже подстроится.
          </Lead>
          <Example
            title="p-12 sm:p-24 lg:p-40"
            code={`<section class="p-12 sm:p-24 lg:p-40">`}
          >
            <div className={`${AREA} p-12 sm:p-24 lg:p-40`}>
              <div className={`${BOX} grid place-items-center h-40`}>
                p-12 → sm:p-24 → lg:p-40
              </div>
            </div>
          </Example>
        </section>
      </div>

      <aside className="max-xl:hidden">
        <div className="sticky top-80">
          <Toc items={TOC} />
        </div>
      </aside>
    </div>
  );
}
