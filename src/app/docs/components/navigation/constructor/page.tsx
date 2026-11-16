// Конструктор «Навигации» — отдельная вкладка: ряд/колонка, пункты, иконки и код.

import { Part } from "../../../../_docs/class-page";
import { Callout, Code } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { NavigationLab } from "../../_navigation-lab";
import { ComponentPage } from "../../_page";
import { NavigationTabs } from "../_tabs";

export const metadata = { title: "Конструктор навигации" };

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "tips", title: "Как пользоваться" },
];

export default function NavigationConstructorPage() {
  return (
    <ComponentPage
      title="Конструктор"
      toc={TOC}
      tabs={<NavigationTabs active="constructor" />}
      lead={
        <>
          Ссылки в ряд или колонкой: активный пункт, иконки, метки, отступы,
          рамки и фон. Рядом — живой пример, ниже — готовый{" "}
          <Code>page.tsx</Code>.
        </>
      }
    >
      <Part id="builder" title="Конструктор" className="relative z-1">
        <NavigationLab />
      </Part>

      <Part id="tips" title="Как пользоваться">
        <ol className="grid gap-10 sm:grid-cols-3">
          {[
            {
              title: "Настройте",
              text: (
                <>
                  Вид, пункты и иконки. Активный пункт — это <Code>href</Code>,
                  который совпадает с <Code>active</Code>.
                </>
              ),
            },
            {
              title: "Проверьте",
              text: (
                <>
                  Ссылки в превью не переходят — это макет. В готовом коде это
                  настоящие <Code>Link</Code> из Next.js.
                </>
              ),
            },
            {
              title: "Заберите код",
              text: (
                <>
                  Вариант «Константы» — с <Code>list</Code> и <Code>item</Code>,
                  «TSX» — готовый <Code>&lt;nav&gt;</Code> без импортов.
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
          Компонент сам ставит <Code>aria-current=&quot;page&quot;</Code> и
          рендерит <Code>Link</Code>. Вид — только классы в{" "}
          <Code>page.tsx</Code>.
        </Callout>
      </Part>
    </ComponentPage>
  );
}
