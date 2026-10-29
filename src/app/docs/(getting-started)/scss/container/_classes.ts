// Классы страницы «Контейнер»: контейнерные запросы. Карточка перестраивается по ширине своего блока
// (@container), а не экрана: @sm: — с 384px, @md: — с 448px, @lg: — с 512px (размеры — rendit.config.mjs).

export const QUERIES = [
  { id: "@sm", title: "@sm · 384px", px: 384 },
  { id: "@md", title: "@md · 448px", px: 448 },
  { id: "@lg", title: "@lg · 512px", px: 512 },
] as const;

export type Query = (typeof QUERIES)[number]["id"];

// что меняется на пороге: карточка встаёт в ряд, картинка — квадратом слева
export const cardClasses = (q: Query) => ({
  card: ["@container"],
  body: ["flex", "flex-col", `${q}:flex-row`],
  image: ["w-full", `${q}:w-160`, "aspect-video", `${q}:aspect-square`],
});

export const WIDTHS = ["240", "300", "360", "420", "480", "540", "600"];

export const CONTAINER_CLASSES = [
  ...new Set([
    "@container",
    ...QUERIES.flatMap((q) => {
      const c = cardClasses(q.id);
      return [...c.body, ...c.image];
    }),
    "@max-md:hidden",
    "@[500px]:grid-cols-2",
  ]),
];
