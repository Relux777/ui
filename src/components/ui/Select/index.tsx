"use client";

// Выбор RenDit UI: свой список вместо системного. Поиск, иконки, группы и подсказки;
// клавиатура как у настоящего listbox — стрелки, Home/End, Enter, Esc. Список живёт в портале,
// поэтому не обрезается карточками и прокруткой, а на телефоне не уезжает под клавиатуру.
//
// Компонент отвечает только за поведение. Вид задаётся классами в файле подключения:
// triggerClassName, panelClassName, optionClassName и т. д. — без правки этого файла.

import { Check } from "@boxicons/react/Check";
import { ChevronDown } from "@boxicons/react/ChevronDown";
import { CursorClick } from "@boxicons/react/CursorClick";
import { Link as LinkIcon } from "@boxicons/react/Link";
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
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  filterItems,
  flattenItems,
  isGroup,
  nextEnabled,
  type SelectItem,
  type SelectOption,
} from "./options";

export type SelectAnimation = "none" | "fade" | "scale" | "slide";
export type SelectPlacement = "auto" | "bottom" | "top";
export type SelectAlign = "start" | "end";

export type SelectProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  items: readonly SelectItem[];
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  /** поле поиска над списком */
  searchable?: boolean;
  disabled?: boolean;
  /** выбранное значение; без value список держит выбор сам */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: SelectOption | null) => void;
  /** пункт-ссылка или пункт-кнопка: закрыть список и выполнить действие */
  onAction?: (option: SelectOption) => void;
  /** для формы: значение уйдёт вместе с формой */
  name?: string;
  id?: string;
  ref?: Ref<HTMLButtonElement>;

  // Вид: всё приходит из page.tsx. Если класс не передан — работает аккуратный дефолт.
  labelClassName?: string;
  /** поле целиком: высота, отступы, радиус, рамка, тень, фон, текст */
  triggerClassName?: string;
  /** рамка, когда список открыт */
  triggerOpenClassName?: string;
  /** рамка при ошибке */
  triggerInvalidClassName?: string;
  /** блок списка: радиус, рамка, тень, фон, текст */
  panelClassName?: string;
  /** прокручиваемая область списка: отступы, высота */
  listClassName?: string;
  /** обычный пункт: отступы, радиус, ширина, шрифт */
  optionClassName?: string;
  /** выбранный пункт */
  optionSelectedClassName?: string;
  /** пункт под курсором или стрелками */
  optionActiveClassName?: string;
  optionDisabledClassName?: string;
  badgeClassName?: string;
  searchClassName?: string;
  hintClassName?: string;
  errorClassName?: string;

  /** точные размеры числом — удобно из конструктора и анимаций */
  triggerStyle?: CSSProperties;
  panelStyle?: CSSProperties;
  listStyle?: CSSProperties;
  optionStyle?: CSSProperties;

  /** зазор между пунктами списка */
  optionGap?: number;
  animation?: SelectAnimation;
  /** auto — над полем или под ним, как больше места */
  placement?: SelectPlacement;
  align?: SelectAlign;
  /** зазор между полем и списком */
  offset?: number;
};

// Появление списка: @starting-style — с чего начинается переход при монтировании.
const ANIMATION = {
  none: "",
  fade: "transition-opacity duration-150 [@starting-style]:opacity-0 motion-reduce:transition-none",
  scale:
    "transition-[opacity,scale] duration-200 ease-spring [@starting-style]:opacity-0 [@starting-style]:scale-95 motion-reduce:transition-none",
  slide:
    "transition-[opacity,translate] duration-200 ease-spring [@starting-style]:opacity-0 [@starting-style]:-translate-y-6 motion-reduce:transition-none",
} as const;

const TRIGGER_BASE =
  "relative flex items-center gap-8 max-w-full text-left transition-[border-color,box-shadow] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-50 disabled:cursor-not-allowed";
