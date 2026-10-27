"use client";

// «На этой странице» — оглавление справа, как у HeroUI и docs.boxicons.com. Текущий раздел — последний, чей
// заголовок уже поднялся выше трети экрана (как PageNav в ozon); у конца страницы — последний пункт.
// Считается по прокрутке, не чаще раза в кадр.

import { useEffect, useState } from "react";

export type TocItem = { id: string; title: string; sub?: boolean };

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      if (scrollY + innerHeight >= root.scrollHeight - 2) {
        setActive(items.at(-1)?.id);
        return;
      }
      const line = innerHeight / 3;
      let current = items[0]?.id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label="На этой странице" className="flex flex-col gap-12">
      <p className="font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
        На этой странице
      </p>
      <ul className="flex flex-col border-l font-13">
        {items.map(({ id, title, sub }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={id === active ? "location" : undefined}
              className={`block -ml-px py-5 border-l-2 border-transparent ${sub ? "pl-24" : "pl-12"} text-foreground-muted transition-colors hover:text-foreground aria-[current=location]:border-secondary aria-[current=location]:text-foreground aria-[current=location]:font-w-500`}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
