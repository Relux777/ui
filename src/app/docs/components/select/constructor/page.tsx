// Конструктор «Выбора» — отдельная вкладка: больше места настройкам, примеру и коду.

import { Part } from "../../../../_docs/class-page";
import { Callout, Code } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { ComponentPage } from "../../_page";
import { SelectLab } from "../../_select-lab";
import { SelectTabs } from "../_tabs";

export const metadata = { title: "Конструктор выбора" };

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "tips", title: "Как пользоваться" },
];

export default function SelectConstructorPage() {
  return (
    <ComponentPage
      title="Конструктор"
      toc={TOC}
      tabs={<SelectTabs active="constructor" />}
      lead={
        <>
          Соберите Select из своих пунктов: тексты, размеры, тени, рамки, фоны
          из токенов, карточки пунктов, анимации и действия. Рядом — живой
          пример, ниже — готовый <Code>page.tsx</Code>.
        </>
      }
    >
      <Part id="builder" title="Конструктор" className="relative z-1">
        <SelectLab />
      </Part>

      <Part id="tips" title="Как пользоваться">
        <ol className="grid gap-10 sm:grid-cols-3">
          {[
            {
              title: "Настройте",
              text: (
                <>
                  Секции слева: поле, список, пункты, поведение и тексты. Свои
                  пункты — в «Пунктах», там же выбирается ссылка или кнопка.
                </>
              ),
            },
            {
              title: "Проверьте",
              text: (
                <>
                  Наведите на часть примера — подсветится её настройка. Включите
                  «Клик по примеру ведёт к настройке», чтобы клик переводил к
                  секции.
                </>
              ),
            },
            {
              title: "Заберите код",
              text: (
                <>
                  Готовый <Code>page.tsx</Code> внизу: импорты, пункты, свойства
                  и <Code>onAction</Code>. Сам компонент — на вкладке «Селект».
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
          Ссылка в пункте переходит на страницу, кнопка вызывает{" "}
          <Code>onAction</Code>, обычный пункт меняет значение. Всё это уже есть
          в готовом коде под примером.
        </Callout>
      </Part>
    </ComponentPage>
  );
}
