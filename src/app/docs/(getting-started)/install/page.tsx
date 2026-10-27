// Установка и настройка — первая вкладка «Справки». Только то, что нужно, чтобы подключить RenDit UI:
// установка под стек (Next.js, React, HTML, CSS, SCSS) с движком RenDit Code или без него, проверка,
// настройка проекта (ссылками на страницы конфига, токенов, темы…), что лежит в проекте и частые проблемы.
// Справа — оглавление (от 1200px); на телефоне те же разделы — в окне быстрого доступа.
// Всё содержимое — с сервера; интерактивны только выбор стека (_guide.tsx), менеджер пакетов и оглавление.

import { BookOpen } from "@boxicons/react/BookOpen";
import { ChevronDown } from "@boxicons/react/ChevronDown";
import { Code as CodeIcon } from "@boxicons/react/Code";
import { Cog } from "@boxicons/react/Cog";
import { History } from "@boxicons/react/History";
import { Moon } from "@boxicons/react/Moon";
import { Nodejs } from "@boxicons/react/Nodejs";
import { Palette } from "@boxicons/react/Palette";
import { Ruler } from "@boxicons/react/Ruler";
import { Sass } from "@boxicons/react/Sass";
import { Shapes } from "@boxicons/react/Shapes";
import { Terminal } from "@boxicons/react/Terminal";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { version } from "../../../../../package.json";
import {
  Callout,
  Code,
  CodeBlock,
  DocHeader,
  Files,
  Heading,
  Lead,
  LinkCards,
  type Step,
  Steps,
} from "../../../_docs/docs";
import { InstallCommand } from "../../../_docs/install-command";
import { Toc, type TocItem } from "../../../_docs/toc";
import { ENGINE_MODES, STACKS, type StackId } from "../../_nav";
import { InstallGuide } from "./_guide";

export const metadata: Metadata = { title: "Установка и настройка" };

const TOC: TocItem[] = [
  { id: "install", title: "Установка" },
  { id: "check", title: "Проверка" },
  { id: "setup", title: "Настройка проекта" },
  { id: "files", title: "Что в проекте" },
  { id: "faq", title: "Если что-то не так" },
];

// ── Установка: шаги под каждый стек и способ ────────────────────────────────

const ENGINE_FILES = (
  <Files
    items={[
      { path: "rendit.config.mjs", text: "настройки движка" },
      { path: "rendit-code/", text: "движок RenDit Code", folder: true },
      {
        path: "src/assets/scss/",
        text: "RenDit SCSS: токены, база, сетка",
        folder: true,
      },
    ]}
  />
);

const SCSS_FILES = (
  <Files
    items={[
      {
        path: "src/assets/scss/",
        text: "RenDit SCSS: токены, база, сетка",
        folder: true,
      },
    ]}
  />
);

const SASS: Step = {
  title: "Поставьте Sass",
  text: "Из него движок читает токены — цвета, тени, скругления.",
  block: <InstallCommand pkg="sass" dev />,
};

const NEXT_LOAD_PATHS: Step = {
  title: "Разрешите короткие пути в SCSS",
  text: (
    <>
      Тогда в модулях работает <Code>@use "tools/mixins"</Code> — без{" "}
      <Code>../../</Code>.
    </>
  ),
  block: (
    <CodeBlock
      file="next.config.ts"
      code={`import path from "node:path";

const nextConfig = {
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src/assets/scss")],
  },
};

export default nextConfig;`}
    />
  ),
};

const BUTTON_JSX = `<button className="px-16 py-8 br-full bg-primary text-primary-foreground hover:bg-primary-hover">
  Кнопка
</button>`;

const BUTTON_MODULE = `.button {
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-foreground);
}`;

const CARD_CSS = `.card {
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow-2);
}`;

const BUILD_SCSS = "npx sass src/assets/scss/RenDit_UI.scss css/rendit-ui.css";

