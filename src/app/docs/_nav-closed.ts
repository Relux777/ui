// Свёрнутые группы меню справки — общие для левого меню и «всего меню» шапки: свернули в одном — свёрнуто
// и в другом, запоминается в браузере. Хранилище — как у платформы (_platform.ts): useSyncExternalStore,
// снимок — строка из localStorage (одна и та же строка — один и тот же снимок, лишних рендеров нет).

import { useMemo, useSyncExternalStore } from "react";

const KEY = "docs-nav-closed";
const listeners = new Set<() => void>();

function readRaw() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw: string): string[] {
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((t) => typeof t === "string") : [];
  } catch {
    return [];
  }
}

// open: true — раскрыть, false — свернуть
export function setGroupOpen(title: string, open: boolean) {
  const list = parse(readRaw());
  if (list.includes(title) !== open) return;
  const next = open ? list.filter((t) => t !== title) : [...list, title];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener();
  };
  addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    removeEventListener("storage", onStorage);
  };
}

// на сервере и при оживлении все группы раскрыты, сразу после — сохранённое
export function useClosedGroups() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  return useMemo(() => parse(raw), [raw]);
}
