// Типы генератора RenDit Code — для TypeScript-кода, который зовёт движок напрямую (CSS-конструктор справки).

import type { Theme } from "./theme.mjs";

export type GeneratorConfig = {
  /** брейкпоинты: имя → ширина (sm: "620px") */
  screens: Record<string, string>;
  /** размеры для контейнерных запросов @sm: … */
  containers: Record<string, string>;
  /** селектор тёмной темы для dark: */
  darkSelector: string;
  /** каскадный слой классов */
  layer: string;
  /** версия — в шапке файла */
  version: string;
};

export type Generator = {
  /** класс понятен движку и безопасен */
  isValid(cls: string): boolean;
  /** CSS для набора классов: шапка, @property, @layer с правилами в порядке каскада */
  generate(classes: Iterable<string>): { css: string; count: number };
};

export function createGenerator(
  theme: Theme,
  config: GeneratorConfig,
): Generator;
