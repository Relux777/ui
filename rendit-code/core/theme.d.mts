// Типы темы RenDit Code: из чего она строится (имена токенов и настройки конфига) и что получает генератор.

export type TokenNames = {
  colors: string[];
  radius: string[];
  shadows: string[];
  gradients: string[];
  eases: string[];
};

export type ThemeSource = {
  columns: number;
  colors?: Record<string, string>;
  fonts: Record<string, string>;
  spacing?: Record<string, string>;
};

export type Theme = {
  columns: number;
  colors: Map<string, (alpha?: string) => string>;
  fonts: Map<string, string>;
  spacing: Map<string, string>;
  radius: Map<string, string>;
  shadows: Map<string, string>;
  gradients: Map<string, string>;
  eases: Map<string, string>;
};

export function buildTheme(config: {
  tokenInfo: TokenNames;
  theme: ThemeSource;
}): Theme;
