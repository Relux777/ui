// Разделы блога — боковое меню (на телефоне — строка чипов). Пока записей нет: ready: false — «скоро».

export const BLOG_MENU = [
  { title: "Все записи", href: "/blog", ready: true },
  { title: "Новости", href: "/blog/news", ready: false },
  { title: "Уроки", href: "/blog/lessons", ready: false },
  { title: "Релизы", href: "/blog/releases", ready: false },
  { title: "Заметки", href: "/blog/notes", ready: false },
] as const;
