// Классы страницы «Ширина»: из них выбирает конструктор, их CSS страница просит у движка при сборке
// (classCss). Шкалы чисел строятся в коде: таких классов нет в CSS сайта, конструктор вставляет правила
// выбранных сам (ClassStyle).

const scale = (prefix: string, steps: number[]) =>
  steps.map((n) => `${prefix}-${n}`);

export const W_PX = scale(
  "w",
  [
    0, 8, 16, 24, 32, 40, 48, 64, 80, 96, 120, 160, 200, 240, 280, 320, 360,
    400, 480, 560, 640,
  ],
);
export const W_FRACTIONS = [
  "w-1/4",
  "w-1/3",
  "w-1/2",
  "w-2/3",
  "w-3/4",
  "w-full",
];
export const W_WORDS = ["w-auto", "w-fit", "w-min", "w-max", "w-full"];
export const MIN_W = ["", "min-w-0", "min-w-120", "min-w-240", "min-w-full"];
export const MAX_W = ["", "max-w-160", "max-w-240", "max-w-360", "max-w-full"];
export const SIZE = scale("size", [16, 24, 32, 40, 48, 64, 80, 96]);

export const WIDTH_CLASSES = [
  ...new Set(
    [...W_PX, ...W_FRACTIONS, ...W_WORDS, ...MIN_W, ...MAX_W, ...SIZE].filter(
      Boolean,
    ),
  ),
];
