"use client";

import { Check } from "@boxicons/react/Check";
import { Copy } from "@boxicons/react/Copy";
import { useState } from "react";

// className — где стоит кнопка: по умолчанию в правом верхнем углу блока кода
export function CopyButton({
  text,
  className = "absolute top-10 right-10",
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    // буфер обмена недоступен без HTTPS (адрес из локальной сети на телефоне) или без разрешения — молча ничего
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`${className} size-32 shrink-0 br-md flex items-center justify-center bg-surface text-foreground-muted border transition hover:text-foreground active:scale-92`}
      aria-label={copied ? "Скопировано" : "Скопировать код"}
    >
      {copied ? (
        <Check size="xs" className="text-success" />
      ) : (
        <Copy size="xs" />
      )}
    </button>
  );
}
