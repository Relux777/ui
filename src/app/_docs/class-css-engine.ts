// Движок RenDit Code для справки, без Next: грузит движок проекта мимо сборщика (turbopackIgnore — он читает
// с диска конфиг и токены) и раскладывает его вывод на CSS для <style> и строку для таблицы. Кэш и вызов
// со страниц — class-css.ts; здесь — то, что проверяется обычным node --test.
// Ещё отсюда — данные для движка в браузере (CSS-конструктор): имена токенов и настройки, из которых браузер
// строит ту же тему (rendit-code/core/theme.mjs), и список классов готового CSS (dist/modules/manifest.json).

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { GeneratorConfig } from "../../../rendit-code/core/generator.mjs";
import type {
  ThemeSource,
  TokenNames,
} from "../../../rendit-code/core/theme.mjs";

export type ClassCss = {
  /** регистрации @property, которые нужны правилу (идут в начало <style>) */
  props: string[];
  /** правило без обёртки @layer, как в rendit-code.css: с @media, псевдоклассами */
  rule: string;
  /** для таблицы: только свойства, если правило простое (.класс { … }), иначе правило целиком */
  show: string;
  /** класс есть в готовом CSS (dist) — HTML без сборки его получит без CSS-конструктора */
  ready: boolean;
};

export type CssMap = Record<string, ClassCss>;

/** всё, из чего браузер соберёт тот же движок: buildTheme({ tokenInfo, theme }) + createGenerator(…, config) */
export type EngineData = {
  tokenInfo: TokenNames;
  theme: ThemeSource;
  config: GeneratorConfig;
};

/** часть готового CSS из dist/modules/manifest.json */
export type DistModule = {
  id: string;
  title: string;
  text: string;
  file: string;
  required: boolean;
  classes: string[];
  bytes: number;
  minBytes: number;
};

type Engine = {
  config: GeneratorConfig & {
    tokenInfo: TokenNames;
    themeSource: ThemeSource;
  };
  generator: {
    isValid: (cls: string) => boolean;
    generate: (classes: string[]) => { css: string };
  };
};

let engine: Promise<Engine> | undefined;

async function create(): Promise<Engine> {
  const root = process.cwd();
  const core = (file: string) =>
    pathToFileURL(join(root, "rendit-code", "core", file)).href;
  const { loadConfig } = await import(
    /* turbopackIgnore: true */ /* webpackIgnore: true */ core("config.mjs")
  );
  const { createGenerator } = await import(
    /* turbopackIgnore: true */ /* webpackIgnore: true */ core("generator.mjs")
  );
  const config = await loadConfig(root);
  return { config, generator: createGenerator(config.theme, config) };
}

/** готовый CSS: размер файла целиком и части */
export type DistManifest = {
  version: string;
  full: { bytes: number; minBytes: number };
  modules: DistModule[];
};

// готовый CSS по частям; нет файла (dist не собран) — пусто
export function distModules(): DistManifest {
  const file = join(process.cwd(), "dist", "modules", "manifest.json");
  if (!existsSync(file))
    return { version: "", full: { bytes: 0, minBytes: 0 }, modules: [] };
  return JSON.parse(readFileSync(file, "utf8"));
}

let ready: Set<string> | undefined;
const readyClasses = () =>
  (ready ??= new Set(distModules().modules.flatMap((m) => m.classes)));

// простое правило — один класс без псевдо-, медиа- и вложенных селекторов: .w-1\/2 {
const SIMPLE = /^\.(?:\\.|[\w-])+ \{$/;

// вывод движка: баннер, строки @property, @layer utilities { … } — разбираем на props, rule и show
export function splitCss(out: string): Omit<ClassCss, "ready"> {
  const lines = out.split("\n").filter((l) => l && !l.startsWith("/*!"));
  const props = lines.filter((l) => l.startsWith("@property"));
  const start = lines.findIndex((l) => l.startsWith("@layer utilities"));
  const body = lines.slice(start + 1, -1).map((l) => l.replace(/^ {2}/, ""));
  const simple =
    SIMPLE.test(body[0] ?? "") &&
    body.at(-1) === "}" &&
    body.slice(1, -1).every((l) => !l.includes("{") && !l.includes("}"));
  return {
    props,
    rule: body.join("\n"),
    show: simple
      ? body
          .slice(1, -1)
          .map((l) => l.trim())
          .join("\n")
      : body.join("\n"),
  };
}

// CSS классов; неизвестный класс — ошибка: опечатка на странице ломает сборку
export async function cssOf(classes: readonly string[]): Promise<CssMap> {
  engine ??= create();
  const { generator } = await engine;
  const map: CssMap = {};
  for (const cls of classes) {
    if (!generator.isValid(cls))
      throw new Error(`RenDit Code не знает класс «${cls}» — опечатка?`);
    map[cls] = {
      ...splitCss(generator.generate([cls]).css),
      ready: readyClasses().has(cls),
    };
  }
  return map;
}

// CSS классов, которых нет в готовом CSS, одним файлом в порядке каскада движка (для <style> в HTML-примерах:
// пример работает, даже если подключён только готовый CSS); всё есть — пусто
export async function extraCssOf(classes: readonly string[]): Promise<string> {
  engine ??= create();
  const { generator } = await engine;
  for (const cls of classes)
    if (!generator.isValid(cls))
      throw new Error(`RenDit Code не знает класс «${cls}» — опечатка?`);
  const extra = classes.filter((c) => !readyClasses().has(c));
  if (!extra.length) return "";
  return (
    generator
      .generate(extra)
      .css.replace(/^\/\*![^\n]*\*\/\n/, "")
      // правило — одной строкой: .w-60 { width: 60px; } — код примера короче, но читается
      .replace(
        /\{\n([^{}]*?)\n\s*\}/g,
        (_, body: string) => `{ ${body.trim().replace(/\s*\n\s*/g, " ")} }`,
      )
      .trim()
  );
}

// данные для движка в браузере — только то, что передаётся строкой (функций и Map в них нет)
export async function engineData(): Promise<EngineData> {
  engine ??= create();
  const { config } = await engine;
  const { colors, radius, shadows, gradients, eases } = config.tokenInfo;
  return {
    tokenInfo: { colors, radius, shadows, gradients, eases },
    theme: config.themeSource,
    config: {
      screens: config.screens,
      containers: config.containers,
      darkSelector: config.darkSelector,
      layer: config.layer,
      version: config.version,
    },
  };
}
