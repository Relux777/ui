// Вкладки: конструктор, установка, примеры и свойства.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { File } from "@boxicons/react/File";
import { Image } from "@boxicons/react/Image";
import { Video } from "@boxicons/react/Video";
import { type TabItem, Tabs } from "@/components/ui/Tabs";
import { Part } from "../../../_docs/class-page";
import {
  Callout,
  Code,
  CodeBlock,
  Example,
  FileTree,
  Table,
} from "../../../_docs/docs";
import type { TocItem } from "../../../_docs/toc";
import { ComponentPage } from "../_page";
import { TabsLab } from "../_tabs-lab";

export const metadata = { title: "Вкладки" };

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "install", title: "Установка" },
  { id: "source", title: "Код компонента" },
  { id: "pill", title: "Сегменты" },
  { id: "underline", title: "Подчёркивание" },
  { id: "enclosed", title: "Рамка" },
  { id: "icons", title: "Иконки и счётчики" },
  { id: "keys", title: "Клавиатура" },
  { id: "props", title: "Свойства" },
];

const TABS_SRC = readFileSync(
  join(process.cwd(), "src/components/ui/Tabs/index.tsx"),
  "utf8",
);

const PAGE_SRC = `import { Tabs } from "@/components/ui/Tabs";

const items = [
  {
    id: "photo",
    label: "Фото",
    count: 24,
    content: <p>Двадцать четыре фотографии.</p>,
  },
  {
    id: "video",
    label: "Видео",
    count: 8,
    content: <p>Восемь роликов.</p>,
  },
];

export default function Page() {
  return <Tabs items={items} defaultValue="photo" />;
}`;

const SIMPLE: TabItem[] = [
  { id: "photo", label: "Фото", content: "Фотографии проекта." },
  { id: "video", label: "Видео", content: "Видео и короткие демо." },
  { id: "files", label: "Файлы", content: "Макеты, шрифты и CSS." },
];

const ICON_ITEMS: TabItem[] = [
  {
    id: "photo",
    label: "Фото",
    icon: <Image width={16} height={16} />,
    count: 24,
    content: "Двадцать четыре фотографии.",
  },
  {
    id: "video",
    label: "Видео",
    icon: <Video width={16} height={16} />,
    count: 8,
    content: "Восемь роликов.",
  },
  {
    id: "files",
    label: "Файлы",
    icon: <File width={16} height={16} />,
    count: 12,
    content: "Двенадцать файлов.",
  },
];

