"use client";

// «Быстрый переход» (как в ozon: PageNav + модалка right) — только разделы этой страницы. Открывается кнопкой
// со списком в быстром меню NavBar (под сменой темы); кнопка есть лишь на страницах с разделами (parts.ts).
// Лист — общий Sheet: на телефоне снизу и смахивается, с 620px — панель справа. Разделы — линией с номерами,
// раздел на экране подсвечен, подразделы — таблетками под своим разделом.

import { useEffect, useRef, useState } from "react";
import { Sheet, type SheetHandle } from "@/components/ui/Sheet";
import { onOpenQuickNav, type Part, readParts } from "./parts";

const ROW =
  "flex items-center gap-12 min-h-48 px-8 py-6 br-16 transition-colors hover:bg-foreground/5 active:bg-foreground/8";

export function QuickNav() {
  const sheet = useRef<SheetHandle>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [activePart, setActivePart] = useState<string>();
  // где вы сейчас — название страницы из <title> («Цвета — Справка RenDit UI» → «Цвета»)
  const [here, setHere] = useState("");

  useEffect(() => onOpenQuickNav(() => sheet.current?.open()), []);

  const close = () => sheet.current?.close();

  return (
    <Sheet
      ref={sheet}
      id="quick-nav"
      title="Быстрый переход"
      subtitle={
        here && (
          <>
            Вкладка — <span className="text-foreground">{here}</span>
          </>
        )
      }
      onOpen={() => {
        const read = readParts();
        setParts(read.parts);
        setActivePart(read.active);
        setHere(document.title.split(" — ")[0]);
      }}
    >
      <ol className="relative flex flex-col before:absolute before:left-[29px] before:top-24 before:bottom-24 before:w-2 before:br-full before:bg-foreground/8">
        {parts.map((part, i) => {
          const on = part.id === activePart;
          return (
            <li key={part.id} className="relative flex flex-col">
              <a
                href={`#${part.id}`}
                onClick={close}
                aria-current={on ? "location" : undefined}
                className={`${ROW} aria-[current=location]:bg-secondary/10 aria-[current=location]:text-secondary`}
              >
                <span
                  aria-hidden="true"
                  className={`relative z-1 size-32 shrink-0 br-full grid place-items-center font-12 font-w-700 tabular-nums shadow-[0_0_0_4px_var(--surface)] ${on ? "bg-secondary text-secondary-foreground" : "bg-surface-muted text-foreground-muted"}`}
                >
                  {i + 1}
                </span>
                <span className="flex-1 min-w-0 font-15 font-w-500">
                  {part.title}
                </span>
                {on && (
                  <span className="shrink-0 px-8 py-2 br-full bg-secondary/12 font-11 font-w-600">
                    вы здесь
                  </span>
                )}
              </a>
              {part.subs.length > 0 && (
                <ul className="flex flex-wrap gap-6 pl-52 pb-8">
                  {part.subs.map((sub) => (
                    <li key={sub.id}>
                      <a
                        href={`#${sub.id}`}
                        onClick={close}
                        className="block px-10 py-4 br-full bg-foreground/5 font-13 text-foreground-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
                      >
                        {sub.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </Sheet>
  );
}
