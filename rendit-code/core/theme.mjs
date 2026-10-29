// Тема движка из токенов и конфига: цвета (с прозрачностью /N), шрифты, отступы, скругления, тени, градиенты,
// кривые. Без node: — работает и в браузере (CSS-конструктор справки собирает CSS там же, где его просят).

import { withAlpha } from "./utilities.mjs";

// config: { tokenInfo: { colors, radius, shadows, gradients, eases }, theme: { columns, colors, fonts, spacing } }
export function buildTheme(config) {
  const { tokenInfo } = config;
  const colors = new Map();

  colors.set("transparent", () => "transparent");
  colors.set("current", (a) => withAlpha("currentColor", a));
  colors.set("inherit", () => "inherit");
  for (const name of tokenInfo.colors)
    colors.set(name, (a) => withAlpha(`var(--${name})`, a));
  for (const [name, value] of Object.entries(config.theme.colors ?? {}))
    colors.set(name, (a) => withAlpha(value, a));

  const fromTokens = (prefix, names) =>
    new Map(names.map((n) => [n, `var(--${prefix}-${n})`]));

  return {
    columns: config.theme.columns,
    colors,
    fonts: new Map(Object.entries(config.theme.fonts)),
    spacing: new Map(Object.entries(config.theme.spacing ?? {})),
    radius: fromTokens("radius", tokenInfo.radius),
    shadows: fromTokens("shadow", tokenInfo.shadows),
    gradients: fromTokens("gradient", tokenInfo.gradients),
    eases: fromTokens("ease", tokenInfo.eases),
  };
}
