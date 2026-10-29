// Классы страницы «Ячейки grid»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const COL_SPAN = ["", "col-span-2", "col-span-3", "col-span-full"];
export const ROW_SPAN = ["", "row-span-2", "row-span-3"];
export const COL_START = [
  "",
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
];
export const FLOW = ["grid-flow-row", "grid-flow-dense", "grid-flow-col"];

export const GRID_CELL_CLASSES = [
  ...new Set(
    [
      ...COL_SPAN,
      ...ROW_SPAN,
      ...COL_START,
      ...FLOW,
      "grid",
      "grid-cols-4",
      "grid-rows-3",
      "col-end-3",
      "row-start-1",
      "row-end-3",
    ].filter(Boolean),
  ),
];
