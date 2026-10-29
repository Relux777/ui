// Классы страницы «Flex-элементы»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const GROW = [
  "",
  "flex-1",
  "flex-auto",
  "flex-none",
  "grow",
  "shrink-0",
  "basis-160",
];
export const ORDER = ["", "order-first", "order-last", "order-1"];

export const FLEX_ITEM_CLASSES = [
  ...GROW.filter(Boolean),
  ...ORDER.filter(Boolean),
  "flex-initial",
  "grow-0",
  "shrink",
  "basis-1/2",
  "basis-auto",
  "-order-1",
];
