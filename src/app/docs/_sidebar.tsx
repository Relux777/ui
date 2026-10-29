"use client";

// Левое меню справки — как у Tailwind: группы, в каждой страницы, рядом с названием — главный класс страницы.
// Сверху платформа и поиск: по названию и по классу («w-20» → «Ширина», «hover:» → «Состояния»), Enter открывает
// первую найденную. Группы сворачиваются (_nav-closed.ts: запоминается и общее со «всем меню»), группа текущей
// страницы раскрывается сама. Платформа и поиск стоят на месте, прокручивается только список групп — своим
// блоком, текущая страница в его видимой части. Края списка гаснут маской (сверху — когда прокрутили, снизу —
// пока есть что листать): без подложки, поэтому на свечении вверху страницы не видно прямоугольника фона.

import { ChevronDown } from "@boxicons/react/ChevronDown";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { DOCS_NAV, filterDocsNav } from "./_nav";
import { setGroupOpen, useClosedGroups } from "./_nav-closed";
import { NavFilter } from "./_nav-filter";
import { PlatformSwitch } from "./_platform-switch";

export function DocsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const id = useId();
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const closed = useClosedGroups();
  // сохранённые свёрнутые группы приходят сразу после загрузки — сворачивание анимируется только потом
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // края списка: data-top — прокрутили (гаснет верх), data-more — ниже ещё есть пункты (гаснет низ)
  useEffect(() => {
    const box = listRef.current;
    if (!box) return;
    const edges = () => {
      box.toggleAttribute("data-top", box.scrollTop > 2);
      box.toggleAttribute(
        "data-more",
        box.scrollTop + box.clientHeight < box.scrollHeight - 2,
      );
    };
    edges();
    const observer = new ResizeObserver(edges);
    observer.observe(box);
    if (box.firstElementChild) observer.observe(box.firstElementChild);
    box.addEventListener("scroll", edges, { passive: true });
    return () => {
      observer.disconnect();
      box.removeEventListener("scroll", edges);
    };
  }, []);

  // перешли на страницу из свёрнутой группы — раскрыть её; текущая страница — в видимой части меню
  useEffect(() => {
    const group = DOCS_NAV.find((g) =>
      g.links.some((l) => l.href === pathname),
    );
    if (group) setGroupOpen(group.title, true);
    const link = navRef.current?.querySelector<HTMLElement>(
      "[aria-current=page]",
    );
    const box = listRef.current;
    if (!link || !box) return;
    const r = link.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    if (r.top < b.top || r.bottom > b.bottom)
      box.scrollTop += r.top - b.top - b.height / 3;
  }, [pathname]);

  const searching = query.trim() !== "";
  const groups = filterDocsNav(query);

  return (
    <nav
      ref={navRef}
      aria-label="Документация"
      data-ready={ready || undefined}
      className="flex flex-col gap-10 min-h-0 font-14"
    >
      {/* платформа (от неё зависят шаги и код на страницах) и поиск — всегда сверху, список прокручивается ниже */}
      <div className="relative z-2 shrink-0 flex flex-col gap-10">
        <PlatformSwitch />
        <NavFilter
          value={query}
          onChange={(value) => {
            setQuery(value);
            // найденное — с начала меню, а не под платформой и поиском
            listRef.current?.scrollTo({ top: 0 });
          }}
          onEnter={() => {
            const first = groups[0]?.links[0];
            if (first) router.push(first.href);
          }}
        />
      </div>
      {/* список групп: прокручивается сам; края гаснут маской по data-top / data-more */}
      <div
        ref={listRef}
        className="min-h-0 -mx-8 px-8 pt-4 pb-16 overflow-y-auto overscroll-contain scrollbar-thin [--fade-top:0px] [--fade-bottom:0px] data-top:[--fade-top:24px] data-more:[--fade-bottom:32px] [mask-image:linear-gradient(to_bottom,transparent,#000_var(--fade-top),#000_calc(100%-var(--fade-bottom)),transparent)]"
      >
        <div className="flex flex-col gap-6">
          {groups.length === 0 && (
            <p className="px-4 font-13 text-foreground-muted">
              Ничего не нашлось. Попробуйте класс целиком (<code>w-20</code>,{" "}
              <code>hover:</code>) или тему: «тени», «шрифт».
            </p>
          )}
          {groups.map((group, g) => {
            const open = searching || !closed.includes(group.title);
            const listId = `${id}-${g}`;
            return (
              <section key={group.title} className="flex flex-col">
                <h2>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={listId}
                    disabled={searching}
                    onClick={() => setGroupOpen(group.title, !open)}
                    className="group w-full flex items-center gap-8 py-6 font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle text-left transition-colors hover:text-foreground disabled:cursor-default disabled:hover:text-foreground-subtle"
                  >
                    <span className="flex-1 min-w-0 truncate">
                      {group.title}
                    </span>
                    <span className="font-11 font-w-500 tabular-nums opacity-0 transition-opacity group-[[aria-expanded=false]]:opacity-100">
                      {group.links.length}
                    </span>
                    <ChevronDown
                      size="xs"
                      aria-hidden="true"
                      className="shrink-0 transition-[rotate] duration-400 ease-spring group-[[aria-expanded=false]]:-rotate-90 group-[:disabled]:hidden"
                    />
                  </button>
                </h2>
                {/* сворачивание — строки сетки 1fr → 0fr: высота без замеров */}
                <div
                  id={listId}
                  inert={!open}
                  data-closed={!open || undefined}
                  className="grid grid-rows-[1fr] data-closed:grid-rows-[0fr] [[data-ready]_&]:transition-[grid-template-rows] [[data-ready]_&]:duration-400 [[data-ready]_&]:ease-spring motion-reduce:transition-none"
                >
                  <ul className="min-h-0 overflow-hidden flex flex-col ml-2 mb-8 border-l border-foreground/8">
                    {group.links.map((link) => {
                      const on = pathname === link.href;
                      return (
                        <li key={link.href} className="flex">
                          <Link
                            href={link.href}
                            aria-current={on ? "page" : undefined}
                            className="flex-1 min-w-0 -ml-px flex items-center gap-8 pl-12 pr-6 py-5 border-l border-transparent text-foreground-muted transition-colors hover:text-foreground hover:border-foreground/30 aria-[current=page]:border-secondary aria-[current=page]:text-foreground aria-[current=page]:font-w-600 focus-visible:outline-offset-[-2px]"
                          >
                            <span className="flex-1 min-w-0 truncate">
                              {link.title}
                            </span>
                            {link.classes && (
                              <code className="shrink-0 max-w-[45%] truncate font-mono font-11 text-foreground-subtle">
                                {link.classes[0]}
                              </code>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
