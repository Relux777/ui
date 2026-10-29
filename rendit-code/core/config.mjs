// Конфиг RenDit Code: значения по умолчанию + rendit.config.mjs из корня проекта + токены из SCSS.

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildTheme } from "./theme.mjs";
import { looksLikeColor } from "./values.mjs";

export const CONFIG_FILE = "rendit.config.mjs";

export const DEFAULTS = {
  // где искать классы и куда писать результат (пути от корня проекта)
  content: ["src"],
  extensions: ["tsx", "ts", "jsx", "js", "mjs", "mdx", "md", "html"],
  ignore: ["node_modules", ".next", ".git", "generated"],
  output: "src/assets/scss/generated/rendit-code.css",
  screensOutput: "src/assets/scss/generated/_screens.scss",
  versionOutput: "src/assets/scss/generated/_version.scss",
  // SCSS-файл со всеми токенами. Движок компилирует его и берёт CSS-переменные:
  //   --ИМЯ: <цвет>        → bg-ИМЯ, text-ИМЯ/50, border-ИМЯ …
  //   --shadow-ИМЯ: …      → shadow-ИМЯ
  //   --radius-ИМЯ: …      → br-ИМЯ
  //   --gradient-ИМЯ: …    → bg-gradient-ИМЯ
  //   --ease-ИМЯ: …        → ease-ИМЯ
  tokens: "src/assets/scss/settings/_index.scss",
  layer: "utilities",
  darkSelector: '[data-theme="dark"]',

  // mobile-first: md: = (width >= 770px), max-md: = (width < 770px). Границы — как в ReluxCode.
  screens: {
    sm: "620px",
    md: "770px",
    lg: "990px",
    xl: "1200px",
    "2xl": "1400px",
  },
  // @md: — ширина родителя с классом @container
  containers: {
    xs: "320px",
    sm: "384px",
    md: "448px",
    lg: "512px",
    xl: "576px",
    "2xl": "672px",
  },

  theme: {
    columns: 12,
    // цвета сверх токенов: { brand: "#0d5ef5" } → bg-brand, bg-brand/40
    colors: {},
    fonts: {
      sans: "var(--font-google-sans), system-ui, Arial, Helvetica, sans-serif",
      mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    },
    // именованные отступы поверх чисел (p-10 = 10px работает и без них): { section: "120px" } → py-section
    spacing: {},
  },

  // классы, которых нет в исходниках буквально (собираются из строк в рантайме)
  safelist: [],
};

export async function loadConfig(root) {
  const file = path.join(root, CONFIG_FILE);
  let user = {};
  if (fs.existsSync(file)) {
    // ?t= — чтобы при изменении конфига в режиме watch import() не отдал старую версию из кэша
    const mod = await import(`${pathToFileURL(file).href}?t=${Date.now()}`);
    user = mod.default ?? {};
  }

  const config = {
    ...DEFAULTS,
    ...user,
    screens: user.screens ?? DEFAULTS.screens,
    containers: { ...DEFAULTS.containers, ...user.containers },
    theme: {
      ...DEFAULTS.theme,
      ...user.theme,
      fonts: { ...DEFAULTS.theme.fonts, ...user.theme?.fonts },
    },
    safelist: user.safelist ?? [],
    root,
    version: readVersion(root),
  };
  config.tokensPath = config.tokens ? path.join(root, config.tokens) : null;
  config.tokenInfo = await readTokens(config.tokensPath);
  // исходные настройки темы — для движка в браузере (CSS-конструктор справки): Map с функциями не передать
  config.themeSource = config.theme;
  config.theme = buildTheme(config);
  return config;
}

function readVersion(root) {
  try {
    return (
      JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
        .version ?? "0.0.0"
    );
  } catch {
    return "0.0.0";
  }
}

// ── Токены ─────────────────────────────────────────────────────────────────
// Компилируем SCSS (палитра считается циклами Sass — регуляркой её не прочитать),
// затем собираем все объявления CSS-переменных. Нет пакета sass — читаем исходники как есть.
export async function readTokens(file) {
  const info = {
    colors: [],
    shadows: [],
    radius: [],
    gradients: [],
    eases: [],
    files: [],
    values: {},
    warning: null,
  };
  if (!file || !fs.existsSync(file)) {
    if (file) info.warning = `файл токенов не найден: ${file}`;
    return info;
  }

  let css = "";
  try {
    const sass = await import("sass");
    const result = sass.compile(file, {
      style: "expanded",
      loadPaths: [path.dirname(file)],
    });
    css = result.css;
    info.files = result.loadedUrls
      .filter((u) => u.protocol === "file:")
      .map((u) => decodeURIComponent(u.pathname.replace(/^\/(\w:)/, "$1")));
  } catch (err) {
    info.warning = `не удалось скомпилировать токены (${err.message.split("\n")[0]}) — читаю файлы без Sass`;
    const dir = path.dirname(file);
    for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".scss")))
      css += fs.readFileSync(path.join(dir, f), "utf8");
  }

  const values = new Map();
  for (const m of css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .matchAll(/--([a-zA-Z][\w-]*)\s*:\s*([^;{}]+);/g)) {
    if (!values.has(m[1])) values.set(m[1], m[2].trim());
  }

  // цвет — это значение-цвет или ссылка на другой цвет: --primary: var(--gray-950)
  const colors = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const [name, value] of values) {
      if (colors.has(name) || /^(shadow|radius|gradient|ease)-/.test(name))
        continue;
      const ref = /^var\(--([\w-]+)\)$/.exec(value);
      if (looksLikeColor(value) || (ref && colors.has(ref[1]))) {
        colors.add(name);
        changed = true;
      }
    }
  }

  info.colors = [...colors];
  // значения светлой темы — для подсказок в редакторе (образцы цвета, CSS при наведении)
  info.values = Object.fromEntries(values);
  for (const name of values.keys()) {
    if (name.startsWith("shadow-") && name !== "shadow-color")
      info.shadows.push(name.slice(7));
    else if (name.startsWith("radius-")) info.radius.push(name.slice(7));
    else if (name.startsWith("gradient-")) info.gradients.push(name.slice(9));
    else if (name.startsWith("ease-")) info.eases.push(name.slice(5));
  }
  return info;
}
