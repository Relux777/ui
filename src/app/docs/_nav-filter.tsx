"use client";

// Поиск по меню справки — в левом меню и во «всём меню» шапки. Ищет по названиям и классам (filterDocsNav):
// «w-20» найдёт «Ширину», «hover:» — «Состояния». Enter — открыть первую найденную страницу, Esc — очистить.

import { Search } from "@boxicons/react/Search";
import { X } from "@boxicons/react/X";

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** Enter — перейти к первой найденной странице */
  onEnter?: () => void;
  className?: string;
};

export function NavFilter({ value, onChange, onEnter, className = "" }: Props) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size="xs"
        aria-hidden="true"
        className="absolute left-11 text-foreground-subtle pointer-events-none"
      />
      <input
        type="text"
        inputMode="search"
        enterKeyHint="go"
        autoComplete="off"
        spellCheck={false}
        aria-label="Найти в справке"
        placeholder="Класс или тема: w-20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) onEnter?.();
          if (e.key === "Escape" && value) {
            e.stopPropagation();
            onChange("");
          }
        }}
        className="w-full h-38 pl-34 pr-34 br-lg border border-border bg-surface font-16 lg:font-14 placeholder:text-foreground-subtle transition-[border-color,box-shadow] hover:border-border-strong focus:border-secondary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)] focus:outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Очистить поиск"
          onClick={() => onChange("")}
          className="absolute right-6 size-26 br-full grid place-items-center text-foreground-muted transition hover:bg-foreground/8 hover:text-foreground"
        >
          <X size="xs" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
