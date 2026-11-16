// Навигация: установка, примеры и свойства. Конструктор — на отдельной вкладке.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BookOpen } from "@boxicons/react/BookOpen";
import { FileCode } from "@boxicons/react/FileCode";
import { Grid } from "@boxicons/react/Grid";
import { Home } from "@boxicons/react/Home";
import { Rocket } from "@boxicons/react/Rocket";
import Link from "next/link";
import type { NavigationItem } from "@/components/ui/Navigation";
import { Navigation } from "@/components/ui/Navigation";
import { Part } from "../../../_docs/class-page";
import {
  Callout,
  Code,
  CodeBlock,
  Example,
  Steps,
  Table,
} from "../../../_docs/docs";
import { DownloadFile } from "../../../_docs/download-file";
import { InstallCommand } from "../../../_docs/install-command";
import type { TocItem } from "../../../_docs/toc";
import { ComponentPage } from "../_page";
import { NavigationTabs } from "./_tabs";

export const metadata = { title: "Навигация" };

const TOC: TocItem[] = [
  { id: "install", title: "Установка" },
  { id: "source", title: "Код компонента" },
  { id: "base", title: "В ряд" },
  { id: "vertical", title: "Колонкой" },
  { id: "icons", title: "Иконки и метки" },
  { id: "active", title: "Активный пункт" },
  { id: "style", title: "Стиль" },
  { id: "phone", title: "Телефон" },
  { id: "props", title: "Свойства" },
];

const NAV_SRC = readFileSync(
  join(process.cwd(), "src/components/ui/Navigation/index.tsx"),
  "utf8",
);

const ITEMS: NavigationItem[] = [
  { label: "Главная", href: "/" },
  { label: "Компоненты", href: "/docs/components" },
  { label: "Блог", href: "/blog" },
  { label: "Обновления", href: "/docs/releases" },
];

const ICON_ITEMS: NavigationItem[] = [
  {
    label: "Главная",
    href: "/",
    icon: <Home width={18} height={18} />,
  },
  {
    label: "Компоненты",
    href: "/docs/components",
    icon: <Grid width={18} height={18} />,
    badge: "24",
  },
  {
    label: "Справка",
    href: "/docs",
    icon: <BookOpen width={18} height={18} />,
  },
  {
    label: "Обновления",
    href: "/docs/releases",
    icon: <Rocket width={18} height={18} />,
  },
];

const PAGE_SRC = `import { Navigation } from "@/components/ui/Navigation";

const items = [
  { label: "Главная", href: "/" },
  { label: "Компоненты", href: "/docs/components" },
  { label: "Блог", href: "/blog" },
];

export default function Page() {
  return (
    <Navigation
      label="Разделы"
      items={items}
      active="/docs/components"
    />
  );
}`;

