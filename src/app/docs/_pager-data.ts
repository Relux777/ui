// Порядок страниц для кнопок «Предыдущая» и «Следующая»: как в оглавлении, дальше готовые компоненты,
// в конце — вкладка «Обновления». Сами кнопки — _pager.tsx; здесь только данные и соседи по адресу,
// чтобы это можно было проверить тестом. Оглавление передаётся снаружи: у теста и сайта один DOCS_NAV.

import type { DocsGroup } from "./_nav";

export type PagerPage = { title: string; href: string };

export const COMPONENT_PAGES: PagerPage[] = [
  { title: "Поле ввода", href: "/docs/components/input" },
  {
    title: "Конструктор поля",
    href: "/docs/components/input/constructor",
  },
  { title: "Выбор", href: "/docs/components/select" },
  {
    title: "Конструктор выбора",
    href: "/docs/components/select/constructor",
  },
  { title: "Вкладки", href: "/docs/components/tabs" },
  { title: "Навигация", href: "/docs/components/navigation" },
  {
    title: "Конструктор навигации",
    href: "/docs/components/navigation/constructor",
  },
  { title: "Меню", href: "/docs/components/menu" },
  {
    title: "Конструктор меню",
    href: "/docs/components/menu/constructor",
  },
];

export function pagerPages(nav: readonly DocsGroup[]): PagerPage[] {
  return [
    ...nav.flatMap((group) =>
      group.links.map(({ title, href }) => ({ title, href })),
    ),
    { title: "Компоненты", href: "/docs/components" },
    ...COMPONENT_PAGES,
    { title: "Обновления", href: "/docs/releases" },
  ];
}

export function docsNeighbors(pathname: string, pages: readonly PagerPage[]) {
  const i = pages.findIndex((p) => p.href === pathname);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: pages[i - 1] ?? null,
    next: pages[i + 1] ?? null,
  };
}
