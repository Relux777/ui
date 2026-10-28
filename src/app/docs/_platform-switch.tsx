"use client";

// Выбор платформы справки — как переключатель роутера в документации Next.js: кнопка с логотипом и названием,
// по нажатию выезжает список четырёх платформ. Выбор общий для всей справки (_platform.ts).

import { Check } from "@boxicons/react/Check";
import { ChevronDown } from "@boxicons/react/ChevronDown";
import { Html5 } from "@boxicons/react/Html5";
import { NextJs } from "@boxicons/react/NextJs";
import { Nodejs } from "@boxicons/react/Nodejs";
import { ReactIcon } from "@boxicons/react/ReactIcon";
import { useEffect, useId, useRef, useState } from "react";
import {
  choosePlatform,
  DOCS_PLATFORMS,
  type DocsPlatform,
  useDocsPlatform,
} from "./_platform";

// логотипы — в фирменных цветах
export const PLATFORM_ICONS: Record<
  DocsPlatform,
  { Icon: typeof NextJs; color: string }
> = {
  nextjs: { Icon: NextJs, color: "text-foreground" },
  react: { Icon: ReactIcon, color: "text-cyan-500" },
  node: { Icon: Nodejs, color: "text-green-600" },
  html: { Icon: Html5, color: "text-orange-500" },
};

export function PlatformSwitch({ className = "" }: { className?: string }) {
  const platform = useDocsPlatform();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const current =
    DOCS_PLATFORMS.find((p) => p.id === platform) ?? DOCS_PLATFORMS[0];
  const { Icon, color } = PLATFORM_ICONS[current.id];

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("pointerdown", away);
    addEventListener("keydown", esc);
    return () => {
      removeEventListener("pointerdown", away);
      removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="group w-full flex items-center gap-10 p-6 pr-10 br-lg border bg-surface shadow-1 text-left transition-[border-color,box-shadow] hover:border-border-strong aria-expanded:border-secondary aria-expanded:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
      >
        <span className="size-32 shrink-0 br-md grid place-items-center bg-surface-muted">
          <Icon size="sm" className={color} aria-hidden="true" />
        </span>
        <span className="flex-1 min-w-0 flex flex-col">
          <span className="font-11 font-w-600 uppercase letter-s-6 text-foreground-subtle">
            Платформа
          </span>
          <span className="truncate font-14 font-w-600">{current.title}</span>
        </span>
        <ChevronDown
          size="xs"
          aria-hidden="true"
          className="shrink-0 text-foreground-muted transition-[rotate] duration-400 ease-spring group-[[aria-expanded=true]]:rotate-180"
        />
      </button>

      <div
        id={id}
        role="listbox"
        aria-label="Платформа справки"
        data-open={open || undefined}
        inert={!open}
        className="absolute top-full inset-x-0 z-20 mt-6 flex flex-col p-4 br-lg border bg-surface shadow-5 origin-top opacity-0 scale-95 -translate-y-4 invisible transition-[opacity,scale,translate,visibility] duration-300 ease-spring data-open:opacity-100 data-open:scale-100 data-open:translate-y-0 data-open:visible motion-reduce:transition-none"
      >
        {DOCS_PLATFORMS.map((p) => {
          const { Icon: PIcon, color: pColor } = PLATFORM_ICONS[p.id];
          return (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={p.id === platform}
              onClick={() => {
                choosePlatform(p.id);
                setOpen(false);
              }}
              className="flex items-center gap-10 p-6 br-md text-left transition-colors hover:bg-foreground/5 aria-selected:bg-secondary/8"
            >
              <span className="size-28 shrink-0 br-sm grid place-items-center bg-surface-muted">
                <PIcon size="xs" className={pColor} aria-hidden="true" />
              </span>
              <span className="flex-1 min-w-0 flex flex-col">
                <span className="font-13 font-w-600">{p.title}</span>
                <span className="font-11 text-foreground-muted">{p.note}</span>
              </span>
              {p.id === platform && (
                <Check
                  size="xs"
                  className="shrink-0 text-secondary"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
