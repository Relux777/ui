// Классы страницы «Позиция»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const POSITIONS = ["static", "relative", "absolute", "fixed", "sticky"];

// где встать — набор смещений одной строкой
export const PLACES = [
  { id: "top-0 left-0", title: "Слева сверху" },
  { id: "top-8 right-8", title: "Справа сверху" },
  { id: "bottom-0 inset-x-0", title: "Снизу во всю ширину" },
  { id: "inset-0", title: "На весь родитель" },
] as const;

export type Place = (typeof PLACES)[number]["id"];

export const POSITION_CLASSES = [
  ...new Set([...POSITIONS, ...PLACES.flatMap((p) => p.id.split(" "))]),
];
