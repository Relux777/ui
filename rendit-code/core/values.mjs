// Преобразование значений классов в CSS. Числа без единиц — пиксели (как в ReluxCode: pd-10 = 10px).

const NUMBER = /^\d+(?:\.\d+)?$/;
const WITH_UNIT =
  /^\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|dvh|dvw|svh|svw|lvh|lvw|vmin|vmax|ch|ex|lh|rlh|cqw|cqh|cqi|cqb|fr|deg|ms|s)$/;

export const isNumber = (v) => NUMBER.test(v);

export function px(n) {
  return n === "0" ? "0" : `${n}px`;
}

// 10 → 10px, 1.5rem → 1.5rem, 50% → 50%
export function length(value) {
  if (NUMBER.test(value)) return px(value);
  if (WITH_UNIT.test(value)) return value;
  if (value === "px") return "1px";
  return null;
}

// 1/2 → 50%, 2/3 → 66.666667%
export function fraction(numerator, denominator) {
  if (
    !NUMBER.test(numerator) ||
    !NUMBER.test(denominator) ||
    Number(denominator) === 0
  )
    return null;
  const pct = (Number(numerator) / Number(denominator)) * 100;
  return `${Number.parseFloat(pct.toFixed(6))}%`;
}

export function negate(value) {
  if (value === "0") return "0";
  if (/^\d/.test(value)) return `-${value}`;
  return `calc(${value} * -1)`;
}

// Похоже ли произвольное значение на цвет: #fff, rgb(), oklch(), var(--x) не берём — это решает подсказка типа.
export function looksLikeColor(value) {
  return (
    /^#[\da-f]{3,8}$/i.test(value) ||
    /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(/i.test(
      value,
    ) ||
    ["transparent", "currentcolor", "inherit", "white", "black"].includes(
      value.toLowerCase(),
    )
  );
}

export function looksLikeLength(value) {
  return (
    WITH_UNIT.test(value) ||
    value === "0" ||
    /^(?:calc|min|max|clamp)\(/.test(value) ||
    /^-?\d+(?:\.\d+)?[a-z%]+$/i.test(value)
  );
}

export function looksLikeImage(value) {
  return /^(?:url|image-set|(?:repeating-)?(?:linear|radial|conic)-gradient)\(/.test(
    value,
  );
}
