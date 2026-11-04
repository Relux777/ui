// Как писать классы RenDit Code: числа — пиксели, цвета — токены и палитра, прозрачность /N, отрицательные
// значения, свои значения […]. И почему класс надо писать строкой целиком.

import type { Metadata } from "next";
import Link from "next/link";
import {
  Callout,
  Code,
  CodeBlock,
  DocHeader,
  Example,
  Heading,
  Lead,
} from "../../../../_docs/docs";
import { ActiveToggle } from "./_toggle";

export const metadata: Metadata = { title: "Как писать классы" };

export default function ClassesPage() {
  return (
    <>
      <DocHeader
        path={["Основы", "Как писать классы"]}
        title="Как писать классы"
        lead={
          <>
            RenDit Code похож на Tailwind, но с правилами RenDit: числа —
            пиксели (<Code>p-10</Code> = 10px), цвета — из токенов и палитры,
            прозрачность — только через <Code>/N</Code>. Ниже — всё, что нужно,
            чтобы писать классы с первого дня.
          </>
        }
      />

      <section className="flex flex-col gap-16">
        <Heading id="numbers">Числа — пиксели</Heading>
        <Lead>
          Число без единицы — пиксели: <Code>p-10</Code> = 10px,{" "}
          <Code>w-200</Code> = 200px, <Code>gap-8</Code> = 8px. Нужна другая
          единица — пишите её: <Code>p-1.5rem</Code>, <Code>w-50%</Code>,{" "}
          <Code>max-w-60ch</Code>. Минус в начале — отрицательное значение:{" "}
          <Code>-mt-10</Code>.
        </Lead>
        <Example
          title="Отступы в пикселях"
          note="p-20 = 20px со всех сторон; -mt-10 поднимает элемент вверх."
          code={`<div class="p-20 br-lg bg-secondary/15">p-20</div>
<div class="-mt-10 ml-40 p-12 br-lg bg-accent">-mt-10</div>`}
        >
          <div>
            <div className="p-20 br-lg bg-secondary/15 font-13">
              p-20 — 20px со всех сторон
            </div>
            <div className="-mt-10 ml-40 p-12 br-lg bg-accent text-accent-foreground font-13">
              -mt-10 — на 10px выше
            </div>
          </div>
        </Example>
      </section>

      <section className="flex flex-col gap-16">
        <Heading id="colors">Цвета: токены и палитра</Heading>
        <Lead>
          Смысловые цвета — токенами: <Code>bg-primary</Code>,{" "}
          <Code>text-foreground-muted</Code>, <Code>border-border</Code>.
          Палитра — именем и номером: <Code>bg-blue-500</Code>,{" "}
          <Code>text-gray-600</Code>. <Code>bg-*</Code>, <Code>text-*</Code>,{" "}
          <Code>border-*</Code>, <Code>fill-*</Code>, <Code>stroke-*</Code> —
          всё работает одинаково.
        </Lead>
        <Example
          title="Токен и палитра"
          note="primary меняется с темой, blue-500 — всегда один и тот же цвет."
          code={`<div class="p-20 br-lg bg-primary text-primary-foreground">bg-primary</div>
<div class="p-20 br-lg bg-blue-500 text-white">bg-blue-500</div>`}
        >
          <div className="flex flex-wrap gap-12">
            <span className="p-20 br-lg bg-primary text-primary-foreground font-13 font-w-600">
              bg-primary
            </span>
            <span className="p-20 br-lg bg-blue-500 text-white font-13 font-w-600">
              bg-blue-500
            </span>
          </div>
        </Example>
      </section>

      <section className="flex flex-col gap-16">
        <Heading id="alpha">Прозрачность /N</Heading>
        <Lead>
          Прозрачность цвета — только через слэш: <Code>bg-primary/50</Code> —
          половина, <Code>bg-blue-500/[0.15]</Code> — своя доля. Целый элемент —
          классом <Code>opacity-N</Code>.
        </Lead>
        <Example
          title="Половина и совсем прозрачный"
          note="/50 — 50 %, /[0.15] — 15 %."
          code={`<div class="p-20 br-lg bg-primary/50">bg-primary/50</div>
<div class="p-20 br-lg bg-blue-500/[0.15]">bg-blue-500/[0.15]</div>`}
        >
          <div className="flex flex-wrap gap-12">
            <span className="p-20 br-lg bg-primary/50 font-13 font-w-600">
              bg-primary/50
            </span>
            <span className="p-20 br-lg bg-blue-500/[0.15] font-13 font-w-600">
              bg-blue-500/[0.15]
            </span>
          </div>
        </Example>
      </section>

      <section className="flex flex-col gap-16">
        <Heading id="arbitrary">Свои значения […]</Heading>
        <Lead>
          Нет готового значения — возьмите своё в квадратных скобках:{" "}
          <Code>w-[calc(100%-20px)]</Code>, <Code>bg-[#0d5ef5]</Code>. Пробелы —
          через подчёркивание. Подробнее — на странице{" "}
          <Link
            href="/docs/code/arbitrary"
            className="text-secondary underline underline-offset-3"
          >
            «Свои значения»
          </Link>
          .
        </Lead>
      </section>

      <section className="flex flex-col gap-16">
        <Heading id="whole">Класс — строкой целиком</Heading>
        <Lead>
          Движок читает исходники как текст и видит только классы, написанные
          целиком. <Code>{`bg-\${color}`}</Code> он не соберёт.
        </Lead>
        <Example
          title="Полные строки"
          note={`Тернарник с полными строками работает: "bg-primary" и "bg-surface". Переключите — фон сменится.`}
          code={`<button class={active ? "bg-primary" : "bg-surface"}>
  Кнопка
</button>`}
        >
          <ActiveToggle />
        </Example>
        <Callout>
          Класс собирается из кусочков в рантайме — добавьте его в{" "}
          <Code>safelist</Code> в <Code>rendit.config.mjs</Code>. Проверить
          любой класс: <Code>node rendit-code/cli.mjs check p-20</Code>.
        </Callout>
      </section>

      <section className="flex flex-col gap-14">
        <Heading id="try">Попробовать класс</Heading>
        <Lead>
          Наберите классы и соберите свой CSS в браузере — конструктор на
          странице{" "}
          <Link
            href="/docs/css"
            className="text-secondary underline underline-offset-3"
          >
            «Готовый CSS»
          </Link>
          .
        </Lead>
        <CodeBlock
          file="пример разметки"
          code={`<button class="px-20 py-10 br-full bg-primary text-primary-foreground font-w-600
  hover:bg-primary-hover active:scale-95">
  Кнопка
</button>`}
        />
      </section>
    </>
  );
}
