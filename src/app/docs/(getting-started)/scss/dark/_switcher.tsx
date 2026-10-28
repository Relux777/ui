"use client";

// Конструктор переключателя темы: вид (иконка с анимацией, как в шапке сайта; ползунок; три кнопки;
// выпадающий список), анимация и подписи → живой пример в своей теме и готовый код для Next.js / React
// (next-themes) или чистого JS. Пример меняет тему только у себя (data-theme на рамке), не у сайта.

import { ChevronDown } from "@boxicons/react/ChevronDown";
import { Desktop } from "@boxicons/react/Desktop";
import { Moon } from "@boxicons/react/Moon";
import { Sun } from "@boxicons/react/Sun";
import { useEffect, useState } from "react";
import { CodeBlock } from "../../../../_docs/docs";
import { useDocsPlatform, usesJsx } from "../../../_platform";

const KINDS = {
  icon: "Иконка",
  switch: "Ползунок",
  segmented: "Три кнопки",
  select: "Список",
} as const;
type Kind = keyof typeof KINDS;

type Mode = "light" | "dark" | "system";
const MODES: { id: Mode; title: string; Icon: typeof Sun }[] = [
  { id: "light", title: "Светлая", Icon: Sun },
  { id: "dark", title: "Тёмная", Icon: Moon },
  { id: "system", title: "Система", Icon: Desktop },
];

const LABEL = "font-12 font-w-700 uppercase letter-s-6 text-foreground-subtle";
const SEG =
  "h-32 px-10 br-full font-13 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2";

// анимация смены иконки: уходящая поворачивается и гаснет, новая выкручивается навстречу
const ANIM =
  "transition-[rotate,scale,opacity] duration-500 ease-spring-bouncy";

// ── Живые образцы ───────────────────────────────────────────────────────────

