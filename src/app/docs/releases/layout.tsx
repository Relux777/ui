// Вкладка «Обновления» — свой layout: здесь будут версии RenDit UI и что в них нового. Пока заглушка.

export default function ReleasesLayout({
  children,
}: LayoutProps<"/docs/releases">) {
  return (
    <main className="route-enter container py-48 max-sm:pt-24">{children}</main>
  );
}
