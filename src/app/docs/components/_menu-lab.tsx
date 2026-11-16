"use client";

// Конструктор «Меню»: кнопка, панель, пункты, иконки, горячие клавиши и действия.
// Вид собирается в классы и уходит в page.tsx; компонент только про поведение.

import { Archive } from "@boxicons/react/Archive";
import { Copy } from "@boxicons/react/Copy";
import { Pencil } from "@boxicons/react/Pencil";
import { Trash } from "@boxicons/react/Trash";
import { useState } from "react";
import type { MenuItem } from "@/components/ui/Menu";
import { Menu } from "@/components/ui/Menu";
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
  type Border,
  type BorderColor,
  classConst,
  join,
  RADIUS_CLASS,
  SHADOW_CLASS,
  type Shadow,
} from "./_style-maps";

const HEIGHTS = ["32", "36", "40", "44", "48", "52"];
const WIDTHS = ["120", "160", "200", "240", "280"];
const PANEL_WIDTHS = ["160", "200", "240", "280", "320"];
const FONTS = ["12", "13", "14", "15", "16"];
const PADS = ["6", "8", "10", "12", "14", "16"];
const PAD_YS = ["4", "6", "8", "10", "12"];
const RADII = ["0", "6", "8", "10", "12", "16", "999"];
const PANEL_PADS = ["0", "2", "4", "6", "8", "12"];
const OFFSETS = ["0", "4", "6", "8", "12", "16"];
const ICON_SIZES = ["14", "16", "18", "20", "24"];
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
const ACCENTS = [
  { id: "secondary", title: "Фиолет" },
  { id: "accent", title: "Лайм" },
  { id: "primary", title: "Главный" },
  { id: "danger", title: "Красный" },
  { id: "success", title: "Зелёный" },
] as const;
const TEXT_COLORS = [
  { id: "auto", title: "Авто" },
  { id: "text-foreground", title: "Основной" },
  { id: "text-foreground-inverse", title: "Обратный" },
  { id: "text-white", title: "Белый" },
] as const;
const ICON_COLORS = [
  { id: "text-foreground-subtle", title: "Тихая" },
  { id: "text-foreground-muted", title: "Обычная" },
  { id: "text-secondary", title: "Фиолет" },
  { id: "text-accent", title: "Лайм" },
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
const CODE_STYLES = [
  { id: "const", title: "Константы" },
  { id: "jsx", title: "В JSX" },
  { id: "tsx", title: "TSX" },
] as const;

type Accent = (typeof ACCENTS)[number]["id"];
type IconColor = (typeof ICON_COLORS)[number]["id"];
type Animation = (typeof ANIMATIONS)[number]["id"];
type Placement = (typeof PLACEMENTS)[number]["id"];
type Align = (typeof ALIGNS)[number]["id"];
type CodeStyle = (typeof CODE_STYLES)[number]["id"];

const ICON_SIZE_CLASS: Record<string, string> = {
  "14": "size-14",
  "16": "size-16",
  "18": "size-18",
  "20": "size-20",
  "24": "size-24",
};

const ICON_NODE = {
  pencil: <Pencil width={16} height={16} />,
  copy: <Copy width={16} height={16} />,
  archive: <Archive width={16} height={16} />,
  trash: <Trash width={16} height={16} />,
};
const ICON_CODE = {
  pencil: "<Pencil />",
  copy: "<Copy />",
  archive: "<Archive />",
  trash: "<Trash />",
};
const ICON_IMPORT = {
  pencil: 'import { Pencil } from "@boxicons/react/Pencil";\n',
  copy: 'import { Copy } from "@boxicons/react/Copy";\n',
  archive: 'import { Archive } from "@boxicons/react/Archive";\n',
  trash: 'import { Trash } from "@boxicons/react/Trash";\n',
};

const SECTION = "font-11 font-w-700 uppercase letter-s-6 text-foreground-muted";
const TEXT_INPUT =
  "w-full h-36 px-10 br-md border bg-surface font-16 outline-none placeholder:text-foreground-muted focus:border-secondary";

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={TEXT_INPUT}
      />
    </Field>
  );
}

