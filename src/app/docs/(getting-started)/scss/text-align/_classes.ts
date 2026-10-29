// Классы страницы «Выравнивание текста»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const ALIGN = [
  "text-left",
  "text-center",
  "text-right",
  "text-justify",
  "text-start",
  "text-end",
];
export const WRAP = ["text-wrap", "text-balance", "text-pretty", "text-nowrap"];

export const TEXT_ALIGN_CLASSES = [...ALIGN, ...WRAP];
