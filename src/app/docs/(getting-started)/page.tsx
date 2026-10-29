// Справка — вход в документацию: что такое RenDit UI, из каких частей он состоит и куда идти дальше.
// Карточки разделов строятся из того же оглавления, что и боковое меню (_nav.ts).

import { ArrowRight } from "@boxicons/react/ArrowRight";
import type { Metadata } from "next";
import Link from "next/link";
import { Code } from "../../_docs/docs";
import { DOCS_NAV } from "../_nav";

export const metadata: Metadata = {
  title: { absolute: "Справка — RenDit UI" },
};

const PARTS = [
  {
    name: "RenDit SCSS",
    text: "Токены (цвета, тени, скругления), сброс, база, контейнер и сетка .row. Работает и сам по себе — как обычный SCSS или собранный CSS.",
    path: "src/assets/scss/",
  },
  {
    name: "RenDit Code",
    text: "Движок классов: находит классы в коде и собирает CSS только из них. Числа — в пикселях, цвета — из токенов.",
    path: "rendit-code/",
  },
  {
    name: "RenDit Components",
    text: "Компоненты-папки: React/Next.js, HTML + JS, стили и описание. Скачиваются целиком.",
    path: "src/components/ui/<имя>/",
  },
];

export default function DocsPage() {
  return (
    <>
      <div className="flex flex-col gap-12 max-w-720">
        <h1 className="font-40 md:font-48 font-w-700 -letter-s-3 leading-1.1">
          Справка
        </h1>
        <p className="font-17 text-foreground-muted">
          RenDit UI — свой UI-фреймворк: стили, движок классов и компоненты. Код
          — под Next.js, React, Node.js или обычный HTML/CSS, с движком RenDit
          Code или без него. Платформу выберите вверху левого меню — шаги и код
          на страницах подстроятся.
        </p>
        <Link
          href="/docs/install"
          className="self-start flex items-center gap-8 px-18 py-10 br-full bg-primary text-primary-foreground font-w-500 transition hover:bg-primary-hover"
        >
          Начать установку
          <ArrowRight width={18} height={18} aria-hidden="true" />
        </Link>
      </div>

      <section className="flex flex-col gap-16">
        <h2 className="font-24 font-w-700 -letter-s-2">Из чего состоит</h2>
        <div className="grid md:grid-cols-3 gap-16">
          {PARTS.map((part) => (
            <article
              key={part.name}
              className="flex flex-col gap-8 p-20 br-xl border bg-surface"
            >
              <h3 className="font-17 font-w-700">{part.name}</h3>
              <p className="font-14 text-foreground-muted">{part.text}</p>
              <span className="mt-auto pt-4">
                <Code>{part.path}</Code>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-16">
        <h2 className="font-24 font-w-700 -letter-s-2">Разделы</h2>
        <div className="grid sm:grid-cols-2 gap-16">
          {DOCS_NAV.map((group) => (
            <article
              key={group.title}
              className="flex flex-col gap-6 p-20 br-xl border bg-surface"
            >
              <h3 className="font-17 font-w-700">{group.title}</h3>
              <p className="font-14 text-foreground-muted">{group.lead}</p>
              <ul className="flex flex-wrap gap-6 pt-6">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-10 py-4 br-full bg-surface-muted font-13 transition hover:bg-surface-muted/50"
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
