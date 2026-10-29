// Страница справки, которая ещё в работе: заголовок и путь из оглавления (docs/_nav.ts), о чём страница
// и план — что на ней будет (docs/_stubs.ts); если на главной уже есть живые примеры по теме — ссылка туда.
// page.tsx такой страницы — две строки: export const metadata = stubMetadata(href) и <DocStub href={…} />.

import { ArrowRight } from "@boxicons/react/ArrowRight";
import { Hourglass } from "@boxicons/react/Hourglass";
import type { Metadata } from "next";
import Link from "next/link";
import { findDocsLink } from "../docs/_nav";
import { DOCS_STUBS } from "../docs/_stubs";
import { DocHeader } from "./docs";

export const stubMetadata = (href: string): Metadata => ({
  title: findDocsLink(href).link.title,
});

export function DocStub({ href }: { href: string }) {
  const { group, link } = findDocsLink(href);
  const stub = DOCS_STUBS[href];
  return (
    <>
      <DocHeader
        path={[group.title, link.title]}
        title={link.title}
        lead={stub.lead}
      />
      <section className="relative isolate flex flex-col gap-16 p-20 sm:p-24 br-2xl border border-dashed overflow-hidden before:absolute before:inset-0 before:-z-1 before:bg-[radial-gradient(70%_120%_at_0%_0%,color-mix(in_oklab,var(--secondary)_6%,transparent),transparent)]">
        <span className="self-start flex items-center gap-6 px-10 py-4 br-full bg-secondary/10 font-12 font-w-600 text-secondary">
          <Hourglass size="xs" aria-hidden="true" />
          Страница в работе
        </span>
        <h2 className="font-19 font-w-700 -letter-s-1">Что здесь будет</h2>
        <ol className="flex flex-col gap-10">
          {stub.plan.map((item, i) => (
            <li key={item} className="flex items-center gap-12 font-15">
              <span className="size-28 shrink-0 br-full grid place-items-center bg-foreground/5 font-12 font-w-700 tabular-nums text-foreground-muted">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
        {link.classes && (
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <span className="font-13 text-foreground-muted">Классы:</span>
            {link.classes.map((c) => (
              <code
                key={c}
                className="px-8 py-2 br-md bg-foreground/5 font-mono font-13"
              >
                {c}
              </code>
            ))}
          </div>
        )}
        {stub.home && (
          <Link
            href={`/#${stub.home}`}
            className="group self-start flex items-center gap-6 mt-4 font-14 font-w-600 text-secondary"
          >
            Живые примеры уже есть на главной
            <ArrowRight
              size="xs"
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-3"
            />
          </Link>
        )}
      </section>
    </>
  );
}
