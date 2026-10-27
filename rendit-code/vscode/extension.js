// RenDit Code IntelliSense — расширение VS Code.
//
// Что делает:
//   • автодополнение классов и вариантов (hover:, md:, dark: …) в className="…", class="…", cn("…") и т.п.;
//   • при наведении на класс — CSS, который сгенерирует движок;
//   • образцы цвета рядом с bg-…, text-…, border-… (значения токенов светлой темы).
//
// Своих правил у расширения нет: оно загружает движок проекта (rendit-code/core) и спрашивает его.
// Поэтому подсказки всегда совпадают с тем, что реально попадёт в CSS. Новый токен в settings/*.scss
// или правка rendit.config.mjs подхватываются сами; правки кода движка — после Developer: Reload Window.

const vscode = require("vscode");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const LANGUAGES = [
  "typescriptreact",
  "javascriptreact",
  "typescript",
  "javascript",
  "html",
  "mdx",
  "markdown",
  "vue",
  "svelte",
  "astro",
];
const SELECTOR = LANGUAGES.map((language) => ({ language, scheme: "file" }));
const TOKEN_CHAR = /[^\s"'`{}]/;

/** @type {vscode.OutputChannel} */
let log;
/** корень проекта (папка с rendit.config.mjs) → Promise<Project> */
const projects = new Map();
let roots = [];

// ── Загрузка движка проекта ───────────────────────────────────────────────────
async function loadProject(root) {
  const stamp = Date.now();
  const load = (file) =>
    import(
      `${pathToFileURL(path.join(root, "rendit-code", "core", file)).href}?v=${stamp}`
    );
  const [
    { loadConfig },
    { createGenerator },
    { buildCatalog, classColor },
    { splitTopLevel },
  ] = await Promise.all([
    load("config.mjs"),
    load("generator.mjs"),
    load("catalog.mjs"),
    load("parser.mjs"),
  ]);

  const started = Date.now();
  const config = await loadConfig(root);
  const generator = createGenerator(config.theme, config);
  const catalog = buildCatalog(config, generator);

  // цвета для образцов в списке подсказок считаются один раз
  const colors = new Map();
  for (const cls of catalog.utilities) {
    const c = classColor(cls, config, generator);
    if (c) colors.set(cls, c);
  }

  log.appendLine(
    `[${root}] RenDit Code v${config.version}: ${catalog.utilities.length} классов, ${catalog.variants.length} вариантов, ` +
      `${colors.size} цветов — за ${Date.now() - started} мс${config.tokenInfo.warning ? ` (⚠ ${config.tokenInfo.warning})` : ""}`,
  );

  return {
    root,
    config,
    generator,
    catalog,
    colors,
    splitTopLevel,
    colorOf: (cls) => colors.get(cls) ?? classColor(cls, config, generator),
    items: null, // готовые CompletionItem без префикса — собираются при первом запросе
  };
}

function getProject(root) {
  if (!projects.has(root)) {
    const p = loadProject(root).catch((err) => {
      log.appendLine(
        `[${root}] ✖ не удалось загрузить движок: ${err?.stack ?? err}`,
      );
      projects.delete(root);
      return null;
    });
    projects.set(root, p);
  }
  return projects.get(root);
}

async function findRoots() {
  const files = await vscode.workspace.findFiles(
    "**/rendit.config.mjs",
    "**/node_modules/**",
    20,
  );
  roots = files
    .map((f) => path.dirname(f.fsPath))
    .sort((a, b) => b.length - a.length);
}

// проект, в котором лежит файл (самая глубокая папка с rendit.config.mjs)
function projectFor(doc) {
  const file = doc.uri.fsPath.toLowerCase();
  const root = roots.find((r) => file.startsWith(r.toLowerCase() + path.sep));
  return root ? getProject(root) : Promise.resolve(null);
}

// ── Где мы: внутри строки с классами? ─────────────────────────────────────────
function classFunctions() {
  return vscode.workspace
    .getConfiguration("renditCode")
    .get("classFunctions", ["cn", "clsx", "cva", "twMerge", "tv"]);
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Текст строки с классами от её начала до позиции (или null, если позиция не в такой строке)
function classStringBefore(doc, pos) {
  const offset = doc.offsetAt(pos);
  const before = doc.getText(
    new vscode.Range(doc.positionAt(Math.max(0, offset - 3000)), pos),
  );

  // className="…  class='…  className={`…
  const attr = /\b(?:className|class)\s*=\s*(?:\{\s*)?(["'`])([^"'`]*)$/.exec(
    before,
  );
  if (attr) return attr[2];

  // cn("a", "b…  — открытый вызов, и курсор внутри строки
  const fns = classFunctions().map(escapeRe).join("|");
  if (!fns) return null;
  const call = new RegExp(`\\b(?:${fns})\\(([^()]*)$`).exec(before);
  if (!call) return null;
  const args = call[1];
  const lastQuote = Math.max(
    args.lastIndexOf('"'),
    args.lastIndexOf("'"),
    args.lastIndexOf("`"),
  );
  if (lastQuote === -1) return null;
  const q = args[lastQuote];
  const count = args.split(q).length - 1;
  return count % 2 === 1 ? args.slice(lastQuote + 1) : null;
}

// Границы класса вокруг позиции в строке
function tokenRangeAt(doc, pos) {
  const line = doc.lineAt(pos.line).text;
  let start = pos.character;
  let end = pos.character;
  while (start > 0 && TOKEN_CHAR.test(line[start - 1])) start--;
  while (end < line.length && TOKEN_CHAR.test(line[end])) end++;
  return new vscode.Range(pos.line, start, pos.line, end);
}

// ── Автодополнение ────────────────────────────────────────────────────────────
function toHex({ r, g, b }) {
  const h = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function baseItems(project) {
  if (project.items) return project.items;
  const utilities = project.catalog.utilities.map((cls, i) => {
    const color = project.colors.get(cls);
    const item = new vscode.CompletionItem(
      cls,
      color
        ? vscode.CompletionItemKind.Color
        : vscode.CompletionItemKind.Constant,
    );
    item.sortText = `1${String(i).padStart(5, "0")}`;
    // для цвета VS Code рисует образец, если documentation — строка с цветом
    if (color) item.documentation = toHex(color);
    item.renditClass = cls;
    return item;
  });
  const variants = project.catalog.variants.map((v, i) => {
    const item = new vscode.CompletionItem(
      `${v}:`,
      vscode.CompletionItemKind.Keyword,
    );
    item.sortText = `0${String(i).padStart(5, "0")}`;
    item.detail = "вариант RenDit Code";
    item.command = { command: "editor.action.triggerSuggest", title: "" };
    item.renditVariant = v;
    return item;
  });
  project.items = { utilities, variants };
  return project.items;
}

const completionProvider = {
  async provideCompletionItems(doc, pos) {
    const content = classStringBefore(doc, pos);
    if (content === null) return null;
    const project = await projectFor(doc);
    if (!project) return null;

    const token = content.split(/\s+/).pop() ?? "";
    const parts = project.splitTopLevel(token, ":");
    if (!parts) return null;
    let prefix = parts.length > 1 ? `${parts.slice(0, -1).join(":")}:` : "";
    if (parts[parts.length - 1].startsWith("!")) prefix += "!";

    const full = tokenRangeAt(doc, pos);
    const range = new vscode.Range(
      pos.translate(0, -token.length),
      full.end.isAfter(pos) ? full.end : pos,
    );
    const { utilities, variants } = baseItems(project);

    const make = (base, text) => {
      const item = new vscode.CompletionItem(base.label, base.kind);
      item.sortText = base.sortText;
      item.documentation = base.documentation;
      item.detail = base.detail;
      item.command = base.command;
      item.insertText = text;
      item.filterText = text;
      item.range = range;
      item.renditClass = base.renditClass ? text : undefined;
      return item;
    };

    const list = [];
    for (const v of variants)
      list.push(make(v, `${prefix.replace(/!$/, "")}${v.renditVariant}:`));
    for (const u of utilities) list.push(make(u, `${prefix}${u.renditClass}`));
    return new vscode.CompletionList(list, false);
  },

  // CSS класса — лениво, только для выбранного пункта
  async resolveCompletionItem(item) {
    if (!item.renditClass) return item;
    const doc = vscode.window.activeTextEditor?.document;
    const project = doc && (await projectFor(doc));
    if (!project) return item;
    const css = cssFor(project, item.renditClass);
    if (!css) return item;
    if (item.kind === vscode.CompletionItemKind.Color)
      item.detail = oneLine(css);
    else
      item.documentation = new vscode.MarkdownString().appendCodeblock(
        css,
        "css",
      );
    return item;
  },
};

// CSS одного класса без шапки файла и обёртки @layer
function cssFor(project, cls) {
  if (!project.generator.isValid(cls)) return null;
  const { css } = project.generator.generate([cls]);
  const lines = css
    .split("\n")
    .filter((l) => !l.startsWith("/*!") && !l.startsWith("@property"));
  const start = lines.findIndex((l) => l.startsWith("@layer"));
  const body = lines.slice(start + 1, lines.lastIndexOf("}"));
  return body
    .map((l) => l.replace(/^ {2}/, ""))
    .join("\n")
    .trim();
}

const oneLine = (css) =>
  css
    .split("\n")
    .filter((l) => /^\s+[\w-]+:/.test(l))
    .map((l) => l.trim())
    .join(" ");

// ── Наведение: CSS класса ─────────────────────────────────────────────────────
const hoverProvider = {
  async provideHover(doc, pos) {
    const range = tokenRangeAt(doc, pos);
    if (range.isEmpty) return null;
    if (classStringBefore(doc, range.start) === null) return null;
    const project = await projectFor(doc);
    if (!project) return null;
    const cls = doc.getText(range);
    const css = cssFor(project, cls);
    if (!css) return null;
    const md = new vscode.MarkdownString();
    md.appendCodeblock(css, "css");
    md.appendMarkdown(`\n*RenDit Code v${project.config.version}*`);
    return new vscode.Hover(md, range);
  },
};

// ── Образцы цвета ─────────────────────────────────────────────────────────────
function classStrings(text) {
  const out = [];
  const attr = /\b(?:className|class)\s*=\s*(?:\{\s*)?(["'`])([^"'`]*)\1/g;
  for (const m of text.matchAll(attr))
    out.push({ start: m.index + m[0].indexOf(m[1]) + 1, value: m[2] });
  const fns = classFunctions().map(escapeRe).join("|");
  if (fns) {
    for (const call of text.matchAll(
      new RegExp(`\\b(?:${fns})\\(([^()]*)\\)`, "g"),
    )) {
      const argsStart = call.index + call[0].indexOf("(") + 1;
      for (const s of call[1].matchAll(/(["'`])([^"'`]*)\1/g))
        out.push({ start: argsStart + s.index + 1, value: s[2] });
    }
  }
  return out;
}

const colorProvider = {
  async provideDocumentColors(doc) {
    if (
      !vscode.workspace
        .getConfiguration("renditCode")
        .get("colorDecorators", true)
    )
      return [];
    const project = await projectFor(doc);
    if (!project) return [];
    const result = [];
    for (const { start, value } of classStrings(doc.getText())) {
      for (const m of value.matchAll(/\S+/g)) {
        const color = project.colorOf(m[0]);
        if (!color) continue;
        const from = doc.positionAt(start + m.index);
        const to = doc.positionAt(start + m.index + m[0].length);
        result.push(
          new vscode.ColorInformation(
            new vscode.Range(from, to),
            new vscode.Color(color.r, color.g, color.b, color.a),
          ),
        );
      }
    }
    return result;
  },
  // выбор в палитре ничего не меняет: цвет класса задаётся токеном, а не hex
  provideColorPresentations(_color, { document, range }) {
    return [new vscode.ColorPresentation(document.getText(range))];
  },
};

// ── Подключение ───────────────────────────────────────────────────────────────
function reloadAll() {
  projects.clear();
  return findRoots();
}

async function activate(context) {
  log = vscode.window.createOutputChannel("RenDit Code");
  await findRoots();

  context.subscriptions.push(
    log,
    vscode.languages.registerCompletionItemProvider(
      SELECTOR,
      completionProvider,
      '"',
      "'",
      "`",
      " ",
      ":",
      "-",
      "/",
    ),
    vscode.languages.registerHoverProvider(SELECTOR, hoverProvider),
    vscode.languages.registerColorProvider(SELECTOR, colorProvider),
    vscode.commands.registerCommand("renditCode.reload", async () => {
      await reloadAll();
      vscode.window.setStatusBarMessage(
        "RenDit Code: конфиг и токены перезагружены",
        3000,
      );
    }),
  );

  // конфиг движка или токены изменились — перезагрузить проект
  const watcher = vscode.workspace.createFileSystemWatcher(
    "**/{rendit.config.mjs,*.scss,package.json}",
  );
  const onChange = async (uri) => {
    if (uri.fsPath.includes(`${path.sep}node_modules${path.sep}`)) return;
    if (uri.fsPath.endsWith("rendit.config.mjs")) return reloadAll();
    for (const [root, p] of projects) {
      const project = await p;
      const isToken = project?.config.tokenInfo.files.some(
        (f) => path.resolve(f).toLowerCase() === uri.fsPath.toLowerCase(),
      );
      const isPkg =
        uri.fsPath.toLowerCase() ===
        path.join(root, "package.json").toLowerCase();
      if (isToken || isPkg) projects.delete(root);
    }
  };
  watcher.onDidChange(onChange);
  watcher.onDidCreate(onChange);
  watcher.onDidDelete(onChange);
  context.subscriptions.push(watcher);

  // прогреть движок заранее, чтобы первая подсказка была мгновенной
  for (const root of roots) getProject(root);
}

function deactivate() {}

module.exports = { activate, deactivate };
