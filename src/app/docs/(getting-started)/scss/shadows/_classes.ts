// Классы страницы «Тени»: для конструктора (SHADOW_CLASSES) и таблицы «класс → CSS» (TABLE_CLASSES).
// CSS считает движок при сборке страницы.

export const SHADOW_CLASSES = [
  "shadow-1",
  "shadow-2",
  "shadow-3",
  "shadow-4",
  "shadow-5",
  "shadow-6",
  "shadow-7",
  "shadow-9",
  "shadow-8",
  "shadow-10",
  "shadow-11",
  "shadow-12",
  "shadow-inset",
  "shadow-line",
  "shadow-glass",
  "shadow-none",
];

export const TABLE_CLASSES = [
  ...SHADOW_CLASSES,
  "hover:shadow-4",
  "dark:shadow-none",
];
