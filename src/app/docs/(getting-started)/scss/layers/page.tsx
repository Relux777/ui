// Слои каскада: порядок theme → reset → base → layout → components → utilities и почему класс всегда
// сильнее базовых стилей. Без конструктора: это правило проекта, а не набор классов.

import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import {
  Callout,
  Code,
  CodeBlock,
  Example,
  Table,
} from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";

const HREF = "/docs/scss/layers";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "order", title: "Порядок слоёв" },
  { id: "where", title: "Что куда" },
  { id: "stronger", title: "Класс сильнее" },
  { id: "own", title: "Свои стили" },
  { id: "why", title: "Зачем это нужно" },
];

const LAYERS = [
  ["theme", "Токены: цвета, тени, радиусы, кривые движения"],
  ["reset", "Обнуление: поля, списки, картинки, кнопки"],
  ["base", "Стили тегов: body, ссылки, заголовки, поля ввода"],
  ["layout", ".container и сетка .row"],
  ["components", "Готовые вещи RenDit SCSS: .liquid-glass, .sheet, .reveal"],
  ["utilities", "Классы RenDit Code — последний слой, самый сильный"],
];

export default function LayersPage() {
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          Весь CSS разложен по слоям <Code>@layer</Code>. Чем позже слой, тем он
          сильнее: класс из <Code>utilities</Code> перебивает компонент из{" "}
          <Code>components</Code> без <Code>!important</Code> и без повышения
          селектора.
        </>
      }
    >
      <Part
        id="order"
        title="Порядок слоёв"
        lead={
          <>
            Порядок задаётся одной строкой в{" "}
            <Code>src/assets/scss/_layers.scss</Code>. Он не зависит от того, в
            каком файле слой встретился первый раз.
          </>
        }
      >
        <CodeBlock
          file="src/assets/scss/_layers.scss"
          code={`@layer theme, reset, base, layout, components, utilities;`}
        />
        <ol className="flex flex-col gap-6">
          {LAYERS.map(([name, text], i) => (
            <li
              key={name}
              className="flex flex-wrap items-center gap-x-12 gap-y-4 px-14 py-10 br-lg border bg-surface font-14"
            >
              <span className="size-24 shrink-0 grid place-items-center br-full bg-foreground/5 font-11 font-w-700 tabular-nums text-foreground-muted">
                {i + 1}
              </span>
              <code className="font-mono font-13 font-w-600">{name}</code>
              <span className="text-foreground-muted">{text}</span>
            </li>
          ))}
        </ol>
      </Part>

      <Part id="where" title="Что куда">
        <Table
          head={["Слой", "Кто пишет", "Пример"]}
          rows={[
            [
              "theme",
              "settings/",
              <code key="a" className="font-mono font-12">
                --accent
              </code>,
            ],
            ["reset", "generic/_reset", "margin: 0"],
            ["base", "generic/_base", "body, a, h1"],
            [
              "layout",
              "layout/",
              <code key="b" className="font-mono font-12">
                .container, .row
              </code>,
            ],
            [
              "components",
              "components/",
              <code key="c" className="font-mono font-12">
                .liquid-glass
              </code>,
            ],
            [
              "utilities",
              "RenDit Code",
              <code key="d" className="font-mono font-12">
                p-20, bg-surface
              </code>,
            ],
          ]}
        />
      </Part>

      <Part
        id="stronger"
        title="Класс сильнее"
        lead={
          <>
            У <Code>.liquid-glass</Code> есть свой фон. Класс{" "}
            <Code>bg-secondary/80</Code> из последнего слоя перебивает его без
            войн специфичности.
          </>
        }
      >
        <Example
          title=".liquid-glass и .liquid-glass bg-secondary/80"
          code={`<div className="liquid-glass relative br-xl p-16">Стекло</div>
<div className="liquid-glass relative br-xl p-16 bg-secondary/80">С классом</div>`}
        >
          <div className="grid sm:grid-cols-2 gap-12 p-16 br-lg bg-[linear-gradient(135deg,var(--violet-400),var(--pink-400))]">
            <div className="liquid-glass relative br-xl p-16 font-13 font-w-600">
              Стекло
            </div>
            <div className="liquid-glass relative br-xl p-16 bg-secondary/80 font-13 font-w-600 text-secondary-foreground">
              С классом bg-secondary/80
            </div>
          </div>
        </Example>
      </Part>

      <Part
        id="own"
        title="Свои стили"
        lead={
          <>
            Своё — сразу в нужный слой. Компонент — в <Code>components</Code>,
            правка одного места — в <Code>utilities</Code> через класс RenDit
            Code.
          </>
        }
      >
        <CodeBlock
          file="src/assets/scss/components/_card.scss"
          code={`@layer components {
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
  }
}`}
        />
        <Callout>
          Вложенные слои не нужны: порядок один на весь проект. Не пишите CSS
          вне слоя — он окажется сильнее всех классов и его будет трудно
          перебить.
        </Callout>
      </Part>

      <Part id="why" title="Зачем это нужно">
        <Callout tone="tip">
          Класс в разметке всегда предсказуемо сильнее базовых стилей и
          компонентов. Не нужно писать <Code>!important</Code>, длинные
          селекторы и повышать специфичность — достаточно класса RenDit Code.
        </Callout>
        <Callout tone="warning">
          Слой <Code>utilities</Code> собирает движок: не редактируйте{" "}
          <Code>generated/rendit-code.css</Code> — правьте классы в разметке или
          токены в <Code>settings/</Code>.
        </Callout>
      </Part>
    </ClassPage>
  );
}
