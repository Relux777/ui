"use client";

// Меню RenDit UI: кнопка и выпадающий список действий или ссылок.
// Клавиатура как у настоящего menu: стрелки, Home/End, Enter, Esc. Панель в портале,
// поэтому не обрезается карточками, а на телефоне не уезжает под клавиатуру.
// Вид — классами в файле подключения; компонент отвечает за поведение.

import { ChevronDown } from "@boxicons/react/ChevronDown";
import NextLink from "next/link";
import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type MenuItem =
  | {
      id: string;
      type?: "item";
      label: ReactNode;
      icon?: ReactNode;
      href?: string;
      shortcut?: ReactNode;
      disabled?: boolean;
      danger?: boolean;
    }
  | { id: string; type: "separator" };

export type MenuAnimation = "none" | "fade" | "scale" | "slide";
export type MenuPlacement = "auto" | "bottom" | "top";
export type MenuAlign = "start" | "end";

export type MenuProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  items: readonly MenuItem[];
  trigger: ReactNode;
  /** подпись меню и кнопки для скринридера */
  label?: string;
  placement?: MenuPlacement;
  align?: MenuAlign;
  offset?: number;
  animation?: MenuAnimation;
  disabled?: boolean;
  onAction?: (item: Extract<MenuItem, { type?: "item" }>) => void;
  ref?: Ref<HTMLButtonElement>;
  chevron?: boolean;

  labelClassName?: string;
  triggerClassName?: string;
  panelClassName?: string;
  itemClassName?: string;
  itemActiveClassName?: string;
  itemDangerClassName?: string;
  itemDisabledClassName?: string;
  iconClassName?: string;
  shortcutClassName?: string;
  separatorClassName?: string;
  triggerStyle?: CSSProperties;
  panelStyle?: CSSProperties;
  itemStyle?: CSSProperties;
};

const ANIMATION = {
  none: "",
  fade: "transition-opacity duration-150 [@starting-style]:opacity-0 motion-reduce:transition-none",
  scale:
    "transition-[opacity,scale] duration-200 ease-spring [@starting-style]:opacity-0 [@starting-style]:scale-95 motion-reduce:transition-none",
  slide:
    "transition-[opacity,translate] duration-200 ease-spring [@starting-style]:opacity-0 [@starting-style]:-translate-y-6 motion-reduce:transition-none",
} as const;

const TRIGGER_BASE =
  "inline-flex items-center justify-between gap-8 max-w-full text-left br-lg border transition-[border-color,box-shadow] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-50 disabled:cursor-not-allowed";
const TRIGGER_DEFAULT =
  "h-40 px-14 bg-surface shadow-1 font-13 font-w-600 text-foreground";
const PANEL_BASE = "fixed z-50 flex flex-col overflow-hidden";
const PANEL_DEFAULT = "p-4 br-xl border bg-surface shadow-5";
const ITEM_BASE =
  "w-full flex items-center gap-10 px-10 py-8 br-md text-left font-13 cursor-pointer";
const ITEM_DEFAULT = "text-foreground";
const ITEM_ACTIVE = "bg-foreground/6";
const ITEM_DANGER = "text-danger";
const ITEM_DISABLED = "opacity-50 cursor-not-allowed";
const ICON_BASE =
  "shrink-0 grid place-items-center text-foreground-subtle [&>svg]:size-full";
const ICON_DEFAULT = "size-18";
const SHORTCUT_BASE =
  "ml-auto shrink-0 font-11 font-mono text-foreground-subtle";
const SEPARATOR_BASE = "h-px my-3 bg-foreground/15 border-0";

const cx = (...values: (string | false | null | undefined)[]) =>
  values.filter(Boolean).join(" ");

const isItem = (item: MenuItem): item is Extract<MenuItem, { type?: "item" }> =>
  item.type !== "separator";

