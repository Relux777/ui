// Классы страницы «Списки»: из них выбирает конструктор, их CSS страница просит у движка при сборке.

export const TYPES = ["list-disc", "list-decimal", "list-none"];
export const POSITIONS = ["list-outside", "list-inside"];
export const MARKERS = [
  "",
  "marker:text-secondary",
  "marker:text-foreground-subtle",
  "marker:font-w-700",
];
export const SPACES = ["space-y-0", "space-y-4", "space-y-8", "space-y-12"];
export const PADS = ["pl-0", "pl-20", "pl-32"];

export const LIST_CLASSES = [
  ...TYPES,
  ...POSITIONS,
  ...MARKERS.filter(Boolean),
  ...SPACES,
  ...PADS,
];
