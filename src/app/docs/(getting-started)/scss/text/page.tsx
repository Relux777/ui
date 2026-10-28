// Текст: конструктор сверху, затем шкала размеров, начертание, высота строки, интервал, регистр, цвета текста,
// обрезка и перенос, адаптивный размер, моноширинный шрифт и размер текста на сайте (--text-scale).
// Все примеры — классы RenDit Code, написанные строками целиком.

import type { Metadata } from "next";
import {
  Code,
  DocHeader,
  Example,
  Heading,
  Lead,
} from "../../../../_docs/docs";
import { Toc, type TocItem } from "../../../../_docs/toc";
import { TextBuilder } from "./_builder";

export const metadata: Metadata = { title: "Текст" };

const TOC: TocItem[] = [
  { id: "builder", title: "Конструктор" },
  { id: "scale", title: "Шкала размеров" },
  { id: "weight", title: "Начертание" },
  { id: "leading", title: "Высота строки" },
  { id: "letter", title: "Интервал" },
  { id: "color", title: "Цвет текста" },
  { id: "wrap", title: "Обрезка и перенос" },
  { id: "responsive", title: "Под экран" },
  { id: "mono", title: "Код и цифры" },
  { id: "scale-site", title: "Размер текста на сайте" },
];

const SCALE = [
  [
    "font-56",
    "Заголовок страницы",
    "font-56 font-w-700 -letter-s-3 leading-1.05",
  ],
  ["font-40", "Крупный заголовок", "font-40 font-w-700 -letter-s-3"],
  ["font-28", "Заголовок раздела", "font-28 font-w-700 -letter-s-2"],
  ["font-20", "Подзаголовок", "font-20 font-w-600 -letter-s-1"],
  ["font-17", "Вводный абзац", "font-17 text-foreground-muted"],
  ["font-15", "Обычный текст", "font-15"],
  ["font-13", "Мелкий текст, подписи", "font-13 text-foreground-muted"],
  ["font-11", "Метки и бейджи", "font-11 font-w-700 uppercase letter-s-6"],
];

