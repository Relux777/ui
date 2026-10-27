"use client";

// Тема сайта: next-themes ставит data-theme на <html> до первой отрисовки (CSS-переменные тем — settings/).
// Здесь же — цвет панели браузера и строки состояния на телефоне: метатеги из layout знают только системную тему,
// а ThemeColor перекрашивает их в тему, выбранную кнопкой. Один раз на сайт, а не в каждой кнопке темы.

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ComponentProps, useEffect } from "react";
import { THEME_COLORS } from "@/config/theme";

function useSuppressScriptTagWarning() {
  useEffect(() => {
    // предупреждение next-themes + React 19 бывает только в dev; в проде console не трогаем
    if (process.env.NODE_ENV === "production") return;

    const originalError = console.error;

    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Encountered a script tag while rendering")
      ) {
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);
}

function ThemeColor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
    for (const meta of document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]',
    ))
      meta.content = THEME_COLORS[resolvedTheme];
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  useSuppressScriptTagWarning();

  return (
    <NextThemesProvider
      attribute="data-theme" // для CSS-переменных тем
      defaultTheme="system" // системная тема по умолчанию
      enableSystem={true} // определять системную тему
      disableTransitionOnChange // без мерцания переходов при смене темы
      {...props}
    >
      <ThemeColor />
      {children}
    </NextThemesProvider>
  );
}
