// Классы страницы «Картинки и видео»: из них выбирает конструктор, их CSS страница просит у движка при сборке.
// Отдельных классов для object-position по сторонам в движке нет — свои значения в скобках.

export const FITS = [
  "object-cover",
  "object-contain",
  "object-fill",
  "object-none",
  "object-scale-down",
];

export const POSITIONS = [
  { id: "object-center", title: "центр" },
  { id: "[object-position:top]", title: "верх" },
  { id: "[object-position:bottom]", title: "низ" },
  { id: "[object-position:left]", title: "слева" },
  { id: "[object-position:right]", title: "справа" },
] as const;

export type Position = (typeof POSITIONS)[number]["id"];

export const FRAMES = ["aspect-square", "aspect-video", "aspect-3/4"];

export const OBJECT_CLASSES = [
  ...FITS,
  ...POSITIONS.map((p) => p.id),
  ...FRAMES,
];
