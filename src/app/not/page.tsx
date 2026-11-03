"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type KeyKind =
  | "char"
  | "backspace"
  | "enter"
  | "tab"
  | "space"
  | "shift"
  | "caps"
  | "mod";

type KeyDef = {
  label: string;
  code: string;
  units: number;
  kind: KeyKind;
  char?: string;
  shiftChar?: string;
  small?: boolean;
};

const chr = (
  label: string,
  code: string,
  char: string,
  shiftChar: string,
): KeyDef => ({ label, code, units: 1, kind: "char", char, shiftChar });

const letter = (l: string): KeyDef => ({
  label: l,
  code: `Key${l}`,
  units: 1,
  kind: "char",
  char: l.toLowerCase(),
  shiftChar: l,
});

const DIGIT_SHIFT = "!@#$%^&*()";

/* Все ряды в сумме = 15 юнитов → колонки идеально выровнены */
const ROWS: KeyDef[][] = [
  [
    chr("`", "Backquote", "`", "~"),
    ..."1234567890"
      .split("")
      .map((d, i) => chr(d, `Digit${d}`, d, DIGIT_SHIFT[i])),
    chr("-", "Minus", "-", "_"),
    chr("=", "Equal", "=", "+"),
    { label: "⌫", code: "Backspace", units: 2, kind: "backspace" },
  ],
  [
    { label: "tab", code: "Tab", units: 1.5, kind: "tab", small: true },
    ..."QWERTYUIOP".split("").map(letter),
    chr("[", "BracketLeft", "[", "{"),
    chr("]", "BracketRight", "]", "}"),
    { ...chr("\\", "Backslash", "\\", "|"), units: 1.5 },
  ],
  [
    { label: "caps", code: "CapsLock", units: 1.75, kind: "caps", small: true },
    ..."ASDFGHJKL".split("").map(letter),
    chr(";", "Semicolon", ";", ":"),
    chr("'", "Quote", "'", '"'),
    { label: "enter", code: "Enter", units: 2.25, kind: "enter", small: true },
  ],
  [
    {
      label: "shift",
      code: "ShiftLeft",
      units: 2.25,
      kind: "shift",
      small: true,
    },
    ..."ZXCVBNM".split("").map(letter),
    chr(",", "Comma", ",", "<"),
    chr(".", "Period", ".", ">"),
    chr("/", "Slash", "/", "?"),
    {
      label: "shift",
      code: "ShiftRight",
      units: 2.75,
      kind: "shift",
      small: true,
    },
  ],
  [
    {
      label: "ctrl",
      code: "ControlLeft",
      units: 1.5,
      kind: "mod",
      small: true,
    },
    { label: "alt", code: "AltLeft", units: 1.5, kind: "mod", small: true },
    { label: "cmd", code: "MetaLeft", units: 1.5, kind: "mod", small: true },
    { label: "", code: "Space", units: 6, kind: "space" },
    { label: "alt", code: "AltRight", units: 1.5, kind: "mod", small: true },
    { label: "fn", code: "Fn", units: 1.5, kind: "mod", small: true },
    {
      label: "ctrl",
      code: "ControlRight",
      units: 1.5,
      kind: "mod",
      small: true,
    },
  ],
];

const KEYS_BY_CODE = new Map(ROWS.flat().map((k) => [k.code, k]));

