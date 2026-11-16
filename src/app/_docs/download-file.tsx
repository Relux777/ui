"use client";

// Кнопка «Скачать» для файлов компонента: берёт уже прочитанный исходник и отдаёт .tsx/.ts
// без сервера и без архива. Так с сайта можно забрать основной файл и положить в проект.

import { ArrowDown } from "@boxicons/react/ArrowDown";
import type { ReactNode } from "react";

const TONE = {
  outline:
    "border bg-surface text-foreground hover:border-secondary hover:text-secondary",
  solid:
    "border-transparent bg-accent text-accent-foreground hover:bg-accent/90",
} as const;

export function DownloadFile({
  code,
  filename,
  children = "Скачать файл",
  variant = "outline",
  className = "",
}: {
  code: string;
  filename: string;
  children?: ReactNode;
  /** solid — главное действие, outline — рядом с ним */
  variant?: keyof typeof TONE;
  className?: string;
}) {
  const download = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.append(a);
    a.click();
    a.remove();
    // даём браузеру начать загрузку, затем освобождаем ссылку
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <button
      type="button"
      onClick={download}
      className={`inline-flex items-center justify-center gap-8 h-38 px-14 br-full border font-13 font-w-600 transition-colors active:scale-97 ${TONE[variant]} ${className}`}
    >
      <ArrowDown size="sm" aria-hidden="true" />
      {children}
    </button>
  );
}
