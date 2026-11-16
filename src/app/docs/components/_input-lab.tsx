"use client";

// Полный конструктор «Поля ввода»: тексты, размеры, тени, рамки, фоны из токенов
// и палитры, иконка, блок справа, состояния и поведение. Вид собирается в классы
// и уходит в page.tsx — компонент отвечает только за поведение.

import { Envelope } from "@boxicons/react/Envelope";
import { Search } from "@boxicons/react/Search";
import { User } from "@boxicons/react/User";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Field, Range, Seg, Switch } from "../../_docs/builder";
import {
  ColorPicker,
  nameOf,
  type Pick,
} from "../(getting-started)/scss/colors/_tools";
import { ComponentLab } from "./_lab";
import {
  autoText,
  BORDER_COLOR_CLASS,
  BORDER_WIDTH_CLASS,
  type Border,
  type BorderColor,
  classConst,
  join,
  jsxClass,
  RADIUS_CLASS,
  SHADOW_CLASS,
  type Shadow,
} from "./_style-maps";

const HEIGHTS = ["36", "40", "44", "48", "52", "56"];
const WIDTHS = ["160", "200", "240", "280", "320", "360", "420", "480"];
const FONTS = ["12", "13", "14", "15", "16", "18"];
const PADS = ["6", "8", "10", "12", "14", "16", "20"];
const GAPS = ["4", "6", "8", "10", "12"];
const RADII = ["0", "6", "8", "10", "12", "16", "999"];

const SHADOWS: { id: Shadow; title: string }[] = [
  { id: "none", title: "Нет" },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1) as Shadow,
    title: String(i + 1),
  })),
  { id: "inset", title: "Inset" },
  { id: "glass", title: "Glass" },
  { id: "line", title: "Line" },
];

const BORDERS = [
  { id: "none", title: "Без" },
  { id: "1", title: "1px" },
  { id: "2", title: "2px" },
] as const;
const BORDER_COLORS = [
  { id: "default", title: "Обычная" },
  { id: "strong", title: "Сильная" },
  { id: "secondary", title: "Secondary" },
  { id: "accent", title: "Акцент" },
  { id: "danger", title: "Красная" },
  { id: "success", title: "Зелёная" },
] as const;
const TEXT_COLORS = [
  { id: "auto", title: "Авто" },
  { id: "text-foreground", title: "Основной" },
  { id: "text-foreground-inverse", title: "Обратный" },
  { id: "text-primary-foreground", title: "На primary" },
  { id: "text-secondary-foreground", title: "На secondary" },
  { id: "text-accent-foreground", title: "На accent" },
  { id: "text-white", title: "Белый" },
] as const;
const FOCUS_COLORS = [
  { id: "none", title: "Нет" },
  { id: "secondary", title: "Фиолет" },
  { id: "accent", title: "Лайм" },
  { id: "primary", title: "Главный" },
  { id: "danger", title: "Красный" },
  { id: "success", title: "Зелёный" },
] as const;
const CARET_COLORS = [
  { id: "auto", title: "Авто" },
  { id: "caret-blue-500", title: "Синий" },
  { id: "caret-secondary", title: "Фиолет" },
  { id: "caret-accent", title: "Лайм" },
  { id: "caret-foreground", title: "Текст" },
  { id: "caret-transparent", title: "Нет" },
] as const;
const PLACEHOLDER_COLORS = [
  { id: "placeholder:text-foreground-subtle", title: "Тихий" },
  { id: "placeholder:text-foreground-muted", title: "Обычный" },
  { id: "placeholder:text-secondary", title: "Фиолет" },
  { id: "placeholder:text-accent", title: "Лайм" },
] as const;
const SELECTION_COLORS = [
  { id: "auto", title: "Обычное" },
  { id: "selection:bg-transparent selection:text-foreground", title: "Нет" },
  { id: "selection:bg-secondary/30", title: "Фиолет" },
  { id: "selection:bg-accent/40", title: "Лайм" },
] as const;
const ICONS = [
  { id: "none", title: "Нет" },
  { id: "mail", title: "Почта" },
  { id: "search", title: "Поиск" },
  { id: "user", title: "Человек" },
] as const;
const ICON_SIZES = ["14", "16", "18", "20", "24"];
const ICON_COLORS = [
  { id: "text-foreground-subtle", title: "Тихая" },
  { id: "text-foreground-muted", title: "Обычная" },
  { id: "text-secondary", title: "Фиолет" },
  { id: "text-accent", title: "Лайм" },
] as const;
const ENDS = [
  { id: "none", title: "Нет" },
  { id: "unit", title: "₽" },
  { id: "kbd", title: "⌘K" },
  { id: "at", title: "@" },
  { id: "kg", title: "кг" },
] as const;
const TYPES = [
  { id: "text", title: "Текст" },
  { id: "email", title: "Почта" },
  { id: "password", title: "Пароль" },
  { id: "number", title: "Число" },
  { id: "search", title: "Поиск" },
  { id: "tel", title: "Телефон" },
  { id: "url", title: "Ссылка" },
] as const;
const STATES = [
  { id: "normal", title: "Обычное" },
  { id: "error", title: "Ошибка" },
  { id: "disabled", title: "Выключено" },
] as const;
const CODE_STYLES = [
  { id: "const", title: "Константы" },
  { id: "jsx", title: "В JSX" },
  { id: "plain", title: "TSX" },
] as const;

