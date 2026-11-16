// Поле ввода: установка с одним файлом, примеры, классы вида и свойства.
// Конструктор — на отдельной вкладке /docs/components/input/constructor.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Envelope } from "@boxicons/react/Envelope";
import { FileCode } from "@boxicons/react/FileCode";
import { Lock } from "@boxicons/react/Lock";
import { Phone } from "@boxicons/react/Phone";
import { Search } from "@boxicons/react/Search";
import { User } from "@boxicons/react/User";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
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
import { InputTabs } from "./_tabs";

export const metadata = { title: "Поле ввода" };

const TOC: TocItem[] = [
  { id: "install", title: "Установка" },
  { id: "source", title: "Код компонента" },
  { id: "base", title: "Обычное поле" },
  { id: "sizes", title: "Размеры" },
  { id: "kinds", title: "Виды" },
  { id: "states", title: "Ошибка и выключение" },
  { id: "slots", title: "Иконки и блок справа" },
  { id: "header", title: "Как в шапке" },
  { id: "form", title: "В форме" },
  { id: "style", title: "Стиль и фокус" },
  { id: "phone", title: "Телефон" },
  { id: "props", title: "Свойства" },
];

const INPUT_SRC = readFileSync(
  join(process.cwd(), "src/components/ui/Input/index.tsx"),
  "utf8",
);

const PAGE_SRC = `import { Input } from "@/components/ui/Input";

export default function Page() {
  return (
    <Input
      label="Почта"
      type="email"
      placeholder="you@example.com"
      hint="Пришлём чек и статус заказа"
    />
  );
}`;

const KBD =
  "px-6 py-2 br-sm border bg-surface font-11 font-mono text-foreground-muted";

// Общая часть класса поля: рамка, фон, тень, текст и фокус.
const FIELD =
  "border bg-surface shadow-1 text-foreground focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]";

