"use client";

// Варианты шапки. Каждый рисуется внутри <Stage> и читает его прокрутку из CSS (--p, --progress,
// data-scrolled, data-dir — см. stage.tsx). Стили — в ../header.module.scss, разделы подписаны так же.

import {
  type CSSProperties,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import RenDitLogo from "@/assets/svg/Rendit_UI_logo.svg";
import s from "../header.module.scss";
import { Actions, Brand, LINKS, Menu } from "./parts";
import { useIndicator } from "./use-indicator";

// ── 1. Жидкое стекло ────────────────────────────────────────────────────────

// Карта смещения для feDisplacementMap: красный — сдвиг по X, синий — по Y, серый (0,5) — без сдвига.
// Середина серая, к краям цвет нарастает — фон гнётся только у кромки, как в толстом стекле
function displacementMap(w: number, h: number) {
  const r = h / 2;
  const e = Math.round(Math.min(w, h) * 0.2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="x" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#000"/><stop offset="100%" stop-color="#f00"/></linearGradient><linearGradient id="y" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#000"/><stop offset="100%" stop-color="#00f"/></linearGradient></defs><rect width="${w}" height="${h}" fill="#000"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#x)"/><rect width="${w}" height="${h}" rx="${r}" fill="url(#y)" style="mix-blend-mode:difference"/><rect x="${e}" y="${e}" width="${w - e * 2}" height="${h - e * 2}" rx="${r - e}" fill="#808080" style="filter:blur(${e / 2}px)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// url() в backdrop-filter понимает только Chromium (Chrome, Edge, Opera, Яндекс)
const isChromium = () =>
  // biome-ignore lint/suspicious/noExplicitAny: userAgentData есть не во всех типах
  ((navigator as any).userAgentData?.brands ?? []).some(
    (b: { brand: string }) => b.brand === "Chromium",
  );

export function LiquidGlass() {
  const barRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const { active, setActive, bind } = useIndicator(navRef);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || !isChromium()) return;
    bar.dataset.refract = "";
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize[0];
      setSize({ w: Math.round(box.inlineSize), h: Math.round(box.blockSize) });
    });
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={s.dock}>
      {size && (
        <svg className={s.defs} aria-hidden="true">
          <filter
            id="rd-liquid-refract"
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={displacementMap(size.w, size.h)}
              x="0"
              y="0"
              width={size.w}
              height={size.h}
              preserveAspectRatio="none"
              result="map"
            />
            {/* три канала сдвигаются чуть по-разному — радужная кромка, как дисперсия в стекле */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="-40"
              xChannelSelector="R"
              yChannelSelector="B"
              result="dr"
            />
            <feColorMatrix
              in="dr"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="r"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="-36"
              xChannelSelector="R"
              yChannelSelector="B"
              result="dg"
            />
            <feColorMatrix
              in="dg"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="g"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="-32"
              xChannelSelector="R"
              yChannelSelector="B"
              result="db"
            />
            <feColorMatrix
              in="db"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="b"
            />
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" />
          </filter>
        </svg>
      )}
      <div ref={barRef} className={`${s.bar} ${s.liquid}`}>
        <Brand />
        <Menu ref={navRef} active={active} onSelect={setActive} {...bind}>
          <span className={s.lens} aria-hidden="true" />
        </Menu>
        <Actions />
      </div>
    </div>
  );
}

// ── 2. Капли ────────────────────────────────────────────────────────────────

