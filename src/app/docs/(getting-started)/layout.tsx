// Вкладка «Справка»: левое меню (на телефоне и планшете его нет — всё меню открывает кружок справа в шапке),
// страница справа. Меню при переходах внутри вкладки стоит на месте, проявляется только страница (.route-enter).

import { DocsSidebar } from "../_sidebar";

export default function GettingStartedLayout({
  children,
}: LayoutProps<"/docs">) {
  return (
    <div className="container py-48 max-sm:pt-24 grid lg:grid-cols-[240px_1fr] gap-48">
      {/* меню не выше экрана: платформа и поиск стоят, список групп прокручивается сам (_sidebar.tsx) */}
      <aside className="max-lg:hidden">
        <div className="sticky top-80 max-h-[calc(100dvh-96px)] flex flex-col">
          <DocsSidebar />
        </div>
      </aside>
      <main className="route-enter min-w-0 flex flex-col gap-48">
        {children}
      </main>
    </div>
  );
}
