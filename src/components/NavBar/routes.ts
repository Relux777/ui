// Пункты нижнего меню и выбор пункта текущей страницы. Без React и иконок — проверяется тестом (routes.test.ts).

// match — раздел пункта, если он шире самой ссылки: «Справка» ведёт на установку, а выбрана во всём /docs.
// «Меню» — отдельная страница (окно быстрого доступа открывает кнопка в шапке)
export const ROUTES = [
  { label: "Главная", href: "/" },
  { label: "Справка", href: "/docs/install", match: "/docs" },
  { label: "Блог", href: "/blog" },
  { label: "Меню", href: "/menu" },
] as const;

type Route = { readonly href: string | null; readonly match?: string };

// пункт текущей страницы: самый длинный раздел (match или href), с которого начинается адрес
// (/docs/colors, /docs/components → «Справка»); ничего не подошло — первый пункт
export function activeIndex(
  pathname: string,
  routes: readonly Route[] = ROUTES,
) {
  let best = 0;
  let bestLength = 0;
  routes.forEach((route, i) => {
    const section = route.match ?? route.href;
    if (!section) return;
    const hit =
      section === "/"
        ? pathname === "/"
        : pathname === section || pathname.startsWith(`${section}/`);
    if (hit && section.length > bestLength) {
      best = i;
      bestLength = section.length;
    }
  });
  return best;
}
