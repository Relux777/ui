// Две вкладки внутри «Выбора»: примеры и конструктор. Серверные ссылки — работают без JS,
// aria-current показывает выбранную; стиль — таблетки как у DocsTabs.

import Link from "next/link";

const TABS = [
  { id: "select", title: "Селект", href: "/docs/components/select" },
  {
    id: "constructor",
    title: "Конструктор",
    href: "/docs/components/select/constructor",
  },
] as const;

export function SelectTabs({
  active,
}: {
  active: (typeof TABS)[number]["id"];
}) {
  return (
    <nav
      aria-label="Выбор: примеры и конструктор"
      className="self-start flex flex-wrap gap-4 p-3 br-full bg-foreground/5"
    >
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          aria-current={active === tab.id ? "page" : undefined}
          className="h-32 px-14 br-full font-13 font-w-600 whitespace-nowrap text-foreground-muted transition-colors hover:text-foreground aria-[current=page]:bg-surface aria-[current=page]:text-foreground aria-[current=page]:shadow-2"
        >
          {tab.title}
        </Link>
      ))}
    </nav>
  );
}
