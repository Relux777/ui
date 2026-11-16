// Классы конструктора размытия — без "use client": страница просит их CSS у движка при сборке.

export const BLUR_VALUES = [0, 2, 4, 6, 8, 12, 16, 24, 32, 40];

export const BLUR_CLASSES = [
  ...BLUR_VALUES.map((n) => `blur-${n}`),
  ...BLUR_VALUES.map((n) => `backdrop-blur-${n}`),
  "bg-surface/60",
  "border",
];
