// Шаги установки под выбор (choice.ts): платформа, язык (TS/JS), стили (SCSS/CSS), движок, редактор (подсказки
// в VS Code), скрипты (JS/jQuery).
// Шаги собираются из общих кусков, имена файлов и примеры подстраиваются: layout.tsx ↔ layout.jsx,
// next.config.ts ↔ next.config.mjs, button.module.scss ↔ button.module.css.

import { Code, CodeBlock, Files, type Step } from "../../../_docs/docs";
import { InstallCommand } from "../../../_docs/install-command";
import type { Choice } from "./choice";

export type Guide = { lead: string; steps: Step[]; done: Step };

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

const sass = (text: Step["text"]): Step => ({
  title: "Поставьте Sass",
  text,
  block: <InstallCommand pkg="sass" dev />,
});

const BUILD_ONCE = "npx sass src/assets/scss/RenDit_UI.scss rendit-ui.css";

// готовый CSS без Sass: файл из релиза (с 1.0) или собранный один раз
const prebuilt = (to: string): Step => ({
  title: "Возьмите готовый CSS",
  text: (
    <>
      Готовый <Code>rendit-ui.css</Code> появится в релизах с версии 1.0. Пока
      соберите его один раз там, где есть Node.js, и положите в{" "}
      <Code>{to}</Code>:
    </>
  ),
  block: <CodeBlock terminal code={BUILD_ONCE} />,
});

const BUTTON_CLASSES = `<button className="px-16 py-8 br-full bg-primary text-primary-foreground hover:bg-primary-hover">
  Кнопка
</button>`;

// живой результат примеров «Готово» — те же классы и токены, что в коде шага
const BUTTON = (
  <button
    type="button"
    className="px-16 py-8 br-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
  >
    Кнопка
  </button>
);

const CARD = (
  <div className="w-full max-w-280 p-20 border br-xl bg-surface shadow-2">
    <p className="font-15 font-w-600">Карточка</p>
    <p className="font-13 text-foreground-muted">
      Отступы, рамка, скругление и тень — из токенов RenDit
    </p>
  </div>
);

const MODULE: Record<Choice["styles"], string> = {
  scss: `@use "tools/mixins" as *;

.button {
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-foreground);
  @include hover { background: var(--primary-hover); }
}`,
  css: `.button {
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--primary);
  color: var(--primary-foreground);
}`,
};

const CARD_CSS = `.card {
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow-2);
}`;

// свои стили модулем — у SCSS ещё миксины RenDit (наведение, брейкпоинты)
const ownModule = (c: Choice): Step => ({
  title: "Свои стили",
  optional: true,
  text:
    c.styles === "scss"
      ? "Модулями на токенах — с миксинами RenDit, тёмная тема переключится сама:"
      : "Модулями на токенах — тёмная тема переключится сама:",
  block: (
    <CodeBlock file={`button.module.${c.styles}`} code={MODULE[c.styles]} />
  ),
});

// подсказки классов в VS Code — расширение из rendit-code/vscode; только с движком и если выбран VS Code
const VSCODE: Step = {
  title: "Поставьте подсказки в VS Code",
  optional: true,
  recommended: true,
  text: (
    <>
      Расширение RenDit Code IntelliSense дописывает классы и варианты (
      <Code>hover:</Code>, <Code>md:</Code>), показывает их CSS при наведении и
      образцы цвета. Подсказки берёт у движка вашего проекта — они всегда
      совпадают с CSS.
    </>
  ),
  block: (
    <CodeBlock
      terminal
      code={`node rendit-code/vscode/install.mjs
# затем в VS Code: Ctrl+Shift+P → Developer: Reload Window`}
    />
  ),
};

const editor = (c: Choice) =>
  c.engine === "code" && c.editor === "vscode" ? [VSCODE] : [];

// «Готово» без движка: стили подключены — пример своего модуля и как он выглядит
const ownModuleDone = (c: Choice): Step => ({
  ...ownModule(c),
  title: "Готово",
  optional: false,
  text: (
    <>
      Стили подключены. Свои пишите модулями на токенах RenDit
      {c.styles === "scss" ? " — с миксинами" : ""}, тёмная тема переключится
      сама:
    </>
  ),
  result: BUTTON,
});

// ── Next.js ─────────────────────────────────────────────────────────────────

