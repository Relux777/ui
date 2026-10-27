// Типы rendit.config.mjs — подсказки в редакторе.

export interface RenDitConfig {
  /** Папки с исходниками, где искать классы (от корня проекта). По умолчанию ["src"]. */
  content?: string[];
  /** Расширения файлов для сканирования. */
  extensions?: string[];
  /** Имена папок, которые пропускаются. */
  ignore?: string[];
  /** Куда писать CSS. */
  output?: string;
  /** Куда писать SCSS-карту брейкпоинтов ($screens). */
  screensOutput?: string;
  /** Куда писать SCSS-переменную $version из package.json. */
  versionOutput?: string;
  /** SCSS-файл со всеми токенами (компилируется, CSS-переменные становятся классами). */
  tokens?: string | null;
  /** Каскадный слой для классов. */
  layer?: string;
  /** Селектор тёмной темы для варианта dark:. */
  darkSelector?: string;
  /** Брейкпоинты: имя → ширина (px или rem). */
  screens?: Record<string, string>;
  /** Размеры для контейнерных запросов @sm: и т.д. */
  containers?: Record<string, string>;
  theme?: {
    /** Число колонок сетки .row (col-N). */
    columns?: number;
    /** Цвета сверх токенов: { brand: "#0d5ef5" }. */
    colors?: Record<string, string>;
    /** Семейства шрифтов для font-ИМЯ. */
    fonts?: Record<string, string>;
    /** Именованные отступы: { section: "120px" } → py-section. */
    spacing?: Record<string, string>;
  };
  /** Классы, которые генерируются всегда. */
  safelist?: string[];
}
