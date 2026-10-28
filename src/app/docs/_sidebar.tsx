"use client";

// Боковое меню документации: пункты из _nav.ts, текущая страница выделена. Готовых страниц ещё мало —
// остальные пункты видны как «скоро», чтобы было понятно, что появится.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "./_nav";
import { PlatformSwitch } from "./_platform-switch";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Документация" className="flex flex-col gap-24 font-14">
      {/* платформа — сверху: от неё зависят шаги и код на страницах */}
      <PlatformSwitch />
      {DOCS_NAV.map((group) => (
        <div key={group.title} className="flex flex-col gap-6">
          <h2 className="font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
            {group.title}
          </h2>
          <ul className="flex flex-col gap-2">
            {group.links.map((link) => (
              <li key={link.href}>
                {link.ready ? (
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={`block px-10 py-6 br-md transition ${pathname === link.href ? "bg-surface text-foreground font-w-500 shadow-1" : "text-foreground-muted hover:text-foreground hover:bg-surface/60"}`}
                  >
                    {link.title}
                  </Link>
                ) : (
                  <span className="flex items-center justify-between gap-8 px-10 py-6 text-foreground-subtle">
                    {link.title}
                    <span className="font-11 px-6 br-full border">скоро</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
