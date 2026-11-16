// Размытие: конструктор blur- и backdrop-blur-, таблица классов, стекло, стекло внутри стекла
// и цена размытия на телефоне.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Callout, Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { BlurBuilder } from "./_builder";
import { BLUR_CLASSES } from "./_classes";

const HREF = "/docs/scss/blur";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "glass", title: "Стекло" },
  { id: "inside", title: "Стекло внутри стекла" },
  { id: "phone", title: "На телефоне" },
];

export default async function BlurPage() {
  const css = await classCss(BLUR_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>blur-8</Code> размывает сам элемент вместе с содержимым,{" "}
          <Code>backdrop-blur-8</Code> — то, что под ним: так делают стеклянные
          панели. Оба принимают пиксели.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Переключите «сам элемент» и «стекло»: в первом случае мутнеет текст, во втором — цветные круги под панелью."
        className="relative z-1"
      >
        <BlurBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            <Code>blur-N</Code> и <Code>backdrop-blur-N</Code> — радиус в
            пикселях. <Code>none</Code> убирает размытие.
          </>
        }
      >
        <ClassTable
          rows={[
            ["blur-4", "лёгкое размытие элемента"],
            ["blur-12", "сильное"],
            ["blur-24", "очень сильное"],
            ["blur-none", "без размытия"],
            ["backdrop-blur-4", "стекло: лёгкое"],
            ["backdrop-blur-12", "стекло: заметное"],
            ["backdrop-blur-24", "стекло: плотное"],
            ["backdrop-blur-none", "стекло без размытия"],
          ]}
        />
      </Part>

      <Part
        id="glass"
        title="Стекло"
        lead={
          <>
            Панель: <Code>backdrop-blur-12 bg-surface/60 border</Code>.
            Полупрозрачный фон нужен, чтобы размытие было видно; рамка даёт
            кромку.
          </>
        }
      >
        <Example
          title="Панель над картинкой"
          code={`<div className="relative br-xl overflow-hidden">
  <div className="h-220 bg-[url(/samples/landscape.svg)] bg-cover bg-center" />
  <div className="absolute inset-6 flex items-end p-16 br-lg
    backdrop-blur-12 bg-surface/60 border font-14 font-w-600">
    Стеклянная панель
  </div>
</div>`}
        >
          <div className="relative br-xl overflow-hidden">
            <div className="h-220 bg-[url(/samples/landscape.svg)] bg-cover bg-center" />
            <div className="absolute inset-6 flex items-end p-16 br-lg backdrop-blur-12 bg-surface/60 border font-14 font-w-600">
              Стеклянная панель
            </div>
          </div>
        </Example>
      </Part>

      <Part id="inside" title="Стекло внутри стекла">
        <Callout tone="warning">
          <Code>backdrop-filter</Code> у элемента делает его «корнем размытия»:
          стекло внутри стекла размывает уже размытую панель, а не страницу.
          Поэтому у шапки нет размытия — только у таблеток внутри неё.
        </Callout>
        <Callout>
          Не анимируйте <Code>opacity</Code>, <Code>filter</Code>,{" "}
          <Code>clip-path</Code> или <Code>mask</Code> у предков стеклянных
          элементов — размытие пропадёт. <Code>transform</Code> можно.
        </Callout>
      </Part>

      <Part id="phone" title="На телефоне">
        <Callout tone="tip">
          Большое размытие на весь экран дорого на слабых телефонах. Для
          сенсорных экранов — <Code>touch:backdrop-blur-none</Code>; для тех,
          кто просил меньше прозрачности, — <Code>motion-reduce:</Code> и{" "}
          <Code>prefers-reduced-transparency</Code> в компонентах RenDit SCSS.
        </Callout>
      </Part>
    </ClassPage>
  );
}
