// Классы страницы «Видимость»: из них выбирает конструктор, их CSS страница просит у движка при сборке.
// Для сравнения рядом — hidden и opacity-0: они тоже «прячут», но иначе.

export const HIDE = [
  { cls: "visible", place: true, click: true, reader: true, seen: true },
  { cls: "invisible", place: true, click: false, reader: false, seen: false },
  { cls: "hidden", place: false, click: false, reader: false, seen: false },
  { cls: "opacity-0", place: true, click: true, reader: true, seen: false },
  { cls: "sr-only", place: false, click: false, reader: true, seen: false },
] as const;

export const VISIBILITY_CLASSES = [
  ...HIDE.map((h) => h.cls),
  "not-sr-only",
  "isolate",
];
