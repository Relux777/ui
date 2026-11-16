// Навигация RenDit UI: ссылки в ряд или колонкой, активный пункт, иконки и метки.
// Компонент отвечает за семантику и aria-current, вид — классами в файле подключения.
// Без классов работает аккуратный дефолт: горизонтальный ряд таблеток.

import NextLink from "next/link";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type NavigationItem = {
  label: ReactNode;
  href: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
};

export type NavigationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  items: readonly NavigationItem[];
  /** href активного пункта */
  active?: string;
  /** подпись для скринридера */
  label: string;
  orientation?: "horizontal" | "vertical";
  listClassName?: string;
  itemClassName?: string;
  activeClassName?: string;
  disabledClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  badgeClassName?: string;
  itemStyle?: CSSProperties;
};

const LIST_BASE = "flex list-none p-0 m-0 min-w-0";
const LIST_HORIZONTAL = "flex-wrap items-center gap-4";
const LIST_VERTICAL = "flex-col gap-2";
const ITEM_BASE =
  "flex items-center gap-8 min-w-0 px-12 py-8 br-lg font-13 font-w-600 transition-colors motion-reduce:transition-none";
const ITEM_DEFAULT =
  "text-foreground-muted hover:bg-foreground/5 hover:text-foreground";
const ITEM_ACTIVE = "bg-secondary/10 text-secondary";
const ITEM_DISABLED = "opacity-50 pointer-events-none";
const ICON_BASE = "shrink-0 grid place-items-center [&>svg]:size-full";
const ICON_DEFAULT = "size-18";
const BADGE_BASE = "ml-auto shrink-0 px-6 py-1 br-full font-11 font-w-600";
const BADGE_DEFAULT = "bg-foreground/5";

const cx = (...values: (string | false | null | undefined)[]) =>
  values.filter(Boolean).join(" ");

export function Navigation({
  items,
  active,
  label,
  orientation = "horizontal",
  className = "",
  listClassName,
  itemClassName,
  activeClassName,
  disabledClassName,
  iconClassName,
  labelClassName,
  badgeClassName,
  itemStyle,
  ...rest
}: NavigationProps) {
  const listDefault =
    orientation === "vertical" ? LIST_VERTICAL : LIST_HORIZONTAL;

  return (
    <nav aria-label={label} className={cx("min-w-0", className)} {...rest}>
      <ul className={cx(LIST_BASE, listClassName ?? listDefault)}>
        {items.map((item) => {
          const isActive = active === item.href;
          const itemClass = cx(
            ITEM_BASE,
            itemClassName ?? ITEM_DEFAULT,
            isActive && (activeClassName ?? ITEM_ACTIVE),
            item.disabled && (disabledClassName ?? ITEM_DISABLED),
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
              <span className={cx("truncate", labelClassName)}>
                {item.label}
              </span>
              {item.badge && (
                <span
                  className={cx(BADGE_BASE, badgeClassName ?? BADGE_DEFAULT)}
                >
                  {item.badge}
                </span>
              )}
            </>
          );

          return (
            <li key={item.href} className="min-w-0">
              {item.disabled ? (
                <span
                  aria-disabled="true"
                  className={itemClass}
                  style={itemStyle}
                >
                  {content}
                </span>
              ) : (
                <NextLink
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={itemClass}
                  style={itemStyle}
                >
                  {content}
                </NextLink>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
