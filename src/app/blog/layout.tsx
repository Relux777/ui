// Блог — отдельный раздел со своим меню: слева разделы (с 990px), на телефоне — строка чипов над записями.
// Меню при переходах внутри блога стоит на месте, проявляется только страница (.route-enter).

import type { Metadata } from "next";
import { BlogMenu } from "./_blog-menu";

export const metadata: Metadata = {
  title: { default: "Блог", template: "%s — Блог RenDit UI" },
};

export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  return (
    <div className="container py-48 max-sm:pt-24 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)] gap-32 lg:gap-48">
      <aside className="min-w-0">
        <div className="lg:sticky lg:top-80">
          <BlogMenu />
        </div>
      </aside>
      <main className="route-enter min-w-0 flex flex-col gap-48">
        {children}
      </main>
    </div>
  );
}
