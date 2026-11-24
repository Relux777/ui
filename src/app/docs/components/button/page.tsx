// Кнопка: варианты, размеры, иконки, состояния, анимации и «металлик» — только классами RenDit Code.
// Компонента нет специально: кнопка — это разметка с классами, а не код с логикой.
// У всех эффектов есть motion-reduce:transition-none — при «уменьшении движения» анимации выключаются.

import { Bolt } from "@boxicons/react/Bolt";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import { Crown } from "@boxicons/react/Crown";
import { Diamond } from "@boxicons/react/Diamond";
import { Plus } from "@boxicons/react/Plus";
import { Sparkles } from "@boxicons/react/Sparkles";
import { Star } from "@boxicons/react/Star";
import { Trash } from "@boxicons/react/Trash";
import { Part } from "../../../_docs/class-page";
import { Callout, Code, CodeBlock, Example, Table } from "../../../_docs/docs";
import type { TocItem } from "../../../_docs/toc";
import { ComponentPage } from "../_page";

export const metadata = { title: "Кнопка" };

const TOC: TocItem[] = [
  { id: "base", title: "Основные" },
  { id: "colors", title: "Цвета" },
  { id: "sizes", title: "Размеры" },
  { id: "icons", title: "С иконками" },
  { id: "states", title: "Состояния" },
  { id: "motion", title: "Анимации" },
  { id: "metal", title: "Металлик" },
  { id: "future", title: "Будущее" },
  { id: "themes", title: "Светлая и тёмная" },
  { id: "code", title: "Код целиком" },
];

// основа: размер, форма, шрифт, фокус и пружина нажатия — у всех кнопок одна
const BTN =
  "inline-flex items-center justify-center gap-8 h-44 px-20 br-full font-13 font-w-600 select-none transition-[background-color,border-color,color,box-shadow,translate,scale] duration-200 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary active:scale-97";

// металлик: общая часть — кромка, блик, подъём и «перелив» градиента при наведении и нажатии.
// Позиция градиента при hover уезжает вперёд, при нажатии — ещё дальше (active сильнее hover в движке),
// поэтому кнопка «переливается» и от клика. Всё на переходах: без @keyframes и лишних перерисовок.
const METAL_BASE = `relative isolate overflow-hidden inline-flex items-center justify-center gap-8 h-46 px-24 br-full font-13 font-w-700 select-none border border-white/60 dark:border-white/10 bg-[size:220%_100%] bg-[position:0%_50%] shadow-[inset_0_1px_0_rgb(255_255_255/0.85),inset_0_-2px_4px_rgb(0_0_0/0.18),0_2px_4px_rgb(0_0_0/0.14),0_10px_24px_-10px_rgb(0_0_0/0.35)] transition-[background-position,translate,scale,box-shadow] duration-700 ease-out motion-reduce:transition-none hover:bg-[position:100%_50%] hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.95),inset_0_-2px_4px_rgb(0_0_0/0.18),0_4px_8px_rgb(0_0_0/0.14),0_18px_34px_-12px_rgb(0_0_0/0.4)] active:bg-[position:200%_50%] active:translate-y-0 active:scale-97 active:shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-2px_5px_rgb(0_0_0/0.22),0_1px_2px_rgb(0_0_0/0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(120%_90%_at_50%_0%,rgb(255_255_255/0.85),transparent_55%)] before:opacity-60 before:transition-opacity before:duration-500 hover:before:opacity-95`;

// «металлик» по умолчанию: серебро в светлой теме, тёмная сталь — в тёмной
const METAL = `${METAL_BASE} bg-[linear-gradient(115deg,#f6f7fa_0%,#dfe3ea_22%,#aeb6c6_42%,#f3f5f9_58%,#c7cdd9_78%,#e9ecf2_100%)] dark:bg-[linear-gradient(115deg,#3a3f4a_0%,#20242c_22%,#596172_42%,#2b303a_58%,#454b58_78%,#23272f_100%)] text-gray-950 dark:text-gray-100`;

