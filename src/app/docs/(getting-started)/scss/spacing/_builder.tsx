"use client";

// Конструктор отступов: внешний отступ, внутренний (одинаковый или по осям), промежуток между детьми,
// направление и сколько детей → схема как в инструментах разработчика (поле — оранжевое, отступ внутри —
// зелёное, промежутки — фиолетовые) и готовые классы. Схема рисуется через style: значения выбирают на лету.

import { useState } from "react";
import { HtmlHint } from "../../../../_docs/builder";
import { CopyButton } from "../../../../_docs/copy-button";

const LABEL = "font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle";
const SEG =
  "h-30 px-12 br-full font-12 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2";
// шкала — числа, которые чаще всего нужны; любое другое тоже работает
const SCALE = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];

function Slider({
  title,
  value,
  set,
  max = 64,
}: {
  title: string;
  value: number;
  set: (v: number) => void;
  max?: number;
}) {
  return (
    <label className="flex flex-col gap-8">
      <span className={`${LABEL} flex justify-between`}>
        {title}
        <span className="font-mono normal-case letter-s-0 text-foreground-muted">
          {value}px
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={max}
        step={2}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="[accent-color:var(--secondary)]"
      />
    </label>
  );
}

export function SpacingBuilder() {
  const [margin, setMargin] = useState(16);
  const [same, setSame] = useState(true);
  const [px, setPx] = useState(24);
  const [py, setPy] = useState(24);
  const [gap, setGap] = useState(12);
  const [row, setRow] = useState(true);
  const [count, setCount] = useState(3);

  const padding = same
    ? [`p-${px}`]
    : [px === py ? `p-${px}` : `px-${px} py-${py}`];
  const classes = [
    "flex",
    row ? "" : "flex-col",
    `gap-${gap}`,
    ...padding,
    margin ? `m-${margin}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const pY = same ? px : py;

  return (
    <div className="br-xl border bg-surface shadow-1 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col gap-16 p-16 sm:p-20 border-b lg:border-b-0 lg:border-r">
        <div className="flex flex-col gap-8">
          <span className={LABEL}>Шкала — нажмите, чтобы взять</span>
          <div className="flex flex-wrap gap-4">
            {SCALE.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setPx(s);
                  setPy(s);
                }}
                className="h-28 min-w-36 px-6 br-md border font-12 font-mono tabular-nums transition hover:bg-foreground/5 active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <Slider title="Внешний отступ · m" value={margin} set={setMargin} />
        <div className="flex flex-col gap-8">
          <span className={LABEL}>Внутренний отступ</span>
          <div className="self-start flex gap-4 p-3 br-full bg-foreground/5">
            <button
              type="button"
              aria-pressed={same}
              onClick={() => setSame(true)}
              className={SEG}
            >
              Одинаковый · p
            </button>
            <button
              type="button"
              aria-pressed={!same}
              onClick={() => setSame(false)}
              className={SEG}
            >
              По осям · px, py
            </button>
          </div>
        </div>
        <Slider
          title={same ? "Со всех сторон" : "Слева и справа · px"}
          value={px}
          set={setPx}
        />
        {!same && <Slider title="Сверху и снизу · py" value={py} set={setPy} />}
        <Slider title="Промежуток · gap" value={gap} set={setGap} max={48} />
        <div className="flex flex-wrap items-center gap-12">
          <div className="flex gap-4 p-3 br-full bg-foreground/5">
            <button
              type="button"
              aria-pressed={row}
              onClick={() => setRow(true)}
              className={SEG}
            >
              В ряд
            </button>
            <button
              type="button"
              aria-pressed={!row}
              onClick={() => setRow(false)}
              className={SEG}
            >
              Столбиком
            </button>
          </div>
          <div className="flex items-center gap-6 font-13 text-foreground-muted">
            Детей
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={count === n}
                onClick={() => setCount(n)}
                className="size-28 br-full border font-12 font-w-600 transition aria-pressed:border-secondary aria-pressed:bg-secondary/10 aria-pressed:text-secondary"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-14 p-16 sm:p-20 min-w-0">
        {/* схема: оранжевое поле — внешний отступ, зелёное — внутренний, фиолетовые щели — промежутки */}
        <div className="grid place-items-center min-h-260 p-12 br-lg border bg-background overflow-hidden">
          <div
            className="w-full max-w-420 transition-[padding] duration-300 ease-spring bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--orange-400)_22%,transparent)_0_6px,transparent_6px_12px)] br-md"
            style={{ padding: margin }}
          >
            <div
              className="flex transition-[padding] duration-300 ease-spring br-md bg-[color-mix(in_oklab,var(--green-400)_22%,transparent)] [outline:1px_dashed_color-mix(in_oklab,var(--green-500)_50%,transparent)]"
              style={{
                padding: `${pY}px ${px}px`,
                gap,
                flexDirection: row ? "row" : "column",
              }}
            >
              {/* промежутки — отдельными полосками, чтобы их было видно (в коде это просто gap) */}
              {Array.from({ length: count * 2 - 1 }, (_, i) =>
                i % 2 ? (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: части схемы одинаковые
                    key={i}
                    aria-hidden="true"
                    className="shrink-0 transition-[width,height] duration-300 ease-spring bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--violet-400)_45%,transparent)_0_4px,transparent_4px_8px)]"
                    style={row ? { width: gap } : { height: gap }}
                  />
                ) : (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: части схемы одинаковые
                    key={i}
                    className="flex-1 grid place-items-center min-h-48 br-sm bg-blue-500 text-white font-12 font-w-600"
                  >
                    {i / 2 + 1}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-14 gap-y-6 font-12 text-foreground-muted">
          <span className="flex items-center gap-6">
            <span className="size-12 br-xs bg-orange-400/40" /> внешний · m
          </span>
          <span className="flex items-center gap-6">
            <span className="size-12 br-xs bg-green-400/40" /> внутренний · p
          </span>
          <span className="flex items-center gap-6">
            <span className="size-12 br-xs bg-violet-400/50" /> промежуток · gap
          </span>
          <span className="flex items-center gap-6">
            <span className="size-12 br-xs bg-blue-500" /> содержимое
          </span>
        </div>
        <div className="flex flex-col gap-8 min-w-0">
          <span className={LABEL}>Классы</span>
          <div className="flex items-start gap-10 p-12 br-lg border bg-surface-muted/50">
            <code className="flex-1 min-w-0 pt-6 font-13 font-mono break-words">
              {classes}
            </code>
            <CopyButton text={classes} className="shrink-0" />
          </div>
          <HtmlHint classes={classes.split(" ")} />
        </div>
      </div>
    </div>
  );
}
