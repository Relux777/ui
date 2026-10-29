// Классы страницы «Высота»: из них выбирает конструктор, их CSS страница просит у движка при сборке
// (classCss). Шкала чисел строится в коде: таких классов нет в CSS сайта, конструктор вставляет правила
// выбранных сам (ClassStyle).

export const H_PX = [
  0, 16, 24, 32, 40, 48, 64, 80, 96, 120, 160, 200, 240, 280,
].map((n) => `h-${n}`);
export const H_FRACTIONS = ["h-1/4", "h-1/3", "h-1/2", "h-2/3", "h-full"];
export const H_WORDS = ["h-auto", "h-fit"];
export const MIN_H = ["", "min-h-80", "min-h-160", "min-h-full"];
export const MAX_H = ["", "max-h-120", "max-h-200", "max-h-full"];
export const SCROLL = "overflow-y-auto";

export const HEIGHT_CLASSES = [
  ...new Set(
    [...H_PX, ...H_FRACTIONS, ...H_WORDS, ...MIN_H, ...MAX_H, SCROLL].filter(
      Boolean,
    ),
  ),
];
