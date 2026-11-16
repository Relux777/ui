// Вкладка «Компоненты», как у HeroUI: все компоненты RenDit UI сеткой карточек — превью, название, одна строка.
// Готовые карточки ведут на свою страницу с конструктором, установкой и кодом; остальные — «скоро».

import type { Metadata } from "next";
import Link from "next/link";
import { Code } from "../../_docs/docs";
import { COMPONENTS, GROUPS } from "./_list";

export const metadata: Metadata = { title: "Компоненты" };

const CARD =
  "group flex flex-col h-full br-xl border bg-surface shadow-1 overflow-hidden transition-[box-shadow,translate,border-color] duration-300 ease-spring hover:shadow-4 hover:-translate-y-2 motion-reduce:transition-none";

export default function ComponentsPage() {
  const ready = COMPONENTS.filter((c) => c.ready).length;
  return (
    <div className="flex flex-col gap-40">
      <header className="flex flex-col gap-12 max-w-720">
        <h1 className="font-36 md:font-48 font-w-700 -letter-s-3 leading-1.1">
          Компоненты
        </h1>
        <p className="font-17 text-foreground-muted">
          Готовые компоненты RenDit UI: файлом <Code>.tsx</Code>, стили —
          классами RenDit Code, тёмная тема и телефон — сразу. Сейчас готовы{" "}
          {ready}, остальные — в работе.
        </p>
      </header>

      {GROUPS.map((group) => (
        <section key={group} className="flex flex-col gap-14">
          <h2 className="font-13 font-w-700 uppercase letter-s-6 text-foreground-subtle">
            {group}
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-14">
            {COMPONENTS.filter((c) => c.group === group).map((c) => {
              const body = (
                <>
                  {/* превью — как компонент будет выглядеть; для скринридера достаточно названия */}
                  <div
                    aria-hidden="true"
                    className="h-160 p-16 grid place-items-center bg-background bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_10%,transparent)_1px,transparent_1px)] [background-size:14px_14px] border-b pointer-events-none select-none"
                  >
                    {c.preview}
                  </div>
                  <div className="flex flex-col gap-4 p-14">
                    <div className="flex items-center justify-between gap-8">
                      <h3 className="font-15 font-w-700">{c.title}</h3>
                      <span
                        className={`shrink-0 px-8 py-2 br-full font-11 font-w-600 ${
                          c.ready
                            ? "bg-accent/30 text-foreground"
                            : "bg-foreground/5 text-foreground-muted"
                        }`}
                      >
                        {c.ready ? "готово" : "скоро"}
                      </span>
                    </div>
                    <p className="font-13 text-foreground-muted">{c.text}</p>
                  </div>
                </>
              );
              return (
                <li key={c.id}>
                  {c.ready ? (
                    <Link
                      href={`/docs/components/${c.id}`}
                      className={`${CARD} hover:border-secondary`}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className={CARD}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
