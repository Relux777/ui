"use client";

// «Всё меню» — кружок справа в шапке (как логотип слева): лист со всей справкой. Сверху — вкладки справки
// (в /docs) и поиск по названиям и классам («w-20» → «Ширина»), Enter открывает первую найденную страницу.
// Ниже платформа и группы страниц плитками в две колонки, у каждой плитки — главный класс страницы; группы
// сворачиваются, и это общее с левым меню (_nav-closed.ts). На телефоне лист постоянной высоты — пока ищете,
// он не прыгает. Классы таблетки и «прожектор» передаёт шапка.

import { ChevronDown } from "@boxicons/react/ChevronDown";
import { MenuRight } from "@boxicons/react/MenuRight";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useId, useRef, useState } from "react";
import { filterDocsNav } from "@/app/docs/_nav";
import { setGroupOpen, useClosedGroups } from "@/app/docs/_nav-closed";
import { NavFilter } from "@/app/docs/_nav-filter";
import { PlatformSwitch } from "@/app/docs/_platform-switch";
import { DocsTabs } from "@/components/DocsTabs";
import { activeTab } from "@/components/DocsTabs/tabs";
import { Sheet, type SheetHandle } from "@/components/ui/Sheet";

const HEADING =
  "group w-full flex items-center gap-8 px-8 py-6 font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle text-left transition-colors hover:text-foreground disabled:cursor-default disabled:hover:text-foreground-subtle";

type Props = {
  /** классы таблетки шапки */
  className?: string;
  /** «прожектор» шапки */
  children?: ReactNode;
};

export function MenuSheet({ className = "", children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const id = useId();
  const sheet = useRef<SheetHandle>(null);
  const [query, setQuery] = useState("");
  // где вы сейчас — название страницы из <title> («Цвета — Справка RenDit UI» → «Цвета»)
  const [here, setHere] = useState("");
  const closed = useClosedGroups();
  const docs = activeTab(pathname) >= 0;
  const searching = query.trim() !== "";
  const groups = filterDocsNav(query);
  const close = () => sheet.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label="Всё меню"
        aria-haspopup="dialog"
        onClick={() => sheet.current?.open()}
        className={`${className} group size-44 shrink-0 grid place-items-center text-foreground max-sm:[[data-search]_&]:hidden`}
      >
        {children}
        <MenuRight
          width={22}
          height={22}
          aria-hidden="true"
          className="opacity-80 transition-[opacity,scale] group-hover:opacity-100 group-active:scale-85 motion-reduce:transition-none"
        />
      </button>

      <Sheet
        ref={sheet}
        id="site-menu"
        title="Меню"
        subtitle={
          here && (
            <>
              Вкладка — <span className="text-foreground">{here}</span>
            </>
          )
        }
        onOpen={() => {
          setQuery("");
          setHere(document.title.split(" — ")[0]);
        }}
        className="max-sm:h-[85dvh]"
        top={
          <>
            {docs && <DocsTabs variant="sheet" onNavigate={close} />}
            <NavFilter
              value={query}
              onChange={setQuery}
              onEnter={() => {
                const first = groups[0]?.links[0];
                if (first) router.push(first.href);
              }}
            />
          </>
        }
      >
        <div className="flex flex-col gap-10">
          {/* платформа — и на телефоне, где левого меню нет */}
          {docs && !searching && <PlatformSwitch className="mb-6" />}
          {groups.length === 0 && (
            <p className="px-8 py-12 font-14 text-foreground-muted">
              Ничего не нашлось. Попробуйте класс целиком (<code>w-20</code>,{" "}
              <code>hover:</code>) или тему: «тени», «шрифт».
            </p>
          )}
          {groups.map((group, g) => {
            const open = searching || !closed.includes(group.title);
            const listId = `${id}-${g}`;
            return (
              <section key={group.title} className="flex flex-col">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={listId}
                    disabled={searching}
                    onClick={() => setGroupOpen(group.title, !open)}
                    className={HEADING}
                  >
                    <span className="flex-1 min-w-0 truncate">
                      {group.title}
                    </span>
                    <span className="font-11 font-w-500 tabular-nums">
                      {group.links.length}
                    </span>
                    <ChevronDown
                      size="xs"
                      aria-hidden="true"
                      className="shrink-0 transition-[rotate] duration-400 ease-spring group-[[aria-expanded=false]]:-rotate-90 group-[:disabled]:hidden motion-reduce:transition-none"
                    />
                  </button>
                </h3>
                {/* сворачивание — строки сетки 1fr → 0fr: высота без замеров */}
                <div
                  id={listId}
                  inert={!open}
                  data-closed={!open || undefined}
                  className="grid grid-rows-[1fr] data-closed:grid-rows-[0fr] transition-[grid-template-rows] duration-400 ease-spring motion-reduce:transition-none"
                >
                  {/* плитки в две колонки: всё меню видно почти без прокрутки */}
                  <ul className="min-h-0 overflow-hidden grid grid-cols-2 gap-6 pb-8">
                    {group.links.map((link) => (
                      <li key={link.href} className="min-w-0 flex">
                        <Link
                          href={link.href}
                          onClick={close}
                          aria-current={
                            pathname === link.href ? "page" : undefined
                          }
                          className="flex-1 min-w-0 flex flex-col justify-center gap-1 min-h-48 px-12 py-7 br-14 bg-foreground/4 transition-[background-color,scale] hover:bg-foreground/8 active:scale-97 aria-[current=page]:bg-secondary aria-[current=page]:text-secondary-foreground"
                        >
                          <span className="truncate font-14 font-w-500">
                            {link.title}
                          </span>
                          {link.classes && (
                            <code className="truncate font-mono font-11 opacity-55">
                              {link.classes[0]}
                            </code>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      </Sheet>
    </>
  );
}
