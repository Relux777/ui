"use client";

// Конструктор «Навигации»: ряд или колонка, активный пункт, иконки и метки.
// Вид собирается в классы и уходит в page.tsx — компонент только про семантику.

import { BookOpen } from "@boxicons/react/BookOpen";
import { Grid } from "@boxicons/react/Grid";
import { Home } from "@boxicons/react/Home";
import { useState } from "react";
import type { NavigationItem } from "@/components/ui/Navigation";
import { Navigation } from "@/components/ui/Navigation";
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

const ORIENTATIONS = [
  { id: "horizontal", title: "В ряд" },
  { id: "vertical", title: "Колонкой" },
] as const;
const FONTS = ["12", "13", "14", "15", "16"];
const PADS = ["4", "6", "8", "10", "12", "14", "16"];
const PAD_YS = ["4", "6", "8", "10", "12"];
const GAPS = ["0", "2", "4", "6", "8", "10", "12"];
const RADII = ["0", "6", "8", "10", "12", "16", "999"];
const NAV_PADS = ["0", "4", "6", "8", "12", "16"];
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
  { id: "text-foreground-muted", title: "Тихий" },
  { id: "text-foreground-inverse", title: "Обратный" },
  { id: "text-white", title: "Белый" },
] as const;
const ICON_COLORS = [
  { id: "text-foreground-subtle", title: "Тихая" },
  { id: "text-foreground-muted", title: "Обычная" },
  { id: "text-secondary", title: "Фиолет" },
  { id: "text-accent", title: "Лайм" },
] as const;
const ACTIVE_ITEMS = [
  { id: "/", title: "Главная" },
  { id: "/docs/components", title: "Компоненты" },
  { id: "/blog", title: "Блог" },
] as const;
const CODE_STYLES = [
  { id: "const", title: "Константы" },
  { id: "tsx", title: "TSX" },
] as const;

type Orientation = (typeof ORIENTATIONS)[number]["id"];
type Accent = (typeof ACCENTS)[number]["id"];
type IconColor = (typeof ICON_COLORS)[number]["id"];
type ActiveHref = (typeof ACTIVE_ITEMS)[number]["id"];
type CodeStyle = (typeof CODE_STYLES)[number]["id"];

const ICON_SIZE_CLASS: Record<string, string> = {
  "14": "size-14",
  "16": "size-16",
  "18": "size-18",
  "20": "size-20",
  "24": "size-24",
};

