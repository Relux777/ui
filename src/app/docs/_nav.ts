// Оглавление документации — одно на весь раздел /docs: из него строятся левое меню вкладки «Справка»,
// «всё меню» в шапке (components/ui/MenuSheet) и карточки на обзоре. Вкладки раздела — components/DocsTabs/tabs.ts.
// Устроено как у Tailwind: сначала «Начало» и «Основы» (как писать классы), дальше группы классов — у каждого
// свойства своя страница с таблицей «класс → CSS», конструктором и примерами. classes — какие классы на странице:
// видны в меню рядом с названием и по ним ищет поиск (w-20 найдёт «Ширину», hover: — «Состояния»).
//
// Как устроена папка app/docs:
//
//   docs/
//   ├── layout.tsx               общий заголовок; у каждой вкладки свой layout
//   ├── (getting-started)/       вкладка «Справка» — с левым меню (группа маршрутов, в адресе её нет)
//   │   ├── page.tsx             обзор и вход во все разделы
//   │   ├── install/             установка и настройка под любой стек
//   │   ├── scss/<тема>/         страницы классов и стилей: цвета, отступы, ширина, тени…
//   │   └── code/<тема>/         движок RenDit Code: как писать классы, варианты, свои значения, конфиг, команды
//   ├── components/<имя>/        вкладка «Компоненты»: живое превью + код под каждый стек
//   └── releases/                вкладка «Обновления»: версии и что в них нового
//
// Платформа (Next.js, React, Node.js, HTML/CSS) — общая для всей справки: переключатель вверху левого меню,
// выбор — в _platform.ts; установка и конструкторы показывают шаги и код под неё.

export type DocsLink = {
  title: string;
  href: string;
  /** классы страницы: первый виден в меню, все — для поиска; * — любое значение */
  classes?: string[];
  /** другие слова для поиска: CSS-свойства, английские названия */
  keywords?: string;
};

export type DocsGroup = {
  title: string;
  /** одна строка о разделе — для карточки на обзоре */
  lead: string;
  links: DocsLink[];
};

