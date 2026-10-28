"use client";

// Живые инструменты страницы «Цвета»: смысловые цвета в двух темах, палитра с копированием класса,
// конструктор класса цвета и проверка контраста. Образцы рисуются через CSS-переменные (style), а не классы:
// движок собирает только классы, написанные в коде целиком, а здесь цвет выбирают на лету.
// «Две темы рядом» — островки data-theme="light" / "dark": токены пересчитываются внутри них.

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  COPIED_RING,
  Copied,
  CopyIcon,
  useCopy,
} from "../../../../_docs/copy-button";
import { COLORS, STEPS } from "../../../../_docs/docs";

// ── Данные ──────────────────────────────────────────────────────────────────

export const TOKENS = [
  { name: "background", note: "фон страницы" },
  { name: "surface", note: "карточки, меню, окна" },
  { name: "surface-muted", note: "чипы, поля, «утопленные» блоки" },
  { name: "surface-inverse", note: "тёмные секции на светлой странице" },
  { name: "foreground", note: "основной текст" },
  { name: "foreground-muted", note: "второстепенный текст" },
  { name: "foreground-subtle", note: "подписи, подсказки" },
  { name: "foreground-inverse", note: "текст на surface-inverse" },
  { name: "primary", note: "главные кнопки" },
  { name: "primary-hover", note: "главная кнопка под курсором" },
  { name: "primary-foreground", note: "текст на primary" },
  { name: "secondary", note: "ссылки, выбранное" },
  { name: "secondary-foreground", note: "текст на secondary" },
  { name: "accent", note: "яркий акцент: бейджи, выделение" },
  { name: "accent-foreground", note: "текст на accent" },
  { name: "success", note: "успех, готово" },
  { name: "warning", note: "внимание" },
  { name: "danger", note: "ошибка, удаление" },
  { name: "info", note: "подсказка, сведения" },
  { name: "border", note: "рамки, разделители" },
  { name: "border-strong", note: "рамки под курсором" },
  { name: "ring", note: "обводка фокуса с клавиатуры" },
] as const;

const PROPS = {
  bg: { title: "Фон", css: "background-color" },
  text: { title: "Текст", css: "color" },
  border: { title: "Рамка", css: "border-color" },
} as const;
type Prop = keyof typeof PROPS;

const PREFIXES = [
  { id: "", title: "Всегда" },
  { id: "hover:", title: "При наведении" },
  { id: "dark:", title: "В тёмной теме" },
] as const;
type Prefix = (typeof PREFIXES)[number]["id"];

// цвет: смысловой токен или цвет палитры с оттенком
type Pick = { family: string; step: number };
const isToken = (family: string) => TOKENS.some((t) => t.name === family);
const colorName = ({ family, step }: Pick) =>
  isToken(family) ? family : `${family}-${step}`;

// ── Общее ───────────────────────────────────────────────────────────────────

const PANEL = "br-xl border bg-surface shadow-1";
const LABEL = "font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle";

// островок темы: внутри токены своей темы
function Theme({
  theme,
  className = "",
  children,
}: {
  theme: "light" | "dark";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-theme={theme}
      className={`bg-background text-foreground ${className}`}
    >
      {children}
    </div>
  );
}

// кнопка «скопировать класс» с общим откликом копирования
function CopyClass({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [copied, copy] = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={copied ? `${text} скопирован` : `Скопировать ${text}`}
      className={`relative flex items-center gap-6 min-w-0 max-w-full h-30 px-10 br-full border bg-surface font-12 font-mono text-foreground-muted hover:text-foreground active:scale-95 ${COPIED_RING(copied)} ${className}`}
    >
      <CopyIcon copied={copied} />
      <span className="truncate">{text}</span>
      <Copied copied={copied} side="top" />
    </button>
  );
}

