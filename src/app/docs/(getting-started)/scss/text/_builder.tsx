"use client";

// Конструктор текста: размер, высота строки, начертание, интервал, регистр, цвет, выравнивание и обрезка →
// живой пример (свой текст можно вписать) и готовые классы. Пример рисуется через style — движок собирает
// только классы, написанные в коде целиком, а здесь значения выбирают на лету.

import { useState } from "react";
import { HtmlHint } from "../../../../_docs/builder";
import { CopyButton } from "../../../../_docs/copy-button";

const LABEL = "font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle";
const SEG =
  "h-30 px-10 br-full font-12 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2";

const WEIGHTS = [400, 500, 600, 700];
// высота строки — множитель размера: свободнее для абзацев, плотнее для заголовков
const LEADING = [
  { id: "auto", title: "Авто", k: 0 },
  { id: "tight", title: "Плотно", k: 1.15 },
  { id: "normal", title: "Обычно", k: 1.5 },
  { id: "loose", title: "Свободно", k: 1.75 },
] as const;
const COLORS = [
  { id: "foreground", title: "Основной" },
  { id: "foreground-muted", title: "Второстепенный" },
  { id: "foreground-subtle", title: "Подпись" },
  { id: "secondary", title: "Акцент" },
] as const;
const ALIGN = [
  { id: "left", title: "Слева" },
  { id: "center", title: "По центру" },
  { id: "right", title: "Справа" },
] as const;
const WRAP = [
  { id: "none", title: "Как есть" },
  { id: "truncate", title: "В строку…" },
  { id: "clamp", title: "2 строки…" },
  { id: "balance", title: "Ровно" },
] as const;

// готовые наборы — как в интерфейсах: заголовок, абзац, подпись
const PRESETS = [
  {
    title: "Заголовок",
    size: 40,
    weight: 700,
    letter: -3,
    leading: "tight",
    color: "foreground",
    upper: false,
  },
  {
    title: "Подзаголовок",
    size: 22,
    weight: 600,
    letter: -1,
    leading: "tight",
    color: "foreground",
    upper: false,
  },
  {
    title: "Абзац",
    size: 16,
    weight: 400,
    letter: 0,
    leading: "normal",
    color: "foreground-muted",
    upper: false,
  },
  {
    title: "Подпись",
    size: 12,
    weight: 700,
    letter: 6,
    leading: "auto",
    color: "foreground-subtle",
    upper: true,
  },
] as const;

type Leading = (typeof LEADING)[number]["id"];
type Color = (typeof COLORS)[number]["id"];
type Align = (typeof ALIGN)[number]["id"];
type Wrap = (typeof WRAP)[number]["id"];

export function TextBuilder() {
  const [text, setText] = useState(
    "RenDit UI — классы, токены и компоненты для сайтов, которые приятно читать",
  );
  const [size, setSize] = useState(32);
  const [weight, setWeight] = useState(700);
  const [letter, setLetter] = useState(-2);
  const [leading, setLeading] = useState<Leading>("tight");
  const [color, setColor] = useState<Color>("foreground");
  const [upper, setUpper] = useState(false);
  const [align, setAlign] = useState<Align>("left");
  const [wrap, setWrap] = useState<Wrap>("balance");

  const lh = LEADING.find((l) => l.id === leading)?.k ?? 0;
  const lhPx = lh ? Math.round(size * lh) : 0;
  const classes = [
    lhPx ? `font-${size}/${lhPx}` : `font-${size}`,
    `font-w-${weight}`,
    letter ? `${letter < 0 ? "-" : ""}letter-s-${Math.abs(letter)}` : "",
    upper ? "uppercase" : "",
    `text-${color}`,
    align !== "left" ? `text-${align}` : "",
    wrap === "truncate" ? "truncate" : "",
    wrap === "clamp" ? "line-clamp-2" : "",
    wrap === "balance" ? "text-balance" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const apply = (p: (typeof PRESETS)[number]) => {
    setSize(p.size);
    setWeight(p.weight);
    setLetter(p.letter);
    setLeading(p.leading);
    setColor(p.color);
    setUpper(p.upper);
  };

  return (
    <div className="br-xl border bg-surface shadow-1 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col gap-16 p-16 sm:p-20 border-b lg:border-b-0 lg:border-r">
        <div className="flex flex-col gap-8">
          <span className={LABEL}>Готовые наборы</span>
          <div className="flex flex-wrap gap-6">
            {PRESETS.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => apply(p)}
                className="h-30 px-12 br-full border font-12 font-w-600 transition hover:bg-foreground/5 active:scale-95"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
        {(
          [
            ["Размер", size, setSize, 11, 72, 1, `${size}px`],
            ["Интервал", letter, setLetter, -6, 14, 1, `${letter / 100}em`],
          ] as const
        ).map(([title, value, set, min, max, step, note]) => (
          <label key={title} className="flex flex-col gap-8">
            <span className={`${LABEL} flex justify-between`}>
              {title}
              <span className="font-mono normal-case letter-s-0 text-foreground-muted">
                {note}
              </span>
            </span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
              className="[accent-color:var(--secondary)]"
            />
          </label>
        ))}
        {(
          [
            [
              "Начертание",
              WEIGHTS.map((w) => ({ id: w, title: String(w) })),
              weight,
              setWeight,
            ],
            ["Высота строки", LEADING, leading, setLeading],
            ["Цвет", COLORS, color, setColor],
            ["Выравнивание", ALIGN, align, setAlign],
            ["Длинный текст", WRAP, wrap, setWrap],
          ] as const
        ).map(([title, options, value, set]) => (
          <div key={title} className="flex flex-col gap-8">
            <span className={LABEL}>{title}</span>
            <div className="flex flex-wrap gap-4 p-3 br-xl bg-foreground/5">
              {options.map((o) => (
                <button
                  key={String(o.id)}
                  type="button"
                  aria-pressed={value === o.id}
                  onClick={() => (set as (v: typeof o.id) => void)(o.id)}
                  className={SEG}
                >
                  {o.title}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          role="switch"
          aria-checked={upper}
          onClick={() => setUpper(!upper)}
          className="group flex items-center justify-between gap-12 font-14 font-w-500"
        >
          Заглавными буквами
          <span className="relative w-40 h-24 br-full bg-foreground/15 transition-colors group-[[aria-checked=true]]:bg-secondary before:absolute before:top-3 before:left-3 before:size-18 before:br-full before:bg-white before:shadow-2 before:transition-[translate] before:duration-300 before:ease-spring group-[[aria-checked=true]]:before:translate-x-16" />
        </button>
      </div>

      <div className="flex flex-col gap-14 p-16 sm:p-20 min-w-0">
        <label className="flex flex-col gap-8">
          <span className={LABEL}>Свой текст</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-40 px-12 br-lg border bg-surface font-14 outline-none focus:border-secondary touch:text-[16px]"
          />
        </label>
        <div className="grid place-items-center min-h-200 p-20 br-lg border bg-background overflow-hidden">
          <p
            className="w-full max-w-520 transition-[font-size,line-height,letter-spacing] duration-300"
            style={{
              fontSize: size,
              lineHeight: lhPx ? `${lhPx}px` : undefined,
              fontWeight: weight,
              letterSpacing: `${letter / 100}em`,
              textTransform: upper ? "uppercase" : undefined,
              color: `var(--${color})`,
              textAlign: align,
              ...(wrap === "truncate"
                ? {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }
                : wrap === "clamp"
                  ? {
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }
                  : wrap === "balance"
                    ? { textWrap: "balance" }
                    : null),
            }}
          >
            {text || "Впишите текст"}
          </p>
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
