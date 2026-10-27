"use client";

// Вкладки «Справки»: Установка и настройка · Компоненты · Обновления (как у HeroUI). Видны только в /docs.
// Стиль — как у раскрытой таблетки поиска в шапке: тонкая капсула, внутри — вкладки, у выбранной стеклянная
// подложка (как у крестика поиска: bg-surface/40 + shadow-9) и залитая иконка Boxicons.
//   • header — по центру шапки (от 620px): иконки, подписи — от 1200px (уже — не помещаются рядом с поиском).
//     Наверху страницы — светлая капсула, после прокрутки — стеклянная таблетка, как логотип и кнопки:
//     классы таблетки и место в сетке шапки передаёт шапка;
//   • inline — на телефоне (до 620px) в начале страницы справки: уезжает вместе с текстом и не закрывает
//     контент (раньше вкладки висели над нижним меню). Ещё они есть в окне быстрого доступа (QuickNav);
//   • sheet — в окне быстрого доступа, на всю ширину.
// Подложка выбранной вкладки — ::before: вырастает из середины на пружине. Как и нижнее меню, вкладка
// выделяется сразу по нажатию, не дожидаясь загрузки страницы.

import { History } from "@boxicons/react/History";
import { Rocket } from "@boxicons/react/Rocket";
import { Shapes } from "@boxicons/react/Shapes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, type ReactNode, useState } from "react";
import { activeTab, DOCS_TABS } from "./tabs";

const ICONS = { install: Rocket, components: Shapes, releases: History };
const ICON_SIZE = 18;

// капсула-дорожка: как поле раскрытого поиска
const TRACK = "flex items-center gap-2 p-3 br-full";
const TRACK_TINT = "bg-foreground/5 border border-foreground/5";
// подложка выбранной вкладки — стекло для маленьких элементов, вырастает из середины
const THUMB =
  "before:absolute before:inset-0 before:-z-1 before:br-full before:bg-surface/50 before:shadow-9 before:opacity-0 before:[scale:0.6_1] before:transition-[opacity,scale] before:duration-500 before:ease-spring aria-[current=page]:before:opacity-100 aria-[current=page]:before:[scale:1] motion-reduce:before:transition-none";
const TAB = `relative isolate flex items-center justify-center gap-6 h-32 br-full font-13 font-w-500 whitespace-nowrap text-foreground/60 transition-colors hover:text-foreground aria-[current=page]:text-foreground ${THUMB}`;

type Props = {
  variant: "header" | "inline" | "sheet";
  /** header: классы таблетки и место в сетке шапки */
  className?: string;
  /** header: «прожектор» шапки — кладётся внутрь таблетки */
  children?: ReactNode;
  /** sheet: закрыть окно после перехода */
  onNavigate?: () => void;
};

export function DocsTabs({
  variant,
  className = "",
  children,
  onNavigate,
}: Props) {
  const pathname = usePathname();
  // нажатая вкладка — выбрана, пока адрес не сменился; сменился — выбор снова по адресу
  const [picked, setPicked] = useState<{ path: string; i: number }>();
  const current = activeTab(pathname);
  const active = picked?.path === pathname ? picked.i : current;

  if (current < 0) return null;

  const pick = (e: MouseEvent, i: number) => {
    // Ctrl/Cmd/Shift + клик открывает новую вкладку браузера — здесь ничего не меняется
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    setPicked({ path: pathname, i });
    onNavigate?.();
  };

  const header = variant === "header";
  const tabs = DOCS_TABS.map((tab, i) => {
    const Icon = ICONS[tab.id];
    const on = i === active;
    return (
      <Link
        key={tab.id}
        href={tab.href}
        title={header ? tab.title : undefined}
        aria-current={on ? "page" : undefined}
        onClick={(e) => pick(e, i)}
        className={
          header
            ? `${TAB} px-10 xl:px-14`
            : `${TAB} flex-1 min-w-0 gap-4! px-6 font-12! max-[360px]:[&>svg]:hidden`
        }
      >
        <Icon
          pack={on ? "filled" : "basic"}
          width={ICON_SIZE}
          height={ICON_SIZE}
          className="shrink-0"
          aria-hidden="true"
        />
        {/* в шапке до 1200px подпись только для скринридеров */}
        <span className={header ? "max-xl:sr-only" : "truncate"}>
          {header ? tab.title : tab.short}
        </span>
      </Link>
    );
  });

  if (header)
    return (
      <nav
        aria-label="Разделы справки"
        className={`${className} ${TRACK} ${TRACK_TINT} max-sm:hidden`}
      >
        {children}
        {tabs}
      </nav>
    );

  return (
    <nav
      aria-label="Разделы справки"
      className={`${className} ${TRACK} ${TRACK_TINT} ${variant === "inline" ? "sm:hidden" : ""}`}
    >
      {tabs}
    </nav>
  );
}