function nextjs(c: Choice): Guide {
  const x = c.lang === "ts" ? "tsx" : "jsx";
  const config: Step = {
    title: "Разрешите короткие пути в SCSS",
    text: (
      <>
        Тогда в модулях работает <Code>@use "tools/mixins"</Code> — без{" "}
        <Code>../../</Code>.
      </>
    ),
    block:
      c.lang === "ts" ? (
        <CodeBlock
          file="next.config.ts"
          code={`import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src/assets/scss")],
  },
};

export default nextConfig;`}
        />
      ) : (
        <CodeBlock
          file="next.config.mjs"
          code={`import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src/assets/scss")],
  },
};

export default nextConfig;`}
        />
      ),
  };
  const lead =
    "App Router, CSS Modules. Так устроен и этот сайт — на Next.js 16.";

  if (c.engine === "code")
    return {
      lead,
      steps: [
        {
          title: "Скопируйте файлы",
          text: "Из репозитория RenDit UI — в корень проекта, рядом с package.json:",
          block: ENGINE_FILES,
        },
        sass("Из него движок читает токены — цвета, тени, скругления."),
        {
          title: "Запускайте сайт через движок",
          text: (
            <>
              Замените команды в <Code>package.json</Code>: <Code>dev</Code>{" "}
              движка следит за классами и сам запускает <Code>next dev</Code>,{" "}
              <Code>build</Code> собирает CSS перед сборкой сайта.
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
        ...(c.styles === "scss" ? [config] : []),
        {
          title: "Подключите стили",
          text: "В корневом layout — сначала RenDit SCSS, затем классы движка:",
          block: (
            <CodeBlock
              file={`src/app/layout.${x}`}
              code={`import "@/assets/scss/RenDit_UI.scss";
import "@/assets/scss/generated/rendit-code.css";`}
            />
          ),
        },
        ...editor(c),
        ownModule(c),
      ],
      done: {
        title: "Готово",
        text: (
          <>
            Запустите <Code>npm run dev</Code> и пишите классы — CSS для них
            появится сам:
          </>
        ),
        block: <CodeBlock file={`src/app/page.${x}`} code={BUTTON_CLASSES} />,
        result: BUTTON,
      },
    };

  if (c.styles === "scss")
    return {
      lead,
      steps: [
        {
          title: "Скопируйте RenDit SCSS",
          text: "Только папку стилей — движок не нужен:",
          block: SCSS_FILES,
        },
        sass("Им собираются стили RenDit SCSS."),
        config,
        {
          title: "Подключите стили",
          text: "В корневом layout:",
          block: (
            <CodeBlock
              file={`src/app/layout.${x}`}
              code={`import "@/assets/scss/RenDit_UI.scss";`}
            />
          ),
        },
      ],
      done: ownModuleDone(c),
    };

  return {
    lead,
    steps: [
      prebuilt("src/styles/"),
      {
        title: "Подключите стили",
        text: "В корневом layout — Sass проекту не нужен:",
        block: (
          <CodeBlock
            file={`src/app/layout.${x}`}
            code={`import "@/styles/rendit-ui.css";`}
          />
        ),
      },
    ],
    done: ownModuleDone(c),
  };
}

// ── React (Vite) ────────────────────────────────────────────────────────────

function react(c: Choice): Guide {
  const x = c.lang === "ts" ? "tsx" : "jsx";
  const vite = c.lang === "ts" ? "vite.config.ts" : "vite.config.js";
  const lead = "React без Next.js — на Vite.";
  const config: Step = {
    title: "Разрешите короткие пути в SCSS",
    text: (
      <>
        Тогда работает <Code>@use "tools/mixins"</Code>:
      </>
    ),
    block: (
      <CodeBlock
        file={vite}
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
  };

  if (c.engine === "code")
    return {
      lead,
      steps: [
        {
          title: "Скопируйте файлы",
          text: "Из репозитория RenDit UI — в корень проекта Vite:",
          block: ENGINE_FILES,
        },
        sass("Из него движок читает токены — цвета, тени, скругления."),
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
        ...(c.styles === "scss" ? [config] : []),
        {
          title: "Подключите стили",
          text: "В точке входа:",
          block: (
            <CodeBlock
              file={`src/main.${x}`}
              code={`import "./assets/scss/RenDit_UI.scss";
import "./assets/scss/generated/rendit-code.css";`}
            />
          ),
        },
        ...editor(c),
        ownModule(c),
      ],
      done: {
        title: "Готово",
        text: (
          <>
            Запустите в двух терминалах <Code>npm run rendit</Code> и{" "}
            <Code>npm run dev</Code> — и пишите классы в JSX:
          </>
        ),
        block: <CodeBlock file={`src/App.${x}`} code={BUTTON_CLASSES} />,
        result: BUTTON,
      },
    };

  if (c.styles === "scss")
    return {
      lead,
      steps: [
        {
          title: "Скопируйте RenDit SCSS",
          text: "Только папку стилей — движок не нужен:",
          block: SCSS_FILES,
        },
        sass("Vite соберёт им стили RenDit SCSS."),
        config,
        {
          title: "Подключите стили",
          text: "В точке входа:",
          block: (
            <CodeBlock
              file={`src/main.${x}`}
              code={`import "./assets/scss/RenDit_UI.scss";`}
            />
          ),
        },
      ],
      done: ownModuleDone(c),
    };

  return {
    lead,
    steps: [
      prebuilt("src/styles/"),
      {
        title: "Подключите стили",
        text: "В точке входа — Sass проекту не нужен:",
        block: (
          <CodeBlock
            file={`src/main.${x}`}
            code={`import "./styles/rendit-ui.css";`}
          />
        ),
      },
    ],
    done: ownModuleDone(c),
  };
}

// ── Node.js без фреймворка: статический сайт, шаблоны, свой сборщик ─────────

const NODE_SCSS = `@use "RenDit_UI";
@use "tools/mixins" as *;

.card {
  padding: 16px;
  @include up(md) { padding: 24px; }   // = классу md:p-24
}`;

function node(c: Choice): Guide {
  const lead =
    "Любой проект, где есть Node.js: статический сайт, шаблоны, свой сборщик.";
  const scssScript =
    "sass --load-path=src/assets/scss --watch styles:public/css";

  if (c.engine === "code")
    return {
      lead,
      steps: [
        {
          title: "Скопируйте файлы",
          text: "Из репозитория RenDit UI — в папку проекта:",
          block: ENGINE_FILES,
        },
        sass(
          <>
            Движок читает из него токены. Нет <Code>package.json</Code> —
            сначала выполните <Code>npm init -y</Code>.
          </>,
        ),
        {
          title: "Укажите, где разметка",
          text: "Папки и расширения шаблонов — движок соберёт классы из них:",
          block: (
            <CodeBlock
              file="rendit.config.mjs"
              code={`export default {
  content: ["views"],                        // где разметка
  extensions: ["html", "ejs", "njk", "js"],  // какие файлы читать
  output: "public/css/rendit-code.css",      // куда писать CSS классов
};`}
            />
          ),
        },
        {
          title: "Добавьте команды",
          text:
            c.styles === "scss"
              ? "Движок следит за классами, Sass — за вашими стилями с миксинами RenDit:"
              : "Движок следит за классами; RenDit UI соберите один раз:",
          block:
            c.styles === "scss" ? (
              <CodeBlock
                file="package.json"
                code={`"scripts": {
  "rendit": "node rendit-code/cli.mjs watch",
  "css": "${scssScript}"
}`}
              />
            ) : (
              <CodeBlock
                terminal
                code={`npx sass src/assets/scss/RenDit_UI.scss public/css/rendit-ui.css
node rendit-code/cli.mjs watch`}
              />
            ),
        },
        ...(c.styles === "scss"
          ? [
              {
                title: "Подключите RenDit SCSS в свой файл",
                text: "Токены, база и миксины — одной строкой:",
                block: <CodeBlock file="styles/main.scss" code={NODE_SCSS} />,
              },
            ]
          : []),
        {
          title: "Подключите CSS в разметку",
          text: "В каждую страницу или общий шаблон:",
          block: (
            <CodeBlock
              file="views/layout.html"
              code={
                c.styles === "scss"
                  ? `<link rel="stylesheet" href="/css/main.css">
<link rel="stylesheet" href="/css/rendit-code.css">`
                  : `<link rel="stylesheet" href="/css/rendit-ui.css">
<link rel="stylesheet" href="/css/rendit-code.css">`
              }
            />
          ),
        },
        ...editor(c),
      ],
      done: {
        title: "Готово",
        text: (
          <>
            Пишите классы в <Code>class="…"</Code> — пока работает{" "}
            <Code>watch</Code>, CSS обновляется при каждом сохранении:
          </>
        ),
        block: (
          <CodeBlock
            file="views/index.html"
            code={`<button class="px-16 py-8 br-full bg-primary text-primary-foreground hover:bg-primary-hover">
  Кнопка
</button>`}
          />
        ),
        result: BUTTON,
      },
    };

  if (c.styles === "scss")
    return {
      lead,
      steps: [
        {
          title: "Скопируйте RenDit SCSS",
          text: "Только папку стилей — движок не нужен:",
          block: SCSS_FILES,
        },
        sass(
          <>
            Нет <Code>package.json</Code> — сначала выполните{" "}
            <Code>npm init -y</Code>.
          </>,
        ),
        {
          title: "Добавьте команду",
          text: "Sass собирает ваши стили вместе с RenDit SCSS при каждом сохранении:",
          block: (
            <CodeBlock
              file="package.json"
              code={`"scripts": {
  "css": "${scssScript}"
}`}
            />
          ),
        },
        {
          title: "Подключите RenDit SCSS в свой файл",
          text: "Токены, база и миксины — одной строкой:",
          block: <CodeBlock file="styles/main.scss" code={NODE_SCSS} />,
        },
      ],
      done: {
        title: "Готово",
        text: "Подключите собранный CSS в разметку:",
        block: (
          <CodeBlock
            file="views/layout.html"
            code={`<link rel="stylesheet" href="/css/main.css">`}
          />
        ),
      },
    };

  return {
    lead,
    steps: [
      {
        title: "Соберите RenDit UI в один CSS",
        text: "Один раз — дальше это обычный файл:",
        block: (
          <CodeBlock
            terminal
            code="npx sass src/assets/scss/RenDit_UI.scss public/css/rendit-ui.css"
          />
        ),
      },
      {
        title: "Подключите стили",
        text: "Сначала RenDit UI, затем свои:",
        block: (
          <CodeBlock
            file="views/layout.html"
            code={`<link rel="stylesheet" href="/css/rendit-ui.css">
<link rel="stylesheet" href="/css/style.css">`}
          />
        ),
      },
    ],
    done: {
      title: "Готово",
      text: "Свои стили — на токенах, тема переключится сама:",
      block: <CodeBlock file="public/css/style.css" code={CARD_CSS} />,
      result: CARD,
    },
  };
}

// ── HTML без Node.js ────────────────────────────────────────────────────────

function html(c: Choice): Guide {
  return {
    lead: "Обычные HTML-страницы без Node.js и сборки: готовый CSS, а у компонентов — готовый код.",
    steps: [
      {
        title: "Подключите стили",
        text: (
          <>
            Готовый <Code>rendit-ui.css</Code> появится в релизах с версии 1.0;
            пока его один раз собирают там, где есть Node.js (выберите
            «Node.js», без движка, CSS).
          </>
        ),
        block: (
          <CodeBlock
            file="index.html"
            code={`<link rel="stylesheet" href="css/rendit-ui.css">
<link rel="stylesheet" href="css/style.css">`}
          />
        ),
      },
      c.script === "jquery"
        ? {
            title: "Подключите jQuery",
            text: "Компоненты отдадут код на jQuery 3.6+ — подключите её перед их скриптами:",
            block: (
              <CodeBlock
                file="index.html"
                code={`<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="js/component.jquery.js"></script>`}
              />
            ),
          }
        : {
            title: "Скрипты компонентов",
            text: "Обычный JavaScript без библиотек — перед </body>, с defer:",
            block: (
              <CodeBlock
                file="index.html"
                code={`<script src="js/component.js" defer></script>`}
              />
            ),
          },
    ],
    done: {
      title: "Готово",
      text: (
        <>
          Цвета, тени и скругления — CSS-переменными, тема переключится сама.
          Классы вроде <Code>p-20</Code> и <Code>md:flex</Code> собирает движок
          на Node.js — для них выберите «Node.js».
        </>
      ),
      block: <CodeBlock file="css/style.css" code={CARD_CSS} />,
      result: CARD,
    },
  };
}

export function buildGuide(choice: Choice): Guide {
  switch (choice.platform) {
    case "nextjs":
      return nextjs(choice);
    case "react":
      return react(choice);
    case "node":
      return node(choice);
    case "html":
      return html(choice);
  }
}
