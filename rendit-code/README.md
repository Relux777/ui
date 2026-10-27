# RenDit Code — движок классов RenDit UI

Генерирует CSS только для тех классов, что реально встречаются в `src/`. Чистый Node, единственная зависимость —
`sass` (им компилируются токены).

## Команды

| Команда | Что делает |
| --- | --- |
| `npm run dev` | собирает CSS, следит за файлами и запускает `next dev` |
| `npm run build` | собирает CSS, затем `next build` |
| `npm run rendit-code` / `npm run rendit-code:watch` | только движок: один раз / с наблюдением |
| `npm run rendit-code:test` | тесты |
| `node rendit-code/cli.mjs check md:p-20 bg-primary/50` | показать CSS для классов |

Результат пишется в `src/assets/scss/generated/`: `rendit-code.css` (подключён в `layout.tsx` после
`RenDit_UI.scss`), `_screens.scss` (брейкпоинты для миксинов `up()` / `down()`), `_version.scss` (версия из `package.json`).

## Как устроено

```
rendit-code/
  cli.mjs                 команды
  index.mjs               сборка, наблюдение, атомарная запись файлов
  core/config.mjs         настройки по умолчанию + rendit.config.mjs + токены из SCSS
  core/scanner.mjs        достаёт классы из исходников (кэш по времени изменения файла)
  core/parser.mjs         md:hover:!-mt-10/50 → варианты, !important, минус, значение, модификатор
  core/utilities.mjs      таблица утилит
  core/variants.mjs       варианты (hover:, md:, dark:, group-hover: …) и их ранги
  core/generator.mjs      компиляция, сортировка каскада, печать CSS
  core/property-order.mjs порядок свойств
```

**Токены.** Движок компилирует `settings/_index.scss` и собирает CSS-переменные:
переменная со значением-цветом → `bg-*`, `text-*`, `border-*`, `fill-*` …; `--shadow-ИМЯ` → `shadow-ИМЯ`;
`--radius-ИМЯ` → `br-ИМЯ`; `--gradient-ИМЯ` → `bg-gradient-ИМЯ`; `--ease-ИМЯ` → `ease-ИМЯ`. Добавили токен — класс доступен сразу, даже в `npm run dev`.

**Каскад.** Все классы — в `@layer utilities`, у каждого один класс в селекторе. Порядок в файле определяет движок:
1. без вариантов → состояния (`hover` < `focus` < `active` < `disabled`) → `max-*` по убыванию → брейкпоинты по возрастанию → `dark` → псевдоэлементы;
2. внутри одного набора — сокращённые свойства раньше развёрнутых: `p-20 pt-0`, `m-10 mx-auto`, `br-20 br-tl-0`, `border border-primary` работают в любом порядке.

**Скорость.** Сканер читает только изменившиеся файлы, каждый класс компилируется один раз, CSS пишется на диск, только если поменялся. 20 000 классов — около 40 мс.

**Безопасность.** Свои значения и варианты (`[…]`) попадают в CSS как есть, поэтому генератор отбрасывает класс,
если в нём есть то, что закрывает или открывает блок (`{ } ;`), комментарий, управляющий символ, `</` или `<!--`,
непарная кавычка, или часть списка селекторов без самого класса (`[&,body]:hidden`). Так класс из чужого ввода
(конструктор, вставленный код) не может дописать в файл свой CSS. Расширение VS Code запускает движок из папки
проекта и поэтому работает только в доверенных папках (Workspace Trust).

## Синтаксис

- **У каждой вещи одно имя.** Имена — как в Tailwind, кроме того, что пришло из ReluxCode и стало «лицом» RenDit: числа в пикселях, `font-N`, `font-w-N`, `br-N`, `letter-s-N`.
- Числа — пиксели: `p-10` = 10px. С единицей: `p-1.5rem`, `w-50%`, `h-100dvh`, `max-w-60ch`.
- Цвета — токены: `bg-primary`, `text-foreground-muted`, `bg-blue-500`. Прозрачность — только через `/`: `bg-primary/50`, `bg-blue-500/[0.15]`.
- Свои значения: `w-[calc(100%-10px)]` (пробелы в calc расставляются сами), `grid-cols-[1fr_auto]` (`_` = пробел), `bg-[#0d5ef5]/40`, `bg-(--brand)`, свойство целиком `[mask-type:alpha]`.
- `!p-0` или `p-0!` — `!important`; `-mt-10` — отрицательное значение.
- Классы пишутся целиком: `bg-${color}` движок не увидит — полные строки или `safelist` в `rendit.config.mjs`.

## Варианты

| Группа | Префиксы |
| --- | --- |
| Состояния | `hover:` (только мышь), `focus:`, `focus-visible:`, `focus-within:`, `active:`, `disabled:`, `checked:`, `invalid:`, `placeholder-shown:`, `first:`, `last:`, `odd:`, `even:`, `empty:`, `open:` |
| Брейкпоинты | `sm:` 620 · `md:` 770 · `lg:` 990 · `xl:` 1200 · `2xl:` 1400 (от ширины и больше), `max-md:` (меньше), `min-[500px]:`, `max-[500px]:` |
| Контейнер | `@xs:` … `@2xl:` — ширина родителя с классом `@container`, `@max-md:`, `@[500px]:` |
| Тема и среда | `dark:`, `touch:` (сенсорные экраны), `mouse:`, `motion-reduce:`, `motion-safe:`, `print:`, `portrait:`, `landscape:`, `rtl:`, `ltr:` |
| Связи | `group-hover:`, `group-hover/имя:`, `group-[.is-open]:`, `peer-checked:`, `has-checked:`, `has-[>img]:`, `not-first:`, `*:` (дети) |
| Атрибуты | `aria-expanded:`, `aria-[sort=asc]:`, `data-active:`, `data-[state=open]:` |
| Псевдоэлементы | `before:`, `after:` (content подставляется сам), `placeholder:`, `file:`, `marker:`, `selection:` |
| Произвольные | `[&>svg]:`, `[&:nth-child(3)]:`, `supports-[display:grid]:`, `nth-3:` |

