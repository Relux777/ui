// Общие карты для конструкторов компонентов: тени, рамки, радиусы и акцент.
// Здесь только классы RenDit Code — их видят и движок, и готовый код в page.tsx.

import { nameOf, type Pick } from "../(getting-started)/scss/colors/_tools";

export type Shadow =
  | "none"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "inset"
  | "glass"
  | "line";
export type Border = "none" | "1" | "2";
export type BorderColor =
  | "default"
  | "strong"
  | "secondary"
  | "accent"
  | "danger"
  | "success";
export type Accent = "secondary" | "accent" | "primary" | "danger" | "success";

export const SHADOW_CLASS: Record<Shadow, string> = {
  none: "",
  "1": "shadow-1",
  "2": "shadow-2",
  "3": "shadow-3",
  "4": "shadow-4",
  "5": "shadow-5",
  "6": "shadow-6",
  "7": "shadow-7",
  "8": "shadow-8",
  "9": "shadow-9",
  "10": "shadow-10",
  "11": "shadow-11",
  "12": "shadow-12",
  inset: "shadow-inset",
  glass: "shadow-glass",
  line: "shadow-line",
};

export const BORDER_WIDTH_CLASS: Record<Border, string> = {
  none: "border-0",
  "1": "border",
  "2": "border-2",
};

export const BORDER_COLOR_CLASS: Record<BorderColor, string> = {
  default: "",
  strong: "border-border-strong",
  secondary: "border-secondary",
  accent: "border-accent",
  danger: "border-danger",
  success: "border-success",
};

export const RADIUS_CLASS: Record<string, string> = {
  "0": "br-0",
  "6": "br-6",
  "8": "br-8",
  "10": "br-10",
  "12": "br-12",
  "16": "br-16",
  "999": "br-full",
};

export const ACCENT_CLASS: Record<Accent, { selected: string; badge: string }> =
  {
    secondary: {
      selected: "bg-secondary/10 text-foreground font-w-600",
      badge: "bg-secondary/15 text-secondary",
    },
    accent: {
      selected: "bg-accent/25 text-foreground font-w-600",
      badge: "bg-accent/35 text-foreground",
    },
    primary: {
      selected: "bg-foreground/8 text-foreground font-w-600",
      badge: "bg-foreground/8 text-foreground",
    },
    danger: {
      selected: "bg-danger/10 text-danger font-w-600",
      badge: "bg-danger/10 text-danger",
    },
    success: {
      selected: "bg-success/10 text-success font-w-600",
      badge: "bg-success/10 text-success",
    },
  };

export const join = (...values: (string | false | undefined)[]) =>
  values.filter(Boolean).join(" ");

// Длинную строку классов в готовом коде разбиваем на строки — так её видно
// целиком и удобно менять. На выходе обычная конкатенация строк.
export const classConst = (
  name: string,
  parts: (string | false | undefined)[],
) => {
  const clean = parts.filter(Boolean) as string[];
  if (clean.length === 0) return `const ${name} = "";`;
  if (clean.length === 1) return `const ${name} = ${JSON.stringify(clean[0])};`;
  const lines = clean.map(
    (part, i) =>
      `  ${JSON.stringify(i === 0 ? part : ` ${part}`)}${i === clean.length - 1 ? ";" : " +"}`,
  );
  return `const ${name} =\n${lines.join("\n")}`;
};

// То же самое, но сразу в JSX — без промежуточной константы.
// Длинная строка классов разбивается на строки конкатенации.
export const jsxClass = (
  name: string,
  parts: (string | false | undefined)[],
) => {
  const clean = parts.filter(Boolean) as string[];
  if (clean.length === 0) return `${name}=""`;
  if (clean.length === 1) return `${name}={${JSON.stringify(clean[0])}}`;
  const lines = clean
    .map((part, i) => `        ${JSON.stringify(i === 0 ? part : ` ${part}`)}`)
    .join(" +\n");
  return `${name}={\n${lines}\n      }`;
};

// Автоцвет текста под выбранный фон: токены знают свой парный цвет,
// у палитры светлые оттенки получают тёмный текст, тёмные — светлый.
export const autoText = (pick: Pick) => {
  const name = nameOf(pick);
  if (name === "primary") return "text-primary-foreground";
  if (name === "secondary") return "text-secondary-foreground";
  if (name === "accent") return "text-accent-foreground";
  if (name === "surface-inverse") return "text-foreground-inverse";
  if (name === "foreground" || name.startsWith("foreground-"))
    return "text-background";
  if (
    name === "success" ||
    name === "warning" ||
    name === "danger" ||
    name === "info"
  )
    return "text-background";
  if (name === "white") return "text-gray-950";
  if (name === "black") return "text-white";
  const step = Number(name.split("-").pop());
  if (Number.isFinite(step))
    return step >= 600 ? "text-white" : "text-gray-950";
  return "text-foreground";
};