function Preview({
  kind,
  animate,
  labels,
  mode,
  setMode,
}: {
  kind: Kind;
  animate: boolean;
  labels: boolean;
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  const [open, setOpen] = useState(false);
  const dark = mode === "dark";
  const anim = animate ? ANIM : "";

  if (kind === "icon")
    return (
      <button
        type="button"
        aria-label="Сменить тему"
        onClick={() => setMode(dark ? "light" : "dark")}
        className="flex items-center gap-8 h-40 px-10 br-full border bg-surface shadow-2 active:scale-92 transition-[scale]"
      >
        <span className="grid size-24 place-items-center">
          <Sun
            size="sm"
            aria-hidden="true"
            className={`[grid-area:1/1] ${anim} ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-40"}`}
          />
          <Moon
            size="sm"
            aria-hidden="true"
            className={`[grid-area:1/1] ${anim} ${dark ? "opacity-0 rotate-90 scale-40" : "opacity-100 rotate-0 scale-100"}`}
          />
        </span>
        {labels && (
          <span className="pr-4 font-13 font-w-600">
            {dark ? "Тёмная" : "Светлая"}
          </span>
        )}
      </button>
    );

  if (kind === "switch")
    return (
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Тёмная тема"
        onClick={() => setMode(dark ? "light" : "dark")}
        className="flex items-center gap-10 font-13 font-w-600"
      >
        <span
          className={`relative w-60 h-34 br-full transition-colors duration-300 ${dark ? "bg-secondary" : "bg-foreground/12"}`}
        >
          <span
            className={`absolute top-3 left-3 size-28 br-full grid place-items-center bg-white text-gray-900 shadow-2 ${animate ? "transition-[translate] duration-500 ease-spring" : ""} ${dark ? "translate-x-26" : ""}`}
          >
            {dark ? (
              <Moon size="xs" aria-hidden="true" />
            ) : (
              <Sun size="xs" aria-hidden="true" />
            )}
          </span>
        </span>
        {labels && <span>{dark ? "Тёмная" : "Светлая"}</span>}
      </button>
    );

  if (kind === "segmented") {
    const index = MODES.findIndex((m) => m.id === mode);
    return (
      <fieldset className="relative grid grid-cols-3 m-0 p-3 border-0 br-full bg-foreground/6">
        <legend className="sr-only">Тема</legend>
        <span
          aria-hidden="true"
          className={`absolute top-3 bottom-3 left-3 w-[calc((100%-6px)/3)] br-full bg-surface shadow-2 ${animate ? "transition-[translate] duration-500 ease-spring" : ""}`}
          style={{ translate: `${index * 100}% 0` }}
        />
        {MODES.map(({ id, title, Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            aria-label={title}
            onClick={() => setMode(id)}
            className="relative z-1 flex items-center justify-center gap-6 h-34 px-12 br-full font-13 font-w-600 text-foreground-muted transition-colors aria-pressed:text-foreground"
          >
            <Icon size="xs" aria-hidden="true" />
            {labels && title}
          </button>
        ))}
      </fieldset>
    );
  }

  const current = MODES.find((m) => m.id === mode) ?? MODES[0];
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-8 h-40 pl-12 pr-10 br-lg border bg-surface shadow-1 font-13 font-w-600"
      >
        <current.Icon size="xs" aria-hidden="true" />
        {labels ? current.title : null}
        <ChevronDown
          size="xs"
          aria-hidden="true"
          className={`text-foreground-muted ${animate ? "transition-[rotate] duration-300 ease-spring" : ""} ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        role="menu"
        data-open={open || undefined}
        inert={!open}
        className={`absolute top-full left-0 z-10 mt-6 w-160 flex flex-col p-4 br-lg border bg-surface shadow-4 origin-top opacity-0 scale-95 -translate-y-4 invisible data-open:opacity-100 data-open:scale-100 data-open:translate-y-0 data-open:visible ${animate ? "transition-[opacity,scale,translate,visibility] duration-300 ease-spring" : ""}`}
      >
        {MODES.map(({ id, title, Icon }) => (
          <button
            key={id}
            type="button"
            role="menuitemradio"
            aria-checked={mode === id}
            onClick={() => {
              setMode(id);
              setOpen(false);
            }}
            className="flex items-center gap-8 h-34 px-10 br-md font-13 text-left transition-colors hover:bg-foreground/5 aria-checked:font-w-600 aria-checked:text-secondary"
          >
            <Icon size="xs" aria-hidden="true" />
            {title}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Код ─────────────────────────────────────────────────────────────────────

function jsxCode(kind: Kind, animate: boolean, labels: boolean) {
  const anim = animate ? ` ${ANIM}` : "";
  const head = `"use client";

import { useTheme } from "next-themes";
import { Moon } from "@boxicons/react/Moon";
import { Sun } from "@boxicons/react/Sun";${kind === "segmented" || kind === "select" ? `\nimport { Desktop } from "@boxicons/react/Desktop";` : ""}
`;
  if (kind === "icon")
    return `${head}
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label="Сменить тему"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex items-center gap-8 h-40 px-10 br-full border bg-surface shadow-2 active:scale-92"
    >
      {/* обе иконки в разметке, видимую выбирает CSS по data-theme — без мигания до гидратации */}
      <span className="grid size-24 place-items-center">
        <Sun className="[grid-area:1/1]${anim} opacity-0 -rotate-90 scale-40 dark:opacity-100 dark:rotate-0 dark:scale-100" />
        <Moon className="[grid-area:1/1]${anim} dark:opacity-0 dark:rotate-90 dark:scale-40" />
      </span>${labels ? `\n      <span className="font-13 font-w-600">{dark ? "Тёмная" : "Светлая"}</span>` : ""}
    </button>
  );
}`;
  if (kind === "switch")
    return `${head}
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Тёмная тема"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex items-center gap-10"
    >
      <span className="relative w-60 h-34 br-full bg-foreground/12 dark:bg-secondary transition-colors">
        <span className="absolute top-3 left-3 size-28 br-full grid place-items-center bg-white text-gray-900 shadow-2${animate ? " transition-[translate] duration-500 ease-spring" : ""} dark:translate-x-26">
          {dark ? <Moon size="xs" /> : <Sun size="xs" />}
        </span>
      </span>${labels ? `\n      <span>{dark ? "Тёмная" : "Светлая"}</span>` : ""}
    </button>
  );
}`;
  if (kind === "segmented")
    return `${head}
const MODES = [
  { id: "light", title: "Светлая", Icon: Sun },
  { id: "dark", title: "Тёмная", Icon: Moon },
  { id: "system", title: "Система", Icon: Desktop },
];