export default function Page() {
  const [typed, setTyped] = useState("");
  const [shift, setShift] = useState(false);
  const [caps, setCaps] = useState(false);
  const [pressed, setPressed] = useState<Set<string>>(() => new Set());

  const shiftRef = useRef(false);
  const capsRef = useRef(false);

  const handleKey = useCallback(
    (key: KeyDef, fromPhysical = false, physicalShift = false) => {
      const shiftOn = fromPhysical ? physicalShift : shiftRef.current;
      const capsOn = capsRef.current;

      switch (key.kind) {
        case "shift":
          if (fromPhysical) return;
          shiftRef.current = !shiftRef.current;
          setShift(shiftRef.current);
          return;
        case "caps":
          if (fromPhysical) return;
          capsRef.current = !capsRef.current;
          setCaps(capsRef.current);
          return;
        case "mod":
          return;
        case "backspace":
          setTyped((t) => t.slice(0, -1));
          return;
        case "enter":
          setTyped((t) => `${t}\n`);
          return;
        case "tab":
          setTyped((t) => `${t}  `);
          return;
        case "space":
          setTyped((t) => `${t} `);
          return;
        case "char": {
          const base = key.char ?? "";
          const isLetter = /^[a-z]$/.test(base);
          const upper = isLetter ? shiftOn !== capsOn : shiftOn;
          const out = upper ? (key.shiftChar ?? base) : base;
          setTyped((t) => (t + out).slice(-160));
          // клик по Shift = «одноразовый» модификатор
          if (!fromPhysical && shiftRef.current) {
            shiftRef.current = false;
            setShift(false);
          }
          return;
        }
      }
    },
    [],
  );

  // Ввод с физической клавиатуры
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const key = KEYS_BY_CODE.get(e.code);
      if (!key) return;
      if (e.code === "Space") e.preventDefault();
      setPressed((p) => {
        if (p.has(e.code)) return p;
        const n = new Set(p);
        n.add(e.code);
        return n;
      });
      if (!e.repeat) handleKey(key, true, e.shiftKey);
    };
    const onUp = (e: KeyboardEvent) => {
      if (!KEYS_BY_CODE.has(e.code)) return;
      setPressed((p) => {
        if (!p.has(e.code)) return p;
        const n = new Set(p);
        n.delete(e.code);
        return n;
      });
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [handleKey]);

  // Показываем только последние 3 строки на «экране»
  const display = typed.split("\n").slice(-3).join("\n");

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        {/* ───────── Левая колонка: текст ───────── */}
        <div className={styles.copy}>
          <span className={styles.badge}>
            <i className={styles.badgeDot} />
            движок нового поколения
          </span>

          <h1 className={styles.title}>
            Собери интерфейс
            <br />
            из своих компонентов
          </h1>

          <p className={styles.lead}>
            Tawilind — лёгкий движок стилей поверх HTML и CSS. Без сборщиков,
            без зависимостей. Подключил — и работает. Попробуйте набрать
            что-нибудь на клавиатуре справа.
          </p>

          <div className={styles.actions}>
            <a href="#start" className={`${styles.btn} ${styles.btnPrimary}`}>
              Начать
              <span aria-hidden>→</span>
            </a>
            <a href="#docs" className={`${styles.btn} ${styles.btnGhost}`}>
              Документация
            </a>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>12 КБ</strong>
              <span>размер ядра</span>
            </div>
            <div className={styles.stat}>
              <strong>0</strong>
              <span>зависимостей</span>
            </div>
            <div className={styles.stat}>
              <strong>100%</strong>
              <span>нативный CSS</span>
            </div>
          </div>

          <p className={styles.hint}>
            <kbd className={styles.kbd}>Tab</kbd>
            <kbd className={styles.kbd}>Enter</kbd>
            <kbd className={styles.kbd}>⌫</kbd>
            работают и с вашей клавиатуры
          </p>
        </div>

        {/* ───────── Правая колонка: монитор + клавиатура ───────── */}
        <div className={styles.stage}>
          <div className={styles.monitorWrap}>
            <div className={styles.monitor}>
              <div className={styles.screen}>
                <div className={styles.termBar}>
                  <i />
                  <i />
                  <i />
                  <span>tawilind — zsh</span>
                </div>

                <div className={styles.termBody}>
                  <p>
                    <b>❯</b> npx tawilind init
                  </p>
                  <p className={styles.ok}>
                    <b>✓</b> engine ready · 0 dependencies
                  </p>
                  <p className={styles.input}>
                    <b>❯</b> {display}
                    <span className={styles.caret} />
                  </p>
                </div>

                <div className={styles.scanlines} />
              </div>

              <span className={styles.brandDot} />
            </div>

            <div className={styles.neck} />
            <div className={styles.base} />
          </div>

          <fieldset
            className={styles.keyboard}
            aria-label="Интерактивная клавиатура"
          >
            {ROWS.map((row) => (
              <div className={styles.row} key={row[0].code}>
                {row.map((k) => (
                  <button
                    key={k.code + k.label}
                    type="button"
                    className={styles.key}
                    style={{ flexGrow: k.units }}
                    data-pressed={pressed.has(k.code) || undefined}
                    data-active={
                      (k.kind === "shift" && shift) ||
                      (k.kind === "caps" && caps) ||
                      undefined
                    }
                    data-small={k.small || undefined}
                    aria-label={k.label || "space"}
                    onClick={() => handleKey(k)}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            ))}
          </fieldset>
        </div>
      </section>
    </main>
  );
}