// Все страницы созданы; те, что ещё в работе, — заготовки с планом (_stubs.ts, app/_docs/stub.tsx)
export const DOCS_NAV: DocsGroup[] = [
  {
    title: "Начало",
    lead: "Установка под ваш стек — с движком RenDit Code или готовым CSS.",
    links: [
      { title: "Обзор", href: "/docs", keywords: "справка overview" },
      {
        title: "Установка и настройка",
        href: "/docs/install",
        keywords: "install npm cdn скачать",
      },
      {
        title: "Готовый CSS",
        href: "/docs/css",
        keywords:
          "cdn css html без сборки файлы части модули min сжатый конструктор свой css",
      },
      {
        title: "Устройство",
        href: "/docs/structure",
        keywords: "структура папки structure",
      },
    ],
  },
  {
    title: "Основы",
    lead: "Как писать классы: числа, токены, состояния, адаптив, тёмная тема и свои значения.",
    links: [
      {
        title: "Как писать классы",
        href: "/docs/code/classes",
        classes: ["p-20", "bg-surface/50", "-mt-8"],
        keywords: "классы utility числа пиксели",
      },
      {
        title: "Состояния",
        href: "/docs/scss/states",
        classes: ["hover:", "focus-visible:", "active:", "aria-*:", "group-*:"],
        keywords: "наведение фокус нажатие states",
      },
      {
        title: "Адаптив",
        href: "/docs/scss/responsive",
        classes: ["sm:", "md:", "lg:", "xl:", "2xl:", "max-sm:"],
        keywords: "брейкпоинты экран телефон responsive breakpoints",
      },
      {
        title: "Тёмная тема",
        href: "/docs/scss/dark",
        classes: ["dark:"],
        keywords: "dark mode тема",
      },
      {
        title: "Токены",
        href: "/docs/scss/tokens",
        classes: ["--accent", "--background", "--radius-*"],
        keywords: "переменные variables tokens",
      },
      {
        title: "Свои значения",
        href: "/docs/code/arbitrary",
        classes: ["w-[…]", "[…]:"],
        keywords: "arbitrary произвольные",
      },
      {
        title: "Все варианты",
        href: "/docs/code/variants",
        classes: ["has-*:", "data-*:", "not-*:", "[@starting-style]:"],
        keywords: "variants модификаторы префиксы",
      },
      {
        title: "Слои каскада",
        href: "/docs/scss/layers",
        classes: ["@layer"],
        keywords: "layers каскад порядок",
      },
    ],
  },
  {
    title: "Раскладка",
    lead: "Отображение, позиция, слои z, переполнение, контейнер и сетка .row.",
    links: [
      {
        title: "Отображение",
        href: "/docs/scss/display",
        classes: ["flex", "block", "grid", "hidden", "inline-flex", "contents"],
        keywords: "display",
      },
      {
        title: "Позиция",
        href: "/docs/scss/position",
        classes: ["relative", "absolute", "fixed", "sticky", "static"],
        keywords: "position",
      },
      {
        title: "Смещение",
        href: "/docs/scss/inset",
        classes: ["top-*", "inset-*", "left-*", "right-*", "bottom-*"],
        keywords: "inset top left",
      },
      {
        title: "Наложение",
        href: "/docs/scss/z-index",
        classes: ["z-*"],
        keywords: "z-index слои поверх",
      },
      {
        title: "Переполнение",
        href: "/docs/scss/overflow",
        classes: ["overflow-*", "overscroll-*"],
        keywords: "overflow прокрутка обрезка",
      },
      {
        title: "Видимость",
        href: "/docs/scss/visibility",
        classes: ["invisible", "visible", "sr-only", "isolate"],
        keywords: "visibility скрыть",
      },
      {
        title: "Контейнер",
        href: "/docs/scss/container",
        classes: [".container", "@container"],
        keywords: "container ширина страницы",
      },
      {
        title: "Сетка .row",
        href: "/docs/scss/row",
        classes: ["row", "col-*", "offset-*", "gutter-*"],
        keywords: "колонки bootstrap row",
      },
      {
        title: "Картинки и видео",
        href: "/docs/scss/object",
        classes: ["object-*"],
        keywords: "object-fit img video",
      },
    ],
  },
  {
    title: "Flex и Grid",
    lead: "Раскладки рядами и сетками: направление, выравнивание, колонки и ячейки.",
    links: [
      {
        title: "Flex",
        href: "/docs/scss/flex",
        classes: ["flex-row", "flex-col", "flex-wrap"],
        keywords: "flexbox flex-direction",
      },
      {
        title: "Flex-элементы",
        href: "/docs/scss/flex-items",
        classes: ["flex-1", "grow", "shrink-0", "basis-*", "order-*"],
        keywords: "flex-grow flex-shrink flex-basis order",
      },
      {
        title: "Выравнивание",
        href: "/docs/scss/align",
        classes: ["justify-*", "items-*", "self-*", "content-*", "place-*"],
        keywords: "align justify-content align-items",
      },
      {
        title: "Grid",
        href: "/docs/scss/grid",
        classes: ["grid-cols-*", "grid-rows-*", "grid-fill-*", "grid-fit-*"],
        keywords: "grid-template-columns сетка",
      },
      {
        title: "Ячейки grid",
        href: "/docs/scss/grid-cells",
        classes: ["col-span-*", "col-start-*", "row-span-*", "grid-flow-*"],
        keywords: "grid-column grid-row span",
      },
    ],
  },
  {
    title: "Отступы",
    lead: "Внутренние и внешние отступы, промежутки между элементами.",
    links: [
      {
        title: "Отступы",
        href: "/docs/scss/spacing",
        classes: ["p-*", "m-*", "px-*", "my-*", "pt-safe"],
        keywords: "padding margin",
      },
      {
        title: "Промежутки",
        href: "/docs/scss/gap",
        classes: ["gap-*", "space-x-*", "space-y-*"],
        keywords: "gap space",
      },
    ],
  },
  {
    title: "Размеры",
    lead: "Ширина, высота, ограничения и пропорции.",
    links: [
      {
        title: "Ширина",
        href: "/docs/scss/width",
        classes: ["w-*", "min-w-*", "max-w-*", "size-*"],
        keywords: "width",
      },
      {
        title: "Высота",
        href: "/docs/scss/height",
        classes: ["h-*", "min-h-*", "max-h-*"],
        keywords: "height dvh",
      },
      {
        title: "Пропорции",
        href: "/docs/scss/aspect",
        classes: ["aspect-*", "box-border", "box-content"],
        keywords: "aspect-ratio box-sizing",
      },
    ],
  },
  {
    title: "Текст",
    lead: "Размер, начертание, высота строки, выравнивание, оформление, перенос и списки.",
    links: [
      {
        title: "Текст",
        href: "/docs/scss/text",
        classes: ["font-*", "font-w-*", "leading-*", "letter-s-*", "text-*"],
        keywords: "font-size font-weight line-height letter-spacing шрифт",
      },
      {
        title: "Выравнивание текста",
        href: "/docs/scss/text-align",
        classes: ["text-left", "text-center", "text-right", "text-balance"],
        keywords: "text-align text-wrap",
      },
      {
        title: "Оформление",
        href: "/docs/scss/decoration",
        classes: ["underline", "decoration-*", "uppercase", "italic"],
        keywords: "text-decoration text-transform подчёркивание регистр",
      },
      {
        title: "Перенос и обрезка",
        href: "/docs/scss/wrap",
        classes: ["truncate", "line-clamp-*", "whitespace-*", "break-words"],
        keywords: "white-space word-break ellipsis многоточие",
      },
      {
        title: "Списки",
        href: "/docs/scss/lists",
        classes: ["list-disc", "list-decimal"],
        keywords: "list-style ul ol",
      },
    ],
  },
  {
    title: "Цвета и фон",
    lead: "Цвета из токенов и палитры, фон, градиенты, прозрачность и SVG.",
    links: [
      {
        title: "Цвета",
        href: "/docs/scss/colors",
        classes: ["bg-*", "text-*", "border-*", "bg-secondary/12"],
        keywords: "color palette палитра",
      },
      {
        title: "Фон",
        href: "/docs/scss/background",
        classes: ["bg-cover", "bg-center", "bg-no-repeat", "bg-clip-text"],
        keywords: "background image картинка",
      },
      {
        title: "Градиенты",
        href: "/docs/scss/gradients",
        classes: ["bg-gradient-*", "bg-[linear-gradient(…)]"],
        keywords: "gradient linear-gradient",
      },
      {
        title: "Прозрачность",
        href: "/docs/scss/opacity",
        classes: ["opacity-*"],
        keywords: "opacity",
      },
      {
        title: "SVG",
        href: "/docs/scss/svg",
        classes: ["fill-*", "stroke-*"],
        keywords: "svg иконки icons",
      },
    ],
  },
  {
    title: "Рамки",
    lead: "Рамки, скругления и обводка фокуса.",
    links: [
      {
        title: "Рамки",
        href: "/docs/scss/borders",
        classes: ["border", "border-*", "border-t-*", "border-dashed"],
        keywords: "border",
      },
      {
        title: "Скругления",
        href: "/docs/scss/radius",
        classes: ["br-*", "br-full", "br-t-*"],
        keywords: "border-radius радиус",
      },
      {
        title: "Обводка",
        href: "/docs/scss/outline",
        classes: ["outline-*", "outline-offset-*", "outline-none"],
        keywords: "outline фокус focus",
      },
    ],
  },
  {
    title: "Эффекты",
    lead: "Тени, размытие и стекло.",
    links: [
      {
        title: "Тени",
        href: "/docs/scss/shadows",
        classes: ["shadow-*", "shadow-none"],
        keywords: "box-shadow тень",
      },
      {
        title: "Размытие",
        href: "/docs/scss/blur",
        classes: ["blur-*", "backdrop-blur-*"],
        keywords: "blur filter backdrop-filter стекло glass",
      },
    ],
  },
  {
    title: "Движение",
    lead: "Переходы, трансформации и появление элементов.",
    links: [
      {
        title: "Переходы",
        href: "/docs/scss/transition",
        classes: ["transition", "duration-*", "ease-*", "delay-*"],
        keywords: "transition анимация animation",
      },
      {
        title: "Трансформации",
        href: "/docs/scss/transform",
        classes: ["translate-*", "scale-*", "rotate-*", "origin-*"],
        keywords: "transform поворот масштаб",
      },
      {
        title: "Появление",
        href: "/docs/scss/enter",
        classes: [".reveal", "[@starting-style]:"],
        keywords: "starting-style появление анимация",
      },
    ],
  },
  {
    title: "Взаимодействие",
    lead: "Курсор, касание, выделение, прокрутка и поля форм.",
    links: [
      {
        title: "Курсор",
        href: "/docs/scss/cursor",
        classes: ["cursor-*"],
        keywords: "cursor pointer",
      },
      {
        title: "Касание и выделение",
        href: "/docs/scss/pointer",
        classes: ["select-*", "pointer-events-*", "touch-*"],
        keywords: "pointer-events user-select touch-action",
      },
      {
        title: "Прокрутка",
        href: "/docs/scss/scroll",
        classes: ["scroll-smooth", "scroll-mt-*", "scrollbar-*"],
        keywords: "scroll скролл якорь",
      },
      {
        title: "Поля форм",
        href: "/docs/scss/forms",
        classes: ["accent-*", "caret-*", "resize-*", "appearance-none"],
        keywords: "input form textarea checkbox",
      },
    ],
  },
  {
    title: "Движок RenDit Code",
    lead: "Конфиг, команды и подсказки классов в редакторе.",
    links: [
      {
        title: "Конфиг",
        href: "/docs/code/config",
        keywords: "config настройки theme rendit.config.mjs",
      },
      {
        title: "Команды",
        href: "/docs/code/cli",
        keywords: "cli команды watch build npm run rendit-code",
      },
      {
        title: "VS Code",
        href: "/docs/code/vscode",
        keywords: "редактор editor подсказки расширение extension",
      },
    ],
  },
];

