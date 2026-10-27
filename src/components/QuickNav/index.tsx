"use client";

// Быстрый доступ (как «Быстрый переход» в ozon: PageNav + модалка right): кнопка в шапке справа от «Начать»,
// и тот же лист открывает пункт «Меню» нижнего меню (open.ts) — на телефоне он под большим пальцем.
// Лист (RenDit SCSS .sheet на <dialog>): на телефоне выезжает снизу, его можно смахнуть вниз; с 620px — панель
// справа. Внутри: вкладки справки (если вы в /docs), «На этой странице» — разделы страницы с номерами, раздел
// на экране подсвечен, и все готовые страницы справки.
// Разделы берутся из самой страницы в момент открытия: элементы с id и data-toc="Заголовок" (data-toc-sub —
// подраздел). Так лист работает на любой странице без отдельного оглавления.

import { ChevronRight } from "@boxicons/react/ChevronRight";
import { MenuRight } from "@boxicons/react/MenuRight";
import { X } from "@boxicons/react/X";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type PointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { DOCS_NAV } from "@/app/docs/_nav";
import { DocsTabs } from "@/components/DocsTabs";
import { activeTab } from "@/components/DocsTabs/tabs";
import { QUICK_NAV_EVENT } from "./open";

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
  "flex items-center gap-12 p-8 br-16 transition-colors hover:bg-foreground/5 active:bg-foreground/8";
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

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    const read = readParts();
    setParts(read.parts);
    setActivePart(read.active);
    dialog.style.translate = "";
    dialog.showModal();
  }, []);

  const close = () => dialogRef.current?.close();

  // «Меню» в нижнем меню
  useEffect(() => {
    addEventListener(QUICK_NAV_EVENT, open);
    return () => removeEventListener(QUICK_NAV_EVENT, open);
  }, [open]);

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
  };
  const onPointerUp = () => {
    const d = drag.current;
    const dialog = dialogRef.current;
    drag.current = null;
    if (!d || !dialog) return;
    // переход .sheet ведёт лист от места, где его отпустили: вниз (закрыть) или пружиной обратно
    dialog.style.transition = "";
    dialog.style.translate = "";
    if (d.dy > SWIPE_CLOSE) close();
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
          <header
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative shrink-0 flex items-center gap-12 px-20 pt-20 pb-12 touch-none sm:touch-auto"
          >
            {/* «ручка» листа на телефоне */}
            <span
              aria-hidden="true"
              className="sm:hidden absolute top-8 left-1/2 -translate-x-1/2 w-40 h-5 br-full bg-foreground/15"
            />
            <h2 id={titleId} className="font-18 font-w-700 -letter-s-1">
              Быстрый переход
            </h2>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={close}
              className="ml-auto size-32 shrink-0 br-full grid place-items-center bg-foreground/5 text-foreground/70 transition hover:bg-foreground/10 hover:text-foreground active:scale-92"
            >
              <X width={18} height={18} aria-hidden="true" />
            </button>
          </header>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-12 pb-20 flex flex-col gap-24">
            {docs && <DocsTabs variant="sheet" onNavigate={close} />}

            {parts.length > 0 && (
              <section className="flex flex-col">
                <h3 className={HEADING}>На этой странице</h3>
                <ol className="flex flex-col gap-2">
                  {parts.map((part, i) => {
                    const on = part.id === activePart;
                    return (
                      <li key={part.id} className="flex flex-col gap-6">
                        <a
                          href={`#${part.id}`}
                          onClick={close}
                          aria-current={on ? "location" : undefined}
                          className={`${ROW} aria-[current=location]:bg-secondary/10`}
                        >
                          <span
                            aria-hidden="true"
                            className={`size-32 shrink-0 br-full grid place-items-center font-12 font-w-700 tabular-nums ${on ? "bg-secondary text-secondary-foreground" : "bg-foreground/5 text-foreground-muted"}`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 min-w-0 font-15 font-w-500">
                            {part.title}
                          </span>
                          <ChevronRight
                            size="sm"
                            className="shrink-0 text-foreground-subtle"
                            aria-hidden="true"
                          />
                        </a>
                        {part.subs.length > 0 && (
                          <ul className="flex flex-wrap gap-6 pl-52 pb-6">
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
              </section>
            )}

            {DOCS_NAV.map((group) => {
              const links = group.links.filter((l) => l.ready);
              if (!links.length) return null;
              return (
                <section key={group.title} className="flex flex-col">
                  <h3 className={HEADING}>{group.title}</h3>
                  <ul className="flex flex-col gap-2">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={close}
                          aria-current={
                            pathname === link.href ? "page" : undefined
                          }
                          className={`${ROW} font-15 aria-[current=page]:bg-foreground/5 aria-[current=page]:font-w-600`}
                        >
                          <span className="flex-1 min-w-0">{link.title}</span>
                          <ChevronRight
                            size="sm"
                            className="shrink-0 text-foreground-subtle"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </dialog>
    </>
  );
}
