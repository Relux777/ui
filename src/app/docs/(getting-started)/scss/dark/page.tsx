// Тёмная тема: песочница (кусок интерфейса в любой теме), как устроена, что меняется (токены светлой и тёмной
// темы рядом), подключение в Next.js, React и HTML без мигания, тема системы, вариант dark:, кусок страницы в
// другой теме, цвет панели браузера, проверка. Цвета обеих тем подробно — на странице «Цвета».

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Code,
  CodeBlock,
  DocHeader,
  Example,
  Heading,
  Lead,
  Steps,
  Table,
} from "../../../../_docs/docs";
import { Toc, type TocItem } from "../../../../_docs/toc";
import { ThemePreview } from "./_tools";

export const metadata: Metadata = { title: "Тёмная тема" };

const TOC: TocItem[] = [
  { id: "try", title: "Попробуйте" },
  { id: "how", title: "Как устроена" },
  { id: "diff", title: "Что меняется" },
  { id: "setup", title: "Подключение" },
  { id: "system", title: "Тема системы" },
  { id: "variant", title: "Вариант dark:" },
  { id: "island", title: "Кусок в другой теме" },
  { id: "browser", title: "Панель браузера" },
  { id: "check", title: "Проверка" },
];

// образец токена в своей теме: островок data-theme, цвет — переменной
function Swatch({ theme, token }: { theme: "light" | "dark"; token: string }) {
  return (
    <span
      data-theme={theme}
      className="inline-grid place-items-center size-28 br-md border bg-background"
    >
      <span
        className="size-20 br-sm border border-foreground/10"
        style={{ background: `var(--${token})` }}
      />
    </span>
  );
}

// [токен, светлая, тёмная] — значения из settings/_tokens.semantic.scss
const DIFF: [string, string, string][] = [
  ["background", "gray-50", "#070707"],
  ["surface", "white", "gray-900"],
  ["surface-muted", "gray-100", "gray-800"],
  ["foreground", "gray-950", "gray-50"],
  ["foreground-muted", "gray-500", "gray-400"],
  ["primary", "gray-950", "gray-50"],
  ["secondary", "violet-500", "violet-400"],
  ["accent", "lime-300", "lime-300"],
  ["success", "green-600", "green-400"],
  ["danger", "red-500", "red-400"],
  ["border", "gray-200", "gray-800"],
];

const ROWS: ReactNode[][] = DIFF.map(([token, light, dark]) => [
  <Code key="t">{token}</Code>,
  <span key="l" className="flex items-center gap-8">
    <Swatch theme="light" token={token} />
    <span className="font-13 font-mono text-foreground-muted">{light}</span>
  </span>,
  <span key="d" className="flex items-center gap-8">
    <Swatch theme="dark" token={token} />
    <span className="font-13 font-mono text-foreground-muted">{dark}</span>
  </span>,
]);

// встроенный скрипт без мигания: тема ставится до первой отрисовки
const NO_FLASH = `<script>
  // выбранная тема или тема системы — до первой отрисовки, без мигания
  const saved = localStorage.getItem("theme");
  const dark = saved === "dark" ||
    (saved !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
</script>`;

const TOGGLE = `const root = document.documentElement;
const next = root.dataset.theme === "dark" ? "light" : "dark";
root.dataset.theme = next;
localStorage.setItem("theme", next);`;

