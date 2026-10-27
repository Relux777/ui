"use client";

// Команда установки пакета с вкладками npm · pnpm · yarn · bun — как в документации HeroUI и boxicons.
// Выбор общий для всех таких блоков и запоминается в браузере: переключили в одном — переключились все.

import { Terminal } from "@boxicons/react/Terminal";
import { useSyncExternalStore } from "react";
import { CopyButton } from "./copy-button";

const MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
type Manager = (typeof MANAGERS)[number];

const KEY = "package-manager";
const listeners = new Set<() => void>();

function read(): Manager {
  try {
    const saved = localStorage.getItem(KEY);
    return MANAGERS.find((m) => m === saved) ?? "npm";
  } catch {
    return "npm";
  }
}

function choose(manager: Manager) {
  try {
    localStorage.setItem(KEY, manager);
  } catch {}
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // выбрали в другой вкладке браузера
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener();
  };
  addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    removeEventListener("storage", onStorage);
  };
}

// пакет в devDependencies: npm i -D · pnpm add -D · yarn add -D · bun add -d
function installCommand(manager: Manager, pkg: string, dev: boolean) {
  const flag = !dev ? "" : manager === "bun" ? " -d" : " -D";
  return manager === "npm"
    ? `npm i${flag} ${pkg}`
    : `${manager} add${flag} ${pkg}`;
}

export function InstallCommand({
  pkg,
  dev = false,
}: {
  pkg: string;
  dev?: boolean;
}) {
  // на сервере и при гидратации — npm, сразу после — сохранённый выбор
  const manager = useSyncExternalStore(subscribe, read, () => "npm" as const);
  const command = installCommand(manager, pkg, dev);

  return (
    <div className="min-w-0 br-xl border bg-surface overflow-hidden">
      <div className="flex items-center gap-2 h-44 pl-14 pr-6 border-b bg-surface-muted/60">
        <Terminal
          size="xs"
          className="shrink-0 mr-6 text-foreground-muted"
          aria-hidden="true"
        />
        <fieldset className="flex gap-2 min-w-0 m-0 p-0 border-0 overflow-x-auto scrollbar-none">
          <legend className="sr-only">Менеджер пакетов</legend>
          {MANAGERS.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={m === manager}
              onClick={() => choose(m)}
              className="h-28 px-10 br-full font-12 font-mono text-foreground-muted transition hover:text-foreground aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2"
            >
              {m}
            </button>
          ))}
        </fieldset>
        <CopyButton text={command} className="ml-auto" />
      </div>
      <pre className="p-16 font-13/22 font-mono overflow-x-auto whitespace-pre">
        <code className="before:content-['$'] before:mr-10 before:text-foreground-subtle">
          {command}
        </code>
      </pre>
    </div>
  );
}