const ICON_NODE = {
  home: <Home width={18} height={18} />,
  grid: <Grid width={18} height={18} />,
  book: <BookOpen width={18} height={18} />,
};
const ICON_CODE = {
  home: "<Home />",
  grid: "<Grid />",
  book: "<BookOpen />",
};
const ICON_IMPORT = {
  home: 'import { Home } from "@boxicons/react/Home";\n',
  grid: 'import { Grid } from "@boxicons/react/Grid";\n',
  book: 'import { BookOpen } from "@boxicons/react/BookOpen";\n',
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

export function NavigationLab() {
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [width, setWidth] = useState("480");
  const [fullWidth, setFullWidth] = useState(false);
  const [font, setFont] = useState("13");
  const [padX, setPadX] = useState("12");
  const [padY, setPadY] = useState("8");
  const [gap, setGap] = useState("4");
  const [navPad, setNavPad] = useState("0");
  const [radius, setRadius] = useState("12");
  const [shadow, setShadow] = useState<Shadow>("none");
  const [border, setBorder] = useState<Border>("none");
  const [borderColor, setBorderColor] = useState<BorderColor>("default");
  const [bgPick, setBgPick] = useState<Pick>({ family: "surface", step: 500 });
  const [bgTransparent, setBgTransparent] = useState(true);
  const [textClass, setTextClass] = useState("auto");
  const [accent, setAccent] = useState<Accent>("secondary");
  const [activeHref, setActiveHref] = useState<ActiveHref>("/docs/components");
  const [icons, setIcons] = useState(true);
  const [badges, setBadges] = useState(true);
  const [iconSize, setIconSize] = useState("18");
  const [iconColor, setIconColor] = useState<IconColor>(
    "text-foreground-subtle",
  );
  const [labelHome, setLabelHome] = useState("Главная");
  const [labelDocs, setLabelDocs] = useState("Компоненты");
  const [labelBlog, setLabelBlog] = useState("Блог");
  const [codeStyle, setCodeStyle] = useState<CodeStyle>("const");

  const bgName = nameOf(bgPick);
  const bgClass = bgTransparent ? "bg-transparent" : `bg-${bgName}`;
  const effectiveText =
    textClass === "auto"
      ? bgTransparent
        ? "text-foreground"
        : autoText(bgPick)
      : textClass;

  const items: NavigationItem[] = [
    {
      label: labelHome || "Главная",
      href: "/",
      icon: icons ? ICON_NODE.home : undefined,
    },
    {
      label: labelDocs || "Компоненты",
      href: "/docs/components",
      icon: icons ? ICON_NODE.grid : undefined,
      badge: badges ? "24" : undefined,
    },
    {
      label: labelBlog || "Блог",
      href: "/blog",
      icon: icons ? ICON_NODE.book : undefined,
    },
  ];

  const listClasses = join(
    orientation === "vertical" ? "flex-col" : "flex-wrap items-center",
    `gap-${gap}`,
  );
  const itemClasses = join(
    `px-${padX}`,
    `py-${padY}`,
    RADIUS_CLASS[radius],
    `font-${font}`,
    BORDER_WIDTH_CLASS[border],
    BORDER_COLOR_CLASS[borderColor],
    SHADOW_CLASS[shadow],
    "text-foreground-muted hover:bg-foreground/5 hover:text-foreground",
  );
  const navClasses = join(`p-${navPad}`, bgClass, effectiveText);
  const activeClasses = ACCENT_CLASS[accent].selected;
  const badgeClasses = ACCENT_CLASS[accent].badge;
  const iconClasses = join(ICON_SIZE_CLASS[iconSize], iconColor);

  const codeItems = items.map((item, i) => {
    const iconKey = ["home", "grid", "book"][i] as keyof typeof ICON_CODE;
    const parts = [
      `label: ${JSON.stringify(
        typeof item.label === "string" ? item.label : "",
      )}`,
      `href: ${JSON.stringify(item.href)}`,
    ];
    if (icons) parts.push(`icon: ${ICON_CODE[iconKey]}`);
    if (item.badge) parts.push(`badge: ${JSON.stringify(item.badge)}`);
    return `  {\n    ${parts.join(",\n    ")},\n  },`;
  });

  const codeProps = [
    "items={items}",
    `active="${activeHref}"`,
    'label="Разделы"',
    orientation === "vertical" && 'orientation="vertical"',
    `listClassName="${listClasses}"`,
    `itemClassName="${itemClasses}"`,
    `activeClassName="${activeClasses}"`,
    `badgeClassName="${badgeClasses}"`,
    icons && `iconClassName="${iconClasses}"`,
    `className="${navClasses}"`,
  ].filter(Boolean);

  const constMode = codeStyle === "const";
  const code = constMode
    ? `${
        icons
          ? [ICON_IMPORT.home, ICON_IMPORT.grid, ICON_IMPORT.book].join("")
          : ""
      }import { Navigation } from "@/components/ui/Navigation";

const items = [
${codeItems.join("\n")}
];

${classConst("list", [listClasses])}
${classConst("item", [itemClasses])}

export default function Page() {
  return (
    <Navigation
      ${codeProps.join("\n      ")}
    />
  );
}`
    : `<nav aria-label="Разделы" className="${navClasses}">
  <ul className="${join("flex list-none p-0 m-0 min-w-0", listClasses)}">
${items
  .map(
    (item) => `    <li>
      <a href="${item.href}"${
        item.href === activeHref ? ' aria-current="page"' : ""
      } className="${itemClasses}${
        item.href === activeHref ? ` ${activeClasses}` : ""
      }">
        ${typeof item.label === "string" ? item.label : ""}${
          item.badge
            ? ` <span className="${badgeClasses}">${item.badge}</span>`
            : ""
        }
      </a>
    </li>`,
  )
  .join("\n")}
  </ul>
</nav>`;

  const preview = (
    <div
      className="mx-auto max-w-full"
      style={{
        width: "100%",
        maxWidth: fullWidth ? undefined : Number(width),
      }}
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest("a")) e.preventDefault();
      }}
    >
      <Navigation
        items={items}
        active={activeHref}
        label="Разделы"
        orientation={orientation}
        listClassName={listClasses}
        itemClassName={itemClasses}
        activeClassName={activeClasses}
        iconClassName={iconClasses}
        badgeClassName={badgeClasses}
        className={navClasses}
        style={
          bgTransparent ? undefined : { backgroundColor: `var(--${bgName})` }
        }
      />
    </div>
  );

  const reset = () => {
    setOrientation("horizontal");
    setWidth("480");
    setFullWidth(false);
    setFont("13");
    setPadX("12");
    setPadY("8");
    setGap("4");
    setNavPad("0");
    setRadius("12");
    setShadow("none");
    setBorder("none");
    setBorderColor("default");
    setBgPick({ family: "surface", step: 500 });
    setBgTransparent(true);
    setTextClass("auto");
    setAccent("secondary");
    setActiveHref("/docs/components");
    setIcons(true);
    setBadges(true);
    setIconSize("18");
    setIconColor("text-foreground-subtle");
    setLabelHome("Главная");
    setLabelDocs("Компоненты");
    setLabelBlog("Блог");
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
                orientation === "vertical" ? "колонка" : "ряд",
                `${font}px`,
                `r ${radius}`,
                `gap ${gap}`,
                activeHref === "/docs/components" ? "Компоненты" : "другой",
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
            <span className={SECTION}>Вид</span>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Расположение">
                <Seg
                  value={orientation}
                  options={ORIENTATIONS}
                  onChange={setOrientation}
                />
              </Field>
              <Field label="Ширина" note={fullWidth ? "100%" : `${width}px`}>
                <Range
                  label="Ширина"
                  values={["240", "320", "400", "480", "560"]}
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
              <Field label="Отступ по Y" note={`${padY}px`}>
                <Range
                  label="Отступ по Y"
                  values={PAD_YS}
                  value={padY}
                  onChange={setPadY}
                />
              </Field>
              <Field label="Зазор" note={`${gap}px`}>
                <Range
                  label="Зазор"
                  values={GAPS}
                  value={gap}
                  onChange={setGap}
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
              <Field label="Отступ навигации" note={`${navPad}px`}>
                <Range
                  label="Отступ навигации"
                  values={NAV_PADS}
                  value={navPad}
                  onChange={setNavPad}
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
              <Field label="Текст">
                <Seg
                  value={textClass}
                  options={TEXT_COLORS}
                  onChange={setTextClass}
                />
              </Field>
            </div>
            <Switch checked={fullWidth} onChange={setFullWidth}>
              На всю ширину
            </Switch>
            <ColorPicker
              label="Фон навигации"
              value={bgPick}
              onChange={setBgPick}
            />
            <Switch checked={bgTransparent} onChange={setBgTransparent}>
              Прозрачный фон
            </Switch>
          </div>

          <div className="flex flex-col gap-12 p-12 br-lg border bg-surface-muted/30">
            <span className={SECTION}>Пункты</span>
            <div className="grid sm:grid-cols-2 gap-12">
              <Field label="Активный пункт">
                <Seg
                  value={activeHref}
                  options={ACTIVE_ITEMS}
                  onChange={setActiveHref}
                />
              </Field>
              <Field label="Акцент">
                <Seg value={accent} options={ACCENTS} onChange={setAccent} />
              </Field>
            </div>
            <TextField
              label="Первый пункт"
              value={labelHome}
              onChange={setLabelHome}
            />
            <TextField
              label="Второй пункт"
              value={labelDocs}
              onChange={setLabelDocs}
            />
            <TextField
              label="Третий пункт"
              value={labelBlog}
              onChange={setLabelBlog}
            />
          </div>

          <div className="flex flex-col gap-12 p-12 br-lg border bg-surface-muted/30">
            <span className={SECTION}>Иконки и метки</span>
            <div className="grid sm:grid-cols-2 gap-12">
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
              Показывать иконки
            </Switch>
            <Switch checked={badges} onChange={setBadges}>
              Показывать метку
            </Switch>
          </div>
        </>
      }
      preview={preview}
      previewClassName="grid place-items-center"
      code={code}
    />
  );
}