export default function TextPage() {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={["RenDit SCSS", "Текст"]}
          title="Текст"
          lead={
            <>
              Размер — <Code>font-N</Code> в пикселях, высота строки — через
              дробь <Code>font-16/24</Code>, начертание — <Code>font-w-N</Code>,
              интервал — <Code>letter-s-N</Code> в сотых долях em. Соберите
              стиль в конструкторе или возьмите готовый ниже.
            </>
          }
        />

        <section className="relative z-1 flex flex-col gap-16">
          <Heading id="builder">Конструктор</Heading>
          <Lead>
            Двигайте ползунки и выбирайте — пример и классы меняются сразу.
            Готовые наборы — для заголовка, абзаца и подписи.
          </Lead>
          <TextBuilder />
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="scale">Шкала размеров</Heading>
          <Lead>
            Любое число работает, но на сайте удобнее держать несколько размеров
            — так текст выглядит собранно.
          </Lead>
          <div className="flex flex-col br-xl border bg-surface shadow-1 overflow-hidden">
            {SCALE.map(([size, title, cls]) => (
              <div
                key={size}
                className="grid sm:grid-cols-[180px_minmax(0,1fr)] items-baseline gap-x-20 gap-y-4 px-16 sm:px-20 py-14 border-t first:border-t-0"
              >
                <code className="font-12 font-mono text-foreground-muted">
                  {cls}
                </code>
                <span className={`min-w-0 truncate ${cls}`}>{title}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="weight">Начертание</Heading>
          <Lead>
            Шрифт сайта — Google Sans с осью толщины 400…700: подойдёт любое
            число в этих пределах.
          </Lead>
          <Example
            title="font-w-400 … font-w-700"
            code={`<p class="font-w-400">  <p class="font-w-500">  <p class="font-w-600">  <p class="font-w-700">`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 font-24">
              <span className="font-w-400">Обычный</span>
              <span className="font-w-500">Средний</span>
              <span className="font-w-600">Полужирный</span>
              <span className="font-w-700">Жирный</span>
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="leading">Высота строки</Heading>
          <Lead>
            Заголовкам — плотнее, абзацам — свободнее: глазу легче переходить на
            следующую строку. <Code>font-16/24</Code> — размер и высота строки
            сразу.
          </Lead>
          <Example
            title="Плотно, обычно, свободно"
            code={`<p class="font-16/18">  <p class="font-16/24">  <p class="font-16/30">`}
          >
            <div className="grid sm:grid-cols-3 gap-16">
              {[
                ["font-16/18", "16/18 — плотно"],
                ["font-16/24", "16/24 — обычно"],
                ["font-16/30", "16/30 — свободно"],
              ].map(([cls, title]) => (
                <div key={cls} className="flex flex-col gap-6">
                  <span className="font-12 font-w-600 text-foreground-muted">
                    {title}
                  </span>
                  <p className={`p-12 br-md bg-surface-muted ${cls}`}>
                    Длинный абзац переносится на несколько строк, и расстояние
                    между ними меняет то, как легко его читать.
                  </p>
                </div>
              ))}
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="letter">Интервал и регистр</Heading>
          <Lead>
            Крупным заголовкам — чуть сжать (<Code>-letter-s-3</Code>), мелким
            подписям заглавными — разрядить (<Code>letter-s-6</Code>).
          </Lead>
          <Example
            title="Интервал"
            code={`<h2 class="font-40 font-w-700 -letter-s-3">
<span class="font-12 font-w-700 uppercase letter-s-6">`}
          >
            <div className="flex flex-col gap-12">
              <span className="font-40 font-w-700 -letter-s-3">
                Сжато −0.03em
              </span>
              <span className="font-40 font-w-700">Без интервала</span>
              <span className="font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
                Подпись заглавными +0.06em
              </span>
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="color">Цвет текста</Heading>
          <Lead>
            Три ступени серого — для важности, плюс акцент и статусы. Цвета
            меняются вместе с темой.
          </Lead>
          <Example
            title="Ступени и акценты"
            code={`<p class="text-foreground">  <p class="text-foreground-muted">  <p class="text-foreground-subtle">
<a class="text-secondary">  <span class="text-success">  <span class="text-danger">`}
          >
            <div className="grid sm:grid-cols-2 gap-8 font-16">
              <span className="text-foreground">foreground — основной</span>
              <span className="text-foreground-muted">
                foreground-muted — второстепенный
              </span>
              <span className="text-foreground-subtle">
                foreground-subtle — подписи
              </span>
              <span className="text-secondary">secondary — ссылки</span>
              <span className="text-success">success — готово</span>
              <span className="text-danger">danger — ошибка</span>
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="wrap">Обрезка и перенос</Heading>
          <Lead>
            Длинное название в узкой карточке — <Code>truncate</Code>, описание
            в две строки — <Code>line-clamp-2</Code>, заголовок без «висячего»
            слова — <Code>text-balance</Code>.
          </Lead>
          <Example
            title="truncate, line-clamp-2, text-balance"
            code={`<p class="truncate">  <p class="line-clamp-2">  <h2 class="text-balance">`}
          >
            <div className="grid sm:grid-cols-3 gap-12 font-14">
              <p className="truncate p-12 br-md bg-surface-muted">
                truncate: очень длинная строка, которая не влезает в блок
              </p>
              <p className="line-clamp-2 p-12 br-md bg-surface-muted">
                line-clamp-2: текст обрезается на второй строке, а всё, что
                ниже, скрывается многоточием в конце.
              </p>
              <p className="text-balance p-12 br-md bg-surface-muted font-17 font-w-600">
                text-balance: строки заголовка одной длины
              </p>
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="responsive">Под экран</Heading>
          <Lead>
            На телефоне заголовок меньше, с 770px — крупнее: брейкпоинт
            префиксом. Поменяйте ширину окна — заголовок ниже подстроится.
          </Lead>
          <Example
            title="font-28 md:font-48"
            code={`<h1 class="font-28 md:font-48 font-w-700 -letter-s-3">`}
          >
            <span className="font-28 md:font-48 font-w-700 -letter-s-3">
              Растёт с экраном
            </span>
          </Example>
        </section>

        <section className="flex flex-col gap-16">
          <Heading id="mono">Код и цифры</Heading>
          <Lead>
            <Code>font-mono</Code> — для кода, <Code>tabular-nums</Code> — цифры
            одной ширины: числа в таблицах и счётчиках не «прыгают».
          </Lead>
          <Example
            title="font-mono, tabular-nums"
            code={`<code class="font-mono">  <span class="tabular-nums">`}
          >
            <div className="flex flex-col gap-8 font-16">
              <code className="font-mono">npm run dev</code>
              <span className="tabular-nums">1 111 · 8 888 · 0 000</span>
            </div>
          </Example>
        </section>

        <section className="flex flex-col gap-14">
          <Heading id="scale-site">Размер текста на сайте</Heading>
          <Lead>
            Человек выбирает размер шрифта в быстром меню у нижнего меню — все{" "}
            <Code>font-N</Code> умножаются на <Code>--text-scale</Code>. Свои
            значения (<Code>text-[18px]</Code>) не масштабируются — для
            подписей, которые должны остаться прежними.
          </Lead>
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