export default function TabsPage() {
  return (
    <ComponentPage
      title="Вкладки"
      toc={TOC}
      lead={
        <>
          Сегменты, подчёркивание или рамка — один компонент. Активная вкладка
          одна в порядке табуляции, стрелки и Home/End переключают её, а панель
          связана с кнопкой через <Code>aria-controls</Code>.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите вид, размер, иконки, счётчики и ширину. Вкладки в превью переключаются по-настоящему."
        className="relative z-1"
      >
        <TabsLab />
      </Part>

      <Part
        id="install"
        title="Установка"
        lead={
          <>
            Нужен один файл: <Code>components/ui/Tabs/index.tsx</Code>. Все
            стили — классами RenDit Code.
          </>
        }
      >
        <FileTree
          root="src"
          items={[
            {
              name: "components/",
              children: [
                {
                  name: "ui/",
                  children: [
                    {
                      name: "Tabs/",
                      children: [
                        {
                          name: "index.tsx",
                          note: "вкладки, панель, клавиатура",
                          tag: { text: "основной", tone: "accent" },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ]}
        />
        <CodeBlock file="app/page.tsx" code={PAGE_SRC} />
        <Callout>
          Импорт — <Code>@/components/ui/Tabs</Code>. Панель рисуется, только
          если у вкладки есть <Code>content</Code>.
        </Callout>
      </Part>

      <Part
        id="source"
        title="Код компонента"
        lead="Файл целиком: скопируйте и положите рядом."
      >
        <CodeBlock file="src/components/ui/Tabs/index.tsx" code={TABS_SRC} />
      </Part>

      <Part
        id="pill"
        title="Сегменты"
        lead={
          <>
            <Code>variant=&quot;pill&quot;</Code> — по умолчанию: компактно,
            хорошо для переключения вида внутри карточки.
          </>
        }
      >
        <Example
          title="pill"
          code={`<Tabs items={items} defaultValue="photo" />
<Tabs items={items} defaultValue="photo" fullWidth />`}
        >
          <div className="flex flex-col gap-20 max-w-420">
            <Tabs items={SIMPLE} defaultValue="photo" ariaLabel="Медиа" />
            <Tabs
              items={SIMPLE}
              defaultValue="photo"
              fullWidth
              ariaLabel="Медиа"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="underline"
        title="Подчёркивание"
        lead={
          <>
            <Code>variant=&quot;underline&quot;</Code> — как у разделов
            страницы: спокойно, без плашки. Подходит для контента на всю ширину.
          </>
        }
      >
        <Example
          title="underline"
          code={`<Tabs items={items} defaultValue="photo" variant="underline" />`}
        >
          <div className="max-w-420">
            <Tabs
              items={SIMPLE}
              defaultValue="photo"
              variant="underline"
              ariaLabel="Медиа"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="enclosed"
        title="Рамка"
        lead={
          <>
            <Code>variant=&quot;enclosed&quot;</Code> — вкладки в общей рамке,
            как папки: хорошо для настроек и панелей.
          </>
        }
      >
        <Example
          title="enclosed"
          code={`<Tabs items={items} defaultValue="photo" variant="enclosed" />`}
        >
          <div className="max-w-420">
            <Tabs
              items={SIMPLE}
              defaultValue="photo"
              variant="enclosed"
              ariaLabel="Медиа"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="icons"
        title="Иконки и счётчики"
        lead={
          <>
            <Code>icon</Code> и <Code>count</Code> — необязательные части
            вкладки. Счётчик выделяется вместе с выбранной вкладкой.
          </>
        }
      >
        <Example
          title="icon и count"
          code={`const items = [
  { id: "photo", label: "Фото", icon: <Image />, count: 24, content: "…" },
  { id: "video", label: "Видео", icon: <Video />, count: 8, content: "…" },
];

<Tabs items={items} defaultValue="photo" size="md" fullWidth />`}
        >
          <div className="max-w-420">
            <Tabs
              items={ICON_ITEMS}
              defaultValue="photo"
              size="md"
              fullWidth
              ariaLabel="Медиа"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="keys"
        title="Клавиатура"
        lead="Стрелки влево и вправо переключают вкладку и переводят фокус. Home и End — к первой и последней."
      >
        <Callout>
          Одна вкладка в порядке табуляции, остальные — <Code>tabIndex=-1</Code>
          . Так Tab не проходит через весь список, а Enter на вкладке не нужен:
          переключение происходит сразу.
        </Callout>
      </Part>

      <Part
        id="props"
        title="Свойства"
        lead="items — массив вкладок; content у активной вкладки становится панелью."
      >
        <Table
          head={["Свойство", "Тип", "Что делает"]}
          rows={[
            ["items", "TabItem[]", "id, label, icon, count, disabled, content"],
            ["value / defaultValue", "string", "выбранная вкладка"],
            ["onChange", "(id) => void", "смена вкладки"],
            ["variant", '"pill" | "underline" | "enclosed"', "вид вкладок"],
            ["size", '"sm" | "md" | "lg"', "высота и шрифт"],
            ["fullWidth", "boolean", "вкладки на всю ширину родителя"],
            ["ariaLabel", "string", "название группы для скринридера"],
            ["panelClassName", "string", "классы панели под вкладками"],
          ]}
        />
      </Part>
    </ComponentPage>
  );
}
