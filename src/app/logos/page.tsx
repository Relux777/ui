// Выбор логотипа RenDit UI: каждый вариант — крупно, на тёмном и акцентном фоне,
// в маленьких размерах (как иконка вкладки) и рядом с названием. SVG можно скопировать или скачать.

import type { Metadata } from "next";
import { CopySvg } from "./copy-svg";
import { LogoMark, MARKS } from "./marks";

export const metadata: Metadata = { title: "Логотип" };

const num = (i: number) => String(i + 1).padStart(2, "0");

// выбранный логотип — 04 «Layers» (src/assets/svg/Rendit_UI_logo.svg)
const CHOSEN = 3;

export default function LogosPage() {
  return (
    <main className="container py-48 flex flex-col gap-40">
      <div className="flex flex-col gap-12 max-w-720">
        <h1 className="font-40 md:font-48 font-w-700 -letter-s-3 leading-1.1">
          Логотип RenDit UI
        </h1>
        <p className="font-17 text-foreground-muted">
          Выбран вариант 04 «Layers»: три слоя каскада — theme, base, utilities.
          Он уже стоит в шапке, фавиконе, иконке для телефона и превью для
          соцсетей. Остальные варианты оставлены для сравнения.
        </p>
      </div>

      <div className="grid grid-fill-300 gap-20">
        {MARKS.map((mark, i) => (
          <article
            key={mark.name}
            className={`flex flex-col br-xl bg-surface overflow-hidden transition hover:shadow-4 ${i === CHOSEN ? "border-2 border-primary" : "border"}`}
          >
            {/* крупно */}
            <div
              data-logo={i}
              className="h-180 flex items-center justify-center bg-background text-foreground"
            >
              <LogoMark index={i} id={`logo-${i}-main`} size={88} />
            </div>

            {/* на тёмном, на акценте, маленькие размеры */}
            <div className="grid grid-cols-3 border-t border-b">
              <div className="h-72 flex items-center justify-center bg-surface-inverse text-foreground-inverse">
                <LogoMark index={i} id={`logo-${i}-inv`} size={36} />
              </div>
              <div className="h-72 flex items-center justify-center bg-accent text-accent-foreground">
                <LogoMark index={i} id={`logo-${i}-acc`} size={36} />
              </div>
              <div className="h-72 flex items-center justify-center gap-10 text-foreground">
                <LogoMark index={i} id={`logo-${i}-s16`} size={16} />
                <LogoMark index={i} id={`logo-${i}-s24`} size={24} />
                <LogoMark index={i} id={`logo-${i}-s32`} size={32} />
              </div>
            </div>

            {/* с названием и описание */}
            <div className="flex flex-col gap-14 p-20 flex-1">
              <div className="flex items-center gap-10">
                <LogoMark
                  index={i}
                  id={`logo-${i}-lock`}
                  size={30}
                  className="text-foreground"
                />
                <span className="font-20 font-w-700 -letter-s-2">
                  RenDit UI
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="flex items-center gap-8 font-15 font-w-500">
                  <span className="px-8 py-2 br-full bg-surface-muted font-12 font-mono">
                    {num(i)}
                  </span>
                  {mark.name}
                  {i === CHOSEN && (
                    <span className="ml-auto px-8 py-2 br-full bg-accent text-accent-foreground font-12">
                      выбран
                    </span>
                  )}
                </h2>
                <p className="font-13 text-foreground-muted">{mark.idea}</p>
              </div>
              <div className="mt-auto">
                <CopySvg
                  target={String(i)}
                  fileName={`rendit-logo-${num(i)}.svg`}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
