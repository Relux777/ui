// Курсор: конструктор, таблица классов и живые примеры — кнопка, запрет, текст, перетаскивание.

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

const HREF = "/docs/scss/cursor";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "button", title: "Кнопка и ссылка" },
  { id: "ban", title: "Запрет" },
  { id: "text", title: "Текст" },
];

const OPTIONS = [
  "cursor-auto",
  "cursor-default",
  "cursor-pointer",
  "cursor-text",
  "cursor-move",
  "cursor-help",
  "cursor-not-allowed",
  "cursor-none",
  "cursor-grab",
  "cursor-grabbing",
  "cursor-zoom-in",
];

const GROUPS: LabGroup[] = [{ label: "Курсор", options: OPTIONS }];

export default async function CursorPage() {
  const css = await classCss(OPTIONS);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>cursor-pointer</Code> — рука, <Code>cursor-text</Code> — ввод
          текста, <Code>cursor-not-allowed</Code> — запрет,{" "}
          <Code>cursor-grab</Code> — перетаскивание. На телефоне курсора нет —
          состояние должно читаться и без него.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите курсор и наведите на блок — он появится по-настоящему."
        className="relative z-1"
      >
        <ClassLab css={css} groups={GROUPS} preview="cursor" />
      </Part>

      <Part
        id="classes"
        title="Все классы"
        lead={
          <>
            Имя после <Code>cursor-</Code> — как в CSS. Набор ограничен частыми
            значениями; своё — <Code>cursor-[url(…),_auto]</Code>.
          </>
        }
      >
        <ClassTable
          rows={[
            ["cursor-auto", "как решит браузер"],
            ["cursor-default", "обычная стрелка"],
            ["cursor-pointer", "рука — ссылка и кнопка"],
            ["cursor-text", "текстовый ввод"],
            ["cursor-move", "перемещение"],
            ["cursor-help", "вопрос"],
            ["cursor-not-allowed", "запрет"],
            ["cursor-none", "курсор скрыт"],
            ["cursor-grab", "можно взять"],
            ["cursor-grabbing", "взяли"],
            ["cursor-zoom-in", "увеличить"],
          ]}
        />
      </Part>

      <Part
        id="button"
        title="Кнопка и ссылка"
        lead={
          <>
            У ссылки рука уже по умолчанию. У кнопки — нет: если нажимается блок
            целиком, добавьте <Code>cursor-pointer</Code>.
          </>
        }
      >
        <Example
          title="cursor-pointer на карточке"
          code={`<button className="cursor-pointer">Открыть</button>`}
        >
          <button
            type="button"
            className="px-20 py-10 br-lg border bg-surface cursor-pointer font-13 font-w-600 transition-colors hover:bg-surface-muted"
          >
            Нажмите на карточку
          </button>
        </Example>
      </Part>

      <Part
        id="ban"
        title="Запрет"
        lead={
          <>
            <Code>cursor-not-allowed</Code> — подсказка «нельзя». Обязательно
            вместе с <Code>disabled</Code> и <Code>opacity-50</Code>, иначе
            запрет виден только по курсору.
          </>
        }
      >
        <Example
          title="disabled:cursor-not-allowed"
          code={`<button disabled className="disabled:cursor-not-allowed disabled:opacity-50">
  Недоступно
</button>`}
        >
          <button
            type="button"
            disabled
            className="px-20 py-10 br-full bg-primary text-primary-foreground font-13 font-w-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Недоступно
          </button>
        </Example>
      </Part>

      <Part
        id="text"
        title="Текст"
        lead={
          <>
            <Code>cursor-text</Code> на абзаце говорит, что текст можно
            выделить. Обратное — <Code>cursor-default</Code> у подписи, которую
            выделять незачем.
          </>
        }
      >
        <Example
          title="cursor-text"
          code={`<p className="cursor-text">Этот текст можно выделить</p>`}
        >
          <p className="cursor-text max-w-360 font-13 text-foreground-muted">
            Наведите и попробуйте выделить — курсор станет текстовым.
          </p>
        </Example>
        <Callout>
          Скрывать курсор (<Code>cursor-none</Code>) стоит только вместе со
          своим видимым указателем — иначе мышью нельзя пользоваться.
        </Callout>
      </Part>
    </ClassPage>
  );
}