// [шаги, «Готово»]
const GUIDES: Record<StackId, Record<"engine" | "plain", [Step[], Step]>> = {
  nextjs: {
    engine: [
      [
        {
          title: "Скопируйте файлы",
          text: "Из репозитория RenDit UI — в корень проекта, рядом с package.json:",
          block: ENGINE_FILES,
        },
        SASS,
        {
          title: "Запускайте сайт через движок",
          text: (
            <>
              Команда <Code>dev</Code> движка следит за классами и сама
              запускает <Code>next dev</Code>.
            </>
          ),
          block: (
            <CodeBlock
              file="package.json"
              code={`"scripts": {
  "dev": "node rendit-code/cli.mjs dev",
  "build": "node rendit-code/cli.mjs build && next build"
}`}
            />
          ),
        },
        NEXT_LOAD_PATHS,
        {
          title: "Подключите стили",
          text: "В корневом layout — сначала RenDit SCSS, затем классы движка:",
          block: (
            <CodeBlock
              file="src/app/layout.tsx"
              code={`import "@/assets/scss/RenDit_UI.scss";
import "@/assets/scss/generated/rendit-code.css";`}
            />
          ),
        },
      ],
      {
        title: "Готово",
        text: (
          <>
            Запустите <Code>npm run dev</Code> и пишите классы — CSS для них
            появится сам:
          </>
        ),
        block: <CodeBlock file="src/app/page.tsx" code={BUTTON_JSX} />,
      },
    ],
    plain: [
      [
        {
          title: "Скопируйте RenDit SCSS",
          text: "Только папку стилей — движок не нужен:",
          block: SCSS_FILES,
        },
        { ...SASS, text: "Им собираются стили RenDit SCSS." },
        NEXT_LOAD_PATHS,
        {
          title: "Подключите стили",
          text: "В корневом layout:",
          block: (
            <CodeBlock
              file="src/app/layout.tsx"
              code={`import "@/assets/scss/RenDit_UI.scss";`}
            />
          ),
        },
      ],
      {
        title: "Готово",
        text: "Оформляйте компоненты модулями на токенах — светлая и тёмная тема переключатся сами:",
        block: <CodeBlock file="button.module.scss" code={BUTTON_MODULE} />,
      },
    ],
  },
  react: {
    engine: [
      [
        {
          title: "Скопируйте файлы",
          text: "Из репозитория RenDit UI — в корень проекта Vite:",
          block: ENGINE_FILES,
        },
        SASS,
        {
          title: "Добавьте команды",
          text: (
            <>
              Команда <Code>dev</Code> движка запускает Next.js, поэтому рядом с
              Vite движок работает в режиме <Code>watch</Code> — в своём
              терминале.
            </>
          ),
          block: (
            <CodeBlock
              file="package.json"
              code={`"scripts": {
  "dev": "vite",
  "rendit": "node rendit-code/cli.mjs watch",
  "build": "node rendit-code/cli.mjs build && vite build"
}`}
            />
          ),
        },
        {
          title: "Разрешите короткие пути в SCSS",
          text: (
            <>
              Тогда работает <Code>@use "tools/mixins"</Code>:
            </>
          ),
          block: (
            <CodeBlock
              file="vite.config.ts"
              code={`import { defineConfig } from "vite";

export default defineConfig({
  // …ваши плагины
  css: {
    preprocessorOptions: {
      scss: { loadPaths: ["src/assets/scss"] },
    },
  },
});`}
            />
          ),
        },
        {
          title: "Подключите стили",
          text: "В точке входа:",
          block: (
            <CodeBlock
              file="src/main.tsx"
              code={`import "./assets/scss/RenDit_UI.scss";
import "./assets/scss/generated/rendit-code.css";`}
            />
          ),
        },
      ],
      {
        title: "Готово",
        text: (
          <>
            Запустите в двух терминалах <Code>npm run rendit</Code> и{" "}
            <Code>npm run dev</Code> — и пишите классы в JSX:
          </>
        ),
        block: <CodeBlock file="src/App.tsx" code={BUTTON_JSX} />,
      },
    ],
    plain: [
      [
        {
          title: "Скопируйте RenDit SCSS",
          text: "Только папку стилей — движок не нужен:",
          block: SCSS_FILES,
        },
        { ...SASS, text: "Vite соберёт им стили RenDit SCSS." },
        {
          title: "Подключите стили",
          text: "В точке входа:",
          block: (
            <CodeBlock
              file="src/main.tsx"
              code={`import "./assets/scss/RenDit_UI.scss";`}
            />
          ),
        },
      ],
      {
        title: "Готово",
        text: "Свои стили — на токенах, тема переключится сама:",
        block: <CodeBlock file="Button.module.scss" code={BUTTON_MODULE} />,
      },
    ],
  },
  html: {
    engine: [
      [
        {
          title: "Скопируйте файлы",
          text: "Из репозитория RenDit UI — в папку сайта:",
          block: ENGINE_FILES,
        },
        {
          ...SASS,
          text: (
            <>
              Движку и Sass нужен Node.js. Если в папке ещё нет{" "}
              <Code>package.json</Code>, сначала выполните{" "}
              <Code>npm init -y</Code>.
            </>
          ),
        },
        {
          title: "Укажите, где страницы",
          text: "И куда класть CSS классов:",
          block: (
            <CodeBlock
              file="rendit.config.mjs"
              code={`export default {
  content: ["pages"],              // папки с .html
  output: "css/rendit-code.css",   // CSS классов из страниц
};`}
            />
          ),
        },
        {
          title: "Соберите стили и запустите движок",
          text: "RenDit SCSS собирается один раз, движок следит за классами в страницах:",
          block: (
            <CodeBlock
              terminal
              code={`${BUILD_SCSS}
node rendit-code/cli.mjs watch`}
            />
          ),
        },
        {
          title: "Подключите оба файла",
          text: "В каждую страницу:",
          block: (
            <CodeBlock
              file="pages/index.html"
              code={`<link rel="stylesheet" href="../css/rendit-ui.css">
<link rel="stylesheet" href="../css/rendit-code.css">`}
            />
          ),
        },
      ],
      {
        title: "Готово",
        text: (
          <>
            Пишите классы в <Code>class="…"</Code> — пока работает{" "}
            <Code>watch</Code>, CSS обновляется при каждом сохранении:
          </>
        ),
        block: (
          <CodeBlock
            file="pages/index.html"
            code={`<button class="px-16 py-8 br-full bg-primary text-primary-foreground hover:bg-primary-hover">
  Кнопка
</button>`}
          />
        ),
      },
    ],
    plain: [
      [
        {
          title: "Соберите RenDit SCSS в один файл",
          text: "Node.js нужен только для этой команды:",
          block: <CodeBlock terminal code={BUILD_SCSS} />,
        },
        {
          title: "Подключите стили",
          text: "Сначала RenDit UI, затем свои:",
          block: (
            <CodeBlock
              file="index.html"
              code={`<link rel="stylesheet" href="css/rendit-ui.css">
<link rel="stylesheet" href="css/style.css">`}
            />
          ),
        },
      ],
      {
        title: "Готово",
        text: "Свои стили — на токенах, тема переключится сама:",
        block: <CodeBlock file="css/style.css" code={CARD_CSS} />,
      },
    ],
  },
  css: {
    engine: [
      [
        {
          title: "Соберите CSS там, где есть Node.js",
          text: (
            <>
              Проекту Node.js не нужен: файлы собираются один раз — как в
              разделе HTML, только вместо <Code>watch</Code> —{" "}
              <Code>build</Code>. Добавили новые классы — пересоберите.
            </>
          ),
          block: (
            <CodeBlock
              terminal
              code={`${BUILD_SCSS}
node rendit-code/cli.mjs build`}
            />
          ),
        },
        {
          title: "Подключите файлы",
          text: "Как обычный CSS:",
          block: (
            <CodeBlock
              file="index.html"
              code={`<link rel="stylesheet" href="css/rendit-ui.css">
<link rel="stylesheet" href="css/rendit-code.css">`}
            />
          ),
        },
      ],
      {
        title: "Готово",
        text: "Классы из страниц работают как обычный CSS — без сборщика и Node.js на сервере.",
      },
    ],
    plain: [
      [
        {
          title: "Подключите rendit-ui.css",
          text: (
            <>
              Готовый файл появится в релизах с версии 1.0, а пока соберите его
              один раз: <Code>{BUILD_SCSS}</Code>.
            </>
          ),
          block: (
            <CodeBlock
              file="index.html"
              code={`<link rel="stylesheet" href="css/rendit-ui.css">`}
            />
          ),
        },
      ],
      {
        title: "Готово",
        text: "Цвета, тени и скругления — CSS-переменными, тема переключится сама:",
        block: <CodeBlock file="css/style.css" code={CARD_CSS} />,
      },
    ],
  },
  scss: {
    engine: [
      [
        {
          title: "Поставьте RenDit UI под ваш фреймворк",
          text: "Как для Next.js, React или HTML выше: файлы, Sass, запуск движка.",
        },
        {
          title: "Берите миксины RenDit SCSS",
          text: (
            <>
              Брейкпоинты и наведение — те же, что у классов <Code>md:</Code> и{" "}
              <Code>hover:</Code>:
            </>
          ),
          block: (
            <CodeBlock
              file="panel.module.scss"
              code={`@use "tools/mixins" as *;

.panel {
  padding: 16px;
  @include up(md) { padding: 24px; }       // = классу md:p-24
  @include hover { box-shadow: var(--shadow-4); }
}`}
            />
          ),
        },
      ],
      {
        title: "Готово",
        text: "Классы и SCSS работают вместе: простое — классами в разметке, сложное — в модуле.",
      },
    ],
    plain: [
      [
        {
          title: "Скопируйте RenDit SCSS",
          text: (
            <>
              Папку <Code>src/assets/scss/</Code> — в <Code>rendit/</Code> рядом
              со своими стилями.
            </>
          ),
        },
        SASS,
        {
          title: "Подключите в главный файл",
          text: "Доступны и токены, и миксины:",
          block: (
            <CodeBlock
              file="main.scss"
              code={`@use "rendit/RenDit_UI";
@use "rendit/tools/mixins" as *;

.title {
  color: var(--foreground);
  @include down(md) { font-size: 24px; }
}`}
            />
          ),
        },
      ],
      {
        title: "Готово",
        text: "Пишите свой SCSS на токенах RenDit — тема переключится сама.",
      },
    ],
  },
};

