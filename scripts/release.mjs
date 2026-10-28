#!/usr/bin/env node
// Выпуск версии RenDit UI: npm run release -- 0.3.0
//   1) CHANGELOG.md: раздел [Unreleased] → «## [0.3.0] — сегодняшняя дата», сверху — новый пустой [Unreleased];
//   2) package.json: version;
//   3) готовый CSS (dist/) — пересобрать с новой версией в шапке;
//   4) коммит «Версия 0.3.0» и тег v0.3.0.
// Дальше — git push --follow-tags: GitHub соберёт релиз с архивом (.github/workflows/release.yml).
// Подробно — RELEASING.md.

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const version = process.argv[2];
const fail = (msg) => {
  console.error(`✖ ${msg}`);
  process.exit(1);
};

if (!/^\d+\.\d+\.\d+$/.test(version ?? ""))
  fail("укажите версию: npm run release -- 0.3.0");

const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: "inherit" });
const git = (cmd) =>
  execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf8" }).trim();

if (git(`tag --list v${version}`)) fail(`тег v${version} уже есть`);

// CHANGELOG
const logFile = path.join(ROOT, "CHANGELOG.md");
const log = fs.readFileSync(logFile, "utf8");
const start = log.indexOf("## [Unreleased]");
if (start < 0) fail("в CHANGELOG.md нет раздела ## [Unreleased]");
const next = log.indexOf("\n## [", start + 1);
const body = log.slice(
  start + "## [Unreleased]".length,
  next < 0 ? undefined : next,
);
if (!/^- /m.test(body))
  fail("в [Unreleased] нет ни одного пункта — нечего выпускать");
const date = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  logFile,
  `${log.slice(0, start)}## [Unreleased]\n\n## [${version}] — ${date}${log.slice(start + "## [Unreleased]".length)}`,
);

// package.json — только поле version, остальное как было
const pkgFile = path.join(ROOT, "package.json");
const pkg = fs.readFileSync(pkgFile, "utf8");
fs.writeFileSync(
  pkgFile,
  pkg.replace(/"version":\s*"[^"]+"/, `"version": "${version}"`),
);

// готовый CSS с новой версией в шапке
run("node rendit-code/dist.mjs");

run("git add -A");
run(`git commit -m "Версия ${version}"`);
run(`git tag -a v${version} -m "RenDit UI ${version}"`);

console.log(
  `\n✓ Версия ${version} готова. Отправить на GitHub: git push --follow-tags`,
);
