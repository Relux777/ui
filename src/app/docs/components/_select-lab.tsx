"use client";

// Профессиональный конструктор Select: только свои пункты (демо сразу заполнено), тексты,
// размеры, все тени, рамки и фоны из токенов/палитры, цвета текста, карточки пунктов,
// анимация, сторона открытия, ссылки и кнопки, подсказка «пример → настройка».

import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowUp } from "@boxicons/react/ArrowUp";
import { Code as CodeIcon } from "@boxicons/react/Code";
import { CursorClick } from "@boxicons/react/CursorClick";
import { Palette } from "@boxicons/react/Palette";
import { Plus } from "@boxicons/react/Plus";
import { Rocket } from "@boxicons/react/Rocket";
import { Sparkles } from "@boxicons/react/Sparkles";
import { X } from "@boxicons/react/X";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Select,
  type SelectAlign,
  type SelectAnimation,
  type SelectPlacement,
} from "@/components/ui/Select";
import type { SelectOption } from "@/components/ui/Select/options";
import { Field, Range, Seg, Switch } from "../../_docs/builder";
import {
  ColorPicker,
  nameOf,
  type Pick,
} from "../(getting-started)/scss/colors/_tools";
import { ComponentLab } from "./_lab";
import {
  ACCENT_CLASS,
  autoText,
  BORDER_COLOR_CLASS,
  BORDER_WIDTH_CLASS,
  classConst,
  join,
  RADIUS_CLASS,
  type Accent as SelectAccent,
  type Border as SelectBorder,
  type BorderColor as SelectBorderColor,
  type Shadow as SelectShadow,
  SHADOW_CLASS,
} from "./_style-maps";

const HEIGHTS = ["36", "40", "44", "48", "52", "56"];
const WIDTHS = ["160", "200", "240", "280", "320", "360", "420", "480"];
const FONTS = ["12", "13", "14", "15", "16", "18"];
const PADS = ["6", "8", "10", "12", "14", "16", "20"];
const RADII = ["0", "6", "8", "10", "12", "16", "999"];
const OFFSETS = ["0", "4", "6", "8", "12", "16"];
const GAPS = ["0", "2", "4", "6", "8", "10", "12"];
const OPTION_PADS = ["4", "6", "8", "10", "12", "14", "16"];

const SHADOWS: { id: SelectShadow; title: string }[] = [
  { id: "none", title: "Нет" },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1) as SelectShadow,
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
const ACCENTS = [
  { id: "secondary", title: "Фиолет" },
  { id: "accent", title: "Лайм" },
  { id: "primary", title: "Главный" },
  { id: "danger", title: "Красный" },
  { id: "success", title: "Зелёный" },
] as const;
const ANIMATIONS = [
  { id: "none", title: "Нет" },
  { id: "fade", title: "Проявление" },
  { id: "scale", title: "Масштаб" },
  { id: "slide", title: "Сдвиг" },
] as const;
const PLACEMENTS = [
  { id: "auto", title: "Как лучше" },
  { id: "bottom", title: "Вниз" },
  { id: "top", title: "Вверх" },
] as const;
const ALIGNS = [
  { id: "start", title: "Слева" },
  { id: "end", title: "Справа" },
] as const;

const KINDS = [
  { id: "option", title: "Пункт" },
  { id: "link", title: "Ссылка" },
  { id: "button", title: "Кнопка" },
] as const;
type Kind = (typeof KINDS)[number]["id"];

const SECTION = "font-11 font-w-700 uppercase letter-s-6 text-foreground-muted";
const TEXT_INPUT =
  "w-full h-36 px-10 br-md border bg-surface font-16 outline-none placeholder:text-foreground-muted focus:border-secondary";
const ROW_INPUT =
  "flex-1 min-w-0 h-36 px-8 br-md border bg-surface font-16 outline-none placeholder:text-foreground-muted focus:border-secondary";

const DEMO_OPTIONS: SelectOption[] = [
  {
    value: "design",
    label: "Дизайн",
    hint: "макет и UI",
    badge: "new",
    icon: <Palette width={16} height={16} />,
  },
  {
    value: "dev",
    label: "Разработка",
    hint: "код и сборка",
    icon: <CodeIcon width={16} height={16} />,
  },
  {
    value: "marketing",
    label: "Маркетинг",
    hint: "перейти в обновления",
    badge: "ссылка",
    href: "/docs/releases",
    icon: <Rocket width={16} height={16} />,
  },
  {
    value: "task",
    label: "Новая задача",
    hint: "выполнит действие",
    badge: "кнопка",
    action: "button",
    icon: <CursorClick width={16} height={16} />,
  },
];

