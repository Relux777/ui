// Данные и поиск выпадающего списка — без React и DOM: проверяются тестом и используются компонентом.

import type { ReactNode } from "react";

export type SelectOption = {
  value: string;
  label: string;
  /** вторая строка: почта, описание, горячая клавиша */
  hint?: string;
  /** короткая метка справа: «новое», «вы», «12» */
  badge?: string;
  /** адрес страницы для пунктов-ссылок; Select сам не переходит — решает onAction */
  href?: string;
  /** пункт-кнопка: выбор вызывает onAction, а не меняет значение */
  action?: "button";
  /** иконка слева */
  icon?: ReactNode;
  disabled?: boolean;
};

export type SelectGroup = {
  label: string;
  options: SelectOption[];
};

export type SelectItem = SelectOption | SelectGroup;

export const isGroup = (item: SelectItem): item is SelectGroup =>
  "options" in item;

export const flattenItems = (items: readonly SelectItem[]): SelectOption[] =>
  items.flatMap((item) => (isGroup(item) ? item.options : [item]));

const norm = (s: string) => s.toLowerCase().replaceAll("ё", "е");

// Поиск по названию и подсказке. Группа остаётся, если совпало её название (тогда все её пункты)
// или хотя бы один пункт. Пустой запрос не меняет список.
export function filterItems(
  items: readonly SelectItem[],
  query: string,
): SelectItem[] {
  const q = norm(query.trim());
  if (!q) return [...items];
  return items.flatMap((item): SelectItem[] => {
    if (!isGroup(item)) {
      return norm(`${item.label} ${item.hint ?? ""}`).includes(q) ? [item] : [];
    }
    if (norm(item.label).includes(q)) return [item];
    const options = item.options.filter((o) =>
      norm(`${o.label} ${o.hint ?? ""}`).includes(q),
    );
    return options.length ? [{ ...item, options }] : [];
  });
}

// Следующий включённый пункт по кругу. from = -1 — с начала, from = length — с конца.
export function nextEnabled(
  options: readonly SelectOption[],
  from: number,
  step: 1 | -1,
): number {
  if (!options.some((o) => !o.disabled)) return -1;
  let i = from;
  for (let n = 0; n < options.length; n++) {
    i = (i + step + options.length) % options.length;
    if (!options[i].disabled) return i;
  }
  return -1;
}
