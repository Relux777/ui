// Прокрутка: конструктор полосы, плавного перехода и отступа цели, таблица классов, тонкая полоса,
// якоря под шапкой и prefers-reduced-motion.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Callout, Code, CodeBlock, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { ScrollBuilder } from "./_builder";
import { SCROLL_CLASSES } from "./_classes";

const HREF = "/docs/scss/scroll";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "bar", title: "Полоса прокрутки" },
  { id: "anchor", title: "Якорь под шапкой" },
  { id: "smooth", title: "Плавно" },
];

const ROWS = Array.from({ length: 12 }, (_, i) => `Строка ${i + 1}`);

export default async function ScrollPage() {
  const css = await classCss(SCROLL_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>scroll-smooth</Code> — плавный переход к якорю,{" "}
          <Code>scroll-mt-80</Code> — отступ цели, чтобы заголовок не прятался
          под липкой шапкой. <Code>scrollbar-thin</Code> и{" "}
          <Code>scrollbar-none</Code> — вид полосы.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Нажмите «К цели»: отступ решает, где остановится заголовок, а scroll-smooth — как туда доедет прокрутка."
        className="relative z-1"
      >
        <ScrollBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["scroll-smooth", "плавная прокрутка"],
            ["scroll-mt-80", "отступ цели сверху 80px"],
            ["scroll-pt-80", "отступ прокрутки у контейнера"],
            ["scrollbar-thin", "тонкая полоса"],
            ["scrollbar-none", "полоса скрыта, прокрутка работает"],
            ["overscroll-contain", "прокрутка не уходит на страницу"],
          ]}
        />
      </Part>

      <Part
        id="bar"
        title="Полоса прокрутки"
        lead={
          <>
            <Code>scrollbar-thin</Code> — узкая полоса,{" "}
            <Code>scrollbar-none</Code> — совсем без неё. Прокрутка колесом и
            пальцем работает в обоих случаях.
          </>
        }
      >
        <Example
          title="scrollbar-thin и scrollbar-none"
          code={`<div className="h-160 overflow-y-auto scrollbar-thin">…</div>
<div className="h-160 overflow-y-auto scrollbar-none">…</div>`}
        >
          <div className="grid sm:grid-cols-2 gap-12">
            {["scrollbar-thin", "scrollbar-none"].map((bar) => (
              <div
                key={bar}
                className={`h-160 overflow-y-auto overscroll-contain br-lg border bg-surface ${bar}`}
              >
                {ROWS.map((row) => (
                  <div
                    key={row}
                    className="px-12 py-8 border-b last:border-b-0 font-12 text-foreground-muted"
                  >
                    {row}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="anchor"
        title="Якорь под шапкой"
        lead={
          <>
            У липкой шапки высота есть, а у якоря отступа нет — заголовок
            окажется под ней. <Code>scroll-mt-80</Code> оставляет место.
          </>
        }
      >
        <CodeBlock
          lang="html"
          code={`<h2 id="section" className="scroll-mt-80">Раздел</h2>
<a href="#section">К разделу</a>`}
        />
        <Callout tone="tip">
          Заголовки этой справки уже с <Code>scroll-mt-80</Code> — поэтому
          «Быстрый переход» не прячет их под шапкой. Свой отступ —{" "}
          <Code>scroll-mt-120</Code>.
        </Callout>
      </Part>

      <Part id="smooth" title="Плавно">
        <Callout tone="warning">
          <Code>scroll-smooth</Code> — движение. Тем, кто просил его убрать,
          переход не нужен: на большом расстоянии он утомляет. Для таких случаев
          не ставьте класс на весь <Code>html</Code>, а включайте его только
          там, где он уместен.
        </Callout>
      </Part>
    </ClassPage>
  );
}
