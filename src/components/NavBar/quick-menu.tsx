"use client";

// Быстрое меню справа от нижнего меню: стеклянная кнопка 50×50 со стрелкой, по центру панели по высоте.
// Нажали — таблетка пружинисто вытягивается вверх (строки сетки 0fr → 1fr: высота без замеров в JS),
// пункты проявляются по очереди снизу вверх, стрелка поворачивается вниз; закрывается быстрее, без задержек.
// Пункты: язык — пока заглушка; размер текста (под иконкой — текущий размер, нажатие открывает слева
// панель «Размер шрифта на сайте, px» с цифрами 13…18 — каждая своим настоящим размером); тема (ThemeToggle); сколько страницы прочитано, 0…100 % (считается, только пока меню открыто).
// Закрывается стрелкой, Esc и нажатием мимо меню.

import { ChevronUp } from "@boxicons/react/ChevronUp";
import { FontFamily } from "@boxicons/react/FontFamily";
import { Globe } from "@boxicons/react/Globe";
import {
  type CSSProperties,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DEFAULT_TEXT_SIZE,
  parseTextSize,
  TEXT_SIZE_KEY,
  TEXT_SIZES,
  textScale,
} from "@/config/text-size";
import styles from "./navbar.module.scss";
import { readPercent } from "./read-progress";

const ICON_SIZE = 20;
const BUTTON =
  "grid place-items-center br-full text-foreground/70 hover:text-foreground active:bg-foreground/10";
// появление пункта: снизу вверх по очереди (--i — номер от стрелки), исчезновение — сразу и быстро
const REVEAL =
  "opacity-0 translate-y-8 scale-90 transition-[opacity,translate,scale,color,background-color] duration-150 ease-in [[data-open]_&]:opacity-100 [[data-open]_&]:translate-y-0 [[data-open]_&]:scale-100 [[data-open]_&]:duration-500 [[data-open]_&]:ease-spring-bouncy [[data-open]_&]:[transition-delay:calc(var(--i)*40ms+60ms)] motion-reduce:transition-none";
const LINE = "w-26 border-foreground/10";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

// размер текста на всём сайте: --text-scale на <html> и запоминание в localStorage
function applyTextSize(size: number) {
  const root = document.documentElement.style;
  if (size === DEFAULT_TEXT_SIZE) root.removeProperty("--text-scale");
  else root.setProperty("--text-scale", textScale(size));
  try {
    localStorage.setItem(TEXT_SIZE_KEY, String(size));
  } catch {}
}

