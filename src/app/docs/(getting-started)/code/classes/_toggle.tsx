"use client";

// Живой пример «класс — строкой целиком»: переключатель active меняет фон кнопки тернарником из полных строк
// ("bg-primary" и "bg-surface"), как в реальном коде. Движок видит обе строки целиком.

import { useState } from "react";

export function ActiveToggle() {
  const [active, setActive] = useState(true);
  return (
    <div className="flex flex-col gap-10">
      <button
        type="button"
        onClick={() => setActive((a) => !a)}
        className="self-start flex items-center gap-6 h-32 px-12 br-full border bg-surface font-12 font-w-600 text-foreground-muted transition hover:text-foreground active:scale-95"
      >
        {active ? "Выключить active" : "Включить active"}
      </button>
      <span
        className={`self-start p-14 br-full font-13 font-w-600 transition-colors ${
          active ? "bg-primary text-primary-foreground" : "border bg-surface"
        }`}
      >
        {active ? "bg-primary" : "bg-surface"}
      </span>
    </div>
  );
}
