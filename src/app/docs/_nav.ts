// Оглавление документации — одно на весь раздел /docs: из него строятся боковое меню вкладки
// «Установка и настройка» и карточки на «Справке». Вкладки раздела — components/DocsTabs/tabs.ts.
//
// Как устроена папка app/docs (страницы появляются по мере готовности, ready: false — пункт виден как «скоро»):
//
//   docs/
//   ├── layout.tsx               общий заголовок; у каждой вкладки свой layout
//   ├── (getting-started)/       вкладка «Установка и настройка» — с боковым меню (группа маршрутов, в адресе её нет)
//   │   ├── page.tsx             Справка — обзор и вход во все разделы
//   │   ├── install/             установка и настройка под любой стек
//   │   ├── stacks/<стек>/       подробности под стек: nextjs, react, html, css, scss
//   │   ├── scss/<тема>/         RenDit SCSS: токены, цвета, тени, слои, сетка .row
//   │   ├── code/<тема>/         RenDit Code: классы, варианты (md:, hover:, dark:), свои значения, конфиг
//   │   └── editor/              конструктор: собрать компонент и скопировать код под выбранный стек
//   ├── components/<имя>/        вкладка «Компоненты»: живое превью + вкладки HTML · CSS · SCSS · React · Next.js
//   └── releases/                вкладка «Обновления»: версии и что в них нового
//
// Стеки и режим «с движком / без движка» — общие для всех разделов (STACKS ниже): страница компонента
// и конструктор показывают код для каждого из них, поэтому список живёт в одном месте.

export type DocsLink = {
  title: string;
  href: string;
  /** false — страницы ещё нет: пункт виден в меню как «скоро», но не ссылка */
  ready: boolean;
};

export type DocsGroup = {
  title: string;
  /** одна строка о разделе — для карточки на «Справке» */
  lead: string;
  links: DocsLink[];
};

export const DOCS_NAV: DocsGroup[] = [
  {
    title: "Начало",
    lead: "Установка под ваш стек — с движком RenDit Code или готовым CSS.",
    links: [
      { title: "Обзор", href: "/docs", ready: true },
      { title: "Установка и настройка", href: "/docs/install", ready: true },
    ],
  },
  {
    title: "Стеки",
    lead: "Подробная настройка под Next.js, React, HTML, CSS и SCSS.",
    links: [
      { title: "Next.js", href: "/docs/stacks/nextjs", ready: false },
      { title: "React", href: "/docs/stacks/react", ready: false },
      { title: "HTML", href: "/docs/stacks/html", ready: false },
      { title: "CSS", href: "/docs/stacks/css", ready: false },
      { title: "SCSS", href: "/docs/stacks/scss", ready: false },
    ],
  },
  {
    title: "RenDit SCSS",
    lead: "Токены и основа: цвета, тени, скругления, слои, сетка.",
    links: [
      { title: "Токены", href: "/docs/scss/tokens", ready: true },
      { title: "Цвета и тема", href: "/docs/scss/colors", ready: true },
      { title: "Тени", href: "/docs/scss/shadows", ready: false },
      { title: "Слои", href: "/docs/scss/layers", ready: false },
      { title: "Сетка .row", href: "/docs/scss/grid", ready: false },
    ],
  },
  {
    title: "RenDit Code",
    lead: "Движок классов: как пишутся классы, варианты, конфиг и команды.",
    links: [
      { title: "Классы", href: "/docs/code/classes", ready: false },
      { title: "Варианты", href: "/docs/code/variants", ready: true },
      { title: "Свои значения", href: "/docs/code/arbitrary", ready: false },
      { title: "Конфиг", href: "/docs/code/config", ready: true },
      { title: "Команды", href: "/docs/code/cli", ready: true },
      { title: "VS Code", href: "/docs/code/vscode", ready: true },
    ],
  },
  {
    title: "Компоненты",
    lead: "Готовые компоненты с кодом под каждый стек.",
    links: [{ title: "Все компоненты", href: "/docs/components", ready: true }],
  },
  {
    title: "Конструктор",
    lead: "Собрать компонент мышкой и скопировать код.",
    links: [{ title: "Редактор", href: "/docs/editor", ready: false }],
  },
];

// Стеки, под которые документация и конструктор отдают код
export const STACKS = [
  { id: "nextjs", title: "Next.js" },
  { id: "react", title: "React" },
  { id: "html", title: "HTML" },
  { id: "css", title: "CSS" },
  { id: "scss", title: "SCSS" },
] as const;

export type StackId = (typeof STACKS)[number]["id"];

// с движком — классы RenDit Code в разметке, CSS собирается из кода;
// без движка — готовый CSS-файл и свои стили, классов-утилит нет
export const ENGINE_MODES = [
  { id: "engine", title: "С RenDit Code" },
  { id: "plain", title: "Без движка" },
] as const;
