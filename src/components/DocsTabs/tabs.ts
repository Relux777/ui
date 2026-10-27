// Вкладки раздела «Справка» (как у HeroUI: Getting Started · Components · Releases) и выбор вкладки по адресу.
// Без React и иконок — проверяется тестом (tabs.test.ts).

// title — в шапке, short — в доке над нижним меню (там места меньше)
export const DOCS_TABS = [
  {
    id: "install",
    title: "Установка и настройка",
    short: "Установка",
    href: "/docs/install",
  },
  {
    id: "components",
    title: "Компоненты",
    short: "Компоненты",
    href: "/docs/components",
  },
  {
    id: "releases",
    title: "Обновления",
    short: "Обновления",
    href: "/docs/releases",
  },
] as const;

export const DOCS_ROOT = "/docs";

type Tab = { readonly href: string };

const within = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

// вкладка текущей страницы: адрес вне /docs — −1; страница своей вкладки (/docs/components/button) — она;
// всё остальное в /docs (обзор, установка, стеки, токены…) — первая вкладка, «Установка и настройка»
export function activeTab(pathname: string, tabs: readonly Tab[] = DOCS_TABS) {
  if (!within(pathname, DOCS_ROOT)) return -1;
  const i = tabs.findIndex((tab, n) => n > 0 && within(pathname, tab.href));
  return i === -1 ? 0 : i;
}
