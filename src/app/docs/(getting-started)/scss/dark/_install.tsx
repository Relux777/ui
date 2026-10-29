"use client";

// Установка тёмной темы так, как она сделана на этом сайте, — под Next.js 16, React на Vite, HTML с чистым JS и jQuery.
// Для HTML — без модулей и сборки: готовый CSS, скрипт в <head> и кнопка из конструктора (код рабочий целиком).
// Вкладка — по платформе справки (переключатель вверху меню). Везде одни правила: атрибут data-theme ставится до первой отрисовки (без вспышки),
// по умолчанию — тема системы, выбор хранится в localStorage, цвет панели браузера — в тон.

import { useEffect, useState } from "react";
import { cdnCss } from "@/config/release";
import { Code, CodeBlock, type Step, Steps } from "../../../../_docs/docs";
import { InstallCommand } from "../../../../_docs/install-command";
import { type DocsPlatform, useDocsPlatform } from "../../../_platform";

const TABS = {
  next: "Next.js 16",
  react: "React · Vite",
  js: "JavaScript",
  jquery: "jQuery",
} as const;
type Tab = keyof typeof TABS;

// встроенный скрипт до первой отрисовки: тема и цвет панели браузера
const HEAD_SCRIPT = `<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#fafafb" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#070707" media="(prefers-color-scheme: dark)">
<script>
  // выбранная тема или тема системы — до стилей и разметки, без вспышки
  (function () {
    try {
      var saved = localStorage.getItem("theme");
      var dark = saved === "dark" ||
        (saved !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      var metas = document.querySelectorAll('meta[name="theme-color"]');
      for (var i = 0; i < metas.length; i++) metas[i].content = dark ? "#070707" : "#fafafb";
    } catch (e) {}
  })();
</script>`;

const APPLY = `// "light" | "dark" | "system": ставит data-theme, помнит выбор, красит панель браузера
export function applyTheme(mode) {
  const dark = mode === "dark" ||
    (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  // на время смены — без переходов, иначе всё перетекает по-разному
  root.dataset.switching = "";
  root.dataset.theme = dark ? "dark" : "light";
  localStorage.setItem("theme", mode);
  for (const m of document.querySelectorAll('meta[name="theme-color"]'))
    m.content = dark ? "#070707" : "#fafafb";
  requestAnimationFrame(() => requestAnimationFrame(() => delete root.dataset.switching));
}`;

// то же для HTML без сборки: обычный скрипт (без type="module" — работает и из файла с диска), функция — в window
const APPLY_GLOBAL = `// <script src="js/theme.js"></script> — в конце <body>
window.applyTheme = function (mode) {
  var dark = mode === "dark" ||
    (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  var root = document.documentElement;
  root.setAttribute("data-switching", ""); // смена — без перетекания (правило в готовом CSS)
  root.setAttribute("data-theme", dark ? "dark" : "light");
  localStorage.setItem("theme", mode);
  document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
    m.content = dark ? "#070707" : "#fafafb";
  });
  setTimeout(function () { root.removeAttribute("data-switching"); }, 50);
};

// где угодно: applyTheme("dark"), applyTheme("light"), applyTheme("system")`;

const NO_TRANSITIONS = `/* смена темы — мгновенно, без перетекания каждого элемента */
[data-switching] *, [data-switching] *::before, [data-switching] *::after {
  transition: none !important;
}`;

