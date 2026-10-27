// Сколько страницы прочитано, 0…100 %. scrollable — на сколько её вообще можно прокрутить
// (scrollHeight − clientHeight); страница без прокрутки считается прочитанной целиком.
export function readPercent(scrollY: number, scrollable: number) {
  if (scrollable <= 0) return 100;
  return Math.round(Math.min(1, Math.max(0, scrollY / scrollable)) * 100);
}
