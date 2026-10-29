// Классы страницы «Выравнивание»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const KINDS = [
  { id: "flex flex-wrap", title: "flex + перенос" },
  { id: "grid grid-cols-3", title: "grid 3 колонки" },
] as const;
export type Kind = (typeof KINDS)[number]["id"];

export const JUSTIFY = [
  "justify-start",
  "justify-center",
  "justify-end",
  "justify-between",
];
export const ITEMS = [
  "items-start",
  "items-center",
  "items-end",
  "items-stretch",
];
export const CONTENT = [
  "content-start",
  "content-center",
  "content-end",
  "content-between",
];
export const JUSTIFY_ITEMS = [
  "",
  "justify-items-start",
  "justify-items-center",
  "justify-items-end",
];
export const SELF = [
  "",
  "self-start",
  "self-center",
  "self-end",
  "self-stretch",
];

export const ALIGN_CLASSES = [
  ...new Set([
    ...KINDS.flatMap((k) => k.id.split(" ")),
    ...JUSTIFY,
    ...ITEMS,
    ...CONTENT,
    ...JUSTIFY_ITEMS,
    ...SELF,
    "place-items-center",
    "place-content-center",
    "place-self-center",
    "justify-self-end",
    "justify-around",
    "justify-evenly",
    "items-baseline",
  ]),
].filter(Boolean);
