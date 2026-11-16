// Классы конструктора адаптива — без "use client": страница просит их CSS у движка при сборке.

export const FLEX_PARENT = "flex flex-wrap -m-6";
export const FLEX_CARD = "w-full sm:w-1/2 lg:w-1/3 p-6";
export const GRID_PARENT =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12";

export const RESPONSIVE_CLASSES = [
  ...[FLEX_PARENT, FLEX_CARD, GRID_PARENT].flatMap((c) => c.split(" ")),
  "gap-12",
  "-m-6",
  "p-6",
  "w-full",
  "sm:w-1/2",
  "lg:w-1/3",
];
