// Платформа справки — Next.js, React, Node.js или HTML/CSS: выбирается вверху левого меню (и в окне быстрого
// доступа на телефоне), запоминается в браузере и общая для всех страниц: установка показывает шаги под неё,
// конструкторы — код (JSX для Next.js и React, HTML для Node.js и HTML/CSS). По умолчанию — Next.js.
// Без контекста: общее хранилище на useSyncExternalStore, выбор в одной вкладке браузера видят и другие.

import { useSyncExternalStore } from "react";
import {
  DEFAULT_PLATFORM,
  DOCS_PLATFORMS,
  type DocsPlatform,
} from "./_platform-data";

export type { DocsPlatform };
export { DOCS_PLATFORMS };

const KEY = "docs-platform";
const DEFAULT: DocsPlatform = DEFAULT_PLATFORM;
const listeners = new Set<() => void>();

export function readPlatform(): DocsPlatform {
  try {
    const saved = localStorage.getItem(KEY);
    return DOCS_PLATFORMS.find((p) => p.id === saved)?.id ?? DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function choosePlatform(platform: DocsPlatform) {
  if (platform === readPlatform()) return;
  try {
    localStorage.setItem(KEY, platform);
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

// на сервере и при оживлении — Next.js, сразу после — сохранённый выбор
export const useDocsPlatform = () =>
  useSyncExternalStore(subscribe, readPlatform, () => DEFAULT);

// код в JSX — для Next.js и React; для Node.js и HTML/CSS — разметка HTML
export const usesJsx = (platform: DocsPlatform) =>
  platform === "nextjs" || platform === "react";
