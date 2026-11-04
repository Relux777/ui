// Переходы: какие свойства, сколько длится, с какой кривой и задержкой. Пружины — ease-spring и bouncy.

import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { TABLE_CLASSES } from "./_classes";
import { MotionPlayground } from "./_playground";

const HREF = "/docs/scss/transition";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "playground", title: "Песочница движения" },
  { id: "classes", title: "Все классы" },
  { id: "reduce", title: "Без движения" },
];

export default function TransitionPage() {
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>transition</Code> — что анимировать, <Code>duration-N</Code> —
          сколько, <Code>ease-*</Code> — с какой кривой, <Code>delay-N</Code> —
          с задержкой. Пружины <Code>ease-spring</Code> и{" "}
          <Code>ease-spring-bouncy</Code> живее обычных кривых.
        </>
      }
    >
      <Part
        id="playground"
        title="Песочница движения"
        lead="Выберите движение и кривую, запустите — шарик проедет по дорожке. Внизу — готовые классы."
        className="relative z-1"
      >
        <MotionPlayground />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Свой набор свойств —{" "}
            <Code>transition-[grid-template-rows,opacity]</Code>. Кривая — токен{" "}
            <Code>--ease-ИМЯ</Code> → класс <Code>ease-ИМЯ</Code>.
          </>
        }
      >
        <ClassTable rows={TABLE_CLASSES} />
      </Part>

      <Part id="reduce" title="Без движения">
        <Example
          title="Для тех, кто попросил без движения"
          note="motion-reduce: — отключает переход при prefers-reduced-motion."
          code={`<button class="transition duration-300 motion-reduce:transition-none">
  Нажмите
</button>`}
        >
          <span className="px-16 py-8 br-full bg-primary text-primary-foreground font-13 font-w-600 transition-[scale,background-color] duration-300 active:scale-95 motion-reduce:transition-none">
            Нажмите
          </span>
        </Example>
      </Part>
    </ClassPage>
  );
}
