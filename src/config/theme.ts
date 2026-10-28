// Тема сайта и цвет панели браузера на телефоне (<meta name="theme-color">) — как фон страницы (--background:
// gray-50 в светлой, #070707 в тёмной). Без React — проверяется тестом (theme.test.ts).
//
// layout.tsx ставит метатеги по теме системы, а тема сайта может быть другой (выбрали кнопкой). Раньше панель
// перекрашивал только ThemeProvider после загрузки скриптов — при перезагрузке она была цвета системы и плавно
// перетекала в цвет сайта (тёмная полоса сверху, если система тёмная, а сайт светлый). Теперь цвет ставит
// встроенный скрипт до первой отрисовки.

export const THEME_COLORS = { light: "#fafafb", dark: "#070707" } as const;

// ключ next-themes в localStorage: "light" | "dark" | "system"
export const THEME_KEY = "theme";

// Встроенный скрипт в начале <body>: сохранённая тема (или тема системы) → цвет всех meta theme-color
export const THEME_COLOR_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)}),c=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)?${JSON.stringify(THEME_COLORS.dark)}:${JSON.stringify(THEME_COLORS.light)},m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++)m[i].content=c}catch(e){}`;
