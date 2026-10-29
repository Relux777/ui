// Код переключателя темы из конструктора «Тёмная тема»: JSX для Next.js и React (next-themes) и HTML для сайта без
// сборки. HTML — целиком рабочий: настоящие иконки Boxicons (SVG в разметке), скрипт без модулей (работает и из
// файла, открытого с диска), выбор помнится, «Система» следит за темой устройства, панель браузера — в тон.
// Классы HTML-кода, которых нет в готовом CSS, страница дописывает в код <style> (собирает движок) — пример
// работает, даже если подключён только готовый CSS. Без React: под тестом (switcher-code.test.ts).

export type Kind = "icon" | "switch" | "segmented" | "select";

export const KINDS: Record<Kind, string> = {
  icon: "Иконка",
  switch: "Ползунок",
  segmented: "Три кнопки",
  select: "Список",
};

// анимация смены иконки: уходящая поворачивается и гаснет, новая выкручивается навстречу
export const ANIM =
  "transition-[rotate,scale,opacity] duration-500 ease-spring-bouncy";

// иконки Boxicons (набор basic) — те же, что в примере
const PATH = {
  sun: "M12 17.01c2.76 0 5.01-2.25 5.01-5.01S14.76 6.99 12 6.99 6.99 9.24 6.99 12s2.25 5.01 5.01 5.01M12 9c1.66 0 3.01 1.35 3.01 3.01s-1.35 3.01-3.01 3.01-3.01-1.35-3.01-3.01S10.34 9 12 9M13 19h-2v3h2v-3M13 2h-2v3h2V2M2 11h3v2H2zM19 11h3v2h-3zM4.22 18.36l.71.71.71.71 1.06-1.06 1.06-1.06-.71-.71-.71-.71-1.06 1.06zM19.78 5.64l-.71-.71-.71-.71-1.06 1.06-1.06 1.06.71.71.71.71 1.06-1.06zM7.76 6.34 6.7 5.28 5.64 4.22l-.71.71-.71.71L5.28 6.7l1.06 1.06.71-.71zM16.24 17.66l1.06 1.06 1.06 1.06.71-.71.71-.71-1.06-1.06-1.06-1.06-.71.71z",
  moon: "m12.2,22c4.53,0,8.45-2.91,9.76-7.24.11-.35.01-.74-.25-1-.26-.26-.64-.36-1-.25-.78.23-1.58.35-2.38.35-4.52,0-8.2-3.68-8.2-8.2,0-.8.12-1.6.35-2.38.11-.35.01-.74-.25-1s-.64-.36-1-.25C4.91,3.35,2,7.28,2,11.8c0,5.62,4.57,10.2,10.2,10.2ZM8.18,4.65c-.03.34-.05.68-.05,1.02,0,5.62,4.57,10.2,10.2,10.2.34,0,.68-.02,1.02-.05-1.42,2.56-4.12,4.18-7.15,4.18-4.52,0-8.2-3.68-8.2-8.2,0-3.03,1.63-5.73,4.18-7.15Z",
  desktop:
    "m3.5,18h7.5v2h-3v2h8v-2h-3v-2h7.5c.83,0,1.5-.67,1.5-1.5V4.5c0-.83-.67-1.5-1.5-1.5H3.5c-.83,0-1.5.67-1.5,1.5v12c0,.83.67,1.5,1.5,1.5Zm.5-13h16v9H4V5Z",
  chevron: "m12 15.41 5.71-5.7-1.42-1.42-4.29 4.3-4.29-4.3-1.42 1.42z",
} as const;

const svg = (name: keyof typeof PATH, size: number, cls = "") =>
  `<svg${cls ? ` class="${cls}"` : ""} width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${PATH[name]}"/></svg>`;

const MODES = [
  { id: "light", title: "Светлая", icon: "sun" },
  { id: "dark", title: "Тёмная", icon: "moon" },
  { id: "system", title: "Система", icon: "desktop" },
] as const;

// ── HTML · JS ───────────────────────────────────────────────────────────────

