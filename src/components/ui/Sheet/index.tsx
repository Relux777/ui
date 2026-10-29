"use client";

// Окно-лист на <dialog> (RenDit SCSS .sheet) — общее для «Быстрого перехода» и «всего меню» шапки.
// На телефоне выезжает снизу и смахивается вниз за шапку листа, с 620px — панель справа. Страница под листом
// размыта и затемнена; смахиваете — размытие тает вслед за пальцем (--sheet-drag, как в ozon/stocks).
// Верх листа: заголовок, подпись, крестик и блок под ними (top — вкладки, поиск). Список прокрутили — под всем
// верхом появляются тень и мягкий градиент, пункты уходят под него; нижний край гаснет, пока есть что листать.
// Открыть и закрыть — через ref (open, close); onOpen — прочитать данные перед показом. Сменилась страница —
// лист закрывается сам.

import { X } from "@boxicons/react/X";
import { usePathname } from "next/navigation";
import {
  type PointerEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type SheetHandle = { open: () => void; close: () => void };

type Props = {
  ref?: Ref<SheetHandle>;
  /** id листа — по нему находят окно тесты */
  id: string;
  title: string;
  /** строка под заголовком */
  subtitle?: ReactNode;
  /** блок под заголовком: остаётся на месте, список прокручивается под ним */
  top?: ReactNode;
  /** перед показом: прочитать данные страницы */
  onOpen?: () => void;
  /** классы листа: например, постоянная высота на телефоне */
  className?: string;
  children: ReactNode;
};

// смахнули вниз дальше — лист закрывается
const SWIPE_CLOSE = 110;

export function Sheet({
  ref,
  id,
  title,
  subtitle,
  top,
  onOpen,
  className = "",
  children,
}: Props) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);
  // нажатие началось на затемнении — только тогда click по нему закрывает лист (а не click, который
  // браузер присылает после касания кнопки, открывшей лист, или после выделения текста мимо)
  const downOnBackdrop = useRef(false);
  const titleId = useId();
  // список прокручен — под верхом тень; ниже ещё есть пункты — гаснет нижний край
  const [scrolled, setScrolled] = useState(false);
  const [more, setMore] = useState(false);

  const measure = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setScrolled(el.scrollTop > 4);
    setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  const close = () => dialogRef.current?.close();

  useImperativeHandle(ref, () => ({
    open() {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      onOpen?.();
      listRef.current?.scrollTo({ top: 0 });
      setScrolled(false);
      dialog.style.translate = "";
      dialog.style.removeProperty("--sheet-drag");
      dialog.showModal();
    },
    close,
  }));

  // открыли лист, отфильтровали список — края пересчитываются по размеру содержимого
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    if (list.firstElementChild) observer.observe(list.firstElementChild);
    return () => observer.disconnect();
  }, [measure]);

  // сменилась страница (переход из листа, «назад») — лист закрыт
  // biome-ignore lint/correctness/useExhaustiveDependencies: закрываем именно при смене адреса
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // смахнуть лист вниз (только телефон: на компьютере это панель справа)
  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (!matchMedia("(width < 620px)").matches || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button, a, input")) return;
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
    // клик мимо листа (по затемнению) приходит самому <dialog> — закрываем; с клавиатуры закрывает Esc
    // biome-ignore lint/a11y/useKeyWithClickEvents: Esc у модального <dialog> работает сам
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={titleId}
      className={`sheet ${className}`}
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && downOnBackdrop.current) close();
      }}
    >
      <div className="flex flex-col h-full max-h-[inherit]">
        {/* верх листа целиком: заголовок и блок под ним. Список прокрутили — тень и градиент под всем верхом */}
        <div
          data-scrolled={scrolled || undefined}
          className="relative z-1 shrink-0 flex flex-col transition-shadow duration-300 data-scrolled:shadow-[0_10px_18px_-14px_rgb(0_0_0/0.4)] after:absolute after:inset-x-0 after:top-full after:h-20 after:pointer-events-none after:bg-[linear-gradient(var(--surface),transparent)] after:opacity-0 after:transition-opacity after:duration-300 data-scrolled:after:opacity-100"
        >
          <header
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative flex items-center gap-12 px-20 pt-24 pb-14 touch-none sm:touch-auto"
          >
            {/* «ручка» листа на телефоне */}
            <span
              aria-hidden="true"
              className="sm:hidden absolute top-8 left-1/2 -translate-x-1/2 w-40 h-5 br-full bg-foreground/15"
            />
            <div className="flex flex-col min-w-0">
              <h2 id={titleId} className="font-18 font-w-700 -letter-s-1">
                {title}
              </h2>
              {subtitle && (
                <p className="truncate font-13 text-foreground-muted">
                  {subtitle}
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
          {top && <div className="flex flex-col gap-10 px-14 pb-12">{top}</div>}
        </div>
        {/* список: края плавно гаснут — сверху, когда прокрутили, снизу, пока есть что листать */}
        <div className="relative flex-1 min-h-0 flex flex-col">
          <div
            ref={listRef}
            onScroll={measure}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-14 pt-6 pb-28"
          >
            <div>{children}</div>
          </div>
          <span
            aria-hidden="true"
            data-shown={more || undefined}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(transparent,var(--surface)_85%)] opacity-0 transition-opacity duration-300 data-shown:opacity-100"
          />
        </div>
      </div>
    </dialog>
  );
}