type Focus = (typeof FOCUS_COLORS)[number]["id"];
type Caret = (typeof CARET_COLORS)[number]["id"];
type Placeholder = (typeof PLACEHOLDER_COLORS)[number]["id"];
type Selection = (typeof SELECTION_COLORS)[number]["id"];
type Icon = (typeof ICONS)[number]["id"];
type IconColor = (typeof ICON_COLORS)[number]["id"];
type End = (typeof ENDS)[number]["id"];
type Type = (typeof TYPES)[number]["id"];
type State = (typeof STATES)[number]["id"];
type CodeStyle = (typeof CODE_STYLES)[number]["id"];

const FOCUS_CLASS: Record<Focus, string> = {
  none: "",
  secondary:
    "focus-within:border-secondary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--secondary)_14%,transparent)]",
  accent:
    "focus-within:border-accent focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_20%,transparent)]",
  primary:
    "focus-within:border-primary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_14%,transparent)]",
  danger:
    "focus-within:border-danger focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--danger)_14%,transparent)]",
  success:
    "focus-within:border-success focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--success)_14%,transparent)]",
};
const ICON_SIZE_CLASS: Record<string, string> = {
  "14": "size-14",
  "16": "size-16",
  "18": "size-18",
  "20": "size-20",
  "24": "size-24",
};

const ICON_NODE = {
  none: null,
  mail: <Envelope width={18} height={18} />,
  search: <Search width={18} height={18} />,
  user: <User width={18} height={18} />,
};

const ICON_CODE = {
  none: "",
  mail: "<Envelope />",
  search: "<Search />",
  user: "<User />",
};

const ICON_IMPORT = {
  none: "",
  mail: 'import { Envelope } from "@boxicons/react/Envelope";\n',
  search: 'import { Search } from "@boxicons/react/Search";\n',
  user: 'import { User } from "@boxicons/react/User";\n',
};

const END_NODE = {
  none: null,
  unit: <span className="font-12 text-foreground-muted">₽</span>,
  kbd: (
    <kbd className="px-6 py-2 br-sm border bg-surface font-11 font-mono text-foreground-muted">
      ⌘K
    </kbd>
  ),
  at: <span className="text-foreground-subtle">@</span>,
  kg: <span className="font-12 text-foreground-muted">кг</span>,
};

