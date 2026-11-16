// Классы конструктора появления — без "use client": страница просит их CSS у движка при сборке.

export const EFFECTS = [
  { id: "fade", title: "Проявление", cls: "[@starting-style]:opacity-0" },
  {
    id: "up",
    title: "Снизу",
    cls: "[@starting-style]:opacity-0 [@starting-style]:translate-y-20",
  },
  {
    id: "scale",
    title: "Масштаб",
    cls: "[@starting-style]:opacity-0 [@starting-style]:scale-95",
  },
] as const;

export const DURATIONS = ["duration-150", "duration-300", "duration-500"];

export const BASE = [
  "transition-[opacity,translate,scale]",
  "ease-spring",
  "opacity-100",
  "translate-y-0",
  "scale-100",
];

export const ENTER_CLASSES = [
  ...BASE,
  ...EFFECTS.flatMap((e) => e.cls.split(" ")),
  ...DURATIONS,
];
