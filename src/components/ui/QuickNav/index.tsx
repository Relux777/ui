"use client";

// Быстрый доступ (как «Быстрый переход» в ozon: PageNav + модалка right): кнопка в шапке справа от «Начать».
// Лист (RenDit SCSS .sheet на <dialog>): на телефоне выезжает снизу, его можно смахнуть вниз; с 620px — панель
// справа. Страница под листом размыта и затемнена; смахиваете лист вниз — размытие тает вслед за пальцем
// (--sheet-drag, как в ozon/stocks). Внутри: где вы сейчас, вкладки справки (если вы в /docs) и две вкладки —
// «На странице» (разделы линией с номерами, раздел на экране подсвечен) и «Меню справки» (все готовые страницы
// плитками в две колонки). Края списка плавно гаснут: сверху — когда прокрутили, снизу — пока есть что листать.
// Разделы берутся из самой страницы в момент открытия: элементы с id и data-toc="Заголовок" (data-toc-sub —
// подраздел). Так лист работает на любой странице без отдельного оглавления.

import { MenuRight } from "@boxicons/react/MenuRight";
import { X } from "@boxicons/react/X";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PointerEvent, useEffect, useId, useRef, useState } from "react";
import { DOCS_NAV } from "@/app/docs/_nav";
import { PlatformSwitch } from "@/app/docs/_platform-switch";
import { DocsTabs } from "@/components/DocsTabs";
import { activeTab } from "@/components/DocsTabs/tabs";

type Part = {
  id: string;
  title: string;
  subs: { id: string; title: string }[];
};

// раздел «на экране» — последний, чей верх поднялся выше этой доли экрана (как в ozon)
const ACTIVE_LINE = 0.35;
// смахнули вниз дальше — лист закрывается
const SWIPE_CLOSE = 110;

// разделы видимой страницы: у спрятанных страниц (Activity) display: none — у них нет getClientRects()
function readParts() {
  const parts: Part[] = [];
  let active: string | undefined;
  const line = innerHeight * ACTIVE_LINE;
  for (const el of document.querySelectorAll<HTMLElement>("[data-toc][id]")) {
    if (!el.getClientRects().length) continue;
    const title = el.dataset.toc ?? "";
    if (el.dataset.tocSub !== undefined && parts.length)
      parts[parts.length - 1].subs.push({ id: el.id, title });
    else parts.push({ id: el.id, title, subs: [] });
    if (el.getBoundingClientRect().top <= line) active = el.id;
  }
  return { parts, active };
}

const ROW =
  "flex items-center gap-12 min-h-48 px-8 py-6 br-16 transition-colors hover:bg-foreground/5 active:bg-foreground/8";
// готовых страниц в меню справки — число на вкладке
const MENU_COUNT = DOCS_NAV.flatMap((g) => g.links).filter(
  (l) => l.ready,
).length;

const HEADING =
  "px-8 pb-6 font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle";