export default function DarkPage() {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["RenDit SCSS", "Тёмная тема"]}
          title="Тёмная тема"
          lead={
            <>
              Одна строка — атрибут <Code>data-theme="dark"</Code> на{" "}
              <Code>&lt;html&gt;</Code>: смысловые цвета, тени и подсветка кода
              берут тёмные значения. Классы в разметке не меняются — писать
              второй набор стилей не нужно.
            </>
          }
        />

        <section className="flex flex-col gap-16">
          <Heading id="try">Попробуйте</Heading>
          <Lead>
            Пример ниже живёт в своей теме — переключайте, сайт при этом
            остаётся как был.
          </Lead>
          <ThemePreview />
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="how">Как устроена</Heading>
          <Lead>
            Компоненты пишут смысл (<Code>bg-surface</Code>,{" "}
            <Code>text-foreground</Code>), а значения смысловых токенов лежат в{" "}
            <Code>settings/_tokens.semantic.scss</Code> дважды: для светлой темы
            и под <Code>[data-theme='dark']</Code>. Атрибут переключает весь
            набор сразу.
          </Lead>
          <CodeBlock
            file="src/assets/scss/settings/_tokens.semantic.scss"
            code={`:root, [data-theme='light'] {
  --surface: var(--white);
  --foreground: var(--gray-950);
}

[data-theme='dark'] {
  --surface: var(--gray-900);
  --foreground: var(--gray-50);
}`}
          />
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="diff">Что меняется</Heading>
          <Lead>
            Фоны темнеют, текст светлеет, цветные акценты в тёмной теме на
            ступень светлее — чтобы хватало контраста. Лаймовый акцент
            одинаковый: он и так яркий.
          </Lead>
          <Table head={["Токен", "Светлая", "Тёмная"]} rows={ROWS} />
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="setup">Подключение</Heading>
          <Lead>
            Главное — поставить атрибут до первой отрисовки, иначе страница
            мигнёт светлой. Выберите свой случай:
          </Lead>
          <Steps
            steps={[
              {
                title: "Next.js — next-themes",
                text: "Помнит выбор, по умолчанию берёт тему системы и сам ставит атрибут без мигания:",
                block: (
                  <CodeBlock
                    file="src/app/layout.tsx"
                    code={`<html lang="ru" suppressHydrationWarning>
  <body>
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  </body>
</html>`}
                  />
                ),
              },
              {
                title: "React на Vite и HTML — свой скрипт",
                text: (
                  <>
                    Первым в <Code>&lt;head&gt;</Code> — до стилей и разметки:
                  </>
                ),
                block: <CodeBlock file="index.html" code={NO_FLASH} />,
              },
              {
                title: "Кнопка темы",
                text: "Меняет атрибут и запоминает выбор:",
                block: <CodeBlock file="theme.js" code={TOGGLE} />,
              },
            ]}
            done={{
              title: "Готово",
              text: "Классы в разметке остаются прежними — тёмная тема работает везде, где цвета взяты из токенов.",
            }}
          />
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="system">Тема системы</Heading>
          <Lead>
            Пока человек сам не выбрал тему, лучше брать тему его телефона или
            компьютера — <Code>prefers-color-scheme</Code>. next-themes делает
            это с <Code>defaultTheme="system"</Code>; свой скрипт выше — тоже.
            Следить за сменой темы системы на лету:
          </Lead>
          <CodeBlock
            lang="js"
            code={`matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem("theme"))
    document.documentElement.dataset.theme = e.matches ? "dark" : "light";
});`}
          />
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="variant">Вариант dark:</Heading>
          <Lead>
            Для частных случаев, когда в тёмной теме нужно не то же самое: тень
            на тёмном почти не видна — заменим рамкой. Тема задаётся у вас иначе
            — укажите свой селектор в <Code>darkSelector</Code> конфига.
          </Lead>
          <Example
            title="Тень в светлой теме, рамка — в тёмной"
            code={`<div class="bg-surface shadow-4 dark:shadow-none dark:border">`}
          >
            <div className="grid sm:grid-cols-2 gap-10">
              {(["light", "dark"] as const).map((theme) => (
                <div
                  key={theme}
                  data-theme={theme}
                  className="p-16 br-xl bg-background text-foreground"
                >
                  <div className="p-16 br-lg bg-surface shadow-4 dark:shadow-none dark:border font-14">
                    {theme === "light" ? "Светлая: тень" : "Тёмная: рамка"}
                  </div>
                </div>
              ))}
            </div>
          </Example>
          <Example
            title="Картинка или логотип под тему"
            code={`<img class="dark:hidden" src="logo-dark.svg">
<img class="hidden dark:block" src="logo-light.svg">`}
          >
            <p className="font-14 text-foreground-muted">
              Два варианта рядом, лишний прячется классом — без JS и без
              мигания.
            </p>
          </Example>
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="island">Кусок страницы в другой теме</Heading>
          <Lead>
            Атрибут работает на любом элементе: внутри него токены своей темы.
            Так делают тёмный подвал на светлой странице или образцы в двух
            темах рядом.
          </Lead>
          <Example
            title="Светлая и тёмная рядом"
            code={`<div data-theme="light" class="bg-background text-foreground">…</div>
<div data-theme="dark" class="bg-background text-foreground">…</div>`}
          >
            <div className="grid sm:grid-cols-2 gap-10">
              {(["light", "dark"] as const).map((theme) => (
                <div
                  key={theme}
                  data-theme={theme}
                  className="flex flex-col gap-10 p-16 br-xl border bg-background text-foreground"
                >
                  <span className="font-15 font-w-600">
                    {theme === "light" ? "Светлая" : "Тёмная"}
                  </span>
                  <div className="flex flex-col gap-4 p-12 br-lg border bg-surface shadow-1">
                    <span className="font-14">Карточка</span>
                    <span className="font-13 text-foreground-muted">
                      Те же классы — свои цвета
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="browser">Панель браузера</Heading>
          <Lead>
            На телефоне панель браузера и строка состояния красятся в цвет фона
            по метатегу <Code>theme-color</Code>. Метатеги знают только тему
            системы — выбранную тему сайта им сообщает скрипт в{" "}
            <Code>&lt;head&gt;</Code>, иначе при загрузке панель на миг другого
            цвета.
          </Lead>
          <CodeBlock
            file="index.html"
            code={`<meta name="theme-color" content="#fafafb" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#070707" media="(prefers-color-scheme: dark)">
<script>
  const dark = document.documentElement.dataset.theme === "dark";
  for (const m of document.querySelectorAll('meta[name="theme-color"]'))
    m.content = dark ? "#070707" : "#fafafb";
</script>`}
          />
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="check">Проверка</Heading>
          <ul className="flex flex-col gap-8 font-14">
            {[
              "Перезагрузка в тёмной теме — без светлой вспышки",
              "Цвета только из токенов: bg-surface, а не bg-white",
              "Текст на цветном фоне — пара …-foreground",
              "Тени в тёмной теме заметны или заменены рамкой (dark:)",
              "Контраст текста — не меньше 4.5:1 (проверка на «Цветах»)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-10">
                <span className="mt-2 size-18 shrink-0 br-full grid place-items-center bg-success/12 text-success font-11 font-w-700">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Lead>
            Все цвета обеих тем и проверка контраста — на странице{" "}
            <Link
              href="/docs/scss/colors"
              className="text-secondary underline underline-offset-3"
            >
              «Цвета»
            </Link>
            .
          </Lead>
        </section>
      </div>

      <aside className="max-xl:hidden">
        <div className="sticky top-80">
          <Toc items={TOC} />
        </div>
      </aside>
    </div>
  );
}