// выбор цвета: смысловой токен или цвет палитры + оттенок ползунком
function ColorSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Pick;
  onChange: (p: Pick) => void;
}) {
  const id = useId();
  const token = isToken(value.family);
  const index = STEPS.indexOf(value.step);
  return (
    <div className="flex flex-col gap-8 min-w-0">
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <div className="flex items-center gap-8">
        <span
          aria-hidden="true"
          className="size-36 shrink-0 br-md border"
          style={{ background: `var(--${nameOf(value)})` }}
        />
        <select
          id={id}
          value={value.family}
          onChange={(e) => onChange({ ...value, family: e.target.value })}
          className="flex-1 min-w-0 h-36 px-10 br-md border bg-surface font-14 touch:text-[16px]"
        >
          <optgroup label="Смысловые">
            {TOKENS.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Палитра">
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="white">white</option>
            <option value="black">black</option>
          </optgroup>
        </select>
      </div>
      {!token && value.family !== "white" && value.family !== "black" && (
        <div className="flex items-center gap-10">
          <input
            type="range"
            min={0}
            max={STEPS.length - 1}
            value={index < 0 ? 5 : index}
            aria-label={`${label}: оттенок`}
            onChange={(e) =>
              onChange({ ...value, step: STEPS[Number(e.target.value)] })
            }
            className="flex-1 [accent-color:var(--secondary)]"
          />
          <span className="w-32 font-12 font-mono tabular-nums text-foreground-muted">
            {value.step}
          </span>
        </div>
      )}
    </div>
  );
}

// цвет палитры white/black — без оттенка
const nameOf = (p: Pick) =>
  p.family === "white" || p.family === "black" ? p.family : colorName(p);

// ── Смысловые цвета в двух темах ────────────────────────────────────────────

export function TokenGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-8 sm:gap-12">
      {TOKENS.map((t) => (
        <div key={t.name} className={`${PANEL} overflow-hidden flex flex-col`}>
          <div className="grid grid-cols-2 h-48 sm:h-64 border-b">
            {(["light", "dark"] as const).map((theme) => (
              <Theme key={theme} theme={theme} className="relative">
                <span
                  className="absolute inset-0"
                  style={{ background: `var(--${t.name})` }}
                />
                <span className="absolute bottom-4 left-6 font-10 font-w-600 text-foreground-muted [text-shadow:0_0_6px_var(--background)]">
                  {theme === "light" ? "светлая" : "тёмная"}
                </span>
              </Theme>
            ))}
          </div>
          <div className="flex flex-col gap-8 p-10 sm:p-12 min-w-0">
            <div className="flex flex-col">
              <code className="font-13 font-mono font-w-600">{t.name}</code>
              <span className="font-12 text-foreground-muted">{t.note}</span>
            </div>
            <CopyClass text={`bg-${t.name}`} className="self-start" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Палитра: клик — скопировать класс ───────────────────────────────────────

export function PaletteTool() {
  const [prop, setProp] = useState<Prop>("bg");
  const [copied, copy] = useCopy();
  const [last, setLast] = useState("");
  const pickClass = (c: string, s: number) => {
    const cls = `${prop}-${c}-${s}`;
    setLast(cls);
    copy(cls);
  };
  return (
    <div className={`${PANEL} flex flex-col gap-14 p-14 sm:p-20`}>
      <div className="flex flex-wrap items-center gap-10">
        <span className={LABEL}>Копировать как</span>
        <div className="flex gap-4 p-3 br-full bg-foreground/5">
          {(Object.keys(PROPS) as Prop[]).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={prop === p}
              onClick={() => setProp(p)}
              className="h-28 px-12 br-full font-12 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2"
            >
              {p}-…
            </button>
          ))}
        </div>
        <span
          aria-live="polite"
          className={`ml-auto font-12 font-mono transition-opacity ${copied ? "opacity-100 text-success" : "opacity-0"}`}
        >
          {last} скопирован
        </span>
      </div>
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-[64px_repeat(11,minmax(40px,1fr))] gap-4 min-w-560">
          <span />
          {STEPS.map((s) => (
            <span
              key={s}
              className="text-center font-11 text-foreground-subtle tabular-nums"
            >
              {s}
            </span>
          ))}
          {COLORS.map((c) => (
            <div key={c} className="contents">
              <span className="self-center font-12 text-foreground-muted">
                {c}
              </span>
              {STEPS.map((s) => (
                <button
                  key={s}
                  type="button"
                  title={`${prop}-${c}-${s}`}
                  aria-label={`Скопировать ${prop}-${c}-${s}`}
                  onClick={() => pickClass(c, s)}
                  className="h-36 br-sm border border-foreground/5 transition-[scale,box-shadow] duration-200 hover:scale-110 hover:shadow-3 hover:z-1 focus-visible:z-1 active:scale-95"
                  style={{ background: `var(--${c}-${s})` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Конструктор класса цвета ────────────────────────────────────────────────

// «при наведении» — классом с переменной --pv (написан целиком — движок его видит; :hover сильнее базового
// цвета образца); «всегда» — свойством в style: оно сильнее любого класса
const HOVER: Record<Prop, string> = {
  bg: "hover:[background-color:var(--pv)]",
  text: "hover:[color:var(--pv)]",
  border: "hover:[border-color:var(--pv)]",
};
const STYLE_PROP: Record<Prop, "backgroundColor" | "color" | "borderColor"> = {
  bg: "backgroundColor",
  text: "color",
  border: "borderColor",
};

export function ColorBuilder() {
  const [prop, setProp] = useState<Prop>("bg");
  const [color, setColor] = useState<Pick>({ family: "violet", step: 500 });
  const [alpha, setAlpha] = useState(100);
  const [prefix, setPrefix] = useState<Prefix>("");

  const name = nameOf(color);
  const cls = `${prefix}${prop}-${name}${alpha < 100 ? `/${alpha}` : ""}`;
  const value =
    alpha < 100
      ? `color-mix(in oklab, var(--${name}) ${alpha}%, transparent)`
      : `var(--${name})`;
  const css = `.${cls.replace(/[:/]/g, "\\$&")}${prefix === "hover:" ? ":hover" : ""} {\n  ${PROPS[prop].css}: ${value};\n}`;

  const sample = (theme: "light" | "dark") => {
    const on = prefix !== "dark:" || theme === "dark";
    const hover = prefix === "hover:";
    const style: CSSProperties | undefined = !on
      ? undefined
      : hover
        ? ({ "--pv": value } as CSSProperties)
        : { [STYLE_PROP[prop]]: value };
    const apply = on && hover ? HOVER[prop] : "";
    if (prop === "text")
      return (
        <p
          className={`font-24 font-w-700 -letter-s-2 transition-colors ${apply}`}
          style={style}
        >
          Пример текста
        </p>
      );
    return (
      <div
        className={`grid place-items-center h-96 br-lg font-14 font-w-600 transition-colors ${prop === "border" ? "border-2 border-border" : "bg-surface-muted"} ${apply}`}
        style={style}
      >
        {prefix === "hover:" ? "Наведите" : "Пример"}
      </div>
    );
  };

  return (
    <div
      className={`${PANEL} grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] overflow-hidden`}
    >
      <div className="flex flex-col gap-18 p-16 sm:p-20 border-b lg:border-b-0 lg:border-r">
        <div className="flex flex-col gap-8">
          <span className={LABEL}>Что красим</span>
          <div className="grid grid-cols-3 gap-4 p-3 br-full bg-foreground/5">
            {(Object.keys(PROPS) as Prop[]).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={prop === p}
                onClick={() => setProp(p)}
                className="h-32 br-full font-13 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2"
              >
                {PROPS[p].title}
              </button>
            ))}
          </div>
        </div>
        <ColorSelect label="Цвет" value={color} onChange={setColor} />
        <div className="flex flex-col gap-8">
          <label className={LABEL} htmlFor="color-alpha">
            Непрозрачность — {alpha}%
          </label>
          <input
            id="color-alpha"
            type="range"
            min={5}
            max={100}
            step={5}
            value={alpha}
            onChange={(e) => setAlpha(Number(e.target.value))}
            className="[accent-color:var(--secondary)]"
          />
        </div>
        <div className="flex flex-col gap-8">
          <span className={LABEL}>Когда</span>
          <div className="flex flex-wrap gap-6">
            {PREFIXES.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={prefix === p.id}
                onClick={() => setPrefix(p.id)}
                className="h-30 px-12 br-full border font-12 font-w-500 text-foreground-muted transition hover:text-foreground aria-pressed:border-secondary aria-pressed:bg-secondary/10 aria-pressed:text-secondary"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-14 p-16 sm:p-20 bg-surface-muted/40">
        <div className="grid grid-cols-2 gap-10">
          {(["light", "dark"] as const).map((theme) => (
            <Theme
              key={theme}
              theme={theme}
              className="flex flex-col gap-8 p-12 br-lg border"
            >
              <span className="font-11 font-w-600 text-foreground-muted">
                {theme === "light" ? "Светлая тема" : "Тёмная тема"}
              </span>
              {sample(theme)}
            </Theme>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          <span className={LABEL}>Класс</span>
          <CopyClass text={cls} className="self-start" />
        </div>
        <pre className="p-12 br-md border bg-surface font-12/20 font-mono text-foreground-muted overflow-x-auto whitespace-pre">
          {css}
        </pre>
      </div>
    </div>
  );
}

// ── Контраст ────────────────────────────────────────────────────────────────

// любой цвет CSS → [r, g, b] 0…255: браузер сам переводит oklch, color-mix и переменные
function toRgb(cssColor: string, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0, 0, 0];
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000";
  ctx.fillStyle = cssColor;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

// контраст по WCAG 2: (L1 + 0.05) / (L2 + 0.05)
function luminance([r, g, b]: number[]) {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
export function contrast(a: number[], b: number[]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function Grade({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`px-8 py-2 br-full font-11 font-w-700 ${ok ? "bg-success/12 text-success" : "bg-danger/10 text-danger"}`}
    >
      {ok ? "✓" : "✕"} {label}
    </span>
  );
}

export function ContrastChecker() {
  const [fg, setFg] = useState<Pick>({ family: "foreground", step: 500 });
  const [bg, setBg] = useState<Pick>({ family: "surface", step: 500 });
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const probes = useRef<Record<string, HTMLSpanElement | null>>({});

  // после отрисовки: настоящие цвета образцов в каждой теме → контраст
  // biome-ignore lint/correctness/useExhaustiveDependencies: пересчёт при смене цветов
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const next: Record<string, number> = {};
    for (const theme of ["light", "dark"]) {
      const f = probes.current[`${theme}-fg`];
      const b = probes.current[`${theme}-bg`];
      if (!f || !b) continue;
      next[theme] = contrast(
        toRgb(getComputedStyle(f).color, canvas),
        toRgb(getComputedStyle(b).backgroundColor, canvas),
      );
    }
    setRatios(next);
  }, [fg, bg]);

  return (
    <div className={`${PANEL} flex flex-col gap-16 p-16 sm:p-20`}>
      <div className="grid sm:grid-cols-2 gap-16">
        <ColorSelect label="Текст" value={fg} onChange={setFg} />
        <ColorSelect label="Фон" value={bg} onChange={setBg} />
      </div>
      <div className="grid sm:grid-cols-2 gap-10">
        {(["light", "dark"] as const).map((theme) => {
          const r = ratios[theme] ?? 0;
          return (
            <Theme
              key={theme}
              theme={theme}
              className="flex flex-col gap-10 p-12 br-lg border"
            >
              <span
                ref={(el) => {
                  probes.current[`${theme}-bg`] = el;
                }}
                className="flex flex-col gap-4 p-16 br-md"
                style={{ background: `var(--${nameOf(bg)})` }}
              >
                <span
                  ref={(el) => {
                    probes.current[`${theme}-fg`] = el;
                  }}
                  className="flex flex-col gap-2"
                  style={{ color: `var(--${nameOf(fg)})` }}
                >
                  <span className="font-20 font-w-700">Заголовок</span>
                  <span className="font-14">Обычный текст абзаца</span>
                </span>
              </span>
              <div className="flex flex-wrap items-center gap-6">
                <span className="font-12 font-w-600 text-foreground-muted">
                  {theme === "light" ? "Светлая" : "Тёмная"}:
                </span>
                <span className="font-15 font-w-700 tabular-nums">
                  {r ? r.toFixed(2) : "…"}:1
                </span>
                <Grade ok={r >= 4.5} label="AA" />
                <Grade ok={r >= 7} label="AAA" />
                <Grade ok={r >= 3} label="крупный" />
              </div>
            </Theme>
          );
        })}
      </div>
      <p className="font-13 text-foreground-muted">
        AA — 4.5:1 для обычного текста, AAA — 7:1, крупный текст (от 24px или
        19px жирным) — 3:1. Так советует WCAG 2.
      </p>
    </div>
  );
}
