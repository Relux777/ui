// Страницы справки, которые ещё в работе: о чём страница и что на ней будет. Страница-заготовка показывает
// это планом (app/_docs/stub.tsx). home — раздел главной, где уже есть живые примеры по теме.
// Страница готова — её строка отсюда удаляется, а page.tsx пишется целиком.

export type DocsStub = { lead: string; plan: string[]; home?: string };

export const DOCS_STUBS: Record<string, DocsStub> = {
  "/docs/structure": {
    lead: "Из чего состоит RenDit UI — стили RenDit SCSS, движок классов RenDit Code и компоненты — и как они работают вместе.",
    plan: [
      "Три части и одна версия",
      "Как движок находит классы в коде и пишет CSS",
      "Порядок слоёв: почему классы всегда сильнее базовых стилей",
      "Где что лежит в проекте и что можно менять",
    ],
    home: "start",
  },
  "/docs/scss/flex": {
    lead: "Flexbox классами: направление, выравнивание, перенос и растяжение элементов.",
    plan: [
      "flex, flex-col, flex-wrap",
      "items-*, justify-*, self-*",
      "flex-1, shrink-0, grow",
      "Частые раскладки: шапка, карточка, список",
    ],
    home: "flex",
  },
  "/docs/scss/row": {
    lead: "Сетка .row из RenDit SCSS: колонки col-N, промежутки, смещения и адаптив.",
    plan: [
      ".row и col-N из 12",
      "Промежутки gutter",
      "Смещения offset-N",
      "Колонки по брейкпоинтам",
    ],
    home: "row",
  },
  "/docs/scss/grid": {
    lead: "CSS Grid классами: колонки, автозаполнение, свои шаблоны.",
    plan: [
      "grid-cols-N и grid-rows-N",
      "grid-fill-N и grid-fit-N — карточки без брейкпоинтов",
      "Свои шаблоны grid-cols-[…]",
      "col-span-N, col-start-N",
    ],
    home: "grid",
  },
  "/docs/scss/borders": {
    lead: "Рамки и скругления: border, стороны, цвета и прозрачность, br-N и токены скруглений.",
    plan: [
      "border, border-t/b/l/r, толщина",
      "Цвет рамки и прозрачность /N",
      "Скругления br-N, br-full и по углам",
    ],
    home: "shape",
  },
  "/docs/scss/shadows": {
    lead: "Тени shadow-1…12: высота карточек, кромка стекла, тени в тёмной теме.",
    plan: [
      "Высоты shadow-1…6",
      "Стекло: shadow-7, shadow-9",
      "Тени из ReluxCode: shadow-8…12",
      "Свои тени в settings/_shadows.scss",
    ],
    home: "shadows",
  },
  "/docs/scss/states": {
    lead: "Наведение, нажатие, фокус, выбранное и раскрытое — префиксами hover:, active:, focus-visible:, aria-[…]:, group-[…]:.",
    plan: [
      "hover: только для мыши",
      "active: и focus-visible:",
      "Состояния атрибутами: aria-[current=page]:, data-*:",
      "group- и has- — состояние родителя и соседей",
    ],
    home: "states",
  },
  "/docs/scss/responsive": {
    lead: "Брейкпоинты sm 620 · md 770 · lg 990 · xl 1200 · 2xl 1400: mobile-first и max-… для узких экранов.",
    plan: [
      "Префиксы sm:, md:, lg:, xl:, 2xl:",
      "max-sm: и диапазоны",
      "Телефон: safe-area, касание, клавиатура",
      "Свои брейкпоинты в конфиге",
    ],
    home: "responsive",
  },
  "/docs/scss/layers": {
    lead: "Слои каскада theme · reset · base · layout · components · utilities — почему класс всегда сильнее базовых стилей.",
    plan: [
      "Порядок слоёв в _layers.scss",
      "Куда класть свои стили",
      "Как переопределить компонент классом",
    ],
  },
  "/docs/code/classes": {
    lead: "Как пишутся классы RenDit Code: числа в пикселях, цвета из токенов, прозрачность /N, отрицательные значения.",
    plan: [
      "Имена классов и числа",
      "Цвета: токены и палитра",
      "Прозрачность /N",
      "Почему класс надо писать строкой целиком",
    ],
  },
  "/docs/code/arbitrary": {
    lead: "Свои значения в […]: размеры, цвета, свойства и варианты — и что движок отбрасывает ради безопасности.",
    plan: [
      "Значения: w-[calc(100%-20px)], bg-[#ed70a7]",
      "Свойства: [float:left]",
      "Варианты: [&>li]:, [@starting-style]:",
      "Пробелы через _, опасные значения",
    ],
    home: "arbitrary",
  },
  "/docs/editor": {
    lead: "Конструктор: собрать компонент мышкой — цвета, отступы, состояния — и скопировать код под свой стек.",
    plan: [
      "Выбор компонента и вариантов",
      "Живое превью в светлой и тёмной теме",
      "Код для Next.js, React, HTML, CSS и SCSS",
    ],
  },
};
