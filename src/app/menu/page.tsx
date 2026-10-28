// «Меню» нижнего меню — отдельная страница (пока заглушка): все разделы сайта карточками и что здесь появится.
// Быстрый переход по текущей странице — окно, его открывает кнопка в шапке.

import { BookOpen } from "@boxicons/react/BookOpen";
import { Cog } from "@boxicons/react/Cog";
import { History } from "@boxicons/react/History";
import { Home } from "@boxicons/react/Home";
import { Layers } from "@boxicons/react/Layers";
import { Newspaper } from "@boxicons/react/Newspaper";
import { Shapes } from "@boxicons/react/Shapes";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Меню" };

const SECTIONS = [
  { href: "/", title: "Главная", text: "Что такое RenDit UI", Icon: Home },
  {
    href: "/docs/install",
    title: "Справка",
    text: "Установка, стили, движок",
    Icon: BookOpen,
  },
  {
    href: "/docs/components",
    title: "Компоненты",
    text: "Готовые блоки с кодом",
    Icon: Shapes,
  },
  {
    href: "/docs/releases",
    title: "Обновления",
    text: "Что нового в версиях",
    Icon: History,
  },
  { href: "/blog", title: "Блог", text: "Новости и уроки", Icon: Newspaper },
  { href: "/logos", title: "Логотип", text: "Знак RenDit UI", Icon: Layers },
];

export default function MenuPage() {
  return (
    <main className="route-enter container py-48 max-sm:pt-24 flex flex-col gap-32">
      <header className="flex flex-col gap-10 max-w-720">
        <h1 className="font-36 md:font-48 font-w-700 -letter-s-3 leading-1.1">
          Меню
        </h1>
        <p className="font-17 text-foreground-muted">
          Все разделы RenDit UI в одном месте.
        </p>
      </header>

      <nav aria-label="Разделы сайта">
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {SECTIONS.map(({ href, title, text, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex flex-col gap-10 h-full p-16 br-xl border bg-surface shadow-1 transition-[translate,box-shadow] duration-300 ease-spring hover:-translate-y-2 hover:shadow-3 active:scale-97"
              >
                <span className="size-40 br-full grid place-items-center bg-secondary/10 text-secondary">
                  <Icon width={20} height={20} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="font-16 font-w-600">{title}</span>
                  <span className="font-13 text-foreground-muted">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="flex items-start gap-12 p-16 br-xl border border-dashed">
        <span className="size-36 shrink-0 br-full grid place-items-center bg-foreground/5 text-foreground-muted">
          <Cog width={20} height={20} aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="font-15 font-w-600">Скоро здесь</h2>
          <p className="font-14 text-foreground-muted">
            Настройки сайта: тема, размер текста, язык — и личный кабинет.
          </p>
        </div>
      </section>
    </main>
  );
}