export default function NavigationPage() {
  return (
    <ComponentPage
      title="Навигация"
      toc={TOC}
      tabs={<NavigationTabs active="navigation" />}
      lead={
        <>
          Ссылки в ряд или колонкой: активный пункт, иконки, метки и любой
          размер. Семантика <Code>nav</Code> + <Code>aria-current</Code>, вид —
          классами RenDit Code в <Code>page.tsx</Code>.
        </>
      }
    >
      <Part
        id="install"
        title="Установка"
        lead={
          <>
            Один файл и один импорт. Без <Code>className</Code> работает готовый
            ряд таблеток.
          </>
        }
      >
        <Steps
          steps={[
            {
              title: "Скачайте файл",
              text: (
                <>
                  Положите <Code>Navigation/index.tsx</Code> в{" "}
                  <Code>src/components/ui/</Code>. Компонент рендерит{" "}
                  <Code>nav</Code>, <Code>ul</Code>, <Code>li</Code> и настоящие{" "}
                  <Code>Link</Code>.
                </>
              ),
              block: (
                <div className="flex flex-col gap-12 p-14 br-xl border bg-surface shadow-1">
                  <div className="flex items-start gap-10">
                    <span className="size-36 shrink-0 grid place-items-center br-lg bg-secondary/10 text-secondary">
                      <FileCode size="sm" aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-2">
                      <span className="font-14 font-w-700">index.tsx</span>
                      <span className="font-12 text-foreground-muted">
                        навигация целиком, без зависимостей
                      </span>
                    </span>
                  </div>
                  <DownloadFile
                    code={NAV_SRC}
                    filename="index.tsx"
                    variant="solid"
                    className="self-start max-sm:w-full"
                  >
                    Скачать index.tsx
                  </DownloadFile>
                </div>
              ),
            },
            {
              title: "Поставьте иконки — по желанию",
              text: (
                <>
                  Сам компонент без зависимостей. Иконки в примерах — из
                  Boxicons; если пакета нет — поставьте, если не нужны —
                  пропустите шаг.
                </>
              ),
              block: <InstallCommand pkg="@boxicons/react" />,
              optional: true,
            },
            {
              title: "Подключите на странице",
              text: (
                <>
                  Импорт — <Code>@/components/ui/Navigation</Code>. Список
                  пунктов — обычный массив, активный задаётся через{" "}
                  <Code>active</Code>.
                </>
              ),
              block: <CodeBlock file="app/page.tsx" code={PAGE_SRC} />,
            },
            {
              title: "Проверьте",
              text: (
                <>
                  Активный пункт получает{" "}
                  <Code>aria-current=&quot;page&quot;</Code>, иконки
                  декоративные, клавиатура и ссылки работают как у обычного{" "}
                  <Code>Link</Code>.
                </>
              ),
              result: (
                <div className="w-full max-w-480">
                  <Navigation
                    label="Разделы"
                    items={ITEMS}
                    active="/docs/components"
                  />
                </div>
              ),
            },
          ]}
          done={{
            title: "Готово",
            text: (
              <>
                Дальше — собрать своё в{" "}
                <Link
                  href="/docs/components/navigation/constructor"
                  className="font-w-600 text-secondary hover:underline"
                >
                  конструкторе
                </Link>
                .
              </>
            ),
          }}
        />
      </Part>

      <Part
        id="source"
        title="Код компонента"
        lead="Один файл: семантика, ссылки и состояния. Внешний вид — в page.tsx."
      >
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center">
          <p className="flex-1 font-13 text-foreground-muted">
            <Code>Navigation</Code> не хранит стили: список, пункт и активное
            состояние приходят классами.
          </p>
          <DownloadFile
            code={NAV_SRC}
            filename="index.tsx"
            variant="solid"
            className="max-sm:w-full"
          >
            Скачать index.tsx
          </DownloadFile>
        </div>
        <CodeBlock
          file="src/components/ui/Navigation/index.tsx"
          code={NAV_SRC}
        />
      </Part>

      <Part
        id="base"
        title="В ряд"
        lead="Самый простой вариант: ссылки в строку и активный пункт. Без классов — таблетки на сером фоне."
      >
        <Example
          title="items и active"
          code={`const items = [
  { label: "Главная", href: "/" },
  { label: "Компоненты", href: "/docs/components" },
  { label: "Блог", href: "/blog" },
];

<Navigation label="Разделы" items={items} active="/docs/components" />`}
        >
          <div className="max-w-480">
            <Navigation
              label="Разделы"
              items={ITEMS}
              active="/docs/components"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="vertical"
        title="Колонкой"
        lead={
          <>
            <Code>orientation=&quot;vertical&quot;</Code> — для бокового меню.
            Активный пункт остаётся тем же.
          </>
        }
      >
        <Example
          title="orientation"
          code={`<Navigation
  label="Разделы"
  items={items}
  active="/docs/components"
  orientation="vertical"
/>`}
        >
          <div className="max-w-240">
            <Navigation
              label="Разделы"
              items={ITEMS.slice(0, 3)}
              active="/docs/components"
              orientation="vertical"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="icons"
        title="Иконки и метки"
        lead={
          <>
            <Code>icon</Code> — декоративная иконка, <Code>badge</Code> — метка
            справа. У пункта-ссылки есть настоящий <Code>Link</Code>.
          </>
        }
      >
        <Example
          title="icon и badge"
          code={`import { Grid } from "@boxicons/react/Grid";

const items = [
  { label: "Главная", href: "/", icon: <Home /> },
  {
    label: "Компоненты",
    href: "/docs/components",
    icon: <Grid />,
    badge: "24",
  },
];

<Navigation label="Разделы" items={items} active="/docs/components" />`}
        >
          <div className="max-w-480">
            <Navigation
              label="Разделы"
              items={ICON_ITEMS}
              active="/docs/components"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="active"
        title="Активный пункт"
        lead={
          <>
            Активный пункт задаётся href: компонент ставит{" "}
            <Code>aria-current=&quot;page&quot;</Code> и класс активного
            состояния. В примере активен «Блог».
          </>
        }
      >
        <Example
          title="active"
          code={`<Navigation
  label="Разделы"
  items={items}
  active="/blog"
  activeClassName="bg-accent/25 text-foreground"
/>`}
        >
          <div className="max-w-480">
            <Navigation
              label="Разделы"
              items={ITEMS}
              active="/blog"
              activeClassName="bg-accent/25 text-foreground"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="style"
        title="Стиль"
        lead={
          <>
            Фон, рамка, тень, радиус, отступы и шрифт — классы{" "}
            <Code>className</Code>, <Code>listClassName</Code> и{" "}
            <Code>itemClassName</Code>.
          </>
        }
      >
        <Example
          title="панель с рамкой и тенью"
          code={`<Navigation
  label="Разделы"
  items={items}
  active="/docs/components"
  className="p-8 br-16 border bg-surface shadow-3"
  listClassName="flex-wrap items-center gap-2"
  itemClassName="px-12 py-8 br-8 font-13 text-foreground-muted hover:bg-secondary/8 hover:text-foreground"
  activeClassName="bg-secondary/12 text-secondary"
/>`}
        >
          <div className="max-w-480">
            <Navigation
              label="Разделы"
              items={ITEMS}
              active="/docs/components"
              className="p-8 br-16 border bg-surface shadow-3"
              listClassName="flex-wrap items-center gap-2"
              itemClassName="px-12 py-8 br-8 font-13 text-foreground-muted hover:bg-secondary/8 hover:text-foreground"
              activeClassName="bg-secondary/12 text-secondary"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="phone"
        title="Телефон"
        lead="На узком экране — горизонтальная прокрутка: ссылки не сжимаются, палец попадает по каждой."
      >
        <Example
          title="nowrap и прокрутка"
          code={`<div className="overflow-x-auto">
  <Navigation
    label="Разделы"
    items={items}
    active="/docs/components"
    listClassName="flex-nowrap items-center gap-4 min-w-max"
    itemClassName="px-12 py-10 br-full font-14 whitespace-nowrap"
  />
</div>`}
        >
          <div className="overflow-x-auto">
            <Navigation
              label="Разделы"
              items={ITEMS}
              active="/docs/components"
              listClassName="flex-nowrap items-center gap-4 min-w-max"
              itemClassName="px-12 py-10 br-full font-14 whitespace-nowrap text-foreground-muted hover:bg-foreground/5 hover:text-foreground"
            />
          </div>
        </Example>
        <Callout tone="tip">
          Горизонтальный список на телефоне лучше не переносить:{" "}
          <Code>flex-nowrap</Code> + <Code>overflow-x-auto</Code> оставляют
          ровные таблетки.
        </Callout>
      </Part>

      <Part
        id="props"
        title="Свойства"
        lead="Пункты — данные, вид — классы. Активный пункт сравнивается по href."
      >
        <Table
          head={["Свойство", "Тип", "Что делает"]}
          rows={[
            ["items", "NavigationItem[]", "label, href, icon, badge, disabled"],
            ["label", "string", "подпись nav для скринридера"],
            ["active", "string", "href активного пункта"],
            ["orientation", '"horizontal" | "vertical"', "ряд или колонка"],
            ["className", "string", "корень навигации"],
            ["listClassName", "string", "список: зазор, перенос"],
            ["itemClassName", "string", "пункт: отступы, радиус, шрифт"],
            ["activeClassName", "string", "активный пункт"],
            ["disabledClassName", "string", "выключенный пункт"],
            ["iconClassName / badgeClassName", "string", "иконка и метка"],
            ["labelClassName", "string", "текст пункта"],
            ["itemStyle", "CSSProperties", "точные размеры пункта"],
          ]}
        />
      </Part>
    </ComponentPage>
  );
}
