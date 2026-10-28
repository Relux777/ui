// Тёмная тема: data-theme на <html>, подключение в Next.js, вариант dark:, кусок страницы в другой теме,
// цвет панели браузера. Сами цвета обеих тем — на странице «Цвета».

import type { Metadata } from "next";
import Link from "next/link";
import {
  Code,
  CodeBlock,
  DocHeader,
  Example,
  Heading,
  Lead,
} from "../../../../_docs/docs";

export const metadata: Metadata = { title: "Тёмная тема" };

export default function DarkPage() {
  return (
    <>
      <DocHeader
        path={["RenDit SCSS", "Тёмная тема"]}
        title="Тёмная тема"
        lead={
          <>
            Одна строка — атрибут <Code>data-theme="dark"</Code> на{" "}
            <Code>&lt;html&gt;</Code>: смысловые цвета, тени и подсветка кода
            берут тёмные значения. Классы в разметке не меняются.
          </>
        }
      />

      <section className="flex flex-col gap-14">
        <Heading id="how">Как включается</Heading>
        <Lead>
          Без атрибута — светлая тема. Тёмные значения токенов лежат в{" "}
          <Code>settings/_tokens.semantic.scss</Code> под{" "}
          <Code>[data-theme='dark']</Code>.
        </Lead>
        <CodeBlock
          lang="html"
          code={`<html data-theme="dark">   <!-- тёмная -->
<html data-theme="light">  <!-- светлая (или без атрибута) -->`}
        />
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="nextjs">В Next.js</Heading>
        <Lead>
          Удобно через next-themes: помнит выбор, по умолчанию берёт тему
          системы и ставит атрибут до первой отрисовки — без мигания.
        </Lead>
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
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="variant">Вариант dark:</Heading>
        <Lead>
          Для частных случаев, когда в тёмной теме нужно не то же самое. Тема
          задаётся у вас иначе — укажите свой селектор в{" "}
          <Code>darkSelector</Code> конфига.
        </Lead>
        <Example
          title="Тень только в светлой теме"
          code={`<div class="bg-surface shadow-4 dark:shadow-none dark:border">`}
        >
          <div className="p-20 br-xl bg-surface shadow-4 dark:shadow-none dark:border font-14">
            В тёмной теме тени не видно — вместо неё рамка.
          </div>
        </Example>
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="island">Кусок страницы в другой теме</Heading>
        <Lead>
          Атрибут работает на любом элементе: внутри него токены своей темы. Так
          на «Цветах» образцы показаны в двух темах рядом.
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
                <button
                  type="button"
                  className="self-start h-36 px-16 br-full bg-primary text-primary-foreground font-13 font-w-600"
                >
                  Кнопка
                </button>
              </div>
            ))}
          </div>
        </Example>
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="browser">Цвет панели браузера</Heading>
        <Lead>
          На телефоне панель браузера и строка состояния красятся в цвет фона.
          Выбранную тему сайта им сообщает метатег theme-color — его стоит
          ставить скриптом ещё в <Code>&lt;head&gt;</Code>, иначе при загрузке
          панель берёт тему системы и потом «перетекает». Сами цвета обеих тем —
          на странице{" "}
          <Link
            href="/docs/scss/colors"
            className="text-secondary underline underline-offset-3"
          >
            «Цвета»
          </Link>
          .
        </Lead>
      </section>
    </>
  );
}
