// Тёмная тема: песочница (кусок интерфейса в любой теме), как устроена, что меняется (токены светлой и тёмной
// темы рядом), подключение в Next.js, React и HTML без мигания, тема системы, вариант dark:, кусок страницы в
// другой теме, цвет панели браузера, проверка. Цвета обеих тем подробно — на странице «Цвета».

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { extraCss } from "../../../../_docs/class-css";
import {
  Code,
  CodeBlock,
  DocHeader,
  Example,
  Heading,
  Lead,
  Table,
} from "../../../../_docs/docs";
import { Toc, type TocItem } from "../../../../_docs/toc";
import { ThemeInstall } from "./_install";
import { ThemeSwitcherBuilder } from "./_switcher";
import { classesOf, htmlCode, VARIANTS } from "./_switcher-code";
import { ThemePreview } from "./_tools";

export const metadata: Metadata = { title: "Тёмная тема" };

const TOC: TocItem[] = [
  { id: "switcher", title: "Конструктор переключателя" },
  { id: "try", title: "Попробуйте" },
  { id: "how", title: "Как устроена" },
  { id: "diff", title: "Что меняется" },
  { id: "setup", title: "Установка" },
  { id: "best", title: "Лучшие приёмы" },
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

// лучшие приёмы тёмной темы — [заголовок, пояснение]
const BEST: [string, string][] = [
  [
    "Тема до первой отрисовки",
    "Встроенный скрипт в <head> или next-themes — иначе светлая вспышка при загрузке.",
  ],
  [
    "По умолчанию — как в системе",
    "prefers-color-scheme, пока человек сам не выбрал; следить за её сменой на лету.",
  ],
  [
    "color-scheme",
    "Браузер сам красит поля ввода, полосы прокрутки и диалоги под тему.",
  ],
  [
    "Без перетекания при смене",
    "На миг выключить переходы (disableTransitionOnChange или data-switching).",
  ],
  [
    "Без расхождения с сервером",
    "Обе иконки в разметке, видимую выбирает CSS — гидратации нечего исправлять.",
  ],
  [
    "Панель браузера в тон",
    "theme-color с media и скрипт по выбранной теме — строка состояния не «прыгает».",
  ],
];
export default async function DarkPage() {
  // HTML-код переключателя: классы, которых нет в готовом CSS, — CSS для каждого варианта (движок, при сборке)
  const styles = Object.fromEntries(
    await Promise.all(
      VARIANTS.map(async (v) => [
        v.key,
        await extraCss(classesOf(htmlCode(v.kind, v.animate, v.labels))),
      ]),
    ),
  );
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["Основы", "Тёмная тема"]}
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

        <section className="relative z-2 flex flex-col gap-16">
          <Heading id="switcher">Конструктор переключателя</Heading>
          <Lead>
            Соберите кнопку темы для своего сайта: иконка с анимацией, как в
            шапке здесь, ползунок, три кнопки или список. Нажмите на пример — он
            переключит тему у себя; код — для Next.js и React или чистого JS.
          </Lead>
          <ThemeSwitcherBuilder styles={styles} />
        </section>
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

        <section className="flex flex-col gap-16">
          <Heading id="setup">Установка как на этом сайте</Heading>
          <Lead>
            Выберите, на чём ваш проект, — шаги именно для него. Везде одни
            правила: тема ставится до первой отрисовки (без вспышки), по
            умолчанию — как в системе, выбор запоминается.
          </Lead>
          <ThemeInstall />
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="best">Лучшие приёмы 2026</Heading>
          <ul className="grid sm:grid-cols-2 gap-10">
            {BEST.map(([title, text]) => (
              <li
                key={title}
                className="flex flex-col gap-4 p-14 br-lg border bg-surface"
              >
                <span className="font-14 font-w-600">{title}</span>
                <span className="font-13 text-foreground-muted">{text}</span>
              </li>
            ))}
          </ul>
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
