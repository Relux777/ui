// «Устройство» — из чего состоит RenDit UI: три части (RenDit SCSS, RenDit Code, компоненты) и одна версия,
// как движок превращает классы в CSS, порядок слоёв каскада и где что лежит в проекте.

import { BookOpen } from "@boxicons/react/BookOpen";
import { Code as CodeIcon } from "@boxicons/react/Code";
import { Cog } from "@boxicons/react/Cog";
import { Layers } from "@boxicons/react/Layers";
import { Package } from "@boxicons/react/Package";
import { Palette } from "@boxicons/react/Palette";
import { Terminal } from "@boxicons/react/Terminal";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { version } from "../../../../../package.json";
import {
  Callout,
  Code,
  CodeBlock,
  DocHeader,
  FileTree,
  Heading,
  Lead,
  LinkCards,
  Table,
  type TreeItem,
} from "../../../_docs/docs";
import { Toc, type TocItem } from "../../../_docs/toc";

export const metadata: Metadata = { title: "Устройство" };

const TOC: TocItem[] = [
  { id: "parts", title: "Три части и одна версия" },
  { id: "engine", title: "Как движок пишет CSS" },
  { id: "layers", title: "Порядок слоёв" },
  { id: "files", title: "Где что лежит" },
];

// три части — как на главной странице
const PARTS = [
  {
    icon: <Layers />,
    tile: "bg-accent/15",
    name: "RenDit SCSS",
    path: "src/assets/scss/",
    text: "Стили: токены (палитра, цвета, тени, скругления), сброс, база, контейнер и сетка .row, компоненты (.liquid-glass, .sheet, .tilt). Подключается одним файлом RenDit_UI.scss.",
  },
  {
    icon: <CodeIcon />,
    tile: "bg-secondary/15",
    name: "RenDit Code",
    path: "rendit-code/",
    text: "Движок классов: читает вашу разметку и собирает CSS только для тех классов, что в ней есть. Числа — пиксели, цвета — токены, настройки — rendit.config.mjs.",
  },
  {
    icon: <Package />,
    tile: "bg-pink-500/15",
    name: "Компоненты",
    path: "src/components/ui/",
    text: "Готовые куски интерфейса (окно-лист, поиск, 3D-карточка), каждый — отдельная папка, которую можно взять в проект целиком.",
  },
];

// как класс в разметке становится CSS
const ENGINE: ReactNode[][] = [
  [
    <Code key="k">core/scanner.mjs</Code>,
    "читает исходники как текст и достаёт слова-кандидаты — из className, cn(), шаблонов, объектов вариантов",
  ],
  [
    <Code key="k">core/parser.mjs</Code>,
    "разбирает класс на части: варианты, минус, значение, прозрачность /N",
  ],
  [
    <Code key="k">core/utilities.mjs</Code>,
    "есть ли такой класс и что он значит (p-20 → padding: 20px)",
  ],
  [
    <Code key="k">core/variants.mjs</Code>,
    "префиксы hover:, md:, dark: — во что они превращаются и кто кого сильнее",
  ],
  [
    <Code key="k">core/generator.mjs</Code>,
    "сортирует каскад (сокращённые свойства раньше развёрнутых) и печатает CSS",
  ],
  [
    <Code key="k">generated/rendit-code.css</Code>,
    "результат — подключается после RenDit_UI.scss, больше движок нигде не нужен",
  ],
];

const LAYERS: ReactNode[][] = [
  [
    <Code key="k">theme</Code>,
    "токены — переменные палитры, цветов, теней",
    <Code key="e">--primary, --shadow-2</Code>,
  ],
  [
    <Code key="k">reset</Code>,
    "обнуление браузерных стилей",
    <Code key="e">margin, box-sizing</Code>,
  ],
  [
    <Code key="k">base</Code>,
    "типографика и поведение элементов",
    <Code key="e">font-family, :focus-visible</Code>,
  ],
  [
    <Code key="k">layout</Code>,
    "контейнер и сетка",
    <Code key="e">.container, .row</Code>,
  ],
  [
    <Code key="k">components</Code>,
    "стили компонентов",
    <Code key="e">.liquid-glass, .sheet</Code>,
  ],
  [
    <Code key="k">utilities</Code>,
    "классы движка — сильнее всего вышеперечисленного",
    <Code key="e">p-20, md:flex</Code>,
  ],
];

const TREE: TreeItem[] = [
  {
    name: "package.json",
    note: "версия RenDit UI — единственный источник",
    tag: { text: "версия", tone: "accent" },
  },
  {
    name: "rendit.config.mjs",
    note: "настройки движка: брейкпоинты, safelist, куда писать CSS",
  },
  {
    name: "rendit-code/",
    note: "движок RenDit Code",
    children: [
      { name: "cli.mjs", note: "команды dev, build, watch, check" },
      { name: "core/", note: "сканер, парсер, утилиты, варианты, генератор" },
      { name: "dist.mjs", note: "собирает готовый CSS в src/assets/css/" },
      { name: "vscode/", note: "расширение подсказок для VS Code" },
    ],
  },
  {
    name: "src/assets/scss/",
    note: "RenDit SCSS — стили",
    children: [
      {
        name: "RenDit_UI.scss",
        note: "подключаете только его",
        tag: { text: "точка входа", tone: "accent" },
      },
      { name: "_layers.scss", note: "порядок слоёв каскада — одна строка" },
      { name: "settings/", note: "токены: палитра, цвета, тени, скругления" },
      { name: "tools/", note: "миксины up(), down(), hover, liquid-glass" },
      { name: "generic/", note: "сброс и база" },
      { name: "layout/", note: ".container и сетка .row" },
      { name: "components/", note: ".liquid-glass, .sheet, .tilt и другие" },
      {
        name: "generated/",
        note: "CSS классов, брейкпоинты, версия — пишет движок",
        tag: { text: "не редактировать", tone: "warning" },
      },
    ],
  },
  {
    name: "src/app/",
    note: "этот сайт — документация и конструктор",
  },
  {
    name: "src/components/",
    note: "шапка, нижнее меню и UI-компоненты",
  },
  {
    name: "src/assets/css/",
    note: "готовый CSS для HTML без сборки — пишет npm run dist",
    tag: { text: "генерируется", tone: "warning" },
  },
];

