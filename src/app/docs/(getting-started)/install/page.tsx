// Установка и настройка — первая вкладка «Справки». Только то, что нужно, чтобы подключить RenDit UI: выбор
// платформы (Next.js, React, Node.js, HTML) и ответов на её вопросы — шаги под этот набор (_guide.tsx,
// choice.ts, steps.tsx), проверка, настройка проекта (ссылками на страницы конфига, токенов, темы…), что лежит
// в проекте, вопросы и ответы (что выбрать и что делать, если что-то не так). Справа — оглавление (от 1200px);
// на телефоне те же разделы — в быстром переходе.

import { BookOpen } from "@boxicons/react/BookOpen";
import { Code as CodeIcon } from "@boxicons/react/Code";
import { Cog } from "@boxicons/react/Cog";
import { History } from "@boxicons/react/History";
import { Moon } from "@boxicons/react/Moon";
import { Palette } from "@boxicons/react/Palette";
import { Ruler } from "@boxicons/react/Ruler";
import { Shapes } from "@boxicons/react/Shapes";
import { Terminal } from "@boxicons/react/Terminal";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { version } from "../../../../../package.json";
import { Accordion } from "../../../_docs/accordion";
import {
  Callout,
  Code,
  CodeBlock,
  DocHeader,
  FileTree,
  Heading,
  Lead,
  LinkCards,
  type TreeItem,
} from "../../../_docs/docs";
import { Toc, type TocItem } from "../../../_docs/toc";
import { InstallGuide } from "./_guide";
import { PLATFORMS } from "./choice";

export const metadata: Metadata = { title: "Установка и настройка" };

const TOC: TocItem[] = [
  { id: "install", title: "Установка" },
  { id: "check", title: "Проверка" },
  { id: "setup", title: "Настройка проекта" },
  { id: "files", title: "Что в проекте" },
  { id: "faq", title: "Вопросы и ответы" },
];

const SETUP = [
  {
    href: "/docs/code/config",
    title: "Конфиг",
    text: "rendit.config.mjs: где искать классы, брейкпоинты, safelist.",
    Icon: Cog,
  },
  {
    href: "/docs/scss/tokens",
    title: "Токены",
    text: "Свои цвета, тени и скругления — классы появятся сами.",
    Icon: Palette,
  },
  {
    href: "/docs/scss/colors",
    title: "Цвета и тема",
    text: "Смысловые цвета и тёмная тема через data-theme.",
    Icon: Moon,
  },
  {
    href: "/docs/code/variants",
    title: "Варианты",
    text: "Брейкпоинты md:, max-md:, состояния hover:, dark: и другие.",
    Icon: Ruler,
  },
  {
    href: "/docs/code/cli",
    title: "Команды",
    text: "dev, build, watch и check — что делает каждая.",
    Icon: Terminal,
  },
  {
    href: "/docs/code/vscode",
    title: "VS Code",
    text: "Подсказки классов и CSS при наведении.",
    Icon: CodeIcon,
  },
];

const NEXT = [
  {
    href: "/docs/components",
    title: "Компоненты",
    text: "Готовые компоненты с кодом под каждый стек.",
    Icon: Shapes,
  },
  {
    href: "/docs/releases",
    title: "Обновления",
    text: "Что нового в каждой версии RenDit UI.",
    Icon: History,
  },
  {
    href: "/docs",
    title: "Обзор справки",
    text: "Из чего состоит RenDit UI и все разделы.",
    Icon: BookOpen,
  },
];

