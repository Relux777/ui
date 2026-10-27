// Витрина анимаций шапки: каждый вариант — в своём «окне браузера», которое можно прокручивать.
// Настоящая шапка сайта (components/Header) не тронута. Выбрали вариант — переносим его в Header.
// Варианты — _lab/variants.tsx, окно — _lab/stage.tsx, стили только этой страницы — header.module.scss.

import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Stage } from "./_lab/stage";
import {
  Aurora,
  BurgerDrop,
  Droplets,
  Headroom,
  Island,
  LiquidGlass,
  Pair,
  ProgressiveBlur,
  ProgressWave,
  Ripple,
  Shrink,
  Spotlight,
  Stretchy,
} from "./_lab/variants";
import s from "./header.module.scss";

export const metadata: Metadata = {
  title: "Анимации шапки",
  robots: { index: false, follow: false },
};

type Variant = {
  id: string;
  title: string;
  text: string;
  tries: string[];
  View: ComponentType;
};

const VARIANTS: Variant[] = [
  {
    id: "liquid",
    title: "Жидкое стекло",
    text: "Liquid Glass как в iOS 26: толстое стекло с радужной кромкой и бликом. В Chrome и Edge фон под панелью по-настоящему преломляется у краёв (SVG-фильтр), в Safari и Firefox — то же стекло без преломления. Линза под пунктом едет на пружине, при нажатии надувается. При прокрутке панель сужается.",
    tries: ["прокрутите окно", "водите курсором по пунктам", "зажмите пункт"],
    View: LiquidGlass,
  },
  {
    id: "droplets",
    title: "Капли",
    text: "Шапка — единая капля воды. При прокрутке она распадается на три капли — логотип, меню и кнопки — с «перемычками», как настоящая жидкость. Прокрутили наверх — капли снова сливаются.",
    tries: ["прокрутите вниз и обратно наверх"],
    View: Droplets,
  },
  {
    id: "island",
    title: "Динамический остров",
    text: "Наверху — обычная чёрная шапка. При прокрутке сжимается в маленький остров по центру с текущим разделом. Навели или нажали — остров пружинисто раскрывается в меню.",
    tries: ["прокрутите вниз", "наведите на остров", "выберите раздел"],
    View: Island,
  },
  {
    id: "headroom",
    title: "Прячется и возвращается",
    text: "Крутите вниз — шапка быстро уезжает и не мешает читать. Чуть прокрутили вверх — возвращается с упругим перелётом и стеклянным фоном.",
    tries: ["прокрутите вниз", "потом немного вверх"],
    View: Headroom,
  },
  {
    id: "shrink",
    title: "Сжатие, как на сайте",
    text: "Как шапка RenDit UI сейчас: прозрачная во всю ширину, по мере прокрутки сужается, меню по центру уходит, появляется кромка shadow-7. Всё идёт ровно за прокруткой.",
    tries: ["прокручивайте медленно"],
    View: Shrink,
  },
  {
    id: "ripple",
    title: "Рябь на воде",
    text: "Стеклянная панель как поверхность воды: по ней медленно плывут блики, а нажатие в любом месте пускает круги и заставляет панель «желейно» вздрогнуть.",
    tries: ["нажимайте в разные места шапки", "быстро несколько раз подряд"],
    View: Ripple,
  },
  {
    id: "aurora",
    title: "Северное сияние",
    text: "Кромка из фирменных цветов медленно вращается, под панелью — мягкое свечение. При прокрутке свечение становится ярче.",
    tries: ["прокрутите окно"],
    View: Aurora,
  },
  {
    id: "spotlight",
    title: "Прожектор",
    text: "Свет идёт за курсором: пятно по стеклу и подсвеченный кусок кромки рядом с курсором. Только для мыши — на телефоне шапка просто стеклянная.",
    tries: ["водите курсором по шапке"],
    View: Spotlight,
  },
  {
    id: "wave",
    title: "Волна прогресса",
    text: "Шапка наливается цветом слева направо по мере чтения страницы, передний край — бегущая волна.",
    tries: ["прокрутите до конца"],
    View: ProgressWave,
  },
  {
    id: "stretchy",
    title: "Тянучка",
    text: "Плашка под пунктом меню едет гусеницей: передний край убегает быстро, задний догоняет — по пути плашка вытягивается и пружинисто собирается.",
    tries: ["быстро ведите курсором от первого пункта к последнему"],
    View: Stretchy,
  },
  {
    id: "burger",
    title: "Капля-меню",
    text: "При прокрутке панель стекает вправо в круглую каплю. Нажали — из неё разливается стеклянный лист со ссылками, иконка меню превращается в крестик.",
    tries: ["прокрутите вниз", "нажмите на каплю", "закройте крестиком"],
    View: BurgerDrop,
  },
  {
    id: "blur",
    title: "Прогрессивное размытие",
    text: "Как в iOS: у шапки нет плашки, страница под ней размывается всё сильнее к верхнему краю. Без резкой границы — шапка будто растворена в контенте.",
    tries: ["прокрутите — смотрите на картинки под шапкой"],
    View: ProgressiveBlur,
  },
  {
    id: "pair",
    title: "Две таблетки",
    text: "Наверху шапка полностью прозрачная. При прокрутке логотип остаётся на своём месте и получает круглую стеклянную таблетку, надпись и меню уходят, кнопки справа остаются в своей таблетке. У таблеток размытие blur 12 и тень shadow-7.",
    tries: ["прокрутите вниз и обратно наверх"],
    View: Pair,
  },
];

const num = (i: number) => String(i + 1).padStart(2, "0");

export default function HeaderLabPage() {
  return (
    <main className="container py-48 flex flex-col gap-40">
      <div className="flex flex-col gap-16 max-w-760">
        <h1 className="font-40 md:font-48 font-w-700 -letter-s-3 leading-1.1">
          Анимации шапки
        </h1>
        <p className="font-17 text-foreground-muted">
          {VARIANTS.length} вариантов, каждый — в своём окне: его можно
          прокручивать, пункты — нажимать. Шапка сайта наверху настоящая и не
          менялась. Пружины — токены{" "}
          <code className="font-mono font-15">ease-spring</code> и{" "}
          <code className="font-mono font-15">ease-spring-bouncy</code>, стекло
          — миксин <code className="font-mono font-15">liquid-glass</code>.
        </p>
        <nav aria-label="Варианты" className={s.jump}>
          {VARIANTS.map((v, i) => (
            <a key={v.id} href={`#${v.id}`}>
              {num(i)} {v.title}
            </a>
          ))}
        </nav>
      </div>

      <div className={s.list}>
        {VARIANTS.map(({ id, title, text, tries, View }, i) => (
          <article key={id} id={id} className="flex flex-col gap-16">
            <div className="flex flex-col gap-8 max-w-760">
              <h2 className="flex items-center gap-8 font-22 font-w-700 -letter-s-2">
                <span className="px-8 py-2 br-full bg-surface-muted font-12 font-mono font-w-500">
                  {num(i)}
                </span>
                {title}
              </h2>
              <p className="font-15 text-foreground-muted">{text}</p>
              <ul className={s.tries}>
                {tries.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <Stage label={`Вариант ${num(i)}: ${title}`}>
              <View />
            </Stage>
          </article>
        ))}
      </div>
    </main>
  );
}
