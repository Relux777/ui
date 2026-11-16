"use client";

// Вкладки RenDit UI: сегменты, подчёркивание или рамка. Активная вкладка — единственная
// в порядке табуляции; стрелки, Home и End переключают и переводят фокус. Панель связана
// с вкладкой через aria-controls / aria-labelledby.

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";

export type TabsVariant = "pill" | "underline" | "enclosed";
export type TabsSize = "sm" | "md" | "lg";

export type TabItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  /** число справа: сколько файлов, сообщений, задач */
  count?: number;
  disabled?: boolean;
  /** содержимое панели; без него панель не рисуется */
  content?: ReactNode;
};

export type TabsProps = {
  items: readonly TabItem[];
  /** выбранная вкладка; без value компонент держит выбор сам */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  /** вкладки на всю ширину родителя */
  fullWidth?: boolean;
  ariaLabel?: string;
  className?: string;
  panelClassName?: string;
};

const SIZE = {
  sm: "h-30 px-10 font-12 gap-5",
  md: "h-36 px-14 font-13 gap-6",
  lg: "h-44 px-18 font-14 gap-8",
} as const;

const TAB =
  "inline-flex items-center justify-center whitespace-nowrap font-w-600 transition-[color,background-color,border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-40 disabled:cursor-not-allowed motion-reduce:transition-none";

const VARIANT = {
  pill: {
    list: "inline-flex gap-2 p-3 br-full bg-foreground/5",
    tab: "br-full text-foreground-muted hover:text-foreground aria-selected:bg-surface aria-selected:text-foreground aria-selected:shadow-2",
  },
  underline: {
    list: "flex gap-20 border-b",
    tab: "br-none border-b-2 border-b-transparent text-foreground-muted hover:text-foreground aria-selected:border-b-secondary aria-selected:text-foreground",
  },
  enclosed: {
    list: "inline-flex gap-1 p-1 br-lg border bg-surface-muted",
    tab: "br-md text-foreground-muted hover:text-foreground aria-selected:bg-surface aria-selected:text-foreground aria-selected:shadow-1",
  },
} as const;

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = "pill",
  size = "md",
  fullWidth = false,
  ariaLabel = "Вкладки",
  className = "",
  panelClassName = "",
}: TabsProps) {
  const base = useId();
  const [inner, setInner] = useState(
    () => defaultValue ?? items.find((t) => !t.disabled)?.id ?? "",
  );
  const activeId = value ?? inner;
  const active =
    items.find((t) => t.id === activeId && !t.disabled) ??
    items.find((t) => !t.disabled) ??
    items[0];
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const safe = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "-");
  const tabId = (id: string) => `${base}-tab-${safe(id)}`;
  const panelId = (id: string) => `${base}-panel-${safe(id)}`;
  const v = VARIANT[variant];

  const activate = (id: string) => {
    if (value === undefined) setInner(id);
    onChange?.(id);
  };

  const move = (from: number, step: 1 | -1) => {
    const count = items.length;
    for (let n = 1; n <= count; n++) {
      const i = (from + step * n + count) % count;
      if (!items[i].disabled) {
        activate(items[i].id);
        refs.current[i]?.focus();
        return;
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(i, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(i, -1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(-1, 1);
    } else if (e.key === "End") {
      e.preventDefault();
      move(0, -1);
    }
  };

  return (
    <div className={`flex flex-col min-w-0 ${className}`}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={`${v.list} ${fullWidth ? "w-full" : "self-start max-w-full"} ${variant === "pill" ? "overflow-x-auto scrollbar-none" : "max-sm:overflow-x-auto max-sm:scrollbar-none"}`}
      >
        {items.map((item, i) => {
          const selected = item.id === active?.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                refs.current[i] = node;
              }}
              id={tabId(item.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={
                selected && item.content !== undefined
                  ? panelId(item.id)
                  : undefined
              }
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => activate(item.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`${TAB} ${v.tab} ${SIZE[size]} ${fullWidth ? "flex-1 min-w-0" : "shrink-0"}`}
            >
              {item.icon && (
                <span
                  aria-hidden="true"
                  className="shrink-0 grid place-items-center"
                >
                  {item.icon}
                </span>
              )}
              <span className="truncate">{item.label}</span>
              {typeof item.count === "number" && (
                <span
                  className={`shrink-0 grid place-items-center min-w-18 h-18 px-5 br-full font-11 font-w-700 ${
                    selected
                      ? "bg-secondary/15 text-secondary"
                      : "bg-foreground/8 text-foreground-muted"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {active?.content !== undefined && (
        <div
          id={panelId(active.id)}
          role="tabpanel"
          aria-labelledby={tabId(active.id)}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: панель должна читаться с клавиатуры, даже если внутри нет полей
          tabIndex={0}
          className={`pt-16 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${panelClassName}`}
        >
          {active.content}
        </div>
      )}
    </div>
  );
}
