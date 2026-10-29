// Промежутки: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — промежутки в форме, разные
// по осям в сетке, space-y для текста статьи, почему gap лучше отступов у детей.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { GapBuilder } from "./_builder";
import { GAP_CLASSES } from "./_classes";

const HREF = "/docs/scss/gap";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "form", title: "Форма" },
  { id: "axes", title: "Разные по осям" },
  { id: "space", title: "Текст статьи" },
  { id: "why", title: "gap или отступы" },
];

const FIELD =
  "h-40 px-12 br-lg border bg-surface grid items-center font-13 text-foreground-subtle";

export default async function GapPage() {
  const css = await classCss(GAP_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>gap-12</Code> — 12px между детьми flex и grid,{" "}
          <Code>gap-x-</Code> и <Code>gap-y-</Code> — по осям отдельно.{" "}
          <Code>space-y-16</Code> — промежутки между обычными блоками, например
          абзацами.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Промежутки заштрихованы — видно, где они, и что у крайних детей лишнего отступа нет."
        className="relative z-1"
      >
        <GapBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["gap-12", "между детьми flex и grid, по обеим осям"],
            ["gap-x-24", "только между колонками"],
            ["gap-y-8", "только между строками"],
            ["space-x-12", "между соседями по горизонтали (без flex)"],
            ["space-y-16", "между соседями по вертикали"],
            ["-space-x-8", "соседи заходят друг на друга: аватары"],
          ]}
        />
      </Part>

      <Part
        id="form"
        title="Форма"
        lead={
          <>
            <Code>flex flex-col gap-12</Code> — поля формы на равном расстоянии;
            внутри поля подпись и ввод ближе друг к другу — <Code>gap-6</Code>.
            Так глаз видит, что к чему относится.
          </>
        }
      >
        <Example
          title="flex flex-col gap-12, внутри gap-6"
          code={`<form class="flex flex-col gap-12">
  <label class="flex flex-col gap-6">Имя <input></label>
  <label class="flex flex-col gap-6">Почта <input></label>
</form>`}
        >
          <div className="flex flex-col gap-12 max-w-320 font-13 font-w-600">
            {["Имя", "Почта"].map((t) => (
              <span key={t} className="flex flex-col gap-6">
                {t}
                <span className={FIELD}>…</span>
              </span>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="axes"
        title="Разные по осям"
        lead={
          <>
            В сетке карточек между колонками места нужно меньше, чем между
            строками с подписями: <Code>gap-x-12 gap-y-24</Code>.
          </>
        }
      >
        <Example
          title="grid grid-cols-3 gap-x-12 gap-y-24"
          code={`<ul class="grid grid-cols-3 gap-x-12 gap-y-24">`}
        >
          <ul className="grid grid-cols-3 gap-x-12 gap-y-24">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <li key={n} className="flex flex-col gap-6">
                <span className="aspect-video br-md bg-blue-500/80" />
                <span className="font-12 font-w-600">Фото {n}</span>
              </li>
            ))}
          </ul>
        </Example>
      </Part>

      <Part
        id="space"
        title="Текст статьи"
        lead={
          <>
            Абзацы и заголовки статьи — обычные блоки, не flex.{" "}
            <Code>space-y-12</Code> у обёртки ставит отступ между ними, а у
            первого сверху и последнего снизу — нет.
          </>
        }
      >
        <Example
          title="space-y-12"
          code={`<article class="space-y-12">
  <h2>…</h2> <p>…</p> <p>…</p>
</article>`}
        >
          <article className="space-y-12 max-w-480 font-14 text-foreground-muted">
            <h3 className="font-18 font-w-700 text-foreground">Заголовок</h3>
            <p>Первый абзац: между ним и заголовком — 12px.</p>
            <p>Второй абзац: и между абзацами тоже 12px, без лишних классов.</p>
          </article>
        </Example>
      </Part>

      <Part
        id="why"
        title="gap или отступы"
        lead={
          <>
            Отступ у каждого ребёнка (<Code>mb-12</Code>) оставляет лишние 12px
            у последнего, а при переносе строк — сбивается. <Code>gap</Code>{" "}
            ставит промежуток только между детьми, в любую сторону.
          </>
        }
      >
        <Example
          title="mr-8 у детей и gap-8 у родителя"
          code={`<div class="flex flex-wrap">  <span class="mr-8 mb-8">…</span>  </div>
<div class="flex flex-wrap gap-8">  <span>…</span>  </div>`}
        >
          <div className="flex flex-col gap-12 max-w-280">
            <div className="flex flex-wrap p-6 br-md border border-dashed">
              {["Один", "Два", "Три", "Четыре", "Пять"].map((t) => (
                <span
                  key={t}
                  className="mr-8 mb-8 px-10 py-4 br-full bg-blue-500 text-white font-12 font-w-600"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-8 p-6 br-md border border-dashed">
              {["Один", "Два", "Три", "Четыре", "Пять"].map((t) => (
                <span
                  key={t}
                  className="px-10 py-4 br-full bg-blue-500 text-white font-12 font-w-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Example>
      </Part>
    </ClassPage>
  );
}
