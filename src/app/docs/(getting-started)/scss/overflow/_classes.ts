// Классы страницы «Переполнение»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const VALUES = ["visible", "hidden", "clip", "auto", "scroll"];

export const AXES = [
  { id: "overflow", title: "Обе оси" },
  { id: "overflow-x", title: "По горизонтали" },
  { id: "overflow-y", title: "По вертикали" },
] as const;

export type Axis = (typeof AXES)[number]["id"];

export const SCROLLBARS = ["", "scrollbar-thin", "scrollbar-none"];

export const OVERFLOW_CLASSES = [
  ...AXES.flatMap((a) => VALUES.map((v) => `${a.id}-${v}`)),
  ...SCROLLBARS.filter(Boolean),
  "overscroll-contain",
  "overscroll-none",
];
