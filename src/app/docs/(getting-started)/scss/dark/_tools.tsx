"use client";

// Песочница темы на странице «Тёмная тема»: кусок интерфейса со своим data-theme — переключатель меняет
// только его, сайт остаётся в своей теме. «Как в системе» берёт prefers-color-scheme.

import { CheckCircle } from "@boxicons/react/CheckCircle";
import { Desktop } from "@boxicons/react/Desktop";
import { Moon } from "@boxicons/react/Moon";
import { Sun } from "@boxicons/react/Sun";
import { useEffect, useState } from "react";

const MODES = [
  { id: "light", title: "Светлая", Icon: Sun },
  { id: "dark", title: "Тёмная", Icon: Moon },
  { id: "system", title: "Как в системе", Icon: Desktop },
] as const;
type Mode = (typeof MODES)[number]["id"];

export function ThemePreview() {
  const [mode, setMode] = useState<Mode>("dark");
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const on = () => setSystemDark(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const theme = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  return (
    <div className="flex flex-col gap-12">
      <fieldset className="self-start flex gap-4 m-0 p-3 border-0 br-full bg-foreground/5">
        <legend className="sr-only">Тема примера</legend>
        {MODES.map(({ id, title, Icon }) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
            className="flex items-center gap-6 h-32 px-12 br-full font-13 font-w-600 text-foreground-muted transition aria-pressed:bg-surface aria-pressed:text-foreground aria-pressed:shadow-2"
          >
            <Icon size="xs" aria-hidden="true" />
            {title}
          </button>
        ))}
      </fieldset>

      {/* весь пример — в своей теме; цвета меняются плавно */}
      <div
        data-theme={theme}
        className="grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-14 p-16 sm:p-20 br-2xl border bg-background text-foreground transition-colors duration-500 [&_*]:transition-colors [&_*]:duration-500"
      >
        <div className="flex flex-col gap-12 p-16 br-xl border bg-surface shadow-2">
          <div className="flex items-center gap-10">
            <span className="size-40 br-full grid place-items-center bg-secondary/12 text-secondary font-15 font-w-700">
              R
            </span>
            <div className="flex flex-col">
              <span className="font-15 font-w-600">Ренат</span>
              <span className="font-12 text-foreground-muted">
                Обновил токены
              </span>
            </div>
            <span className="ml-auto px-8 py-2 br-full bg-accent text-accent-foreground font-11 font-w-700">
              Новое
            </span>
          </div>
          <p className="font-14 text-foreground-muted">
            Те же классы в обеих темах — меняются только значения токенов.
          </p>
          <div className="flex gap-8">
            <button
              type="button"
              className="h-36 px-14 br-full bg-primary text-primary-foreground font-13 font-w-600"
            >
              Сохранить
            </button>
            <button
              type="button"
              className="h-36 px-14 br-full border bg-surface font-13 font-w-600"
            >
              Отмена
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <label className="flex flex-col gap-6">
            <span className="font-12 font-w-600 text-foreground-muted">
              Почта
            </span>
            <input
              defaultValue="renat@rendit.dev"
              className="h-40 px-12 br-md border bg-surface-muted font-14 outline-none focus:border-ring touch:text-[16px]"
            />
          </label>
          <div className="flex items-center gap-8 p-12 br-lg border border-success/25 bg-success/8 text-success font-13">
            <CheckCircle size="xs" aria-hidden="true" />
            Тема применилась
          </div>
          <div className="p-12 br-lg bg-surface-inverse text-foreground-inverse font-13">
            surface-inverse — секция «наоборот»
          </div>
        </div>
      </div>
      <code className="font-12 font-mono text-foreground-muted">
        &lt;div data-theme="{theme}"&gt;
      </code>
    </div>
  );
}
