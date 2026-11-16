// Готовые наборы для Select: один компонент, разные задачи. Данные без хуков — их можно
// передать и в серверный, и в клиентский компонент. Пункты-ссылки помечены href:
// Select сам рендерит настоящий Link, обёртка не нужна.

import { Code } from "@boxicons/react/Code";
import { File } from "@boxicons/react/File";
import { Grid } from "@boxicons/react/Grid";
import { Home } from "@boxicons/react/Home";
import { Palette } from "@boxicons/react/Palette";
import { Rocket } from "@boxicons/react/Rocket";
import { Sparkles } from "@boxicons/react/Sparkles";
import { Star } from "@boxicons/react/Star";
import { User } from "@boxicons/react/User";
import type { SelectOption } from "../options";

export const FRAMEWORK_ITEMS: SelectOption[] = [
  {
    value: "next",
    label: "Next.js",
    hint: "App Router",
    icon: <Code width={16} height={16} />,
    badge: "15+",
  },
  {
    value: "react",
    label: "React",
    hint: "на Vite",
    icon: <Sparkles width={16} height={16} />,
  },
  {
    value: "vue",
    label: "Vue",
    hint: "3.5",
    icon: <Palette width={16} height={16} />,
  },
  {
    value: "astro",
    label: "Astro",
    hint: "острова",
    icon: <Rocket width={16} height={16} />,
  },
  {
    value: "html",
    label: "HTML / CSS",
    hint: "без сборки",
    icon: <File width={16} height={16} />,
  },
];

export const ACCOUNT_ITEMS: SelectOption[] = [
  {
    value: "renat",
    label: "Ренат",
    hint: "renat@rendit.dev",
    icon: <User width={16} height={16} />,
    badge: "вы",
  },
  {
    value: "team",
    label: "Команда RenDit",
    hint: "team@rendit.dev",
    icon: <Star width={16} height={16} />,
  },
  {
    value: "studio",
    label: "Студия",
    hint: "design@rendit.dev",
    icon: <Palette width={16} height={16} />,
  },
];

export const NAVIGATION_ITEMS: SelectOption[] = [
  {
    value: "docs",
    label: "Справка",
    hint: "/docs",
    href: "/docs",
    icon: <Home width={16} height={16} />,
  },
  {
    value: "components",
    label: "Компоненты",
    hint: "/docs/components",
    href: "/docs/components",
    icon: <Grid width={16} height={16} />,
  },
  {
    value: "width",
    label: "Ширина",
    hint: "scss/width",
    href: "/docs/scss/width",
    icon: <Code width={16} height={16} />,
  },
  {
    value: "updates",
    label: "Обновления",
    hint: "/docs/releases",
    href: "/docs/releases",
    icon: <Sparkles width={16} height={16} />,
  },
];
