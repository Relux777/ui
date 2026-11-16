// Меню: установка, примеры и свойства. Конструктор — на отдельной вкладке.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Archive } from "@boxicons/react/Archive";
import { Copy } from "@boxicons/react/Copy";
import { FileCode } from "@boxicons/react/FileCode";
import { Grid } from "@boxicons/react/Grid";
import { Home } from "@boxicons/react/Home";
import { Pencil } from "@boxicons/react/Pencil";
import { Trash } from "@boxicons/react/Trash";
import Link from "next/link";
import type { MenuItem } from "@/components/ui/Menu";
import { Menu } from "@/components/ui/Menu";
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
import { MenuTabs } from "./_tabs";

export const metadata = { title: "Меню" };

const TOC: TocItem[] = [
  { id: "install", title: "Установка" },
  { id: "source", title: "Код компонента" },
  { id: "base", title: "Действия" },
  { id: "links", title: "Ссылки" },
  { id: "shortcuts", title: "Иконки и клавиши" },
  { id: "danger", title: "Опасный пункт" },
  { id: "style", title: "Стиль" },
  { id: "phone", title: "Телефон" },
  { id: "props", title: "Свойства" },
];

const MENU_SRC = readFileSync(
  join(process.cwd(), "src/components/ui/Menu/index.tsx"),
  "utf8",
);

const ACTIONS: MenuItem[] = [
  {
    id: "edit",
    label: "Изменить",
    icon: <Pencil width={16} height={16} />,
    shortcut: "⌘E",
  },
  {
    id: "copy",
    label: "Скопировать",
    icon: <Copy width={16} height={16} />,
    shortcut: "⌘C",
  },
  {
    id: "archive",
    label: "В архив",
    icon: <Archive width={16} height={16} />,
  },
  { id: "sep", type: "separator" },
  {
    id: "delete",
    label: "Удалить",
    icon: <Trash width={16} height={16} />,
    danger: true,
    shortcut: "⌫",
  },
];

const LINKS: MenuItem[] = [
  {
    id: "home",
    label: "Главная",
    href: "/",
    icon: <Home width={16} height={16} />,
  },
  {
    id: "components",
    label: "Компоненты",
    href: "/docs/components",
    icon: <Grid width={16} height={16} />,
  },
  {
    id: "docs",
    label: "Справка",
    href: "/docs",
    icon: <FileCode width={16} height={16} />,
  },
];

const PAGE_SRC = `"use client";

import { Menu } from "@/components/ui/Menu";
import type { MenuItem } from "@/components/ui/Menu";

const items: MenuItem[] = [
  { id: "edit", label: "Изменить", shortcut: "⌘E" },
  { id: "copy", label: "Скопировать", shortcut: "⌘C" },
  { id: "sep", type: "separator" },
  { id: "delete", label: "Удалить", danger: true, shortcut: "⌫" },
];

export default function Page() {
  return (
    <Menu
      trigger="Действия"
      label="Действия"
      items={items}
      onAction={(item) => console.log(item.label)}
    />
  );
}`;

