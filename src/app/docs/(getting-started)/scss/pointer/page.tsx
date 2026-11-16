// Касание и выделение: конструктор pointer-events, select- и touch-, таблица классов, клик насквозь,
// выделение и жесты на телефоне.

import { classCss } from "../../../../_docs/class-css";
import type { LabGroup } from "../../../../_docs/class-lab";
import { ClassLab } from "../../../../_docs/class-lab";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Callout, Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";

const HREF = "/docs/scss/pointer";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "through", title: "Клик насквозь" },
  { id: "select", title: "Выделение" },
  { id: "touch", title: "Жесты" },
];

const POINTER = ["", "pointer-events-none", "pointer-events-auto"];
const SELECT = ["select-text", "select-none", "select-all"];
const TOUCH = [
  "touch-auto",
  "touch-none",
  "touch-manipulation",
  "touch-pan-x",
  "touch-pan-y",
];

const GROUPS: LabGroup[] = [
  { label: "Клики", options: POINTER },
  { label: "Выделение", options: SELECT },
  { label: "Жесты", options: TOUCH },
];

const LAB_CLASSES = [...POINTER, ...SELECT, ...TOUCH].filter(Boolean);

export default async function PointerPage() {
  const css = await classCss(LAB_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>pointer-events-none</Code> — клики проходят насквозь,{" "}
          <Code>select-none</Code> — текст не выделяется,{" "}
          <Code>touch-pan-y</Code> — жест листает по вертикали. Всё это про то,
          как палец и мышь работают с элементом.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Попробуйте нажать ссылку и выделить текст в превью — выбранные классы действуют по-настоящему."
        className="relative z-1"
      >
        <ClassLab css={css} groups={GROUPS} preview="card" />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["pointer-events-none", "клики и наведение проходят сквозь"],
            ["pointer-events-auto", "вернуть клики"],
            ["select-none", "текст не выделяется"],
            ["select-text", "обычное выделение текста"],
            ["select-all", "клик выделяет всё"],
            ["touch-auto", "жесты браузера"],
            ["touch-none", "браузер не трогает жесты"],
            ["touch-manipulation", "без задержки двойного тапа"],
            ["touch-pan-x", "только горизонтальная прокрутка"],
            ["touch-pan-y", "только вертикальная"],
          ]}
        />
      </Part>

      <Part
        id="through"
        title="Клик насквозь"
        lead={
          <>
            Слой поверх картинки с <Code>pointer-events-none</Code> не мешает
            нажать ссылку под ним. Так делают подписи и градиенты поверх.
          </>
        }
      >
        <Example
          title="pointer-events-none поверх ссылки"
          code={`<div className="relative">
  <a href="#">Ссылка под слоем</a>
  <span className="absolute inset-0 pointer-events-none bg-gradient-brand/20" />
</div>`}
        >
          <div className="relative br-lg border bg-surface p-16">
            <a
              href="#through"
              className="font-14 font-w-600 text-secondary hover:underline"
            >
              Ссылка под слоем — нажмите
            </a>
            <span className="absolute inset-0 pointer-events-none bg-gradient-brand/20" />
          </div>
        </Example>
      </Part>

      <Part
        id="select"
        title="Выделение"
        lead={
          <>
            <Code>select-none</Code> — для кнопок, иконок и подписей, которые
            нельзя выделить. <Code>select-all</Code> — для кода и токенов: клик
            выделяет всё.
          </>
        }
      >
        <Example
          title="select-none и select-all"
          code={`<button className="select-none">Кнопка</button>
<code className="select-all">npm i</code>`}
        >
          <div className="flex flex-wrap items-center gap-12">
            <button
              type="button"
              className="px-16 py-8 br-full bg-surface-muted select-none font-13 font-w-600"
            >
              Кнопка — не выделяется
            </button>
            <code className="px-12 py-8 br-md bg-secondary/10 select-all font-mono font-13 text-secondary">
              npm i rendit-ui
            </code>
          </div>
        </Example>
      </Part>

      <Part id="touch" title="Жесты">
        <Callout>
          На телефоне <Code>touch-none</Code> отдаёт жесты вашему коду — нужно
          для своих слайдеров и рисования. Для обычной прокрутки оставьте{" "}
          <Code>touch-pan-y</Code> или <Code>touch-auto</Code>.
        </Callout>
      </Part>
    </ClassPage>
  );
}