const TRIGGER_DEFAULT =
  "w-full h-44 px-12 br-lg border bg-surface shadow-1 font-16 text-foreground";
const PANEL_BASE = "fixed z-50 flex flex-col overflow-hidden";
const PANEL_DEFAULT = "br-xl border bg-surface shadow-5";
const OPTION_BASE = "text-left flex items-center gap-10";
const OPTION_DEFAULT = "w-full px-10 py-9 br-md font-14";
const OPTION_SELECTED_DEFAULT = "bg-secondary/10 text-foreground font-w-600";
const OPTION_ACTIVE_DEFAULT = "bg-foreground/6";
const OPTION_DISABLED_DEFAULT = "opacity-55 cursor-not-allowed";
const BADGE_DEFAULT = "bg-secondary/15 text-secondary";
const SEARCH_DEFAULT =
  "w-full h-36 px-10 br-md bg-surface-muted font-16 placeholder:text-foreground-subtle outline-none";

const cx = (...values: (string | false | null | undefined)[]) =>
  values.filter(Boolean).join(" ");

export function Select({
  items,
  label,
  hint,
  error,
  placeholder = "Выберите",
  searchable = false,
  disabled = false,
  value,
  defaultValue = "",
  onChange,
  onAction,
  name,
  id,
  ref,
  className = "",
  labelClassName,
  triggerClassName,
  triggerOpenClassName = "border-secondary",
  triggerInvalidClassName = "border-danger",
  panelClassName,
  listClassName,
  optionClassName,
  optionSelectedClassName,
  optionActiveClassName,
  optionDisabledClassName,
  badgeClassName,
  searchClassName,
  hintClassName,
  errorClassName,
  triggerStyle,
  panelStyle,
  listStyle,
  optionStyle,
  optionGap = 4,
  animation = "none",
  placement = "auto",
  align = "start",
  offset = 6,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const triggerId = id ?? autoId;
  const labelId = `${triggerId}-label`;
  const listId = `${triggerId}-list`;
  const hintId = `${triggerId}-hint`;
  const errorId = `${triggerId}-error`;

  const [inner, setInner] = useState(defaultValue);
  const selectedValue = value ?? inner;
  const flat = useMemo(() => flattenItems(items), [items]);
  const selected = flat.find((o) => o.value === selectedValue);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const view = useMemo(() => filterItems(items, query), [items, query]);
  const viewFlat = useMemo(() => flattenItems(view), [view]);
  const invalid = Boolean(error);
  const described = [error ? errorId : hint ? hintId : null, describedBy]
    .filter(Boolean)
    .join(" ");

  const optionId = useCallback((i: number) => `${listId}-opt-${i}`, [listId]);

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
    const width = Math.min(Math.max(tr.width, 220), viewWidth - margin * 2);
    pop.style.width = `${width}px`;
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
      Math.max(viewLeft + margin, align === "end" ? tr.right - width : tr.left),
      viewLeft + viewWidth - width - margin,
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
      setQuery("");
      const at = flat.findIndex((o) => o.value === selectedValue);
      setActive(
        at >= 0 && !flat[at].disabled
          ? at
          : nextEnabled(flat, dir === 1 ? -1 : flat.length, dir),
      );
      setOpen(true);
    },
    [disabled, flat, selectedValue],
  );

  const close = useCallback((focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const choose = (option: SelectOption) => {
    if (option.disabled) return;
    if (option.href) {
      if (onAction) onAction(option);
      else window.location.assign(option.href);
      close(true);
      return;
    }
    if (option.action === "button" && onAction) {
      onAction(option);
      close(true);
      return;
    }
    if (value === undefined) setInner(option.value);
    onChange?.(option.value, option);
    close(true);
  };

  // список в портале: ставим у поля и переставляем при прокрутке/клавиатуре
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
      (searchable ? searchRef.current : listRef.current)?.focus({
        preventScroll: true,
      }),
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
  }, [open, place, close, searchable]);

  // активный пункт всегда виден в списке
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
      setActive((i) =>
        nextEnabled(viewFlat, i, e.key === "ArrowDown" ? 1 : -1),
      );
      return;
    }
    if (e.key === "Home" || e.key === "End") {
      // в поле поиска Home/End двигают курсор, а не список
      if (e.currentTarget === searchRef.current) return;
      e.preventDefault();
      setActive(
        nextEnabled(
          viewFlat,
          e.key === "Home" ? -1 : viewFlat.length,
          e.key === "Home" ? 1 : -1,
        ),
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const option = viewFlat[active];
      if (option) choose(option);
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

  let index = -1;
  const rows = view.map((item) => {
    if (!isGroup(item)) {
      index += 1;
      return optionRow(item, index);
    }
    return (
      <fieldset
        key={item.label}
        aria-label={item.label}
        className="flex flex-col min-w-0 border-0 p-0 m-0"
      >
        <span className="px-10 pt-8 pb-3 font-11 font-w-700 uppercase letter-s-4 text-foreground-subtle">
          {item.label}
        </span>
        <div className="flex flex-col gap-1">
          {item.options.map((option) => {
            index += 1;
            return optionRow(option, index);
          })}
        </div>
      </fieldset>
    );
  });

  function optionRow(option: SelectOption, i: number) {
    const isSelected = option.value === selectedValue;
    const isActive = i === active;
    const className = cx(
      OPTION_BASE,
      option.disabled
        ? (optionDisabledClassName ?? OPTION_DISABLED_DEFAULT)
        : cx(
            "cursor-pointer",
            isSelected
              ? (optionSelectedClassName ?? OPTION_SELECTED_DEFAULT)
              : isActive && (optionActiveClassName ?? OPTION_ACTIVE_DEFAULT),
          ),
      optionClassName ?? OPTION_DEFAULT,
    );
    const content = (
      <>
        {option.icon && (
          <span
            aria-hidden="true"
            className="shrink-0 grid place-items-center size-18 text-foreground-subtle"
          >
            {option.icon}
          </span>
        )}
        <span className="flex flex-col min-w-0 flex-1">
          <span className="truncate">{option.label}</span>
          {option.hint && (
            <span className="truncate font-12 opacity-70">{option.hint}</span>
          )}
        </span>
        {option.badge && (
          <span
            className={cx(
              "shrink-0 px-6 py-1 br-full font-11 font-w-600",
              badgeClassName ?? BADGE_DEFAULT,
            )}
          >
            {option.badge}
          </span>
        )}
        {option.href && (
          <LinkIcon
            width={14}
            height={14}
            aria-hidden="true"
            className="shrink-0 text-foreground-muted"
          />
        )}
        {option.action === "button" && (
          <CursorClick
            width={14}
            height={14}
            aria-hidden="true"
            className="shrink-0 text-foreground-muted"
          />
        )}
        {isSelected && (
          <Check
            width={16}
            height={16}
            aria-hidden="true"
            className="shrink-0"
          />
        )}
      </>
    );

    // Пункт-ссылка — настоящая ссылка: мышь переходит сразу, клавиатура — через onAction.
    if (option.href && !option.disabled) {
      return (
        <NextLink
          key={option.value}
          href={option.href}
          id={optionId(i)}
          role="option"
          tabIndex={-1}
          data-part="option"
          aria-selected={isSelected}
          onPointerMove={() => {
            if (i !== active) setActive(i);
          }}
          onClick={() => close(false)}
          className={className}
          style={optionStyle}
        >
          {content}
        </NextLink>
      );
    }

    return (
      <button
        key={option.value}
        type="button"
        id={optionId(i)}
        role="option"
        tabIndex={-1}
        data-part="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled || undefined}
        disabled={option.disabled}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") e.preventDefault();
        }}
        onPointerMove={() => {
          if (!option.disabled && i !== active) setActive(i);
        }}
        onClick={() => choose(option)}
        className={className}
        style={optionStyle}
      >
        {content}
      </button>
    );
  }

  const triggerClass = cx(
    TRIGGER_BASE,
    triggerClassName ?? TRIGGER_DEFAULT,
    invalid ? triggerInvalidClassName : open ? triggerOpenClassName : false,
  );

  return (
    <div
      className={cx("flex flex-col gap-6 min-w-0", className)}
      ref={rootRef}
      {...rest}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={triggerId}
          data-part="label"
          className={cx("font-13 font-w-600", labelClassName)}
        >
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={selectedValue} />}
      <button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={label ? labelId : undefined}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-describedby={described || undefined}
        data-part="trigger"
        disabled={disabled}
        onClick={() => (open ? close(true) : openMenu(1))}
        onKeyDown={onTriggerKey}
        className={triggerClass}
        style={triggerStyle}
      >
        {selected?.icon && (
          <span
            aria-hidden="true"
            data-part="icon"
            className="shrink-0 grid place-items-center text-foreground-subtle"
          >
            {selected.icon}
          </span>
        )}
        <span className="flex flex-col min-w-0 flex-1">
          <span className={`truncate ${selected ? "" : "opacity-70"}`}>
            {selected?.label ?? placeholder}
          </span>
          {selected?.hint && (
            <span
              data-part="hint"
              className="truncate font-12 font-w-500 opacity-70"
            >
              {selected.hint}
            </span>
          )}
        </span>
        <ChevronDown
          width={18}
          height={18}
          aria-hidden="true"
          className={`shrink-0 text-foreground-muted transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {error ? (
        <p
          id={errorId}
          data-part="error"
          className={cx("font-12 text-danger", errorClassName)}
        >
          {error}
        </p>
      ) : (
        hint && (
          <p
            id={hintId}
            data-part="hint"
            className={cx("font-12 text-foreground-muted", hintClassName)}
          >
            {hint}
          </p>
        )
      )}

      {open &&
        createPortal(
          <div
            ref={popRef}
            data-part="panel"
            className={cx(
              PANEL_BASE,
              panelClassName ?? PANEL_DEFAULT,
              ANIMATION[animation],
            )}
            style={{ left: 0, top: 0, width: 0, ...panelStyle }}
          >
            {searchable && (
              <div className="p-6 border-b">
                <input
                  ref={searchRef}
                  role="combobox"
                  data-part="search"
                  aria-expanded="true"
                  aria-autocomplete="list"
                  aria-controls={listId}
                  aria-activedescendant={
                    active >= 0 ? optionId(active) : undefined
                  }
                  value={query}
                  onChange={(e) => {
                    const q = e.target.value;
                    setQuery(q);
                    const next = flattenItems(filterItems(items, q));
                    setActive(nextEnabled(next, -1, 1));
                  }}
                  onKeyDown={onMenuKey}
                  placeholder="Поиск…"
                  aria-label="Поиск по списку"
                  className={cx(SEARCH_DEFAULT, searchClassName)}
                />
              </div>
            )}
            <div
              ref={listRef}
              id={listId}
              role="listbox"
              aria-labelledby={label ? labelId : undefined}
              aria-label={!label ? ariaLabel : undefined}
              aria-activedescendant={
                !searchable && active >= 0 ? optionId(active) : undefined
              }
              tabIndex={searchable ? -1 : 0}
              onKeyDown={onMenuKey}
              className={cx(
                "flex flex-col max-h-260 overflow-y-auto overscroll-contain p-4 outline-none",
                listClassName,
              )}
              style={{ gap: optionGap, ...listStyle }}
            >
              {rows.length ? (
                rows
              ) : (
                <div
                  role="presentation"
                  className="px-10 py-12 font-13 text-foreground-muted"
                >
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
