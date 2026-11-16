"use client";

// Поле ввода RenDit UI: подпись, подсказка, ошибка, иконка слева и любой блок справа.
// Компонент отвечает за поведение и доступность. Вид — классами в файле подключения:
// wrapperClassName, inputClassName, iconClassName. Без них работает аккуратный дефолт.
// На телефоне шрифт не меньше 16px — iOS не приближает страницу при фокусе.

import {
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  useId,
  useRef,
} from "react";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** подпись над полем; связана с input через id */
  label?: ReactNode;
  /** подсказка под полем */
  hint?: ReactNode;
  /** ошибка под полем: красная рамка и aria-invalid */
  error?: ReactNode;
  /** иконка слева — декоративная, скринридер её не читает */
  icon?: ReactNode;
  /** блок справа: кнопка, клавиша, единица измерения */
  end?: ReactNode;
  ref?: Ref<HTMLInputElement>;

  // Вид: всё приходит из page.tsx. Без класса — работает дефолт.
  labelClassName?: string;
  /** обёртка поля: высота, отступы, радиус, рамка, тень, фон, фокус */
  wrapperClassName?: string;
  /** сам input: размер и цвет текста */
  inputClassName?: string;
  /** цвет плейсхолдера */
  placeholderClassName?: string;
  /** иконка слева */
  iconClassName?: string;
  /** блок справа */
  endClassName?: string;
  hintClassName?: string;
  errorClassName?: string;

  /** точные размеры числом — удобно из конструктора */
  wrapperStyle?: CSSProperties;
  inputStyle?: CSSProperties;
};

const WRAPPER_BASE =
  "relative flex items-center max-w-full min-w-0 transition-[border-color,box-shadow] motion-reduce:transition-none";
const WRAPPER_DEFAULT =
  "h-44 px-12 gap-8 br-lg border bg-surface focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)] has-[[aria-invalid]]:border-danger has-[[aria-invalid]]:focus-within:border-danger has-[[aria-invalid]]:focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--danger)_14%,transparent)]";
const INPUT_BASE =
  "w-full h-full min-w-0 bg-transparent outline-none disabled:cursor-not-allowed";
const INPUT_DEFAULT = "font-16";
const PLACEHOLDER_DEFAULT = "placeholder:text-foreground-subtle";
const ICON_BASE =
  "shrink-0 grid place-items-center text-foreground-subtle [&>svg]:size-full";
const ICON_DEFAULT = "size-18";
const END_BASE = "shrink-0 flex items-center gap-4";

const cx = (...values: (string | false | null | undefined)[]) =>
  values.filter(Boolean).join(" ");

export function Input({
  label,
  hint,
  error,
  icon,
  end,
  id,
  ref: inputRef,
  className = "",
  labelClassName,
  wrapperClassName,
  inputClassName,
  placeholderClassName,
  iconClassName,
  endClassName,
  hintClassName,
  errorClassName,
  wrapperStyle,
  inputStyle,
  disabled,
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const localRef = useRef<HTMLInputElement>(null);
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const invalid =
    Boolean(error) ||
    props["aria-invalid"] === true ||
    props["aria-invalid"] === "true";
  const described = [error ? errorId : hint ? hintId : null, describedBy]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cx(
        "flex flex-col gap-6 min-w-0",
        disabled && "opacity-50",
        className,
      )}
    >
      {label && (
        <label
          htmlFor={inputId}
          data-part="label"
          className={cx("font-13 font-w-600", labelClassName)}
        >
          {label}
        </label>
      )}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: клик по обёртке только ставит фокус в input */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: клавиатура работает через сам input */}
      <div
        data-part="field"
        className={cx(WRAPPER_BASE, wrapperClassName ?? WRAPPER_DEFAULT)}
        style={wrapperStyle}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.closest(
              "input, textarea, select, button, a, [contenteditable]",
            )
          )
            return;
          localRef.current?.focus();
        }}
      >
        {icon && (
          <span
            aria-hidden="true"
            data-part="icon"
            className={cx(ICON_BASE, iconClassName ?? ICON_DEFAULT)}
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          ref={(node) => {
            localRef.current = node;
            if (typeof inputRef === "function") inputRef(node);
            else if (inputRef) inputRef.current = node;
          }}
          data-part="input"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={described || undefined}
          className={cx(
            INPUT_BASE,
            inputClassName ?? INPUT_DEFAULT,
            placeholderClassName ?? PLACEHOLDER_DEFAULT,
          )}
          style={inputStyle}
          {...props}
        />
        {end && (
          <span data-part="end" className={cx(END_BASE, endClassName)}>
            {end}
          </span>
        )}
      </div>
      {error ? (
        <p
          id={errorId}
          data-part="error"
          className={cx("font-12 text-danger", errorClassName)}
        >
          {error}
        </p>
      ) : (
        hint && (
          <p
            id={hintId}
            data-part="hint"
            className={cx("font-12 text-foreground-muted", hintClassName)}
          >
            {hint}
          </p>
        )
      )}
    </div>
  );
}
