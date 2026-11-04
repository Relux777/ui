// Когда страница считается прокрученной: от этого зависят компактная шапка и нижнее меню (data-scrolled на <html>).
// Два порога (гистерезис): включается после SCROLL_ON, выключается только на SCROLL_OFF и выше —
// на границе шапка не «дрожит» туда-обратно от пары пикселей инерции.
//
// Следит за прокруткой один встроенный скрипт в начале <body> (layout.tsx) — на всё время жизни вкладки,
// вне React: переходы между страницами его не пересоздают. Он работает ещё до загрузки React, поэтому
// после перезагрузки посреди страницы шапка и меню сразу в нужном виде. Смена состояния — обычным
// переключением атрибута: плавность даёт CSS (transition у таблетки и названия), ничего не отключаем.

export const SCROLL_ON = 40;
export const SCROLL_OFF = 16;

// Функция уходит в страницу текстом (SCROLL_SCRIPT), поэтому самодостаточна: всё нужное — в параметрах.
export function watchScroll(w: Window, on: number, off: number) {
  const root = w.document.documentElement;
  let frame = 0;

  function update() {
    frame = 0;
    const was = root.hasAttribute("data-scrolled");
    const next = was ? w.scrollY > off : w.scrollY > on;
    if (next === was) return;
    root.toggleAttribute("data-scrolled", next);
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
}

export const SCROLL_SCRIPT = `(${watchScroll})(window,${SCROLL_ON},${SCROLL_OFF})`;
