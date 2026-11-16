// Классы конструктора прокрутки — без "use client": страница просит их CSS у движка при сборке.

export const BARS = [
  { id: "scrollbar-thin", title: "Тонкая" },
  { id: "scrollbar-none", title: "Скрыть" },
] as const;

export const SCROLL_MT = [0, 20, 40, 80, 120];

export const SCROLL_CLASSES = [
  ...BARS.map((b) => b.id),
  "scroll-smooth",
  ...SCROLL_MT.map((n) => `scroll-mt-${n}`),
];
