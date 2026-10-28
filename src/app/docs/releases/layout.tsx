// Вкладка «Обновления» — свой layout: версии RenDit UI, что в них нового, архив каждой (page.tsx).

export default function ReleasesLayout({
  children,
}: LayoutProps<"/docs/releases">) {
  return (
    <main className="route-enter container py-48 max-sm:pt-24">{children}</main>
  );
}
