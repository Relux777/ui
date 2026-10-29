// Классы страницы «Пропорции»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const RATIOS = [
  "aspect-square",
  "aspect-video",
  "aspect-4/3",
  "aspect-3/4",
  "aspect-9/16",
  "aspect-[21/9]",
];
export const WIDTHS = [96, 120, 160, 200, 240, 280, 320, 360, 400].map(
  (n) => `w-${n}`,
);
export const SIZING = ["box-border", "box-content"];

export const ASPECT_CLASSES = [...RATIOS, ...WIDTHS, ...SIZING];
