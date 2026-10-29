// Классы страницы «Промежутки»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const STEPS = [0, 4, 8, 12, 16, 24, 32, 48];

export const MODES = [
  { id: "flex", title: "flex + перенос" },
  { id: "grid", title: "grid 3 колонки" },
  { id: "space-x", title: "space-x" },
  { id: "space-y", title: "space-y" },
] as const;
export type Mode = (typeof MODES)[number]["id"];

export const GAP_X = STEPS.map((n) => `gap-x-${n}`);
export const GAP_Y = STEPS.map((n) => `gap-y-${n}`);
export const SPACE_X = STEPS.map((n) => `space-x-${n}`);
export const SPACE_Y = STEPS.map((n) => `space-y-${n}`);

export const GAP_CLASSES = [
  "flex",
  "flex-wrap",
  "grid",
  "grid-cols-3",
  ...GAP_X,
  ...GAP_Y,
  ...SPACE_X,
  ...SPACE_Y,
  ...STEPS.map((n) => `gap-${n}`),
];