export function ThemeSegmented() {
  const { theme = "system", setTheme } = useTheme();
  const index = MODES.findIndex((m) => m.id === theme);
  return (
    <fieldset className="relative grid grid-cols-3 m-0 p-3 border-0 br-full bg-foreground/6">
      <legend className="sr-only">Тема</legend>
      <span
        aria-hidden="true"
        className="absolute top-3 bottom-3 left-3 w-[calc((100%-6px)/3)] br-full bg-surface shadow-2${animate ? " transition-[translate] duration-500 ease-spring" : ""}"
        style={{ translate: \`\${index * 100}% 0\` }}
      />
      {MODES.map(({ id, title, Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={theme === id}
          aria-label={title}
          onClick={() => setTheme(id)}
          className="relative z-1 flex items-center justify-center gap-6 h-34 px-12 br-full text-foreground-muted aria-pressed:text-foreground"
        >
          <Icon size="xs" />${labels ? "\n          {title}" : ""}
        </button>
      ))}
    </fieldset>
  );
}`;
  return `${head}
import { useEffect, useState } from "react";

const MODES = [
  { id: "light", title: "Светлая", Icon: Sun },
  { id: "dark", title: "Тёмная", Icon: Moon },
  { id: "system", title: "Система", Icon: Desktop },
];

export function ThemeSelect() {
  const { theme = "system", setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const current = MODES.find((m) => m.id === theme) ?? MODES[2];
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-8 h-40 px-12 br-lg border bg-surface"
      >
        <current.Icon size="xs" />${labels ? "\n        {current.title}" : ""}
      </button>
      <div
        role="menu"
        data-open={open || undefined}
        className="absolute top-full mt-6 w-160 p-4 br-lg border bg-surface shadow-4 opacity-0 scale-95 invisible data-open:opacity-100 data-open:scale-100 data-open:visible${animate ? " transition-[opacity,scale,visibility] duration-300 ease-spring" : ""}"
      >
        {MODES.map(({ id, title, Icon }) => (
          <button
            key={id}
            type="button"
            role="menuitemradio"
            aria-checked={theme === id}
            onClick={() => { setTheme(id); setOpen(false); }}
            className="flex items-center gap-8 w-full h-34 px-10 br-md hover:bg-foreground/5 aria-checked:text-secondary"
          >
            <Icon size="xs" /> {title}
          </button>
        ))}
      </div>
    </div>
  );
}`;
}

function jsCode(kind: Kind, animate: boolean, labels: boolean) {
  const save = `// тема: светлая, тёмная или как в системе; выбор помним
function applyTheme(mode) {
  const dark = mode === "dark" ||
    (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  localStorage.setItem("theme", mode);
}`;
  const anim = animate ? ` ${ANIM}` : "";
  if (kind === "icon" || kind === "switch")
    return `<!-- разметка -->
${
  kind === "icon"
    ? `<button type="button" class="theme-toggle flex items-center gap-8 h-40 px-10 br-full border bg-surface shadow-2" aria-label="Сменить тему">
  <span class="grid size-24 place-items-center">
    <svg class="[grid-area:1/1]${anim} opacity-0 -rotate-90 scale-40 dark:opacity-100 dark:rotate-0 dark:scale-100"><!-- солнце --></svg>
    <svg class="[grid-area:1/1]${anim} dark:opacity-0 dark:rotate-90 dark:scale-40"><!-- луна --></svg>
  </span>${labels ? '\n  <span class="theme-label font-13 font-w-600">Светлая</span>' : ""}
</button>`
    : `<button type="button" role="switch" aria-checked="false" class="theme-toggle flex items-center gap-10" aria-label="Тёмная тема">
  <span class="relative w-60 h-34 br-full bg-foreground/12 dark:bg-secondary">
    <span class="absolute top-3 left-3 size-28 br-full bg-white shadow-2${animate ? " transition-[translate] duration-500 ease-spring" : ""} dark:translate-x-26"></span>
  </span>${labels ? '\n  <span class="theme-label">Светлая</span>' : ""}
</button>`
}

<script>
${save}

document.querySelector(".theme-toggle").addEventListener("click", (e) => {
  const dark = document.documentElement.dataset.theme !== "dark";
  applyTheme(dark ? "dark" : "light");
  e.currentTarget.setAttribute("aria-checked", dark);${labels ? '\n  e.currentTarget.querySelector(".theme-label").textContent = dark ? "Тёмная" : "Светлая";' : ""}
});
</script>`;
  return `<!-- разметка -->
<div class="theme-modes flex gap-4 p-3 br-full bg-foreground/6">
  <button type="button" data-mode="light" class="h-34 px-12 br-full aria-pressed:bg-surface aria-pressed:shadow-2">${labels ? "Светлая" : "☀"}</button>
  <button type="button" data-mode="dark" class="h-34 px-12 br-full aria-pressed:bg-surface aria-pressed:shadow-2">${labels ? "Тёмная" : "☾"}</button>
  <button type="button" data-mode="system" class="h-34 px-12 br-full aria-pressed:bg-surface aria-pressed:shadow-2">${labels ? "Система" : "◐"}</button>
</div>

<script>
${save}

const buttons = document.querySelectorAll(".theme-modes [data-mode]");
const mark = (mode) => buttons.forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === mode));
mark(localStorage.getItem("theme") || "system");
buttons.forEach((b) => b.addEventListener("click", () => {
  applyTheme(b.dataset.mode);
  mark(b.dataset.mode);
}));
</script>`;
}

// ── Конструктор ─────────────────────────────────────────────────────────────

export function ThemeSwitcherBuilder() {
  const [kind, setKind] = useState<Kind>("icon");
  const [animate, setAnimate] = useState(true);
  const [labels, setLabels] = useState(false);
  // код — под платформу справки
  const platform = useDocsPlatform();
  const [jsx, setJsx] = useState(true);
  useEffect(() => setJsx(usesJsx(platform)), [platform]);
  const [mode, setMode] = useState<Mode>("light");
  const theme = mode === "system" ? "light" : mode;

  return (
    <div className="br-xl border bg-surface shadow-1 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <div className="flex flex-col gap-18 p-16 sm:p-20 border-b lg:border-b-0 lg:border-r">
        <div className="flex flex-col gap-8">
          <span className={LABEL}>Вид</span>
          <div className="grid grid-cols-2 gap-4 p-3 br-xl bg-foreground/5">
            {(Object.keys(KINDS) as Kind[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={SEG}
              >
                {KINDS[k]}
              </button>
            ))}
          </div>
        </div>
        {(
          [
            ["Анимация", animate, setAnimate],
            ["Подписи", labels, setLabels],
          ] as const
        ).map(([title, on, set]) => (
          <button
            key={title}
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => set(!on)}
            className="group flex items-center justify-between gap-12 font-14 font-w-500"
          >
            {title}
            <span className="relative w-40 h-24 br-full bg-foreground/15 transition-colors group-[[aria-checked=true]]:bg-secondary before:absolute before:top-3 before:left-3 before:size-18 before:br-full before:bg-white before:shadow-2 before:transition-[translate] before:duration-300 before:ease-spring group-[[aria-checked=true]]:before:translate-x-16" />
          </button>
        ))}
        <p className="font-13 text-foreground-muted">
          «Три кнопки» и «Список» дают выбрать и тему системы — так удобнее
          всего: человек не выбирал — сайт как его телефон.
        </p>
      </div>

      <div className="flex flex-col gap-14 p-16 sm:p-20 min-w-0">
        {/* пример в своей теме: переключатель меняет её только здесь */}
        <div
          data-theme={theme}
          className="relative z-1 grid place-items-center min-h-160 p-20 br-lg border bg-background text-foreground transition-colors duration-500"
        >
          <Preview
            kind={kind}
            animate={animate}
            labels={labels}
            mode={mode}
            setMode={setMode}
          />
        </div>
        <div className="flex items-center justify-between gap-8">
          <span className={LABEL}>Код</span>
          <div className="flex gap-2 p-2 br-full bg-foreground/5">
            {(
              [
                [true, "Next.js · React"],
                [false, "HTML · JS"],
              ] as const
            ).map(([j, title]) => (
              <button
                key={title}
                type="button"
                aria-pressed={jsx === j}
                onClick={() => setJsx(j)}
                className="h-24 px-10 br-full font-11 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-1"
              >
                {title}
              </button>
            ))}
          </div>
        </div>
        <CodeBlock
          file={jsx ? "ThemeToggle.tsx" : "index.html"}
          code={
            jsx ? jsxCode(kind, animate, labels) : jsCode(kind, animate, labels)
          }
        />
      </div>
    </div>
  );
}