// металлы коллекции: золото, медь, хром (перелив) и тёмная сталь
const METAL_GOLD = `${METAL_BASE} bg-[linear-gradient(115deg,#fff6d6_0%,#f3d78b_20%,#b07c24_42%,#ffe9b3_58%,#d9a63d_78%,#fff3c6_100%)] text-[#2f2206]`;
const METAL_COPPER = `${METAL_BASE} bg-[linear-gradient(115deg,#ffe7d8_0%,#eda173_20%,#8d4728_42%,#ffd6bb_58%,#c9784a_78%,#ffe2cd_100%)] text-[#34180b]`;
const METAL_CHROME = `${METAL_BASE} bg-[linear-gradient(115deg,#c8d3ff_0%,#e5caff_18%,#ffd3e7_36%,#c9ffea_54%,#c9e7ff_72%,#e7daff_88%,#c8d3ff_100%)] text-gray-900`;
const METAL_STEEL = `${METAL_BASE} bg-[linear-gradient(115deg,#3a3f4a_0%,#20242c_22%,#596172_42%,#2b303a_58%,#454b58_78%,#23272f_100%)] text-gray-100`;

export default function ButtonPage() {
  return (
    <ComponentPage
      title="Кнопка"
      toc={TOC}
      lead={
        <>
          Кнопка — это разметка с классами RenDit Code, без отдельного
          компонента: основа, цвет, размер и эффекты собираются в{" "}
          <Code>className</Code>. Анимации — на переходах, светлая и тёмная тема
          подхватываются сами.
        </>
      }
    >
      <Part
        id="base"
        title="Основные"
        lead={
          <>
            Основа одна для всех: <Code>h-44</Code>, круглые края, шрифт 13,
            фокус с клавиатуры и лёгкое нажатие. Меняется только цвет и вид.
          </>
        }
      >
        <Example
          title="Главная, обычная, призрачная, красная"
          code={`const BTN =
  "inline-flex items-center justify-center gap-8 h-44 px-20 br-full font-13 font-w-600 select-none transition-[background-color,border-color,color,box-shadow,translate,scale] duration-200 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary active:scale-97";

<button className={\`\${BTN} bg-primary text-primary-foreground shadow-2 hover:opacity-85\`}>
  Сохранить
</button>
<button className={\`\${BTN} border bg-surface hover:bg-surface-muted\`}>Отмена</button>
<button className={\`\${BTN} text-foreground-muted hover:text-foreground hover:bg-foreground/5\`}>
  Позже
</button>
<button className={\`\${BTN} bg-danger text-white hover:opacity-85\`}>Удалить</button>`}
        >
          <div className="flex flex-wrap items-center gap-10">
            <button
              type="button"
              className={`${BTN} bg-primary text-primary-foreground shadow-2 hover:opacity-85`}
            >
              Сохранить
            </button>
            <button
              type="button"
              className={`${BTN} border bg-surface hover:bg-surface-muted`}
            >
              Отмена
            </button>
            <button
              type="button"
              className={`${BTN} text-foreground-muted hover:text-foreground hover:bg-foreground/5`}
            >
              Позже
            </button>
            <button
              type="button"
              className={`${BTN} bg-danger text-white hover:opacity-85`}
            >
              Удалить
            </button>
          </div>
        </Example>
      </Part>

      <Part
        id="colors"
        title="Цвета"
        lead={
          <>
            Цвета — токены темы: <Code>bg-primary</Code>, <Code>bg-accent</Code>{" "}
            (лайм), <Code>bg-secondary</Code> (фиолет), <Code>bg-success</Code>,{" "}
            <Code>bg-danger</Code>. Контурная — рамка и текст в цвет.
          </>
        }
      >
        <Example
          title="акцент, второй цвет, успех, контур"
          code={`<button className="... bg-accent text-accent-foreground hover:opacity-85">Акцент</button>
<button className="... bg-secondary text-secondary-foreground hover:opacity-85">Второй</button>
<button className="... bg-success text-white hover:opacity-85">Готово</button>
<button className="... border border-secondary text-secondary hover:bg-secondary/10">
  Контур
</button>`}
        >
          <div className="flex flex-wrap items-center gap-10">
            <button
              type="button"
              className={`${BTN} bg-accent text-accent-foreground hover:opacity-85`}
            >
              Акцент
            </button>
            <button
              type="button"
              className={`${BTN} bg-secondary text-secondary-foreground hover:opacity-85`}
            >
              Второй
            </button>
            <button
              type="button"
              className={`${BTN} bg-success text-white hover:opacity-85`}
            >
              Готово
            </button>
            <button
              type="button"
              className={`${BTN} border border-secondary text-secondary hover:bg-secondary/10`}
            >
              Контур
            </button>
            <button
              type="button"
              className={`${BTN} liquid-glass text-foreground hover:bg-white/10`}
            >
              Стекло
            </button>
          </div>
        </Example>
      </Part>

      <Part
        id="sizes"
        title="Размеры"
        lead={
          <>
            Высота и шрифт — классами: <Code>h-34</Code> для панелей,{" "}
            <Code>h-44</Code> обычная, <Code>h-52</Code> заметная. На телефоне
            касание не меньше 44px.
          </>
        }
      >
        <Example
          title="h-34, h-44 и h-52"
          code={`<button className="... h-34 px-14 font-12">Маленькая</button>
<button className="... h-44 px-20">Обычная</button>
<button className="... h-52 px-24 font-15">Крупная</button>`}
        >
          <div className="flex flex-wrap items-center gap-10">
            <button
              type="button"
              className={`${BTN} h-34 px-14 font-12 bg-primary text-primary-foreground hover:opacity-85`}
            >
              Маленькая
            </button>
            <button
              type="button"
              className={`${BTN} bg-primary text-primary-foreground hover:opacity-85`}
            >
              Обычная
            </button>
            <button
              type="button"
              className={`${BTN} h-52 px-24 font-15 bg-primary text-primary-foreground hover:opacity-85`}
            >
              Крупная
            </button>
          </div>
        </Example>
      </Part>

      <Part
        id="icons"
        title="С иконками"
        lead={
          <>
            Иконка слева или справа — обычный элемент внутри кнопки, размер
            18px. Кнопка-иконка —{" "}
            <Code>size-44 br-full grid place-items-center</Code>.
          </>
        }
      >
        <Example
          title="создать, удалить, далее и только иконка"
          code={`<button className="..."><Plus width={18} height={18} /> Создать</button>
<button className="..."><Trash width={18} height={18} /> Удалить</button>
<button className="...">Далее <ChevronRight width={18} height={18} /></button>
<button className="... size-44 grid place-items-center" aria-label="Избранное">
  <Star width={18} height={18} />
</button>`}
        >
          <div className="flex flex-wrap items-center gap-10">
            <button
              type="button"
              className={`${BTN} bg-primary text-primary-foreground hover:opacity-85`}
            >
              <Plus width={18} height={18} aria-hidden="true" /> Создать
            </button>
            <button
              type="button"
              className={`${BTN} border bg-surface hover:bg-surface-muted`}
            >
              <Trash width={18} height={18} aria-hidden="true" /> Удалить
            </button>
            <button
              type="button"
              className={`${BTN} border bg-surface hover:bg-surface-muted`}
            >
              Далее <ChevronRight width={18} height={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Избранное"
              className={`${BTN} size-44 px-0 grid place-items-center border bg-surface hover:text-secondary`}
            >
              <Star width={18} height={18} aria-hidden="true" />
            </button>
          </div>
        </Example>
      </Part>

      <Part
        id="states"
        title="Состояния"
        lead={
          <>
            <Code>disabled</Code> гасит кнопку и убирает нажатие, фокус с
            клавиатуры — кольцо <Code>focus-visible</Code>. Клик мышью кольца не
            показывает.
          </>
        }
      >
        <Example
          title="disabled и фокус"
          code={`<button className="... disabled:opacity-45 disabled:pointer-events-none" disabled>
  Недоступно
</button>
<button className="... focus-visible:outline-2 focus-visible:outline-secondary">
  Нажмите Tab
</button>`}
        >
          <div className="flex flex-wrap items-center gap-10">
            <button
              type="button"
              disabled
              className={`${BTN} bg-primary text-primary-foreground disabled:opacity-45 disabled:pointer-events-none`}
            >
              Недоступно
            </button>
            <button type="button" className={`${BTN} border bg-surface`}>
              Нажмите Tab
            </button>
          </div>
        </Example>
      </Part>

      <Part
        id="motion"
        title="Анимации"
        lead={
          <>
            Пружины движка: <Code>ease-spring</Code> и{" "}
            <Code>ease-spring-bouncy</Code>. Анимируется только{" "}
            <Code>translate</Code>, <Code>scale</Code> и тени — без перерисовки
            текста. При «уменьшении движения» в системе —{" "}
            <Code>motion-reduce:transition-none</Code>.
          </>
        }
      >
        <Example
          title="подъём с пружиной и утапливание"
          code={`<button className="... transition-[translate,box-shadow] duration-300 ease-spring hover:-translate-y-1 hover:shadow-5 active:translate-y-0 active:scale-97">
  Поднять
</button>
<button className="... shadow-[0_5px_0_var(--primary-hover)] transition-[translate,box-shadow] duration-150 active:translate-y-1 active:shadow-[0_1px_0_var(--primary-hover)]">
  Твёрдая
</button>`}
        >
          <div className="flex flex-wrap items-center gap-14">
            <button
              type="button"
              className={`${BTN} bg-primary text-primary-foreground transition-[translate,box-shadow] duration-300 ease-spring hover:-translate-y-1 hover:shadow-5 active:translate-y-0 active:scale-97`}
            >
              Поднять
            </button>
            <button
              type="button"
              className={`${BTN} bg-primary text-primary-foreground shadow-[0_5px_0_var(--primary-hover)] transition-[translate,box-shadow] duration-150 active:translate-y-1 active:shadow-[0_1px_0_var(--primary-hover)]`}
            >
              Твёрдая
            </button>
            <button
              type="button"
              className={`${BTN} border border-secondary text-secondary bg-[linear-gradient(90deg,var(--secondary)_50%,transparent_50%)] bg-[size:210%_100%] bg-[position:100%_0] transition-[background-position,color] duration-500 ease-out hover:bg-[position:0%_0] hover:text-secondary-foreground`}
            >
              Заливка
            </button>
            <button type="button" className={`${BTN} border bg-surface group`}>
              Далее{" "}
              <ChevronRight
                width={18}
                height={18}
                aria-hidden="true"
                className="transition-transform duration-300 ease-spring-bouncy group-hover:translate-x-1"
              />
            </button>
          </div>
        </Example>
      </Part>

      <Part
        id="metal"
        title="Металлик"
        lead={
          <>
            Флагманский вариант: стальной градиент катается по кнопке при
            наведении, сверху бегущий блик, светлая и тёмная сталь. Нажатие
            утапливает кнопку, уход — пружина. Всё — переходами{" "}
            <Code>background-position</Code> и <Code>translate</Code>.
          </>
        }
      >
        <Example
          title="металлик"
          code={`<button className="${METAL}">
  <Crown width={18} height={18} /> Металлик
</button>`}
        >
          <div className="flex flex-wrap items-center gap-14">
            <button type="button" className={METAL}>
              <Crown width={18} height={18} aria-hidden="true" /> Металлик
            </button>
            <button type="button" className={METAL}>
              <Sparkles width={18} height={18} aria-hidden="true" /> Премиум
            </button>
          </div>
        </Example>
        <Example
          title="коллекция: серебро, золото, медь, хром и сталь"
          code={`const METAL_BASE =
  "relative isolate overflow-hidden inline-flex items-center justify-center gap-8 h-46 px-24 br-full font-13 font-w-700 select-none border border-white/60 bg-[size:220%_100%] bg-[position:0%_50%] transition-[background-position,translate,scale,box-shadow] duration-700 ease-out motion-reduce:transition-none hover:bg-[position:100%_50%] hover:-translate-y-1 active:bg-[position:200%_50%] active:translate-y-0 active:scale-97 ...";

const gold = \`\${METAL_BASE} bg-[linear-gradient(115deg,#fff6d6_0%,#f3d78b_20%,#b07c24_42%,#ffe9b3_58%,#d9a63d_78%,#fff3c6_100%)] text-[#2f2206]\`;
const copper = \`\${METAL_BASE} bg-[linear-gradient(115deg,#ffe7d8_0%,#eda173_20%,#8d4728_42%,#ffd6bb_58%,#c9784a_78%,#ffe2cd_100%)] text-[#34180b]\`;
const chrome = \`\${METAL_BASE} bg-[linear-gradient(115deg,#c8d3ff_0%,#e5caff_18%,#ffd3e7_36%,#c9ffea_54%,#c9e7ff_72%,#e7daff_88%,#c8d3ff_100%)] text-gray-900\`;
const steel = \`\${METAL_BASE} bg-[linear-gradient(115deg,#3a3f4a_0%,#20242c_22%,#596172_42%,#2b303a_58%,#454b58_78%,#23272f_100%)] text-gray-100\`;

<div className="p-24 br-24 border border-white/10 bg-[linear-gradient(180deg,#0c0e12,#15171d)]">
  <button className={gold}>Золото</button>
  <button className={copper}>Медь</button>
  <button className={chrome}>Хром</button>
  <button className={steel}>Сталь</button>
</div>`}
        >
          <div className="p-24 br-24 border border-white/10 bg-[radial-gradient(140%_120%_at_15%_0%,rgb(58_63_74/0.55),transparent_55%),radial-gradient(120%_120%_at_85%_100%,rgb(74_63_120/0.5),transparent_55%),linear-gradient(180deg,#0c0e12,#15171d)]">
            <p className="font-11 font-w-700 uppercase letter-s-6 text-white/50">
              Металлическая коллекция
            </p>
            <div className="mt-16 flex flex-wrap items-center gap-14">
              <button type="button" className={METAL}>
                <Crown width={18} height={18} aria-hidden="true" /> Серебро
              </button>
              <button type="button" className={METAL_GOLD}>
                <Sparkles width={18} height={18} aria-hidden="true" /> Золото
              </button>
              <button type="button" className={METAL_COPPER}>
                <Diamond width={18} height={18} aria-hidden="true" /> Медь
              </button>
              <button type="button" className={METAL_CHROME}>
                <Star width={18} height={18} aria-hidden="true" /> Хром
              </button>
              <button type="button" className={METAL_STEEL}>
                Сталь
              </button>
            </div>
            <p className="mt-14 font-12 text-white/40">
              Наведите и нажмите: градиент переливается вперёд, кнопка
              приподнимается, блик становится ярче.
            </p>
          </div>
        </Example>
        <Callout tone="tip">
          Как устроено: <Code>bg-[linear-gradient(…)]</Code> +{" "}
          <Code>bg-[size:220%_100%]</Code> + <Code>bg-[position:0%_50%]</Code> —
          при наведении позиция едет в <Code>100%_50%</Code>, при нажатии — в{" "}
          <Code>200%_50%</Code> (в движке <Code>active:</Code> сильнее{" "}
          <Code>hover:</Code>): градиент «переливается» и от клика. Блик —
          псевдоэлемент <Code>before:</Code> с радиальным градиентом и{" "}
          <Code>hover:before:opacity-95</Code>.
        </Callout>
      </Part>

      <Part
        id="future"
        title="Будущее"
        lead={
          <>
            Эффекты для тёмных интерфейсов: неон, аврора, маршрут и 3D. Все — на
            переходах, без <Code>@keyframes</Code>: плавно, без нагрузки на
            телефон.
          </>
        }
      >
        <Example
          title="неон, аврора и объём"
          code={`<button className="... bg-gray-950 text-white border border-secondary/40 shadow-[0_0_24px_-6px_var(--secondary)] transition-[box-shadow,translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-[0_0_40px_-4px_var(--secondary)]">
  <Bolt width={18} height={18} /> Неон
</button>
<button className="... bg-gradient-brand bg-[size:220%_100%] bg-[position:0%_50%] text-white transition-[background-position,translate,box-shadow] duration-700 ease-out hover:bg-[position:100%_50%] hover:-translate-y-1 hover:shadow-[0_16px_34px_-14px_color-mix(in_oklab,var(--secondary)_60%,transparent)]">
  Аврора
</button>`}
        >
          <div className="p-20 br-xl border bg-gray-950 flex flex-wrap items-center gap-14">
            <button
              type="button"
              className={`${BTN} bg-gray-950 text-white border border-secondary/40 shadow-[0_0_24px_-6px_var(--secondary)] transition-[box-shadow,translate,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-secondary hover:shadow-[0_0_40px_-4px_var(--secondary)]`}
            >
              <Bolt width={18} height={18} aria-hidden="true" /> Неон
            </button>
            <button
              type="button"
              className={`${BTN} bg-gradient-brand bg-[size:220%_100%] bg-[position:0%_50%] text-white transition-[background-position,translate,box-shadow] duration-700 ease-out hover:bg-[position:100%_50%] hover:-translate-y-1 hover:shadow-[0_16px_34px_-14px_color-mix(in_oklab,var(--secondary)_60%,transparent)]`}
            >
              Аврора
            </button>
            <button
              type="button"
              className={`${BTN} bg-secondary text-secondary-foreground shadow-[0_6px_0_var(--violet-700)] transition-[translate,box-shadow] duration-150 active:translate-y-1 active:shadow-[0_2px_0_var(--violet-700)]`}
            >
              Объём
            </button>
          </div>
        </Example>
        <Callout tone="warning">
          Неон и аврора задуманы на тёмном фоне: на светлом им нужно сменить
          цвета. Тени вроде <Code>shadow-[0_0_24px_-6px_var(--secondary)]</Code>{" "}
          на слабых телефонах дорогие — держите их для одной-двух главных кнопок
          на странице.
        </Callout>
      </Part>

      <Part
        id="themes"
        title="Светлая и тёмная"
        lead={
          <>
            Токены меняются сами: на <Code>[data-theme=&quot;dark&quot;]</Code>{" "}
            кнопки перекрашиваются без правок разметки. Металлик имеет отдельный
            тёмный градиент через <Code>dark:</Code>.
          </>
        }
      >
        <div className="flex flex-col gap-14">
          <div className="p-20 br-xl border bg-background text-foreground flex flex-wrap items-center gap-10">
            <span className="w-full font-11 font-w-700 uppercase letter-s-6 text-foreground-subtle">
              Светлая
            </span>
            <button
              type="button"
              className={`${BTN} bg-primary text-primary-foreground hover:opacity-85`}
            >
              Главная
            </button>
            <button type="button" className={`${BTN} border bg-surface`}>
              Обычная
            </button>
            <button type="button" className={METAL}>
              Металлик
            </button>
            <button
              type="button"
              className={`${BTN} bg-accent text-accent-foreground`}
            >
              Акцент
            </button>
          </div>
          <div
            data-theme="dark"
            className="p-20 br-xl border bg-background text-foreground flex flex-wrap items-center gap-10"
          >
            <span className="w-full font-11 font-w-700 uppercase letter-s-6 text-foreground-subtle">
              Тёмная
            </span>
            <button
              type="button"
              className={`${BTN} bg-primary text-primary-foreground hover:opacity-85`}
            >
              Главная
            </button>
            <button type="button" className={`${BTN} border bg-surface`}>
              Обычная
            </button>
            <button type="button" className={METAL}>
              Металлик
            </button>
            <button
              type="button"
              className={`${BTN} bg-accent text-accent-foreground`}
            >
              Акцент
            </button>
          </div>
        </div>
      </Part>

      <Part
        id="code"
        title="Код целиком"
        lead={
          <>
            Вся основа и эффекты — в одном файле. <Code>BTN</Code> — общая
            часть, дальше каждый вариант добавляет свой цвет и движение. Иконки
            — <Code>@boxicons/react</Code> (необязательно).
          </>
        }
      >
        <CodeBlock
          file="app/page.tsx"
          code={`import { ArrowRight } from "@boxicons/react/ArrowRight";
import { Plus } from "@boxicons/react/Plus";
import { Trash } from "@boxicons/react/Trash";

const BTN =
  "inline-flex items-center justify-center gap-8 h-44 px-20 br-full font-13 font-w-600 select-none transition-[background-color,border-color,color,box-shadow,translate,scale] duration-200 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary active:scale-97";

// металлик: стальной градиент, бегущий блик, тёмная сталь через dark:
const METAL =
  "relative isolate overflow-hidden inline-flex items-center justify-center gap-8 h-46 px-24 br-full font-13 font-w-700 select-none text-gray-950 dark:text-gray-100 border border-white/60 dark:border-white/10 bg-[linear-gradient(115deg,#f6f7fa_0%,#dfe3ea_22%,#aeb6c6_42%,#f3f5f9_58%,#c7cdd9_78%,#e9ecf2_100%)] dark:bg-[linear-gradient(115deg,#3a3f4a_0%,#20242c_22%,#596172_42%,#2b303a_58%,#454b58_78%,#23272f_100%)] bg-[size:220%_100%] bg-[position:0%_50%] shadow-[inset_0_1px_0_rgb(255_255_255/0.85),inset_0_-2px_4px_rgb(0_0_0/0.18),0_2px_4px_rgb(0_0_0/0.14),0_10px_24px_-10px_rgb(0_0_0/0.35)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.14),inset_0_-2px_4px_rgb(0_0_0/0.5),0_2px_4px_rgb(0_0_0/0.4),0_10px_24px_-10px_rgb(0_0_0/0.6)] transition-[background-position,translate,scale,box-shadow] duration-700 ease-out motion-reduce:transition-none hover:bg-[position:100%_50%] hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.95),inset_0_-2px_4px_rgb(0_0_0/0.18),0_4px_8px_rgb(0_0_0/0.14),0_18px_34px_-12px_rgb(0_0_0/0.4)] active:translate-y-0 active:scale-97 before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(120%_90%_at_50%_0%,rgb(255_255_255/0.85),transparent_55%)] before:opacity-60 before:transition-opacity before:duration-500 hover:before:opacity-95";

export default function Page() {
  return (
    <div className="flex flex-col gap-20 p-24">
      <div className="flex flex-wrap items-center gap-10">
        <button type="button" className={\`\${BTN} bg-primary text-primary-foreground shadow-2 hover:opacity-85\`}>
          Сохранить
        </button>
        <button type="button" className={\`\${BTN} border bg-surface hover:bg-surface-muted\`}>
          <Plus width={18} height={18} /> Создать
        </button>
        <button type="button" className={\`\${BTN} text-foreground-muted hover:text-foreground hover:bg-foreground/5\`}>
          Позже
        </button>
        <button type="button" className={\`\${BTN} bg-danger text-white hover:opacity-85\`}>
          <Trash width={18} height={18} /> Удалить
        </button>
        <button type="button" className={\`\${BTN} bg-accent text-accent-foreground hover:opacity-85\`}>
          Акцент
        </button>
        <button type="button" className={\`\${BTN} border border-secondary text-secondary hover:bg-secondary/10\`}>
          Контур
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-10">
        <button type="button" className={\`\${BTN} bg-primary text-primary-foreground transition-[translate,box-shadow] duration-300 ease-spring hover:-translate-y-1 hover:shadow-5\`}>
          Поднять
        </button>
        <button type="button" className={\`\${BTN} bg-primary text-primary-foreground shadow-[0_5px_0_var(--primary-hover)] transition-[translate,box-shadow] duration-150 active:translate-y-1 active:shadow-[0_1px_0_var(--primary-hover)]\`}>
          Твёрдая
        </button>
        <button type="button" className={\`\${BTN} border border-secondary text-secondary bg-[linear-gradient(90deg,var(--secondary)_50%,transparent_50%)] bg-[size:210%_100%] bg-[position:100%_0] transition-[background-position,color] duration-500 ease-out hover:bg-[position:0%_0] hover:text-secondary-foreground\`}>
          Заливка
        </button>
        <button type="button" className={\`\${BTN} border bg-surface group\`}>
          Далее
          <ArrowRight width={18} height={18} className="transition-transform duration-300 ease-spring-bouncy group-hover:translate-x-1" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-10">
        <button type="button" className={METAL}>Металлик</button>
        <button type="button" className={METAL}>Премиум</button>
        <button type="button" className={\`\${BTN} bg-gradient-brand bg-[size:220%_100%] bg-[position:0%_50%] text-white transition-[background-position,translate,box-shadow] duration-700 ease-out hover:bg-[position:100%_50%] hover:-translate-y-1\`}>
          Аврора
        </button>
        <button type="button" className={\`\${BTN} bg-gray-950 text-white border border-secondary/40 shadow-[0_0_24px_-6px_var(--secondary)] transition-[box-shadow,translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-secondary hover:shadow-[0_0_40px_-4px_var(--secondary)]\`}>
          Неон
        </button>
        <button type="button" disabled className={\`\${BTN} bg-primary text-primary-foreground disabled:opacity-45 disabled:pointer-events-none\`}>
          Недоступно
        </button>
      </div>
    </div>
  );
}`}
        />
      </Part>

      <Part id="classes" title="Что за классы">
        <Table
          head={["Часть", "Классы", "Что делает"]}
          rows={[
            [
              "Основа",
              "h-44 px-20 br-full font-13 font-w-600",
              "высота, отступы, форма и шрифт — у всех кнопок",
            ],
            [
              "Цвет",
              "bg-primary / bg-secondary / bg-accent / bg-success / bg-danger, border, liquid-glass",
              "фон и рамка из токенов темы",
            ],
            [
              "Состояния",
              "hover:opacity-85, focus-visible:outline-2, active:scale-97, disabled:opacity-45",
              "наведение, фокус с клавиатуры, нажатие, выключение",
            ],
            [
              "Движение",
              "transition-[translate,box-shadow] duration-300 ease-spring hover:-translate-y-1",
              "подъём, утапливание, заливка, блик — только translate/scale/тени",
            ],
            [
              "Доступность",
              "motion-reduce:transition-none, aria-label у кнопок-иконок",
              "без анимации при «уменьшении движения», понятные скринридеру",
            ],
          ]}
        />
        <Callout tone="tip">
          Кнопка — это классы, а не компонент: так её не надо обновлять вместе с
          библиотекой. Если нужна одна общая основа — вынесите <Code>BTN</Code>{" "}
          в константу своего проекта, как в примере выше.
        </Callout>
      </Part>
    </ComponentPage>
  );
}
