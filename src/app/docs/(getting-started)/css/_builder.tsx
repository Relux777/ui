"use client";

// CSS-конструктор для HTML без сборки: какие части готового CSS подключить (основа — всегда), обычный или сжатый
// вариант, и свои классы, которых в готовом CSS нет (w-100, md:p-30, bg-[#ffcc00]). Свои классы собирает сам
// движок RenDit Code прямо в браузере — тот же, что в проекте с Node.js: страница передаёт ему токены и
// настройки (EngineData), тема строится так же (rendit-code/core/theme.mjs). Классы, которые уже есть
// в части, конструктор не дублирует: подскажет, какую часть включить.
// Пришли из конструктора на странице классов — ?add=w-240+h-120 — свои классы уже вписаны.

import { ArrowDown } from "@boxicons/react/ArrowDown";
import { Check } from "@boxicons/react/Check";
import { useEffect, useId, useMemo, useState } from "react";
import { cdnModule } from "@/config/release";
import { createGenerator } from "../../../../../rendit-code/core/generator.mjs";
import { buildTheme } from "../../../../../rendit-code/core/theme.mjs";
import { Builder, Field, LABEL, Switch } from "../../../_docs/builder";
import type { DistModule, EngineData } from "../../../_docs/class-css";
import { CopyButton } from "../../../_docs/copy-button";
import { minifyCss } from "./minify";

// по умолчанию — всё, кроме большой палитры (её цвета нужны не всем)
const DEFAULT_OFF = ["palette"];

const kb = (n: number) => `${Math.max(1, Math.round(n / 1024))} КБ`;

type Status =
  | { kind: "invalid" }
  | { kind: "picked"; module: DistModule }
  | { kind: "off"; module: DistModule }
  | { kind: "custom" };

