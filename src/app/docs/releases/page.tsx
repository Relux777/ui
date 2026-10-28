// Обновления: последняя версия со «Скачать» и все версии из CHANGELOG.md — что нового, дата и архив каждой.
// Файл читается при сборке сайта (changelog.ts разбирает его), страница статичная. Как выпускать версию —
// RELEASING.md в корне проекта.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ArrowDown } from "@boxicons/react/ArrowDown";
import type { Metadata } from "next";
import { Fragment } from "react";
import { Code } from "@/app/_docs/docs";
import { DownloadCard } from "@/app/_docs/download";
import { RELEASES_URL, zipUrl } from "@/config/release";
import { inlineParts, parseChangelog } from "./changelog";

export const metadata: Metadata = { title: "Обновления" };

function Inline({ text }: { text: string }) {
  return inlineParts(text).map((p, i) =>
    p.kind === "code" ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: части пункта статичны
      <Code key={i}>{p.text}</Code>
    ) : p.kind === "bold" ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: части пункта статичны
      <strong key={i} className="font-w-600 text-foreground">
        {p.text}
      </strong>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: части пункта статичны
      <Fragment key={i}>{p.text}</Fragment>
    ),
  );
}

export default function ReleasesPage() {
  // пустой «В работе» (сразу после выпуска версии) не показываем
  const releases = parseChangelog(
    readFileSync(join(process.cwd(), "CHANGELOG.md"), "utf8"),
  ).filter((r) => !r.unreleased || r.groups.length);
  const latest = releases.find((r) => !r.unreleased)?.version;

  return (
    <div className="flex flex-col gap-40 max-w-880">
      <header className="flex flex-col gap-12">
        <h1 className="font-36 md:font-48 font-w-700 -letter-s-3 leading-1.1">
          Обновления
        </h1>
        <p className="font-17 text-foreground-muted">
          Что нового в каждой версии RenDit UI. Номер версии —{" "}
          <Code>большая.новая.исправление</Code>: исправления и новое не ломают
          ваш код, большая версия — может.
        </p>
      </header>

      <DownloadCard />

      <ol className="relative flex flex-col gap-16 before:absolute before:left-11 before:top-16 before:bottom-16 before:w-2 before:br-full before:bg-border">
        {releases.map((r) => (
          <li key={r.version} className="relative pl-36">
            <span
              aria-hidden="true"
              className={`absolute left-4 top-18 size-16 br-full border-4 border-background ${r.unreleased ? "bg-foreground/20" : r.version === latest ? "bg-accent" : "bg-secondary"}`}
            />
            <details
              open={r.unreleased || r.version === latest}
              className="group br-xl border bg-surface shadow-1"
            >
              <summary className="flex flex-wrap items-center gap-10 px-16 py-14 cursor-pointer select-none [&::-webkit-details-marker]:hidden">
                <span className="font-20 font-w-700 -letter-s-1">
                  {r.unreleased ? "В работе" : `v${r.version}`}
                </span>
                {r.version === latest && (
                  <span className="px-8 py-2 br-full bg-accent text-accent-foreground font-11 font-w-700">
                    последняя
                  </span>
                )}
                {r.date && (
                  <span className="font-13 text-foreground-muted">
                    {r.date}
                  </span>
                )}
                {!r.unreleased && (
                  <a
                    href={zipUrl(r.version)}
                    className="ml-auto flex items-center gap-6 h-32 px-12 br-full border font-13 font-w-600 transition hover:bg-surface-muted active:scale-97"
                  >
                    <ArrowDown size="xs" aria-hidden="true" />
                    Скачать
                  </a>
                )}
              </summary>
              <div className="flex flex-col gap-16 px-16 pb-18">
                {r.unreleased && (
                  <p className="font-14 text-foreground-muted">
                    Уже на сайте, войдёт в следующую версию.
                  </p>
                )}
                {r.note && (
                  <p className="font-14 text-foreground-muted">
                    <Inline text={r.note} />
                  </p>
                )}
                {r.groups.map((g) => (
                  <section key={g.title} className="flex flex-col gap-8">
                    <h3 className="font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
                      {g.title}
                    </h3>
                    <ul className="flex flex-col gap-6 font-14 text-foreground-muted">
                      {g.items.map((item) => (
                        <li
                          key={item}
                          className="relative pl-16 before:absolute before:left-2 before:top-9 before:size-5 before:br-full before:bg-foreground/30"
                        >
                          <Inline text={item} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </details>
          </li>
        ))}
      </ol>

      <p className="font-14 text-foreground-muted">
        Все архивы — на{" "}
        <a
          href={RELEASES_URL}
          target="_blank"
          rel="noreferrer"
          className="text-secondary underline underline-offset-3"
        >
          странице релизов GitHub
        </a>
        .
      </p>
    </div>
  );
}
