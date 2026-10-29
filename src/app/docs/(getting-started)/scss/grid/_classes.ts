// Классы страницы «Grid»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const MODES = [
  { id: "cols", title: "Число колонок" },
  { id: "fill", title: "grid-fill" },
  { id: "fit", title: "grid-fit" },
  { id: "template", title: "Свой шаблон" },
] as const;
export type Mode = (typeof MODES)[number]["id"];

export const COLS = ["1", "2", "3", "4", "5", "6"].map((n) => `grid-cols-${n}`);
export const FILL = ["80", "120", "160", "200"].map((n) => `grid-fill-${n}`);
export const FIT = ["80", "120", "160", "200"].map((n) => `grid-fit-${n}`);
export const TEMPLATES = [
  "grid-cols-[200px_1fr]",
  "grid-cols-[1fr_2fr]",
  "grid-cols-[auto_1fr_auto]",
];
export const GAPS = [0, 4, 8, 12, 16, 24].map((n) => `gap-${n}`);

export const GRID_CLASSES = [
  "grid",
  ...COLS,
  ...FILL,
  ...FIT,
  ...TEMPLATES,
  ...GAPS,
  "grid-rows-3",
  "grid-cols-12",
  "grid-cols-none",
];
