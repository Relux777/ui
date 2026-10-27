"use client";

// Ссылка логотипа на главную. Уже на главной адрес тот же — Next не прокручивает наверх, а браузер
// впустую проигрывал смену страницы. Поэтому здесь клик просто плавно поднимает страницу наверх
// (при «уменьшении движения» — сразу); шапка и меню меняются от самой прокрутки. Ctrl/Cmd/Shift + клик —
// как у обычной ссылки.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

export function HomeLink(props: Omit<ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      href="/"
      onClick={(e) => {
        if (
          pathname !== "/" ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        )
          return;
        e.preventDefault();
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    />
  );
}
