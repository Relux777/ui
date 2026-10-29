// Разделы страницы для «Быстрого перехода»: элементы с id и data-toc="Заголовок" (data-toc-sub — подраздел).
// Читаются из самой страницы в момент открытия — так окно работает на любой странице без отдельного оглавления.
// Окно открывает кнопка в быстром меню NavBar (openQuickNav) — она видна, только если разделы есть (hasParts).

export type Part = {
  id: string;
  title: string;
  subs: { id: string; title: string }[];
};

// раздел «на экране» — последний, чей верх поднялся выше этой доли экрана (как в ozon)
const ACTIVE_LINE = 0.35;

const SELECTOR = "[data-toc][id]";
// у спрятанных страниц (Activity) display: none — у них нет getClientRects()
const shown = (el: Element) => el.getClientRects().length > 0;

export function readParts() {
  const parts: Part[] = [];
  let active: string | undefined;
  const line = innerHeight * ACTIVE_LINE;
  for (const el of document.querySelectorAll<HTMLElement>(SELECTOR)) {
    if (!shown(el)) continue;
    const title = el.dataset.toc ?? "";
    if (el.dataset.tocSub !== undefined && parts.length)
      parts[parts.length - 1].subs.push({ id: el.id, title });
    else parts.push({ id: el.id, title, subs: [] });
    if (el.getBoundingClientRect().top <= line) active = el.id;
  }
  return { parts, active };
}

export const hasParts = () =>
  [...document.querySelectorAll(SELECTOR)].some(shown);

const OPEN_EVENT = "quick-nav:open";

export const openQuickNav = () => dispatchEvent(new Event(OPEN_EVENT));

export function onOpenQuickNav(open: () => void) {
  addEventListener(OPEN_EVENT, open);
  return () => removeEventListener(OPEN_EVENT, open);
}