// группа и пункт меню по адресу страницы
export function findDocsLink(href: string) {
  for (const group of DOCS_NAV)
    for (const link of group.links)
      if (link.href === href) return { group, link };
  throw new Error(`нет страницы ${href} в DOCS_NAV`);
}

// Поиск по меню: каждое слово запроса должно найтись в названии, группе, словах для поиска или подойти к
// классу страницы. Класс подходит, если запрос начинается с него (w-20 → w-*, hover:bg-red → hover:) или он
// начинается с запроса (sha → shadow-*). Пустой запрос — всё меню; группы без совпадений пропадают.
const norm = (s: string) => s.toLowerCase().replaceAll("ё", "е");

function fits(word: string, link: DocsLink, group: DocsGroup) {
  const text = norm(`${link.title} ${group.title} ${link.keywords ?? ""}`);
  if (text.includes(word)) return true;
  return (link.classes ?? []).some((c) => {
    const cls = norm(c.replace(/^\./, ""));
    const stem = cls.replace(/\*.*$|….*$/, "");
    return (
      cls.includes(word) ||
      cls.startsWith(word) ||
      (stem.length > 1 && word.startsWith(stem))
    );
  });
}

export function filterDocsNav(query: string, nav: DocsGroup[] = DOCS_NAV) {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return nav;
  return nav
    .map((group) => ({
      ...group,
      links: group.links.filter((link) =>
        words.every((w) => fits(w.replace(/^\./, ""), link, group)),
      ),
    }))
    .filter((group) => group.links.length);
}
