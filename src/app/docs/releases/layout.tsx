// Вкладка «Обновления» — свой layout: версии RenDit UI, что в них нового, архив каждой (page.tsx).
// Внизу — переход назад, к «Компонентам» (docs/_pager.tsx).

import { DocsPager } from "../_pager";

export default function ReleasesLayout({
  children,
}: LayoutProps<"/docs/releases">) {
  return (
    <main className="route-enter container py-48 max-sm:pt-24">
      {children}
      <DocsPager className="mt-40" />
    </main>
  );
}
