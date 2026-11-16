// Выбор: конструктор, установка (два файла), примеры и свойства.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ChevronDown } from "@boxicons/react/ChevronDown";
import { Code as CodeIcon } from "@boxicons/react/Code";
import { FileCode } from "@boxicons/react/FileCode";
import { FileDetail } from "@boxicons/react/FileDetail";
import { Palette } from "@boxicons/react/Palette";
import { Rocket } from "@boxicons/react/Rocket";
import { Sparkles } from "@boxicons/react/Sparkles";
import { Star } from "@boxicons/react/Star";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  ACCOUNT_ITEMS,
  NAVIGATION_ITEMS,
} from "@/components/ui/Select/content/presets";
import type { SelectItem, SelectOption } from "@/components/ui/Select/options";
import { Tabs } from "@/components/ui/Tabs";
import { Part } from "../../../_docs/class-page";
import {
  Callout,
  Code,
  CodeBlock,
  Example,
  Steps,
  Table,
} from "../../../_docs/docs";
import { DownloadFile } from "../../../_docs/download-file";
import { InstallCommand } from "../../../_docs/install-command";
import type { TocItem } from "../../../_docs/toc";
import { ComponentPage } from "../_page";
import { SelectTabs } from "./_tabs";

export const metadata = { title: "Выбор" };

const TOC: TocItem[] = [
  { id: "install", title: "Установка" },
  { id: "source", title: "Код компонента" },
  { id: "base", title: "Обычный список" },
  { id: "native", title: "Обычный select" },
  { id: "form", title: "В форме" },
  { id: "many", title: "Много пунктов" },
  { id: "presets", title: "Готовые наборы" },
  { id: "style", title: "Стиль и анимация" },
  { id: "search", title: "Поиск" },
  { id: "groups", title: "Группы и иконки" },
  { id: "states", title: "Ошибка и выключение" },
  { id: "phone", title: "Телефон" },
  { id: "props", title: "Свойства" },
];

const SELECT_SRC = readFileSync(
  join(process.cwd(), "src/components/ui/Select/index.tsx"),
  "utf8",
);
const OPTIONS_SRC = readFileSync(
  join(process.cwd(), "src/components/ui/Select/options.ts"),
  "utf8",
);
const NATIVE_SCSS = readFileSync(
  join(process.cwd(), "src/assets/scss/components/_native-select.scss"),
  "utf8",
);

const PAGE_SRC = `import { Select } from "@/components/ui/Select";

const items = [
  { value: "next", label: "Next.js", hint: "App Router" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
];

const field =
  "w-full h-44 px-12 br-lg border bg-surface shadow-1 font-16 text-foreground";

export default function Page() {
  return (
    <Select
      label="Стек"
      items={items}
      defaultValue="next"
      placeholder="Выберите стек"
      triggerClassName={field}
    />
  );
}`;

const SIMPLE: SelectOption[] = [
  {
    value: "next",
    label: "Next.js",
    hint: "App Router",
    icon: <CodeIcon width={16} height={16} />,
  },
  {
    value: "react",
    label: "React",
    hint: "19",
    icon: <Sparkles width={16} height={16} />,
  },
  {
    value: "vue",
    label: "Vue",
    hint: "3.5",
    icon: <Palette width={16} height={16} />,
  },
  { value: "astro", label: "Astro", hint: "острова" },
];

const CITIES: SelectOption[] = [
  { value: "msk", label: "Москва", hint: "склад и офис" },
  { value: "spb", label: "Санкт-Петербург", hint: "склад" },
  { value: "kzn", label: "Казань", hint: "склад" },
  { value: "nsk", label: "Новосибирск", hint: "склад" },
  { value: "ekb", label: "Екатеринбург", hint: "склад" },
];

const MANY: SelectOption[] = Array.from({ length: 20 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `Пункт ${i + 1}`,
  hint: i % 3 === 0 ? "с подсказкой" : undefined,
}));

const GROUPED: SelectItem[] = [
  { label: "Фронтенд", options: SIMPLE.slice(0, 3) },
  {
    label: "Инструменты",
    options: [
      {
        value: "rendit",
        label: "RenDit UI",
        hint: "этот сайт",
        icon: <Star width={16} height={16} />,
      },
      {
        value: "boxicons",
        label: "Boxicons",
        hint: "иконки",
        icon: <Rocket width={16} height={16} />,
      },
      { value: "soon", label: "Скоро", hint: "недоступно", disabled: true },
    ],
  },
];