// Под шапкой — слой из трёх «капель» под SVG-фильтром goo (размытие + резкий порог прозрачности):
// пока капли рядом, они сливаются в одну панель; при прокрутке каждая стягивается к своей группе
// и отрывается с «перемычкой», как вода. Текст лежит отдельно над слоем — фильтр его не размывает
export function Droplets() {
  const rootRef = useRef<HTMLDivElement>(null);
  const groups = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const PAD = 8;
    const measure = () => {
      const R = root.getBoundingClientRect();
      groups.current.forEach((el, i) => {
        const r = el?.getBoundingClientRect();
        const shown = r && r.width > 0;
        root.style.setProperty(
          `--d${i}-x`,
          `${shown ? r.left - R.left - PAD : R.width / 2}px`,
        );
        root.style.setProperty(
          `--d${i}-w`,
          `${shown ? r.width + PAD * 2 : 0}px`,
        );
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={s.dock}>
      <svg className={s.defs} aria-hidden="true">
        <filter id="rd-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
      <div ref={rootRef} className={s.drops}>
        <div className={s.goo} aria-hidden="true">
          <span className={s.blob} />
          <span className={s.blob} />
          <span className={s.blob} />
        </div>
        <div className={s.bar}>
          <span
            ref={(el) => {
              groups.current[0] = el;
            }}
            className={s.dropStart}
          >
            <Brand />
          </span>
          <Menu
            ref={(el) => {
              groups.current[1] = el;
            }}
          />
          <span
            ref={(el) => {
              groups.current[2] = el;
            }}
            className={s.dropEnd}
          >
            <Actions />
          </span>
        </div>
      </div>
    </div>
  );
}

// ── 3. Динамический остров ─────────────────────────────────────────────────

// Чёрная «таблетка» как Dynamic Island: наверху — обычная шапка, при прокрутке сжимается в маленький
// остров по центру. Навели (или нажали на телефоне) — остров пружинисто раскрывается в меню.
// Три слоя содержимого лежат друг на друге и сменяются с размытием
export function Island() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  return (
    <div className={s.dock}>
      <div
        className={s.island}
        data-open={open || undefined}
        onPointerLeave={() => setOpen(false)}
      >
        <div className={`${s.bar} ${s.islandFull}`}>
          <Brand />
          <Menu active={active} onSelect={setActive} />
          <Actions />
        </div>
        <button
          type="button"
          className={s.islandMini}
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Brand />
          <span className={s.islandNow}>{LINKS[active]}</span>
          <span className={s.islandDot} aria-hidden="true" />
        </button>
        <div className={s.islandPanel}>
          {LINKS.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-current={i === active ? "page" : undefined}
              onClick={() => {
                setActive(i);
                setOpen(false);
              }}
              className={s.islandLink}
              style={{ "--i": i } as CSSProperties}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 4. Прячется и возвращается ──────────────────────────────────────────────

export function Headroom() {
  return (
    <div className={s.dock}>
      <div className={`${s.bar} ${s.headroom}`}>
        <Brand />
        <Menu />
        <Actions />
      </div>
    </div>
  );
}

// ── 5. Сжатие, как на сайте ─────────────────────────────────────────────────

export function Shrink() {
  return (
    <div className={s.dock}>
      <div className={`${s.bar} ${s.shrink}`}>
        <Brand />
        <Menu />
        <Actions />
      </div>
    </div>
  );
}

// ── 6. Рябь на воде ─────────────────────────────────────────────────────────

type Drop = { id: number; x: number; y: number };

// Нажатие в любом месте шапки пускает круги по стеклу, а сама панель «желейно» вздрагивает.
// По стеклу всё время медленно плывут блики — как свет на воде
export function Ripple() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const nextId = useRef(0);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const r = bar.getBoundingClientRect();
    const drop = {
      id: ++nextId.current,
      x: e.clientX - r.left,
      y: e.clientY - r.top,
    };
    setDrops((list) => [...list.slice(-4), drop]);
    setTimeout(
      () => setDrops((list) => list.filter((d) => d.id !== drop.id)),
      1600,
    );
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      bar.animate(
        [
          { scale: "1" },
          { scale: "0.99 0.95" },
          { scale: "1.006 1.03" },
          { scale: "1" },
        ],
        {
          duration: 520,
          easing: "ease-out",
        },
      );
  };

  return (
    <div className={s.dock}>
      <div className={`${s.bar} ${s.rippleBar}`} onPointerDown={onPointerDown}>
        <span className={s.ripples} aria-hidden="true">
          {drops.map((d) => (
            <span
              key={d.id}
              className={s.rippleDrop}
              style={{ "--x": `${d.x}px`, "--y": `${d.y}px` } as CSSProperties}
            >
              <i />
              <i />
              <i />
            </span>
          ))}
        </span>
        <Brand />
        <Menu />
        <Actions />
      </div>
    </div>
  );
}

// ── 7. Северное сияние ──────────────────────────────────────────────────────

export function Aurora() {
  return (
    <div className={s.dock}>
      <div className={s.auroraWrap}>
        <span className={s.auroraGlow} aria-hidden="true" />
        <div className={`${s.bar} ${s.aurora}`}>
          <Brand />
          <Menu />
          <Actions />
        </div>
      </div>
    </div>
  );
}

// ── 8. Прожектор ────────────────────────────────────────────────────────────

// Свет идёт за курсором: мягкое пятно по стеклу и подсвеченный кусок кромки рядом с курсором
export function Spotlight() {
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const r = bar.getBoundingClientRect();
    bar.style.setProperty("--mx", `${e.clientX - r.left}px`);
    bar.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className={s.dock}>
      <div className={`${s.bar} ${s.spot}`} onPointerMove={onPointerMove}>
        <Brand />
        <Menu />
        <Actions />
      </div>
    </div>
  );
}

// ── 9. Волна прогресса ──────────────────────────────────────────────────────

export function ProgressWave() {
  return (
    <div className={s.dock}>
      <div className={`${s.bar} ${s.waveBar}`}>
        <span className={s.wave} aria-hidden="true" />
        <Brand />
        <Menu />
        <Actions />
      </div>
    </div>
  );
}

// ── 10. Тянучка ─────────────────────────────────────────────────────────────

// Плашка под пунктом едет «гусеницей»: передний край убегает быстро, задний догоняет медленнее,
// по пути плашка вытягивается и пружинисто собирается обратно
export function Stretchy() {
  const navRef = useRef<HTMLElement>(null);
  const { active, setActive, bind } = useIndicator(navRef);

  return (
    <div className={s.dock}>
      <div className={`${s.bar} ${s.stretchBar}`}>
        <Brand />
        <Menu ref={navRef} active={active} onSelect={setActive} {...bind}>
          <span className={s.stretch} aria-hidden="true" />
        </Menu>
        <Actions />
      </div>
    </div>
  );
}

// ── 11. Капля-меню ──────────────────────────────────────────────────────────

// При прокрутке панель стекает вправо в круглую каплю с кнопкой меню. Нажали — из капли «разливается»
// стеклянный лист со ссылками (clip-path растёт кругом от кнопки), иконка меню превращается в крестик
export function BurgerDrop() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${s.dock} ${s.burgerDock}`}>
      <div className={`${s.bar} ${s.burgerBar}`}>
        <div className={s.burgerContent}>
          <Brand />
          <Menu />
          <Actions />
        </div>
      </div>
      <div className={s.sheet} data-open={open || undefined} inert={!open}>
        {LINKS.map((label, i) => (
          <button
            key={label}
            type="button"
            className={s.sheetLink}
            style={{ "--i": i } as CSSProperties}
            onClick={() => setOpen(false)}
          >
            {label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={s.burgerBtn}
        data-open={open || undefined}
        aria-expanded={open}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={s.burgerIcon} aria-hidden="true">
          <span />
          <span />
        </span>
      </button>
    </div>
  );
}

// ── 12. Прогрессивное размытие ──────────────────────────────────────────────

// Как в iOS: у шапки нет плашки — под ней страница размывается всё сильнее к верхнему краю.
// Шесть слоёв с разным blur, каждый виден только в своей полосе (mask)
export function ProgressiveBlur() {
  return (
    <>
      <div className={s.blurStack} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className={s.dock}>
        <div className={s.bar}>
          <Brand />
          <Menu />
          <Actions />
        </div>
      </div>
    </>
  );
}

// ── 13. Две таблетки ────────────────────────────────────────────────────────

// Наверху шапка прозрачная. При прокрутке логотип остаётся на своём месте в круглой стеклянной таблетке
// с размытием и тенью, надпись и меню уходят, кнопки справа — в своей такой же таблетке
export function Pair() {
  return (
    <div className={s.dock}>
      <div className={s.bar}>
        <span className={s.brand}>
          <span className={s.pairLogo}>
            <RenDitLogo width={24} height={24} aria-hidden="true" />
          </span>
          <span className={s.pairText}>
            RenDit <span className="text-violet-500">UI</span>
          </span>
        </span>
        <Menu className={s.pairMenu} />
        <Actions className={s.pairEnd} />
      </div>
    </div>
  );
}
