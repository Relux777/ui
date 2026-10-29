// Классы страницы «Flex»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const DIRECTIONS = [
  "flex-row",
  "flex-row-reverse",
  "flex-col",
  "flex-col-reverse",
];
export const WRAPS = ["flex-nowrap", "flex-wrap", "flex-wrap-reverse"];
export const JUSTIFY = [
  "justify-start",
  "justify-center",
  "justify-end",
  "justify-between",
  "justify-around",
  "justify-evenly",
];
export const ITEMS = [
  "items-stretch",
  "items-start",
  "items-center",
  "items-end",
  "items-baseline",
];
export const GAPS = [0, 4, 8, 12, 16, 24, 32].map((n) => `gap-${n}`);

export const FLEX_CLASSES = [
  "flex",
  "inline-flex",
  ...DIRECTIONS,
  ...WRAPS,
  ...JUSTIFY,
  ...ITEMS,
  ...GAPS,
];