const NEXT = [
  {
    href: "/docs/install",
    title: "Установка",
    text: "Подключите RenDit UI к своему проекту за несколько минут.",
    Icon: BookOpen,
  },
  {
    href: "/docs/code/classes",
    title: "Как писать классы",
    text: "Числа, токены, прозрачность и свои значения.",
    Icon: CodeIcon,
  },
  {
    href: "/docs/code/config",
    title: "Конфиг",
    text: "Брейкпоинты, safelist и пути в rendit.config.mjs.",
    Icon: Cog,
  },
  {
    href: "/docs/scss/tokens",
    title: "Токены",
    text: "Свои цвета, тени и скругления — классы появятся сами.",
    Icon: Palette,
  },
  {
    href: "/docs/code/cli",
    title: "Команды",
    text: "dev, build, watch и check — что делает каждая.",
    Icon: Terminal,
  },
];

export default function StructurePage() {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["Начало", "Устройство"]}
          title="Устройство"
          lead="Из чего состоит RenDit UI — стили RenDit SCSS, движок классов RenDit Code и компоненты — и как они работают вместе. Всё лежит обычными файлами, ничего не спрятано."
        />

        <section className="reveal flex flex-col gap-20">
          <Heading id="parts">Три части и одна версия</Heading>
          <div className="grid grid-fill-260 gap-16">
            {PARTS.map((p) => (
              <div
                key={p.name}
                className="flex flex-col gap-10 p-24 br-xl border bg-surface transition-[translate,box-shadow] duration-300 hover:-translate-y-4 hover:shadow-4 motion-reduce:transition-none"
              >
                <span
                  className={`${p.tile} size-44 br-lg flex items-center justify-center`}
                >
                  {p.icon}
                </span>
                <h3 className="font-18 font-w-700">{p.name}</h3>
                <code className="font-12 font-mono text-foreground-muted">
                  {p.path}
                </code>
                <p className="font-14 text-foreground-muted">{p.text}</p>
              </div>
            ))}
          </div>
          <Lead>
            Версия у трёх частей одна — из <Code>package.json</Code>. Движок
            печатает её в шапку CSS и пишет в{" "}
            <Code>generated/_version.scss</Code>, откуда её берёт{" "}
            <Code>RenDit_UI.scss</Code> и сайт. Поэтому версию меняют в одном
            месте.
          </Lead>
          <CodeBlock
            file="generated/_version.scss"
            code={`// пишет движок из package.json, не редактировать
$version: "${version}";`}
          />
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="engine">Как движок находит классы и пишет CSS</Heading>
          <Lead>
            При <Code>npm run dev</Code> движок следит за исходниками и
            пересобирает CSS при каждом сохранении — новый класс в разметке
            появляется в стилях за миллисекунды.
          </Lead>
          <Table head={["Шаг", "Что делает"]} rows={ENGINE} />
          <Callout>
            Класс пишется строкой целиком: <Code>{`bg-\${color}`}</Code> движок
            не увидит — полные строки или <Code>safelist</Code> в конфиге.
          </Callout>
          <CodeBlock
            file="разметка → generated/rendit-code.css"
            code={`<div class="p-20 md:flex">…

@layer utilities {
  .p-20 {
    padding: 20px; /* числа — пиксели */
  }
  @media (width >= 770px) {
    .md\\:flex {
      display: flex; /* md: — экран от 770px */
    }
  }
}`}
          />
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="layers">Порядок слоёв: классы всегда сильнее</Heading>
          <Lead>
            Все стили RenDit лежат в каскадных слоях — от токенов до классов
            движка. Класс всегда побеждает базовые стили, что бы ни случилось:
            он в самом последнем слое. Порядок задаётся одной строкой в{" "}
            <Code>_layers.scss</Code>.
          </Lead>
          <CodeBlock
            file="src/assets/scss/_layers.scss"
            code="@layer theme, reset, base, layout, components, utilities;"
          />
          <Table head={["Слой", "Что в нём", "Пример"]} rows={LAYERS} />
          <Callout>
            Правила без <Code>@layer</Code> сильнее любого слоя — поэтому ваши
            стили перебьют библиотеку без <Code>!important</Code>.
          </Callout>
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="files">Где что лежит и что можно менять</Heading>
          <Lead>
            Новый цвет — токен в <Code>settings/</Code>, и классы{" "}
            <Code>bg-*</Code> появляются сами. Нужный всем утилитарный класс — в{" "}
            <Code>rendit-code/core/utilities.mjs</Code>. То, что классами не
            выразить, — в <Code>components/_*.scss</Code>. Сам движок — тоже
            обычные файлы, можно читать и менять.
          </Lead>
          <FileTree root="ui/" items={TREE} />
        </section>

        <LinkCards label="Что дальше" items={NEXT} />
      </div>

      <aside className="max-xl:hidden">
        <div className="sticky top-80">
          <Toc items={TOC} />
        </div>
      </aside>
    </div>
  );
}
