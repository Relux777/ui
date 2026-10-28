// Шапка «Две таблетки».
// Наверху страницы шапка прозрачная: ни фона, ни размытия. Прокрутили вниз (data-scrolled на <html>, ставит
// встроенный скрипт из scroll-state.ts) — логотип и кнопки справа остаются на своих местах, каждый блок в своей
// стеклянной таблетке (blur 12, shadow-7); название, версия и кнопка темы уходят (тема есть в быстром меню NavBar).
// У самой шапки размытия нет никогда: элемент с backdrop-filter стал бы «корнем» размытия, и стекло таблеток
// внутри него ничего бы не размывало. «Прожектор» (spotlight.tsx) — тусклый свет за курсором по таблеткам.
// Открыли поиск (data-search на <html>, ставит Search) — шапка сворачивается так же, как после прокрутки:
// полю нужно место; на телефоне уходят «Начать» и быстрый переход. В справке по центру — вкладки раздела
// (DocsTabs), третья таблетка; сетка 1fr · auto · 1fr держит их ровно посередине, а с открытым поиском
// сдвигает, но не накрывает. Справа от «Начать» — быстрый переход (QuickNav). Стили — только классы RenDit Code.

import Link from "next/link";
import RenDitLogos from "@/assets/svg/Rendit_UI_logo.svg";
import { DocsTabs } from "@/components/DocsTabs";
import { QuickNav } from "@/components/ui/QuickNav";
import { SearchComponent } from "@/components/ui/Search";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { version } from "../../../package.json";
import { HomeLink } from "./home-link";
import { Spotlight } from "./spotlight";

// таблетка: прозрачная наверху, стеклянная после прокрутки
const PILL =
  "relative isolate br-full transition-[background-color,backdrop-filter,box-shadow,padding,gap] duration-450 ease-out [:is([data-scrolled],[data-search])_&]:bg-background/50 [:is([data-scrolled],[data-search])_&]:backdrop-blur-12 [:is([data-scrolled],[data-search])_&]:shadow-7 motion-reduce:transition-none";
// что уходит после прокрутки: ширина от реальной (auto, interpolate-size) до 0; где interpolate-size нет — max-width
const FOLD =
  "[interpolate-size:allow-keywords] max-w-160 overflow-hidden whitespace-nowrap transition-[width,max-width,opacity,filter] duration-500 ease-spring [:is([data-scrolled],[data-search])_&]:w-0 [:is([data-scrolled],[data-search])_&]:max-w-0 [:is([data-scrolled],[data-search])_&]:opacity-0 [:is([data-scrolled],[data-search])_&]:blur-6 motion-reduce:transition-none";
// кнопка темы после прокрутки сжимается до 0 и гаснет; −5px съедает зазор gap-5. Обрезка (overflow) —
// только в свёрнутом виде, иначе обрезалась бы тень кнопки при наведении
const THEME =
  "flex w-36 transition-[width,margin,opacity,scale,visibility] duration-450 ease-spring [:is([data-scrolled],[data-search])_&]:w-0 [:is([data-scrolled],[data-search])_&]:-ml-5 [:is([data-scrolled],[data-search])_&]:overflow-hidden [:is([data-scrolled],[data-search])_&]:opacity-0 [:is([data-scrolled],[data-search])_&]:scale-50 [:is([data-scrolled],[data-search])_&]:invisible motion-reduce:transition-none";
// свет только на стеклянных таблетках
const SPOT = "hidden [:is([data-scrolled],[data-search])_&]:block";

export default async function HeaderComponent() {
  return (
    // под «чёлкой» и строкой состояния iPhone (приложение с экрана «Домой»): отступ safe-area сверху —
    // margin в начале страницы и top, когда шапка прилипла
    <header className="sticky top-[calc(5px+env(safe-area-inset-top))] mt-[env(safe-area-inset-top)] z-30">
      <nav className="container h-48 grid grid-cols-[1fr_auto_1fr] items-center gap-16">
        <div className="flex items-center gap-10 justify-self-start">
          {/* логотип с названием — одна таблетка, как кнопки справа; −8px — логотип там же, где был.
              После прокрутки название уходит, таблетка сжимается до круга вокруг логотипа.
              На главной клик поднимает страницу наверх (home-link.tsx) */}
          <HomeLink
            className={`${PILL} h-44 -ml-8 pl-8 pr-16 flex items-center gap-10 [:is([data-scrolled],[data-search])_&]:pr-8 [:is([data-scrolled],[data-search])_&]:gap-0 text-foreground font-18 font-w-700 -letter-s-2 whitespace-nowrap`}
          >
            <Spotlight className={SPOT} />
            <RenDitLogos width={28} height={28} />
            <span className={FOLD}>
              RenDit <span className="text-violet-500">UI</span>
            </span>
          </HomeLink>
          <span className={`${FOLD} max-sm:hidden`}>v{version}</span>
        </div>
        {/* только в справке; на телефоне вкладки — в начале страницы и в быстром переходе */}
        <DocsTabs
          variant="header"
          className={`${PILL} col-start-2 [:is([data-scrolled],[data-search])_&]:border-transparent`}
        >
          <Spotlight className={SPOT} />
        </DocsTabs>
        <div
          className={`${PILL} col-start-3 justify-self-end flex items-center gap-5 p-4 -mr-4`}
        >
          <Spotlight className={SPOT} />
          <SearchComponent />
          {/* тема после прокрутки уходит: она есть в быстром меню у NavBar */}
          <span className={THEME}>
            <ThemeToggle />
          </span>
          <Link
            href="/docs/install"
            className="h-36 px-16 br-full flex items-center bg-primary text-primary-foreground font-14 font-w-500 whitespace-nowrap transition hover:bg-primary-hover active:scale-95 max-sm:[[data-search]_&]:hidden"
          >
            Начать
          </Link>
          <QuickNav />
        </div>
      </nav>
    </header>
  );
}
