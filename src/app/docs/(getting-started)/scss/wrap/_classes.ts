// Классы страницы «Перенос и обрезка»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const MODES = [
  { id: "", title: "Как есть" },
  { id: "truncate", title: "В строку…" },
  { id: "line-clamp", title: "N строк…" },
  { id: "whitespace-nowrap", title: "Без переноса" },
  { id: "whitespace-pre-wrap", title: "Как набрано" },
] as const;
export type Mode = (typeof MODES)[number]["id"];

export const CLAMP = ["1", "2", "3", "4", "5"].map((n) => `line-clamp-${n}`);
export const BREAKS = ["", "break-words", "break-all"];

export const WRAP_CLASSES = [
  "truncate",
  "text-ellipsis",
  ...CLAMP,
  "whitespace-normal",
  "whitespace-nowrap",
  "whitespace-pre",
  "whitespace-pre-wrap",
  "whitespace-pre-line",
  "break-normal",
  "break-words",
  "break-all",
  "hyphens-auto",
  "hyphens-manual",
  "hyphens-none",
];
