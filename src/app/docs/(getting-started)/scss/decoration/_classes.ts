// Классы страницы «Оформление»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const LINES = ["underline", "overline", "line-through", "no-underline"];
export const STYLES = [
  "decoration-solid",
  "decoration-dotted",
  "decoration-dashed",
  "decoration-wavy",
  "decoration-double",
];
export const THICKNESS = ["1", "2", "3", "4", "6"].map(
  (n) => `decoration-${n}`,
);
export const OFFSET = ["0", "2", "4", "6", "8"].map(
  (n) => `underline-offset-${n}`,
);
export const COLORS = [
  "decoration-current",
  "decoration-secondary",
  "decoration-success",
  "decoration-danger",
  "decoration-foreground/30",
];
export const CASES = ["normal-case", "uppercase", "lowercase", "capitalize"];

export const DECORATION_CLASSES = [
  ...LINES,
  ...STYLES,
  ...THICKNESS,
  ...OFFSET,
  ...COLORS,
  ...CASES,
  "italic",
  "not-italic",
  "tabular-nums",
];
