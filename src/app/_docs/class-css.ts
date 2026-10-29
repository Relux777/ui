// CSS классов для справки считает сам движок RenDit Code, пока собирается страница (next build; в dev — при
// открытии). Таблицы «класс → CSS» и конструкторы показывают ровно то, что движок напишет в проекте, и не
// устаревают. Опечатка в классе страницы ломает сборку, а не попадает на сайт молча. Сам движок —
// class-css-engine.ts. Отсюда же — данные для движка в браузере и части готового CSS (CSS-конструктор).

import { cacheLife } from "next/cache";
import {
  type CssMap,
  cssOf,
  type DistManifest,
  distModules,
  type EngineData,
  engineData,
  extraCssOf,
} from "./class-css-engine";

export type {
  ClassCss,
  CssMap,
  DistManifest,
  DistModule,
  EngineData,
} from "./class-css-engine";

export async function classCss(classes: readonly string[]): Promise<CssMap> {
  "use cache";
  // CSS меняется только вместе с движком и токенами, то есть со сборкой: страница не пересчитывается на сервере
  cacheLife("max");
  return cssOf(classes);
}

export async function extraCss(classes: readonly string[]): Promise<string> {
  "use cache";
  cacheLife("max");
  return extraCssOf(classes);
}

export async function browserEngine(): Promise<EngineData> {
  "use cache";
  cacheLife("max");
  return engineData();
}

export async function cssModules(): Promise<DistManifest> {
  "use cache";
  cacheLife("max");
  return distModules();
}
