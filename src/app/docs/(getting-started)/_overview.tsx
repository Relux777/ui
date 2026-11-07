"use client";

// Разделы обзора /docs — аккордеон: плавное раскрытие (grid-template-rows), aria-expanded / aria-controls,
// фокус остаётся на заголовке, стрелки ↑/↓ и Home/End переходят между заголовками. Данные, иконки и плитки
// приходят с сервера, компонент только раскрывает и переключает.

import { ChevronDown } from "@boxicons/react/ChevronDown";
import Link from "next/link";
import type { KeyboardEvent, ReactNode } from "react";
import { useId, useRef, useState } from "react";
import styles from "./overview.module.scss";

export type SectionEntry = {
  title: string;
  lead: string;
  icon: ReactNode;
  /** класс плитки под иконку (оттенок циклится на странице) */
  tile: string;
  links: { href: string; title: string }[];
};

export function SectionList({ groups }: { groups: SectionEntry[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const headers = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId().replace(/:/g, "");

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const jump =
      event.key === "ArrowDown"
        ? i + 1
        : event.key === "ArrowUp"
          ? i - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? groups.length - 1
              : null;
    if (jump === null) return;
    event.preventDefault();
    headers.current[(jump + groups.length) % groups.length]?.focus();
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 items-start">
      {groups.map((group, i) => {
        const isOpen = open === group.title;
        const headId = `${uid}-head-${i}`;
        const panelId = `${uid}-panel-${i}`;
        return (
          <div
            key={group.title}
            className="br-xl border bg-surface overflow-hidden transition-colors hover:border-border-strong"
          >
            <button
              ref={(el) => {
                headers.current[i] = el;
              }}
              type="button"
              id={headId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : group.title)}
              onKeyDown={(event) => onKey(event, i)}
              className="flex items-center gap-10 sm:gap-12 p-10 sm:p-14 w-full text-left cursor-pointer select-none"
            >
              <span
                aria-hidden="true"
                className={`${group.tile} size-34 sm:size-38 br-lg grid place-items-center shrink-0`}
              >
                {group.icon}
              </span>
              <span className="flex-1 min-w-0 flex flex-col">
                <span className="font-14 sm:font-15 font-w-600 truncate">
                  {group.title}
                </span>
                <span className="font-11 text-foreground-muted">
                  {group.links.length} страниц
                </span>
              </span>
              <ChevronDown
                size="xs"
                aria-hidden="true"
                className={`shrink-0 text-foreground-muted transition-[rotate] duration-300 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <section
              id={panelId}
              aria-labelledby={headId}
              data-open={isOpen ? "" : undefined}
              inert={!isOpen}
              className={styles.panel}
            >
              <div>
                <div className="flex flex-col gap-8 px-10 pb-10 sm:px-14 sm:pb-14">
                  <p className="font-12 text-foreground-muted">{group.lead}</p>
                  <ul className="flex flex-wrap gap-6">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block px-10 py-4 br-full bg-foreground/5 font-13 transition hover:bg-secondary hover:text-secondary-foreground"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}
