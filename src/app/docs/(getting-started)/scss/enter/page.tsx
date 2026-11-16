// Появление без JavaScript: конструктор @starting-style, как это работает, .reveal при прокрутке,
// окна и списки.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { Callout, Code, CodeBlock, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { EnterBuilder } from "./_builder";
import { ENTER_CLASSES } from "./_classes";

const HREF = "/docs/scss/enter";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "how", title: "Как это работает" },
  { id: "reveal", title: "Появление при прокрутке" },
  { id: "dialogs", title: "Окна и списки" },
  { id: "reduce", title: "Без движения" },
];

export default async function EnterPage() {
  const css = await classCss(ENTER_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>[@starting-style]:opacity-0</Code> задаёт, с чего элемент
          начинает появляться. Переходом он доходит до обычного состояния — без
          JavaScript и без анимаций <Code>@keyframes</Code>.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите эффект и длительность, нажмите «Показать» — блок появляется заново, и стартовый стиль срабатывает каждый раз."
        className="relative z-1"
      >
        <EnterBuilder css={css} />
      </Part>

      <Part
        id="how"
        title="Как это работает"
        lead={
          <>
            Браузер применяет <Code>@starting-style</Code> в первый кадр после
            появления элемента. Дальше действует переход к обычным значениям.
          </>
        }
      >
        <CodeBlock
          lang="css"
          code={`/* с чего начать */
@starting-style {
  .panel { opacity: 0; translate: 0 20px; }
}

/* куда прийти */
.panel {
  opacity: 1;
  translate: 0 0;
  transition: opacity 300ms, translate 300ms;
}`}
        />
        <Callout tone="tip">
          В RenDit Code это классы: <Code>transition</Code>,{" "}
          <Code>duration-300</Code>, <Code>ease-spring</Code> и{" "}
          <Code>[@starting-style]:opacity-0</Code>. Вариант ставится перед любым
          классом так же, как <Code>hover:</Code>.
        </Callout>
      </Part>

      <Part
        id="reveal"
        title="Появление при прокрутке"
        lead={
          <>
            <Code>.reveal</Code> из RenDit SCSS проявляет блок, когда он
            въезжает в экран. Анимация привязана к прокрутке — без JavaScript,
            только прозрачность, поэтому якоря не сбиваются.
          </>
        }
      >
        <Example
          title=".reveal"
          code={`<div className="reveal">Блок появляется при прокрутке</div>`}
        >
          <div className="flex flex-col gap-16">
            <div className="grid place-items-center h-160 br-lg border border-dashed font-12 text-foreground-subtle">
              Прокрутите вниз
            </div>
            <div className="reveal grid place-items-center h-160 br-lg bg-secondary/12 font-14 font-w-600 text-secondary">
              Этот блок проявился
            </div>
          </div>
        </Example>
      </Part>

      <Part id="dialogs" title="Окна и списки">
        <Callout>
          Для появления и исчезновения окна на <Code>&lt;dialog&gt;</Code>{" "}
          одного стартового стиля мало: нужен ещё{" "}
          <Code>transition-behavior: allow-discrete</Code> и{" "}
          <Code>overlay</Code>. В RenDit SCSS это уже сделано в{" "}
          <Code>.sheet</Code> — берите его, а не собирайте заново.
        </Callout>
      </Part>

      <Part id="reduce" title="Без движения">
        <Callout tone="warning">
          Всё, что движется, — с <Code>motion-reduce:transition-none</Code>:
          уважайте настройку «уменьшение движения».
        </Callout>
      </Part>
    </ClassPage>
  );
}