const LEADS: Record<StackId, string> = {
  nextjs: "App Router, Sass и CSS Modules. Так устроен и этот сайт.",
  react: "React без Next.js — например, на Vite.",
  html: "Обычные HTML-страницы без сборщика.",
  css: "Только готовые CSS-файлы — проекту не нужны ни Sass, ни Node.js.",
  scss: "Свой SCSS поверх RenDit SCSS: миксины, брейкпоинты, токены.",
};

// ── Настройка, частые проблемы, дальше ──────────────────────────────────────

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
        Не настроены короткие пути: <Code>sassOptions.loadPaths</Code> в{" "}
        <Code>next.config.ts</Code> или{" "}
        <Code>css.preprocessorOptions.scss.loadPaths</Code> в{" "}
        <Code>vite.config.ts</Code> — шаг «Разрешите короткие пути в SCSS».
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
  const panels = Object.fromEntries(
    STACKS.flatMap(({ id }) =>
      ENGINE_MODES.map((mode) => {
        const [steps, done] = GUIDES[id][mode.id];
        const key = `${id}:${mode.id}`;
        return [key, <Steps key={key} steps={steps} done={done} />];
      }),
    ),
  );

  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["Установка и настройка"]}
          title="Установка и настройка"
          lead={
            <>
              RenDit UI подключается к проекту за пару минут. Выберите стек и
              способ — шаги ниже подстроятся.
            </>
          }
        >
          <ul className="flex flex-wrap gap-8 pt-2 font-12 font-w-500">
            <li className={CHIP}>
              <span className="size-7 br-full bg-accent" aria-hidden="true" />
              Версия {version}
            </li>
            <li className={CHIP}>
              <Nodejs
                width={16}
                height={16}
                className="text-green-600"
                aria-hidden="true"
              />
              Node.js 20+
            </li>
            <li className={CHIP}>
              <Sass
                width={16}
                height={16}
                className="text-pink-500"
                aria-hidden="true"
              />
              Sass
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
          <InstallGuide leads={LEADS} panels={panels} />
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="check">Проверка</Heading>
          <Lead>
            Покажите движку пару классов — он ответит готовым CSS. Значит,
            токены прочитаны и всё на месте.
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
            Меняйте токены, конфиг и даже сам движок.
          </Lead>
          <pre className="p-16 br-lg border bg-surface shadow-1 font-13/22 font-mono overflow-x-auto whitespace-pre">
            {`ваш-проект/
├── rendit.config.mjs        настройки движка (необязательно)
├── rendit-code/             движок RenDit Code
│   ├── cli.mjs              команды: dev, build, watch, check
│   └── core/                парсер, утилиты, варианты, генератор
└── src/assets/scss/         RenDit SCSS
    ├── RenDit_UI.scss       точка входа — её и подключаете
    ├── settings/            токены: цвета, тени, скругления, пружины
    ├── tools/               миксины up(), down(), hover, liquid-glass
    ├── generic/             сброс и база
    ├── layout/              .container и сетка .row
    ├── components/          .liquid-glass, .sheet, .spotlight
    └── generated/           пишет движок — не редактировать`}
          </pre>
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="faq">Если что-то не так</Heading>
          <div className="flex flex-col gap-8">
            {FAQ.map(({ q, a }) => (
              <details
                key={q}
                className="group br-lg border bg-surface shadow-1 transition-shadow open:shadow-3"
              >
                <summary className="flex items-center justify-between gap-12 px-16 py-14 font-15 font-w-600 cursor-pointer select-none [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown
                    size="sm"
                    className="shrink-0 text-foreground-muted transition-[rotate] duration-300 ease-spring group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="flex flex-col gap-10 px-16 pb-16 font-14 text-foreground-muted">
                  {a}
                </div>
              </details>
            ))}
          </div>
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
