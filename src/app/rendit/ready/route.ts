// Классы готового CSS (src/assets/css) одним списком — для подсказки «Для HTML без сборки» в конструкторах справки:
// каких классов из кода нет в готовом CSS (HtmlHint в _docs/builder.tsx). Считается при сборке из
// src/assets/css/modules/manifest.json, страница получает его, только когда выбрана платформа HTML.

import { cssModules } from "@/app/_docs/class-css";

export async function GET() {
  const { modules } = await cssModules();
  return Response.json(modules.flatMap((m) => m.classes));
}
