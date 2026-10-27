// Сканер исходников: достаёт из файла все слова, похожие на классы.
//
// Не ищем className="…" регуляркой — это теряет классы в cn(), clsx(), шаблонных строках,
// объектах вариантов компонентов ({ size: { sm: "px-10 py-4" } }) и т.д. Вместо этого,
// как Tailwind, берём ВСЕ «кандидаты» из текста, а генератор оставляет только те,
// что реально являются утилитами. Лишние слова («return», «const») просто отбрасываются.
//
// Кэш по mtime: при повторной сборке читаются только изменившиеся файлы.

import fs from "node:fs";
import path from "node:path";

// символы, из которых состоит класс вне скобок
const IDENT = /[A-Za-z0-9_\-:/.!%@#*&]/;
const MAX = 256;

export function extractCandidates(text) {
  const found = new Set();
  const len = text.length;
  let i = 0;

  while (i < len) {
    const ch = text[i];
    if (!IDENT.test(ch) && ch !== "[" && ch !== "(") {
      i++;
      continue;
    }

    // собираем токен; внутри [...] и (...) допускается всё, кроме пробелов и кавычек-ограничителей строки
    const start = i;
    let depth = 0;
    let quote = null;
    let ok = true;
    while (i < len) {
      const c = text[i];
      if (c === "[" || c === "(") {
        depth++;
      } else if (c === "]" || c === ")") {
        if (depth === 0) break;
        depth--;
      } else if (depth > 0) {
        if (c === " " || c === "\n" || c === "\t" || c === "\r" || c === "`") {
          ok = false;
          break;
        }
        if (c === '"' || c === "'") {
          // кавычки внутри [...] — только строка целиком: content-['→']
          if (quote === null && text[i - 1] === "[") quote = c;
          else if (quote === c && text[i + 1] === "]") quote = null;
          else {
            ok = false;
            break;
          }
        }
      } else if (!IDENT.test(c)) {
        break;
      }
      i++;
      if (i - start > MAX) {
        ok = false;
        break;
      }
    }

    if (ok && depth === 0) addToken(found, text.slice(start, i));
    if (i === start) i++;
  }
  return found;
}

function addToken(set, token) {
  // хвостовая пунктуация из текста и кода: «flex,» «gap-10.» «hover:» («!» в конце — это important)
  const t = token.replace(/[.,:;?]+$/, "");
  if (t.length < 1 || t.length > MAX) return;
  if (!/^[A-Za-z!\-@[*]/.test(t)) return;
  set.add(t);
}

export function createScanner(config) {
  const exts = new Set(config.extensions.map((e) => `.${e}`));
  const ignore = new Set(config.ignore);
  const cache = new Map(); // file → { mtime, size, candidates }
  const outputAbs = path.resolve(config.root, config.output);

  function isSource(file) {
    if (!exts.has(path.extname(file))) return false;
    if (path.resolve(file) === outputAbs) return false;
    const parts = path.relative(config.root, file).split(path.sep);
    return !parts.some((p) => ignore.has(p));
  }

  function walk(dir, out) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return out;
    }
    for (const e of entries) {
      if (ignore.has(e.name)) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, out);
      else if (e.isFile() && exts.has(path.extname(e.name))) out.push(full);
    }
    return out;
  }

  function listFiles() {
    const files = [];
    for (const dir of config.content)
      walk(path.resolve(config.root, dir), files);
    return files;
  }

  // Читает файл, если он изменился. Возвращает true, если набор кандидатов файла поменялся.
  function scanFile(file) {
    let stat;
    try {
      stat = fs.statSync(file);
    } catch {
      return cache.delete(file);
    }
    const prev = cache.get(file);
    if (prev && prev.mtime === stat.mtimeMs && prev.size === stat.size)
      return false;

    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      return false;
    }
    const candidates = extractCandidates(text);
    cache.set(file, { mtime: stat.mtimeMs, size: stat.size, candidates });
    return !prev || !sameSet(prev.candidates, candidates);
  }

  function scanAll() {
    const files = listFiles();
    const seen = new Set(files);
    for (const f of cache.keys()) if (!seen.has(f)) cache.delete(f);
    for (const f of files) scanFile(f);
    return files.length;
  }

  function candidates() {
    const all = new Set(config.safelist);
    for (const { candidates } of cache.values())
      for (const c of candidates) all.add(c);
    return all;
  }

  return {
    isSource,
    scanAll,
    scanFile,
    forget: (f) => cache.delete(f),
    candidates,
    fileCount: () => cache.size,
  };
}

function sameSet(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}
