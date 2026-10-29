// Страница-образец для HTML без сборки (установка, платформа «HTML»): всё, что нужно в <head> — кодировка,
// масштаб на телефоне, тема до первой отрисовки (без вспышки), готовый CSS, — и пара элементов на классах
// RenDit. Все классы образца есть в готовом CSS — страница работает как есть (под тестом: html-page.test.ts).

// тема до первой отрисовки: выбранная или как в системе
export const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light"}catch(e){}`;

export const htmlPage = (css: string) => `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>Мой сайт</title>
  <!-- тема до первой отрисовки: выбранная или как в системе — без вспышки -->
  <script>${THEME_SCRIPT}</script>
  <link rel="stylesheet" href="${css}">
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-background text-foreground">
  <main class="container py-48 flex flex-col items-start gap-16">
    <h1 class="font-36 font-w-700 -letter-s-2">Привет, RenDit UI</h1>
    <p class="max-w-480 text-foreground-muted">Классы в разметке, цвета из токенов — тёмная тема работает сама.</p>
    <button class="h-40 px-16 br-full bg-primary text-primary-foreground font-w-600 transition-colors hover:bg-primary-hover">Кнопка</button>
  </main>
</body>
</html>`;

// классы образца — для проверки, что все они есть в готовом CSS (.container — из RenDit SCSS, не класс движка)
export const pageClasses = (html: string) =>
  [...html.matchAll(/class="([^"]*)"/g)]
    .flatMap((m) => m[1].split(/\s+/))
    .filter((c) => c && c !== "container");
