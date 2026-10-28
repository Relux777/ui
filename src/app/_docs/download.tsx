// «Скачать RenDit UI»: архив последней версии с GitHub, готовый CSS с CDN одной строкой и ссылка на репозиторий.
// Ставится на установку и во вкладку «Обновления». Адреса — config/release.ts.

import { ArrowDown } from "@boxicons/react/ArrowDown";
import { Github } from "@boxicons/react/Github";
import { cdnCss, REPO_URL, VERSION, zipUrl } from "@/config/release";
import { CopyButton } from "./copy-button";

export function DownloadCard() {
  const link = `<link rel="stylesheet" href="${cdnCss()}">`;
  return (
    <div className="relative isolate flex flex-col gap-16 p-16 sm:p-20 br-2xl border bg-surface shadow-2 overflow-hidden before:absolute before:inset-0 before:-z-1 before:bg-[radial-gradient(70%_120%_at_100%_0%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent),radial-gradient(60%_100%_at_0%_100%,color-mix(in_oklab,var(--secondary)_8%,transparent),transparent)]">
      <div className="flex flex-wrap items-center gap-12">
        <div className="flex flex-col gap-2 mr-auto">
          <span className="flex items-center gap-8 font-17 font-w-700">
            RenDit UI
            <span className="px-8 py-2 br-full bg-accent text-accent-foreground font-12 font-w-700">
              v{VERSION}
            </span>
          </span>
          <span className="font-13 text-foreground-muted">
            Движок, RenDit SCSS, конфиг и готовый CSS — одним архивом
          </span>
        </div>
        <a
          href={zipUrl()}
          className="flex items-center gap-8 h-40 px-16 br-full bg-primary text-primary-foreground font-14 font-w-600 transition hover:bg-primary-hover active:scale-97"
        >
          <ArrowDown size="sm" aria-hidden="true" />
          Скачать .zip
        </a>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-8 h-40 px-14 br-full border bg-surface font-14 font-w-600 transition hover:bg-surface-muted active:scale-97"
        >
          <Github size="sm" aria-hidden="true" />
          GitHub
        </a>
      </div>
      <div className="flex flex-col gap-6">
        <span className="font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle">
          Или готовый CSS с CDN — для HTML без сборки
        </span>
        <div className="flex items-center gap-8 pl-12 pr-6 py-6 br-lg border bg-surface-muted/50">
          <code className="flex-1 min-w-0 truncate font-12 font-mono text-foreground-muted">
            {link}
          </code>
          <CopyButton text={link} className="shrink-0" />
        </div>
      </div>
    </div>
  );
}
