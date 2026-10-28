// Плавная смена страниц (.route-enter, RenDit SCSS components/_route-enter.scss) — только при переходах внутри
// сайта. При первой загрузке и перезагрузке накладки нет: страница видна сразу, как пришла по сети. Раньше на
// медленном интернете каждый блок появлялся «из фона» — в тёмной теме чёрным прямоугольником, тающим в прозрачный.
//
// Встроенный скрипт в начале <body> (layout.tsx) ставит на <html> data-first-load: с ним анимация накладки
// заканчивается, не начавшись (animation-duration: 0s). Снимается при первом действии человека — касании,
// клике, клавише, «назад», — но не раньше, чем разметка загрузится целиком: блоки, что ещё идут по сети,
// не должны проявляться, а переход по ссылке до этого всё равно невозможен. Анимации уже показанных блоков
// к этому времени закончились — снятие атрибута их не перезапускает.

// Функция уходит в страницу текстом (ROUTE_ENTER_SCRIPT), поэтому самодостаточна
export function firstLoadGate(w: Window) {
  const root = w.document.documentElement;
  const input = ["pointerdown", "keydown", "popstate"];
  root.setAttribute("data-first-load", "");
  function open() {
    if (w.document.readyState === "loading") return;
    root.removeAttribute("data-first-load");
    for (const type of input) w.removeEventListener(type, open, true);
  }
  for (const type of input) w.addEventListener(type, open, true);
}

export const ROUTE_ENTER_SCRIPT = `(${firstLoadGate})(window)`;
