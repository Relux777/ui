// Вкладка «Установка и настройка»: боковое меню слева (на телефоне — скрыто, переходы через вкладки и ссылки
// на страницах), страница справа. Меню при переходах внутри вкладки стоит на месте, проявляется только
// страница (.route-enter).

import { DocsSidebar } from "../_sidebar";

export default function GettingStartedLayout({
  children,
}: LayoutProps<"/docs">) {
  return (
    <div className="container py-48 max-sm:pt-24 grid lg:grid-cols-[220px_1fr] gap-48">
      {/* меню длиннее экрана прокручивается само, страница при этом стоит */}
      <aside className="max-lg:hidden">
        <div className="sticky top-80 max-h-[calc(100dvh-96px)] -mx-8 px-8 pb-16 overflow-y-auto overscroll-contain scrollbar-thin">
          <DocsSidebar />
        </div>
      </aside>
      <main className="route-enter min-w-0 flex flex-col gap-48">
        {children}
      </main>
    </div>
  );
}
