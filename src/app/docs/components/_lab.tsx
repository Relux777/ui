"use client";

// Конструктор компонента: настройки слева, превью в выбранной теме и код справа.
// Это не классы, а готовый компонент, поэтому вместо CSS-панели — код подключения.

import { FileCode } from "@boxicons/react/FileCode";
import type { ReactNode } from "react";
import { useState } from "react";
import { Field, Seg } from "../../_docs/builder";
import { CopyButton } from "../../_docs/copy-button";

const THEMES = [
  { id: "light", title: "Светлая" },
  { id: "dark", title: "Тёмная" },
] as const;

type Theme = (typeof THEMES)[number]["id"];

export function ComponentLab({
  controls,
  preview,
  code,
  file = "page.tsx",
  previewClassName = "",
}: {
  controls: ReactNode;
  preview: ReactNode;
  code: string;
  file?: string;
  previewClassName?: string;
}) {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <div className="br-xl border bg-surface shadow-1 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="flex flex-col gap-16 p-16 sm:p-20 border-b lg:border-b-0 lg:border-r min-w-0">
        {controls}
      </div>
      <div className="flex flex-col gap-14 p-16 sm:p-20 min-w-0 lg:sticky lg:top-80 lg:self-start">
        <Field label="Тема превью">
          <Seg value={theme} options={THEMES} onChange={setTheme} />
        </Field>
        <div
          data-theme={theme}
          data-component-preview
          className={`relative min-h-240 p-20 br-lg border bg-background text-foreground bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_1px)] [background-size:16px_16px] min-w-0 ${previewClassName}`}
        >
          {preview}
        </div>
        <div className="min-w-0 br-lg border bg-surface-muted/50 overflow-hidden">
          <div className="flex items-center gap-8 h-38 px-12 border-b bg-surface-muted/60 font-12 font-mono text-foreground-muted">
            <FileCode size="xs" className="shrink-0" aria-hidden="true" />
            <span className="truncate">{file}</span>
            <CopyButton text={code} className="ml-auto" />
          </div>
          <pre className="p-14 font-13/22 font-mono overflow-x-auto whitespace-pre">
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}
