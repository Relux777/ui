// Чистые данные платформы справки — без React: их импортируют и серверные компоненты (layout читает cookie).
// Вся логика с localStorage/хуками — в _platform.ts.

export const DOCS_PLATFORMS = [
  { id: "nextjs", title: "Next.js", note: "App Router, 15+" },
  { id: "react", title: "React", note: "на Vite" },
  { id: "node", title: "Node.js", note: "без фреймворка" },
  { id: "html", title: "HTML / CSS", note: "без сборки" },
] as const;

export type DocsPlatform = (typeof DOCS_PLATFORMS)[number]["id"];

export const DEFAULT_PLATFORM: DocsPlatform = "nextjs";
