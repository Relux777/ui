import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import HeaderComponent from "@/components/Header";
import { SCROLL_SCRIPT } from "@/components/Header/scroll-state";
import NavBarComponent from "@/components/NavBar";
import { TEXT_SIZE_SCRIPT } from "@/config/text-size";
import { THEME_COLORS } from "@/config/theme";
import { ThemeProvider } from "@/providers/theme-provider";

import "@/assets/scss/RenDit_UI.scss";
import "@/assets/scss/generated/rendit-code.css";

// Вариативный шрифт: ось wght в файле — 400…700. Next кладёт имя семейства в --font-google-sans,
// а font-family с этой переменной задаётся в generic/_base.scss.
const googleSans = localFont({
  src: "../assets/fonts/GoogleSans-Variable.ttf",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-google-sans",
});

// Иконки подключаются сами из файлов рядом: icon.svg (фавикон), icon1/icon2.tsx (PNG для Android),
// apple-icon.tsx, opengraph-image.tsx, manifest.ts
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: { default: "RenDit UI", template: "%s — RenDit UI" },
  description:
    "Свой UI-фреймворк: стили RenDit SCSS, движок классов RenDit Code и компоненты",
  applicationName: "RenDit UI",
  // «На экран Домой» на iPhone: открывается без панелей Safari, как приложение;
  // строка состояния прозрачная — под ней фон страницы (отступ сверху — env(safe-area-inset-top))
  appleWebApp: {
    capable: true,
    title: "RenDit UI",
    statusBarStyle: "black-translucent",
  },
  // номера и адреса в тексте не превращаются в ссылки сами
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // страница под «чёлкой» и полоской «Домой»: поля даёт env(safe-area-inset-*) (шапка, нижнее меню, контейнер)
  viewportFit: "cover",
  // клавиатура на Android сжимает страницу, а не наезжает на нижнее меню
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={googleSans.variable}
      // плавная прокрутка к якорям; Next выключает её на время переходов между страницами
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      {/* .aura — мягкое свечение и сетка точек вверху страницы (RenDit SCSS components/_aura.scss) */}
      <body className="aura">
        {/* сохранённый размер текста — до первой отрисовки, чтобы текст не «прыгал» (config/text-size.ts) */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: свой постоянный скрипт без пользовательских данных
          dangerouslySetInnerHTML={{
            __html: `${TEXT_SIZE_SCRIPT};${SCROLL_SCRIPT}`,
          }}
        />
        <ThemeProvider storageKey="theme">
          <HeaderComponent />
          {/* смена страниц: новая страница проявляется (components/_route-enter.scss), шапка и нижнее меню
              не участвуют. Обёртка без своей коробки (display: contents) — раскладку не меняет */}
          <div className="route-enter contents">{children}</div>
          <NavBarComponent />
        </ThemeProvider>
      </body>
    </html>
  );
}
