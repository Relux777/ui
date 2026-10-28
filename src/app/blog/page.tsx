// Блог — заглушка: записей пока нет.

import { Newspaper } from "@boxicons/react/Newspaper";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Блог — RenDit UI" } };

export default function BlogPage() {
  return (
    <>
      <header className="flex flex-col gap-14 max-w-720">
        <h1 className="font-36 md:font-48 font-w-700 -letter-s-3 leading-1.1">
          Блог
        </h1>
        <p className="font-17 text-foreground-muted">
          Новости RenDit UI, уроки и заметки о том, как всё устроено.
        </p>
      </header>
      <div className="flex flex-col items-center gap-12 py-56 px-20 br-2xl border border-dashed text-center">
        <span className="size-56 br-full grid place-items-center bg-surface-muted text-foreground-muted">
          <Newspaper width={28} height={28} aria-hidden="true" />
        </span>
        <p className="font-17 font-w-600">Записей пока нет</p>
        <p className="font-14 text-foreground-muted max-w-360">
          Первые появятся вместе с версией 1.0 — что нового, можно посмотреть в
          «Обновлениях».
        </p>
      </div>
    </>
  );
}
