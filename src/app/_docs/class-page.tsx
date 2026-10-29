// Каркас страницы классов, как у Tailwind: путь и название берутся из оглавления (docs/_nav.ts), справа —
// оглавление страницы (на широком экране), разделы — Part: заголовок-якорь (попадает в «Быстрый переход»),
// пояснение и содержимое. Порядок на странице: конструктор, таблица «класс → CSS», примеры.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { findDocsLink } from "../docs/_nav";
import { DocHeader, Heading, Lead } from "./docs";
import { Toc, type TocItem } from "./toc";

export const classPageMetadata = (href: string): Metadata => ({
  title: findDocsLink(href).link.title,
});

export function ClassPage({
  href,
  lead,
  toc,
  children,
}: {
  href: string;
  lead: ReactNode;
  toc: TocItem[];
  children: ReactNode;
}) {
  const { group, link } = findDocsLink(href);
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-48">
      <div className="min-w-0 flex flex-col gap-56">
        <DocHeader
          path={[group.title, link.title]}
          title={link.title}
          lead={lead}
        />
        {children}
      </div>
      <aside className="max-xl:hidden">
        <div className="sticky top-80">
          <Toc items={toc} />
        </div>
      </aside>
    </div>
  );
}

export function Part({
  id,
  title,
  lead,
  className = "",
  children,
}: {
  id: string;
  title: string;
  lead?: ReactNode;
  /** конструктору — relative z-1: его выпадающие панели над следующими разделами */
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`flex flex-col gap-16 ${className}`}>
      <Heading id={id}>{title}</Heading>
      {lead && <Lead>{lead}</Lead>}
      {children}
    </section>
  );
}
