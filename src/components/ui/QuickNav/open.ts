// Открыть окно быстрого доступа откуда угодно (пункт «Меню» в нижнем меню): событие на window — окно (QuickNav
// в шапке) слушает его. Отдельный файл без React: нижнему меню не нужно тянуть в себя само окно.

export const QUICK_NAV_EVENT = "rendit:quick-nav";

export function openQuickNav() {
  window.dispatchEvent(new Event(QUICK_NAV_EVENT));
}
