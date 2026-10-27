// Когда страница считается прокрученной: от этого зависят компактная шапка и нижнее меню (data-scrolled на <html>).
// Два порога (гистерезис): включается после SCROLL_ON, выключается только на SCROLL_OFF и выше —
// на границе шапка не «дрожит» туда-обратно от пары пикселей инерции.
//
// Следит за прокруткой один встроенный скрипт в начале <body> (layout.tsx) — на всё время жизни вкладки,
// вне React: переходы между страницами его не пересоздают. Он работает ещё до загрузки React, поэтому
// после перезагрузки посреди страницы шапка и меню сразу в нужном виде.
// Пока пользователь сам ничего не трогал (перезагрузка, переход по #якорю в адресе), состояние меняется
// мгновенно: на время смены — data-instant, он выключает переходы (generic/_base.scss). После первого
// касания, колеса, клавиши — с обычной анимацией.

export const SCROLL_ON = 40;
export const SCROLL_OFF = 16;

// Функция уходит в страницу текстом (SCROLL_SCRIPT), поэтому самодостаточна: всё нужное — в параметрах.
export function watchScroll(w: Window, on: number, off: number) {
  const root = w.document.documentElement;
  const input = ["wheel", "touchstart", "keydown", "pointerdown"];
  let byUser = false;
  let frame = 0;

  function update() {
    frame = 0;
    const was = root.hasAttribute("data-scrolled");
    const next = was ? w.scrollY > off : w.scrollY > on;
    if (next === was) return;
    if (byUser) {
      root.toggleAttribute("data-scrolled", next);
      return;
    }
    root.setAttribute("data-instant", "");
    root.toggleAttribute("data-scrolled", next);
    void root.offsetHeight; // стили пересчитаны без переходов — теперь data-instant можно снять
    root.removeAttribute("data-instant");
  }
  function onInput() {
    byUser = true;
    for (const type of input) w.removeEventListener(type, onInput, true);
  }

  update();
  // атрибут пишется только при смене состояния и не чаще раза в кадр
  w.addEventListener(
    "scroll",
    () => {
      if (!frame) frame = w.requestAnimationFrame(update);
    },
    { passive: true },
  );
  // браузер восстанавливает прокрутку после перезагрузки уже после этого скрипта
  w.addEventListener("DOMContentLoaded", update);
  for (const type of input)
    w.addEventListener(type, onInput, { passive: true, capture: true });
}

export const SCROLL_SCRIPT = `(${watchScroll})(window,${SCROLL_ON},${SCROLL_OFF})`;
