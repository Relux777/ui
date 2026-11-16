// Сетка .row из RenDit SCSS: конструктор сверху, таблица классов движка, затем примеры — двенадцать
// колонок, смещение, промежутки по осям и почему .row удобнее ручного flex.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Callout, Code, CodeBlock, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { RowBuilder } from "./_builder";
import { ROW_CLASSES } from "./_classes";

const HREF = "/docs/scss/row";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "twelve", title: "Двенадцать колонок" },
  { id: "offset", title: "Смещение" },
  { id: "gutter", title: "Промежутки" },
  { id: "why", title: "Почему .row" },
];

const TILE =
  "grid place-items-center min-h-56 br-md bg-blue-500/15 border border-blue-500/30 font-12 font-w-600";

export default async function RowPage() {
  const css = await classCss(ROW_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>.row</Code> — ряд с переносом из RenDit SCSS, <Code>col-6</Code>{" "}
          — половина из 12, <Code>col-12 md:col-6 lg:col-4</Code> — колонки по
          брейкпоинтам. <Code>gutter-24</Code> задаёт промежутки,{" "}
          <Code>offset-2</Code> — сдвиг.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите, сколько колонок в ряду и какой промежуток. Ширина настоящая: на телефоне колонки складываются, на широком экране встают в ряд."
        className="relative z-1"
      >
        <RowBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            <Code>.row</Code> — из слоя layout, <Code>col-*</Code> и{" "}
            <Code>gutter-*</Code> — классы движка. Число колонок —{" "}
            <Code>1…12</Code>.
          </>
        }
      >
        <ClassTable
          rows={[
            ["col-12", "вся ширина — телефон"],
            ["col-6", "половина ряда"],
            ["col-4", "треть ряда"],
            ["col", "делит остаток поровну"],
            ["col-auto", "по ширине содержимого"],
            ["md:col-6", "с 770px — половина"],
            ["offset-2", "сдвиг на две колонки"],
            ["gutter-24", "промежутки по обеим осям"],
            ["gutter-x-24", "только между колонками"],
            ["gutter-y-16", "только между строками"],
            ["md:gutter-32", "промежуток по брейкпоинту"],
          ]}
        />
      </Part>

      <Part
        id="twelve"
        title="Двенадцать колонок"
        lead={
          <>
            Телефон — <Code>col-12</Code>, планшет — <Code>md:col-6</Code>,
            компьютер — <Code>lg:col-4</Code>. Сумма в ряду всегда 12.
          </>
        }
      >
        <Example
          title="col-12 md:col-6 lg:col-4"
          code={`<div className="row gutter-20">
  <div className="col-12 md:col-6 lg:col-4">1</div>
  <div className="col-12 md:col-6 lg:col-4">2</div>
  <div className="col-12 md:col-6 lg:col-4">3</div>
</div>`}
        >
          <div className="row gutter-20">
            {[1, 2, 3].map((n) => (
              <div key={n} className="col-12 md:col-6 lg:col-4">
                <div className={TILE}>{n}</div>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="offset"
        title="Смещение"
        lead={
          <>
            <Code>offset-N</Code> сдвигает колонку на N из 12:{" "}
            <Code>offset-2 col-8</Code> — по центру с полями по две колонки.
          </>
        }
      >
        <Example
          title="offset-2 col-8"
          code={`<div className="row gutter-20">
  <div className="offset-2 col-8">По центру</div>
</div>`}
        >
          <div className="row gutter-20">
            <div className="offset-2 col-8">
              <div className={TILE}>offset-2 col-8</div>
            </div>
          </div>
        </Example>
      </Part>

      <Part
        id="gutter"
        title="Промежутки"
        lead={
          <>
            <Code>gutter-24</Code> — поля колонок и между строками,{" "}
            <Code>gutter-x-</Code> и <Code>gutter-y-</Code> — по отдельности.
            Отрицательные поля ряда компенсируют края.
          </>
        }
      >
        <Example
          title="gutter-x-32 gutter-y-8"
          code={`<div className="row gutter-x-32 gutter-y-8">
  <div className="col-6">…</div>
  <div className="col-6">…</div>
  <div className="col-6">…</div>
  <div className="col-6">…</div>
</div>`}
        >
          <div className="row gutter-x-32 gutter-y-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="col-6">
                <div className={TILE}>{n}</div>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="why"
        title="Почему .row"
        lead={
          <>
            Ручной <Code>flex flex-wrap</Code> требует самому считать ширины и
            компенсировать поля. <Code>.row</Code> уже всё это делает, а классы
            ширины остаются такими же обычными классами движка.
          </>
        }
      >
        <CodeBlock
          file="src/assets/scss/layout/_grid.scss"
          code={`@layer layout {
  .row {
    --gutter-x: 20px;
    --gutter-y: 0px;
    display: flex;
    flex-wrap: wrap;
    row-gap: var(--gutter-y);
    margin-inline: calc(var(--gutter-x) / -2);

    > * {
      flex-shrink: 0;
      width: 100%;
      max-width: 100%;
      padding-inline: calc(var(--gutter-x) / 2);
    }
  }
}`}
        />
        <Callout>
          <Code>col-*</Code> и <Code>gutter-*</Code> — из слоя{" "}
          <Code>utilities</Code>, поэтому они сильнее базовых правил{" "}
          <Code>.row</Code> без <Code>!important</Code>. Для карточек без сетки
          проще <Code>grid</Code>.
        </Callout>
      </Part>
    </ClassPage>
  );
}
