// Раздел «Справка». Три вкладки — у каждой свой layout (как у HeroUI):
//   (getting-started)/   Установка и настройка — боковое меню слева, страница справа (обзор, установка, стеки…)
//   components/          Компоненты
//   releases/            Обновления
// Вкладки — в шапке (от 620px), на телефоне — здесь, в начале страницы (уезжают с текстом и не закрывают
// контент), и в окне быстрого доступа. Обёртки нет намеренно: вкладки и корни layout вкладок — прямые дети
// .route-enter корневого layout, при переходе между вкладками проявляется вся вкладка (обёртка с
// display: contents растянула бы накладку перехода на весь экран — поверх шапки и меню).

import type { Metadata } from "next";
import { DocsTabs } from "@/components/DocsTabs";

export const metadata: Metadata = {
  title: { default: "Справка", template: "%s — Справка RenDit UI" },
};

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <>
      <DocsTabs variant="inline" className="mx-10 mt-12" />
      {children}
    </>
  );
}
