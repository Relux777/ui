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
//   │   ├── scss/<тема>/         RenDit SCSS: токены, цвета, тени, слои, сетка .row
//   │   ├── code/<тема>/         RenDit Code: классы, варианты (md:, hover:, dark:), свои значения, конфиг
//   │   └── editor/              конструктор: собрать компонент и скопировать код под выбранный стек
//   ├── components/<имя>/        вкладка «Компоненты»: живое превью + вкладки HTML · CSS · SCSS · React · Next.js
//   └── releases/                вкладка «Обновления»: версии и что в них нового
//
// Платформа (Next.js, React, Node.js, HTML/CSS) — общая для всей справки: переключатель вверху левого меню,
// выбор — в _platform.ts; установка и конструкторы показывают шаги и код под неё.

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

// Все страницы созданы; те, что ещё в работе, — заготовки с планом (_stubs.ts, app/_docs/stub.tsx)
export const DOCS_NAV: DocsGroup[] = [
  {
    title: "Начало",
    lead: "Установка под ваш стек — с движком RenDit Code или готовым CSS.",
    links: [
      { title: "Обзор", href: "/docs", ready: true },
      { title: "Установка и настройка", href: "/docs/install", ready: true },
      { title: "Устройство", href: "/docs/structure", ready: true },
    ],
  },
  {
    title: "RenDit SCSS",
    lead: "Основа стиля: токены, цвета, текст, отступы, сетки, рамки, тени, состояния, адаптив, тема.",
    links: [
      { title: "Токены", href: "/docs/scss/tokens", ready: true },
      { title: "Цвета", href: "/docs/scss/colors", ready: true },
      { title: "Тёмная тема", href: "/docs/scss/dark", ready: true },
      { title: "Текст", href: "/docs/scss/text", ready: true },
      { title: "Отступы", href: "/docs/scss/spacing", ready: true },
      { title: "Flex", href: "/docs/scss/flex", ready: true },
      { title: "Сетка .row", href: "/docs/scss/row", ready: true },
      { title: "Grid", href: "/docs/scss/grid", ready: true },
      { title: "Рамки", href: "/docs/scss/borders", ready: true },
      { title: "Тени", href: "/docs/scss/shadows", ready: true },
      { title: "Состояния", href: "/docs/scss/states", ready: true },
      { title: "Адаптив", href: "/docs/scss/responsive", ready: true },
      { title: "Слои", href: "/docs/scss/layers", ready: true },
    ],
  },
  {
    title: "RenDit Code",
    lead: "Движок классов: как пишутся классы, варианты, конфиг и команды.",
    links: [
      { title: "Классы", href: "/docs/code/classes", ready: true },
      { title: "Варианты", href: "/docs/code/variants", ready: true },
      { title: "Свои значения", href: "/docs/code/arbitrary", ready: true },
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
    links: [{ title: "Редактор", href: "/docs/editor", ready: true }],
  },
];

// группа и пункт меню по адресу страницы
export function findDocsLink(href: string) {
  for (const group of DOCS_NAV)
    for (const link of group.links)
      if (link.href === href) return { group, link };
  throw new Error(`нет страницы ${href} в DOCS_NAV`);
}
