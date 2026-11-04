// Справка — вход в документацию: что такое RenDit UI, из каких частей он состоит и куда идти дальше.
// Карточки разделов строятся из того же оглавления, что и боковое меню (_nav.ts).

import { ArrowRight } from "@boxicons/react/ArrowRight";
import { Code as CodeIcon } from "@boxicons/react/Code";
import { Layers } from "@boxicons/react/Layers";
import { Package } from "@boxicons/react/Package";
import type { Metadata } from "next";
import Link from "next/link";
import { version } from "../../../../package.json";
import { Code } from "../../_docs/docs";
import { DOCS_NAV } from "../_nav";

export const metadata: Metadata = {
  title: { absolute: "Справка — RenDit UI" },
};

// три части — с иконками, как на главной
const PARTS = [
  {
    icon: <Layers />,
    tile: "bg-accent/15",
    name: "RenDit SCSS",
    text: "Токены (цвета, тени, скругления), сброс, база, контейнер и сетка .row. Работает и сам по себе — как обычный SCSS или собранный CSS.",
    path: "src/assets/scss/",
  },
  {
    icon: <CodeIcon />,
    tile: "bg-secondary/15",
    name: "RenDit Code",
    text: "Движок классов: находит классы в коде и собирает CSS только из них. Числа — в пикселях, цвета — из токенов.",
    path: "rendit-code/",
  },
  {
    icon: <Package />,
    tile: "bg-pink-500/15",
    name: "RenDit Components",
    text: "Компоненты-папки: React/Next.js, HTML + JS, стили и описание. Скачиваются целиком.",
    path: "src/components/ui/<имя>/",
  },
];

// карточка: лёгкий подъём за курсором — только transform и тень
const CARD =
  "relative flex flex-col gap-8 p-20 br-xl border bg-surface transition-[translate,box-shadow] duration-300 hover:-translate-y-4 hover:shadow-4 motion-reduce:transition-none";

export default function DocsPage() {
  const groups = DOCS_NAV.length;
  const pages = DOCS_NAV.reduce((n, g) => n + g.links.length, 0);

  return (
    <>
      {/* ── Герой ─────────────────────────────────────────────────── */}
      <div className="relative flex flex-col gap-20 pt-16">
        <ul className="flex flex-wrap gap-8 font-12 font-w-500">
          <li className="flex items-center gap-6 h-30 px-12 br-full border bg-surface">
            <span className="size-7 br-full bg-accent" aria-hidden="true" />
            RenDit UI {version}
          </li>
          <li className="flex items-center h-30 px-12 br-full border bg-surface">
            Next.js · React · Node.js · HTML
          </li>
          <li className="flex items-center h-30 px-12 br-full border bg-surface">
            Лицензия MIT
          </li>
        </ul>
        <h1 className="font-44 md:font-60 font-w-700 -letter-s-3 leading-1.05 max-w-800">
          Справка{" "}
          <span className="bg-gradient-brand bg-clip-text text-transparent">
            RenDit UI
          </span>
        </h1>
        <p className="font-17 text-foreground-muted max-w-60ch">
          Свой UI-фреймворк: стили, движок классов и компоненты. Код — под
          Next.js, React, Node.js или обычный HTML/CSS, с движком RenDit Code
          или без него. Платформу выберите вверху левого меню — шаги и код на
          страницах подстроятся.
        </p>
        <div className="flex flex-wrap gap-10">
          <Link
            href="/docs/install"
            className="flex items-center gap-8 h-40 px-20 br-full bg-primary text-primary-foreground font-14 font-w-500 transition hover:bg-primary-hover active:scale-95"
          >
            Начать установку
            <ArrowRight width={18} height={18} aria-hidden="true" />
          </Link>
          <Link
            href="/docs/structure"
            className="flex items-center gap-6 h-30 px-12 br-full border font-12 font-w-600 text-secondary transition hover:bg-secondary hover:text-secondary-foreground active:scale-95"
          >
            Подробнее об устройстве
            <ArrowRight width={14} height={14} aria-hidden="true" />
          </Link>
        </div>
        <p className="font-13 text-foreground-muted">
          Ищете класс? Нажмите <Code>/</Code> или <Code>Ctrl+K</Code> — поиск
          найдёт и страницу по классу: <Code>w-20</Code>, <Code>hover:</Code>,{" "}
          <Code>shadow-7</Code>…
        </p>
      </div>

      {/* ── Из чего состоит ───────────────────────────────────────── */}
      <section className="flex flex-col gap-16">
        <div className="flex items-baseline justify-between gap-10">
          <h2 className="font-24 font-w-700 -letter-s-2">Из чего состоит</h2>
          <Link
            href="/docs/structure"
            className="flex items-center gap-6 h-30 px-12 br-full border font-12 font-w-600 text-secondary transition hover:bg-secondary hover:text-secondary-foreground active:scale-95"
          >
            Подробнее
            <ArrowRight width={14} height={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-16">
          {PARTS.map((part) => (
            <article key={part.name} className={CARD}>
              <span
                className={`${part.tile} size-44 br-lg flex items-center justify-center`}
              >
                {part.icon}
              </span>
              <h3 className="font-17 font-w-700 pt-4">{part.name}</h3>
              <p className="font-14 text-foreground-muted">{part.text}</p>
              <span className="mt-auto pt-4">
                <Code>{part.path}</Code>
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* ── Разделы ───────────────────────────────────────────────── */}
      <section className="flex flex-col gap-16">
        <div className="flex items-baseline justify-between gap-10">
          <h2 className="font-24 font-w-700 -letter-s-2">Разделы</h2>
          <span className="font-13 text-foreground-muted tabular-nums">
            {groups} групп · {pages} страниц
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-16">
          {DOCS_NAV.map((group) => (
            <article key={group.title} className={CARD}>
              <div className="flex items-center justify-between gap-8">
                <h3 className="font-17 font-w-700">{group.title}</h3>
                <span className="px-8 py-2 br-full bg-surface-muted font-12 font-w-600 tabular-nums">
                  {group.links.length}
                </span>
              </div>
              <p className="font-14 text-foreground-muted">{group.lead}</p>
              {/* главные классы группы — как в левом меню */}
              <ul className="flex flex-wrap gap-6 pt-4">
                {[...new Set(group.links.flatMap((l) => l.classes?.[0] ?? []))]
                  .slice(0, 4)
                  .map((cls) => (
                    <li key={cls}>
                      <code className="block px-8 py-3 br-full bg-surface-muted font-mono font-11 text-foreground-muted">
                        {cls}
                      </code>
                    </li>
                  ))}
              </ul>
              <ul className="flex flex-wrap gap-6 pt-4">
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
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
