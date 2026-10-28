"use client";

// Меню блога: с 990px — колонка слева, как боковое меню справки; уже — прокручиваемая строка чипов.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BLOG_MENU } from "./_menu";

export function BlogMenu() {
  const pathname = usePathname();

  return (
    <nav aria-label="Разделы блога" className="flex flex-col gap-6 font-14">
      <h2 className="max-lg:hidden font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
        Блог
      </h2>
      {/* на телефоне — строка чипов: прокручивается сама, страница не шире экрана */}
      <ul className="flex lg:flex-col gap-6 lg:gap-2 overflow-x-auto scrollbar-none">
        {BLOG_MENU.map((link) => (
          <li key={link.href} className="shrink-0">
            {link.ready ? (
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="flex items-center px-12 lg:px-10 py-6 br-full lg:br-md border lg:border-0 border-border text-foreground-muted transition hover:text-foreground lg:hover:bg-surface/60 aria-[current=page]:bg-surface aria-[current=page]:text-foreground aria-[current=page]:font-w-500 aria-[current=page]:shadow-1"
              >
                {link.title}
              </Link>
            ) : (
              <span className="flex items-center justify-between gap-8 px-12 lg:px-10 py-6 br-full lg:br-md border lg:border-0 border-dashed text-foreground-subtle">
                {link.title}
                <span className="font-11 px-6 br-full border">скоро</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