const ICON_CODE: Record<string, string> = {
  design: "Palette",
  dev: "Code",
  marketing: "Rocket",
  task: "CursorClick",
};

const HOT: Record<string, string> = {
  field: "Поле",
  text: "Тексты",
  panel: "Список",
  options: "Пункты",
  behavior: "Поиск и вид",
};

const NAV = [
  { id: "field", title: "Поле" },
  { id: "panel", title: "Список" },
  { id: "options", title: "Пункты" },
  { id: "behavior", title: "Поведение" },
  { id: "text", title: "Тексты" },
];

const PART_GROUP: Record<string, string> = {
  trigger: "field",
  icon: "field",
  label: "text",
  hint: "text",
  error: "text",
  panel: "panel",
  search: "behavior",
  option: "options",
};

const stripIcons = (options: SelectOption[]) =>
  options.map((o) => ({ ...o, icon: undefined }));

const iconNameOf = (option: SelectOption, icons: boolean) =>
  icons ? (ICON_CODE[option.value] ?? (option.icon ? "Sparkles" : null)) : null;

const kindOf = (option: SelectOption): Kind =>
  option.href !== undefined
    ? "link"
    : option.action === "button"
      ? "button"
      : "option";

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

export function SelectLab() {
  const router = useRouter();
  const [value, setValue] = useState("design");
  const [label, setLabel] = useState("Раздел");
  const [hint, setHint] = useState("Можно изменить позже");
  const [placeholder, setPlaceholder] = useState("Выберите раздел");
  const [height, setHeight] = useState("44");
  const [width, setWidth] = useState("320");
  const [fullWidth, setFullWidth] = useState(false);
  const [font, setFont] = useState("16");
  const [pad, setPad] = useState("12");
  const [radius, setRadius] = useState("12");
  const [shadow, setShadow] = useState<SelectShadow>("1");
  const [border, setBorder] = useState<SelectBorder>("1");
  const [borderColor, setBorderColor] = useState<SelectBorderColor>("default");
  const [bgPick, setBgPick] = useState<Pick>({ family: "surface", step: 500 });
  const [bgTransparent, setBgTransparent] = useState(false);
  const [textClass, setTextClass] = useState("auto");
  const [panelShadow, setPanelShadow] = useState<SelectShadow>("5");
  const [panelBorder, setPanelBorder] = useState<SelectBorder>("1");
  const [panelBorderColor, setPanelBorderColor] =
    useState<SelectBorderColor>("default");
  const [panelPick, setPanelPick] = useState<Pick>({
    family: "surface",
    step: 500,
  });
  const [panelTransparent, setPanelTransparent] = useState(false);
  const [panelTextClass, setPanelTextClass] = useState("auto");
  const [panelRadius, setPanelRadius] = useState("16");
  const [accent, setAccent] = useState<SelectAccent>("secondary");
  const [optionGap, setOptionGap] = useState("4");
  const [optionRadius, setOptionRadius] = useState("8");
  const [optionWidth, setOptionWidth] = useState("320");
  const [optionFull, setOptionFull] = useState(true);
  const [optionPadX, setOptionPadX] = useState("10");
  const [optionPadY, setOptionPadY] = useState("9");
  const [animation, setAnimation] = useState<SelectAnimation>("scale");
  const [placement, setPlacement] = useState<SelectPlacement>("auto");
  const [align, setAlign] = useState<SelectAlign>("start");
  const [offset, setOffset] = useState("6");
  const [searchable, setSearchable] = useState(true);
  const [icons, setIcons] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [custom, setCustom] = useState<SelectOption[]>(DEMO_OPTIONS);
  const [newLabel, setNewLabel] = useState("");
  const [inspect, setInspect] = useState(false);
  const [hot, setHot] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState<SelectOption | null>(null);

  const bgName = nameOf(bgPick);
  const bgClass = bgTransparent ? "bg-transparent" : `bg-${bgName}`;
  const panelName = nameOf(panelPick);
  const panelBgClass = panelTransparent ? "bg-transparent" : `bg-${panelName}`;
  const effectiveText =
    textClass === "auto"
      ? bgTransparent
        ? "text-foreground"
        : autoText(bgPick)
      : textClass;
  const effectivePanelText =
    panelTextClass === "auto"
      ? panelTransparent
        ? "text-foreground"
        : autoText(panelPick)
      : panelTextClass;

  const items = useMemo(
    () => (icons ? custom : stripIcons(custom)),
    [custom, icons],
  );
  const selectedValue = custom.some((o) => o.value === value)
    ? value
    : (custom[0]?.value ?? "");

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
    setLabel("Раздел");
    setHint("Можно изменить позже");
    setPlaceholder("Выберите раздел");
    setHeight("44");
    setWidth("320");
    setFullWidth(false);
    setFont("16");
    setPad("12");
    setRadius("12");
    setShadow("1");
    setBorder("1");
    setBorderColor("default");
    setBgPick({ family: "surface", step: 500 });
    setBgTransparent(false);
    setTextClass("auto");
    setPanelShadow("5");
    setPanelBorder("1");
    setPanelBorderColor("default");
    setPanelPick({ family: "surface", step: 500 });
    setPanelTransparent(false);
    setPanelTextClass("auto");
    setPanelRadius("16");
    setAccent("secondary");
    setOptionGap("4");
    setOptionRadius("8");
    setOptionWidth("320");
    setOptionFull(true);
    setOptionPadX("10");
    setOptionPadY("9");
    setAnimation("scale");
    setPlacement("auto");
    setAlign("start");
    setOffset("6");
    setSearchable(true);
    setIcons(true);
    setDisabled(false);
    setError(false);
    setCustom(DEMO_OPTIONS);
    setNewLabel("");
    setActionNote(null);
  };

  const addCustom = () => {
    const title = newLabel.trim();
    if (!title) return;
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9а-я-]+/g, "-")
        .replace(/^-|-$/g, "") || "item";
    setCustom((list) => [
      ...list,
      {
        value: `${slug}-${Date.now()}`,
        label: title,
        hint: "свой вариант",
        icon: <Sparkles width={16} height={16} />,
      },
    ]);
    setNewLabel("");
  };

  const updateCustom = (value: string, patch: Partial<SelectOption>) =>
    setCustom((list) =>
      list.map((o) => (o.value === value ? { ...o, ...patch } : o)),
    );

  const moveCustom = (index: number, step: -1 | 1) =>
    setCustom((list) => {
      const to = index + step;
      if (to < 0 || to >= list.length) return list;
      const next = [...list];
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });

  const setKind = (value: string, kind: Kind) =>
    updateCustom(
      value,
      kind === "link"
        ? { href: "/docs/releases", action: undefined }
        : kind === "button"
          ? { href: undefined, action: "button" }
          : { href: undefined, action: undefined },
    );

  const iconImports = [
    ...new Set(
      custom
        .map((o) => iconNameOf(o, icons))
        .filter((n): n is string => Boolean(n)),
    ),
  ];
  const hasAction = custom.some((o) => o.href || o.action === "button");
  const first = custom[0]?.value ?? "";
  const itemLines = custom.map((o) => {
    const parts = [
      `value: ${JSON.stringify(o.value)}`,
      `label: ${JSON.stringify(o.label)}`,
    ];
    if (o.hint) parts.push(`hint: ${JSON.stringify(o.hint)}`);
    if (o.badge) parts.push(`badge: ${JSON.stringify(o.badge)}`);
    if (o.href) parts.push(`href: ${JSON.stringify(o.href)}`);
    if (o.action === "button") parts.push('action: "button"');
    if (o.disabled) parts.push("disabled: true");
    const icon = iconNameOf(o, icons);
    if (icon) parts.push(`icon: <${icon} />`);
    return `  {\n    ${parts.join(",\n    ")},\n  },`;
  });

  const fieldParts = [
    join(
      `h-${height}`,
      fullWidth ? "w-full" : `w-${width}`,
      `px-${pad}`,
      RADIUS_CLASS[radius],
    ),
    join(
      BORDER_WIDTH_CLASS[border],
      BORDER_COLOR_CLASS[borderColor],
      SHADOW_CLASS[shadow],
      bgClass,
      effectiveText,
    ),
  ];
  const panelClasses = join(
    RADIUS_CLASS[panelRadius],
    BORDER_WIDTH_CLASS[panelBorder],
    BORDER_COLOR_CLASS[panelBorderColor],
    SHADOW_CLASS[panelShadow],
    panelBgClass,
    effectivePanelText,
  );
  const optionClasses = join(
    optionFull ? "w-full" : `w-${optionWidth}`,
    `px-${optionPadX}`,
    `py-${optionPadY}`,
    RADIUS_CLASS[optionRadius],
    "font-14",
  );
  const codeProps = [
    label && `label=${JSON.stringify(label)}`,
    "items={items}",
    first && `defaultValue=${JSON.stringify(first)}`,
    placeholder && `placeholder=${JSON.stringify(placeholder)}`,
    hint && `hint=${JSON.stringify(hint)}`,
    searchable && "searchable",
    disabled && "disabled",
    error && 'error="Выберите вариант"',
    "triggerClassName={field}",
    "panelClassName={panel}",
    "optionClassName={option}",
    `optionSelectedClassName="${ACCENT_CLASS[accent].selected}"`,
    `badgeClassName="${ACCENT_CLASS[accent].badge}"`,
    `optionGap={${optionGap}}`,
    animation !== "none" && `animation="${animation}"`,
    placement !== "auto" && `placement="${placement}"`,
    align !== "start" && `align="${align}"`,
    offset !== "6" && `offset={${offset}}`,
  ].filter(Boolean);

  const code = `${
    hasAction ? '"use client";\n\n' : ""
  }import { Select } from "@/components/ui/Select";
${iconImports.map((n) => `import { ${n} } from "@boxicons/react/${n}";`).join("\n")}
${hasAction ? 'import { useRouter } from "next/navigation";\n' : ""}
const items = [
${itemLines.join("\n")}
];

${classConst("field", fieldParts)}
${classConst("panel", [panelClasses])}
${classConst("option", [optionClasses])}

export default function Page() {
${hasAction ? "  const router = useRouter();\n\n" : ""}  return (
    <Select
      ${codeProps.join("\n      ")}${
        hasAction
          ? `\n      onAction={(option) => {
        if (option.href) router.push(option.href);
        if (option.action === "button") console.log("Кнопка", option.label);
      }}`
          : ""
      }
    />
  );
}`;

  const previewTriggerClassName = join(
    BORDER_WIDTH_CLASS[border],
    BORDER_COLOR_CLASS[borderColor],
    SHADOW_CLASS[shadow],
    effectiveText,
  );
  const previewTriggerStyle = {
    width: fullWidth ? "100%" : Number(width),
    height: Number(height),
    fontSize: Number(font),
    paddingLeft: Number(pad),
    paddingRight: Number(pad),
    borderRadius: Number(radius),
    backgroundColor: bgTransparent ? "transparent" : `var(--${bgName})`,
  };
  const previewPanelClassName = join(
    BORDER_WIDTH_CLASS[panelBorder],
    BORDER_COLOR_CLASS[panelBorderColor],
    SHADOW_CLASS[panelShadow],
    effectivePanelText,
  );
  const previewPanelStyle = {
    borderRadius: Number(panelRadius),
    backgroundColor: panelTransparent ? "transparent" : `var(--${panelName})`,
  };
  const previewOptionStyle = {
    ...(optionFull ? {} : { width: Number(optionWidth) }),
    paddingLeft: Number(optionPadX),
    paddingRight: Number(optionPadX),
    paddingTop: Number(optionPadY),
    paddingBottom: Number(optionPadY),
    borderRadius: Number(optionRadius),
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
                `${optionFull ? "100%" : optionWidth} пункт`,
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
              placeholder="Выберите"
            />
          </div>

          <div id="settings-field" className={groupClass("field")}>
            <span className={SECTION}>Размер и поле</span>
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
              <Switch checked={fullWidth} onChange={setFullWidth}>
                Поле на всю ширину
              </Switch>
            </div>
            <div className="grid sm:grid-cols-2 gap-12">
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
              <Field label="Цвет текста">
                <Seg
                  value={textClass}
                  options={TEXT_COLORS}
                  onChange={setTextClass}
                />
              </Field>
            </div>
            <ColorPicker label="Фон поля" value={bgPick} onChange={setBgPick} />
            <Switch checked={bgTransparent} onChange={setBgTransparent}>
              Прозрачный фон поля
            </Switch>
          </div>

          <div id="settings-panel" className={groupClass("panel")}>
            <span className={SECTION}>Список</span>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Тень">
                <Seg
                  value={panelShadow}
                  options={SHADOWS}
                  onChange={setPanelShadow}
                />
              </Field>
              <Field label="Рамка">
                <Seg
                  value={panelBorder}
                  options={BORDERS}
                  onChange={setPanelBorder}
                />
              </Field>
              <Field label="Цвет рамки">
                <Seg
                  value={panelBorderColor}
                  options={BORDER_COLORS}
                  onChange={setPanelBorderColor}
                />
              </Field>
              <Field label="Цвет текста">
                <Seg
                  value={panelTextClass}
                  options={TEXT_COLORS}
                  onChange={setPanelTextClass}
                />
              </Field>
              <Field
                label="Радиус блока"
                note={panelRadius === "999" ? "круг" : `${panelRadius}px`}
              >
                <Range
                  label="Радиус блока"
                  values={RADII}
                  value={panelRadius}
                  onChange={setPanelRadius}
                />
              </Field>
            </div>
            <ColorPicker
              label="Фон списка"
              value={panelPick}
              onChange={setPanelPick}
            />
            <Switch checked={panelTransparent} onChange={setPanelTransparent}>
              Прозрачный фон списка
            </Switch>
          </div>

          <div id="settings-options" className={groupClass("options")}>
            <span className={SECTION}>Пункты</span>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Цвет выбора">
                <Seg value={accent} options={ACCENTS} onChange={setAccent} />
              </Field>
              <Field label="Зазор между" note={`${optionGap}px`}>
                <Range
                  label="Зазор между пунктами"
                  values={GAPS}
                  value={optionGap}
                  onChange={setOptionGap}
                />
              </Field>
              <Field label="Радиус пункта" note={`${optionRadius}px`}>
                <Range
                  label="Радиус пункта"
                  values={RADII}
                  value={optionRadius}
                  onChange={setOptionRadius}
                />
              </Field>
              <Field
                label="Ширина пункта"
                note={optionFull ? "100%" : `${optionWidth}px`}
              >
                <Range
                  label="Ширина пункта"
                  values={WIDTHS}
                  value={optionWidth}
                  onChange={setOptionWidth}
                />
              </Field>
              <Switch checked={optionFull} onChange={setOptionFull}>
                Пункт на всю ширину
              </Switch>
              <Field label="Отступ X пункта" note={`${optionPadX}px`}>
                <Range
                  label="Отступ X пункта"
                  values={OPTION_PADS}
                  value={optionPadX}
                  onChange={setOptionPadX}
                />
              </Field>
              <Field label="Отступ Y пункта" note={`${optionPadY}px`}>
                <Range
                  label="Отступ Y пункта"
                  values={OPTION_PADS}
                  value={optionPadY}
                  onChange={setOptionPadY}
                />
              </Field>
            </div>

            <span className={SECTION}>Свои варианты</span>
            <p className="font-12 text-foreground-muted">
              Только эти пункты попадают в пример и код. У каждого можно выбрать
              действие: пункт, ссылка или кнопка.
            </p>
            <div className="flex flex-col gap-8">
              {custom.map((o, i) => {
                const kind = kindOf(o);
                return (
                  <div
                    key={o.value}
                    className="flex flex-col gap-6 p-8 br-md border bg-surface"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        value={o.label}
                        onChange={(e) =>
                          updateCustom(o.value, { label: e.target.value })
                        }
                        aria-label="Название варианта"
                        className={ROW_INPUT}
                      />
                      <button
                        type="button"
                        onClick={() => moveCustom(i, -1)}
                        disabled={i === 0}
                        aria-label={`Поднять ${o.label}`}
                        className="shrink-0 size-30 br-md border grid place-items-center text-foreground-muted transition-colors hover:text-foreground disabled:opacity-40"
                      >
                        <ArrowUp width={14} height={14} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCustom(i, 1)}
                        disabled={i === custom.length - 1}
                        aria-label={`Опустить ${o.label}`}
                        className="shrink-0 size-30 br-md border grid place-items-center text-foreground-muted transition-colors hover:text-foreground disabled:opacity-40"
                      >
                        <ArrowDown width={14} height={14} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCustom((list) =>
                            list.filter((item) => item.value !== o.value),
                          )
                        }
                        aria-label={`Удалить ${o.label}`}
                        className="shrink-0 size-30 br-md grid place-items-center text-foreground-muted transition-colors hover:bg-foreground/8 hover:text-foreground"
                      >
                        <X width={14} height={14} aria-hidden="true" />
                      </button>
                    </div>
                    <input
                      value={o.hint ?? ""}
                      onChange={(e) =>
                        updateCustom(o.value, { hint: e.target.value })
                      }
                      placeholder="Подсказка пункта"
                      aria-label={`Подсказка: ${o.label}`}
                      className={TEXT_INPUT}
                    />
                    <div className="grid sm:grid-cols-2 gap-6 items-end">
                      <label className="flex flex-col gap-4">
                        <span className="font-11 font-w-600 text-foreground-muted">
                          Действие
                        </span>
                        <select
                          value={kind}
                          onChange={(e) =>
                            setKind(o.value, e.target.value as Kind)
                          }
                          aria-label={`Действие: ${o.label}`}
                          className="h-36 px-8 br-md border bg-surface font-16"
                        >
                          {KINDS.map((k) => (
                            <option key={k.id} value={k.id}>
                              {k.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      {kind === "link" && (
                        <label className="flex flex-col gap-4">
                          <span className="font-11 font-w-600 text-foreground-muted">
                            Адрес
                          </span>
                          <input
                            value={o.href ?? ""}
                            onChange={(e) =>
                              updateCustom(o.value, { href: e.target.value })
                            }
                            placeholder="/docs/releases"
                            aria-label={`Адрес: ${o.label}`}
                            className={TEXT_INPUT}
                          />
                        </label>
                      )}
                      {kind === "button" && (
                        <p className="font-12 text-foreground-muted pb-8">
                          Вызовет <code className="font-mono">onAction</code>,
                          значение не изменится.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-6">
                <input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustom();
                    }
                  }}
                  placeholder="Новый вариант"
                  aria-label="Название нового варианта"
                  className={ROW_INPUT}
                />
                <button
                  type="button"
                  onClick={addCustom}
                  disabled={!newLabel.trim()}
                  aria-label="Добавить вариант"
                  className="shrink-0 size-38 br-md bg-primary text-primary-foreground grid place-items-center transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus width={18} height={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div id="settings-behavior" className={groupClass("behavior")}>
            <span className={SECTION}>Поведение</span>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Анимация">
                <Seg
                  value={animation}
                  options={ANIMATIONS}
                  onChange={setAnimation}
                />
              </Field>
              <Field label="Открывается">
                <Seg
                  value={placement}
                  options={PLACEMENTS}
                  onChange={setPlacement}
                />
              </Field>
              <Field label="Выравнивание">
                <Seg value={align} options={ALIGNS} onChange={setAlign} />
              </Field>
              <Field label="Зазор" note={`${offset}px`}>
                <Range
                  label="Зазор"
                  values={OFFSETS}
                  value={offset}
                  onChange={setOffset}
                />
              </Field>
            </div>
            <div className="flex flex-col gap-12">
              <Switch checked={searchable} onChange={setSearchable}>
                Поиск по списку
              </Switch>
              <Switch checked={icons} onChange={setIcons}>
                Иконки и подсказки
              </Switch>
              <Switch checked={disabled} onChange={setDisabled}>
                Выключено
              </Switch>
              <Switch checked={error} onChange={setError}>
                Ошибка
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
            <Select
              label={label || undefined}
              items={items}
              value={selectedValue}
              onChange={setValue}
              onAction={(option) => {
                if (option.href) router.push(option.href);
                else setActionNote(option);
              }}
              placeholder={placeholder || "Выберите"}
              hint={hint || undefined}
              searchable={searchable}
              disabled={disabled}
              error={error ? "Выберите вариант" : undefined}
              triggerClassName={previewTriggerClassName}
              triggerStyle={previewTriggerStyle}
              panelClassName={previewPanelClassName}
              panelStyle={previewPanelStyle}
              optionStyle={previewOptionStyle}
              optionSelectedClassName={ACCENT_CLASS[accent].selected}
              optionActiveClassName="bg-foreground/6"
              optionDisabledClassName="opacity-55 cursor-not-allowed"
              badgeClassName={ACCENT_CLASS[accent].badge}
              optionGap={Number(optionGap)}
              animation={animation}
              placement={placement}
              align={align}
              offset={Number(offset)}
            />
          </div>
          {actionNote && (
            <div className="mt-12 flex flex-wrap items-center gap-8 p-10 br-lg border bg-surface font-13 text-foreground shadow-1">
              <span className="font-w-600">Кнопка:</span>
              <span className="min-w-0 truncate">{actionNote.label}</span>
              <button
                type="button"
                onClick={() => setActionNote(null)}
                aria-label="Закрыть подсказку"
                className="ml-auto size-26 br-full grid place-items-center text-foreground-muted hover:bg-foreground/8"
              >
                <X width={14} height={14} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      }
      previewClassName="grid place-items-center"
      code={code}
    />
  );
}
