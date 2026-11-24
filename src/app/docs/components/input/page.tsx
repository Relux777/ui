// Поле ввода: установка с одним файлом, примеры, классы вида и свойства.
// Конструктор — на отдельной вкладке /docs/components/input/constructor.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CreditCard } from "@boxicons/react/CreditCard";
import { Envelope } from "@boxicons/react/Envelope";
import { EyeClosed } from "@boxicons/react/EyeClosed";
import { FileCode } from "@boxicons/react/FileCode";
import { Lock } from "@boxicons/react/Lock";
import { PaperPlane } from "@boxicons/react/PaperPlane";
import { Phone } from "@boxicons/react/Phone";
import { Search } from "@boxicons/react/Search";
import { User } from "@boxicons/react/User";
import { X } from "@boxicons/react/X";
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
  { id: "unusual", title: "Необычные варианты" },
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
        id="unusual"
        title="Необычные варианты"
        lead={
          <>
            Поле — это <Code>wrapperClassName</Code>: стекло, градиентная рамка,
            мягкая тень, подсветка линии, командный поиск, плитка-иконка, OTP и
            готовые блоки. Работает в обеих темах, форма и фокус — классами.
          </>
        }
      >
        <Example
          title="стекло на цветной подложке"
          code={`<div className="p-20 br-xl bg-[linear-gradient(135deg,var(--secondary),#3b2f6b_60%,var(--violet-900))]">
  <Input
    label="Почта"
    placeholder="you@example.com"
    icon={<Envelope />}
    labelClassName="text-white/80"
    iconClassName="size-18 text-white/70"
    placeholderClassName="placeholder:text-white/50"
    wrapperClassName="h-48 px-14 gap-10 br-full liquid-glass border border-white/30 text-white focus-within:border-white/60 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,white_18%,transparent)]"
  />
</div>`}
        >
          <div className="p-20 br-xl bg-[linear-gradient(135deg,var(--secondary),#3b2f6b_60%,var(--violet-900))]">
            <Input
              label="Почта"
              placeholder="you@example.com"
              icon={<Envelope width={18} height={18} />}
              labelClassName="text-white/80"
              iconClassName="size-18 text-white/70"
              placeholderClassName="placeholder:text-white/50"
              wrapperClassName="h-48 px-14 gap-10 br-full liquid-glass border border-white/30 text-white focus-within:border-white/60 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,white_18%,transparent)]"
            />
          </div>
        </Example>

        <Example
          title="градиентная рамка"
          code={`<div className="p-px br-full bg-[linear-gradient(135deg,var(--secondary),var(--accent))]">
  <Input
    placeholder="Градиентная рамка"
    icon={<Search />}
    wrapperClassName="h-46 px-14 gap-10 br-full border-transparent bg-surface"
  />
</div>`}
        >
          <div className="max-w-320 p-px br-full bg-[linear-gradient(135deg,var(--secondary),var(--accent))]">
            <Input
              placeholder="Градиентная рамка"
              icon={<Search width={18} height={18} />}
              wrapperClassName="h-46 px-14 gap-10 br-full border-transparent bg-surface"
            />
          </div>
        </Example>

        <Example
          title="мягкое (neumorphic)"
          code={`<Input
  placeholder="Мягкое поле"
  wrapperClassName="h-46 px-14 gap-10 br-16 border border-transparent bg-background shadow-[inset_2px_3px_6px_rgb(0_0_0/0.08),inset_-2px_-2px_6px_rgb(255_255_255/0.7)] dark:shadow-[inset_2px_3px_6px_rgb(0_0_0/0.5),inset_-2px_-2px_6px_rgb(255_255_255/0.04)] focus-within:border-secondary/40 focus-within:shadow-[inset_2px_3px_6px_rgb(0_0_0/0.06),0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
/>`}
        >
          <div className="max-w-320">
            <Input
              placeholder="Мягкое поле"
              wrapperClassName="h-46 px-14 gap-10 br-16 border border-transparent bg-background shadow-[inset_2px_3px_6px_rgb(0_0_0/0.08),inset_-2px_-2px_6px_rgb(255_255_255/0.7)] dark:shadow-[inset_2px_3px_6px_rgb(0_0_0/0.5),inset_-2px_-2px_6px_rgb(255_255_255/0.04)] focus-within:border-secondary/40 focus-within:shadow-[inset_2px_3px_6px_rgb(0_0_0/0.06),0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
            />
          </div>
        </Example>

        <Example
          title="линия с подсветкой"
          code={`<Input
  placeholder="Ваше имя"
  wrapperClassName="h-46 px-0 gap-10 br-0 border-0 border-b-2 border-border bg-transparent focus-within:border-secondary focus-within:shadow-[0_6px_18px_-10px_var(--secondary)]"
/>`}
        >
          <div className="max-w-320">
            <Input
              placeholder="Ваше имя"
              wrapperClassName="h-46 px-0 gap-10 br-0 border-0 border-b-2 border-border bg-transparent focus-within:border-secondary focus-within:shadow-[0_6px_18px_-10px_var(--secondary)]"
            />
          </div>
        </Example>

        <Example
          title="командный поиск с клавишей"
          code={`<Input
  type="search"
  placeholder="Класс, компонент или тема…"
  icon={<Search />}
  end={<kbd className="px-6 py-2 br-sm border bg-surface font-11 font-mono">⌘K</kbd>}
  wrapperClassName="h-52 px-16 gap-12 br-16 border border-transparent bg-foreground/5 focus-within:bg-surface focus-within:border-secondary focus-within:shadow-[0_10px_30px_-18px_rgb(0_0_0/0.4)]"
/>`}
        >
          <div className="max-w-400">
            <Input
              type="search"
              placeholder="Класс, компонент или тема…"
              icon={<Search width={18} height={18} />}
              end={
                <kbd className="px-6 py-2 br-sm border bg-surface font-11 font-mono text-foreground-muted">
                  ⌘K
                </kbd>
              }
              wrapperClassName="h-52 px-16 gap-12 br-16 border border-transparent bg-foreground/5 focus-within:bg-surface focus-within:border-secondary focus-within:shadow-[0_10px_30px_-18px_rgb(0_0_0/0.4)]"
            />
          </div>
        </Example>

        <Example
          title="иконка в плитке"
          code={`<Input
  label="Профиль"
  placeholder="Имя пользователя"
  icon={<User />}
  iconClassName="size-36 br-full grid place-items-center bg-secondary/10 text-secondary [&>svg]:size-18"
  wrapperClassName="h-52 pl-10 pr-14 gap-10 br-full border bg-surface focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
/>`}
        >
          <div className="max-w-320">
            <Input
              label="Профиль"
              placeholder="Имя пользователя"
              icon={<User width={18} height={18} />}
              iconClassName="size-36 br-full grid place-items-center bg-secondary/10 text-secondary [&>svg]:size-18"
              wrapperClassName="h-52 pl-10 pr-14 gap-10 br-full border bg-surface focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
            />
          </div>
        </Example>

        <Example
          title="тональное с переходом"
          code={`<Input
  label="Заметка"
  placeholder="Что-нибудь важное"
  wrapperClassName="h-46 px-14 gap-10 br-lg border border-transparent bg-surface-muted focus-within:bg-surface focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
/>`}
        >
          <div className="max-w-320">
            <Input
              label="Заметка"
              placeholder="Что-нибудь важное"
              wrapperClassName="h-46 px-14 gap-10 br-lg border border-transparent bg-surface-muted focus-within:bg-surface focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
            />
          </div>
        </Example>

        <Example
          title="код из четырёх ячеек (OTP)"
          code={`<div className="flex items-center gap-8">
  {["1", "2", "3", "4"].map((n) => (
    <input
      key={n}
      aria-label={\`Цифра \${n}\`}
      inputMode="numeric"
      maxLength={1}
      className="size-52 text-center font-20 font-w-700 br-lg border bg-surface outline-none transition-[border-color,box-shadow] focus:border-secondary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
    />
  ))}
</div>`}
        >
          <div className="flex items-center gap-8">
            {["1", "2", "3", "4"].map((n) => (
              <input
                key={n}
                aria-label={`Цифра ${n}`}
                inputMode="numeric"
                maxLength={1}
                className="size-52 text-center font-20 font-w-700 br-lg border bg-surface outline-none transition-[border-color,box-shadow] motion-reduce:transition-none focus:border-secondary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
              />
            ))}
          </div>
        </Example>

        <Example
          title="сумма с валютой"
          code={`<Input
  label="Сумма"
  inputMode="decimal"
  placeholder="0"
  inputClassName="font-24 font-w-700"
  end={<span className="font-20 font-w-700 text-foreground-muted">₽</span>}
  wrapperClassName="h-56 px-16 gap-8 br-16 border bg-surface focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
/>`}
        >
          <div className="max-w-320">
            <Input
              label="Сумма"
              inputMode="decimal"
              placeholder="0"
              inputClassName="font-24 font-w-700"
              end={
                <span className="font-20 font-w-700 text-foreground-muted">
                  ₽
                </span>
              }
              wrapperClassName="h-56 px-16 gap-8 br-16 border bg-surface focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
            />
          </div>
        </Example>

        <Example
          title="пароль с надёжностью"
          code={`<div className="flex flex-col gap-8">
  <Input
    type="password"
    label="Пароль"
    defaultValue="renDit2026"
    end={
      <button type="button" aria-label="Показать пароль" className="text-foreground-muted hover:text-foreground">
        <EyeClosed width={18} height={18} />
      </button>
    }
  />
  <div className="flex items-center gap-6">
    <span className="h-4 w-1/3 br-full bg-secondary" />
    <span className="h-4 w-1/3 br-full bg-secondary/60" />
    <span className="h-4 w-1/3 br-full bg-foreground/10" />
  </div>
  <span className="font-12 text-foreground-muted">Надёжность: средняя</span>
</div>`}
        >
          <div className="flex max-w-320 flex-col gap-8">
            <Input
              type="password"
              label="Пароль"
              defaultValue="renDit2026"
              end={
                <button
                  type="button"
                  aria-label="Показать пароль"
                  className="text-foreground-muted transition-colors hover:text-foreground"
                >
                  <EyeClosed width={18} height={18} />
                </button>
              }
            />
            <div className="flex items-center gap-6">
              <span className="h-4 w-1/3 br-full bg-secondary" />
              <span className="h-4 w-1/3 br-full bg-secondary/60" />
              <span className="h-4 w-1/3 br-full bg-foreground/10" />
            </div>
            <span className="font-12 text-foreground-muted">
              Надёжность: средняя
            </span>
          </div>
        </Example>

        <Example
          title="телефон с префиксом"
          code={`<Input
  type="tel"
  inputMode="tel"
  placeholder="(999) 000-00-00"
  icon={<span className="font-13 font-w-600 text-foreground-muted">+7</span>}
  iconClassName="shrink-0"
  wrapperClassName="h-46 px-14 gap-10 br-full border bg-surface focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
/>`}
        >
          <div className="max-w-320">
            <Input
              type="tel"
              inputMode="tel"
              placeholder="(999) 000-00-00"
              icon={
                <span className="font-13 font-w-600 text-foreground-muted">
                  +7
                </span>
              }
              iconClassName="shrink-0"
              wrapperClassName="h-46 px-14 gap-10 br-full border bg-surface focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
            />
          </div>
        </Example>

        <Example
          title="карта оплаты"
          code={`<Input
  label="Карта"
  inputMode="numeric"
  placeholder="0000 0000 0000 0000"
  inputClassName="font-18"
  end={<span className="px-10 py-4 br-md bg-foreground/5 font-11 font-w-700">VISA</span>}
  icon={<CreditCard />}
  wrapperClassName="h-52 px-16 gap-10 br-16 border bg-[linear-gradient(135deg,var(--surface),color-mix(in_oklab,var(--secondary)_8%,var(--surface)))] focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
/>`}
        >
          <div className="max-w-360">
            <Input
              label="Карта"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              inputClassName="font-18"
              end={
                <span className="px-10 py-4 br-md bg-foreground/5 font-11 font-w-700">
                  VISA
                </span>
              }
              icon={<CreditCard width={18} height={18} />}
              wrapperClassName="h-52 px-16 gap-10 br-16 border bg-[linear-gradient(135deg,var(--surface),color-mix(in_oklab,var(--secondary)_8%,var(--surface)))] focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
            />
          </div>
        </Example>

        <Example
          title="теги в одном поле"
          code={`<div className="flex flex-wrap items-center gap-6 min-h-46 px-10 py-5 br-lg border bg-surface focus-within:border-secondary">
  <span className="inline-flex items-center gap-4 h-28 px-8 br-full bg-secondary/10 font-12 text-secondary">
    Дизайн <X width={12} height={12} />
  </span>
  <span className="inline-flex items-center gap-4 h-28 px-8 br-full bg-secondary/10 font-12 text-secondary">
    Код <X width={12} height={12} />
  </span>
  <input
    aria-label="Новый тег"
    placeholder="Добавить тег…"
    className="flex-1 min-w-120 h-32 bg-transparent font-16 outline-none placeholder:text-foreground-subtle"
  />
</div>`}
        >
          <div className="flex flex-wrap items-center gap-6 max-w-360 min-h-46 px-10 py-5 br-lg border bg-surface focus-within:border-secondary">
            <span className="inline-flex items-center gap-4 h-28 px-8 br-full bg-secondary/10 font-12 text-secondary">
              Дизайн <X width={12} height={12} aria-hidden="true" />
            </span>
            <span className="inline-flex items-center gap-4 h-28 px-8 br-full bg-secondary/10 font-12 text-secondary">
              Код <X width={12} height={12} aria-hidden="true" />
            </span>
            <input
              aria-label="Новый тег"
              placeholder="Добавить тег…"
              className="flex-1 min-w-120 h-32 bg-transparent font-16 outline-none placeholder:text-foreground-subtle"
            />
          </div>
        </Example>

        <Example
          title="композер сообщения"
          code={`<div className="flex items-center gap-8 p-6 h-56 br-full border bg-surface shadow-[0_10px_30px_-22px_rgb(0_0_0/0.5)] focus-within:border-secondary">
  <input
    aria-label="Сообщение"
    placeholder="Написать сообщение…"
    className="flex-1 min-w-0 h-44 px-10 bg-transparent font-16 outline-none placeholder:text-foreground-subtle"
  />
  <button
    type="button"
    aria-label="Отправить"
    className="size-44 shrink-0 grid place-items-center br-full bg-primary text-primary-foreground transition-[transform,opacity] hover:opacity-90 active:scale-92"
  >
    <PaperPlane width={18} height={18} />
  </button>
</div>`}
        >
          <div className="flex max-w-400 items-center gap-8 p-6 h-56 br-full border bg-surface shadow-[0_10px_30px_-22px_rgb(0_0_0/0.5)] focus-within:border-secondary">
            <input
              aria-label="Сообщение"
              placeholder="Написать сообщение…"
              className="flex-1 min-w-0 h-44 px-10 bg-transparent font-16 outline-none placeholder:text-foreground-subtle"
            />
            <button
              type="button"
              aria-label="Отправить"
              className="size-44 shrink-0 grid place-items-center br-full bg-primary text-primary-foreground transition-[transform,opacity] motion-reduce:transition-none hover:opacity-90 active:scale-92"
            >
              <PaperPlane width={18} height={18} aria-hidden="true" />
            </button>
          </div>
        </Example>

        <Callout tone="tip">
          Все варианты — та же разметка <Code>Input</Code> плюс{" "}
          <Code>wrapperClassName</Code>; OTP, теги и композер собраны вручную,
          это обычные <Code>input</Code> и <Code>div</Code>. На телефоне держите{" "}
          <Code>font-16</Code>: iOS не приближает страницу.
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