export default function SelectPage() {
  return (
    <ComponentPage
      title="Выбор"
      toc={TOC}
      tabs={<SelectTabs active="select" />}
      lead={
        <>
          Свой список вместо системного: поиск, иконки, группы и подсказки.
          Клавиатура как у настоящего listbox — стрелки, Enter и Esc. Список
          живёт в портале и не обрезается карточкой.
        </>
      }
    >
      <Part
        id="install"
        title="Установка"
        lead={
          <>
            Два файла, иконки и один импорт. Оформление — классами RenDit Code в{" "}
            <Code>page.tsx</Code>, а не внутри компонента. Четыре шага — около
            двух минут.
          </>
        }
      >
        <Callout tone="tip">
          Нужен RenDit UI и Next.js App Router. Если фреймворк ещё не стоит —
          начните с{" "}
          <Link
            href="/docs/install"
            className="font-w-600 text-secondary hover:underline"
          >
            установки
          </Link>{" "}
          или{" "}
          <Link
            href="/docs/css"
            className="font-w-600 text-secondary hover:underline"
          >
            готового CSS
          </Link>
          .
        </Callout>

        <Steps
          steps={[
            {
              title: "Скачайте два файла",
              text: (
                <>
                  Положите оба файла в <Code>src/components/ui/Select/</Code>.{" "}
                  <Code>index.tsx</Code> — сам компонент,{" "}
                  <Code>options.ts</Code> — типы, поиск и клавиатура. Копии — в
                  разделе «Код компонента» ниже.
                </>
              ),
              block: (
                <div className="grid gap-10 sm:grid-cols-2">
                  <div className="flex flex-col gap-12 p-14 br-xl border bg-surface shadow-1">
                    <div className="flex items-start gap-10">
                      <span className="size-36 shrink-0 grid place-items-center br-lg bg-secondary/10 text-secondary">
                        <FileCode size="sm" aria-hidden="true" />
                      </span>
                      <span className="flex min-w-0 flex-col gap-2">
                        <span className="font-14 font-w-700">index.tsx</span>
                        <span className="font-12 text-foreground-muted">
                          компонент целиком
                        </span>
                      </span>
                    </div>
                    <p className="font-13 text-foreground-muted">
                      Поле, список, поиск, клавиатура, портал, ссылки и кнопки в
                      пунктах.
                    </p>
                    <DownloadFile
                      code={SELECT_SRC}
                      filename="index.tsx"
                      variant="solid"
                      className="self-start max-sm:w-full"
                    >
                      Скачать index.tsx
                    </DownloadFile>
                  </div>

                  <div className="flex flex-col gap-12 p-14 br-xl border bg-surface shadow-1">
                    <div className="flex items-start gap-10">
                      <span className="size-36 shrink-0 grid place-items-center br-lg bg-foreground/5 text-foreground-muted">
                        <FileDetail size="sm" aria-hidden="true" />
                      </span>
                      <span className="flex min-w-0 flex-col gap-2">
                        <span className="font-14 font-w-700">options.ts</span>
                        <span className="font-12 text-foreground-muted">
                          типы и логика
                        </span>
                      </span>
                    </div>
                    <p className="font-13 text-foreground-muted">
                      Типы пунктов, фильтрация по запросу и переход стрелками.
                    </p>
                    <DownloadFile
                      code={OPTIONS_SRC}
                      filename="options.ts"
                      className="self-start max-sm:w-full"
                    >
                      Скачать options.ts
                    </DownloadFile>
                  </div>
                </div>
              ),
            },
            {
              title: "Поставьте иконки",
              text: (
                <>
                  В компоненте — <Code>Check</Code>, <Code>ChevronDown</Code>,{" "}
                  <Code>CursorClick</Code> и <Code>Link</Code> из Boxicons. Если
                  пакет уже стоит — пропустите шаг.
                </>
              ),
              block: <InstallCommand pkg="@boxicons/react" />,
            },
            {
              title: "Подключите на странице",
              text: (
                <>
                  Импорт один — <Code>@/components/ui/Select</Code>. Страница
                  может остаться серверной: компонент клиентский внутри. Вид
                  поля — <Code>triggerClassName</Code>, списка —{" "}
                  <Code>panelClassName</Code>, пунктов —{" "}
                  <Code>optionClassName</Code>. Без них работает дефолт.
                </>
              ),
              block: <CodeBlock file="app/page.tsx" code={PAGE_SRC} />,
            },
            {
              title: "Проверьте",
              text: (
                <>
                  Клик открывает список, стрелки ходят по пунктам, Enter
                  выбирает, Esc закрывает, поиск фильтрует. На телефоне — шрифт
                  16px и высота от 44px.
                </>
              ),
              result: (
                <div className="w-full max-w-320">
                  <Select
                    label="Стек"
                    items={SIMPLE}
                    defaultValue="next"
                    searchable
                  />
                </div>
              ),
            },
          ]}
          done={{
            title: "Готово",
            text: (
              <>
                Дальше можно собрать свой вариант в{" "}
                <Link
                  href="/docs/components/select/constructor"
                  className="font-w-600 text-secondary hover:underline"
                >
                  конструкторе
                </Link>{" "}
                или посмотреть{" "}
                <Link
                  href="/docs/components/tabs"
                  className="font-w-600 text-secondary hover:underline"
                >
                  вкладки
                </Link>
                .
              </>
            ),
          }}
        />

        <Callout tone="warning">
          <strong className="font-w-600">Если что-то не работает:</strong>
          <ul className="mt-6 flex list-disc flex-col gap-4 pl-16">
            <li>
              <strong className="font-w-600">Нет стилей</strong> — проверьте
              импорт RenDit UI и сгенерированного CSS.
            </li>
            <li>
              <strong className="font-w-600">Ссылка не переходит</strong> — у
              пункта должен быть <Code>href</Code>.
            </li>
            <li>
              <strong className="font-w-600">Кнопка молчит</strong> — передайте{" "}
              <Code>onAction</Code> из клиентского компонента.
            </li>
            <li>
              <strong className="font-w-600">На телефоне мелко</strong> —
              держите <Code>font-16</Code> и высоту от 44px.
            </li>
          </ul>
        </Callout>
      </Part>

      <Part
        id="source"
        title="Код компонента"
        lead="Два файла — всё, что нужно компоненту. Скачайте основной или откройте вкладки и скопируйте оба."
      >
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center">
          <p className="flex-1 font-13 text-foreground-muted">
            <Code>index.tsx</Code> — интерфейс и поведение.{" "}
            <Code>options.ts</Code> — типы, поиск и клавиатура.
          </p>
          <DownloadFile
            code={SELECT_SRC}
            filename="index.tsx"
            variant="solid"
            className="max-sm:w-full"
          >
            Скачать index.tsx
          </DownloadFile>
        </div>
        <Tabs
          defaultValue="index"
          ariaLabel="Файлы компонента Select"
          variant="pill"
          size="sm"
          panelClassName="pt-14"
          items={[
            {
              id: "index",
              label: "index.tsx",
              content: (
                <CodeBlock
                  file="src/components/ui/Select/index.tsx"
                  code={SELECT_SRC}
                />
              ),
            },
            {
              id: "options",
              label: "options.ts",
              content: (
                <CodeBlock
                  file="src/components/ui/Select/options.ts"
                  code={OPTIONS_SRC}
                />
              ),
            },
          ]}
        />
      </Part>

      <Part
        id="base"
        title="Обычный список"
        lead={
          <>
            Без поиска и групп — самый быстрый вариант. Иконка берётся из
            выбранного пункта и показывается в поле.
          </>
        }
      >
        <Example
          title="items и defaultValue"
          code={`const items = [
  { value: "next", label: "Next.js", hint: "App Router" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
];

<Select label="Стек" items={items} defaultValue="next" />`}
        >
          <div className="max-w-320">
            <Select label="Стек" items={SIMPLE} defaultValue="next" />
          </div>
        </Example>
      </Part>

      <Part
        id="native"
        title="Обычный select"
        lead={
          <>
            Системный <Code>&lt;select&gt;</Code>, но с нативным пикером: в
            Chrome и Edge 2026 работает <Code>appearance: base-select</Code> — у
            опций есть радиус, отступы, hover и галочка. Остальным браузерам —
            родной список.
          </>
        }
      >
        <Example
          title="native-select: как на сайте Ozon"
          code={`<label className="flex flex-col gap-6 max-w-320">
  <span className="font-13 font-w-600">Уровень меню</span>
  <span className="native-select-wrap relative block">
    <select
      defaultValue="1"
      className="native-select w-full h-46 pl-16 pr-44 br-20 bg-foreground/7 font-16 text-foreground cursor-pointer hover:bg-foreground/10"
    >
      <option value="0">Верхний уровень</option>
      <option value="1">Раздел</option>
      <option value="2">Подраздел</option>
    </select>
    <ChevronDown
      width={20}
      height={20}
      aria-hidden="true"
      className="native-select-chevron absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none text-secondary transition-[rotate] duration-200"
    />
  </span>
</label>`}
        >
          <div className="max-w-320">
            <label className="flex flex-col gap-6">
              <span className="font-13 font-w-600">Уровень меню</span>
              <span className="native-select-wrap relative block">
                <select
                  defaultValue="1"
                  className="native-select w-full h-46 pl-16 pr-44 br-20 bg-foreground/7 font-16 text-foreground cursor-pointer hover:bg-foreground/10"
                >
                  <option value="0">Верхний уровень</option>
                  <option value="1">Раздел</option>
                  <option value="2">Подраздел</option>
                </select>
                <ChevronDown
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="native-select-chevron absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none text-secondary transition-[rotate] duration-200"
                />
              </span>
            </label>
          </div>
        </Example>
        <CodeBlock
          file="src/assets/scss/components/_native-select.scss"
          code={NATIVE_SCSS}
        />
        <Callout tone="tip">
          Нужны поиск, иконки, группы, ссылки и кнопки в пунктах — берите{" "}
          <Code>Select</Code> выше. Нужен самый простой и родной список — этот
          <Code>native-select</Code>. Где браузер не умеет{" "}
          <Code>base-select</Code>, останется системный список — разметка та же.
        </Callout>
      </Part>

      <Part
        id="form"
        title="В форме"
        lead={
          <>
            Поле ввода и выбор вместе: подпись, подсказка, город и кнопка
            сохранения. Всё — на классах RenDit Code.
          </>
        }
      >
        <Example
          title="Имя, город и сохранение"
          code={`<div className="flex flex-col gap-14 max-w-320">
  <Input label="Имя" placeholder="Как к вам обращаться" />
  <Select
    label="Город"
    items={CITIES}
    defaultValue="msk"
    searchable
    placeholder="Найдите город"
  />
  <button className="h-44 px-20 br-full bg-primary text-primary-foreground font-13 font-w-600">
    Сохранить
  </button>
</div>`}
        >
          <div className="flex flex-col gap-14 max-w-320">
            <Input label="Имя" placeholder="Как к вам обращаться" />
            <Select
              label="Город"
              items={CITIES}
              defaultValue="msk"
              searchable
              placeholder="Найдите город"
            />
            <button
              type="button"
              className="h-44 px-20 br-full bg-primary text-primary-foreground font-13 font-w-600 transition-transform active:scale-97"
            >
              Сохранить
            </button>
          </div>
        </Example>
      </Part>

      <Part
        id="many"
        title="Много пунктов"
        lead={
          <>
            Большой список прокручивается внутри панели, а поиск оставляет
            только совпавшие пункты. Высота панели остаётся разумной.
          </>
        }
      >
        <Example
          title="20 пунктов и поиск"
          code={`const items = Array.from({ length: 20 }, (_, i) => ({
  value: \`item-\${i + 1}\`,
  label: \`Пункт \${i + 1}\`,
}));

<Select label="Длинный список" items={items} searchable placeholder="Найдите пункт" />`}
        >
          <div className="max-w-320">
            <Select
              label="Длинный список"
              items={MANY}
              searchable
              placeholder="Найдите пункт"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="presets"
        title="Готовые наборы"
        lead={
          <>
            Один <Code>Select</Code> — разные задачи: аккаунты с метками и
            навигация по ссылкам. Данные — обычный массив, его можно держать где
            угодно.
          </>
        }
      >
        <Example
          title="Аккаунт: имя, почта и метка"
          code={`import { Palette } from "@boxicons/react/Palette";
import { Star } from "@boxicons/react/Star";
import { User } from "@boxicons/react/User";

const items = [
  {
    value: "renat",
    label: "Ренат",
    hint: "renat@rendit.dev",
    icon: <User width={16} height={16} />,
    badge: "вы",
  },
  {
    value: "team",
    label: "Команда RenDit",
    hint: "team@rendit.dev",
    icon: <Star width={16} height={16} />,
  },
  {
    value: "studio",
    label: "Студия",
    hint: "design@rendit.dev",
    icon: <Palette width={16} height={16} />,
  },
];

<Select
  label="Аккаунт"
  items={items}
  defaultValue="renat"
  triggerClassName="w-full h-44 px-12 br-lg border bg-surface shadow-2 font-16 text-foreground"
/>`}
        >
          <div className="max-w-320">
            <Select
              label="Аккаунт"
              items={ACCOUNT_ITEMS}
              defaultValue="renat"
              triggerClassName="w-full h-44 px-12 br-lg border bg-surface shadow-2 font-16 text-foreground"
            />
          </div>
        </Example>
        <Example
          title="Ссылки: href открывает страницу"
          code={`const items = [
  { value: "docs", label: "Справка", hint: "/docs", href: "/docs" },
  {
    value: "components",
    label: "Компоненты",
    hint: "/docs/components",
    href: "/docs/components",
  },
  {
    value: "updates",
    label: "Обновления",
    hint: "/docs/releases",
    href: "/docs/releases",
  },
];

<Select label="Перейти" items={items} placeholder="Куда перейти" />`}
        >
          <div className="max-w-320">
            <Select
              label="Перейти"
              items={NAVIGATION_ITEMS}
              placeholder="Куда перейти"
            />
          </div>
        </Example>
        <Callout>
          Пункт с <Code>href</Code> — настоящая ссылка: клик и Enter сразу ведут
          на страницу. Для кнопки добавьте{" "}
          <Code>action: &quot;button&quot;</Code> и обработайте её в{" "}
          <Code>onAction</Code> — живой пример есть в{" "}
          <Link
            href="/docs/components/select/constructor"
            className="font-w-600 text-secondary hover:underline"
          >
            конструкторе
          </Link>
          .
        </Callout>
      </Part>

      <Part
        id="style"
        title="Стиль и анимация"
        lead={
          <>
            Высота, отступы, радиус, тень, рамка и фон — классы RenDit Code в{" "}
            <Code>triggerClassName</Code>, <Code>panelClassName</Code> и{" "}
            <Code>optionClassName</Code>. Конкретный Select живёт в файле
            подключения, а компонент остаётся общим.
          </>
        }
      >
        <Example
          title="масштаб, тень и радиус"
          code={`<Select
  label="Стек"
  items={items}
  defaultValue="next"
  animation="scale"
  triggerClassName="w-full h-44 px-12 br-16 border bg-surface shadow-2 font-16 text-foreground"
  panelClassName="br-16 border bg-surface shadow-5"
/>`}
        >
          <div className="max-w-320">
            <Select
              label="Стек"
              items={SIMPLE}
              defaultValue="next"
              animation="scale"
              triggerClassName="w-full h-44 px-12 br-16 border bg-surface shadow-2 font-16 text-foreground"
              panelClassName="br-16 border bg-surface shadow-5"
            />
          </div>
        </Example>
        <Example
          title="сдвиг, широкая панель и выравнивание"
          code={`<Select
  label="Стек"
  items={items}
  defaultValue="next"
  animation="slide"
  placement="bottom"
  align="end"
  panelClassName="br-xl border bg-surface shadow-4"
/>`}
        >
          <div className="max-w-320">
            <Select
              label="Стек"
              items={SIMPLE}
              defaultValue="next"
              animation="slide"
              placement="bottom"
              align="end"
              panelClassName="br-xl border bg-surface shadow-4"
            />
          </div>
        </Example>
        <Callout>
          <Code>align=&quot;end&quot;</Code> прижимает список к правому краю
          поля. На телефоне он всё равно не выйдет за экран: позиция
          ограничивается видимой областью.
        </Callout>
      </Part>

      <Part
        id="search"
        title="Поиск"
        lead={
          <>
            <Code>searchable</Code> добавляет поле поиска. Запрос ищет по
            названию и подсказке, стрелки работают прямо из поля ввода.
          </>
        }
      >
        <Example
          title="searchable"
          code={`<Select label="Стек" items={items} searchable placeholder="Найдите стек" />`}
        >
          <div className="max-w-320">
            <Select
              label="Стек"
              items={SIMPLE}
              searchable
              placeholder="Найдите стек"
            />
          </div>
        </Example>
        <Callout>
          На телефоне список остаётся над клавиатурой: позиция пересчитывается
          по <Code>visualViewport</Code>, а не по окну.
        </Callout>
      </Part>

      <Part
        id="groups"
        title="Группы и иконки"
        lead={
          <>
            Пункты можно собрать в группы. Заголовок группы — просто{" "}
            <Code>label</Code>, а поиск оставляет только совпавшие пункты.
          </>
        }
      >
        <Example
          title="группы"
          code={`const items = [
  {
    label: "Фронтенд",
    options: [
      { value: "next", label: "Next.js" },
      { value: "react", label: "React" },
    ],
  },
  {
    label: "Инструменты",
    options: [{ value: "rendit", label: "RenDit UI" }],
  },
];

<Select label="Стек" items={items} searchable />`}
        >
          <div className="max-w-320">
            <Select label="Стек" items={GROUPED} searchable />
          </div>
        </Example>
      </Part>

      <Part
        id="states"
        title="Ошибка и выключение"
        lead={
          <>
            <Code>error</Code> делает рамку красной и ставит{" "}
            <Code>aria-invalid</Code>; <Code>disabled</Code> выключает поле и
            список.
          </>
        }
      >
        <Example
          title="error и disabled"
          code={`<Select label="Стек" items={items} error="Выберите стек" />
<Select label="Стек" items={items} disabled defaultValue="next" />`}
        >
          <div className="flex flex-col gap-14 max-w-320">
            <Select
              label="Стек"
              items={SIMPLE}
              error="Выберите стек"
              placeholder="Не выбрано"
            />
            <Select label="Стек" items={SIMPLE} disabled defaultValue="next" />
          </div>
        </Example>
      </Part>

      <Part
        id="phone"
        title="Телефон"
        lead={
          <>
            Поле высотой 44px и шрифт 16px — палец попадает, iOS не приближает.
            Список прокручивается внутри себя и не уезжает за край экрана.
          </>
        }
      >
        <Callout tone="tip">
          Для длинных списков на телефоне оставьте <Code>searchable</Code>:
          найти пункт короче, чем листать. Для пяти-шести пунктов поиск не
          нужен.
        </Callout>
      </Part>

      <Part
        id="props"
        title="Свойства"
        lead={
          <>
            <Code>items</Code> — массив пунктов или групп. Вид задаётся классами
            в файле подключения; поведение — остальными свойствами.
          </>
        }
      >
        <Table
          head={["Свойство", "Тип", "Что делает"]}
          rows={[
            [
              "items",
              "SelectItem[]",
              "value, label, hint, badge, icon, href, action, disabled",
            ],
            ["label / hint / error", "ReactNode", "подпись, подсказка, ошибка"],
            ["placeholder", "string", "текст, пока ничего не выбрано"],
            ["searchable", "boolean", "поле поиска над списком"],
            ["disabled", "boolean", "выключить поле и список"],
            ["value / defaultValue", "string", "выбранное значение"],
            ["onChange", "(value, option) => void", "выбор обычного пункта"],
            ["onAction", "(option) => void", "пункт-ссылка или пункт-кнопка"],
            ["name", "string", "скрытое поле для формы"],
            [
              "triggerClassName",
              "string",
              "поле: высота, отступы, радиус, рамка, тень, фон, текст",
            ],
            [
              "triggerOpenClassName / triggerInvalidClassName",
              "string",
              "рамка при открытии и при ошибке",
            ],
            [
              "panelClassName / listClassName",
              "string",
              "блок списка и его прокручиваемая область",
            ],
            [
              "optionClassName",
              "string",
              "обычный пункт: отступы, радиус, ширина, шрифт",
            ],
            [
              "optionSelectedClassName / optionActiveClassName",
              "string",
              "выбранный пункт и пункт под курсором",
            ],
            ["optionDisabledClassName", "string", "выключенный пункт"],
            ["badgeClassName / searchClassName", "string", "метка и поиск"],
            ["labelClassName / hintClassName", "string", "подпись и подсказка"],
            ["errorClassName", "string", "текст ошибки"],
            [
              "triggerStyle / panelStyle",
              "CSSProperties",
              "точные размеры и цвета числом",
            ],
            [
              "listStyle / optionStyle",
              "CSSProperties",
              "зазор списка и стили пункта",
            ],
            ["optionGap", "number", "расстояние между пунктами"],
            [
              "animation",
              '"none" | "fade" | "scale" | "slide"',
              "появление списка",
            ],
            [
              "placement / align",
              '"auto" | "bottom" | "top" / "start" | "end"',
              "куда и откуда открывается",
            ],
            ["offset", "number", "зазор между полем и списком"],
            [
              "className / ref",
              "string / Ref",
              "корень и доступ к кнопке поля",
            ],
          ]}
        />
      </Part>
    </ComponentPage>
  );
}