export function QuickNav() {
  const pathname = usePathname();
  const docs = activeTab(pathname) >= 0;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);
  // нажатие началось на затемнении — только тогда click по нему закрывает лист (а не click, который
  // браузер присылает после касания кнопки, открывшей лист, или после выделения текста мимо)
  const downOnBackdrop = useRef(false);
  const titleId = useId();
  const [parts, setParts] = useState<Part[]>([]);
  const [activePart, setActivePart] = useState<string>();
  // где вы сейчас — название страницы из <title> («Цвета — Справка RenDit UI» → «Цвета»)
  const [here, setHere] = useState("");
  // вкладка: разделы этой страницы или всё меню справки
  const [tab, setTab] = useState<"page" | "menu">("page");
  // список прокручен — шапке листа тень (пункты уходят под неё); ниже ещё есть пункты — гаснет нижний край
  const listRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [more, setMore] = useState(false);
  const onListScroll = (el: HTMLElement) => {
    setScrolled(el.scrollTop > 4);
    setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  };

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    const read = readParts();
    setParts(read.parts);
    setActivePart(read.active);
    setHere(document.title.split(" — ")[0]);
    setTab(read.parts.length ? "page" : "menu");
    listRef.current?.scrollTo({ top: 0 });
    setScrolled(false);
    dialog.style.translate = "";
    dialog.style.removeProperty("--sheet-drag");
    dialog.showModal();
  };

  const close = () => dialogRef.current?.close();

  // открыли лист или сменили вкладку — пересчитать, гаснет ли нижний край (событий прокрутки ещё не было)
  // biome-ignore lint/correctness/useExhaustiveDependencies: пересчёт при смене содержимого
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (listRef.current) onListScroll(listRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [tab, parts]);

  // сменилась страница (переход из листа, «назад») — лист закрыт
  // biome-ignore lint/correctness/useExhaustiveDependencies: закрываем именно при смене адреса
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // смахнуть лист вниз (только телефон: на компьютере это панель справа)
  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (!matchMedia("(width < 620px)").matches || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button, a")) return;
    drag.current = { y: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    const dialog = dialogRef.current;
    if (!d || !dialog) return;
    d.dy = Math.max(0, e.clientY - d.y);
    dialog.style.transition = "none";
    dialog.style.translate = `0 ${d.dy}px`;
    // насколько лист смахнули (0…1) — по ней тает размытие и затемнение страницы под листом (.sheet::backdrop)
    dialog.dataset.dragging = "";
    dialog.style.setProperty(
      "--sheet-drag",
      Math.min(1, d.dy / dialog.offsetHeight).toFixed(3),
    );
  };
  const onPointerUp = () => {
    const d = drag.current;
    const dialog = dialogRef.current;
    drag.current = null;
    if (!d || !dialog) return;
    // переход .sheet ведёт лист от места, где его отпустили: вниз (закрыть) или пружиной обратно;
    // размытие под листом тает до нуля или возвращается тем же переходом
    dialog.style.transition = "";
    dialog.style.translate = "";
    delete dialog.dataset.dragging;
    if (d.dy > SWIPE_CLOSE) close();
    else dialog.style.removeProperty("--sheet-drag");
  };

  return (
    <>
      <button
        type="button"
        aria-label="Быстрый переход"
        aria-haspopup="dialog"
        onClick={open}
        className="size-36 shrink-0 br-full grid place-items-center text-foreground transition opacity-80 hover:opacity-100 active:opacity-100 hover:shadow-7 active:shadow-7 active:bg-surface-muted/50 active:scale-92 max-sm:[[data-search]_&]:hidden"
      >
        <MenuRight width={20} height={20} aria-hidden="true" />
      </button>

      {/* клик мимо листа (по затемнению) приходит самому <dialog> — закрываем; с клавиатуры закрывает Esc */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Esc у модального <dialog> работает сам */}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="sheet"
        onPointerDown={(e) => {
          downOnBackdrop.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && downOnBackdrop.current) close();
        }}
      >
        <div className="flex flex-col h-full max-h-[inherit]">
          {/* список прокрутили — у шапки тень, под ней мягкий градиент: пункты плавно уходят под шапку */}
          <header
            data-scrolled={scrolled || undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative z-1 shrink-0 flex items-center gap-12 px-20 pt-24 pb-14 touch-none sm:touch-auto transition-shadow duration-300 data-scrolled:shadow-[0_10px_18px_-14px_rgb(0_0_0/0.4)] after:absolute after:inset-x-0 after:top-full after:h-20 after:pointer-events-none after:bg-[linear-gradient(var(--surface),transparent)] after:opacity-0 after:transition-opacity after:duration-300 data-scrolled:after:opacity-100"
          >
            {/* «ручка» листа на телефоне */}
            <span
              aria-hidden="true"
              className="sm:hidden absolute top-8 left-1/2 -translate-x-1/2 w-40 h-5 br-full bg-foreground/15"
            />
            <div className="flex flex-col min-w-0">
              <h2 id={titleId} className="font-18 font-w-700 -letter-s-1">
                Быстрый переход
              </h2>
              {here && (
                <p className="truncate font-13 text-foreground-muted">
                  Вкладка — <span className="text-foreground">{here}</span>
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={close}
              className="ml-auto size-32 shrink-0 br-full grid place-items-center bg-foreground/5 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground active:scale-92"
            >
              <X width={18} height={18} aria-hidden="true" />
            </button>
          </header>
          {/* две вкладки: разделы этой страницы и всё меню справки */}
          <div className="shrink-0 flex flex-col gap-12 px-14 pb-10">
            {docs && <DocsTabs variant="sheet" onNavigate={close} />}
            <div className="grid grid-cols-2 gap-4 p-3 br-full bg-foreground/5">
              {(
                [
                  ["page", "На странице", parts.length],
                  ["menu", "Меню справки", MENU_COUNT],
                ] as const
              ).map(([id, title, count]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={tab === id}
                  disabled={id === "page" && !parts.length}
                  onClick={() => {
                    setTab(id);
                    listRef.current?.scrollTo({ top: 0 });
                  }}
                  className="flex items-center justify-center gap-6 h-34 br-full font-13 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2 disabled:opacity-40"
                >
                  {title}
                  <span className="min-w-20 px-5 br-full bg-foreground/8 font-11 tabular-nums">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {/* список: края плавно гаснут — сверху, когда прокрутили, снизу, пока есть что листать */}
          <div className="relative flex-1 min-h-0 flex flex-col">
            <div
              ref={listRef}
              onScroll={(e) => onListScroll(e.currentTarget)}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-14 pt-6 pb-28"
            >
              {tab === "page" ? (
                <ol className="relative flex flex-col before:absolute before:left-[29px] before:top-24 before:bottom-24 before:w-2 before:br-full before:bg-foreground/8">
                  {parts.map((part, i) => {
                    const on = part.id === activePart;
                    return (
                      <li key={part.id} className="relative flex flex-col">
                        <a
                          href={`#${part.id}`}
                          onClick={close}
                          aria-current={on ? "location" : undefined}
                          className={`${ROW} aria-[current=location]:bg-secondary/10 aria-[current=location]:text-secondary`}
                        >
                          <span
                            aria-hidden="true"
                            className={`relative z-1 size-32 shrink-0 br-full grid place-items-center font-12 font-w-700 tabular-nums shadow-[0_0_0_4px_var(--surface)] ${on ? "bg-secondary text-secondary-foreground" : "bg-surface-muted text-foreground-muted"}`}
                          >
                            {i + 1}
                          </span>
                          <span className="flex-1 min-w-0 font-15 font-w-500">
                            {part.title}
                          </span>
                          {on && (
                            <span className="shrink-0 px-8 py-2 br-full bg-secondary/12 font-11 font-w-600">
                              вы здесь
                            </span>
                          )}
                        </a>
                        {part.subs.length > 0 && (
                          <ul className="flex flex-wrap gap-6 pl-52 pb-8">
                            {part.subs.map((sub) => (
                              <li key={sub.id}>
                                <a
                                  href={`#${sub.id}`}
                                  onClick={close}
                                  className="block px-10 py-4 br-full bg-foreground/5 font-13 text-foreground-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
                                >
                                  {sub.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className="flex flex-col gap-18">
                  {/* платформа — и на телефоне, где левого меню нет */}
                  <PlatformSwitch />
                  {DOCS_NAV.map((group) => {
                    const links = group.links.filter((l) => l.ready);
                    if (!links.length) return null;
                    return (
                      <section
                        key={group.title}
                        className="flex flex-col gap-8"
                      >
                        <h3 className={HEADING}>{group.title}</h3>
                        {/* плитки в две колонки: всё меню видно почти без прокрутки */}
                        <ul className="grid grid-cols-2 gap-6">
                          {links.map((link) => (
                            <li key={link.href} className="min-w-0">
                              <Link
                                href={link.href}
                                onClick={close}
                                aria-current={
                                  pathname === link.href ? "page" : undefined
                                }
                                className="flex items-center min-h-42 px-12 py-8 br-14 bg-foreground/4 font-14 font-w-500 transition-[background-color,scale] hover:bg-foreground/8 active:scale-97 aria-[current=page]:bg-secondary aria-[current=page]:text-secondary-foreground aria-[current=page]:font-w-600"
                              >
                                <span className="truncate">{link.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
            <span
              aria-hidden="true"
              data-shown={more || undefined}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(transparent,var(--surface)_85%)] opacity-0 transition-opacity duration-300 data-shown:opacity-100"
            />
          </div>{" "}
        </div>
      </dialog>
    </>
  );
}
