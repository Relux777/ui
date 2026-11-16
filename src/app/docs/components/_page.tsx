// Каркас страницы компонента, как у HeroUI: путь, заголовок, вводный текст, разделы и «На этой странице».
// Содержимое — Part из страниц классов: конструктор, установка, примеры.

import { ChevronRight } from "@boxicons/react/ChevronRight";
import Link from "next/link";
import type { ReactNode } from "react";
import { Toc, type TocItem } from "../../_docs/toc";

export function ComponentPage({
  title,
  lead,
  toc,
  tabs,
  children,
}: {
  title: string;
  lead: ReactNode;
  toc: TocItem[];
  /** вкладки внутри раздела: «Селект / Конструктор» */
  tabs?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <header className="flex flex-col gap-14 max-w-720">
          <nav
            aria-label="Путь"
            className="flex flex-wrap items-center gap-4 font-13 text-foreground-muted"
          >
            <Link
              href="/docs/components"
              className="transition-colors hover:text-foreground"
            >
              Компоненты
            </Link>
            <ChevronRight size="xs" aria-hidden="true" />
            <span aria-current="page" className="text-foreground">
              {title}
            </span>
          </nav>
          <h1 className="font-36 md:font-48 font-w-700 -letter-s-3 leading-1.1 text-balance">
            {title}
          </h1>
          <p className="font-17 text-foreground-muted">{lead}</p>
          {tabs}
        </header>
        {children}
      </div>
      <aside className="max-xl:hidden">
        <div className="sticky top-80">
          <Toc items={toc} />
        </div>
      </aside>
    </div>
  );
}
