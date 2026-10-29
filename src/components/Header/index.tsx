// Шапка «Две таблетки».
// Наверху страницы шапка прозрачная: ни фона, ни размытия. Прокрутили вниз (data-scrolled на <html>, ставит
// встроенный скрипт из scroll-state.ts) — логотип и кнопки справа остаются на своих местах, каждый блок в своей
// стеклянной таблетке (blur 12, shadow-7); название и версия уходят;
// вверху экрана проявляется градиент цвета фона — содержимое плавно уходит под шапку.
// У самой шапки размытия нет никогда: элемент с backdrop-filter стал бы «корнем» размытия, и стекло таблеток
// внутри него ничего бы не размывало. «Прожектор» (spotlight.tsx) — тусклый свет за курсором по таблеткам.
// Открыли поиск (data-search на <html>, ставит Search) — шапка сворачивается так же, как после прокрутки:
// полю нужно место; на телефоне уходят «Начать» и кружок меню. В справке по центру — вкладки раздела
// (DocsTabs), третья таблетка; сетка 1fr · auto · 1fr держит их ровно посередине, а с открытым поиском
// сдвигает, но не накрывает. Справа, отдельным кружком, как логотип слева, — «всё меню» (MenuSheet).
// Тема — в быстром меню NavBar, быстрый переход по странице — там же. Стили — только классы RenDit Code.

import Link from "next/link";
import RenDitLogos from "@/assets/svg/Rendit_UI_logo.svg";
import { DocsTabs } from "@/components/DocsTabs";
import { MenuSheet } from "@/components/ui/MenuSheet";
import { SearchComponent } from "@/components/ui/Search";
import { version } from "../../../package.json";
import { HomeLink } from "./home-link";
import { Spotlight } from "./spotlight";

// таблетка: прозрачная наверху, стеклянная после прокрутки
const PILL =
  "relative isolate br-full transition-[background-color,backdrop-filter,box-shadow,padding,gap] duration-450 ease-out [:is([data-scrolled],[data-search])_&]:bg-background/50 [:is([data-scrolled],[data-search])_&]:backdrop-blur-12 [:is([data-scrolled],[data-search])_&]:shadow-7 motion-reduce:transition-none";
// что уходит после прокрутки: ширина от реальной (auto, interpolate-size) до 0; где interpolate-size нет — max-width
const FOLD =
  "[interpolate-size:allow-keywords] max-w-160 overflow-hidden whitespace-nowrap transition-[width,max-width,opacity,filter] duration-500 ease-spring [:is([data-scrolled],[data-search])_&]:w-0 [:is([data-scrolled],[data-search])_&]:max-w-0 [:is([data-scrolled],[data-search])_&]:opacity-0 [:is([data-scrolled],[data-search])_&]:blur-6 motion-reduce:transition-none";

// свет только на стеклянных таблетках
const SPOT = "hidden [:is([data-scrolled],[data-search])_&]:block";

export default async function HeaderComponent() {
  return (
    // под «чёлкой» и строкой состояния iPhone (приложение с экрана «Домой»): отступ safe-area сверху —
    // margin в начале страницы и top, когда шапка прилипла.
    // ::before — градиент цвета фона вверху экрана (90px, от сплошного к прозрачному): после прокрутки текст
    // плавно уходит под шапку, а не обрезается краем экрана. Под таблетками (z −2), клики проходят насквозь;
    // наверху страницы его нет — там под шапкой свечение .aura
    <header className="sticky top-[calc(5px+env(safe-area-inset-top))] mt-[env(safe-area-inset-top)] z-30 before:fixed before:inset-x-0 before:top-0 before:h-90 before:-z-2 before:pointer-events-none before:bg-[linear-gradient(to_bottom,var(--background)_0%,color-mix(in_oklab,var(--background)_60%,transparent)_50%,transparent_100%)] before:opacity-0 before:transition-opacity before:duration-450 [[data-scrolled]_&]:before:opacity-100 motion-reduce:before:transition-none">
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
        {/* только в справке; на телефоне вкладки — в начале страницы и во «всём меню» */}
        <DocsTabs
          variant="header"
          className={`${PILL} col-start-2 [:is([data-scrolled],[data-search])_&]:border-transparent`}
        >
          <Spotlight className={SPOT} />
        </DocsTabs>
        {/* −8px — кружок меню у края так же, как логотип слева */}
        <div className="col-start-3 justify-self-end flex items-center gap-8 -mr-8">
          <div className={`${PILL} flex items-center gap-5 p-4`}>
            <Spotlight className={SPOT} />
            <SearchComponent />
            <Link
              href="/docs/install"
              className="h-36 px-16 br-full flex items-center bg-primary text-primary-foreground font-14 font-w-500 whitespace-nowrap transition hover:bg-primary-hover active:scale-95 max-sm:[[data-search]_&]:hidden"
            >
              Начать
            </Link>
          </div>
          <MenuSheet className={PILL}>
            <Spotlight className={SPOT} />
          </MenuSheet>
        </div>
      </nav>
    </header>
  );
}
