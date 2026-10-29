// Готовый CSS — для HTML без сборки: CSS-конструктор сверху (части + свои классы, движок собирает их в браузере),
// какие части есть и сколько весят, как подключить, когда вместо готового CSS лучше движок.
// Части и их классы — dist/modules/manifest.json (npm run dist), движок для браузера — browserEngine().

import Link from "next/link";
import { cdnCss, cdnModule, VERSION } from "@/config/release";
import { browserEngine, cssModules } from "../../../_docs/class-css";
import { ClassPage, classPageMetadata, Part } from "../../../_docs/class-page";
import { Callout, Code, CodeBlock, Table } from "../../../_docs/docs";
import type { TocItem } from "../../../_docs/toc";
import { CssBuilder } from "./_builder";

const HREF = "/docs/css";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "CSS-конструктор" },
  { id: "parts", title: "Части" },
  { id: "connect", title: "Как подключить" },
  { id: "custom", title: "Свои значения" },
  { id: "engine", title: "Когда нужен движок" },
];

const kb = (n: number) => `${Math.max(1, Math.round(n / 1024))} КБ`;

export default async function CssPage() {
  const [{ full, modules }, engine] = await Promise.all([
    cssModules(),
    browserEngine(),
  ]);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          Для сайта на HTML без сборки: готовый CSS целиком ({kb(full.minBytes)}{" "}
          сжатый) или по частям — подключите только нужные. Нужны значения,
          которых в готовом CSS нет (<Code>w-100</Code>,{" "}
          <Code>bg-[#ffcc00]</Code>)? Впишите их в конструкторе — движок соберёт
          их в свой маленький файл прямо в браузере.
        </>
      }
    >
      <Part
        id="builder"
        title="CSS-конструктор"
        lead="Отметьте части, впишите свои классы и заберите строки подключения и свой файл."
        className="relative z-1"
      >
        <CssBuilder modules={modules} engine={engine} fullBytes={full} />
      </Part>

      <Part
        id="parts"
        title="Части"
        lead={
          <>
            Основа нужна всегда: в ней токены, сброс и база. Остальные части
            независимы — подключайте в любом наборе: одно свойство CSS живёт
            только в одной части, поэтому части не спорят друг с другом.
          </>
        }
      >
        <Table
          head={["Часть", "Что внутри", "Обычный", "Сжатый"]}
          rows={modules.map((m) => [
            <span key="t" className="flex flex-col">
              <span className="font-w-600 text-foreground">{m.title}</span>
              <code className="font-12 text-foreground-muted">
                {m.file}.css
              </code>
            </span>,
            m.classes.length
              ? `${m.text} · ${m.classes.length} классов`
              : m.text,
            kb(m.bytes),
            kb(m.minBytes),
          ])}
        />
      </Part>

      <Part
        id="connect"
        title="Как подключить"
        lead={
          <>
            Основа — первой, части — после неё, свои классы — последними.
            Готовый CSS целиком — одна строка: <Code>rendit-ui.min.css</Code>.
          </>
        }
      >
        <CodeBlock
          file="index.html"
          code={`<!-- целиком -->
<link rel="stylesheet" href="${cdnCss()}">

<!-- или по частям: основа и нужные части -->
<link rel="stylesheet" href="${cdnModule("rendit-core")}">
<link rel="stylesheet" href="${cdnModule("rendit-layout")}">
<link rel="stylesheet" href="${cdnModule("rendit-spacing")}">
<link rel="stylesheet" href="css/rendit-custom.min.css">`}
        />
        <Callout>
          Части выходят с версией {VERSION} и новее: ссылки с CDN начинают
          работать, когда версия опубликована. Архив версии (
          <Link
            href="/docs/install"
            className="font-w-600 text-secondary hover:underline"
          >
            «Установка»
          </Link>
          ) содержит все части в папке <Code>dist/modules</Code>.
        </Callout>
      </Part>

      <Part
        id="custom"
        title="Свои значения"
        lead={
          <>
            В готовом CSS — частые значения шкалы: отступы 0…120, ширины до 480,
            все цвета. Любое другое число, своё значение в скобках, брейкпоинт
            или состояние — впишите в конструктор. Под каждым конструктором на
            страницах классов для HTML есть подсказка, каких классов нет в
            готовом CSS, и ссылка, которая сразу вписывает их сюда.
          </>
        }
      >
        <CodeBlock
          code={`<!-- нужно w-100 и md:p-30: впишите их в конструктор → файл rendit-custom.min.css -->
<div class="w-100 md:p-30 bg-surface br-lg">…</div>`}
        />
      </Part>

      <Part
        id="engine"
        title="Когда нужен движок"
        lead={
          <>
            Если в проекте есть Node.js (Next.js, React, Vite или просто{" "}
            <Code>npm</Code>), готовый CSS не нужен: движок RenDit Code сам
            находит классы в коде и пишет CSS только для них — любые значения,
            без конструктора. Как подключить —{" "}
            <Link
              href="/docs/install"
              className="font-w-600 text-secondary hover:underline"
            >
              «Установка и настройка»
            </Link>
            .
          </>
        }
      />
    </ClassPage>
  );
}
