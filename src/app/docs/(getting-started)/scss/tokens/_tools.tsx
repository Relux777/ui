"use client";

// Живые инструменты страницы «Токены»: песочница движения (пружины RenDit рядом с обычными кривыми)
// и генератор своего цветового токена (имя + цвет в светлой и тёмной теме → SCSS и классы).

import { Play } from "@boxicons/react/Play";
import { type CSSProperties, useState } from "react";
import { CodeBlock } from "../../../../_docs/docs";
import { ColorPicker, CopyClass, nameOf, type Pick } from "../colors/_tools";

const PANEL = "br-xl border bg-surface shadow-1";
const LABEL = "font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle";
const SEG =
  "h-30 px-12 br-full font-12 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2";

// ── Песочница движения ──────────────────────────────────────────────────────

// кривые: свои токены RenDit и стандартные кривые CSS для сравнения
const EASINGS = [
  {
    cls: "ease-spring",
    css: "var(--ease-spring)",
    note: "пружина: мягкий перелёт",
  },
  {
    cls: "ease-spring-bouncy",
    css: "var(--ease-spring-bouncy)",
    note: "упругая: заметно отскакивает",
  },
  { cls: "ease-out", css: "ease-out", note: "обычное замедление" },
  { cls: "ease-linear", css: "linear", note: "ровно, без ускорения" },
];

const MOVES = {
  move: { title: "Сдвиг", prop: "translate" },
  scale: { title: "Масштаб", prop: "scale" },
  rotate: { title: "Поворот", prop: "rotate" },
} as const;
type Move = keyof typeof MOVES;

export function MotionPlayground() {
  const [at, setAt] = useState(false);
  const [duration, setDuration] = useState(600);
  const [move, setMove] = useState<Move>("move");
  const [pick, setPick] = useState(EASINGS[0].cls);

  const end: Record<Move, CSSProperties> = {
    move: {},
    scale: { scale: "1.3" },
    rotate: { rotate: "180deg" },
  };

  return (
    <div className={`${PANEL} flex flex-col gap-16 p-16 sm:p-20`}>
      <div className="flex flex-wrap items-center gap-12">
        <div className="flex gap-4 p-3 br-full bg-foreground/5">
          {(Object.keys(MOVES) as Move[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={move === m}
              onClick={() => {
                setMove(m);
                setAt(false);
              }}
              className={SEG}
            >
              {MOVES[m].title}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-10 font-13 text-foreground-muted">
          <span className="whitespace-nowrap tabular-nums">{duration} мс</span>
          <input
            type="range"
            min={200}
            max={1500}
            step={100}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-140 [accent-color:var(--secondary)]"
          />
        </label>
        <button
          type="button"
          onClick={() => setAt((a) => !a)}
          className="ml-auto flex items-center gap-6 h-36 px-16 br-full bg-primary text-primary-foreground font-13 font-w-600 transition active:scale-95"
        >
          <Play size="xs" pack="filled" aria-hidden="true" />
          {at ? "Назад" : "Запустить"}
        </button>
      </div>

      <ul className="flex flex-col gap-8">
        {EASINGS.map((e) => (
          <li key={e.cls}>
            <button
              type="button"
              aria-pressed={pick === e.cls}
              onClick={() => setPick(e.cls)}
              className="w-full grid sm:grid-cols-[180px_minmax(0,1fr)] items-center gap-x-16 gap-y-6 p-10 br-lg border border-transparent text-left transition-colors hover:bg-foreground/4 aria-pressed:border-secondary/40 aria-pressed:bg-secondary/6"
            >
              <span className="flex flex-col">
                <code className="font-13 font-mono font-w-600">{e.cls}</code>
                <span className="font-12 text-foreground-muted">{e.note}</span>
              </span>
              {/* дорожка: шарик ездит внутри «окна» шириной дорожка минус шарик — сдвиг на 100% окна
                  приводит его ровно к правому краю */}
              <span className="relative block h-36 br-full bg-foreground/5">
                <span
                  className="absolute top-4 bottom-4 left-4 right-32"
                  style={
                    move === "move"
                      ? {
                          transition: `translate ${duration}ms ${e.css}`,
                          translate: at ? "100% 0" : "0 0",
                        }
                      : undefined
                  }
                >
                  <span
                    className={`block size-28 shadow-2 ${move === "move" ? "br-full" : "mx-auto br-md"} ${pick === e.cls ? "bg-secondary" : "bg-foreground/40"}`}
                    style={
                      move === "move"
                        ? undefined
                        : {
                            transition: `${MOVES[move].prop} ${duration}ms ${e.css}`,
                            ...(at ? end[move] : null),
                          }
                    }
                  />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-8">
        <span className={LABEL}>Классы</span>
        <CopyClass
          text={`transition-[${MOVES[move].prop}] duration-${duration} ${pick}`}
        />
      </div>
    </div>
  );
}

// ── Генератор своего токена ─────────────────────────────────────────────────

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
