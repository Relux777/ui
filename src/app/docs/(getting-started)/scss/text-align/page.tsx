// Выравнивание текста: конструктор сверху, таблица «класс → CSS» от движка, затем примеры — заголовок по центру
// без «лесенки» (text-balance), абзац без висячего слова (text-pretty), цены по правому краю, по центру только
// на телефоне.

import { classCss } from "../../../../_docs/class-css";
import {
  ClassPage,
  classPageMetadata,
  Part,
} from "../../../../_docs/class-page";
import { ClassTable } from "../../../../_docs/class-table";
import { Code, Example } from "../../../../_docs/docs";
import type { TocItem } from "../../../../_docs/toc";
import { TextAlignBuilder } from "./_builder";
import { TEXT_ALIGN_CLASSES } from "./_classes";

const HREF = "/docs/scss/text-align";

export const metadata = classPageMetadata(HREF);

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "classes", title: "Все классы" },
  { id: "balance", title: "Ровный заголовок" },
  { id: "pretty", title: "Абзац без висячего слова" },
  { id: "numbers", title: "Числа по правому краю" },
  { id: "responsive", title: "По центру на телефоне" },
];

export default async function TextAlignPage() {
  const css = await classCss(TEXT_ALIGN_CLASSES);
  return (
    <ClassPage
      href={HREF}
      toc={TOC}
      lead={
        <>
          <Code>text-center</Code>, <Code>text-right</Code> — где стоят строки,{" "}
          <Code>text-balance</Code> — заголовок без «лесенки»,{" "}
          <Code>text-pretty</Code> — абзац без одного слова в последней строке.
        </>
      }
    >
      <Part
        id="builder"
        title="Конструктор"
        lead="Выберите выравнивание и перенос строк и сужайте блок — заголовок переносится, и разница между balance, pretty и обычным переносом видна сразу."
        className="relative z-1"
      >
        <TextAlignBuilder css={css} />
      </Part>

      <Part id="classes" title="Все классы">
        <ClassTable
          rows={[
            ["text-left", "по левому краю"],
            ["text-center", "по центру"],
            ["text-right", "по правому краю"],
            ["text-justify", "по ширине — только для длинных колонок"],
            ["text-start", "по началу строки (лево или право по языку)"],
            ["text-end", "по концу строки"],
            ["text-balance", "строки почти одной длины — для заголовков"],
            ["text-pretty", "без короткого слова в последней строке"],
            ["text-wrap", "обычный перенос"],
            ["text-nowrap", "в одну строку"],
          ]}
        />
      </Part>

      <Part
        id="balance"
        title="Ровный заголовок"
        lead={
          <>
            Заголовок по центру в 2–3 строки часто выходит «лесенкой»: длинная
            строка и одно слово под ней. <Code>text-balance</Code> делает строки
            почти равными.
          </>
        }
      >
        <Example
          title="text-center и text-center text-balance"
          code={`<h2 class="text-center text-balance">…</h2>`}
        >
          <div className="grid sm:grid-cols-2 gap-12">
            {["text-center", "text-center text-balance"].map((cls) => (
              <div
                key={cls}
                className="flex flex-col gap-6 p-12 br-lg border bg-surface"
              >
                <code className="font-11 text-foreground-muted">{cls}</code>
                <h3 className={`${cls} font-20 font-w-700 leading-1.2`}>
                  Классы, токены и компоненты для быстрых сайтов
                </h3>
              </div>
            ))}
          </div>
        </Example>
      </Part>

      <Part
        id="pretty"
        title="Абзац без висячего слова"
        lead={
          <>
            <Code>text-pretty</Code> переносит строки абзаца так, чтобы в
            последней не оставалось одно короткое слово. Абзацам — pretty,
            заголовкам — balance.
          </>
        }
      >
        <Example title="text-pretty" code={`<p class="text-pretty">…</p>`}>
          <p className="text-pretty max-w-420 font-14 text-foreground-muted">
            RenDit UI собирает CSS только из тех классов, что есть в коде, —
            файл стилей остаётся маленьким, а страница загружается быстро.
          </p>
        </Example>
      </Part>

      <Part
        id="numbers"
        title="Числа по правому краю"
        lead={
          <>
            Суммы и цены в таблице — <Code>text-right tabular-nums</Code>:
            разряды встают друг под другом, и числа легко сравнить.
          </>
        }
      >
        <Example
          title="text-right tabular-nums"
          code={`<td class="text-right tabular-nums">1 290 ₽</td>`}
        >
          <table className="w-full max-w-320 font-14 [border-collapse:collapse]">
            <tbody>
              {[
                ["Кофе", "290 ₽"],
                ["Завтрак", "1 290 ₽"],
                ["Итого", "1 580 ₽"],
              ].map(([name, sum]) => (
                <tr key={name} className="border-b last:border-b-0">
                  <td className="py-6">{name}</td>
                  <td className="py-6 text-right tabular-nums font-w-600">
                    {sum}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Example>
      </Part>

      <Part
        id="responsive"
        title="По центру на телефоне"
        lead={
          <>
            Первый экран: на телефоне всё по центру, с 770px — по левому краю:{" "}
            <Code>text-center md:text-left</Code>. Поменяйте ширину окна.
          </>
        }
      >
        <Example
          title="text-center md:text-left"
          code={`<section class="text-center md:text-left">`}
        >
          <section className="text-center md:text-left flex flex-col gap-6">
            <h3 className="font-22 font-w-700">Справка RenDit UI</h3>
            <p className="font-14 text-foreground-muted">
              Классы, конструкторы и примеры.
            </p>
          </section>
        </Example>
      </Part>
    </ClassPage>
  );
}
