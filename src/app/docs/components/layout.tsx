// Вкладка «Компоненты» — свой layout: сетка всех компонентов (page.tsx, список — _list.tsx); у готового
// компонента будет своя страница с живым примером и кодом под каждую платформу.

export default function ComponentsLayout({
  children,
}: LayoutProps<"/docs/components">) {
  return (
    <main className="route-enter container py-48 max-sm:pt-24">{children}</main>
  );
}
