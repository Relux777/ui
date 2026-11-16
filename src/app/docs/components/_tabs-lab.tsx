"use client";

// Конструктор вкладок: сегменты, подчёркивание или рамка; размер, иконки, счётчики и ширина.
// В превью — настоящие Tabs: стрелки, Home/End и Enter работают.

import { File } from "@boxicons/react/File";
import { Image } from "@boxicons/react/Image";
import { Video } from "@boxicons/react/Video";
import { useState } from "react";
import { type TabItem, Tabs } from "@/components/ui/Tabs";
import { Field, Seg, Switch } from "../../_docs/builder";
import { ComponentLab } from "./_lab";

const VARIANTS = [
  { id: "pill", title: "Сегменты" },
  { id: "underline", title: "Подчёркивание" },
  { id: "enclosed", title: "Рамка" },
] as const;
const SIZES = [
  { id: "sm", title: "sm" },
  { id: "md", title: "md" },
  { id: "lg", title: "lg" },
] as const;

type Variant = (typeof VARIANTS)[number]["id"];
type Size = (typeof SIZES)[number]["id"];

const ICONS = {
  photo: <Image width={16} height={16} />,
  video: <Video width={16} height={16} />,
  files: <File width={16} height={16} />,
};

export function TabsLab() {
  const [variant, setVariant] = useState<Variant>("pill");
  const [size, setSize] = useState<Size>("md");
  const [icons, setIcons] = useState(true);
  const [counts, setCounts] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);
  const [content, setContent] = useState(true);

  const items: TabItem[] = [
    {
      id: "photo",
      label: "Фото",
      icon: icons ? ICONS.photo : undefined,
      count: counts ? 24 : undefined,
      content: content ? (
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className="grid place-items-center h-64 br-lg bg-secondary/10 font-13 font-w-600 text-secondary"
            >
              {n}
            </span>
          ))}
        </div>
      ) : undefined,
    },
    {
      id: "video",
      label: "Видео",
      icon: icons ? ICONS.video : undefined,
      count: counts ? 8 : undefined,
      content: content ? (
        <p className="font-14 text-foreground-muted">
          Восемь роликов — от коротких демо до разбора компонентов.
        </p>
      ) : undefined,
    },
    {
      id: "files",
      label: "Файлы",
      icon: icons ? ICONS.files : undefined,
      count: counts ? 12 : undefined,
      content: content ? (
        <p className="font-14 text-foreground-muted">
          Макеты, шрифты и готовые CSS — всё лежит в одном месте.
        </p>
      ) : undefined,
    },
  ];

  const code = `<Tabs
  defaultValue="photo"
  items={items}${fullWidth ? "\n  fullWidth" : ""}${
    variant !== "pill" ? `\n  variant="${variant}"` : ""
  }${size !== "md" ? `\n  size="${size}"` : ""}
/>`;

  return (
    <ComponentLab
      controls={
        <>
          <Field label="Вид">
            <Seg value={variant} options={VARIANTS} onChange={setVariant} />
          </Field>
          <Field label="Размер">
            <Seg value={size} options={SIZES} onChange={setSize} />
          </Field>
          <Switch checked={icons} onChange={setIcons}>
            Иконки
          </Switch>
          <Switch checked={counts} onChange={setCounts}>
            Счётчики
          </Switch>
          <Switch checked={fullWidth} onChange={setFullWidth}>
            На всю ширину
          </Switch>
          <Switch checked={content} onChange={setContent}>
            Панель с содержимым
          </Switch>
        </>
      }
      preview={
        <div className="w-full max-w-420 min-w-0">
          <Tabs
            items={items}
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            ariaLabel="Медиа"
          />
        </div>
      }
      previewClassName="grid place-items-center"
      code={code}
    />
  );
}