export default function InputPage() {
  return (
    <ComponentPage
      title="Поле ввода"
      toc={TOC}
      tabs={<InputTabs active="input" />}
      lead={
        <>
          Подпись, подсказка, ошибка, иконка и блок справа. Вид — классами
          RenDit Code в <Code>page.tsx</Code>: высота, фон, рамка, тень и фокус.
          На телефоне шрифт 16px — iOS не приближает страницу.
        </>
      }
    >
      <Part
        id="install"
        title="Установка"
        lead={
          <>
            Один файл <Code>Input/index.tsx</Code>, один импорт и классы вида в{" "}
            <Code>page.tsx</Code>. Стили RenDit Code уже есть — отдельный CSS не
            нужен.
          </>
        }
      >
        <Steps
          steps={[
            {
              title: "Скачайте файл",
              text: (
                <>
                  Положите <Code>index.tsx</Code> в{" "}
                  <Code>src/components/ui/Input/</Code>. Внутри — подпись,
                  подсказка, ошибка, иконка, блок справа и доступность. Больше
                  ничего не нужно.
                </>
              ),
              block: (
                <div className="flex flex-col gap-12 p-14 br-xl border bg-surface shadow-1">
                  <div className="flex items-start gap-10">
                    <span className="size-36 shrink-0 grid place-items-center br-lg bg-secondary/10 text-secondary">
                      <FileCode size="sm" aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-2">
                      <span className="font-14 font-w-700">index.tsx</span>
                      <span className="font-12 text-foreground-muted">
                        компонент целиком, без зависимостей
                      </span>
                    </span>
                  </div>
                  <p className="font-13 text-foreground-muted">
                    <Code>src/components/ui/Input/index.tsx</Code> — один файл
                    на всё поле.
                  </p>
                  <DownloadFile
                    code={INPUT_SRC}
                    filename="index.tsx"
                    variant="solid"
                    className="self-start max-sm:w-full"
                  >
                    Скачать index.tsx
                  </DownloadFile>
                </div>
              ),
            },
            {
              title: "Поставьте иконки — по желанию",
              text: (
                <>
                  Сам компонент без зависимостей. Иконки в примерах — из
                  Boxicons: <Code>Envelope</Code>, <Code>Search</Code>,{" "}
                  <Code>User</Code>. Если пакета нет — поставьте; если не нужны
                  иконки — пропустите шаг.
                </>
              ),
              block: <InstallCommand pkg="@boxicons/react" />,
              optional: true,
            },
            {
              title: "Подключите на странице",
              text: (
                <>
                  Импорт один — <Code>@/components/ui/Input</Code>. Без{" "}
                  <Code>wrapperClassName</Code> работает готовый вид; свои
                  высота, фон и рамка — классами RenDit Code прямо здесь.
                </>
              ),
              block: <CodeBlock file="app/page.tsx" code={PAGE_SRC} />,
            },
            {
              title: "Проверьте",
              text: (
                <>
                  Подпись связана с полем, ошибка ставит{" "}
                  <Code>aria-invalid</Code>, иконка декоративная, на телефоне
                  16px и высота от 44px.
                </>
              ),
              result: (
                <div className="w-full max-w-320">
                  <Input
                    label="Почта"
                    type="email"
                    placeholder="you@example.com"
                    hint="Пришлём чек и статус заказа"
                  />
                </div>
              ),
            },
          ]}
          done={{
            title: "Готово",
            text: (
              <>
                Дальше — собрать своё поле в{" "}
                <Link
                  href="/docs/components/input/constructor"
                  className="font-w-600 text-secondary hover:underline"
                >
                  конструкторе
                </Link>{" "}
                или посмотреть{" "}
                <Link
                  href="/docs/components/select"
                  className="font-w-600 text-secondary hover:underline"
                >
                  выбор
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
              <strong className="font-w-600">Ошибка не краснеет</strong> — в
              своём <Code>wrapperClassName</Code> нужны классы для{" "}
              <Code>aria-invalid</Code> или состояние ошибки.
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
        lead="Один файл, который отвечает за поведение. Вид конкретного поля — в вашем page.tsx."
      >
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center">
          <p className="flex-1 font-13 text-foreground-muted">
            <Code>index.tsx</Code> — подпись, подсказка, ошибка, иконка, блок
            справа и aria-связи.
          </p>
          <DownloadFile
            code={INPUT_SRC}
            filename="index.tsx"
            variant="solid"
            className="max-sm:w-full"
          >
            Скачать index.tsx
          </DownloadFile>
        </div>
        <CodeBlock file="src/components/ui/Input/index.tsx" code={INPUT_SRC} />
      </Part>

      <Part
        id="base"
        title="Обычное поле"
        lead="Подпись, плейсхолдер и подсказка. Без классов — готовый вид: 44px, рамка, фон, тень и фокус."
      >
        <Example
          title="Подпись и подсказка"
          code={`<Input
  label="Почта"
  type="email"
  placeholder="you@example.com"
  hint="Пришлём чек и статус заказа"
/>`}
        >
          <div className="max-w-320">
            <Input
              label="Почта"
              type="email"
              placeholder="you@example.com"
              hint="Пришлём чек и статус заказа"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="sizes"
        title="Размеры"
        lead={
          <>
            Высота, отступы и шрифт — классами. <Code>sm</Code> — для фильтров,{" "}
            <Code>md</Code> — обычное поле, <Code>lg</Code> — заметная форма.
          </>
        }
      >
        <Example
          title="h-36, h-44 и h-52"
          code={`const base =
  "border bg-surface shadow-1 text-foreground focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]";

<Input
  label="Маленькое"
  placeholder="sm"
  wrapperClassName={\`h-36 px-10 gap-6 br-md \${base}\`}
  inputClassName="font-14"
/>
<Input label="Обычное" placeholder="md" />
<Input
  label="Крупное"
  placeholder="lg"
  wrapperClassName={\`h-52 px-14 gap-10 br-lg \${base}\`}
/>`}
        >
          <div className="flex flex-col gap-14 max-w-320">
            <Input
              label="Маленькое"
              placeholder="sm"
              wrapperClassName={`h-36 px-10 gap-6 br-md ${FIELD}`}
              inputClassName="font-14"
            />
            <Input label="Обычное" placeholder="md" />
            <Input
              label="Крупное"
              placeholder="lg"
              wrapperClassName={`h-52 px-14 gap-10 br-lg ${FIELD}`}
            />
          </div>
        </Example>
      </Part>

      <Part
        id="kinds"
        title="Виды"
        lead={
          <>
            Контур на карточке и заливка на серой подложке. Разница —{" "}
            <Code>bg-surface</Code> и <Code>bg-surface-muted</Code> в{" "}
            <Code>wrapperClassName</Code>.
          </>
        }
      >
        <Example
          title="outline и filled"
          code={`<Input label="Контур" icon={<Envelope />} />
<Input
  label="Заливка"
  icon={<Envelope />}
  wrapperClassName="h-44 px-12 gap-8 br-lg border border-transparent bg-surface-muted text-foreground focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
/>`}
        >
          <div className="flex flex-col gap-14 max-w-320">
            <Input label="Контур" icon={<Envelope width={18} height={18} />} />
            <Input
              label="Заливка"
              icon={<Envelope width={18} height={18} />}
              wrapperClassName="h-44 px-12 gap-8 br-lg border border-transparent bg-surface-muted text-foreground focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="states"
        title="Ошибка и выключение"
        lead={
          <>
            <Code>error</Code> ставит красную рамку и <Code>aria-invalid</Code>,
            подсказка уступает место ошибке. <Code>disabled</Code> выключает
            поле и приглушает его.
          </>
        }
      >
        <Example
          title="error и disabled"
          code={`<Input
  label="Почта"
  type="email"
  defaultValue="renat@"
  error="Проверьте адрес — нужен @"
/>
<Input label="Почта" disabled defaultValue="you@example.com" />`}
        >
          <div className="flex flex-col gap-14 max-w-320">
            <Input
              label="Почта"
              type="email"
              defaultValue="renat@"
              error="Проверьте адрес — нужен @"
            />
            <Input label="Почта" disabled defaultValue="you@example.com" />
          </div>
        </Example>
      </Part>

      <Part
        id="slots"
        title="Иконки и блок справа"
        lead={
          <>
            <Code>icon</Code> — декоративная иконка слева, <Code>end</Code> —
            любой блок справа: единица измерения, клавиша, кнопка.
          </>
        }
      >
        <Example
          title="Поиск, сумма и подсказка"
          code={`<Input
  label="Поиск"
  icon={<Search />}
  placeholder="Класс или тема"
  end={<kbd className="${KBD}">⌘K</kbd>}
/>
<Input label="Сумма" end={<span>₽</span>} inputMode="decimal" placeholder="0" />
<Input label="Почта" icon={<Envelope />} hint="Пришлём чек и статус заказа" />`}
        >
          <div className="flex flex-col gap-14 max-w-320">
            <Input
              label="Поиск"
              icon={<Search width={18} height={18} />}
              placeholder="Класс или тема"
              end={<kbd className={KBD}>⌘K</kbd>}
            />
            <Input
              label="Сумма"
              end={<span className="font-12 text-foreground-muted">₽</span>}
              inputMode="decimal"
              placeholder="0"
            />
            <Input
              label="Почта"
              icon={<Envelope width={18} height={18} />}
              hint="Пришлём чек и статус заказа"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="header"
        title="Как в шапке"
        lead={
          <>
            Поле поиска из шапки: 14px на компьютере и 16px на сенсорном экране,
            синий курсор, тихий плейсхолдер и без нативного крестика. Фокус
            можно убрать совсем — рамку рисует только обёртка.
          </>
        }
      >
        <Example
          title="font-14 touch:text-[16px], caret и selection"
          code={`<Input
  type="search"
  label="Поиск"
  icon={<Search />}
  placeholder="width, padding…"
  wrapperClassName="h-44 px-14 gap-10 br-full border border-transparent bg-foreground/5 text-foreground"
  inputClassName="font-14 touch:text-[16px] caret-blue-500 selection:bg-transparent selection:text-foreground [&::-webkit-search-cancel-button]:hidden"
  placeholderClassName="placeholder:text-foreground-subtle"
/>`}
        >
          <div className="max-w-320">
            <Input
              type="search"
              label="Поиск"
              icon={<Search width={18} height={18} />}
              placeholder="width, padding…"
              wrapperClassName="h-44 px-14 gap-10 br-full border border-transparent bg-foreground/5 text-foreground"
              inputClassName="font-14 touch:text-[16px] caret-blue-500 selection:bg-transparent selection:text-foreground [&::-webkit-search-cancel-button]:hidden"
              placeholderClassName="placeholder:text-foreground-subtle"
            />
          </div>
        </Example>
        <Callout tone="tip">
          <strong className="font-w-600">Что за классы:</strong>
          <ul className="mt-6 flex list-disc flex-col gap-4 pl-16">
            <li>
              <Code>font-14 touch:text-[16px]</Code> — 14px на компьютере и 16px
              на телефоне: iOS не приближает страницу при фокусе.
            </li>
            <li>
              <Code>caret-blue-500</Code> — цвет курсора;{" "}
              <Code>caret-transparent</Code> убирает его совсем.
            </li>
            <li>
              <Code>selection:bg-transparent selection:text-foreground</Code> —
              без подсветки выделенного текста при нажатии.
            </li>
            <li>
              <Code>[&amp;::-webkit-search-cancel-button]:hidden</Code> —
              убирает нативный крестик у <Code>type=&quot;search&quot;</Code>.
            </li>
            <li>
              Нет <Code>focus-within:</Code> классов у обёртки — нет и подсветки
              при фокусе. Вернуть — <Code>focus-within:border-secondary</Code>.
            </li>
          </ul>
        </Callout>
      </Part>

      <Part
        id="form"
        title="В форме"
        lead="Имя, почта, телефон и пароль вместе. Иконки подсказывают смысл, подсказки — что вводить."
      >
        <Example
          title="Контактные данные"
          code={`<form className="flex flex-col gap-14 max-w-320">
  <Input label="Имя" icon={<User />} placeholder="Как к вам обращаться" />
  <Input label="Почта" type="email" icon={<Envelope />} placeholder="you@example.com" />
  <Input label="Телефон" type="tel" icon={<Phone />} placeholder="+7 999 000-00-00" />
  <Input label="Пароль" type="password" icon={<Lock />} hint="Минимум 8 символов" />
  <button className="h-44 br-full bg-primary text-primary-foreground font-13 font-w-600">
    Сохранить
  </button>
</form>`}
        >
          <form className="flex flex-col gap-14 max-w-320">
            <Input
              label="Имя"
              icon={<User width={18} height={18} />}
              placeholder="Как к вам обращаться"
            />
            <Input
              label="Почта"
              type="email"
              icon={<Envelope width={18} height={18} />}
              placeholder="you@example.com"
            />
            <Input
              label="Телефон"
              type="tel"
              icon={<Phone width={18} height={18} />}
              placeholder="+7 999 000-00-00"
            />
            <Input
              label="Пароль"
              type="password"
              icon={<Lock width={18} height={18} />}
              hint="Минимум 8 символов"
            />
            <button
              type="button"
              className="h-44 br-full bg-primary text-primary-foreground font-13 font-w-600 transition-transform active:scale-97"
            >
              Сохранить
            </button>
          </form>
        </Example>
      </Part>

      <Part
        id="style"
        title="Стиль и фокус"
        lead={
          <>
            Радиус, тень, фон из палитры и цвет кольца фокуса — тоже классы.
            Например, тёплое поле в акцентной карточке.
          </>
        }
      >
        <Example
          title="акцентный фон, тень и фокус"
          code={`<Input
  label="Промокод"
  placeholder="RENDIT2026"
  wrapperClassName="h-48 px-14 gap-10 br-16 border border-accent/40 bg-accent/10 text-foreground shadow-4 focus-within:border-accent focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_22%,transparent)]"
  end={<span className="font-12 font-w-600 text-foreground">−10%</span>}
/>`}
        >
          <div className="p-18 br-xl border bg-surface shadow-1">
            <Input
              label="Промокод"
              placeholder="RENDIT2026"
              wrapperClassName="h-48 px-14 gap-10 br-16 border border-accent/40 bg-accent/10 text-foreground shadow-4 focus-within:border-accent focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_22%,transparent)]"
              end={
                <span className="font-12 font-w-600 text-foreground">−10%</span>
              }
            />
          </div>
        </Example>
        <Example
          title="прозрачное поле на цветной подложке"
          code={`<div className="p-18 br-xl bg-secondary/10">
  <Input
    label="Поиск"
    icon={<Search />}
    placeholder="Класс или тема"
    wrapperClassName="h-44 px-12 gap-8 br-lg border border-secondary/30 bg-transparent text-foreground focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_18%,transparent)]"
  />
</div>`}
        >
          <div className="p-18 br-xl bg-secondary/10">
            <Input
              label="Поиск"
              icon={<Search width={18} height={18} />}
              placeholder="Класс или тема"
              wrapperClassName="h-44 px-12 gap-8 br-lg border border-secondary/30 bg-transparent text-foreground focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_18%,transparent)]"
            />
          </div>
        </Example>
      </Part>

      <Part
        id="phone"
        title="Телефон"
        lead={
          <>
            Поле не ниже 44px и шрифт 16px: iOS Safari не приближает страницу
            при фокусе. <Code>inputMode</Code> и <Code>autoComplete</Code> дают
            правильную клавиатуру.
          </>
        }
      >
        <Example
          title="font-16 и h-44"
          code={`<Input
  label="Почта"
  type="email"
  inputMode="email"
  autoComplete="email"
  placeholder="you@example.com"
/>`}
        >
          <div className="max-w-320">
            <Input
              label="Почта"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
        </Example>
        <Callout tone="tip">
          Для телефона — <Code>type=&quot;tel&quot;</Code> и{" "}
          <Code>inputMode=&quot;tel&quot;</Code>. Для суммы —{" "}
          <Code>inputMode=&quot;decimal&quot;</Code>. На телефоне держите{" "}
          <Code>font-16</Code>.
        </Callout>
      </Part>

      <Part
        id="props"
        title="Свойства"
        lead={
          <>
            Поведение — пропсами, вид — классами в <Code>page.tsx</Code>.
            Остальное — обычные свойства <Code>input</Code>.
          </>
        }
      >
        <Table
          head={["Свойство", "Тип", "Что делает"]}
          rows={[
            ["label / hint / error", "ReactNode", "подпись, подсказка, ошибка"],
            ["icon", "ReactNode", "декоративная иконка слева"],
            ["end", "ReactNode", "блок справа: единица, клавиша, кнопка"],
            [
              "wrapperClassName",
              "string",
              "высота, отступы, радиус, рамка, тень, фон, фокус",
            ],
            ["inputClassName", "string", "размер и цвет текста внутри"],
            [
              "placeholderClassName",
              "string",
              "цвет плейсхолдера: placeholder:text-…",
            ],
            ["iconClassName", "string", "размер и цвет иконки"],
            ["endClassName", "string", "стиль блока справа"],
            ["labelClassName / hintClassName", "string", "подпись и подсказка"],
            ["errorClassName", "string", "текст ошибки"],
            [
              "wrapperStyle / inputStyle",
              "CSSProperties",
              "точные размеры числом",
            ],
            ["ref", "Ref<HTMLInputElement>", "доступ к самому input"],
            [
              "…",
              "InputHTMLAttributes",
              "value, onChange, name, required, autoComplete и другие",
            ],
          ]}
        />
      </Part>
    </ComponentPage>
  );
}