export default function MenuPage() {
  return (
    <ComponentPage
      title="Меню"
      toc={TOC}
      tabs={<MenuTabs active="menu" />}
      lead={
        <>
          Кнопка и выпадающий список действий или ссылок: иконки, горячие
          клавиши, разделители и опасные пункты. Клавиатура как у настоящего
          меню — стрелки, Home/End, Enter и Esc.
        </>
      }
    >
      <Part
        id="install"
        title="Установка"
        lead={
          <>
            Один файл и один импорт. Триггер — любая подпись, пункты — массив.
          </>
        }
      >
        <Steps
          steps={[
            {
              title: "Скачайте файл",
              text: (
                <>
                  Положите <Code>Menu/index.tsx</Code> в{" "}
                  <Code>src/components/ui/</Code>. Внутри — портал, позиция,
                  клавиатура и действия.
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
                        меню целиком, без зависимостей
                      </span>
                    </span>
                  </div>
                  <DownloadFile
                    code={MENU_SRC}
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
                  Boxicons; без них меню тоже работает.
                </>
              ),
              block: <InstallCommand pkg="@boxicons/react" />,
              optional: true,
            },
            {
              title: "Подключите на странице",
              text: (
                <>
                  Импорт — <Code>@/components/ui/Menu</Code>.{" "}
                  <Code>onAction</Code> вызывается кнопками; пункт с{" "}
                  <Code>href</Code> — настоящий <Code>Link</Code>.
                </>
              ),
              block: <CodeBlock file="app/page.tsx" code={PAGE_SRC} />,
            },
            {
              title: "Проверьте",
              text: (
                <>
                  Меню открывается по клику и Enter, стрелки ходят по пунктам,
                  Esc и Tab закрывают, касание мимо — тоже.
                </>
              ),
              result: (
                <div className="w-full max-w-240">
                  <Menu trigger="Действия" label="Действия" items={ACTIONS} />
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
                  href="/docs/components/menu/constructor"
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
        lead="Один файл: портал, позиция, клавиатура и действия. Вид — классы в page.tsx."
      >
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center">
          <p className="flex-1 font-13 text-foreground-muted">
            <Code>Menu</Code> не хранит оформление: кнопка, панель и пункты
            приходят классами.
          </p>
          <DownloadFile
            code={MENU_SRC}
            filename="index.tsx"
            variant="solid"
            className="max-sm:w-full"
          >
            Скачать index.tsx
          </DownloadFile>
        </div>
        <CodeBlock file="src/components/ui/Menu/index.tsx" code={MENU_SRC} />
      </Part>

      <Part
        id="base"
        title="Действия"
        lead="Изменить, скопировать, удалить. Кнопка вызывает onAction, ссылка переходит — разметка одна."
      >
        <Example
          title="trigger и items"
          code={`const items = [
  { id: "edit", label: "Изменить", shortcut: "⌘E" },
  { id: "copy", label: "Скопировать", shortcut: "⌘C" },
  { id: "sep", type: "separator" },
  { id: "delete", label: "Удалить", danger: true, shortcut: "⌫" },
];

<Menu
  trigger="Действия"
  label="Действия"
  items={items}
  onAction={(item) => console.log(item.label)}
/>`}
        >
          <Menu trigger="Действия" label="Действия" items={ACTIONS} />
        </Example>
      </Part>

      <Part
        id="links"
        title="Ссылки"
        lead="Пункт с href рендерится настоящим Link: клик и Enter ведут на страницу."
      >
        <Example
          title="href"
          code={`const items = [
  { id: "home", label: "Главная", href: "/" },
  { id: "components", label: "Компоненты", href: "/docs/components" },
  { id: "docs", label: "Справка", href: "/docs" },
];

<Menu trigger="Перейти" label="Перейти" items={items} />`}
        >
          <Menu trigger="Перейти" label="Перейти" items={LINKS} />
        </Example>
      </Part>

      <Part
        id="shortcuts"
        title="Иконки и клавиши"
        lead="Иконка слева, сочетание клавиш справа. Иконки декоративные, сочетание — подсказка."
      >
        <Example
          title="icon и shortcut"
          code={`const items = [
  { id: "edit", label: "Изменить", icon: <Pencil />, shortcut: "⌘E" },
  { id: "copy", label: "Скопировать", icon: <Copy />, shortcut: "⌘C" },
];

<Menu trigger="Действия" label="Действия" items={items} />`}
        >
          <Menu
            trigger="Действия"
            label="Действия"
            items={ACTIONS.slice(0, 2)}
          />
        </Example>
      </Part>

      <Part
        id="danger"
        title="Опасный пункт"
        lead={
          <>
            <Code>danger</Code> красит пункт, <Code>disabled</Code> выключает,
            разделитель отделяет группу.
          </>
        }
      >
        <Example
          title="danger, disabled и separator"
          code={`const items = [
  { id: "archive", label: "В архив", disabled: true },
  { id: "sep", type: "separator" },
  { id: "delete", label: "Удалить", danger: true },
];

<Menu trigger="Ещё" label="Ещё" items={items} />`}
        >
          <Menu
            trigger="Ещё"
            label="Ещё"
            items={[
              { id: "archive", label: "В архив", disabled: true },
              { id: "sep", type: "separator" },
              { id: "delete", label: "Удалить", danger: true },
            ]}
          />
        </Example>
      </Part>

      <Part
        id="style"
        title="Стиль"
        lead="Кнопка, панель и пункты — классы в page.tsx: размер, радиус, тень, фон и акцент."
      >
        <Example
          title="акцентная панель"
          code={`<Menu
  trigger="Фильтры"
  label="Фильтры"
  items={items}
  triggerClassName="h-44 w-200 px-14 br-full border bg-surface shadow-2 font-13 font-w-600 text-foreground"
  panelClassName="w-240 p-8 br-20 border border-secondary/25 bg-surface shadow-6"
  itemClassName="px-10 py-8 br-10 font-13 text-foreground"
  itemActiveClassName="bg-secondary/12 text-secondary"
  iconClassName="size-18 text-foreground-subtle"
  animation="scale"
/>`}
        >
          <Menu
            trigger="Фильтры"
            label="Фильтры"
            items={ACTIONS}
            triggerClassName="h-44 w-200 px-14 br-full border bg-surface shadow-2 font-13 font-w-600 text-foreground"
            panelClassName="w-240 p-8 br-20 border border-secondary/25 bg-surface shadow-6"
            itemClassName="px-10 py-8 br-10 font-13 text-foreground"
            itemActiveClassName="bg-secondary/12 text-secondary"
            iconClassName="size-18 text-foreground-subtle"
            animation="scale"
          />
        </Example>
      </Part>

      <Part
        id="phone"
        title="Телефон"
        lead="Панель не выходит за экран и пересчитывается по visualViewport: клавиатура и прокрутка её не ломают."
      >
        <Callout tone="tip">
          Для длинного меню держите пункты не ниже 44px: <Code>py-10</Code> и{" "}
          <Code>font-14</Code>. Ширину панели ограничивает{" "}
          <Code>max-w-[calc(100vw-16px)]</Code>.
        </Callout>
      </Part>

      <Part
        id="props"
        title="Свойства"
        lead="Пункты — данные, вид — классы. Ссылка становится Link, остальное — кнопка."
      >
        <Table
          head={["Свойство", "Тип", "Что делает"]}
          rows={[
            [
              "items",
              "MenuItem[]",
              "id, label, icon, href, shortcut, danger, disabled, separator",
            ],
            ["trigger", "ReactNode", "содержимое кнопки"],
            ["label", "string", "подпись меню для скринридера"],
            ["onAction", "(item) => void", "пункт-кнопка"],
            [
              "placement / align",
              '"auto" | "bottom" | "top" / "start" | "end"',
              "куда открывается",
            ],
            ["offset", "number", "зазор до панели"],
            [
              "animation",
              '"none" | "fade" | "scale" | "slide"',
              "появление панели",
            ],
            ["disabled", "boolean", "выключить кнопку"],
            ["chevron", "boolean", "стрелка у кнопки"],
            ["triggerClassName", "string", "кнопка: размер, радиус, тень, фон"],
            ["panelClassName", "string", "панель: ширина, отступы, рамка"],
            ["itemClassName", "string", "пункт: отступы, радиус, шрифт"],
            ["itemActiveClassName", "string", "пункт под курсором"],
            ["itemDangerClassName", "string", "опасный пункт"],
            ["itemDisabledClassName", "string", "выключенный пункт"],
            [
              "iconClassName / shortcutClassName",
              "string",
              "иконка и сочетание",
            ],
            ["separatorClassName", "string", "разделитель"],
            [
              "triggerStyle / panelStyle / itemStyle",
              "CSSProperties",
              "точные размеры числом",
            ],
          ]}
        />
      </Part>
    </ComponentPage>
  );
}
