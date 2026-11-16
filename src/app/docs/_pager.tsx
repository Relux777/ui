"use client";

// Кнопки внизу страницы справки: «Предыдущая» и «Следующая» по порядку оглавления, в конце — вкладки
// «Компоненты» и «Обновления». Адрес страницы знает браузер, поэтому выбор соседей — здесь, в клиентской части.

import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "./_nav";
import { docsNeighbors, type PagerPage, pagerPages } from "./_pager-data";

const DOCS_PAGES = pagerPages(DOCS_NAV);

const CARD =
  "group flex items-center gap-14 p-16 br-xl border bg-surface shadow-1 transition-[border-color,box-shadow,translate] duration-300 ease-spring hover:border-secondary hover:shadow-2 hover:-translate-y-1 active:scale-98 motion-reduce:transition-none";

function Card({ page, dir }: { page: PagerPage; dir: "prev" | "next" }) {
  const prev = dir === "prev";
  return (
    <Link
      href={page.href}
      rel={dir}
      className={`${CARD} ${prev ? "" : "sm:col-start-2 justify-end text-right"}`}
    >
      {prev && (
        <ArrowLeft
          aria-hidden="true"
          className="shrink-0 size-20 text-foreground-muted transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
        />
      )}
      <span className="flex flex-col gap-3 min-w-0">
        <span className="font-11 font-w-700 uppercase letter-s-6 text-foreground-subtle">
          {prev ? "Предыдущая" : "Следующая"}
        </span>
        <span className="font-14 font-w-600 truncate">{page.title}</span>
      </span>
      {!prev && (
        <ArrowRight
          aria-hidden="true"
          className="shrink-0 size-20 text-foreground-muted transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        />
      )}
    </Link>
  );
}

export function DocsPager({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { prev, next } = docsNeighbors(pathname, DOCS_PAGES);
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Страницы справки"
      className={`grid gap-12 sm:grid-cols-2 ${className}`}
    >
      {prev && <Card page={prev} dir="prev" />}
      {next && <Card page={next} dir="next" />}
    </nav>
  );
}
