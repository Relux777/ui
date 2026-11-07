// Тени shadow-1…12: высота «подъёма», стекло и мягкие тени из ReluxCode. Свои — в settings/_shadows.scss.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, CodeBlock, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { ShadowBuilder } from "./_builder";
import { BODY_CLASSES, SHADOW_CLASSES, TABLE_CLASSES } from "./_classes";

const HREF = "/docs/scss/shadows";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "height", title: "Высота" },
  { id: "glass", title: "Стекло" },
  { id: "own", title: "Свои тени" },
];

export default async function ShadowsPage() {
  const css = await classCss([...SHADOW_CLASSES, ...BODY_CLASSES]);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>shadow-1…6</Code> — высота: чем выше элемент над страницей, тем
          больше номер. <Code>shadow-7</Code> и <Code>shadow-9</Code> — стекло,{" "}
          <Code>shadow-8</Code>, <Code>shadow-10…12</Code> — мягкие тени из
          ReluxCode. В тёмной теме тени темнее и заметнее.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите тень, элемент и тему — превью и CSS внизу. «Система» — как на сайте."
        className="relative z-1"
      >
        <ShadowBuilder css={css} />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Тень — токен <Code>--shadow-ИМЯ</Code>, класс{" "}
            <Code>shadow-ИМЯ</Code>. Работают варианты:{" "}
            <Code>hover:shadow-4</Code>, <Code>dark:shadow-none</Code>.
          </>
        }
      >
        <ClassTable rows={TABLE_CLASSES} />
      </Part>

      <Part id="height" title="Высота">
        <Example
          title="Подъём карточки"
          note="Чем выше элемент, тем больше номер — от полей до модалок."
          code={`<div class="p-20 br-xl border bg-surface shadow-1">…</div>
<div class="p-20 br-xl border bg-surface shadow-4">…</div>
<div class="p-20 br-xl border bg-surface shadow-6">…</div>`}
        >
          <div className="flex flex-wrap gap-16">
            {["shadow-1", "shadow-4", "shadow-6"].map((s) => (
              <div key={s} className={`p-20 br-xl border bg-surface ${s}`}>
                <code className="font-13 font-mono">{s}</code>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part id="glass" title="Стекло">
        <Example
          title="Кромка и стекло маленьких элементов"
          note="shadow-7 — светлая кромка плавающей панели, shadow-9 — стекло кнопок."
          code={`<div class="p-20 br-xl bg-surface shadow-7">…</div>
<button class="size-40 br-full bg-surface shadow-9">…</button>`}
        >
          <div className="flex flex-wrap items-center gap-16">
            <div className="p-20 br-xl bg-surface shadow-7">
              <code className="font-13 font-mono">shadow-7</code>
            </div>
            <div className="size-40 br-full bg-surface shadow-9 grid place-items-center">
              <code className="font-11 font-mono">9</code>
            </div>
          </div>
        </Example>
      </Part>

      <Part id="own" title="Свои тени">
        <CodeBlock
          file="src/assets/scss/settings/_shadows.scss"
          code={`@layer theme {
  :root, [data-theme='light'] {
    --shadow-card: 0 2px 8px rgb(0 0 0 / 0.08);  /* → shadow-card */
  }
  [data-theme='dark'] {
    --shadow-card: 0 2px 8px rgb(0 0 0 / 0.6);
  }
}`}
        />
      </Part>
    </ClassPage>
  );
}