export function QuickMenu() {
  const [open, setOpen] = useState(false);
  const [sizesOpen, setSizesOpen] = useState(false);
  const [size, setSize] = useState(DEFAULT_TEXT_SIZE);
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLButtonElement>(null);
  const rowRef = useRef<HTMLFieldSetElement>(null);
  const sizesRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);
  const listId = useId();

  // сохранённый размер (сам масштаб уже поставил скрипт в layout до отрисовки)
  useEffect(() => {
    try {
      setSize(parseTextSize(localStorage.getItem(TEXT_SIZE_KEY)));
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;

    // процент пишется прямо в текст, мимо React: прокрутка не вызывает рендеров
    let frame = 0;
    const paint = () => {
      frame = 0;
      const el = document.documentElement;
      if (readRef.current)
        readRef.current.textContent = `${readPercent(window.scrollY, el.scrollHeight - el.clientHeight)}%`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const close = () => {
      setOpen(false);
      setSizesOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (root && !root.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
    };
  }, [open]);

  // ряд цифр — на высоте кнопки шрифта, подпись над ним. Меряем от низа таблетки: содержимое прижато к стрелке,
  // поэтому расстояние не меняется, пока таблетка вытягивается; новый размер текста — меряем заново
  // biome-ignore lint/correctness/useExhaustiveDependencies: size меняет высоту пунктов — нужен новый замер
  useLayoutEffect(() => {
    const root = rootRef.current;
    const pill = pillRef.current;
    const btn = fontRef.current;
    const row = rowRef.current;
    const sizes = sizesRef.current;
    if (!sizesOpen || !root || !pill || !btn || !row || !sizes) return;
    // от низа панели до середины ряда цифр
    const rowCenter =
      row.offsetHeight - sizes.offsetTop - sizes.offsetHeight / 2;
    const bottom =
      pill.offsetHeight - btn.offsetTop - btn.offsetHeight / 2 - rowCenter;
    root.style.setProperty("--fs-bottom", `${bottom}px`);
  }, [sizesOpen, size]);

  const pick = (next: number) => {
    setSize(next);
    applyTextSize(next);
  };

  // Строка размеров — рядом с таблеткой, а не внутри неё: у таблетки своё стекло (backdrop-filter), и внутри
  // такого элемента размытие видит только саму таблетку, а не страницу — строка была бы прозрачной
  return (
    <div
      ref={rootRef}
      data-open={open || undefined}
      data-sizes={(open && sizesOpen) || undefined}
      // при загрузке выезжает следом за нижним меню (navbar.module.scss)
      className={`${styles.enterLate} relative mb-7 max-[380px]:mb-5`}
    >
      <div
        ref={pillRef}
        className="liquid-glass relative grid grid-rows-[0fr_50px] w-50 br-full transition-[grid-template-rows] duration-300 ease-in [[data-open]>&]:grid-rows-[1fr_50px] [[data-open]>&]:duration-500 [[data-open]>&]:ease-spring motion-reduce:transition-none"
      >
        <div
          id={listId}
          inert={!open}
          className="min-h-0 overflow-hidden flex flex-col items-center justify-end gap-4"
        >
          <button
            type="button"
            aria-label="Язык"
            style={at(5)}
            className={`${BUTTON} ${REVEAL} size-40 mt-5`}
          >
            <Globe width={ICON_SIZE} height={ICON_SIZE} aria-hidden="true" />
          </button>
          <button
            ref={fontRef}
            type="button"
            aria-label={`Размер текста: ${size}`}
            aria-expanded={sizesOpen}
            onClick={() => setSizesOpen((v) => !v)}
            style={at(4)}
            className={`${BUTTON} ${REVEAL} w-40 h-48 content-center gap-2 aria-expanded:text-secondary`}
          >
            <FontFamily
              width={ICON_SIZE}
              height={ICON_SIZE}
              aria-hidden="true"
            />
            <span className="font-10 font-w-600 leading-1 tabular-nums">
              {size}
            </span>
          </button>
          <hr style={at(3)} className={`${LINE} ${REVEAL}`} />
          <span style={at(2)} className={REVEAL}>
            <ThemeToggle />
          </span>
          <hr style={at(1)} className={`${LINE} ${REVEAL}`} />
          <span
            ref={readRef}
            title="Прочитано"
            style={at(0)}
            className={`${REVEAL} py-4 font-11 font-w-600 tabular-nums text-foreground/60`}
          >
            0%
          </span>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={open ? "Свернуть меню" : "Ещё"}
          onClick={() => {
            setOpen((v) => !v);
            setSizesOpen(false);
          }}
          className="size-50 grid place-items-center br-full text-foreground/70 transition-colors hover:text-foreground aria-expanded:*:rotate-180"
        >
          <ChevronUp
            width={22}
            height={22}
            aria-hidden="true"
            className="transition-[rotate] duration-500 ease-spring-bouncy"
          />
        </button>
      </div>

      {/* размеры текста — слева от меню, ряд цифр на высоте кнопки шрифта; выезжают справа налево.
          Фон плотнее, чем у таблетки (70 %), и размытие — цифры читаются поверх любого текста.
          Подпись — <legend> с float: так она обычная строка внутри панели, а не врезка в верхнюю рамку fieldset */}
      <fieldset
        ref={rowRef}
        inert={!(open && sizesOpen)}
        className="m-0 min-w-0 border-0 liquid-glass bg-background/70 backdrop-blur-20 absolute right-[calc(100%+8px)] bottom-(--fs-bottom) p-4 br-22 invisible opacity-0 translate-x-12 [clip-path:inset(0_0_0_100%_round_22px)] transition-[clip-path,opacity,translate,visibility] duration-200 ease-in [[data-sizes]_&]:visible [[data-sizes]_&]:opacity-100 [[data-sizes]_&]:translate-x-0 [[data-sizes]_&]:[clip-path:inset(0_round_22px)] [[data-sizes]_&]:duration-500 [[data-sizes]_&]:ease-spring motion-reduce:transition-none"
      >
        <legend className="[float:left] w-full px-10 pt-6 pb-7 font-11 font-w-500 whitespace-nowrap text-foreground/60">
          Размер шрифта на сайте, px
        </legend>
        {/* цифры — настоящим размером в px, без множителя размера текста: видно, каким будет шрифт */}
        <div ref={sizesRef} className="[clear:both] flex items-center gap-2">
          {TEXT_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={s === size}
              aria-label={`${s} px`}
              onClick={() => pick(s)}
              style={{ fontSize: s }}
              className="size-36 br-full font-w-500 leading-1 tabular-nums text-foreground/70 transition-colors hover:text-foreground aria-pressed:bg-secondary/15 aria-pressed:text-secondary"
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