const STEPS: Record<Tab, Step[]> = {
  next: [
    {
      title: "Поставьте next-themes",
      text: "Он ставит атрибут до первой отрисовки, помнит выбор и следит за темой системы:",
      block: <InstallCommand pkg="next-themes" />,
    },
    {
      title: "Провайдер темы",
      text: (
        <>
          Атрибут — <Code>data-theme</Code> (на нём токены RenDit SCSS), по
          умолчанию — тема системы, на время смены — без переходов:
        </>
      ),
      block: (
        <CodeBlock
          file="src/providers/theme-provider.tsx"
          code={`"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider(props: ComponentProps<typeof NextThemes>) {
  return (
    <NextThemes
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    />
  );
}`}
        />
      ),
    },
    {
      title: "Корневой layout",
      text: (
        <>
          <Code>suppressHydrationWarning</Code> — атрибут меняется до React.
          Цвет панели браузера — метатегами по теме системы и скриптом в{" "}
          <Code>&lt;head&gt;</Code> по теме сайта:
        </>
      ),
      block: (
        <CodeBlock
          file="src/app/layout.tsx"
          code={`export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafb" },
    { media: "(prefers-color-scheme: dark)", color: "#070707" },
  ],
};

const THEME_COLOR = \`try{var t=localStorage.getItem("theme"),d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=d?"#070707":"#fafafb"})}catch(e){}\`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_COLOR }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}`}
        />
      ),
    },
    {
      title: "Кнопка темы",
      text: "Обе иконки — в разметке, видимую выбирает CSS по data-theme: до гидратации ничего не мигает. Анимация — только по нажатию:",
      block: (
        <CodeBlock
          file="src/components/ThemeToggle.tsx"
          code={`"use client";

import { Moon } from "@boxicons/react/Moon";
import { Sun } from "@boxicons/react/Sun";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggle = () => {
    const now = resolvedTheme ?? document.documentElement.dataset.theme;
    setTheme(now === "dark" ? "light" : "dark");
  };
  return (
    <button type="button" aria-label="Сменить тему" onClick={toggle}
      className="size-36 br-full grid place-items-center active:scale-92">
      <Sun className="[grid-area:1/1] transition-[rotate,scale,opacity] duration-500 ease-spring-bouncy opacity-0 -rotate-90 scale-40 dark:opacity-100 dark:rotate-0 dark:scale-100" />
      <Moon className="[grid-area:1/1] transition-[rotate,scale,opacity] duration-500 ease-spring-bouncy dark:opacity-0 dark:rotate-90 dark:scale-40" />
    </button>
  );
}`}
        />
      ),
    },
  ],
  react: [
    {
      title: "Скрипт в index.html",
      text: "Первым в <head> — тема и цвет панели до первой отрисовки:",
      block: <CodeBlock file="index.html" code={HEAD_SCRIPT} />,
    },
    {
      title: "Хук темы",
      text: "Помнит выбор и следит за темой системы, пока человек сам не выбрал:",
      block: (
        <CodeBlock
          file="src/useTheme.ts"
          code={`import { useEffect, useState } from "react";
${APPLY.replace("export function", "function")}

type Mode = "light" | "dark" | "system";

export function useTheme() {
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem("theme") as Mode) ?? "system",
  );
  useEffect(() => {
    applyTheme(mode);
    if (mode !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = () => applyTheme("system");
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [mode]);
  return [mode, setMode] as const;
}`}
        />
      ),
    },
    {
      title: "Без перетекания при смене",
      block: <CodeBlock file="src/index.css" code={NO_TRANSITIONS} />,
    },
    {
      title: "Кнопка",
      text: (
        <>
          Готовые кнопки — в конструкторе выше, вкладка{" "}
          <Code>Next.js · React</Code>: вместо <Code>useTheme</Code> из
          next-themes — свой хук.
        </>
      ),
    },
  ],
  js: [
    {
      title: "Готовый CSS и скрипт в <head>",
      text: (
        <>
          Скрипт — первым, до стилей и разметки: тема ставится до первой
          отрисовки, без вспышки. Правило «без перетекания при смене» уже в
          готовом CSS:
        </>
      ),
      block: (
        <CodeBlock
          file="index.html"
          code={`<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${HEAD_SCRIPT.replaceAll("\n", "\n  ")}
  <link rel="stylesheet" href="${cdnCss()}">
</head>`}
        />
      ),
    },
    {
      title: "Кнопка",
      text: (
        <>
          Возьмите из конструктора выше, вкладка <Code>HTML · JS</Code>: вид на
          выбор, код рабочий целиком — разметка с иконками и скрипт. Вставьте
          его в <Code>&lt;body&gt;</Code>, где нужна кнопка.
        </>
      ),
    },
    {
      title: "Сменить тему из своего кода",
      optional: true,
      text: "Если тему переключает ваш скрипт (меню, настройки), — та же функция, что внутри кнопки:",
      block: <CodeBlock file="js/theme.js" code={APPLY_GLOBAL} />,
    },
  ],
  jquery: [
    {
      title: "Готовый CSS и скрипт в <head>",
      text: "Тот же, что и без jQuery: он должен сработать до загрузки библиотеки.",
      block: (
        <CodeBlock
          file="index.html"
          code={`<head>
  ${HEAD_SCRIPT.replaceAll("\n", "\n  ")}
  <link rel="stylesheet" href="${cdnCss()}">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>`}
        />
      ),
    },
    {
      title: "Кнопка",
      text: (
        <>
          Разметка — из конструктора выше (вкладка <Code>HTML · JS</Code>, вид
          «Иконка»), а скрипт кнопки замените на этот, на jQuery 3.6+:
        </>
      ),
      block: (
        <CodeBlock
          file="js/theme.jquery.js"
          code={`$(function () {
  var media = matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(mode) {
    var dark = mode === "dark" || (mode === "system" && media.matches);
    var $root = $(document.documentElement).attr("data-switching", "");
    $root.attr("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", mode);
    $('meta[name="theme-color"]').attr("content", dark ? "#070707" : "#fafafb");
    setTimeout(function () { $root.removeAttr("data-switching"); }, 50);
  }

  $("#theme-toggle").on("click", function () {
    applyTheme($("html").attr("data-theme") === "dark" ? "light" : "dark");
  });

  // «как в системе», пока человек сам не выбрал
  media.addEventListener("change", function () {
    if ((localStorage.getItem("theme") || "system") === "system") applyTheme("system");
  });
});`}
        />
      ),
    },
  ],
};

// вкладка по платформе справки: Node.js и HTML/CSS — чистый JS (jQuery — выбрать вручную)
const TAB_OF: Record<DocsPlatform, Tab> = {
  nextjs: "next",
  react: "react",
  node: "js",
  html: "js",
};

export function ThemeInstall() {
  const platform = useDocsPlatform();
  const [tab, setTab] = useState<Tab>("next");
  useEffect(() => setTab(TAB_OF[platform]), [platform]);
  const choose = setTab;

  return (
    <div className="flex flex-col gap-20">
      <div className="self-start grid grid-cols-2 sm:flex gap-4 p-3 br-xl sm:br-full bg-foreground/5">
        {(Object.keys(TABS) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tab === t}
            onClick={() => choose(t)}
            className="h-34 px-14 br-full font-13 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2"
          >
            {TABS[t]}
          </button>
        ))}
      </div>
      <div
        key={tab}
        className="transition-[opacity,translate] duration-400 ease-spring [@starting-style]:opacity-0 [@starting-style]:translate-y-8 motion-reduce:transition-none"
      >
        <Steps
          steps={STEPS[tab]}
          done={{
            title: "Готово",
            text: "Классы в разметке те же — тёмная тема работает везде, где цвета взяты из токенов. Проверьте перезагрузку в тёмной теме: вспышки быть не должно.",
          }}
        />
      </div>
    </div>
  );
}
