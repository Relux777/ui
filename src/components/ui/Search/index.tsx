"use client";

// Поиск в шапке. Лупа (или «/», Ctrl+K / ⌘K, как на ozon и boxicons) раскрывает поле: таблетка с кнопками
// расширяется, следом в поле проявляются подсказка и крестик «закрыть». Пока поиск открыт, на <html> стоит
// data-search: шапка сворачивается так же, как после прокрутки (название, версия и тема уходят),
// на телефоне уходит и «Начать» — полю нужно место.
// Подсказки выпадают панелью под полем, пункты проявляются по очереди из лёгкого размытия — как меню
// Integrations на boxicons.com. ↑/↓ — выбор, Enter — переход, крестик, Esc или касание мимо — закрыть.
// Атрибут и фокус ставятся прямо в обработчике: на iOS клавиатура открывается, только если focus() вызван
// внутри касания. Панель стеклом не сделать: таблетка вокруг сама с backdrop-filter, вложенное размытие
// видело бы только её — поэтому фон сплошной.

import { BookOpen } from "@boxicons/react/BookOpen";
import { Code } from "@boxicons/react/Code";
import { Search } from "@boxicons/react/Search";
import { X } from "@boxicons/react/X";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { searchItems } from "./items";

const ICON_SIZE = 20;
const ICONS = { class: Code, doc: BookOpen };

