// Конструктор «Окна» — отдельная вкладка: позиция на компьютере и на телефоне, живой пример
// и готовый page.tsx.

import { Part } from "../../../../_docs/class-page";
import { Callout, Code } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { ModalLab } from "../../_modal-lab";
import { ComponentPage } from "../../_page";
import { ModalTabs } from "../_tabs";

export const metadata = { title: "Конструктор окна" };

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "tips", title: "Как пользоваться" },
];

export default function ModalConstructorPage() {
  return (
    <ComponentPage
      title="Конструктор"
      toc={TOC}
      tabs={<ModalTabs active="constructor" />}
      lead={
        <>
          Позиция окна на компьютере и отдельно на телефоне. Справа — живое окно
          в рамке, ниже — готовый <Code>page.tsx</Code>.
        </>
      }
    >
      <Part id="builder" title="Конструктор" className="relative z-1">
        <ModalLab />
      </Part>

      <Part id="tips" title="Как пользоваться">
        <ol className="grid gap-10 sm:grid-cols-3">
          {[
            {
              title: "Настройте",
              text: (
                <>
                  <Code>position</Code> — где окно на компьютере,{" "}
                  <Code>phone</Code> — где на телефоне. «Класс фона» — любой
                  класс RenDit Code (<Code>bg-primary</Code>,{" "}
                  <Code>bg-secondary</Code>…): он уходит на окно через{" "}
                  <Code>className</Code>, как в <Code>page.tsx</Code>.
                </>
              ),
            },
            {
              title: "Проверьте",
              text: (
                <>
                  «Открыть окно» показывает его в рамке: подложка затемняет и
                  размывает фон, как у настоящего окна, клик по ней закрывает.
                  Внизу на телефоне окно смахивается вниз, справа и слева —
                  панель во всю высоту.
                </>
              ),
            },
            {
              title: "Заберите код",
              text: (
                <>
                  Готовый <Code>page.tsx</Code> внизу: импорт, кнопка,{" "}
                  <Code>ref</Code>, позиции и выбранный класс фона. Сам
                  компонент — на вкладке «Окно».
                </>
              ),
            },
          ].map((card, i) => (
            <li
              key={card.title}
              className="flex flex-col gap-8 p-14 br-xl border bg-surface shadow-1"
            >
              <span className="size-28 grid place-items-center br-full bg-accent font-12 font-w-700 text-accent-foreground">
                {i + 1}
              </span>
              <span className="font-14 font-w-700">{card.title}</span>
              <p className="font-13 text-foreground-muted">{card.text}</p>
            </li>
          ))}
        </ol>
        <Callout tone="tip">
          Всё оформление — классами RenDit Code в <Code>page.tsx</Code> и в
          файлах контента: кнопки, поля, отступы. Компонент отвечает за окно,
          позиции и доступность, содержимое — за себя.
        </Callout>
      </Part>
    </ComponentPage>
  );
}