// что попадает в проект: движок и RenDit SCSS
const TREE: TreeItem[] = [
  {
    name: "rendit.config.mjs",
    note: "настройки движка; по нему подсказки VS Code находят проект",
  },
  {
    name: "rendit-code/",
    note: "движок RenDit Code",
    children: [
      { name: "cli.mjs", note: "команды: dev, build, watch, check" },
      { name: "core/", note: "парсер, утилиты, варианты, генератор" },
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
      { name: "settings/", note: "токены: цвета, тени, скругления, пружины" },
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
];

// перед установкой — что выбрать, если всё это впервые
const BEFORE: { q: string; a: ReactNode }[] = [
  {
    q: "Что такое RenDit Code и нужен ли он?",
    a: (
      <p>
        Это движок: он читает вашу разметку и собирает CSS только для тех
        классов, что в ней есть, — <Code>p-20</Code>, <Code>md:flex</Code>,{" "}
        <Code>hover:bg-primary</Code>. Похоже на Tailwind, но на токенах RenDit.
        Пишете стили сами — выберите «Без движка»: останутся токены, база и
        сетка RenDit SCSS.
      </p>
    ),
  },
  {
    q: "SCSS или CSS — что выбрать?",
    a: (
      <p>
        SCSS — если в своих файлах нужны миксины RenDit (<Code>up(md)</Code>,{" "}
        <Code>hover</Code>) и короткое подключение токенов; понадобится Sass.
        CSS — если Sass в проекте не нужен: RenDit UI подключается готовым
        файлом, токены работают как обычные переменные (
        <Code>var(--primary)</Code>).
      </p>
    ),
  },
  {
    q: "Можно ли без Node.js?",
    a: (
      <p>
        Да — выберите «HTML» и подключите готовый CSS: заработают токены, база,
        сетка и тёмная тема. Классы движка вроде <Code>p-20</Code> и{" "}
        <Code>md:flex</Code> собираются на Node.js — без него их не будет.
      </p>
    ),
  },
];

// если что-то не так — частые проблемы после установки
const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "Класс написан, а стиля нет",
    a: (
      <>
        <p>
          Движок читает исходники как текст и видит только классы, написанные
          целиком. <Code>{`bg-\${color}`}</Code> он не соберёт — пишите полные
          строки (<Code>{'active ? "bg-primary" : "bg-surface"'}</Code>) или
          добавьте классы в <Code>safelist</Code>.
        </p>
        <p>
          Проверить класс:{" "}
          <Code>node rendit-code/cli.mjs check имя-класса</Code> — опечатку
          движок отметит строкой «✖ не утилита».
        </p>
      </>
    ),
  },
  {
    q: "Новые классы появляются только после перезапуска",
    a: (
      <p>
        Сайт запущен без движка — напрямую <Code>next dev</Code> или{" "}
        <Code>vite</Code>. Запускайте <Code>npm run dev</Code> (движок вместе с
        Next.js) или держите <Code>node rendit-code/cli.mjs watch</Code> в
        соседнем терминале.
      </p>
    ),
  },
  {
    q: "Sass: Can't find stylesheet to import",
    a: (
      <p>
        Не настроены короткие пути: <Code>sassOptions.loadPaths</Code> в конфиге
        Next.js, <Code>css.preprocessorOptions.scss.loadPaths</Code> в конфиге
        Vite или <Code>--load-path</Code> у команды sass — шаг «Разрешите
        короткие пути в SCSS».
      </p>
    ),
  },
  {
    q: "Тёмная тема не включается",
    a: (
      <p>
        Токены переключает атрибут <Code>data-theme="dark"</Code> на{" "}
        <Code>&lt;html&gt;</Code> — подробнее в «Цвета и тема».
      </p>
    ),
  },
  {
    q: "Движок пропустил класс со своим значением",
    a: (
      <p>
        Классы с <Code>{"{ } ;"}</Code>, комментариями и непарными кавычками
        отбрасываются — так чужой код, например из конструктора, не допишет в
        CSS лишнее. Пробелы в значении — через подчёркивание:{" "}
        <Code>grid-cols-[1fr_auto]</Code>.
      </p>
    ),
  },
];

const CHIP = "flex items-center gap-6 h-30 px-12 br-full border bg-surface";

export default function InstallPage() {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["Установка и настройка"]}
          title="Установка и настройка"
          lead={
            <>
              RenDit UI — стили, токены и классы для вашего сайта. Выберите, на
              чём сделан проект, и ответьте на пару вопросов: ниже появятся шаги
              именно для него — обычно это несколько минут.
            </>
          }
        >
          <ul className="flex flex-wrap gap-8 pt-2 font-12 font-w-500">
            <li className={CHIP}>
              <span className="size-7 br-full bg-accent" aria-hidden="true" />
              Версия {version}
            </li>
            <li className={CHIP}>
              {PLATFORMS.filter((p) => p.id !== "html")
                .map((p) => `${p.title} ${p.version}`)
                .join(" · ")}
            </li>
            <li className={CHIP}>Лицензия MIT</li>
          </ul>
        </DocHeader>

        <section className="reveal flex flex-col gap-20">
          <Heading id="install">Установка</Heading>
          <Callout>
            Пакета в npm пока нет: до версии 1.0 файлы берутся из репозитория
            RenDit UI и копируются в проект целиком — так их легко менять под
            себя.
          </Callout>
          <InstallGuide />
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="check">Проверка</Heading>
          <Lead>
            Откройте страницу с примером из шага «Готово»: выглядит как на
            картинке — стили подключены. С движком можно проверить и в
            терминале: покажите ему пару классов — он ответит готовым CSS,
            значит, токены прочитаны и всё на месте.
          </Lead>
          <CodeBlock
            terminal
            code="node rendit-code/cli.mjs check p-20 md:hover:bg-primary/50"
          />
          <CodeBlock
            lang="css"
            code={`@layer utilities {
  .p-20 {
    padding: 20px;
  }
  @media (width >= 770px) {
    @media (hover: hover) and (pointer: fine) {
      .md\\:hover\\:bg-primary\\/50:hover {
        background-color: color-mix(in oklab, var(--primary) 50%, transparent);
      }
    }
  }
}`}
          />
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="setup">Настройка проекта</Heading>
          <Lead>
            Всё работает без настроек. Понадобится своё — вот где что меняется:
          </Lead>
          <LinkCards label="Настройка проекта" items={SETUP} />
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="files">Что в проекте</Heading>
          <Lead>
            Всё лежит обычными файлами — ничего не спрятано в node_modules.
            Меняйте токены, конфиг и даже сам движок. Без движка в проекте
            только папка <Code>src/assets/scss/</Code>.
          </Lead>
          <FileTree root="ваш-проект/" items={TREE} />
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="faq">Вопросы и ответы</Heading>
          {[
            { label: "Перед установкой", items: BEFORE },
            { label: "Если что-то не так", items: FAQ },
          ].map(({ label, items }) => (
            <div key={label} className="flex flex-col gap-8 pt-6">
              <h3 className="font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
                {label}
              </h3>
              {items.map(({ q, a }) => (
                <Accordion key={q} question={q}>
                  {a}
                </Accordion>
              ))}
            </div>
          ))}
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
