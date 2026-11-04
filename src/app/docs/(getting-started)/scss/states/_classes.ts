// Классы страницы «Состояния»: из них выбирает конструктор (состояние × вид), их CSS страница просит у движка
// при сборке (classCss). Все строки — полные классы целиком: только их видит движок.

// «Когда» — варианты-состояния конструктора. id — префикс класса без двоеточия.
export const WHEN = [
  { id: "hover", title: "hover:" },
  { id: "focus-visible", title: "focus-visible:" },
  { id: "active", title: "active:" },
  { id: "disabled", title: "disabled:" },
  { id: "checked", title: "checked:" },
  { id: "aria-[current=page]", title: "aria-[current=page]:" },
  { id: "data-[state=open]", title: "data-[state=open]:" },
  { id: "group-hover", title: "group-hover:" },
  { id: "has-checked", title: "has-checked:" },
  { id: "not-first", title: "not-first:" },
  { id: "dark", title: "dark:" },
] as const;

// «Что применить» — вид из групп: фон, текст, масштаб, прозрачность, рамка
export const WHAT = [
  "bg-secondary",
  "bg-danger",
  "bg-surface-muted",
  "bg-gray-900",
  "text-secondary",
  "text-danger",
  "text-primary-foreground",
  "scale-95",
  "scale-105",
  "opacity-50",
  "opacity-100",
  "border-secondary",
  "border-danger",
];

// все сочетания «состояние: вид» — их CSS страница просит у движка заранее (ClassStyle вставляет выбранные)
export const STATE_CLASSES = WHEN.flatMap((w) =>
  WHAT.map((what) => `${w.id}:${what}`),
);

// классы таблицы «класс → CSS»
export const TABLE_CLASSES = [
  "hover:bg-primary",
  "hover:text-primary-foreground",
  "focus-visible:outline-2",
  "active:scale-95",
  "disabled:opacity-50",
  "checked:accent-secondary",
  "aria-[current=page]:text-secondary",
  "data-active:opacity-100",
  "group-hover:opacity-100",
  "group-hover/card:opacity-100",
  "peer-checked:line-through",
  "has-checked:border-secondary",
  "has-[>img]:p-0",
  "first:mt-0",
  "last:border-b-0",
  "odd:bg-surface-muted",
  "even:bg-surface",
  "empty:hidden",
  "open:bg-surface-muted",
  "placeholder-shown:border-secondary",
  "invalid:border-danger",
  "focus-within:border-secondary",
  "not-first:border-t",
  "before:content-['→']",
  "dark:bg-gray-900",
];
