// RenDit Code: сборка, наблюдение за файлами, запись результата.

import fs from "node:fs";
import path from "node:path";
import { CONFIG_FILE, loadConfig } from "./core/config.mjs";
import { createGenerator } from "./core/generator.mjs";
import { createScanner } from "./core/scanner.mjs";

export async function createEngine(root, { log = console.log } = {}) {
  let config;
  let scanner;
  let generator;
  let lastCss = null;

  async function init() {
    config = await loadConfig(root);
    scanner = createScanner(config);
    generator = createGenerator(config.theme, config);
    lastCss = null;
    if (config.tokenInfo.warning)
      log(`⚠ RenDit Code: ${config.tokenInfo.warning}`);
    writeScreens();
    writeVersion();
  }

  // Версия из package.json — для шапки RenDit_UI.scss
  function writeVersion() {
    if (!config.versionOutput) return;
    const scss = `// Сгенерировано RenDit Code из package.json. Не редактировать вручную.
$version: "${config.version}";
`;
    writeIfChanged(path.join(root, config.versionOutput), scss);
  }

  // Брейкпоинты для SCSS (миксины up/down в tools/_mixins.scss)
  function writeScreens() {
    if (!config.screensOutput) return;
    const entries = Object.entries(config.screens)
      .map(([k, v]) => `${/^\d/.test(k) ? `"${k}"` : k}: ${v}`)
      .join(", ");
    const scss = `// Сгенерировано RenDit Code из ${CONFIG_FILE}. Не редактировать вручную.\n$screens: (${entries});\n`;
    writeIfChanged(path.join(root, config.screensOutput), scss);
  }

  function emit() {
    const started = performance.now();
    const candidates = scanner.candidates();
    const { css, count } = generator.generate(candidates);
    const changed = css !== lastCss;
    if (changed) {
      lastCss = css;
      writeIfChanged(path.join(root, config.output), css);
    }
    return { count, changed, ms: performance.now() - started };
  }

  async function build() {
    const started = performance.now();
    await init();
    const files = scanner.scanAll();
    const { count } = emit();
    const t = config.tokenInfo;
    log(
      `⚡ RenDit Code v${config.version}: ${count} утилит из ${files} файлов за ${Math.round(performance.now() - started)} мс ` +
        `(токены: ${t.colors.length} цветов, ${t.shadows.length} теней, ${t.radius.length} скруглений)`,
    );
    return { count, files };
  }

  // Наблюдение: пересобираются только изменившиеся файлы, CSS пишется, только если он поменялся
  function watch() {
    const pending = new Set();
    let reloadConfig = false;
    let timer = null;
    let running = Promise.resolve();

    const flush = () => {
      timer = null;
      const files = [...pending];
      pending.clear();
      const full = reloadConfig;
      reloadConfig = false;

      running = running.then(async () => {
        try {
          if (full) {
            await build();
            return;
          }
          let dirty = false;
          for (const f of files) dirty = scanner.scanFile(f) || dirty;
          if (!dirty) return;
          const { count, changed, ms } = emit();
          if (changed)
            log(
              `⚡ RenDit Code: ${count} утилит, обновлено за ${ms.toFixed(1)} мс`,
            );
        } catch (err) {
          log(`✖ RenDit Code: ${err?.stack ?? err}`);
        }
      });
    };

    const schedule = () => {
      if (!timer) timer = setTimeout(flush, 30);
    };

    // файлы токенов (settings/*.scss): новый цвет или тень — полная пересборка
    const isTokenFile = (file) => {
      const abs = path.resolve(file).toLowerCase();
      return (
        abs === path.resolve(config.tokensPath ?? "").toLowerCase() ||
        config.tokenInfo.files.some(
          (f) => path.resolve(f).toLowerCase() === abs,
        )
      );
    };

    const watchers = [];
    for (const dir of config.content) {
      const abs = path.resolve(root, dir);
      if (!fs.existsSync(abs)) continue;
      watchers.push(
        fs.watch(abs, { recursive: true }, (_event, filename) => {
          if (!filename) return;
          const file = path.join(abs, filename.toString());
          if (isTokenFile(file)) {
            reloadConfig = true;
            schedule();
            return;
          }
          if (!scanner.isSource(file)) return;
          pending.add(file);
          schedule();
        }),
      );
    }

    // конфиг и package.json (версия) — полная пересборка
    const watchFile = (file) => {
      if (!file) return;
      const dir = path.dirname(file);
      const base = path.basename(file);
      if (!fs.existsSync(dir)) return;
      watchers.push(
        fs.watch(dir, (_event, filename) => {
          if (filename?.toString() !== base) return;
          reloadConfig = true;
          schedule();
        }),
      );
    };
    watchFile(path.join(root, CONFIG_FILE));
    watchFile(path.join(root, "package.json"));

    log("👀 RenDit Code: слежу за изменениями…");
    return () => {
      for (const w of watchers) w.close();
    };
  }

  return {
    build,
    watch,
    get config() {
      return config;
    },
  };
}

// Атомарная запись: сначала во временный файл, потом rename — сборщик никогда не читает полуписаный CSS.
// На Windows rename иногда падает (файл открыт сборщиком) — тогда несколько попыток и запасной вариант.
export function writeIfChanged(file, content) {
  try {
    if (fs.readFileSync(file, "utf8") === content) return false;
  } catch {}
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, content);
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      fs.renameSync(tmp, file);
      return true;
    } catch (err) {
      if (
        attempt === 4 ||
        (err.code !== "EPERM" && err.code !== "EBUSY" && err.code !== "EACCES")
      )
        break;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20);
    }
  }
  fs.writeFileSync(file, content);
  try {
    fs.unlinkSync(tmp);
  } catch {}
  return true;
}
