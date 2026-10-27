"use client";

// Нижнее меню «Жидкое стекло» (перенесено из ozon: navbar1, вариант 5 V5Lens) и справа — быстрое меню (quick-menu.tsx).
// Всегда на экране. При загрузке и перезагрузке страницы выезжает из-под края экрана пружиной с лёгким перелётом,
// вырастая из 92 %, быстрое меню догоняет его чуть позже (как в ozon, но мягче) — .enter в navbar.module.scss.
// Только transform: стекло размывает фон с первого кадра. Меню живёт в layout — переходы между страницами его
// не трогают и появление не повторяют (смена страниц — .route-enter, без снимков View Transitions).
//
// Стекло без SVG-фильтров — работает и на телефонах, в т. ч. iPhone: преломление собрано из обычных трансформаций.
//   • линза — слайдер; внутри неё копия ряда иконок цветом secondary, сдвинутая ровно под настоящий ряд:
//     линза растёт и тянется — копия увеличивается вместе с ней, и иконки под линзой выглядят увеличенными стеклом;
//   • настоящий ряд под линзой вырезан маской, поэтому иконка не двоится;
//   • у линзы цветная кромка (красноватая слева, голубоватая справа — дисперсия) и блик, по панели за линзой бежит отсвет.
// Жесты: нажатие — линза переезжает под палец и поднимается; держите — растёт; тяните — тянется «каплей»
// с притяжением к пунктам; отпустили — пружинисто садится. На Android — короткая вибрация на каждом пункте.
// Иконки Boxicons: в ряду контурные, в линзе — залитые (как выбранная вкладка в iOS и Android). Нажатие на уже
// выбранный пункт — тоже как там: со страницы раздела — в его начало, в начале — наверх.
// «Меню» открывает окно быстрого доступа (QuickNav) — его кнопка есть и в шапке, а здесь оно под большим пальцем.
// Стили — классы RenDit Code; в navbar.module.scss только линза.

import { BookOpen } from "@boxicons/react/BookOpen";
import { Home } from "@boxicons/react/Home";
import { Menu } from "@boxicons/react/Menu";
import { Newspaper } from "@boxicons/react/Newspaper";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type CSSProperties, type MouseEvent, useRef, useState } from "react";
import { openQuickNav } from "@/components/QuickNav/open";
import styles from "./navbar.module.scss";
import { QuickMenu } from "./quick-menu";
import { activeIndex, ROUTES } from "./routes";
import { useTabDrag } from "./use-tab-drag";

const ICON_SIZE = 24;
const ICONS = [Home, BookOpen, Newspaper, Menu];
const ITEMS = ROUTES.map((route, i) => ({ ...route, icon: ICONS[i] }));

// пункт: и настоящий, и его копия в линзе — одного размера, иначе копия не ляжет ровно под ряд.
// Экран уже 380px — только иконки, пункт 50×50, как кнопка быстрого меню
const ITEM =
  "flex flex-none flex-col items-center justify-center gap-3 w-(--nb-w) h-54 br-full font-11 leading-1.2 [&>span]:max-w-[calc(100%-8px)] [&>span]:truncate max-[380px]:h-50 max-[380px]:[&>span]:hidden";
// цвета мягкие: пункты — 60 % цвета текста, выбранный — secondary чуть приглушённый (85 %)
const LINK = `${ITEM} font-w-500 text-foreground/60 transition-colors hover:text-foreground/85 focus-visible:outline-offset-[-3px]`;

export default function NavBarComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const barRef = useRef<HTMLElement>(null);

  // выбранный пункт меняется сразу, ещё до перехода — линза не ждёт загрузки страницы
  const [active, setActive] = useState(() => activeIndex(pathname));
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setActive(activeIndex(pathname));
  }

  // false — у пункта нет страницы, линза вернётся на выбранный. Повторный выбор того же пункта
  // (после отпускания пальца браузер присылает ещё и click) ничего не делает
  const select = (i: number) => {
    const { href } = ITEMS[i];
    if (!href) return false;
    if (i === active) return true;
    setActive(i);
    router.push(href);
    return true;
  };

  // нажали на выбранный пункт — как таб-бар iOS и Android: с другой страницы раздела (Компоненты, Обновления)
  // — в его начало, уже в начале — плавно наверх страницы
  const reselect = (i: number) => {
    const { href } = ITEMS[i];
    if (!href) return;
    if (pathname !== href) {
      router.push(href);
      return;
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const { shown, bind, onItemClick } = useTabDrag(barRef, {
    count: ITEMS.length,
    active,
    onSelect: select,
    onReselect: reselect,
  });

  const onLinkClick = (e: MouseEvent, i: number) => {
    // Ctrl/Cmd/Shift + клик — как у обычной ссылки (новая вкладка, окно)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onItemClick(i);
  };

  return (
    <>
      {/* место в конце страницы: иначе меню закрывало бы последний блок */}
      <div className="h-[calc(100px+env(safe-area-inset-bottom))]" />
      <div
        className={`${styles.enter} fixed left-1/2 bottom-[calc(18px+env(safe-area-inset-bottom))] z-30 flex items-end gap-8 -translate-x-1/2`}
      >
        <nav
          ref={barRef}
          aria-label="Основное меню"
          {...bind}
          style={{ "--nb-i": shown } as CSSProperties}
          className={`${styles.bar} liquid-glass relative [--nb-w:68px] max-[380px]:[--nb-w:50px] [--nb-pad:5px] p-(--nb-pad) br-full touch-pan-y select-none`}
        >
          <div className={`${styles.track} flex`}>
            {ITEMS.map((item, i) => {
              const { label, href, icon: Icon } = item;
              return href ? (
                <Link
                  key={label}
                  href={href}
                  data-nav-item
                  // ссылку браузер тащит как файл (drag-and-drop) и отменяет жест линзы
                  draggable={false}
                  onClick={(e) => onLinkClick(e, i)}
                  aria-current={i === active ? "page" : undefined}
                  className={LINK}
                >
                  <Icon
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </Link>
              ) : (
                <button
                  key={label}
                  type="button"
                  data-nav-item
                  aria-haspopup={"panel" in item ? "dialog" : undefined}
                  // «Меню» открывает окно по click, а не при отпускании пальца: иначе click, который браузер
                  // присылает следом, пришёлся бы уже по открытому окну
                  onClick={() => {
                    if (onItemClick(i) && "panel" in item) openQuickNav();
                  }}
                  className={LINK}
                >
                  <Icon
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* линза: копия ряда под увеличением, для скринридеров её нет */}
          <div
            className={`${styles.lens} absolute z-1 overflow-hidden br-full pointer-events-none`}
            aria-hidden="true"
          >
            <div className={`${styles.copy} absolute top-0 left-0 flex h-full`}>
              {ITEMS.map(({ label, icon: Icon }, i) => (
                <span
                  key={label}
                  data-on={i === shown || undefined}
                  className={`${ITEM} font-w-600 text-secondary/85`}
                >
                  <Icon pack="filled" width={ICON_SIZE} height={ICON_SIZE} />
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        </nav>
        <QuickMenu />
      </div>
    </>
  );
}
