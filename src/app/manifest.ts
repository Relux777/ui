// Манифест веб-приложения: сайт ставится на телефон/компьютер и открывается как приложение — без панелей браузера.
import type { MetadataRoute } from "next";
import { THEME_COLORS } from "@/config/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "RenDit UI",
    short_name: "RenDit UI",
    description:
      "Свой UI-фреймворк: стили RenDit SCSS, движок классов RenDit Code и компоненты",
    lang: "ru",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // экран запуска и строка состояния — в цвет тёмной темы, как плитка иконки
    background_color: THEME_COLORS.dark,
    theme_color: THEME_COLORS.dark,
    categories: ["developer", "productivity"],
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  };
}
