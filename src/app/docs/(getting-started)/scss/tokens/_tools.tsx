"use client";

// Генератор своего цветового токена (имя + цвет в светлой и тёмной теме → SCSS и классы) для страницы «Токены».
// Песочница движения и тени уехали на свои страницы: transition/_playground.tsx и shadows/_switcher.tsx.

import { useState } from "react";
import { CodeBlock } from "../../../../_docs/docs";
import { ColorPicker, CopyClass, nameOf, type Pick } from "../colors/_tools";

const PANEL = "br-xl border bg-surface shadow-1";
const LABEL = "font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle";

const clean = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "brand";

export function TokenGenerator() {
  const [name, setName] = useState("brand");
  const [light, setLight] = useState<Pick>({ family: "pink", step: 500 });
  const [dark, setDark] = useState<Pick>({ family: "pink", step: 400 });
  const token = clean(name);
  const l = nameOf(light);
  const d = nameOf(dark);

  const scss = `// src/assets/scss/settings/_tokens.semantic.scss
:root, [data-theme='light'] {
  --${token}: var(--${l});
}

[data-theme='dark'] {
  --${token}: var(--${d});
}`;

  return (
    <div
      className={`${PANEL} grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]`}
    >
      <div className="flex flex-col gap-16 p-16 sm:p-20 border-b lg:border-b-0 lg:border-r">
        <label className="flex flex-col gap-8">
          <span className={LABEL}>Имя токена</span>
          <span className="flex items-center h-44 px-12 br-lg border bg-surface focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)] transition-[border-color,box-shadow]">
            <span className="font-14 font-mono text-foreground-subtle">--</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              spellCheck={false}
              className="flex-1 min-w-0 h-full bg-transparent font-14 font-mono outline-none touch:text-[16px]"
            />
          </span>
        </label>
        <ColorPicker label="Светлая тема" value={light} onChange={setLight} />
        <ColorPicker label="Тёмная тема" value={dark} onChange={setDark} />
      </div>

      <div className="flex flex-col gap-14 p-16 sm:p-20 min-w-0">
        <div className="grid grid-cols-2 gap-10">
          {(
            [
              ["light", l],
              ["dark", d],
            ] as const
          ).map(([theme, c]) => (
            <div
              key={theme}
              data-theme={theme}
              className="flex flex-col gap-10 p-12 br-lg border bg-background text-foreground"
            >
              <span className="font-11 font-w-600 text-foreground-muted">
                {theme === "light" ? "Светлая" : "Тёмная"}
              </span>
              <span
                className="grid place-items-center h-40 br-full font-13 font-w-600"
                style={{
                  background: `var(--${c})`,
                  color: "var(--background)",
                }}
              >
                bg-{token}
              </span>
              <span
                className="font-15 font-w-700"
                style={{ color: `var(--${c})` }}
              >
                text-{token}
              </span>
              <span
                className="p-8 br-md font-12"
                style={{
                  border: `1px solid color-mix(in oklab, var(--${c}) 30%, transparent)`,
                }}
              >
                border-{token}/30
              </span>
            </div>
          ))}
        </div>
        <CodeBlock file="_tokens.semantic.scss" code={scss} />
        <div className="flex flex-wrap gap-6">
          {[`bg-${token}`, `text-${token}`, `border-${token}/30`].map((c) => (
            <CopyClass key={c} text={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
