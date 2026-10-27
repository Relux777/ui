// Подсветка кода для блоков документации — своя, без зависимостей. Работает на сервере при сборке страницы:
// в браузер приходит готовая разметка, ни одного байта JS. Языки — те, что есть в примерах: JS/TS/JSX, JSON,
// CSS/SCSS, HTML и команды терминала. Без React — проверяется тестом (highlight.test.ts).
//
// Правила языка — список [вид, регулярка]; на каждой позиции берётся первое совпавшее, остальное — простой текст.
// Цвета видов — токены --code-* (settings/_tokens.semantic.scss), классы text-code-* — в CodeBlock.

export type Kind =
  | "comment"
  | "keyword"
  | "string"
  | "number"
  | "tag"
  | "attr"
  | "fn"
  | "punct";

export type Token = { text: string; kind?: Kind };

export type Lang = "js" | "json" | "css" | "html" | "bash";

const STRING = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/y;
const NUMBER = /-?\b\d+(?:\.\d+)?(?:px|rem|em|ms|s|deg|%|dvh|vh|vw)?\b/y;

const RULES: Record<Lang, [Kind, RegExp][]> = {
  js: [
    ["comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ["string", STRING],
    // <Tag и </Tag — скобка отдельно, имя тега отдельно
    ["punct", /<\/?(?=[A-Za-z])/y],
    ["tag", /(?<=<\/?)[A-Za-z][\w.]*/y],
    [
      "keyword",
      /\b(?:import|export|from|default|const|let|var|function|return|type|interface|as|async|await|new|if|else|for|of|in|true|false|null|undefined)\b/y,
    ],
    ["number", NUMBER],
    ["attr", /\b[A-Za-z_$][\w$-]*(?==|\s*:(?!:))/y],
    ["fn", /\b[A-Za-z_$][\w$]*(?=\()/y],
    ["punct", /[{}()[\];,.<>/=+*&|!?:]/y],
  ],
  json: [
    ["attr", /"(?:\\.|[^"\\\n])*"(?=\s*:)/y],
    ["string", STRING],
    ["keyword", /\b(?:true|false|null)\b/y],
    ["number", NUMBER],
    ["punct", /[{}[\],:]/y],
  ],
  css: [
    ["comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ["string", STRING],
    ["keyword", /@[\w-]+/y],
    ["attr", /--[\w-]+|\b[\w-]+(?=\s*:(?!:))/y],
    ["fn", /\.[A-Za-z][\w-]*|\b[\w-]+(?=\()/y],
    ["number", NUMBER],
    ["punct", /[{}();,:*&]/y],
  ],
  html: [
    ["comment", /<!--[\s\S]*?-->/y],
    ["punct", /<\/?(?=[A-Za-z])|\/?>/y],
    ["tag", /(?<=<\/?)[A-Za-z][\w-]*/y],
    ["attr", /\b[\w-]+(?==)/y],
    ["string", STRING],
    ["punct", /=/y],
  ],
  bash: [
    ["comment", /#[^\n]*/y],
    ["fn", /(?<=^|\n)\s*(?:npm|npx|node|pnpm|yarn|bun|code|cd)\b/y],
    ["attr", /(?<=\s)--?[\w-]+/y],
    ["string", STRING],
    ["punct", /&&|\|/y],
  ],
};

// по имени файла: package.json → json, next.config.ts → js, main.scss → css, index.html → html
export function langOf(file?: string): Lang {
  const ext = file?.split(".").pop()?.toLowerCase();
  if (ext === "json") return "json";
  if (ext === "css" || ext === "scss") return "css";
  if (ext === "html") return "html";
  return "js";
}

export function highlight(code: string, lang: Lang): Token[] {
  const rules = RULES[lang];
  const out: Token[] = [];
  let plain = "";
  let i = 0;
  const flush = () => {
    if (plain) out.push({ text: plain });
    plain = "";
  };
  while (i < code.length) {
    let hit: Token | null = null;
    for (const [kind, re] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m?.[0].length) {
        hit = { text: m[0], kind };
        break;
      }
    }
    if (hit) {
      flush();
      out.push(hit);
      i += hit.text.length;
    } else {
      plain += code[i];
      i++;
    }
  }
  flush();
  return out;
}
