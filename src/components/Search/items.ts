// Подсказки поиска. Пока тестовые: пара классов и страница установки — настоящий индекс документации позже.
// Страниц классов ещё нет, поэтому классы ведут на «Справку».

export type SearchItem = {
  title: string;
  text: string;
  href: string;
  kind: "class" | "doc";
  /** слова, по которым тоже находится: английское имя свойства, синонимы */
  keys: string;
};

export const SEARCH_ITEMS: SearchItem[] = [
  {
    title: "w-N",
    text: "Ширина: w-120, w-full, w-1/2",
    href: "/docs",
    kind: "class",
    keys: "width ширина",
  },
  {
    title: "min-w-N",
    text: "Минимальная ширина: min-w-0, min-w-fit",
    href: "/docs",
    kind: "class",
    keys: "min-width ширина",
  },
  {
    title: "max-w-N",
    text: "Максимальная ширина: max-w-640, max-w-60ch",
    href: "/docs",
    kind: "class",
    keys: "max-width ширина",
  },
  {
    title: "h-N",
    text: "Высота: h-48, h-full, h-100dvh",
    href: "/docs",
    kind: "class",
    keys: "height высота",
  },
  {
    title: "p-N",
    text: "Внутренние отступы: p-20, px-16, pt-0",
    href: "/docs",
    kind: "class",
    keys: "padding отступы",
  },
  {
    title: "Установка",
    text: "RenDit UI под ваш стек",
    href: "/docs/install",
    kind: "doc",
    keys: "install установить npm",
  },
];

const LIMIT = 6;

// регистр и ё не важны: «Ширина» = «ширина»
const normalize = (value: string) =>
  value.toLowerCase().replaceAll("ё", "е").trim();

// совпадение в начале названия — выше, потом в названии, потом в описании и ключевых словах
export function searchItems(query: string, items = SEARCH_ITEMS): SearchItem[] {
  const needle = normalize(query);
  if (!needle) return [];
  const rank = ({ title, text, keys }: SearchItem) => {
    const t = normalize(title);
    if (t.startsWith(needle)) return 0;
    if (t.includes(needle)) return 1;
    return normalize(`${keys} ${text}`).includes(needle) ? 2 : -1;
  };
  return items
    .map((item) => ({ item, r: rank(item) }))
    .filter(({ r }) => r >= 0)
    .sort((a, b) => a.r - b.r)
    .slice(0, LIMIT)
    .map(({ item }) => item);
}