const END_CODE = {
  none: "",
  unit: '<span className="font-12 text-foreground-muted">₽</span>',
  kbd: '<kbd className="px-6 py-2 br-sm border bg-surface font-11 font-mono">⌘K</kbd>',
  at: '<span className="text-foreground-subtle">@</span>',
  kg: '<span className="font-12 text-foreground-muted">кг</span>',
};

const HOT: Record<string, string> = {
  field: "Поле",
  text: "Тексты",
  icons: "Иконки",
  behavior: "Поведение",
};

const NAV = [
  { id: "field", title: "Поле" },
  { id: "text", title: "Тексты" },
  { id: "icons", title: "Иконки" },
  { id: "behavior", title: "Поведение" },
];

const PART_GROUP: Record<string, string> = {
  field: "field",
  input: "field",
  label: "text",
  hint: "text",
  error: "text",
  icon: "icons",
  end: "icons",
};

const SECTION = "font-11 font-w-700 uppercase letter-s-6 text-foreground-muted";
const TEXT_INPUT =
  "w-full h-36 px-10 br-md border bg-surface font-16 outline-none placeholder:text-foreground-muted focus:border-secondary";

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={TEXT_INPUT}
      />
    </Field>
  );
}

export function InputLab() {
  const [label, setLabel] = useState("Почта");
  const [hint, setHint] = useState("Пришлём чек и статус заказа");
  const [placeholder, setPlaceholder] = useState("you@example.com");
  const [errorText, setErrorText] = useState("Проверьте адрес — нужен @");
  const [height, setHeight] = useState("44");
  const [width, setWidth] = useState("320");
  const [fullWidth, setFullWidth] = useState(false);
  const [font, setFont] = useState("16");
  const [pad, setPad] = useState("12");
  const [gap, setGap] = useState("8");
  const [radius, setRadius] = useState("12");
  const [shadow, setShadow] = useState<Shadow>("1");
  const [border, setBorder] = useState<Border>("1");
  const [borderColor, setBorderColor] = useState<BorderColor>("default");
  const [bgPick, setBgPick] = useState<Pick>({ family: "surface", step: 500 });
  const [bgTransparent, setBgTransparent] = useState(false);
  const [textClass, setTextClass] = useState("auto");
  const [focus, setFocus] = useState<Focus>("secondary");
  const [caret, setCaret] = useState<Caret>("caret-blue-500");
  const [placeholderColor, setPlaceholderColor] = useState<Placeholder>(
    "placeholder:text-foreground-subtle",
  );
  const [selection, setSelection] = useState<Selection>("auto");
  const [touchFont, setTouchFont] = useState(true);
  const [hideCancel, setHideCancel] = useState(true);
  const [icon, setIcon] = useState<Icon>("mail");
  const [iconSize, setIconSize] = useState("18");
  const [iconColor, setIconColor] = useState<IconColor>(
    "text-foreground-subtle",
  );
  const [end, setEnd] = useState<End>("none");
  const [type, setType] = useState<Type>("email");
  const [state, setState] = useState<State>("normal");
  const [required, setRequired] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [codeStyle, setCodeStyle] = useState<CodeStyle>("const");
  const [inspect, setInspect] = useState(false);
  const [hot, setHot] = useState<string | null>(null);

  const bgName = nameOf(bgPick);
  const bgClass = bgTransparent ? "bg-transparent" : `bg-${bgName}`;
  const effectiveText =
    textClass === "auto"
      ? bgTransparent
        ? "text-foreground"
        : autoText(bgPick)
      : textClass;
  const isError = state === "error";
  const isDisabled = state === "disabled";
  const focusClass = isError ? FOCUS_CLASS.danger : FOCUS_CLASS[focus];

  const hotGroup = hot ? PART_GROUP[hot] : null;
  const groupClass = (group: string) =>
    `flex flex-col gap-12 p-12 br-lg border bg-surface-muted/30 transition-[background-color,box-shadow] ${
      hotGroup === group
        ? "bg-secondary/5 outline-2 outline-secondary/40 outline-offset-4"
        : ""
    }`;

  const partOf = (target: EventTarget | null) =>
    (target as HTMLElement | null)
      ?.closest?.("[data-part]")
      ?.getAttribute("data-part") ?? null;

  const jump = (group: string) => {
    const el = document.getElementById(`settings-${group}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.querySelector<HTMLElement>("input, button, [role=switch]")?.focus({
      preventScroll: true,
    });
  };

  const reset = () => {
    setLabel("Почта");
    setHint("Пришлём чек и статус заказа");
    setPlaceholder("you@example.com");
    setErrorText("Проверьте адрес — нужен @");
    setHeight("44");
    setWidth("320");
    setFullWidth(false);
    setFont("16");
    setPad("12");
    setGap("8");
    setRadius("12");
    setShadow("1");
    setBorder("1");
    setBorderColor("default");
    setBgPick({ family: "surface", step: 500 });
    setBgTransparent(false);
    setTextClass("auto");
    setFocus("secondary");
    setCaret("caret-blue-500");
    setPlaceholderColor("placeholder:text-foreground-subtle");
    setSelection("auto");
    setTouchFont(true);
    setHideCancel(true);
    setIcon("mail");
    setIconSize("18");
    setIconColor("text-foreground-subtle");
    setEnd("none");
    setType("email");
    setState("normal");
    setRequired(false);
    setReadOnly(false);
    setCodeStyle("const");
    setInspect(false);
  };

  const wrapperParts = [
    join(
      `h-${height}`,
      fullWidth ? "w-full" : `w-${width}`,
      `px-${pad}`,
      `gap-${gap}`,
      RADIUS_CLASS[radius],
    ),
    join(
      BORDER_WIDTH_CLASS[border],
      BORDER_COLOR_CLASS[isError ? "danger" : borderColor],
      SHADOW_CLASS[shadow],
      bgClass,
      effectiveText,
    ),
    focusClass,
  ];
  const inputParts = [
    `font-${font}`,
    caret !== "auto" && caret,
    selection !== "auto" && selection,
    touchFont && Number(font) < 16 && "touch:text-[16px]",
    hideCancel &&
      type === "search" &&
      "[&::-webkit-search-cancel-button]:hidden",
  ];
  const codeIconClassName = join(ICON_SIZE_CLASS[iconSize], iconColor);
  const constMode = codeStyle === "const";
  const plainMode = codeStyle === "plain";

  const codeProps = [
    label && `label=${JSON.stringify(label)}`,
    `type="${type}"`,
    placeholder && `placeholder=${JSON.stringify(placeholder)}`,
    hint && `hint=${JSON.stringify(hint)}`,
    isError && `error=${JSON.stringify(errorText)}`,
    isDisabled && "disabled",
    required && "required",
    readOnly && "readOnly",
    constMode
      ? "wrapperClassName={wrapper}"
      : jsxClass("wrapperClassName", wrapperParts),
    constMode
      ? "inputClassName={input}"
      : jsxClass("inputClassName", inputParts),
    `placeholderClassName="${placeholderColor}"`,
    icon !== "none" && `icon={${ICON_CODE[icon]}}`,
    icon !== "none" &&
      (constMode
        ? "iconClassName={iconClass}"
        : `iconClassName="${codeIconClassName}"`),
    end !== "none" && `end={${END_CODE[end]}}`,
    type === "password" && 'defaultValue="renDit2026"',
  ].filter(Boolean);

  const constants = constMode
    ? `${classConst("wrapper", wrapperParts)}
${classConst("input", inputParts)}${
  icon !== "none" ? `\n${classConst("iconClass", [codeIconClassName])}` : ""
}

`
    : "";

  const componentCode = `${ICON_IMPORT[icon]}import { Input } from "@/components/ui/Input";

${constants}export default function Page() {
  return (
    <Input
      ${codeProps.join("\n      ")}
    />
  );
}`;

  // Вариант без компонента и импортов: обычный input с теми же классами.
  const htmlRootClass = join(
    "flex flex-col gap-6 min-w-0",
    isDisabled && "opacity-50",
  );
  const htmlWrapperClass = join(
    "relative flex items-center max-w-full min-w-0",
    ...wrapperParts,
  );
  const htmlInputClass = join(
    "w-full h-full min-w-0 bg-transparent outline-none",
    ...inputParts,
    placeholderColor,
  );
  const fieldId = `field-${type}`;
  const messageId = isError
    ? `${fieldId}-error`
    : hint
      ? `${fieldId}-hint`
      : "";
  const htmlAttrs = [
    `id="${fieldId}"`,
    `type="${type}"`,
    placeholder && `placeholder=${JSON.stringify(placeholder)}`,
    `className="${htmlInputClass}"`,
    !label && 'aria-label="Поле"',
    isError && 'aria-invalid="true"',
    messageId && `aria-describedby="${messageId}"`,
    isDisabled && "disabled",
    required && "required",
    readOnly && "readOnly",
    type === "password" && 'defaultValue="renDit2026"',
  ].filter(Boolean);
  const htmlCode = `<div className="${htmlRootClass}">
${label ? `  <label htmlFor="${fieldId}" className="font-13 font-w-600">${label}</label>\n` : ""}  <div className="${htmlWrapperClass}">
${
  icon !== "none"
    ? `    <span className="shrink-0 grid place-items-center ${ICON_SIZE_CLASS[iconSize]} ${iconColor}" aria-hidden="true">\n      {/* ваша иконка */}\n    </span>\n`
    : ""
}    <input
      ${htmlAttrs.join("\n      ")}
    />
${
  end !== "none"
    ? `    <span className="shrink-0 flex items-center gap-4">${END_CODE[end]}</span>\n`
    : ""
}  </div>
${
  isError
    ? `  <span id="${messageId}" className="font-12 text-danger">${errorText}</span>`
    : hint
      ? `  <span id="${messageId}" className="font-12 text-foreground-muted">${hint}</span>`
      : ""
}
</div>`;
  const code = plainMode ? htmlCode : componentCode;

  const previewWrapperClassName = join(
    BORDER_WIDTH_CLASS[border],
    BORDER_COLOR_CLASS[isError ? "danger" : borderColor],
    SHADOW_CLASS[shadow],
    effectiveText,
    focusClass,
  );
  const previewInputClassName = join(
    caret !== "auto" && caret,
    selection !== "auto" && selection,
    touchFont && Number(font) < 16 && "touch:text-[16px]",
    hideCancel &&
      type === "search" &&
      "[&::-webkit-search-cancel-button]:hidden",
  );
  const previewWrapperStyle = {
    height: Number(height),
    width: fullWidth ? "100%" : Number(width),
    paddingLeft: Number(pad),
    paddingRight: Number(pad),
    gap: Number(gap),
    borderRadius: Number(radius),
    backgroundColor: bgTransparent ? "transparent" : `var(--${bgName})`,
  };

  return (
    <ComponentLab
      controls={
        <>
          <div className="flex flex-col gap-10 p-12 br-lg border bg-surface shadow-1">
            <div className="flex items-center justify-between gap-8">
              <span className={SECTION}>Настройки</span>
              <button
                type="button"
                onClick={reset}
                className="h-30 px-12 br-full border bg-surface font-12 font-w-600 text-foreground-muted transition-colors hover:text-foreground"
              >
                Сбросить
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                `${height}×${fullWidth ? "100%" : width}`,
                `${font}px`,
                `r ${radius}`,
                `sh ${shadow}`,
                icon === "none" ? "без иконки" : "иконка",
              ].map((chip) => (
                <span
                  key={chip}
                  className="px-8 py-3 br-full bg-foreground/5 font-11 font-mono text-foreground-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {NAV.map(({ id, title }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => jump(id)}
                  className="h-28 px-10 br-full border bg-surface font-12 font-w-600 text-foreground-muted transition-colors hover:border-secondary hover:text-foreground"
                >
                  {title}
                </button>
              ))}
            </div>
            <Field
              label="Код подключения"
              note={
                codeStyle === "const"
                  ? "константы"
                  : codeStyle === "jsx"
                    ? "сразу в JSX"
                    : "без импорта"
              }
            >
              <Seg
                value={codeStyle}
                options={CODE_STYLES}
                onChange={setCodeStyle}
              />
            </Field>
          </div>

          <div id="settings-text" className={groupClass("text")}>
            <span className={SECTION}>Тексты</span>
            <TextField
              label="Подпись"
              value={label}
              onChange={setLabel}
              placeholder="Без подписи"
            />
            <TextField
              label="Подсказка"
              value={hint}
              onChange={setHint}
              placeholder="Без подсказки"
            />
            <TextField
              label="Плейсхолдер"
              value={placeholder}
              onChange={setPlaceholder}
              placeholder="Пусто"
            />
            <TextField
              label="Текст ошибки"
              value={errorText}
              onChange={setErrorText}
              placeholder="Проверьте поле"
            />
          </div>

          <div id="settings-field" className={groupClass("field")}>
            <span className={SECTION}>Поле</span>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Высота" note={`${height}px`}>
                <Range
                  label="Высота"
                  values={HEIGHTS}
                  value={height}
                  onChange={setHeight}
                />
              </Field>
              <Field label="Ширина" note={fullWidth ? "100%" : `${width}px`}>
                <Range
                  label="Ширина"
                  values={WIDTHS}
                  value={width}
                  onChange={setWidth}
                />
              </Field>
              <Field label="Размер текста" note={`${font}px`}>
                <Range
                  label="Размер текста"
                  values={FONTS}
                  value={font}
                  onChange={setFont}
                />
              </Field>
              <Field label="Отступ по X" note={`${pad}px`}>
                <Range
                  label="Отступ по X"
                  values={PADS}
                  value={pad}
                  onChange={setPad}
                />
              </Field>
              <Field label="Зазор с иконкой" note={`${gap}px`}>
                <Range
                  label="Зазор с иконкой"
                  values={GAPS}
                  value={gap}
                  onChange={setGap}
                />
              </Field>
              <Field
                label="Радиус поля"
                note={radius === "999" ? "круг" : `${radius}px`}
              >
                <Range
                  label="Радиус поля"
                  values={RADII}
                  value={radius}
                  onChange={setRadius}
                />
              </Field>
              <Field label="Тень">
                <Seg value={shadow} options={SHADOWS} onChange={setShadow} />
              </Field>
              <Field label="Рамка">
                <Seg value={border} options={BORDERS} onChange={setBorder} />
              </Field>
              <Field label="Цвет рамки">
                <Seg
                  value={borderColor}
                  options={BORDER_COLORS}
                  onChange={setBorderColor}
                />
              </Field>
              <Field label="Фокус">
                <Seg value={focus} options={FOCUS_COLORS} onChange={setFocus} />
              </Field>
            </div>
            <Switch checked={fullWidth} onChange={setFullWidth}>
              Поле на всю ширину
            </Switch>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Цвет текста">
                <Seg
                  value={textClass}
                  options={TEXT_COLORS}
                  onChange={setTextClass}
                />
              </Field>
              <Field label="Цвет курсора">
                <Seg value={caret} options={CARET_COLORS} onChange={setCaret} />
              </Field>
              <Field label="Плейсхолдер">
                <Seg
                  value={placeholderColor}
                  options={PLACEHOLDER_COLORS}
                  onChange={setPlaceholderColor}
                />
              </Field>
              <Field label="Выделение текста">
                <Seg
                  value={selection}
                  options={SELECTION_COLORS}
                  onChange={setSelection}
                />
              </Field>
            </div>
            <Switch checked={touchFont} onChange={setTouchFont}>
              16px на телефоне
            </Switch>
            <Switch checked={hideCancel} onChange={setHideCancel}>
              Скрыть крестик поиска
            </Switch>
            <ColorPicker label="Фон поля" value={bgPick} onChange={setBgPick} />
            <Switch checked={bgTransparent} onChange={setBgTransparent}>
              Прозрачный фон поля
            </Switch>
          </div>

          <div id="settings-icons" className={groupClass("icons")}>
            <span className={SECTION}>Иконка и блок справа</span>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Иконка слева">
                <Seg value={icon} options={ICONS} onChange={setIcon} />
              </Field>
              <Field label="Размер иконки" note={`${iconSize}px`}>
                <Range
                  label="Размер иконки"
                  values={ICON_SIZES}
                  value={iconSize}
                  onChange={setIconSize}
                />
              </Field>
              <Field label="Цвет иконки">
                <Seg
                  value={iconColor}
                  options={ICON_COLORS}
                  onChange={setIconColor}
                />
              </Field>
              <Field label="Блок справа">
                <Seg value={end} options={ENDS} onChange={setEnd} />
              </Field>
            </div>
          </div>

          <div id="settings-behavior" className={groupClass("behavior")}>
            <span className={SECTION}>Поведение</span>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Тип поля">
                <Seg value={type} options={TYPES} onChange={setType} />
              </Field>
              <Field label="Состояние">
                <Seg value={state} options={STATES} onChange={setState} />
              </Field>
            </div>
            <div className="flex flex-col gap-12">
              <Switch checked={required} onChange={setRequired}>
                Обязательное
              </Switch>
              <Switch checked={readOnly} onChange={setReadOnly}>
                Только чтение
              </Switch>
              <Switch checked={inspect} onChange={setInspect}>
                Клик по примеру ведёт к настройке
              </Switch>
            </div>
          </div>
        </>
      }
      preview={
        <div
          className="relative w-full max-w-480 min-w-0"
          onPointerOver={(e) => {
            const part = partOf(e.target);
            if (part !== hot) setHot(part);
          }}
          onPointerLeave={() => setHot(null)}
          onClickCapture={(e) => {
            if (!inspect) return;
            const part = partOf(e.target);
            if (!part) return;
            e.preventDefault();
            e.stopPropagation();
            jump(PART_GROUP[part]);
          }}
        >
          {hotGroup && (
            <span className="absolute top-8 right-8 z-1 px-8 py-4 br-full bg-foreground text-background font-11 font-w-600 shadow-3 pointer-events-none">
              {HOT[hotGroup]} → настройки
            </span>
          )}
          <div
            className="mx-auto max-w-full"
            style={{
              width: "100%",
              maxWidth: fullWidth ? undefined : Number(width),
            }}
          >
            <Input
              label={label || undefined}
              hint={hint || undefined}
              placeholder={placeholder || undefined}
              error={isError ? errorText : undefined}
              type={type}
              disabled={isDisabled}
              required={required}
              readOnly={readOnly}
              icon={ICON_NODE[icon]}
              end={END_NODE[end]}
              defaultValue={type === "password" ? "renDit2026" : undefined}
              wrapperClassName={previewWrapperClassName}
              wrapperStyle={previewWrapperStyle}
              inputClassName={previewInputClassName}
              placeholderClassName={placeholderColor}
              inputStyle={{ fontSize: Number(font) }}
              iconClassName={join(ICON_SIZE_CLASS[iconSize], iconColor)}
            />
          </div>
        </div>
      }
      previewClassName="grid place-items-center"
      code={code}
    />
  );
}
