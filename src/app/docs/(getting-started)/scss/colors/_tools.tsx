"use client";

// Живые инструменты страницы «Цвета»: смысловые цвета в двух темах, палитра с копированием класса,
// конструктор класса цвета и проверка контраста. Образцы рисуются через CSS-переменные (style), а не классы:
// движок собирает только классы, написанные в коде целиком, а здесь цвет выбирают на лету.
// «Две темы рядом» — островки data-theme="light" / "dark": токены пересчитываются внутри них.

import { ChevronDown } from "@boxicons/react/ChevronDown";
import { InfoCircle } from "@boxicons/react/InfoCircle";
import { Shuffle } from "@boxicons/react/Shuffle";
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
import { COLORS, CodeBlock, STEPS } from "../../../../_docs/docs";

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
export type Pick = { family: string; step: number };
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
export function CopyClass({
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

// цвет палитры white/black — без оттенка
export const nameOf = (p: Pick) =>
  p.family === "white" || p.family === "black" ? p.family : colorName(p);

// Выбор цвета — свой выпадающий список вместо <select>: у каждого варианта виден сам цвет. Две вкладки:
// «Смысловые» — список токенов с образцом и пояснением, «Палитра» — сетка 14 × 11, оттенок выбирается сразу.
// Панель выезжает на пружине; Esc или нажатие мимо закрывают; под кнопкой — ползунок оттенка палитры.
export function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Pick;
  onChange: (p: Pick) => void;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"tokens" | "palette">(
    isToken(value.family) ? "tokens" : "palette",
  );
  const name = nameOf(value);
  const token = isToken(value.family);
  const palette =
    !token && value.family !== "white" && value.family !== "black";
  const index = STEPS.indexOf(value.step);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("pointerdown", away);
    addEventListener("keydown", esc);
    return () => {
      removeEventListener("pointerdown", away);
      removeEventListener("keydown", esc);
    };
  }, [open]);

  const choose = (p: Pick) => {
    onChange(p);
    setOpen(false);
  };

  return (
    <div ref={root} className="relative flex flex-col gap-8 min-w-0">
      <span id={`${id}-label`} className={LABEL}>
        {label}
      </span>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => setOpen((o) => !o)}
        className="group flex items-center gap-10 h-44 pl-6 pr-12 br-lg border bg-surface text-left transition-[border-color,box-shadow] hover:border-border-strong aria-expanded:border-secondary aria-expanded:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]"
      >
        <span
          aria-hidden="true"
          className="size-32 shrink-0 br-md border border-foreground/10 shadow-1"
          style={{ background: `var(--${name})` }}
        />
        <span id={`${id}-value`} className="flex-1 min-w-0 flex flex-col">
          <span className="truncate font-14 font-w-600 font-mono">{name}</span>
          <span className="truncate font-11 text-foreground-muted">
            {token
              ? TOKENS.find((t) => t.name === value.family)?.note
              : "цвет палитры"}
          </span>
        </span>
        <ChevronDown
          size="sm"
          aria-hidden="true"
          className="shrink-0 text-foreground-muted transition-[rotate] duration-400 ease-spring group-[[aria-expanded=true]]:rotate-180"
        />
      </button>

      {/* панель: всегда в разметке, появляется и прячется переходом (пружина) */}
      <div
        role="dialog"
        aria-label={`${label}: выбор цвета`}
        data-open={open || undefined}
        inert={!open}
        className="absolute top-full left-0 z-20 mt-6 w-[min(360px,calc(100vw-40px))] flex flex-col gap-10 p-10 br-xl border bg-surface shadow-5 origin-top-left opacity-0 scale-95 -translate-y-6 invisible transition-[opacity,scale,translate,visibility] duration-300 ease-spring data-open:opacity-100 data-open:scale-100 data-open:translate-y-0 data-open:visible motion-reduce:transition-none"
      >
        <div className="grid grid-cols-2 gap-4 p-3 br-full bg-foreground/5">
          {(
            [
              ["tokens", "Смысловые"],
              ["palette", "Палитра"],
            ] as const
          ).map(([t, title]) => (
            <button
              key={t}
              type="button"
              aria-pressed={tab === t}
              onClick={() => setTab(t)}
              className="h-30 br-full font-12 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2"
            >
              {title}
            </button>
          ))}
        </div>

        {tab === "tokens" ? (
          <ul className="flex flex-col max-h-300 overflow-y-auto overscroll-contain -mx-2 px-2">
            {TOKENS.map((t) => (
              <li key={t.name}>
                <button
                  type="button"
                  aria-current={value.family === t.name || undefined}
                  onClick={() => choose({ ...value, family: t.name })}
                  className="w-full flex items-center gap-10 px-8 py-6 br-md text-left transition-colors hover:bg-foreground/5 aria-[current]:bg-secondary/10"
                >
                  <span
                    aria-hidden="true"
                    className="size-24 shrink-0 br-sm border border-foreground/10"
                    style={{ background: `var(--${t.name})` }}
                  />
                  <span className="flex-1 min-w-0 flex flex-col">
                    <span className="truncate font-13 font-mono font-w-500">
                      {t.name}
                    </span>
                    <span className="truncate font-11 text-foreground-muted">
                      {t.note}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-3 max-h-300 overflow-y-auto overscroll-contain">
            {COLORS.map((c) => (
              <div
                key={c}
                className="grid grid-cols-[52px_repeat(11,minmax(0,1fr))] items-center gap-3"
              >
                <span className="font-11 text-foreground-muted truncate">
                  {c}
                </span>
                {STEPS.map((s) => {
                  const on = value.family === c && value.step === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      title={`${c}-${s}`}
                      aria-label={`${c}-${s}`}
                      aria-current={on || undefined}
                      onClick={() => choose({ family: c, step: s })}
                      className="h-22 br-xs transition-[scale,box-shadow] duration-200 hover:scale-125 hover:z-1 hover:shadow-3 aria-[current]:shadow-[0_0_0_2px_var(--surface),0_0_0_4px_var(--foreground)] aria-[current]:z-1"
                      style={{ background: `var(--${c}-${s})` }}
                    />
                  );
                })}
              </div>
            ))}
            <div className="flex gap-6 pt-4">
              {(["white", "black"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => choose({ family: c, step: value.step })}
                  className="flex items-center gap-6 h-26 px-8 br-full border font-11 font-mono transition-colors hover:bg-foreground/5"
                >
                  <span
                    aria-hidden="true"
                    className="size-12 br-full border"
                    style={{ background: `var(--${c})` }}
                  />
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {palette && (
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
                <span className="absolute bottom-4 left-4 px-4 br-xs bg-background/70 font-10 font-w-600 text-foreground-muted">
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
      className={`${PANEL} grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]`}
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
        <ColorPicker label="Цвет" value={color} onChange={setColor} />
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

      <div className="flex flex-col gap-14 p-16 sm:p-20">
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

// любой цвет CSS → [r, g, b] 0…255: браузер сам переводит oklch, color-mix и переменные. Полупрозрачный
// цвет (bg-violet-500/10) смешивается с подложкой backdrop — каким его и видит глаз
function toRgb(cssColor: string, canvas: HTMLCanvasElement, backdrop = "#fff") {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0, 0, 0];
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, 1, 1);
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
        <ColorPicker label="Текст" value={fg} onChange={setFg} />
        <ColorPicker label="Фон" value={bg} onChange={setBg} />
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

// ── Конструктор стиля: цвет → готовые классы элемента ──────────────────────

const VARIANTS = {
  solid: "Залитый",
  soft: "Мягкий",
  outline: "Контур",
  ghost: "Прозрачный",
} as const;
type Variant = keyof typeof VARIANTS;

const ELEMENTS = {
  button: {
    title: "Кнопка",
    tag: "button",
    layout: "h-40 px-18 br-full font-14 font-w-600",
  },
  badge: {
    title: "Метка",
    tag: "span",
    layout: "px-10 py-2 br-full font-12 font-w-600",
  },
  alert: {
    title: "Сообщение",
    tag: "div",
    layout: "flex items-center gap-10 p-14 br-lg font-14",
  },
  card: {
    title: "Карточка",
    tag: "div",
    layout: "flex flex-col gap-4 p-20 br-xl",
  },
} as const;
type Element = keyof typeof ELEMENTS;

const TEXT = {
  button: "Кнопка",
  badge: "Метка",
  alert: "Изменения сохранены",
  card: "Карточка",
};

// у этих токенов есть пара для текста на них
const PAIRED = ["primary", "secondary", "accent"];

// классы цвета по стилю; n — цвет, f — текст на залитом фоне
function colorClasses(
  v: Variant,
  el: Element,
  n: string,
  f: string,
  hover: boolean,
) {
  const framed = el === "alert" || el === "card";
  const list: Record<Variant, string[]> = {
    solid: [`bg-${n}`, `text-${f}`],
    soft: [
      `bg-${n}/10`,
      `text-${n}`,
      ...(framed ? ["border", `border-${n}/25`] : []),
    ],
    outline: ["border", `border-${n}`, `text-${n}`],
    ghost: [`text-${n}`],
  };
  const hovers: Record<Variant, string> = {
    solid: `hover:bg-${n}/90`,
    soft: `hover:bg-${n}/15`,
    outline: `hover:bg-${n}/10`,
    ghost: `hover:bg-${n}/10`,
  };
  return [...list[v], ...(hover ? [hovers[v]] : [])];
}

// то же — для превью: фон через переменные (--b, --hb) и классы ниже, цвет и рамка — style
const mix = (n: string, p: number) =>
  `color-mix(in oklab, var(--${n}) ${p}%, transparent)`;
function previewStyle(v: Variant, el: Element, n: string, f: string) {
  const framed = el === "alert" || el === "card";
  const s: Record<string, string> = {};
  if (v === "solid")
    Object.assign(s, {
      "--b": `var(--${n})`,
      "--hb": mix(n, 90),
      color: `var(--${f})`,
    });
  if (v === "soft")
    Object.assign(s, {
      "--b": mix(n, 10),
      "--hb": mix(n, 15),
      color: `var(--${n})`,
      ...(framed ? { border: `1px solid ${mix(n, 25)}` } : {}),
    });
  if (v === "outline")
    Object.assign(s, {
      "--b": "transparent",
      "--hb": mix(n, 10),
      color: `var(--${n})`,
      border: `1px solid var(--${n})`,
    });
  if (v === "ghost")
    Object.assign(s, {
      "--b": "transparent",
      "--hb": mix(n, 10),
      color: `var(--${n})`,
    });
  return s as CSSProperties;
}

export function StyleBuilder() {
  const [color, setColor] = useState<Pick>({ family: "violet", step: 500 });
  const [variant, setVariant] = useState<Variant>("soft");
  const [el, setEl] = useState<Element>("button");
  const [hover, setHover] = useState(true);
  const [jsx, setJsx] = useState(false);
  // текст на залитом фоне: пара токена или белый / почти чёрный — что контрастнее
  const [onFill, setOnFill] = useState("white");
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const probes = useRef<Record<string, HTMLElement | null>>({});

  const n = nameOf(color);
  const f = PAIRED.includes(n) ? `${n}-foreground` : onFill;

  // biome-ignore lint/correctness/useExhaustiveDependencies: пересчёт при смене набора
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const light = probes.current.light;
    // цвет на белом и на почти чёрном — что контрастнее, тем и пишем текст на залитом фоне
    const probe = document.createElement("span");
    probe.style.color = `var(--${n})`;
    light?.appendChild(probe);
    const rgb = toRgb(getComputedStyle(probe).color, canvas);
    probe.remove();
    setOnFill(
      contrast(rgb, [255, 255, 255]) >= contrast(rgb, [11, 11, 13])
        ? "white"
        : "gray-950",
    );
    // контраст текста элемента к его фону — когда цвета доедут (у образца переход 200 мс)
    const timer = setTimeout(() => {
      const next: Record<string, number> = {};
      for (const theme of ["light", "dark"]) {
        const node = probes.current[theme];
        if (!node) continue;
        // фон элемента (может быть полупрозрачным) поверх фона под ним — как видит глаз
        const s = getComputedStyle(node);
        const under = getComputedStyle(
          node.parentElement as HTMLElement,
        ).backgroundColor;
        const back = toRgb(s.backgroundColor, canvas, under);
        const text = toRgb(s.color, canvas, `rgb(${back.join(",")})`);
        next[theme] = contrast(text, back);
      }
      setRatios(next);
    }, 260);
    return () => clearTimeout(timer);
  }, [n, variant, el, onFill]);

  const { tag, layout } = ELEMENTS[el];
  const classes = [layout, ...colorClasses(variant, el, n, f, hover)].join(" ");
  const attr = jsx ? "className" : "class";
  const inner =
    el === "card"
      ? `\n  <h3 class="font-16 font-w-600">Карточка</h3>\n  <p>Цвет — из токенов RenDit</p>\n`
      : TEXT[el];
  const code = `<${tag} ${attr}="${classes}">${el === "card" ? inner.replaceAll("class=", `${attr}=`) : inner}</${tag}>`;

  const random = () => {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    const s = [400, 500, 600][Math.floor(Math.random() * 3)];
    const vs = Object.keys(VARIANTS) as Variant[];
    setColor({ family: c, step: s });
    setVariant(vs[Math.floor(Math.random() * vs.length)]);
  };

  const sample = (theme: "light" | "dark") => (
    <div className="grid place-items-center min-h-120 p-16 br-lg bg-background">
      <div
        ref={(node) => {
          probes.current[theme] = node;
        }}
        className={`${ELEMENTS[el].layout} [background-color:var(--b)] transition-colors duration-200 ${hover ? "hover:[background-color:var(--hb)]" : ""} ${el === "button" ? "cursor-pointer active:scale-97" : ""}`}
        style={previewStyle(variant, el, n, f)}
      >
        {el === "alert" && <InfoCircle size="sm" aria-hidden="true" />}
        {el === "card" ? (
          <>
            <span className="font-16 font-w-600">Карточка</span>
            <span className="font-13 opacity-80">Цвет — из токенов RenDit</span>
          </>
        ) : (
          TEXT[el]
        )}
      </div>
    </div>
  );

  const SEG =
    "h-32 px-12 br-full font-13 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2";

  return (
    <div
      className={`${PANEL} grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]`}
    >
      <div className="flex flex-col gap-18 p-16 sm:p-20 border-b lg:border-b-0 lg:border-r">
        <ColorPicker label="Цвет" value={color} onChange={setColor} />
        <div className="flex flex-col gap-8">
          <span className={LABEL}>Стиль</span>
          <div className="grid grid-cols-2 gap-4 p-3 br-xl bg-foreground/5">
            {(Object.keys(VARIANTS) as Variant[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={variant === v}
                onClick={() => setVariant(v)}
                className={SEG}
              >
                {VARIANTS[v]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <span className={LABEL}>Элемент</span>
          <div className="grid grid-cols-2 gap-4 p-3 br-xl bg-foreground/5">
            {(Object.keys(ELEMENTS) as Element[]).map((e) => (
              <button
                key={e}
                type="button"
                aria-pressed={el === e}
                onClick={() => setEl(e)}
                className={SEG}
              >
                {ELEMENTS[e].title}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-8">
          <button
            type="button"
            role="switch"
            aria-checked={hover}
            onClick={() => setHover((h) => !h)}
            className="group flex items-center gap-8 font-13 font-w-500"
          >
            <span className="relative w-36 h-22 br-full bg-foreground/15 transition-colors group-[[aria-checked=true]]:bg-secondary before:absolute before:top-3 before:left-3 before:size-16 before:br-full before:bg-white before:shadow-2 before:transition-[translate] before:duration-300 before:ease-spring group-[[aria-checked=true]]:before:translate-x-14" />
            Ярче при наведении
          </button>
          <button
            type="button"
            onClick={random}
            className="ml-auto flex items-center gap-6 h-32 px-12 br-full border font-13 font-w-600 transition hover:bg-foreground/5 active:scale-95"
          >
            <Shuffle size="xs" aria-hidden="true" />
            Случайный
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-14 p-16 sm:p-20 min-w-0">
        <div className="grid grid-cols-2 gap-10">
          {(["light", "dark"] as const).map((theme) => (
            <Theme
              key={theme}
              theme={theme}
              className="flex flex-col gap-8 p-10 br-lg border"
            >
              <div className="flex items-center justify-between gap-6 px-2">
                <span className="font-11 font-w-600 text-foreground-muted">
                  {theme === "light" ? "Светлая" : "Тёмная"}
                </span>
                {ratios[theme] ? (
                  <span
                    className={`font-11 font-w-700 tabular-nums ${ratios[theme] >= 4.5 ? "text-success" : ratios[theme] >= 3 ? "text-warning" : "text-danger"}`}
                    title="Контраст текста к фону"
                  >
                    {ratios[theme].toFixed(1)}:1
                  </span>
                ) : null}
              </div>
              {sample(theme)}
            </Theme>
          ))}
        </div>
        <div className="flex flex-col gap-8 min-w-0">
          <div className="flex items-center justify-between gap-8">
            <span className={LABEL}>Классы</span>
            <div className="flex gap-2 p-2 br-full bg-foreground/5">
              {[false, true].map((j) => (
                <button
                  key={String(j)}
                  type="button"
                  aria-pressed={jsx === j}
                  onClick={() => setJsx(j)}
                  className="h-24 px-10 br-full font-11 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-1"
                >
                  {j ? "JSX" : "HTML"}
                </button>
              ))}
            </div>
          </div>
          <CodeBlock file={jsx ? "Page.tsx" : "index.html"} code={code} />
        </div>
      </div>
    </div>
  );
}
