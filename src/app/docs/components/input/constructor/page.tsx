// Конструктор «Поля ввода» — отдельная вкладка: максимум настроек, живой пример и код.

import { Part } from "../../../../_docs/class-page";
import { Callout, Code } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { InputLab } from "../../_input-lab";
import { ComponentPage } from "../../_page";
import { InputTabs } from "../_tabs";

export const metadata = { title: "Конструктор поля ввода" };

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "tips", title: "Как пользоваться" },
];

export default function InputConstructorPage() {
  return (
    <ComponentPage
      title="Конструктор"
      toc={TOC}
      tabs={<InputTabs active="constructor" />}
      lead={
        <>
          Поле целиком: тексты, размеры, тени, рамки, фон из токенов, иконка,
          блок справа и состояния. Рядом — живой пример, ниже — готовый{" "}
          <Code>page.tsx</Code>.
        </>
      }
    >
      <Part id="builder" title="Конструктор" className="relative z-1">
        <InputLab />
      </Part>

      <Part id="tips" title="Как пользоваться">
        <ol className="grid gap-10 sm:grid-cols-3">
          {[
            {
              title: "Настройте",
              text: (
                <>
                  Секции слева: поле, тексты, иконки и поведение. Высота, фон,
                  рамка и фокус собираются в классы.
                </>
              ),
            },
            {
              title: "Проверьте",
              text: (
                <>
                  Наведите на часть примера — подсветится её секция. Включите
                  «Клик по примеру ведёт к настройке», чтобы клик переводил к
                  настройкам.
                </>
              ),
            },
            {
              title: "Заберите код",
              text: (
                <>
                  Готовый <Code>page.tsx</Code> внизу: импорт,{" "}
                  <Code>wrapperClassName</Code> и остальные свойства. Сам
                  компонент — на вкладке «Поле ввода».
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
          Всё оформление — в <Code>wrapperClassName</Code>,{" "}
          <Code>inputClassName</Code> и <Code>iconClassName</Code>. Компонент
          отвечает только за поведение и доступность. Вариант «TSX» в коде — это
          готовый <Code>&lt;div&gt;</Code> + <Code>&lt;input&gt;</Code> с
          классами RenDit SCSS, без импортов.
        </Callout>
      </Part>
    </ComponentPage>
  );
}
