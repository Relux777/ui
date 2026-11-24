"use client";

// Модальное окно на <dialog> — то же стекло RenDit SCSS, что у .sheet (Modal в том же _sheet.scss):
// страница под окном затемнена и размыта, окно в верхнем слое, Esc закрывает, фокус браузер держит сам.
// Позиция — пропсом: position="center" (карточка по центру, по умолчанию), right/left (панель сбоку),
// bottom (лист снизу). На телефоне позиция своя — phone (по умолчанию bottom: лист смахивается вниз,
// как в iOS и Android); смахивание — только на телефоне, только когда внизу и только за шапку.
// Смахнули дальше порога — окно доезжает вниз от места отпускания и только потом закрывается:
// нативный close() сам анимацию не доигрывает.
// Открыть и закрыть — через ref (open, close). Сменилась страница — окно закрывается само.
// inline — окно внутри родительской рамки (превью в конструкторе): без верхнего слоя, зато со своей
// подложкой (затемнение + размытие, как у настоящего ::backdrop), клик по ней закрывает окно.
// Содержимое — обычный ReactNode, файлы рядом: content/content_N.tsx. Кнопкам контента не нужны пропсы:
// хук useModalClose() возвращает close окна, в котором лежит контент.

import { X } from "@boxicons/react/X";
import { usePathname } from "next/navigation";
import {
  createContext,
  type PointerEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type ModalHandle = { open: () => void; close: () => void };
export type ModalPosition = "center" | "right" | "left" | "bottom";

// close текущего окна для контента; вне окна — пустое действие
const ModalCloseContext = createContext<ModalHandle["close"]>(() => {});

/** кнопка контента закрывает окно: const close = useModalClose() */
export function useModalClose() {
  return useContext(ModalCloseContext);
}

type Props = {
  ref?: Ref<ModalHandle>;
  /** id окна — по нему его находят тесты */
  id?: string;
  /** заголовок окна, подписывает <dialog> для скринридера */
  title: string;
  /** строка под заголовком; блок в разметке, поэтому не <p> */
  subtitle?: ReactNode;
  /** позиция на компьютере и планшете */
  position?: ModalPosition;
  /** позиция на телефоне; по умолчанию bottom — лист со смахиванием */
  phone?: ModalPosition;
  /** классы окна: например, своя ширина, радиус или фон (bg-primary) */
  className?: string;
  /** окно внутри родительской рамки — для превью в документации */
  inline?: boolean;
  children: ReactNode;
};

// смахнули вниз дальше — окно закрывается
const SWIPE_CLOSE = 110;
// sm в RenDit SCSS — 620px (как у .sheet). В JS и в классах должно быть одно и то же
const PHONE = "(width < 620px)";
// с этих элементов жест не начинается: у них свои нажатия и выделение
const NO_SWIPE =
  'button, a, input, textarea, select, [contenteditable="true"], [role="button"]';

export function Modal({
  ref,
  id,
  title,
  subtitle,
  position = "center",
  phone = "bottom",
  className = "",
  inline = false,
  children,
}: Props) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // в режиме inline верхнего слоя нет — окно показывается атрибутом open, подложка своя
  const [inlineOpen, setInlineOpen] = useState(false);
  // нажатие началось на затемнении — только тогда click по нему закрывает окно
  // (а не click, который браузер присылает после касания открывшей кнопки)
  const downOnBackdrop = useRef(false);
  // высота окна замеряется один раз при начале жеста: offsetHeight в pointermove — лишний layout
  const drag = useRef<{ y: number; dy: number; height: number } | null>(null);
  // таймер страховки: если transitionend почему-то не придёт — окно всё равно закроется
  const slidOut = useRef<number | null>(null);

  const close = useCallback(() => {
    if (inline) setInlineOpen(false);
    else dialogRef.current?.close();
  }, [inline]);

  const clearSlideOut = useCallback(() => {
    if (slidOut.current !== null) {
      window.clearTimeout(slidOut.current);
      slidOut.current = null;
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open() {
        const dialog = dialogRef.current;
        if (inline) {
          setInlineOpen(true);
          return;
        }
        if (!dialog || dialog.open) return;
        clearSlideOut();
        dialog.style.removeProperty("transition");
        dialog.style.removeProperty("translate");
        dialog.style.removeProperty("--sheet-drag");
        delete dialog.dataset.dragging;
        dialog.showModal();
      },
      close,
    }),
    [close, inline, clearSlideOut],
  );

  // сменилась страница (переход из окна, «назад») — окно закрыто
  // biome-ignore lint/correctness/useExhaustiveDependencies: закрываем именно при смене адреса
  useEffect(() => {
    close();
  }, [pathname, close]);

  // окно смонтировалось уже открытым (inline) — и при повторном открытии сбрасываем смахивание
  // смахнуть лист вниз: только телефон, только когда окно там внизу
  const swipeable = phone === "bottom" && !inline;

  // вернуться на место после отмены жеста (браузер отменил, звонок, свернули приложение)
  const cancelDrag = () => {
    const dialog = dialogRef.current;
    drag.current = null;
    if (!dialog) return;
    dialog.style.removeProperty("transition");
    dialog.style.translate = "";
    delete dialog.dataset.dragging;
    dialog.style.removeProperty("--sheet-drag");
  };

  // смахнули дальше порога: окно само доезжает вниз от места отпускания, и только потом close()
  const slideOut = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const finish = () => {
      clearSlideOut();
      dialog.removeEventListener("transitionend", onEnd);
      dialog.style.removeProperty("transition");
      dialog.style.removeProperty("translate");
      dialog.style.removeProperty("--sheet-drag");
      delete dialog.dataset.dragging;
      close();
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName === "translate") finish();
    };
    dialog.addEventListener("transitionend", onEnd);
    slidOut.current = window.setTimeout(finish, 400);
    dialog.style.transition = "translate 0.3s ease-in";
    dialog.style.translate = "0 100%";
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    const dialog = dialogRef.current;
    if (!swipeable || !matchMedia(PHONE).matches || e.button !== 0) return;
    if (!dialog) return;
    if ((e.target as HTMLElement).closest(NO_SWIPE)) return;
    clearSlideOut();
    drag.current = {
      y: e.clientY,
      dy: 0,
      height: dialog.offsetHeight || 1,
    };
    // пока тянем — окно идёт за пальцем без задержки; ставим один раз, а не в каждом pointermove
    dialog.style.transition = "none";
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    const dialog = dialogRef.current;
    if (!d || !dialog) return;
    d.dy = Math.max(0, e.clientY - d.y);
    dialog.style.translate = `0 ${d.dy}px`;
    // насколько окно смахнули (0…1) — по ней тает размытие и затемнение страницы (.modal::backdrop)
    dialog.dataset.dragging = "";
    dialog.style.setProperty(
      "--sheet-drag",
      Math.min(1, d.dy / d.height).toFixed(3),
    );
  };
  // отпустили: дальше порога — доезжаем вниз и закрываемся, ближе — пружина возвращает на место
  const onPointerUp = () => {
    const d = drag.current;
    const dialog = dialogRef.current;
    drag.current = null;
    if (!d || !dialog) return;
    delete dialog.dataset.dragging;
    if (d.dy > SWIPE_CLOSE) {
      slideOut();
      return;
    }
    // transition снимается — возврат ведёт пружина из .modal, как у .sheet
    dialog.style.removeProperty("transition");
    dialog.style.translate = "";
    dialog.style.removeProperty("--sheet-drag");
  };

  return (
    <>
      {/* подложка inline-окна: в настоящем окне её рисует ::backdrop, в превью — этот слой;
          клик по нему (мимо окна) закрывает. Пока окно закрыто — слой прозрачный и не ловит мышь */}
      {inline && (
        <div
          aria-hidden="true"
          data-modal-backdrop
          data-open={inlineOpen || undefined}
          onClick={close}
          className="absolute inset-0 bg-black/28 backdrop-blur-8 opacity-0 pointer-events-none transition-opacity duration-300 data-open:opacity-100 data-open:pointer-events-auto"
        />
      )}
      {/* клик мимо окна (по затемнению) приходит самому <dialog> — закрываем; с клавиатуры закрывает Esc */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Esc у модального <dialog> работает сам */}
      <dialog
        ref={dialogRef}
        id={id}
        aria-labelledby={titleId}
        data-pos={position}
        data-phone={phone}
        data-inline={inline || undefined}
        open={inline ? inlineOpen || undefined : undefined}
        className={`modal ${className}`}
        onPointerDown={(e) => {
          downOnBackdrop.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          const onBackdrop =
            e.target === e.currentTarget && downOnBackdrop.current;
          downOnBackdrop.current = false;
          if (onBackdrop) close();
        }}
      >
        <div className="flex flex-col h-full max-h-[inherit]">
          <header
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={cancelDrag}
            className="relative shrink-0 flex items-center gap-12 px-20 pt-18 pb-14 touch-none sm:touch-auto"
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
                <div className="truncate font-13 text-foreground-muted">
                  {subtitle}
                </div>
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
          {/* содержимое прокручивается внутри окна; края окна не выходят за экран */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-20 pt-2 pb-20">
            <ModalCloseContext.Provider value={close}>
              {children}
            </ModalCloseContext.Provider>
          </div>
        </div>
      </dialog>
    </>
  );
}