## Утилиты

| Группа | Классы |
| --- | --- |
| Отступы | `p px py pt pr pb pl ps pe`, `m mx my mt mr mb ml ms me` (+`auto`, минус), `gap gap-x gap-y`, `space-x space-y`, `scroll-mt` |
| Позиция | `static relative absolute fixed sticky`, `inset inset-x inset-y top right bottom left start end`, `z-N` (+минус) |
| Display | `block inline-block inline flex inline-flex grid inline-grid contents hidden`, `visible invisible`, `isolate` |
| Flex | `flex-row flex-col`, `flex-wrap flex-nowrap`, `flex-1 flex-auto flex-none grow shrink-0 basis-N order-N` |
| Выравнивание | `items-* self-* justify-* content-* justify-items-* place-items-* place-content-*` |
| Сетка `.row` | `col-N` (1–12), `col`, `col-auto`, `offset-N`, `gutter-N`, `gutter-x-N`, `gutter-y-N` |
| CSS Grid | `grid-cols-N grid-rows-N grid-cols-[…]`, `grid-fill-N grid-fit-N`, `col-span-N row-span-N col-start-N`, `grid-flow-*` |
| Размеры | `w h size min-w max-w min-h max-h` (`full screen dvh fit min max 1/2`), `aspect-square aspect-video aspect-16/9` |
| Текст | `font-N`, `font-N/LH`, `font-w-N`, `font-sans font-mono`, `text-{цвет}`, `text-[18px]`, `text-center`, `leading-N`, `letter-s-N`, `uppercase`, `italic`, `underline`, `truncate`, `line-clamp-N`, `text-balance`, `whitespace-*`, `tabular-nums` |
| Цвет и фон | `bg-* text-* fill-* stroke-* accent-* caret-* decoration-* outline-*`, `bg-gradient-*`, `bg-[url(…)]`, `bg-cover`, `bg-clip-text` |
| Рамки | `border border-N border-t border-x-2 border-{цвет} border-dashed`, `br-N br-{токен} br-t-N br-tl-N br-full br-round`, `outline outline-N outline-offset-N` |
| Эффекты | `opacity-N`, `shadow-1…6 shadow-inset shadow-line shadow-glass shadow-none shadow-[…]`, `blur-N backdrop-blur-N` |
| Движение | `transition transition-colors transition-transform transition-[grid-template-rows,opacity] duration-N delay-N ease-*` (`ease-spring ease-spring-bouncy` — пружины), `translate-x-N translate-y-N scale-N rotate-N` (без `@keyframes`) |
| Прочее | `overflow-* overscroll-* scrollbar-none scrollbar-thin scroll-smooth`, `cursor-*`, `pointer-events-none`, `select-none`, `touch-*`, `object-*`, `sr-only`, `pt-safe pb-safe`, `@container`, `content-['→']` |

## Было в ReluxCode → стало

| ReluxCode | RenDit Code |
| --- | --- |
| `.flex` (с `flex-wrap: wrap` по умолчанию) | `flex` — без переноса, перенос явно: `flex flex-wrap` |
| `.align-center`, `.justify-between` | `items-center`, `justify-between` |
| `.column`, `.nowrap`, `.wrap` | `flex-col`, `flex-nowrap`, `flex-wrap` |
| `.flex > .f-w-6`, `.row-flush` | `.row > .col-12 md:col-6` (поля и компенсация уже в `.row`) |
| `.pd-20`, `.mg-0-auto` | `p-20`, `mx-auto` |
| `.t-10`, `.r-20`, `.b-20` | `top-10`, `right-20`, `bottom-20` |
| `.p-relative`, `.p-absolute` | `relative`, `absolute` |
| `.text_center`, `.text-uppercase` | `text-center`, `uppercase` |
| `.none` | `hidden` |
| `.bg-5-100`, `.color-2-70` | `bg-primary`, `text-foreground/70` (семантические токены) |
| `.hover-bg-1-10` | `hover:bg-surface/10` |
| `.border-1px-2-10` | `border border-foreground/10` |
| `.blur-7` (размытие фона) | `backdrop-blur-7` (`blur-7` — размытие самого элемента) |
| `.none-max-620`, `.m-none` | `max-sm:hidden` |
| `.none-min-990` | `lg:hidden` |
| `.touch-no-blur` | `touch:backdrop-blur-none` |
| `.shadow-1…5` (стекло) | `shadow-1…6` — шкала высоты, `shadow-glass` — стекло |
| `.p-events-none`, `.u-select-none`, `.cover` | `pointer-events-none`, `select-none`, `object-cover` |
| `.z-minus` | `-z-1` |
| `.tr-3`, `.float`, `.hover-line` | убраны (анимации); переходы — `transition duration-300` |
| `.skip-link`, `.scroll-container` | убраны; прокрутка — `overflow-auto overscroll-contain` |
