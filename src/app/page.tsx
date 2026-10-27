// Страница-документация RenDit UI: как устроен фреймворк и примеры каждого вида классов.
// Каждый пример — живое превью и тот же код ниже. Меняешь класс здесь — RenDit Code пересобирает CSS сам.

import { ArrowRight } from "@boxicons/react/ArrowRight";
import { Code as CodeIcon } from "@boxicons/react/Code";
import { Layers } from "@boxicons/react/Layers";
import { Package } from "@boxicons/react/Package";
import { Code, Example, Palette, Section, Swatch } from "./_docs/docs";

const NAV = [
  ["start", "Устройство"],
  ["colors", "Цвета"],
  ["type", "Текст"],
  ["spacing", "Отступы"],
  ["flex", "Flex"],
  ["row", "Сетка"],
  ["grid", "Grid"],
  ["shape", "Рамки"],
  ["shadows", "Тени"],
  ["states", "Состояния"],
  ["responsive", "Адаптив"],
  ["dark", "Тёмная тема"],
  ["arbitrary", "Свои значения"],
];

export default function HomePage() {
  return (
    <main className="container py-48 flex flex-col gap-72">
      {/* ── Вступление ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-20 max-w-800">
        <span className="self-start flex items-center gap-8 pl-4 pr-12 py-4 br-full bg-surface-muted font-13">
          <span className="px-8 py-2 br-full bg-primary text-primary-foreground font-11 font-w-700 uppercase">
            new
          </span>
          RenDit Code — свой движок классов
        </span>
        <h1 className="font-40 md:font-56 font-w-700 -letter-s-3 leading-1.05">
          Классы, токены и компоненты — всё своё
        </h1>
        <p className="font-17 text-foreground-muted max-w-60ch">
          RenDit UI собирает CSS только из тех классов, что есть в коде. Числа —
          в пикселях, цвета — из токенов, адаптив и состояния — префиксами. Ниже
          — все виды классов с примерами.
        </p>
        <nav className="flex flex-wrap gap-8">
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="px-14 py-6 br-full border font-13 transition hover:bg-surface-muted"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* ── Устройство ───────────────────────────────────────────────── */}
      <Section
        id="start"
        title="Как устроен RenDit UI"
        lead="Три части с одной версией. Стили задают основу, движок генерирует классы, компоненты собираются из классов."
      >
        <div className="grid grid-fill-260 gap-16">
          {[
            {
              icon: <Layers />,
              name: "RenDit SCSS",
              path: "src/assets/scss",
              text: "Токены (палитра, цвета, тени, скругления), сброс, база, контейнер и сетка .row. Порядок слоёв — в _layers.scss.",
            },
            {
              icon: <CodeIcon />,
              name: "RenDit Code",
              path: "rendit-code/",
              text: "Находит классы в исходниках и пишет generated/rendit-code.css. Настройки — rendit.config.mjs.",
            },
            {
              icon: <Package />,
              name: "Компоненты",
              path: "src/components/ui/",
              text: "Каждый компонент — отдельная папка (ui/modal), которую можно скачать и поставить целиком.",
            },
          ].map((p) => (
            <div
              key={p.name}
              className="flex flex-col gap-10 p-24 br-xl border bg-surface"
            >
              <span className="size-44 br-lg bg-surface-muted flex items-center justify-center">
                {p.icon}
              </span>
              <h3 className="font-18 font-w-700">{p.name}</h3>
              <code className="font-12 font-mono text-foreground-muted">
                {p.path}
              </code>
              <p className="font-14 text-foreground-muted">{p.text}</p>
            </div>
          ))}
        </div>
        <Example
          title="Команды"
          note="npm run dev запускает движок и Next вместе: новый класс в разметке появляется в CSS за миллисекунды."
          code={`npm run dev                 # движок + next dev
npm run build               # движок + next build
npm run rendit-code         # только собрать CSS
npm run rendit-code:test    # тесты движка
node rendit-code/cli.mjs check md:p-20 bg-primary/50   # посмотреть CSS класса`}
        >
          <p className="font-14 text-foreground-muted">
            Классы пишутся в коде целиком:{" "}
            <Code>
              {"bg-$"}
              {"{color}"}
            </Code>{" "}
            движок не увидит — используйте полные строки или{" "}
            <Code>safelist</Code> в rendit.config.mjs.
          </p>
        </Example>
      </Section>

      {/* ── Цвета ────────────────────────────────────────────────────── */}
      <Section
        id="colors"
        title="Цвета"
        lead={
          <>
            Семантические токены говорят, что элемент значит, — их и используйте
            в разметке. Палитра — сырьё для токенов и редких случаев.
            Прозрачность — через <Code>/</Code>: <Code>bg-primary/50</Code>.
          </>
        }
      >
        <Example
          title="Семантические токены"
          note="Меняются вместе с темой. Файл: settings/_tokens.semantic.scss."
          code={`<div class="bg-background">  <div class="bg-surface">  <div class="bg-surface-muted">
<p class="text-foreground">  <p class="text-foreground-muted">
<button class="bg-primary text-primary-foreground">
<span class="bg-accent text-accent-foreground">`}
        >
          <div className="grid grid-fill-220 gap-16">
            <Swatch
              name="background"
              className="bg-background"
              note="фон страницы"
            />
            <Swatch
              name="surface"
              className="bg-surface"
              note="карточки, меню"
            />
            <Swatch
              name="surface-muted"
              className="bg-surface-muted"
              note="чипы, поля"
            />
            <Swatch
              name="surface-inverse"
              className="bg-surface-inverse"
              note="тёмные секции"
            />
            <Swatch
              name="foreground"
              className="bg-foreground"
              note="основной текст"
            />
            <Swatch
              name="foreground-muted"
              className="bg-foreground-muted"
              note="второстепенный"
            />
            <Swatch
              name="primary"
              className="bg-primary"
              note="главные кнопки"
            />
            <Swatch name="accent" className="bg-accent" note="яркий акцент" />
            <Swatch
              name="secondary"
              className="bg-secondary"
              note="второй акцент"
            />
            <Swatch name="border" className="bg-border" note="рамки" />
            <Swatch name="success" className="bg-success" note="успех" />
            <Swatch name="warning" className="bg-warning" note="внимание" />
            <Swatch name="danger" className="bg-danger" note="ошибка" />
            <Swatch name="info" className="bg-info" note="подсказка" />
          </div>
        </Example>

        <Example
          title="Палитра: 14 цветов × 11 оттенков"
          note="OKLCH: оттенки одного номера одинаково светлые на глаз. Цвет меняется одной строкой в settings/_palette.scss."
          code={`<div class="bg-blue-500">   <p class="text-gray-600">   <div class="border border-violet-300">`}
        >
          <Palette />
        </Example>

        <Example
          title="Прозрачность"
          note="Работает с любым цветом: токен, палитра, свой hex."
          code={`<div class="bg-primary/10">  <div class="bg-blue-500/30">  <div class="bg-[#ed70a7]/60">  <div class="bg-danger/[0.15]">`}
        >
          <div className="flex flex-wrap gap-12">
            <span className="size-64 br-lg bg-primary/10" />
            <span className="size-64 br-lg bg-blue-500/30" />
            <span className="size-64 br-lg bg-[#ed70a7]/60" />
            <span className="size-64 br-lg bg-danger/[0.15]" />
          </div>
        </Example>

        <Example
          title="Градиенты"
          note="Токены --gradient-ИМЯ → классы bg-gradient-ИМЯ."
          code={`<div class="bg-gradient-brand">  <div class="bg-gradient-dark">  <div class="bg-gradient-accent">
<h2 class="bg-gradient-brand bg-clip-text">`}
        >
          <div className="flex flex-wrap items-center gap-12">
            <span className="w-120 h-64 br-lg bg-gradient-brand" />
            <span className="w-120 h-64 br-lg bg-gradient-dark" />
            <span className="w-120 h-64 br-lg bg-gradient-accent" />
            <span className="font-32 font-w-700 bg-gradient-brand bg-clip-text">
              RenDit
            </span>
          </div>
        </Example>
      </Section>

      {/* ── Текст ────────────────────────────────────────────────────── */}
      <Section
        id="type"
        title="Текст"
        lead="Размер — font-N в пикселях, начертание — font-w-N, межбуквенный интервал — letter-s-N в сотых долях em."
      >
        <Example
          title="Размер, начертание, высота строки"
          note="font-18/28 — размер и высота строки сразу."
          code={`<h1 class="font-40 font-w-700 -letter-s-3">
<p class="font-18/28 text-foreground-muted">
<span class="font-12 font-w-500 uppercase letter-s-8">`}
        >
          <div className="flex flex-col gap-10">
            <span className="font-40 font-w-700 -letter-s-3">Заголовок 40</span>
            <span className="font-18/28 text-foreground-muted">
              Абзац 18/28: длинный текст с удобной высотой строки для чтения.
            </span>
            <span className="font-12 font-w-500 uppercase letter-s-8 text-foreground-subtle">
              Подпись 12 · uppercase
            </span>
          </div>
        </Example>
        <Example
          title="Обрезка и перенос"
          code={`<p class="truncate">   <p class="line-clamp-2">   <h2 class="text-balance">`}
        >
          <div className="grid grid-fill-240 gap-16 font-14">
            <p className="truncate p-12 br-md bg-surface-muted">
              truncate: очень длинная строка, которая не влезает в блок
            </p>
            <p className="line-clamp-2 p-12 br-md bg-surface-muted">
              line-clamp-2: текст обрезается на второй строке, а всё, что ниже,
              скрывается многоточием в конце.
            </p>
          </div>
        </Example>
      </Section>

      {/* ── Отступы и размеры ────────────────────────────────────────── */}
      <Section
        id="spacing"
        title="Отступы и размеры"
        lead="Число — пиксели: p-20 = 20px. Можно с единицей (p-1.5rem, w-50%), дробью (w-1/3) или словом (w-full, h-dvh, mx-auto)."
      >
        <Example
          title="padding, margin, gap"
          note="p · px · py · pt · pr · pb · pl, то же для m, плюс gap, gap-x, gap-y и space-y."
          code={`<div class="p-20">   <div class="px-24 py-12">   <div class="mt-16 -mb-8">   <div class="flex gap-12">`}
        >
          <div className="flex flex-wrap items-start gap-12">
            <span className="p-20 br-md bg-info/15">p-20</span>
            <span className="px-24 py-12 br-md bg-info/15">px-24 py-12</span>
            <span className="flex gap-6 p-8 br-md bg-info/15">
              <span className="size-24 br-sm bg-info" />
              <span className="size-24 br-sm bg-info" />
              <span className="size-24 br-sm bg-info" />
            </span>
          </div>
        </Example>
        <Example
          title="Ширина и высота"
          code={`<div class="w-1/3">  <div class="w-50%">  <div class="size-48">  <div class="max-w-60ch">  <section class="min-h-dvh">`}
        >
          <div className="flex flex-col gap-8 font-13">
            <span className="w-1/3 p-8 br-sm bg-secondary/15">w-1/3</span>
            <span className="w-50% p-8 br-sm bg-secondary/15">w-50%</span>
            <span className="w-full p-8 br-sm bg-secondary/15">w-full</span>
          </div>
        </Example>
      </Section>

      {/* ── Flex ─────────────────────────────────────────────────────── */}
      <Section
        id="flex"
        title="Flex"
        lead="flex не переносит элементы по умолчанию (как в CSS). Перенос — flex-wrap, направление — flex-col."
      >
        <Example
          title="Строка с выравниванием"
          code={`<div class="flex items-center justify-between gap-12">
  <span>…</span><button>…</button>
</div>`}
        >
          <div className="flex items-center justify-between gap-12 p-16 br-lg bg-surface-muted">
            <span className="flex items-center gap-10">
              <span className="size-36 br-full bg-gradient-brand" />
              <span className="flex flex-col">
                <span className="font-14 font-w-500">Ренат</span>
                <span className="font-12 text-foreground-muted">
                  автор RenDit UI
                </span>
              </span>
            </span>
            <span className="px-12 py-6 br-full bg-primary text-primary-foreground font-13">
              Профиль
            </span>
          </div>
        </Example>
        <Example
          title="Колонка и перенос"
          code={`<div class="flex flex-col gap-8">   <div class="flex flex-wrap gap-8">`}
        >
          <div className="flex flex-wrap gap-8">
            {["Next.js", "TSX", "HTML", "CSS", "JS", "SCSS", "React"].map(
              (t) => (
                <span key={t} className="px-12 py-6 br-full border font-13">
                  {t}
                </span>
              ),
            )}
          </div>
        </Example>
      </Section>

      {/* ── Сетка .row ───────────────────────────────────────────────── */}
      <Section
        id="row"
        title="Сетка из 12 колонок"
        lead="Замена f-w-* из ReluxCode. Внутри .row каждый блок по умолчанию на всю ширину, col-N задаёт ширину, gutter-N — расстояние."
      >
        <Example
          title="col-N с брейкпоинтами"
          note="На телефоне — одна колонка, с md — две, с lg — три."
          code={`<div class="row gutter-20">
  <div class="col-12 md:col-6 lg:col-4">…</div>
  <div class="col-12 md:col-6 lg:col-4">…</div>
  <div class="col-12 lg:col-4">…</div>
</div>`}
        >
          <div className="row gutter-20">
            <div className="col-12 md:col-6 lg:col-4">
              <div className="p-16 br-lg bg-surface-muted font-13">
                col-12 md:col-6 lg:col-4
              </div>
            </div>
            <div className="col-12 md:col-6 lg:col-4">
              <div className="p-16 br-lg bg-surface-muted font-13">
                col-12 md:col-6 lg:col-4
              </div>
            </div>
            <div className="col-12 lg:col-4">
              <div className="p-16 br-lg bg-surface-muted font-13">
                col-12 lg:col-4
              </div>
            </div>
          </div>
        </Example>
        <Example
          title="col, col-auto, offset-N"
          note="col делит свободное место поровну, col-auto — по содержимому, offset-N сдвигает на N колонок."
          code={`<div class="row gutter-12">
  <div class="col-auto">…</div>
  <div class="col">…</div>
  <div class="col">…</div>
</div>
<div class="row"><div class="col-6 offset-3">…</div></div>`}
        >
          <div className="flex flex-col gap-12">
            <div className="row gutter-12">
              <div className="col-auto">
                <div className="p-12 br-md bg-accent text-accent-foreground font-13">
                  col-auto
                </div>
              </div>
              <div className="col">
                <div className="p-12 br-md bg-surface-muted font-13">col</div>
              </div>
              <div className="col">
                <div className="p-12 br-md bg-surface-muted font-13">col</div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 offset-3">
                <div className="p-12 br-md bg-secondary/15 font-13 text-center">
                  col-6 offset-3
                </div>
              </div>
            </div>
          </div>
        </Example>
      </Section>

      {/* ── CSS Grid ─────────────────────────────────────────────────── */}
      <Section
        id="grid"
        title="CSS Grid"
        lead="Для карточек удобнее grid-fill-N: колонок столько, сколько влезет шириной от N пикселей, — без брейкпоинтов."
      >
        <Example
          title="grid-fill-160"
          note="Сузьте окно — колонки перестроятся сами. grid-fit-N — то же, но колонки растягиваются, если карточек мало."
          code={`<div class="grid grid-fill-160 gap-12">…</div>`}
        >
          <div className="grid grid-fill-160 gap-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 br-lg bg-surface-muted flex items-center justify-center font-13"
              >
                {n}
              </div>
            ))}
          </div>
        </Example>
        <Example
          title="grid-cols-N и col-span-N"
          code={`<div class="grid grid-cols-4 gap-12">
  <div class="col-span-2">…</div>  <div>…</div>  <div>…</div>  <div class="col-span-full">…</div>
</div>`}
        >
          <div className="grid grid-cols-4 gap-12 font-13">
            <div className="col-span-2 p-16 br-lg bg-info/15">col-span-2</div>
            <div className="p-16 br-lg bg-surface-muted">1</div>
            <div className="p-16 br-lg bg-surface-muted">1</div>
            <div className="col-span-full p-16 br-lg bg-info/15">
              col-span-full
            </div>
          </div>
        </Example>
      </Section>

      {/* ── Рамки и скругления ───────────────────────────────────────── */}
      <Section
        id="shape"
        title="Рамки и скругления"
        lead="br-N — скругление в пикселях или токен (br-lg). border — 1px цветом --border, цвет и толщина — отдельными классами."
      >
        <Example
          title="Скругления"
          note="Токены — settings/_radius.scss: xs 6 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32."
          code={`<div class="br-md">  <div class="br-xl">  <div class="br-20">  <button class="br-full">  <img class="br-round">  <div class="br-t-xl">`}
        >
          <div className="flex flex-wrap items-center gap-12 font-12">
            <span className="size-64 br-md flex items-center justify-center bg-surface-muted border">
              br-md
            </span>
            <span className="size-64 br-xl flex items-center justify-center bg-surface-muted border">
              br-xl
            </span>
            <span className="w-96 h-40 br-full flex items-center justify-center bg-surface-muted border">
              br-full
            </span>
            <span className="size-64 br-round flex items-center justify-center bg-surface-muted border">
              br-round
            </span>
            <span className="size-64 br-t-xl flex items-center justify-center bg-surface-muted border">
              br-t-xl
            </span>
          </div>
        </Example>
        <Example
          title="Рамки"
          code={`<div class="border">  <div class="border-2 border-primary">  <div class="border-b border-dashed">  <div class="border border-danger/40">`}
        >
          <div className="flex flex-wrap gap-12 font-13">
            <span className="px-16 py-10 br-md border">border</span>
            <span className="px-16 py-10 br-md border-2 border-primary">
              border-2 border-primary
            </span>
            <span className="px-16 py-10 border-b border-dashed">
              border-b border-dashed
            </span>
            <span className="px-16 py-10 br-md border border-danger/40 text-danger">
              border-danger/40
            </span>
          </div>
        </Example>
      </Section>

      {/* ── Тени ─────────────────────────────────────────────────────── */}
      <Section
        id="shadows"
        title="Тени"
        lead="settings/_shadows.scss: shadow-1…6 — высота подъёма элемента, плюс особые тени. В тёмной теме они плотнее автоматически."
      >
        <Example
          title="shadow-1 … shadow-6, inset, line, glass"
          code={`<div class="shadow-2">  <div class="shadow-4 hover:shadow-6">  <input class="shadow-inset">  <nav class="shadow-line">  <div class="shadow-glass">`}
        >
          <div className="grid grid-fill-140 gap-20 p-8 font-13">
            <div className="h-88 br-xl bg-surface flex items-center justify-center shadow-1">
              shadow-1
            </div>
            <div className="h-88 br-xl bg-surface flex items-center justify-center shadow-2">
              shadow-2
            </div>
            <div className="h-88 br-xl bg-surface flex items-center justify-center shadow-3">
              shadow-3
            </div>
            <div className="h-88 br-xl bg-surface flex items-center justify-center shadow-4">
              shadow-4
            </div>
            <div className="h-88 br-xl bg-surface flex items-center justify-center shadow-5">
              shadow-5
            </div>
            <div className="h-88 br-xl bg-surface flex items-center justify-center shadow-6">
              shadow-6
            </div>
            <div className="h-88 br-xl bg-surface flex items-center justify-center shadow-inset">
              shadow-inset
            </div>
            <div className="h-88 br-xl bg-surface flex items-center justify-center shadow-line">
              shadow-line
            </div>
            <div className="h-88 br-xl bg-surface flex items-center justify-center shadow-glass">
              shadow-glass
            </div>
          </div>
        </Example>
      </Section>

      {/* ── Состояния ────────────────────────────────────────────────── */}
      <Section
        id="states"
        title="Состояния"
        lead="Префиксы hover:, focus-visible:, active:, disabled:, group-hover:, peer-checked: … hover срабатывает только с мышью — на телефоне не «залипает»."
      >
        <Example
          title="Кнопки в стиле boxicons"
          note="Порядок в CSS считает движок: active сильнее hover, disabled сильнее всех — в любом порядке классов."
          code={`<button class="px-20 py-12 br-lg bg-gradient-dark text-white shadow-2 transition hover:shadow-4 active:scale-97">
<button class="px-20 py-12 br-lg border bg-surface transition hover:bg-surface-muted">
<button class="… disabled:opacity-40" disabled>`}
        >
          <div className="flex flex-wrap items-center gap-12">
            <button
              type="button"
              className="flex items-center gap-8 px-20 py-12 br-lg bg-gradient-dark text-white font-w-500 shadow-2 transition hover:shadow-4 active:scale-97"
            >
              Все иконки <ArrowRight size="sm" />
            </button>
            <button
              type="button"
              className="px-20 py-12 br-lg border bg-surface font-w-500 transition hover:bg-surface-muted active:scale-97"
            >
              Figma Plugin
            </button>
            <button
              type="button"
              className="px-20 py-12 br-lg bg-accent text-accent-foreground font-w-500 transition hover:opacity-80"
            >
              Акцент
            </button>
            <button
              type="button"
              className="px-20 py-12 br-lg bg-primary text-primary-foreground font-w-500 disabled:opacity-40"
              disabled
            >
              disabled
            </button>
          </div>
        </Example>
        <Example
          title="group-hover и peer-checked"
          note="Наведите на карточку; отметьте чекбокс."
          code={`<a class="group …"><span class="group-hover:translate-x-4 transition">→</span></a>
<input type="checkbox" class="peer" /><span class="peer-checked:text-success">…</span>`}
        >
          <div className="flex flex-wrap items-center gap-24">
            <a
              href="#states"
              className="group flex items-center gap-12 px-20 py-14 br-xl border bg-surface transition hover:shadow-3"
            >
              <span className="font-14 font-w-500">Карточка</span>
              <span className="flex text-foreground-muted transition group-hover:translate-x-4 group-hover:text-foreground">
                <ArrowRight size="sm" />
              </span>
            </a>
            <label className="flex items-center gap-10 font-14 cursor-pointer">
              <input type="checkbox" className="peer size-18 accent-primary" />
              <span className="text-foreground-muted peer-checked:text-success peer-checked:font-w-500">
                Отметь меня
              </span>
            </label>
          </div>
        </Example>
      </Section>

      {/* ── Адаптив ──────────────────────────────────────────────────── */}
      <Section
        id="responsive"
        title="Адаптив"
        lead="Mobile-first: md:p-20 — с 770px и шире, max-md:hidden — уже 770px. Брейкпоинты: sm 620 · md 770 · lg 990 · xl 1200 · 2xl 1400."
      >
        <Example
          title="Брейкпоинты"
          note="Измените ширину окна: блок меняет цвет и текст."
          code={`<div class="bg-danger/15 md:bg-warning/15 lg:bg-success/15">
<span class="md:hidden">телефон</span>  <span class="hidden md:inline lg:hidden">планшет</span>  <span class="hidden lg:inline">компьютер</span>`}
        >
          <div className="p-20 br-lg font-15 font-w-500 bg-danger/15 md:bg-warning/15 lg:bg-success/15">
            <span className="md:hidden">Сейчас: телефон (меньше 770px)</span>
            <span className="hidden md:inline lg:hidden">
              Сейчас: планшет (770–989px)
            </span>
            <span className="hidden lg:inline">
              Сейчас: компьютер (990px и шире)
            </span>
          </div>
        </Example>
        <Example
          title="Контейнерные запросы"
          note="Карточка подстраивается под ширину РОДИТЕЛЯ с классом @container, а не окна: @md: — родитель от 448px."
          code={`<div class="@container">
  <div class="flex flex-col @md:flex-row gap-12">…</div>
</div>`}
        >
          <div className="@container">
            <div className="flex flex-col @md:flex-row @md:items-center gap-12 p-16 br-lg bg-surface-muted">
              <span className="w-full @md:w-120 h-80 br-md bg-gradient-brand shrink-0" />
              <span className="font-14 text-foreground-muted">
                На узком родителе картинка сверху, на широком — слева.
              </span>
            </div>
          </div>
        </Example>
      </Section>

      {/* ── Тёмная тема ──────────────────────────────────────────────── */}
      <Section
        id="dark"
        title="Тёмная тема"
        lead="Семантические токены переключаются сами (кнопка в шапке). Префикс dark: — для точечных отличий."
      >
        <Example
          title="dark:"
          code={`<div class="bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200">`}
        >
          <div className="p-16 br-lg font-14 bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200">
            Светлый блок в светлой теме и приглушённый — в тёмной.
          </div>
        </Example>
      </Section>

      {/* ── Свои значения ────────────────────────────────────────────── */}
      <Section
        id="arbitrary"
        title="Свои значения"
        lead="Когда шкалы не хватает: значение в квадратных скобках, _ — пробел. !important — восклицательный знак, минус — отрицательное значение."
      >
        <Example
          title="[…], !, −"
          code={`<div class="w-[calc(100%-40px)]">   <div class="grid-cols-[200px_1fr]">   <div class="[mask-type:alpha]">
<div class="bg-(--my-color)">   <div class="!mt-0">   <div class="-mt-12">`}
        >
          <div className="flex flex-col gap-10 font-13">
            <span className="w-[calc(100%-40px)] p-10 br-md bg-surface-muted">
              w-[calc(100%-40px)]
            </span>
            <span className="grid grid-cols-[120px_1fr] gap-10">
              <span className="p-10 br-md bg-info/15">120px</span>
              <span className="p-10 br-md bg-info/15">1fr</span>
            </span>
          </div>
        </Example>
      </Section>
    </main>
  );
}
