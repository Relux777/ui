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
  "/docs/code/classes": {
    lead: "Как пишутся классы RenDit Code: числа в пикселях, цвета из токенов, прозрачность /N, отрицательные значения.",
    plan: [
      "Имена классов и числа",
      "Цвета: токены и палитра",
      "Прозрачность /N",
      "Почему класс надо писать строкой целиком",
    ],
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
  "/docs/scss/layers": {
    lead: "Слои каскада theme · reset · base · layout · components · utilities — почему класс всегда сильнее базовых стилей.",
    plan: [
      "Порядок слоёв в _layers.scss",
      "Куда класть свои стили",
      "Как переопределить компонент классом",
    ],
  },

  // Раскладка
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

  // Цвета и фон
  "/docs/scss/background": {
    lead: "Картинка на фоне: размер, позиция, повтор и текст с фоном внутри букв.",
    plan: [
      "bg-cover, bg-contain, bg-center, bg-no-repeat",
      "Картинка через bg-[url(…)]",
      "bg-clip-text — градиент в буквах",
    ],
  },
  "/docs/scss/gradients": {
    lead: "Градиенты из токенов и палитры: линейные, радиальные, мягкие подсветки и текст.",
    plan: [
      "bg-gradient-* из темы",
      "Свой градиент bg-[linear-gradient(…)]",
      "Подсветки radial-gradient",
      "Градиентный текст",
    ],
  },
  "/docs/scss/opacity": {
    lead: "Прозрачность всего элемента — и чем она отличается от прозрачности цвета /N.",
    plan: [
      "opacity-N от 0 до 100",
      "opacity- или /N: что выбрать",
      "Плавное появление: opacity и transition",
    ],
  },
  "/docs/scss/svg": {
    lead: "Цвет иконок и SVG: заливка, линия и currentColor.",
    plan: [
      "fill-* и stroke-* из токенов",
      "fill-current — цвет текста",
      "Толщина линии",
    ],
  },

  // Рамки
  "/docs/scss/borders": {
    lead: "Рамки: со всех сторон и с одной, толщина, стиль, цвет и прозрачность.",
    plan: [
      "border, border-t/b/l/r, толщина border-2",
      "border-dashed, border-dotted",
      "Цвет рамки и прозрачность /N",
    ],
    home: "shape",
  },
  "/docs/scss/radius": {
    lead: "Скругления: br-N, токены скруглений, круг br-full и отдельные углы.",
    plan: [
      "br-N и токены br-sm…br-2xl",
      "br-full — таблетки и круги",
      "Углы и стороны: br-t-N, br-tl-N",
      "Вложенные скругления: внешний радиус = внутренний + отступ",
    ],
    home: "shape",
  },
  "/docs/scss/outline": {
    lead: "Обводка: кольцо фокуса с клавиатуры, отступ от края и стиль.",
    plan: [
      "outline-N, цвет и outline-offset-N",
      "focus-visible: — только с клавиатуры",
      "outline-none и чем его заменить",
    ],
  },

  // Эффекты
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
  "/docs/scss/blur": {
    lead: "Размытие элемента и того, что под ним: blur- и backdrop-blur- — стекло для панелей и шапки.",
    plan: [
      "blur-N",
      "backdrop-blur-N и стеклянная панель",
      "Почему стекло внутри стекла не размывает",
      "Цена размытия на телефоне",
    ],
  },

  // Движение
  "/docs/scss/transition": {
    lead: "Плавные переходы: какие свойства, сколько длится, с какой кривой и задержкой.",
    plan: [
      "transition, transition-colors, transition-[…]",
      "duration-N и delay-N",
      "ease-out, ease-spring, ease-spring-bouncy",
      "motion-reduce: — без движения для тех, кто просил",
    ],
  },
  "/docs/scss/transform": {
    lead: "Сдвиг, масштаб и поворот — без пересчёта раскладки, плавно и дёшево.",
    plan: [
      "translate-x-N, translate-y-N, проценты",
      "scale-N и rotate-N",
      "origin-* — точка опоры",
      "Нажатие active:scale-95",
    ],
  },
  "/docs/scss/enter": {
    lead: "Появление без JavaScript: [@starting-style]: для элементов и окон, .reveal при прокрутке.",
    plan: [
      "[@starting-style]: — с чего начинается переход",
      "Окна и списки: появление и исчезновение",
      ".reveal — блок проявляется при прокрутке",
    ],
  },

  // Взаимодействие
  "/docs/scss/cursor": {
    lead: "Вид курсора над элементом: рука, текст, запрет, перетаскивание.",
    plan: [
      "cursor-pointer, cursor-default, cursor-text",
      "cursor-not-allowed, cursor-grab",
    ],
  },
  "/docs/scss/pointer": {
    lead: "Клики, касания и выделение: пропустить клики насквозь, запретить выделение, жесты на телефоне.",
    plan: [
      "pointer-events-none и -auto",
      "select-none, select-text, select-all",
      "touch-none, touch-pan-y — жесты",
    ],
  },
  "/docs/scss/scroll": {
    lead: "Прокрутка: плавная к якорю, отступ под шапку, тонкая полоса.",
    plan: [
      "scroll-smooth",
      "scroll-mt-N — якорь не прячется под шапку",
      "scrollbar-thin и scrollbar-none",
    ],
  },
  "/docs/scss/forms": {
    lead: "Поля форм: цвет флажков, курсора ввода, изменение размера и своё оформление.",
    plan: [
      "accent-* — флажки и ползунки в цвет сайта",
      "caret-* — курсор ввода",
      "resize-none, resize-y, field-sizing-content",
      "appearance-none — своё оформление",
    ],
  },
};
