// Классы конструктора сетки .row — без "use client": страница просит их CSS у движка при сборке.

export const SETS = [
  { id: "2", title: "Две", col: "col-12 md:col-6", cards: 2 },
  { id: "3", title: "Три", col: "col-12 md:col-6 lg:col-4", cards: 3 },
  { id: "4", title: "Четыре", col: "col-12 sm:col-6 lg:col-3", cards: 4 },
  { id: "auto", title: "По содержимому", col: "col-auto", cards: 3 },
] as const;

export const GUTTERS = [0, 8, 12, 16, 20, 24, 32, 40];

export const ROW_CLASSES = [
  ...new Set([
    ...SETS.flatMap((s) => s.col.split(" ")),
    ...GUTTERS.map((n) => `gutter-${n}`),
  ]),
];
