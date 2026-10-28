"use client";

import { ArrowDown } from "@boxicons/react/ArrowDown";
import { COPIED_RING, Copied, CopyIcon, useCopy } from "../_docs/copy-button";

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
  const [copied, copy] = useCopy();

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
        onClick={() => copy(readSvg(target))}
        aria-label={copied ? "SVG скопирован" : "Скопировать SVG"}
        className={`relative flex items-center gap-6 px-12 py-6 br-full border font-12 hover:bg-surface-muted ${COPIED_RING(copied)}`}
      >
        <CopyIcon copied={copied} />
        SVG
        <Copied copied={copied} side="top" />
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
