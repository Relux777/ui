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

// фоны и текст конструктора — тоже просим у движка, чтобы вкладка «CSS» показывала их правила
export const BODY_CLASSES = [
  "bg-surface",
  "bg-surface-muted",
  "bg-surface-inverse",
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-transparent",
  "text-foreground",
  "text-foreground-inverse",
  "text-primary-foreground",
  "text-secondary-foreground",
  "text-accent-foreground",
];
