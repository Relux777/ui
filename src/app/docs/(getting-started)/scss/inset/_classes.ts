// Классы страницы «Смещение»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const SIDES = [
  { id: "top", title: "Сверху" },
  { id: "right", title: "Справа" },
  { id: "bottom", title: "Снизу" },
  { id: "left", title: "Слева" },
] as const;

export type Side = (typeof SIDES)[number]["id"];

// значения для стороны: нет, 0, пиксели, половина, отрицательное
export const sideValues = (side: Side) => [
  "",
  `${side}-0`,
  `${side}-16`,
  `${side}-40`,
  `${side}-1/2`,
  `-${side}-12`,
];

export const INSET_CLASSES = [
  "absolute",
  ...SIDES.flatMap((s) => sideValues(s.id).filter(Boolean)),
  "inset-0",
  "inset-x-0",
  "inset-y-0",
];
