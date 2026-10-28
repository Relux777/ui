// Выбор на странице установки: платформа и вопросы к ней (язык, стили, движок, редактор, скрипты). Без React —
// проверяется тестом (choice.test.ts). Шаги под выбор собирает steps.tsx, показывает _guide.tsx.

// version — с какой версии работает; проверено на Next.js 16 и React 19 — так устроен этот сайт.
// node — нужен ли Node.js (движку RenDit Code и Sass — с 20-й версии)
export const PLATFORMS = [
  {
    id: "nextjs",
    title: "Next.js",
    version: "15+",
    note: "App Router",
    node: true,
  },
  {
    id: "react",
    title: "React",
    version: "18+",
    note: "на Vite 6+",
    node: true,
  },
  {
    id: "node",
    title: "Node.js",
    version: "20+",
    note: "без фреймворка",
    node: true,
  },
  { id: "html", title: "HTML", version: "5", note: "без Node.js", node: false },
] as const;

export type Platform = (typeof PLATFORMS)[number]["id"];

// note — коротко, рядом с вариантом; hint — что это значит, строкой под вопросом (для тех, кто выбирает впервые)
export const OPTIONS = {
  lang: [
    {
      id: "ts",
      title: "TypeScript",
      note: ".tsx",
      hint: "Типы и подсказки в редакторе — файлы .tsx и .ts",
    },
    {
      id: "js",
      title: "JavaScript",
      note: ".jsx",
      hint: "Без типов, проще для начала — файлы .jsx и .js",
    },
  ],
  styles: [
    {
      id: "scss",
      title: "SCSS",
      note: "миксины, токены",
      hint: "Свои стили на SCSS: миксины RenDit, брейкпоинты, токены. Нужен Sass",
    },
    {
      id: "css",
      title: "CSS",
      note: "без Sass",
      hint: "Свои стили на обычном CSS с переменными RenDit, без миксинов",
    },
  ],
  engine: [
    {
      id: "code",
      title: "RenDit Code",
      note: "классы в разметке",
      hint: "Пишете классы прямо в разметке (p-20, md:flex) — CSS для них собирается сам",
    },
    {
      id: "none",
      title: "Без движка",
      note: "свой CSS на токенах",
      hint: "Только стили и токены RenDit — свои классы пишете сами",
    },
  ],
  script: [
    {
      id: "js",
      title: "JavaScript",
      note: "без библиотек",
      hint: "Код компонентов — на чистом JavaScript, без библиотек",
    },
    {
      id: "jquery",
      title: "jQuery",
      note: "3.6+",
      hint: "Код компонентов — на jQuery 3.6+, если она уже есть в проекте",
    },
  ],
  // подсказки классов в редакторе — расширение rendit-code/vscode, нужен движок
  editor: [
    {
      id: "vscode",
      title: "VS Code",
      note: "с подсказками",
      hint: "Рекомендуем: расширение подсказывает классы и показывает их CSS при наведении",
    },
    {
      id: "other",
      title: "Другой редактор",
      note: "без расширения",
      hint: "Классы пишутся так же — просто без подсказок в редакторе",
    },
  ],
} as const;

export type Question = keyof typeof OPTIONS;

export const QUESTION_TITLES: Record<Question, string> = {
  lang: "Язык",
  styles: "Стили",
  engine: "Движок",
  script: "Скрипты",
  editor: "Редактор",
};

// какие вопросы у платформы: у HTML нет ни Sass, ни движка — только чем писать скрипты компонентов
export const QUESTIONS: Record<Platform, readonly Question[]> = {
  nextjs: ["lang", "styles", "engine", "editor"],
  react: ["lang", "styles", "engine", "editor"],
  node: ["styles", "engine", "editor"],
  html: ["script"],
};

// вопросы этого набора: про редактор — только с движком (расширение берёт подсказки у него)
export const questionsFor = (choice: Choice) =>
  QUESTIONS[choice.platform].filter(
    (q) => q !== "editor" || choice.engine === "code",
  );

export type Choice = {
  platform: Platform;
  lang: "ts" | "js";
  styles: "scss" | "css";
  engine: "code" | "none";
  script: "js" | "jquery";
  editor: "vscode" | "other";
};

export const DEFAULT_CHOICE: Choice = {
  platform: "nextjs",
  lang: "ts",
  styles: "scss",
  engine: "code",
  script: "js",
  editor: "vscode",
};

// имена в адресе: ?stack=react&lang=js&styles=css&engine=none
const PARAM: Record<"platform" | Question, string> = {
  platform: "stack",
  lang: "lang",
  styles: "styles",
  engine: "engine",
  script: "js",
  editor: "editor",
};

const pick = <T extends string>(
  value: string | null | undefined,
  allowed: readonly { id: T }[],
  fallback: T,
): T => allowed.find((o) => o.id === value)?.id ?? fallback;

// из адреса или сохранённого: чужие и битые значения не проходят — остаётся то, что было
export function parseChoice(
  get: (param: string) => string | null | undefined,
  base: Choice = DEFAULT_CHOICE,
): Choice {
  return {
    platform: pick(get(PARAM.platform), PLATFORMS, base.platform),
    lang: pick(get(PARAM.lang), OPTIONS.lang, base.lang),
    styles: pick(get(PARAM.styles), OPTIONS.styles, base.styles),
    engine: pick(get(PARAM.engine), OPTIONS.engine, base.engine),
    script: pick(get(PARAM.script), OPTIONS.script, base.script),
    editor: pick(get(PARAM.editor), OPTIONS.editor, base.editor),
  };
}

// в адрес — только платформа и вопросы этого набора
export function choiceParams(choice: Choice) {
  const params = new URLSearchParams({ [PARAM.platform]: choice.platform });
  for (const q of questionsFor(choice)) params.set(PARAM[q], choice[q]);
  return params;
}

// набор ответов, от которого зависят шаги: nextjs:ts:scss:code:vscode, html:jquery
export const choiceKey = (choice: Choice) =>
  [choice.platform, ...questionsFor(choice).map((q) => choice[q])].join(":");
