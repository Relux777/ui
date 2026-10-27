// Размер текста на сайте (быстрое меню у NavBar). Выбранный размер — в localStorage; на <html> ставится
// --text-scale = размер / 14: на неё умножаются базовый шрифт и классы font-N (RenDit Code).
// Без React — проверяется тестом (text-size.test.ts) и встраивается в скрипт до первой отрисовки.

export const TEXT_SIZES = [13, 14, 15, 16, 17, 18] as const;
export const DEFAULT_TEXT_SIZE = 14;
export const TEXT_SIZE_KEY = "text-size";

// сохранённое значение → размер; мусор и старые значения — по умолчанию
export function parseTextSize(raw: string | null | undefined) {
  const n = Number(raw);
  return (TEXT_SIZES as readonly number[]).includes(n) ? n : DEFAULT_TEXT_SIZE;
}

export const textScale = (size: number) =>
  String(Number((size / DEFAULT_TEXT_SIZE).toFixed(4)));

// Встроенный скрипт в начале <body>: ставит сохранённый размер до первой отрисовки — текст не «прыгает»
export const TEXT_SIZE_SCRIPT = `try{var s=+localStorage.getItem(${JSON.stringify(TEXT_SIZE_KEY)});if(${JSON.stringify(TEXT_SIZES)}.indexOf(s)>-1&&s!==${DEFAULT_TEXT_SIZE})document.documentElement.style.setProperty("--text-scale",String(+(s/${DEFAULT_TEXT_SIZE}).toFixed(4)))}catch(e){}`;
