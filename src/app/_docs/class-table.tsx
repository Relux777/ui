// Таблица «класс → CSS», как в документации Tailwind: CSS каждой строки считает движок RenDit Code при сборке
// страницы (class-css.ts), поэтому таблица всегда совпадает с тем, что попадёт в проект. Длинная таблица
// прокручивается внутри своего блока, шапка таблицы при этом остаётся на месте. Нажатие на класс копирует его.

import type { ReactNode } from "react";
import { ClassCopy } from "./builder";
import { classCss } from "./class-css";

export type ClassRow = string | readonly [cls: string, note: ReactNode];

export async function ClassTable({ rows }: { rows: readonly ClassRow[] }) {
  const list = rows.map((r): readonly [string, ReactNode] =>
    typeof r === "string" ? [r, null] : r,
  );
  const css = await classCss(list.map(([cls]) => cls));
  const notes = list.some(([, note]) => note);

  return (
    <div className="min-w-0 br-xl border bg-surface shadow-1 overflow-hidden">
      <div className="max-h-[440px] overflow-auto overscroll-contain scrollbar-thin">
        {/* на телефоне две колонки: пояснение — под классом, а не третьей колонкой за краем */}
        <table className="w-full sm:min-w-480 [border-collapse:collapse] font-13">
          <thead className="sticky top-0 z-1 bg-surface-muted">
            <tr>
              {["Класс", "CSS", ...(notes ? ["Зачем"] : [])].map((h, i) => (
                <th
                  key={h}
                  className={`px-14 py-10 text-left font-12 font-w-600 uppercase letter-s-4 text-foreground-muted ${i === 2 ? "max-sm:hidden" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map(([cls, note]) => (
              <tr key={cls} className="border-t [vertical-align:top]">
                <td className="py-6 pl-14 pr-6">
                  <span className="flex flex-col gap-2 items-start">
                    <span className="whitespace-nowrap">
                      <ClassCopy cls={cls} />
                    </span>
                    {note && (
                      <span className="sm:hidden font-12 text-foreground-muted">
                        {note}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-14 py-8">
                  <pre className="font-mono font-12/20 text-foreground-muted whitespace-pre-wrap">
                    {css[cls].show}
                  </pre>
                </td>
                {notes && (
                  <td className="max-sm:hidden px-14 py-8 text-foreground-muted">
                    {note}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
