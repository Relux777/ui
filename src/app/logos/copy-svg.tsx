"use client";

import { ArrowDown } from "@boxicons/react/ArrowDown";
import { Check } from "@boxicons/react/Check";
import { Copy } from "@boxicons/react/Copy";
import { useState } from "react";

// Берёт SVG из блока-превью (data-logo="N") — копирует разметку или скачивает файл.
function readSvg(target: string) {
  const svg = document.querySelector(`[data-logo="${target}"] svg`);
  return svg ? svg.outerHTML : "";
}

export function CopySvg({
  target,
  fileName,
}: {
  target: string;
  fileName: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(readSvg(target));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([readSvg(target)], { type: "image/svg+xml" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-6">
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-6 px-12 py-6 br-full border font-12 transition hover:bg-surface-muted"
      >
        {copied ? <Check size="xs" /> : <Copy size="xs" />}
        {copied ? "Скопировано" : "SVG"}
      </button>
      <button
        type="button"
        onClick={download}
        className="size-30 br-full border flex items-center justify-center transition hover:bg-surface-muted"
        aria-label="Скачать SVG"
      >
        <ArrowDown size="xs" />
      </button>
    </div>
  );
}
