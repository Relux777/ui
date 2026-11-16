// Страницы справки, которые ещё в работе: о чём страница и что на ней будет. Страница-заготовка показывает
// это планом (app/_docs/stub.tsx). home — раздел главной, где уже есть живые примеры по теме.
// Страница готова — её строка отсюда удаляется, а page.tsx пишется целиком.

export type DocsStub = { lead: string; plan: string[]; home?: string };

export const DOCS_STUBS: Record<string, DocsStub> = {};
