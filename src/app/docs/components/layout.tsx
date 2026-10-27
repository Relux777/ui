// Вкладка «Компоненты» — свой layout: здесь будут список компонентов и живое превью с кодом под каждый стек.
// Пока заглушка.

export default function ComponentsLayout({
  children,
}: LayoutProps<"/docs/components">) {
  return (
    <main className="route-enter container py-48 max-sm:pt-24">{children}</main>
  );
}
