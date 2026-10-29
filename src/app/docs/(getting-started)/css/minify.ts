// Сжатие CSS из CSS-конструктора: без комментариев (кроме шапки /*! … */ — она остаётся как есть), лишних
// пробелов и последней «;» в блоке. Пробелы внутри значений (calc(100% - 40px), rgb(0 0 0 / 0.4)) остаются —
// без них CSS сломается.

export function minifyCss(css: string) {
  const banner = /^\s*\/\*![\s\S]*?\*\//.exec(css)?.[0].trim() ?? "";
  const out = css
    .slice(banner ? css.indexOf(banner) + banner.length : 0)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    // > между селекторами сжимается, >= в @media (width >= 770px) — нет
    .replace(/\s*([{};,]|>(?!=))\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
  return banner ? `${banner}\n${out}\n` : `${out}\n`;
}