// общая часть скрипта: применить тему, помнить выбор, «Система» — следить за устройством
const APPLY = `  var media = matchMedia("(prefers-color-scheme: dark)");
  function saved() {
    return localStorage.getItem("theme") || "system";
  }
  // "light" | "dark" | "system": data-theme на <html>, выбор — в localStorage, панель браузера — в тон
  function applyTheme(mode) {
    var dark = mode === "dark" || (mode === "system" && media.matches);
    var root = document.documentElement;
    root.setAttribute("data-switching", ""); // смена — без перетекания каждого элемента
    root.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", mode);
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.content = dark ? "#070707" : "#fafafb";
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.removeAttribute("data-switching");
      });
    });
    show(mode, dark);
  }
  media.addEventListener("change", function () {
    if (saved() === "system") applyTheme("system");
  });`;

function script(body: string) {
  return `<script>
(function () {
${APPLY}

${body}

  // тему уже поставил скрипт в <head>; нет его — ставим сейчас
  var theme = document.documentElement.getAttribute("data-theme");
  if (theme) show(saved(), theme === "dark");
  else applyTheme(saved());
})();
</script>`;
}

export function htmlCode(kind: Kind, animate: boolean, labels: boolean) {
  const anim = animate ? ` ${ANIM}` : "";

  if (kind === "icon")
    return `<button type="button" id="theme-toggle" class="inline-flex items-center gap-8 h-40 px-10 br-full border bg-surface text-foreground shadow-2 transition-[scale] active:scale-92" aria-label="Сменить тему">
  <span class="grid size-24 place-items-center">
    ${svg("sun", 24, `[grid-area:1/1]${anim} opacity-0 -rotate-90 scale-40 dark:opacity-100 dark:rotate-0 dark:scale-100`)}
    ${svg("moon", 24, `[grid-area:1/1]${anim} dark:opacity-0 dark:rotate-90 dark:scale-40`)}
  </span>${labels ? '\n  <span id="theme-label" class="pr-4 font-13 font-w-600">Светлая</span>' : ""}
</button>

${script(`  var button = document.getElementById("theme-toggle");
  // иконку выбирает CSS по data-theme, скрипту — только подпись
  function show(mode, dark) {${labels ? '\n    document.getElementById("theme-label").textContent = dark ? "Тёмная" : "Светлая";' : ""}
  }
  button.addEventListener("click", function () {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(dark ? "light" : "dark");
  });`)}`;

  if (kind === "switch")
    return `<button type="button" id="theme-toggle" role="switch" aria-checked="false" class="inline-flex items-center gap-10 text-foreground font-13 font-w-600" aria-label="Тёмная тема">
  <span class="relative w-60 h-34 br-full bg-foreground/12 dark:bg-secondary transition-colors duration-300">
    <span class="absolute top-3 left-3 size-28 br-full grid place-items-center bg-white text-gray-900 shadow-2${animate ? " transition-[translate] duration-500 ease-spring" : ""} dark:translate-x-26">
      ${svg("sun", 16, "[grid-area:1/1] dark:opacity-0")}
      ${svg("moon", 16, "[grid-area:1/1] opacity-0 dark:opacity-100")}
    </span>
  </span>${labels ? '\n  <span id="theme-label">Светлая</span>' : ""}
</button>

${script(`  var button = document.getElementById("theme-toggle");
  function show(mode, dark) {
    button.setAttribute("aria-checked", dark ? "true" : "false");${labels ? '\n    document.getElementById("theme-label").textContent = dark ? "Тёмная" : "Светлая";' : ""}
  }
  button.addEventListener("click", function () {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(dark ? "light" : "dark");
  });`)}`;

  if (kind === "segmented")
    return `<fieldset id="theme-modes" class="relative grid grid-cols-3 m-0 p-3 border-0 br-full bg-foreground/6 text-foreground">
  <legend class="sr-only">Тема</legend>
  <span id="theme-thumb" aria-hidden="true" class="absolute top-3 bottom-3 left-3 w-[calc((100%-6px)/3)] br-full bg-surface shadow-2${animate ? " transition-[translate] duration-500 ease-spring" : ""}"></span>
${MODES.map(
  (m) =>
    `  <button type="button" data-mode="${m.id}" aria-pressed="false" aria-label="${m.title}" class="relative z-1 flex items-center justify-center gap-6 h-34 px-12 br-full font-13 font-w-600 text-foreground-muted transition-colors aria-pressed:text-foreground">
    ${svg(m.icon, 16)}${labels ? `\n    ${m.title}` : ""}
  </button>`,
).join("\n")}
</fieldset>

${script(`  var buttons = document.querySelectorAll("#theme-modes [data-mode]");
  var thumb = document.getElementById("theme-thumb");
  function show(mode) {
    buttons.forEach(function (b, i) {
      var on = b.getAttribute("data-mode") === mode;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) thumb.style.translate = i * 100 + "% 0";
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      applyTheme(b.getAttribute("data-mode"));
    });
  });`)}`;

  return `<div id="theme-select" class="relative inline-block text-foreground">
  <button type="button" id="theme-button" aria-haspopup="menu" aria-expanded="false" class="flex items-center gap-8 h-40 pl-12 pr-10 br-lg border bg-surface shadow-1 font-13 font-w-600">
    <span id="theme-current" class="grid place-items-center">${svg("desktop", 16)}</span>${labels ? '\n    <span id="theme-label">Система</span>' : ""}
    ${svg("chevron", 16, `text-foreground-muted${animate ? " transition-[rotate] duration-300 ease-spring" : ""} [[aria-expanded=true]>&]:rotate-180`)}
  </button>
  <div id="theme-menu" role="menu" class="absolute top-full left-0 z-10 mt-6 w-160 flex flex-col p-4 br-lg border bg-surface shadow-4 origin-top opacity-0 scale-95 -translate-y-4 invisible data-open:opacity-100 data-open:scale-100 data-open:translate-y-0 data-open:visible${animate ? " transition-[opacity,scale,translate,visibility] duration-300 ease-spring" : ""}">
${MODES.map(
  (m) =>
    `    <button type="button" role="menuitemradio" data-mode="${m.id}" aria-checked="false" class="flex items-center gap-8 h-34 px-10 br-md font-13 text-left transition-colors hover:bg-foreground/5 aria-checked:font-w-600 aria-checked:text-secondary">
      ${svg(m.icon, 16)}
      ${m.title}
    </button>`,
).join("\n")}
  </div>
</div>

${script(`  var button = document.getElementById("theme-button");
  var menu = document.getElementById("theme-menu");
  var items = menu.querySelectorAll("[data-mode]");
  function open(on) {
    button.setAttribute("aria-expanded", on ? "true" : "false");
    if (on) menu.setAttribute("data-open", "");
    else menu.removeAttribute("data-open");
  }
  function show(mode) {
    items.forEach(function (item) {
      var on = item.getAttribute("data-mode") === mode;
      item.setAttribute("aria-checked", on ? "true" : "false");
      if (on) {
        document.getElementById("theme-current").innerHTML = item.querySelector("svg").outerHTML;${labels ? '\n        document.getElementById("theme-label").textContent = item.textContent.trim();' : ""}
      }
    });
  }
  button.addEventListener("click", function () {
    open(button.getAttribute("aria-expanded") !== "true");
  });
  items.forEach(function (item) {
    item.addEventListener("click", function () {
      applyTheme(item.getAttribute("data-mode"));
      open(false);
    });
  });
  // мимо меню или Esc — закрыть
  document.addEventListener("click", function (e) {
    if (!document.getElementById("theme-select").contains(e.target)) open(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") open(false);
  });`)}`;
}

// классы HTML-кода: всё из class="…"
export function classesOf(html: string) {
  const out = new Set<string>();
  for (const m of html.matchAll(/class="([^"]*)"/g))
    for (const c of m[1].split(/\s+/)) if (c) out.add(c);
  return [...out];
}

// все варианты конструктора: ключ — вид, анимация, подписи
export const VARIANTS = (Object.keys(KINDS) as Kind[]).flatMap((kind) =>
  [true, false].flatMap((animate) =>
    [true, false].map((labels) => ({
      key: variantKey(kind, animate, labels),
      kind,
      animate,
      labels,
    })),
  ),
);

export function variantKey(kind: Kind, animate: boolean, labels: boolean) {
  return `${kind}-${animate ? "a" : "s"}-${labels ? "l" : "n"}`;
}

// ── Next.js · React ─────────────────────────────────────────────────────────

export function jsxCode(kind: Kind, animate: boolean, labels: boolean) {
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
