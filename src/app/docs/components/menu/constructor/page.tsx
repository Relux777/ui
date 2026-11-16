// Конструктор «Меню» — отдельная вкладка: кнопка, список, пункты и готовый код.

import { Part } from "../../../../_docs/class-page";
import { Callout, Code } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { MenuLab } from "../../_menu-lab";
import { ComponentPage } from "../../_page";
import { MenuTabs } from "../_tabs";

export const metadata = { title: "Конструктор меню" };

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "tips", title: "Как пользоваться" },
];

export default function MenuConstructorPage() {
  return (
    <ComponentPage
      title="Конструктор"
      toc={TOC}
      tabs={<MenuTabs active="constructor" />}
      lead={
        <>
          Меню действий: кнопка, панель, иконки, горячие клавиши, опасные пункты
          и разделители. Рядом — живой пример, ниже — готовый{" "}
          <Code>page.tsx</Code>.
        </>
      }
    >
      <Part id="builder" title="Конструктор" className="relative z-1">
        <MenuLab />
      </Part>

      <Part id="tips" title="Как пользоваться">
        <ol className="grid gap-10 sm:grid-cols-3">
          {[
            {
              title: "Настройте",
              text: (
                <>
                  Секции слева: кнопка, список, пункты и поведение. Всё
                  оформление — классы RenDit Code.
                </>
              ),
            },
            {
              title: "Проверьте",
              text: (
                <>
                  Нажмите кнопку в превью: меню откроется, стрелки и Esc
                  работают, ссылки и действия вызываются.
                </>
              ),
            },
            {
              title: "Заберите код",
              text: (
                <>
                  «Константы» — с <Code>trigger</Code>/<Code>panel</Code>, «В
                  JSX» — классы сразу в разметке, «TSX» — статичный макет без
                  импортов.
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
          Компонент закрывается по Esc, Tab и касанию мимо. Ссылка в пункте —{" "}
          <Code>Link</Code>, кнопка — <Code>onAction</Code>. Панель живёт в
          портале и следует теме превью.
        </Callout>
      </Part>
    </ComponentPage>
  );
}
