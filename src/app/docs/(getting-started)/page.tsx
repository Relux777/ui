// Справка — вход в документацию: что такое RenDit UI, из чего он состоит и куда идти дальше.
// На телефоне сверху только заголовок, кнопки и подсказка про поиск — чипы и вводный текст убираются.
// Части — тёмные промо-карточки с тенью-кромкой shadow-7, 3D-наклоном (Tilt) и прожектором (Spotlight);
// разделы — аккордеон (SectionList). Секции мягко проявляются снизу со сдвигом (overview.module.scss).

import { ArrowRight } from "@boxicons/react/ArrowRight";
import { BookOpen } from "@boxicons/react/BookOpen";
import { BorderAll } from "@boxicons/react/BorderAll";
import { Code as CodeIcon } from "@boxicons/react/Code";
import { Cog } from "@boxicons/react/Cog";
import { Cursor } from "@boxicons/react/Cursor";
import { Grid } from "@boxicons/react/Grid";
import { Layers } from "@boxicons/react/Layers";
import { Layout } from "@boxicons/react/Layout";
import { Move } from "@boxicons/react/Move";
import { Package } from "@boxicons/react/Package";
import { Palette } from "@boxicons/react/Palette";
import { Ruler } from "@boxicons/react/Ruler";
import { TextHeight } from "@boxicons/react/TextHeight";
import { Timer } from "@boxicons/react/Timer";
import type { Metadata } from "next";
import Link from "next/link";
import { Spotlight } from "@/components/ui/Spotlight";
import { Tilt } from "@/components/ui/Tilt";
import { version } from "../../../../package.json";
import { Code } from "../../_docs/docs";
import { DOCS_NAV } from "../_nav";
import { SectionList } from "./_overview";
import styles from "./overview.module.scss";

export const metadata: Metadata = {
  title: { absolute: "Справка — RenDit UI" },
};

// три части — как карточки платформы на установке: круглый значок в тишине фона, название с меткой и одна строка
const PARTS = [
  {
    Icon: Layers,
    name: "RenDit SCSS",
    tag: "scss",
    color: "text-lime-600 dark:text-lime-400",
    text: "Токены, сброс, база, сетка .row и компоненты.",
  },
  {
    Icon: CodeIcon,
    name: "RenDit Code",
    tag: "code",
    color: "text-secondary",
    text: "Движок: CSS только из классов, что есть в коде.",
  },
  {
    Icon: Package,
    name: "Компоненты",
    tag: "ui",
    color: "text-pink-500",
    text: "Готовые куски интерфейса — каждый папкой.",
  },
];

// иконки групп и мягкие плитки — по кругу
const GROUP_ICONS: Record<string, typeof BookOpen> = {
  Начало: BookOpen,
  Основы: CodeIcon,
  Раскладка: Layout,
  "Flex и Grid": Grid,
  Отступы: Move,
  Размеры: Ruler,
  Текст: TextHeight,
  "Цвета и фон": Palette,
  Рамки: BorderAll,
  Эффекты: Layers,
  Движение: Timer,
  Взаимодействие: Cursor,
  "Движок RenDit Code": Cog,
};

const TINTS = [
  "bg-accent/15",
  "bg-secondary/15",
  "bg-pink-500/15",
  "bg-blue-500/15",
];