export function MenuLab() {
  const [trigger, setTrigger] = useState("Действия");
  const [height, setHeight] = useState("40");
  const [width, setWidth] = useState("200");
  const [fullWidth, setFullWidth] = useState(false);
  const [font, setFont] = useState("13");
  const [padX, setPadX] = useState("14");
  const [radius, setRadius] = useState("12");
  const [shadow, setShadow] = useState<Shadow>("1");
  const [border, setBorder] = useState<Border>("1");
  const [borderColor, setBorderColor] = useState<BorderColor>("default");
  const [triggerPick, setTriggerPick] = useState<Pick>({
    family: "surface",
    step: 500,
  });
  const [triggerTransparent, setTriggerTransparent] = useState(false);
  const [triggerText, setTriggerText] = useState("auto");
  const [panelWidth, setPanelWidth] = useState("240");
  const [panelPad, setPanelPad] = useState("4");
  const [panelRadius, setPanelRadius] = useState("16");
  const [panelShadow, setPanelShadow] = useState<Shadow>("5");
  const [panelBorder, setPanelBorder] = useState<Border>("1");
  const [panelBorderColor, setPanelBorderColor] =
    useState<BorderColor>("default");
  const [panelPick, setPanelPick] = useState<Pick>({
    family: "surface",
    step: 500,
  });
  const [panelTransparent, setPanelTransparent] = useState(false);
  const [panelText, setPanelText] = useState("auto");
  const [accent, setAccent] = useState<Accent>("secondary");
  const [itemPadX, setItemPadX] = useState("10");
  const [itemPadY, setItemPadY] = useState("8");
  const [itemRadius, setItemRadius] = useState("8");
  const [iconSize, setIconSize] = useState("18");
  const [iconColor, setIconColor] = useState<IconColor>(
    "text-foreground-subtle",
  );
  const [icons, setIcons] = useState(true);
  const [shortcuts, setShortcuts] = useState(true);
  const [danger, setDanger] = useState(true);
  const [disabledItem, setDisabledItem] = useState(true);
  const [separator, setSeparator] = useState(true);
  const [chevron, setChevron] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [animation, setAnimation] = useState<Animation>("scale");
  const [placement, setPlacement] = useState<Placement>("auto");
  const [align, setAlign] = useState<Align>("start");
  const [offset, setOffset] = useState("6");
  const [codeStyle, setCodeStyle] = useState<CodeStyle>("const");

  const triggerName = nameOf(triggerPick);
  const triggerBg = triggerTransparent ? "bg-transparent" : `bg-${triggerName}`;
  const triggerTextClass =
    triggerText === "auto"
      ? triggerTransparent
        ? "text-foreground"
        : autoText(triggerPick)
      : triggerText;
  const panelName = nameOf(panelPick);
  const panelBg = panelTransparent ? "bg-transparent" : `bg-${panelName}`;
  const panelTextClass =
    panelText === "auto"
      ? panelTransparent
        ? "text-foreground"
        : autoText(panelPick)
      : panelText;
  const activeClass = ACCENT_CLASS[accent].selected;
  const iconClasses = join(ICON_SIZE_CLASS[iconSize], iconColor);

  const items: MenuItem[] = [
    {
      id: "edit",
      label: "Изменить",
      icon: icons ? ICON_NODE.pencil : undefined,
      shortcut: shortcuts ? "⌘E" : undefined,
    },
    {
      id: "copy",
      label: "Скопировать",
      icon: icons ? ICON_NODE.copy : undefined,
      shortcut: shortcuts ? "⌘C" : undefined,
    },
    {
      id: "archive",
      label: "В архив",
      icon: icons ? ICON_NODE.archive : undefined,
      disabled: disabledItem,
    },
    ...(separator ? [{ id: "separator", type: "separator" as const }] : []),
    {
      id: "delete",
      label: "Удалить",
      icon: icons ? ICON_NODE.trash : undefined,
      danger,
      shortcut: shortcuts ? "⌫" : undefined,
    },
  ];

  const triggerClasses = join(
    `h-${height}`,
    fullWidth ? "w-full" : `w-${width}`,
    `px-${padX}`,
    RADIUS_CLASS[radius],
    BORDER_WIDTH_CLASS[border],
    BORDER_COLOR_CLASS[borderColor],
    SHADOW_CLASS[shadow],
    triggerBg,
    triggerTextClass,
    `font-${font}`,
  );
  const panelClasses = join(
    `w-${panelWidth}`,
    "max-w-[calc(100vw-16px)]",
    `p-${panelPad}`,
    RADIUS_CLASS[panelRadius],
    BORDER_WIDTH_CLASS[panelBorder],
    BORDER_COLOR_CLASS[panelBorderColor],
    SHADOW_CLASS[panelShadow],
    panelBg,
    panelTextClass,
  );
  const itemClasses = join(
    `px-${itemPadX}`,
    `py-${itemPadY}`,
    RADIUS_CLASS[itemRadius],
    "font-13",
  );

  const itemLines = items.map((item) => {
    if (item.type === "separator")
      return `  { id: "separator", type: "separator" },`;
    const iconKey = (
      {
        edit: "pencil",
        copy: "copy",
        archive: "archive",
        delete: "trash",
      } as const
    )[item.id as "edit" | "copy" | "archive" | "delete"];
    const parts = [
      `id: ${JSON.stringify(item.id)}`,
      `label: ${JSON.stringify(item.label)}`,
    ];
    if (item.icon && iconKey) parts.push(`icon: ${ICON_CODE[iconKey]}`);
    if (item.shortcut) parts.push(`shortcut: ${JSON.stringify(item.shortcut)}`);
    if (item.danger) parts.push("danger: true");
    if (item.disabled) parts.push("disabled: true");
    return `  {\n    ${parts.join(",\n    ")},\n  },`;
  });

  const iconImports = icons
    ? [
        ICON_IMPORT.pencil,
        ICON_IMPORT.copy,
        ICON_IMPORT.archive,
        ICON_IMPORT.trash,
      ].join("")
    : "";

  const codeProps = [
    `trigger=${JSON.stringify(trigger)}`,
    `label=${JSON.stringify(trigger || "Меню")}`,
    "items={items}",
    "onAction={(item) => console.log(item.label)}",
    `triggerClassName="${triggerClasses}"`,
    `panelClassName="${panelClasses}"`,
    `itemClassName="${itemClasses}"`,
    `itemActiveClassName="${activeClass}"`,
    'itemDangerClassName="text-danger"',
    `iconClassName="${iconClasses}"`,
    `animation="${animation}"`,
    placement !== "auto" && `placement="${placement}"`,
    align !== "start" && `align="${align}"`,
    offset !== "6" && `offset={${offset}}`,
    !chevron && "chevron={false}",
    disabled && "disabled",
  ].filter((p): p is string => Boolean(p));

  const constMode = codeStyle === "const";
  const code = constMode
    ? `${iconImports}import { Menu } from "@/components/ui/Menu";
import type { MenuItem } from "@/components/ui/Menu";

const items: MenuItem[] = [
${itemLines.join("\n")}
];

${classConst("trigger", [triggerClasses])}
${classConst("panel", [panelClasses])}
${classConst("item", [itemClasses])}

export default function Page() {
  return (
    <Menu
      ${codeProps.join("\n      ")}
    />
  );
}`
    : codeStyle === "jsx"
      ? `${iconImports}import { Menu } from "@/components/ui/Menu";
import type { MenuItem } from "@/components/ui/Menu";

const items: MenuItem[] = [
${itemLines.join("\n")}
];

export default function Page() {
  return (
    <Menu
      ${codeProps
        .map((p) =>
          p.startsWith("triggerClassName=")
            ? "triggerClassName={\n        " +
              JSON.stringify(triggerClasses) +
              "\n      }"
            : p.startsWith("panelClassName=")
              ? "panelClassName={\n        " +
                JSON.stringify(panelClasses) +
                "\n      }"
              : p.startsWith("itemClassName=")
                ? `itemClassName={${JSON.stringify(itemClasses)}}`
                : p,
        )
        .join("\n      ")}
    />
  );
}`
      : `<div className="relative inline-flex">
  <button
    type="button"
    aria-haspopup="menu"
    aria-expanded="true"
    className="${triggerClasses}"
  >
    ${trigger || "Действия"}
    ${chevron ? '<span className="text-foreground-muted">⌄</span>' : ""}
  </button>
  <div
    role="menu"
    className="absolute left-0 top-[calc(100%+6px)] ${panelClasses}"
  >
${items
  .map((item) => {
    if (item.type === "separator") {
      return '    <div role="separator" className="h-px my-4 bg-foreground/10" />';
    }
    return `    <button
      type="button"
      role="menuitem"
      className="${itemClasses}${item.danger ? " text-danger" : ""}${item.disabled ? " opacity-50" : ""}"
      ${item.disabled ? "disabled" : ""}
    >
      ${item.label}${
        item.shortcut
          ? ` <span className="ml-auto font-11 font-mono text-foreground-subtle">${item.shortcut}</span>`
          : ""
      }
    </button>`;
  })
  .join("\n")}
  </div>
</div>`;

  const previewTriggerClass = join(
    BORDER_WIDTH_CLASS[border],
    BORDER_COLOR_CLASS[borderColor],
    SHADOW_CLASS[shadow],
    triggerTextClass,
  );
  const previewTriggerStyle = {
    height: Number(height),
    width: fullWidth ? "100%" : Number(width),
    fontSize: Number(font),
    paddingLeft: Number(padX),
    paddingRight: Number(padX),
    borderRadius: Number(radius),
    backgroundColor: triggerTransparent
      ? "transparent"
      : `var(--${triggerName})`,
  };
  const previewPanelClass = join(
    BORDER_WIDTH_CLASS[panelBorder],
    BORDER_COLOR_CLASS[panelBorderColor],
    SHADOW_CLASS[panelShadow],
    panelTextClass,
  );
  const previewPanelStyle = {
    width: Number(panelWidth),
    maxWidth: "calc(100vw - 16px)",
    padding: Number(panelPad),
    borderRadius: Number(panelRadius),
    backgroundColor: panelTransparent ? "transparent" : `var(--${panelName})`,
  };
  const previewItemStyle = {
    paddingLeft: Number(itemPadX),
    paddingRight: Number(itemPadX),
    paddingTop: Number(itemPadY),
    paddingBottom: Number(itemPadY),
    borderRadius: Number(itemRadius),
  };

  const reset = () => {
    setTrigger("Действия");
    setHeight("40");
    setWidth("200");
    setFullWidth(false);
    setFont("13");
    setPadX("14");
    setRadius("12");
    setShadow("1");
    setBorder("1");
    setBorderColor("default");
    setTriggerPick({ family: "surface", step: 500 });
    setTriggerTransparent(false);
    setTriggerText("auto");
    setPanelWidth("240");
    setPanelPad("4");
    setPanelRadius("16");
    setPanelShadow("5");
    setPanelBorder("1");
    setPanelBorderColor("default");
    setPanelPick({ family: "surface", step: 500 });
    setPanelTransparent(false);
    setPanelText("auto");
    setAccent("secondary");
    setItemPadX("10");
    setItemPadY("8");
    setItemRadius("8");
    setIconSize("18");
    setIconColor("text-foreground-subtle");
    setIcons(true);
    setShortcuts(true);
    setDanger(true);
    setDisabledItem(true);
    setSeparator(true);
    setChevron(true);
    setDisabled(false);
    setAnimation("scale");
    setPlacement("auto");
    setAlign("start");
    setOffset("6");
    setCodeStyle("const");
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
                `панель ${panelWidth}`,
                `r ${radius}`,
                `sh ${shadow}`,
              ].map((chip) => (
                <span
                  key={chip}
                  className="px-8 py-3 br-full bg-foreground/5 font-11 font-mono text-foreground-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
            <Field label="Код подключения">
              <Seg
                value={codeStyle}
                options={CODE_STYLES}
                onChange={setCodeStyle}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-12 p-12 br-lg border bg-surface-muted/30">
            <span className={SECTION}>Кнопка</span>
            <TextField
              label="Текст кнопки"
              value={trigger}
              onChange={setTrigger}
            />
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
              <Field label="Отступ по X" note={`${padX}px`}>
                <Range
                  label="Отступ по X"
                  values={PADS}
                  value={padX}
                  onChange={setPadX}
                />
              </Field>
              <Field
                label="Радиус"
                note={radius === "999" ? "круг" : `${radius}px`}
              >
                <Range
                  label="Радиус"
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
            </div>
            <Switch checked={fullWidth} onChange={setFullWidth}>
              Кнопка на всю ширину
            </Switch>
            <ColorPicker
              label="Фон кнопки"
              value={triggerPick}
              onChange={setTriggerPick}
            />
            <Switch
              checked={triggerTransparent}
              onChange={setTriggerTransparent}
            >
              Прозрачный фон кнопки
            </Switch>
            <Field label="Цвет текста кнопки">
              <Seg
                value={triggerText}
                options={TEXT_COLORS}
                onChange={setTriggerText}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-12 p-12 br-lg border bg-surface-muted/30">
            <span className={SECTION}>Список</span>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Ширина" note={`${panelWidth}px`}>
                <Range
                  label="Ширина"
                  values={PANEL_WIDTHS}
                  value={panelWidth}
                  onChange={setPanelWidth}
                />
              </Field>
              <Field label="Отступ" note={`${panelPad}px`}>
                <Range
                  label="Отступ"
                  values={PANEL_PADS}
                  value={panelPad}
                  onChange={setPanelPad}
                />
              </Field>
              <Field label="Радиус" note={`${panelRadius}px`}>
                <Range
                  label="Радиус"
                  values={RADII}
                  value={panelRadius}
                  onChange={setPanelRadius}
                />
              </Field>
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
            </div>
            <ColorPicker
              label="Фон списка"
              value={panelPick}
              onChange={setPanelPick}
            />
            <Switch checked={panelTransparent} onChange={setPanelTransparent}>
              Прозрачный фон списка
            </Switch>
            <Field label="Цвет текста списка">
              <Seg
                value={panelText}
                options={TEXT_COLORS}
                onChange={setPanelText}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-12 p-12 br-lg border bg-surface-muted/30">
            <span className={SECTION}>Пункты</span>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Акцент">
                <Seg value={accent} options={ACCENTS} onChange={setAccent} />
              </Field>
              <Field label="Отступ по X" note={`${itemPadX}px`}>
                <Range
                  label="Отступ по X"
                  values={PADS}
                  value={itemPadX}
                  onChange={setItemPadX}
                />
              </Field>
              <Field label="Отступ по Y" note={`${itemPadY}px`}>
                <Range
                  label="Отступ по Y"
                  values={PAD_YS}
                  value={itemPadY}
                  onChange={setItemPadY}
                />
              </Field>
              <Field label="Радиус" note={`${itemRadius}px`}>
                <Range
                  label="Радиус"
                  values={RADII}
                  value={itemRadius}
                  onChange={setItemRadius}
                />
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
            </div>
            <Switch checked={icons} onChange={setIcons}>
              Иконки
            </Switch>
            <Switch checked={shortcuts} onChange={setShortcuts}>
              Горячие клавиши
            </Switch>
            <Switch checked={danger} onChange={setDanger}>
              Опасный пункт
            </Switch>
            <Switch checked={disabledItem} onChange={setDisabledItem}>
              Выключенный пункт
            </Switch>
            <Switch checked={separator} onChange={setSeparator}>
              Разделитель
            </Switch>
          </div>

          <div className="flex flex-col gap-12 p-12 br-lg border bg-surface-muted/30">
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
            <Switch checked={chevron} onChange={setChevron}>
              Стрелка у кнопки
            </Switch>
            <Switch checked={disabled} onChange={setDisabled}>
              Выключить меню
            </Switch>
          </div>
        </>
      }
      preview={
        <div className="w-full max-w-360 min-w-0">
          <Menu
            trigger={trigger || "Действия"}
            label={trigger || "Меню"}
            items={items}
            triggerClassName={previewTriggerClass}
            triggerStyle={previewTriggerStyle}
            panelClassName={previewPanelClass}
            panelStyle={previewPanelStyle}
            itemClassName="font-13"
            itemStyle={previewItemStyle}
            itemActiveClassName={activeClass}
            itemDangerClassName="text-danger"
            iconClassName={iconClasses}
            animation={animation}
            placement={placement}
            align={align}
            offset={Number(offset)}
            chevron={chevron}
            disabled={disabled}
            onAction={() => {}}
          />
        </div>
      }
      previewClassName="grid place-items-center"
      code={code}
    />
  );
}
