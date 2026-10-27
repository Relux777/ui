// Общие части шапки для всех вариантов: логотип, пункты меню, кнопки справа.
// Пункты — кнопки, а не ссылки: страница служебная, переходить никуда не нужно.

import { Search } from "@boxicons/react/Search";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import RenDitLogo from "@/assets/svg/Rendit_UI_logo.svg";
import s from "../header.module.scss";

export const LINKS = ["Главная", "Компоненты", "Справка", "Блог"];

export function Brand({ className = "" }: { className?: string }) {
  return (
    <span className={`${s.brand} ${className}`}>
      <RenDitLogo width={24} height={24} aria-hidden="true" />
      <span>
        RenDit <span className="text-violet-500">UI</span>
      </span>
    </span>
  );
}

// Пункты меню. active — выбранный; onSelect — если пункты переключаются; children — плашка-указатель
export function Menu({
  active = 0,
  onSelect,
  className = "",
  children,
  ...rest
}: {
  active?: number;
  onSelect?: (i: number) => void;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
} & Omit<HTMLAttributes<HTMLElement>, "onSelect">) {
  return (
    <nav aria-label="Меню" className={`${s.menu} ${className}`} {...rest}>
      {children}
      {LINKS.map((label, i) => (
        <button
          key={label}
          type="button"
          data-item={i}
          aria-current={i === active ? "page" : undefined}
          onClick={() => onSelect?.(i)}
          className={s.link}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

export function Actions({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`${s.actions} ${className}`}>
      <button type="button" className={s.iconBtn} aria-label="Поиск">
        <Search width={18} height={18} />
      </button>
      <button type="button" className={s.cta}>
        Начать
      </button>
      {children}
    </div>
  );
}
