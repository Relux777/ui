// Цвет панели браузера на телефоне (<meta name="theme-color">) для каждой темы — как фон страницы (--background:
// gray-50 в светлой, #070707 в тёмной). layout.tsx ставит его по системной теме, ThemeToggle — по теме, выбранной кнопкой.
export const THEME_COLORS = { light: "#fafafb", dark: "#070707" } as const;
