"use client";

// Копирование с откликом — везде одинаково: иконка на пружине сменяется галочкой (старая сжимается
// с поворотом), вокруг кнопки расходится зелёное кольцо, рядом выскакивает «Скопировано».
// useCopy — состояние и запись в буфер; CopyIcon и Copied — части отклика для своих кнопок («Ссылка» на
// установке, «SVG» на /logos); CopyButton — готовая кнопка для блоков кода.

import { Check } from "@boxicons/react/Check";
import { Copy } from "@boxicons/react/Copy";
import { useEffect, useRef, useState } from "react";

const SHOWN_MS = 1600;

export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (text: string) => {
    // буфер обмена недоступен без HTTPS (адрес из локальной сети на телефоне) или без разрешения — молча ничего
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    clearTimeout(timer.current);
    setCopied(true);
    timer.current = window.setTimeout(() => setCopied(false), SHOWN_MS);
  };
  return [copied, copy] as const;
}

// иконка → галочка: лежат друг на друге, меняются на пружине
export function CopyIcon({
  copied,
  Icon = Copy,
}: {
  copied: boolean;
  Icon?: typeof Copy;
}) {
  return (
    <span
      className="relative grid place-items-center shrink-0"
      aria-hidden="true"
    >
      <Icon
        size="xs"
        className={`transition-[scale,opacity,rotate] duration-300 ease-spring motion-reduce:transition-none ${copied ? "scale-40 opacity-0 -rotate-90" : ""}`}
      />
      <Check
        size="xs"
        className={`absolute inset-0 text-success transition-[scale,opacity,rotate] duration-500 ease-spring-bouncy motion-reduce:transition-none ${copied ? "" : "scale-0 opacity-0 rotate-90"}`}
      />
    </span>
  );
}

// «Скопировано» — выскакивает слева от кнопки или над ней (кнопке нужен position)
export function Copied({
  copied,
  side = "left",
}: {
  copied: boolean;
  side?: "left" | "top";
}) {
  const place =
    side === "left"
      ? "right-full top-[50%] mr-8 -translate-y-1/2"
      : "bottom-full left-[50%] mb-8 -translate-x-1/2";
  const hidden =
    side === "left"
      ? "opacity-0 scale-90 translate-x-8"
      : "opacity-0 scale-90 translate-y-6";
  return (
    <span
      aria-hidden="true"
      className={`absolute z-10 px-8 py-4 br-full [font-family:var(--font-google-sans),system-ui,sans-serif] bg-foreground text-background font-11 font-w-600 whitespace-nowrap pointer-events-none shadow-2 transition-[opacity,translate,scale] duration-400 ease-spring-bouncy motion-reduce:transition-none ${place} ${copied ? "" : hidden}`}
    >
      Скопировано
    </span>
  );
}

// кольцо вокруг кнопки: расходится, когда скопировано
export const COPIED_RING = (copied: boolean) =>
  `transition-[box-shadow,color,background-color,scale] duration-500 ease-spring motion-reduce:transition-none ${copied ? "shadow-[0_0_0_4px_color-mix(in_oklab,var(--success)_20%,transparent)]" : "shadow-[0_0_0_0_transparent]"}`;

// className — где стоит кнопка: по умолчанию в правом верхнем углу блока кода
export function CopyButton({
  text,
  className = "absolute top-10 right-10",
}: {
  text: string;
  className?: string;
}) {
  const [copied, copy] = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={`${className} ${className.includes("absolute") ? "" : "relative"} size-32 shrink-0 br-md flex items-center justify-center bg-surface text-foreground-muted border hover:text-foreground active:scale-92 ${COPIED_RING(copied)}`}
      aria-label={copied ? "Скопировано" : "Скопировать код"}
    >
      <CopyIcon copied={copied} />
      <Copied copied={copied} />
    </button>
  );
}
