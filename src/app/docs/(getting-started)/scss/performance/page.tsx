// Производительность: сколько стоит backdrop-filter, и как на слабых устройствах выключить стекло
// скриптом data-weak — с примерами для таблеток шапки и нижнего меню. Статья, не классы.

import type { Metadata } from "next";
import {
  Callout,
  Code,
  CodeBlock,
  DocHeader,
  Heading,
  Lead,
  Table,
} from "../../../../_docs/docs";
import { Toc, type TocItem } from "../../../../_docs/toc";

export const metadata: Metadata = { title: "Производительность" };

const TOC: TocItem[] = [
  { id: "cost", title: "Что дорого" },
  { id: "script", title: "Скрипт data-weak" },
  { id: "layout", title: "Подключение в layout" },
  { id: "classes", title: "Классы на стекле" },
  { id: "thresholds", title: "Пороги" },
  { id: "reduced", title: "iOS и reduced-transparency" },
];

const WEAK = `try{var n=navigator,c=n.connection;var w=!!(c&&c.saveData)||(n.deviceMemory||8)<=2||(n.hardwareConcurrency||8)<=2;if(w)document.documentElement.setAttribute("data-weak","")}catch(e){}`;

export default function PerformancePage() {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["Эффекты", "Производительность"]}
          title="Производительность"
          lead="Стекло и размытие красивы, но на слабых телефонах дороги. Приём data-weak выключает backdrop-filter заранее — скриптом до первого кадра — и заменяет его плотным фоном. Слабые устройства перестают тормозить при прокрутке, остальные ничего не замечают."
        />

        <section className="reveal flex flex-col gap-14">
          <Heading id="cost">Что дорого и почему</Heading>
          <Lead>
            <Code>backdrop-filter</Code> делает элемент «корнем» размытия: пока
            фон под ним меняется — например, при прокрутке — браузер
            пересчитывает размытие на каждом кадре. <Code>blur</Code> +{" "}
            <Code>saturate</Code> у <Code>.liquid-glass</Code> и у таблеток
            шапки на слабом Android (4×A53, 2 ГБ) съедает 3–6 мс кадра — это
            ровно разница между плавными 30 fps и «дёрганым» скроллом. iPhone и
            мощные устройства тянут это без проблем, поэтому стекло им
            оставляем.
          </Lead>
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="script">Скрипт data-weak</Heading>
          <Lead>
            Отдельный файл, как остальные встроенные скрипты. Условие — три
            признака слабого устройства; если хоть один совпал, на{" "}
            <Code>&lt;html&gt;</Code> ставится атрибут <Code>data-weak</Code> до
            первой отрисовки.
          </Lead>
          <CodeBlock
            file="src/config/weak.ts"
            code={`// Слабые устройства: data-weak на <html> до первой отрисовки.
// Когда атрибут стоит, стекло (backdrop-filter) выключается и заменяется плотным фоном.

export const WEAK_SCRIPT = \`${WEAK}\`;`}
          />
          <Callout tone="tip">
            <Code>|| 8</Code> вместо <Code>?? 8</Code>: совсем старые браузеры
            (а именно они слабые) не знают оператора <Code>??</Code> — без него
            скрипт падал бы целиком.
          </Callout>
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="layout">Подключение в layout</Heading>
          <Lead>
            Встраивается в тот же <Code>&lt;script&gt;</Code> в начале{" "}
            <Code>&lt;body&gt;</Code>, где уже стоят скрипт размера текста и
            состояния прокрутки, — до того как страница нарисуется.
          </Lead>
          <CodeBlock
            file="app/layout.tsx"
            code={`import { WEAK_SCRIPT } from "@/config/weak";
// …
<body>
  <script
    // biome-ignore lint/security/noDangerouslySetInnerHtml: свой постоянный скрипт без пользовательских данных
    dangerouslySetInnerHTML={{
      __html: \`\${TEXT_SIZE_SCRIPT};\${SCROLL_SCRIPT};\${WEAK_SCRIPT};\`,
    }}
  />
  …`}
          />
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="classes">Классы на стекле</Heading>
          <Lead>
            На каждом стеклянном элементе — два класса-варианта.{" "}
            <Code>[[data-weak]_&]:</Code> — вариант движка с произвольным
            селектором: срабатывает, когда у предка есть <Code>data-weak</Code>.
            Первый класс выключает фильтр целиком, второй даёт плотный фон
            вместо полупрозрачного.
          </Lead>
          <CodeBlock
            file="таблетка в шапке"
            code={`'[[data-weak]_&]:[backdrop-filter:none]',
'[[data-weak]_&]:bg-background/85',`}
          />
          <CodeBlock
            file="нижнее меню (liquid-glass)"
            code={`className="liquid-glass relative … [[data-weak]_&]:[backdrop-filter:none] [[data-weak]_&]:bg-background/85"`}
          />
          <Callout tone="warning">
            Важно убрать <Code>backdrop-filter</Code> целиком, а не ставить{" "}
            <Code>blur(0)</Code>: нулевой фильтр всё равно делает элемент{" "}
            backdrop-root — браузер продолжит сэмплировать фон на каждом кадре.
            <Code>bg-background/50</Code> + blur визуально ≈{" "}
            <Code>bg-background/80–85</Code> без blur, глаз разницы не заметит.
          </Callout>
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="thresholds">Пороги и настройка</Heading>
          <Lead>
            Три признака слабого устройства. Порог ядер при необходимости
            поднимают до четырёх — это одна цифра в <Code>weak.ts</Code>.
          </Lead>
          <Table
            head={["Признак", "Порог", "Почему"]}
            rows={[
              [
                "n.connection?.saveData",
                "true",
                "включён режим экономии трафика (Chrome на Android)",
              ],
              [
                "n.deviceMemory",
                "≤ 2",
                "2 ГБ памяти и меньше; iPhone значение не отдаёт — считается нормой",
              ],
              [
                "n.hardwareConcurrency",
                "≤ 2",
                "два ядра и меньше; iPhone 13 (6 ядер) в слабые не попадёт",
              ],
            ]}
          />
          <CodeBlock
            file="строже / мягче"
            code={`// мягче — отключать стекло и на четырёх ядрах:
(n.hardwareConcurrency||8)<=4

// строже — только при экономии трафика:
!!(c&&c.saveData)`}
          />
        </section>

        <section className="reveal flex flex-col gap-14">
          <Heading id="reduced">iOS и prefers-reduced-transparency</Heading>
          <Lead>
            iOS не отдаёт <Code>deviceMemory</Code>, но у неё есть системная
            настройка «Уменьшить прозрачность». Миксин{" "}
            <Code>.liquid-glass</Code> её уже учитывает:{" "}
            <Code>@media (prefers-reduced-transparency: reduce)</Code> ставит
            сплошной <Code>--surface</Code> и выключает{" "}
            <Code>backdrop-filter</Code>. <Code>data-weak</Code> дополняет её
            для Android, где такой настройки нет. Вместе они покрывают обе
            платформы.
          </Lead>
          <Callout>
            Скрипт ставит атрибут <Code>data-weak</Code> на{" "}
            <Code>&lt;html&gt;</Code>; варианты пишутся с{" "}
            <Code>[[data-weak]_&]:</Code> — как существующие{" "}
            <Code>data-scrolled</Code> и <Code>data-search</Code> на этом сайте.
            Классы — строками целиком, движок увидит и сгенерирует их сам.
          </Callout>
        </section>
      </div>

      <aside className="max-xl:hidden">
        <div className="sticky top-80">
          <Toc items={TOC} />
        </div>
      </aside>
    </div>
  );
}