export default function DocsPage() {
  const groups = DOCS_NAV.length;
  const pages = DOCS_NAV.reduce((n, g) => n + g.links.length, 0);

  const sections = DOCS_NAV.map((group, i) => ({
    title: group.title,
    lead: group.lead,
    icon: (() => {
      const Icon = GROUP_ICONS[group.title] ?? BookOpen;
      return <Icon size="sm" />;
    })(),
    tile: TINTS[i % TINTS.length],
    links: group.links.map(({ href, title }) => ({ href, title })),
  }));

  return (
    <>
      {/* ── Верх: на телефоне — только заголовок, кнопки и подсказка ── */}
      <div className="relative">
        <div
          className={`flex flex-col gap-16 sm:gap-20 pt-8 sm:pt-16 ${styles.section}`}
        >
          <ul className="flex flex-wrap gap-8 font-12 font-w-500 max-sm:hidden">
            <li className="flex items-center gap-6 h-30 px-12 br-full border bg-surface whitespace-nowrap">
              <span className="size-7 br-full bg-accent" aria-hidden="true" />
              RenDit UI {version}
            </li>
            <li className="flex items-center h-30 px-12 br-full border bg-surface whitespace-nowrap">
              Next.js · React · Node.js · HTML
            </li>
            <li className="flex items-center h-30 px-12 br-full border bg-surface whitespace-nowrap">
              Лицензия MIT
            </li>
          </ul>
          <h1 className="font-34 sm:font-44 md:font-60 font-w-700 -letter-s-3 leading-1.05 max-w-800 max-sm:mx-auto max-sm:text-center">
            Справка{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              RenDit UI
            </span>
          </h1>
          <p className="font-17 text-foreground-muted max-w-60ch max-sm:hidden">
            Свой UI-фреймворк: стили, движок классов и компоненты. Код — под
            Next.js, React, Node.js или обычный HTML/CSS, с движком RenDit Code
            или без него. Платформу выберите вверху левого меню — шаги и код на
            страницах подстроятся.
          </p>
          <div className="flex flex-wrap gap-10 max-sm:justify-center">
            <Link
              href="/docs/install"
              className="flex items-center gap-8 h-40 px-20 br-full bg-primary text-primary-foreground font-14 font-w-500 transition hover:bg-primary-hover active:scale-95"
            >
              Начать установку
              <ArrowRight width={18} height={18} aria-hidden="true" />
            </Link>
            <Link
              href="/docs/structure"
              className="flex items-center gap-8 h-40 px-20 br-full border bg-surface font-14 font-w-500 text-secondary transition hover:bg-secondary hover:text-secondary-foreground active:scale-95"
            >
              Подробнее об устройстве
              <ArrowRight width={18} height={18} aria-hidden="true" />
            </Link>
          </div>
          <p className="font-13 text-foreground-muted max-sm:text-center">
            Ищете класс? Нажмите <Code>/</Code> или <Code>Ctrl+K</Code> — поиск
            найдёт и страницу по классу: <Code>w-20</Code>, <Code>hover:</Code>,{" "}
            <Code>shadow-7</Code>…
          </p>
        </div>
      </div>

      {/* ── Из чего состоит: карточка как «Платформа» на установке ─── */}
      <section>
        <div
          className={`flex flex-col gap-14 sm:gap-16 ${styles.section}`}
          style={{ animationDelay: "70ms" }}
        >
          <div className="flex items-baseline justify-between gap-10 max-sm:flex-col max-sm:items-center max-sm:text-center">
            <h2 className="font-22 sm:font-24 font-w-700 -letter-s-2">
              Из чего состоит
            </h2>
            <Link
              href="/docs/structure"
              className="flex items-center gap-6 h-30 px-12 br-full border font-12 font-w-600 text-secondary transition hover:bg-secondary hover:text-secondary-foreground active:scale-95"
            >
              Подробнее
              <ArrowRight width={14} height={14} aria-hidden="true" />
            </Link>
          </div>
          {/* карточка выбора — в 3D: наклоняется за курсором, по ней бежит свет (.tilt + Tilt), как на установке */}
          <div className="tilt relative isolate p-14 sm:p-20 br-2xl border bg-surface shadow-3 before:absolute before:inset-0 before:-z-1 before:br-2xl before:bg-[radial-gradient(60%_80%_at_0%_0%,color-mix(in_oklab,var(--secondary)_7%,transparent),transparent),radial-gradient(50%_70%_at_100%_100%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent)]">
            <Spotlight />
            <Tilt />
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-10">
              {PARTS.map((part) => (
                <article
                  key={part.name}
                  className="group relative flex items-center sm:flex-col sm:items-start gap-8 sm:gap-10 p-12 sm:p-14 br-xl border bg-surface transition-[border-color,box-shadow,translate,scale] duration-300 ease-spring hover:-translate-y-1 hover:border-border-strong hover:shadow-2 motion-reduce:transition-none"
                >
                  <span className="relative size-32 sm:size-40 shrink-0 br-full grid place-items-center bg-surface-muted">
                    <part.Icon
                      width={24}
                      height={24}
                      className={`size-20 sm:size-24 ${part.color}`}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="flex flex-col min-w-0">
                    <span className="flex flex-wrap items-center gap-x-6 font-14 sm:font-15 font-w-700">
                      {part.name}
                      <span className="px-6 py-1 br-full bg-foreground/5 font-11 font-w-600 text-foreground-muted whitespace-nowrap">
                        {part.tag}
                      </span>
                    </span>
                    <span className="font-12 text-foreground-muted truncate">
                      {part.text}
                    </span>
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Разделы: аккордеон групп ──────────────────────────────── */}
      <section>
        <div
          className={`flex flex-col gap-14 sm:gap-16 ${styles.section}`}
          style={{ animationDelay: "140ms" }}
        >
          <div className="flex items-baseline justify-between gap-10 max-sm:flex-col max-sm:items-center max-sm:text-center">
            <h2 className="font-22 sm:font-24 font-w-700 -letter-s-2">
              Разделы
            </h2>
            <span className="font-12 sm:font-13 text-foreground-muted tabular-nums">
              {groups} групп · {pages} страниц
            </span>
          </div>
          <SectionList groups={sections} />
        </div>
      </section>
    </>
  );
}
