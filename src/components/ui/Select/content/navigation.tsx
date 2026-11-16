"use client";

// Пункты-ссылки: тот же Select, но выбор пункта с href переходит на страницу.
// Так один компонент работает и как форма, и как навигация.

import { useRouter } from "next/navigation";
import { Select, type SelectProps } from "../index";
import { NAVIGATION_ITEMS } from "./presets";

type Props = Omit<SelectProps, "items" | "onChange" | "value" | "defaultValue">;

export function SelectNavigation(props: Props) {
  const router = useRouter();
  return (
    <Select
      {...props}
      items={NAVIGATION_ITEMS}
      placeholder={props.placeholder ?? "Куда перейти"}
      searchable={props.searchable ?? false}
      onAction={(option) => {
        if (option.href) router.push(option.href);
      }}
    />
  );
}
