// Классы страницы «Отображение»: из них выбирает конструктор, их CSS страница просит у движка при сборке.
// К каждому значению — вариант с sm: (показать только с 620px).

export const DISPLAY = [
  "block",
  "inline-block",
  "inline",
  "flex",
  "inline-flex",
  "grid",
  "contents",
  "hidden",
];

export const SCREENS = [
  { id: "always", title: "Всегда" },
  { id: "phone", title: "Только телефон" },
  { id: "wide", title: "С 620px" },
] as const;

export type Screen = (typeof SCREENS)[number]["id"];

// какой набор классов даёт выбор: на телефоне спрятать — sm:hidden, с 620px показать — hidden sm:…
export function displayClasses(display: string, screen: Screen) {
  if (screen === "phone") return [display, "sm:hidden"];
  if (screen === "wide") return ["hidden", `sm:${display}`];
  return [display];
}

export const DISPLAY_CLASSES = [
  ...new Set([
    ...DISPLAY,
    ...DISPLAY.map((d) => `sm:${d}`),
    "sm:hidden",
    "grid-cols-3",
  ]),
];