const TABS = [
  { id: "links", title: "Подключение" },
  { id: "custom", title: "Свой CSS" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export function CssBuilder({
  modules,
  engine,
  fullBytes,
}: {
  modules: DistModule[];
  engine: EngineData;
  fullBytes: { bytes: number; minBytes: number };
}) {
  const id = useId();
  const generator = useMemo(
    () => createGenerator(buildTheme(engine), engine.config),
    [engine],
  );
  const [picked, setPicked] = useState(
    () =>
      new Set(
        modules.filter((m) => !DEFAULT_OFF.includes(m.id)).map((m) => m.id),
      ),
  );
  const [min, setMin] = useState(true);
  const [custom, setCustom] = useState("");
  const [tab, setTab] = useState<Tab>("links");

  // ?add=w-240+h-120 — пришли из конструктора на странице классов
  useEffect(() => {
    const add = new URLSearchParams(location.search).get("add");
    if (add) {
      // «+» в адресе — пробел, а «+» внутри класса (calc(100%+8px)) пришёл как %2B и уже раскодирован
      setCustom(add.split(/\s+/).join(" "));
      setTab("custom");
    }
  }, []);

  // в какой части лежит класс готового CSS
  const home = useMemo(() => {
    const map = new Map<string, DistModule>();
    for (const m of modules) for (const c of m.classes) map.set(c, m);
    return map;
  }, [modules]);

  // только по пробелам: запятая бывает внутри класса — grid-cols-[repeat(3,1fr)]
  const words = [...new Set(custom.split(/\s+/).filter(Boolean))];
  const statuses = words.map((cls): [string, Status] => {
    if (!generator.isValid(cls)) return [cls, { kind: "invalid" }];
    const m = home.get(cls);
    if (m)
      return [cls, { kind: picked.has(m.id) ? "picked" : "off", module: m }];
    return [cls, { kind: "custom" }];
  });
  const own = statuses.filter(([, s]) => s.kind === "custom").map(([c]) => c);
  // своя шапка вместо движковой «сгенерировано из классов в исходниках»: здесь классы вписали руками
  const css = own.length
    ? generator
        .generate(own)
        .css.replace(
          /^\/\*![^\n]*\*\//,
          `/*! RenDit UI v${engine.config.version} | свои классы из CSS-конструктора: ${own.length} */`,
        )
    : "";
  const customCss = min && css ? minifyCss(css) : css;
  const customFile = min ? "rendit-custom.min.css" : "rendit-custom.css";

  const chosen = modules.filter((m) => m.required || picked.has(m.id));
  const size = chosen.reduce((n, m) => n + (min ? m.minBytes : m.bytes), 0);
  const full = min ? fullBytes.minBytes : fullBytes.bytes;
  const links = [
    "<!-- RenDit UI: основа и выбранные части -->",
    ...chosen.map(
      (m) => `<link rel="stylesheet" href="${cdnModule(m.file, min)}">`,
    ),
    ...(own.length
      ? [
          "<!-- свои классы: файл из CSS-конструктора рядом со страницей -->",
          `<link rel="stylesheet" href="css/${customFile}">`,
        ]
      : []),
  ].join("\n");

  const toggle = (m: DistModule) =>
    setPicked((set) => {
      const next = new Set(set);
      if (next.has(m.id)) next.delete(m.id);
      else next.add(m.id);
      return next;
    });

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([customCss], { type: "text/css" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = customFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  const text = tab === "links" ? links : customCss;

  return (
    <Builder
      controls={
        <>
          <Field label="Части готового CSS" note={`${kb(size)} из ${kb(full)}`}>
            <ul className="flex flex-col gap-4">
              {modules.map((m) => {
                const on = m.required || picked.has(m.id);
                return (
                  <li key={m.id}>
                    <label
                      className={`flex items-start gap-10 p-8 br-lg transition-colors ${m.required ? "cursor-default" : "cursor-pointer hover:bg-foreground/4"} has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={m.required}
                        onChange={() => toggle(m)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`mt-2 size-18 shrink-0 br-sm grid place-items-center border transition-colors ${on ? "bg-secondary border-secondary text-secondary-foreground" : "border-border"}`}
                      >
                        {on && <Check size="xs" />}
                      </span>
                      <span className="flex-1 min-w-0 flex flex-col">
                        <span className="flex items-baseline justify-between gap-8 font-14 font-w-600">
                          {m.title}
                          <span className="shrink-0 font-12 font-w-500 font-mono text-foreground-muted">
                            {kb(min ? m.minBytes : m.bytes)}
                          </span>
                        </span>
                        <span className="font-12 text-foreground-muted">
                          {m.text}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </Field>
          <Switch checked={min} onChange={setMin}>
            Сжатые файлы (.min.css)
          </Switch>
        </>
      }
      preview={
        <div className="flex flex-col gap-10">
          <label className="flex flex-col gap-8">
            <span className={LABEL}>Свои классы — чего нет в готовом CSS</span>
            <textarea
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              rows={3}
              spellCheck={false}
              placeholder="w-100 h-37 md:p-30 bg-[#ffcc00] hover:shadow-6"
              className="w-full min-h-88 p-12 br-lg border border-border bg-surface font-mono font-16 lg:font-14 resize-y placeholder:text-foreground-subtle transition-[border-color,box-shadow] focus:border-secondary focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)] focus:outline-none"
            />
          </label>
          {statuses.length > 0 && (
            <ul className="flex flex-wrap gap-6 font-12">
              {statuses.map(([cls, s]) => (
                <li
                  key={cls}
                  title={
                    s.kind === "invalid"
                      ? "Такого класса нет в RenDit Code — опечатка?"
                      : s.kind === "off"
                        ? `Есть в части «${s.module.title}» — включите её слева`
                        : s.kind === "picked"
                          ? `Уже есть в части «${s.module.title}»`
                          : "Соберётся в свой файл"
                  }
                  className={`flex items-center gap-6 px-8 py-3 br-full font-mono ${
                    s.kind === "invalid"
                      ? "bg-danger/12 text-danger line-through"
                      : s.kind === "off"
                        ? "bg-warning/15 text-foreground"
                        : s.kind === "picked"
                          ? "bg-foreground/6 text-foreground-muted"
                          : "bg-success/12 text-success"
                  }`}
                >
                  {cls}
                  {s.kind === "off" && (
                    <button
                      type="button"
                      onClick={() => toggle(s.module)}
                      className="px-6 br-full bg-foreground/8 font-sans font-11 font-w-600 hover:bg-foreground/15"
                    >
                      + {s.module.title}
                    </button>
                  )}
                  {s.kind === "picked" && (
                    <span className="font-sans font-11">
                      в «{s.module.title}»
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="font-12 text-foreground-muted">
            Зелёные соберутся в свой файл, серые уже есть в выбранных частях,
            жёлтые — в выключенных (нажмите, чтобы включить часть), зачёркнутые
            — не классы RenDit Code.
          </p>
        </div>
      }
      output={
        <div className="flex flex-col gap-8 min-w-0">
          <div role="tablist" aria-label="Результат" className="flex gap-4">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`${id}-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`${id}-panel`}
                onClick={() => setTab(t.id)}
                className="h-28 px-10 br-full font-12 font-w-600 text-foreground-muted transition hover:text-foreground aria-selected:bg-foreground aria-selected:text-background"
              >
                {t.title}
                {t.id === "custom" && own.length > 0 && ` · ${own.length}`}
              </button>
            ))}
          </div>
          <div
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-${tab}`}
            className="flex items-start gap-10 p-12 br-lg border bg-surface-muted/50"
          >
            <pre className="flex-1 min-w-0 max-h-260 overflow-auto pt-6 font-12/20 font-mono whitespace-pre-wrap break-all">
              {text ||
                "Своих классов нет — хватит частей готового CSS. Впишите классы выше, если нужны другие значения."}
            </pre>
            {text && (
              <span className="shrink-0 flex flex-col gap-6">
                <CopyButton text={text} className="shrink-0" />
                {tab === "custom" && (
                  <button
                    type="button"
                    onClick={download}
                    aria-label={`Скачать ${customFile}`}
                    title={`Скачать ${customFile}`}
                    className="size-32 br-md grid place-items-center border bg-surface text-foreground-muted transition hover:text-foreground active:scale-92"
                  >
                    <ArrowDown size="xs" aria-hidden="true" />
                  </button>
                )}
              </span>
            )}
          </div>
          {tab === "custom" && own.length > 0 && (
            <p className="font-12 text-foreground-muted">
              Сохраните файл как <code>css/{customFile}</code> рядом со
              страницей — во вкладке «Подключение» для него уже есть строка.
            </p>
          )}
        </div>
      }
    />
  );
}