export function SearchComponent() {
  const router = useRouter();
  const listId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // запрос, по которому построена панель: при стирании поля он не сбрасывается, и панель гаснет
  // со своими пунктами, а не с «Ничего не нашлось по «»»
  const [shownQuery, setShownQuery] = useState("");
  const [active, setActive] = useState(0);

  const show = open && query.trim() !== "";
  const results = searchItems(shownQuery);

  // атрибут — сразу, до focus(): пока его нет, поле скрыто (invisible) и фокус не примет.
  // Прошлый запрос остаётся и выделяется: можно продолжить или сразу печатать новый
  const openSearch = () => {
    document.documentElement.setAttribute("data-search", "");
    inputRef.current?.focus();
    inputRef.current?.select();
    setOpen(true);
  };

  // «/» (если не печатают в другом поле) и Ctrl+K / ⌘K открывают поиск с любого места страницы
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest(
        "input, textarea, select, [contenteditable]",
      );
      const slash = e.key === "/" && !typing && !e.ctrlKey && !e.metaKey;
      const cmdK = e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey);
      if (!slash && !cmdK) return;
      e.preventDefault();
      openSearch();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // открыт — Esc и касание мимо закрывают; закрыли или ушли со страницы — атрибута на <html> нет
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-search", open);
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!formRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault(); // поле type="search" по Esc само стирает запрос — пусть остаётся до следующего раза
      // фокус был в поле — вернуть его на лупу, иначе он пропадёт вместе со скрытым полем
      if (formRef.current?.contains(document.activeElement))
        buttonRef.current?.focus();
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      root.removeAttribute("data-search");
    };
  }, [open]);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const item = show && results[active];
        if (!item) return;
        setOpen(false);
        router.push(item.href);
      }}
      className="relative flex items-center h-36 w-36 br-full transition-[width,background-color] duration-500 ease-spring [[data-search]_&]:w-[min(260px,calc(100vw-110px))] [[data-search]_&]:bg-foreground/5 motion-reduce:transition-none"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label="Поиск"
        aria-expanded={open}
        onClick={openSearch}
        className="size-36 shrink-0 br-full grid place-items-center text-foreground transition opacity-80 hover:opacity-100 active:opacity-100 hover:shadow-7 active:shadow-7 active:bg-surface-muted/50  active:scale-92"
      >
        <Search width={ICON_SIZE} height={ICON_SIZE} />
      </button>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          if (value.trim()) setShownQuery(value);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (!show || !results.length) return;
          if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
          e.preventDefault();
          const step = e.key === "ArrowDown" ? 1 : -1;
          setActive((i) => (i + step + results.length) % results.length);
        }}
        tabIndex={open ? 0 : -1}
        placeholder="width, padding…"
        aria-label="Поиск по RenDit UI"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={show}
        aria-controls={listId}
        aria-activedescendant={
          show && results.length ? `${listId}-${active}` : undefined
        }
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        // на телефоне шрифт поля не меньше 16px — иначе iOS приближает страницу при фокусе
        className="flex-1 min-w-0 h-full bg-transparent outline-none font-14 touch:text-[16px] text-foreground placeholder:text-foreground-subtle caret-blue-500 invisible opacity-0 transition-opacity duration-300 [[data-search]_&]:visible [[data-search]_&]:opacity-100 [[data-search]_&]:delay-100 [&::-webkit-search-cancel-button]:hidden motion-reduce:transition-none"
      />
      {/* крестик: закрыть и стереть запрос. Полупрозрачный круг со стеклянной кромкой (shadow-9 — стекло для
          маленьких элементов); выскакивает пружинкой чуть позже, чем поле начало расширяться (задержка — у scale и opacity) */}
      <button
        type="button"
        aria-label="Закрыть поиск"
        tabIndex={open ? 0 : -1}
        onClick={() => {
          setOpen(false);
          setQuery("");
          buttonRef.current?.focus();
        }}
        className="shrink-0 h-28 w-0 br-full grid place-items-center overflow-hidden bg-surface/40 shadow-9 text-foreground/70 opacity-0 scale-0 transition-[width,margin,scale,opacity,color] duration-500 ease-spring-bouncy hover:text-foreground [[data-search]_&]:w-28 [[data-search]_&]:mr-4 [[data-search]_&]:opacity-100 [[data-search]_&]:scale-100 [[data-search]_&]:[transition-delay:0ms,0ms,120ms,120ms,0ms] [[data-search]_&]:active:scale-92 motion-reduce:transition-none"
      >
        <X width={16} height={16} />
      </button>

      {/* подсказки: панель выезжает сверху и проявляется, пункты — по очереди (--i — номер пункта).
          Пункт, который появился уже при открытой панели, стартует из того же «размытия» — @starting-style */}
      <div
        data-show={show || undefined}
        className="group absolute top-[calc(100%+12px)] right-0 w-[min(360px,calc(100vw-20px))] p-6 br-20 bg-surface border border-border shadow-6 origin-top invisible opacity-0 -translate-y-6 scale-96 transition-[opacity,translate,scale,visibility] duration-300 ease-spring data-show:visible data-show:opacity-100 data-show:translate-y-0 data-show:scale-100 motion-reduce:transition-none"
      >
        {results.length ? (
          <div id={listId} role="listbox" aria-label="Подсказки">
            {results.map(({ title, text, href, kind }, i) => {
              const Icon = ICONS[kind];
              return (
                <div
                  key={title}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  tabIndex={-1}
                  onPointerMove={() => setActive(i)}
                  style={{ "--i": i } as CSSProperties}
                  className="opacity-0 translate-y-8 blur-4 transition-[opacity,translate,filter] duration-400 ease-spring group-[[data-show]]:opacity-100 group-[[data-show]]:translate-y-0 group-[[data-show]]:blur-0 group-[[data-show]]:[transition-delay:calc(var(--i)*40ms)] group-[[data-show]]:[@starting-style]:opacity-0 group-[[data-show]]:[@starting-style]:translate-y-8 group-[[data-show]]:[@starting-style]:blur-4 motion-reduce:transition-none"
                >
                  <Link
                    href={href}
                    tabIndex={-1}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-12 p-8 br-14 transition-colors [[aria-selected=true]>&]:bg-surface-muted"
                  >
                    <span className="size-36 shrink-0 br-10 grid place-items-center border border-border bg-surface text-foreground-muted">
                      <Icon width={ICON_SIZE} height={ICON_SIZE} />
                    </span>
                    <span className="grid min-w-0">
                      <span className="font-14 font-w-500 text-foreground truncate">
                        {title}
                      </span>
                      <span className="font-12 text-foreground-muted truncate">
                        {text}
                      </span>
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <p id={listId} className="p-12 font-14 text-foreground-muted">
            Ничего не нашлось по «{shownQuery.trim()}»
          </p>
        )}
      </div>
    </form>
  );
}