export function Menu({
  items,
  trigger,
  label = "Меню",
  placement = "auto",
  align = "start",
  offset = 6,
  animation = "none",
  disabled = false,
  onAction,
  ref,
  chevron = true,
  className = "",
  labelClassName,
  triggerClassName,
  panelClassName,
  itemClassName,
  itemActiveClassName,
  itemDangerClassName,
  itemDisabledClassName,
  iconClassName,
  shortcutClassName,
  separatorClassName,
  triggerStyle,
  panelStyle,
  itemStyle,
  ...rest
}: MenuProps) {
  const autoId = useId();
  const triggerId = `${autoId}-trigger`;
  const panelId = `${autoId}-panel`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const enabled = items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => isItem(item) && !item.disabled)
    .map(({ i }) => i);

  const optionId = useCallback(
    (i: number) => `${panelId}-item-${i}`,
    [panelId],
  );

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    const pop = popRef.current;
    if (!trigger || !pop) return;
    const tr = trigger.getBoundingClientRect();
    const vv = window.visualViewport;
    const viewTop = vv?.offsetTop ?? 0;
    const viewLeft = vv?.offsetLeft ?? 0;
    const viewWidth = vv?.width ?? window.innerWidth;
    const viewHeight = vv?.height ?? window.innerHeight;
    const margin = 8;
    pop.style.minWidth = `${Math.min(Math.max(tr.width, 180), viewWidth - margin * 2)}px`;
    const pr = pop.getBoundingClientRect();
    const below = viewTop + viewHeight - tr.bottom - margin;
    const above = tr.top - viewTop - margin;
    const up =
      placement === "top"
        ? true
        : placement === "bottom"
          ? false
          : pr.height > below && above > below;
    const top = up
      ? Math.max(viewTop + margin, tr.top - pr.height - offset)
      : Math.min(viewTop + viewHeight - pr.height - margin, tr.bottom + offset);
    const left = Math.min(
      Math.max(
        viewLeft + margin,
        align === "end" ? tr.right - pr.width : tr.left,
      ),
      viewLeft + viewWidth - pr.width - margin,
    );
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
    pop.style.transformOrigin = `${align === "end" ? "right" : "left"} ${
      up ? "bottom" : "top"
    }`;
    pop.dataset.side = up ? "top" : "bottom";
  }, [align, offset, placement]);

  const openMenu = useCallback(
    (dir: 1 | -1) => {
      if (disabled) return;
      setActive(
        enabled.length
          ? dir === 1
            ? enabled[0]
            : enabled[enabled.length - 1]
          : -1,
      );
      setOpen(true);
    },
    [disabled, enabled],
  );

  const close = useCallback((focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const choose = (item: MenuItem) => {
    if (!isItem(item) || item.disabled) return;
    if (item.href) {
      close(true);
      window.location.assign(item.href);
      return;
    }
    onAction?.(item);
    close(true);
  };

  useLayoutEffect(() => {
    if (!open) return;
    const pop = popRef.current;
    const theme = triggerRef.current
      ?.closest<HTMLElement>("[data-theme]")
      ?.getAttribute("data-theme");
    if (pop && theme) pop.setAttribute("data-theme", theme);
    else pop?.removeAttribute("data-theme");
    place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || popRef.current?.contains(target))
        return;
      close(false);
    };
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        place();
      });
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    window.visualViewport?.addEventListener("resize", onScroll);
    window.visualViewport?.addEventListener("scroll", onScroll);
    const focusFrame = requestAnimationFrame(() =>
      popRef.current?.focus({ preventScroll: true }),
    );
    return () => {
      cancelAnimationFrame(focusFrame);
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      window.visualViewport?.removeEventListener("resize", onScroll);
      window.visualViewport?.removeEventListener("scroll", onScroll);
    };
  }, [open, place, close]);

  useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(optionId(active))?.scrollIntoView({
      block: "nearest",
    });
  }, [active, open, optionId]);

  const onMenuKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
      return;
    }
    if (e.key === "Tab") {
      close(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      const at = enabled.indexOf(active);
      const next =
        at === -1
          ? step === 1
            ? 0
            : enabled.length - 1
          : (at + step + enabled.length) % enabled.length;
      setActive(enabled[next] ?? -1);
      return;
    }
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setActive(
        enabled.length
          ? enabled[e.key === "Home" ? 0 : enabled.length - 1]
          : -1,
      );
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const item = items[active];
      if (item) choose(item);
    }
  };

  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "Escape" && open) {
      e.preventDefault();
      close(true);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open ? close(true) : openMenu(1);
    }
  };

  const triggerClass = cx(
    TRIGGER_BASE,
    triggerClassName ?? TRIGGER_DEFAULT,
    open && "border-secondary",
  );

  return (
    <div
      className={cx("relative inline-flex max-w-full", className)}
      ref={rootRef}
      {...rest}
    >
      <button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        disabled={disabled}
        onClick={() => (open ? close(true) : openMenu(1))}
        onKeyDown={onTriggerKey}
        className={triggerClass}
        style={triggerStyle}
      >
        <span className={cx("min-w-0 truncate", labelClassName)}>
          {trigger}
        </span>
        {chevron && (
          <ChevronDown
            width={16}
            height={16}
            aria-hidden="true"
            className={cx(
              "shrink-0 text-foreground-muted transition-transform motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={popRef}
            id={panelId}
            role="menu"
            aria-label={label}
            tabIndex={-1}
            aria-activedescendant={active >= 0 ? optionId(active) : undefined}
            onKeyDown={onMenuKey}
            data-part="panel"
            className={cx(
              PANEL_BASE,
              panelClassName ?? PANEL_DEFAULT,
              ANIMATION[animation],
            )}
            style={{ left: 0, top: 0, ...panelStyle }}
          >
            {items.map((item, i) => {
              if (!isItem(item)) {
                return (
                  <hr
                    key={item.id}
                    className={cx(separatorClassName ?? SEPARATOR_BASE)}
                  />
                );
              }
              const isActive = i === active;
              const className = cx(
                ITEM_BASE,
                itemClassName ?? ITEM_DEFAULT,
                isActive &&
                  !item.disabled &&
                  (itemActiveClassName ?? ITEM_ACTIVE),
                item.danger && (itemDangerClassName ?? ITEM_DANGER),
                item.disabled && (itemDisabledClassName ?? ITEM_DISABLED),
              );
              const content = (
                <>
                  {item.icon && (
                    <span
                      aria-hidden="true"
                      className={cx(ICON_BASE, iconClassName ?? ICON_DEFAULT)}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="min-w-0 truncate">{item.label}</span>
                  {item.shortcut && (
                    <span className={cx(SHORTCUT_BASE, shortcutClassName)}>
                      {item.shortcut}
                    </span>
                  )}
                </>
              );

              if (item.href && !item.disabled) {
                return (
                  <NextLink
                    key={item.id}
                    href={item.href}
                    id={optionId(i)}
                    role="menuitem"
                    tabIndex={-1}
                    aria-disabled={item.disabled || undefined}
                    onClick={() => close(false)}
                    onPointerMove={() => {
                      if (i !== active) setActive(i);
                    }}
                    className={className}
                    style={itemStyle}
                  >
                    {content}
                  </NextLink>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  id={optionId(i)}
                  role="menuitem"
                  tabIndex={-1}
                  aria-disabled={item.disabled || undefined}
                  disabled={item.disabled}
                  onClick={() => choose(item)}
                  onPointerMove={() => {
                    if (!item.disabled && i !== active) setActive(i);
                  }}
                  className={className}
                  style={itemStyle}
                >
                  {content}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
