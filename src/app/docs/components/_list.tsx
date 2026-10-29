// Компоненты RenDit UI, как список у HeroUI: название, одна строка о компоненте и маленькое превью.
// Превью — обычная разметка на классах RenDit Code (не сами компоненты): показывает, как компонент будет
// выглядеть. Компонент готов — у него появится страница /docs/components/<id> с живым примером и кодом
// под каждую платформу, а здесь ready: true.

import type { ReactNode } from "react";

export type ComponentItem = {
  id: string;
  title: string;
  text: string;
  group:
    | "Действия"
    | "Формы"
    | "Окна и подсказки"
    | "Показ данных"
    | "Навигация"
    | "Отклик";
  preview: ReactNode;
  ready?: boolean;
};

const BTN =
  "h-32 px-14 br-full flex items-center font-13 font-w-600 whitespace-nowrap";
const FIELD =
  "h-36 w-full max-w-200 px-12 br-lg border bg-surface flex items-center font-13 text-foreground-subtle";
const LINE = "h-8 br-full bg-foreground/10";

export const COMPONENTS: ComponentItem[] = [
  {
    id: "button",
    title: "Кнопка",
    text: "Главная, обычная, контурная, призрачная; размеры, иконка, загрузка.",
    group: "Действия",
    preview: (
      <div className="flex items-center gap-8">
        <span className={`${BTN} bg-primary text-primary-foreground`}>
          Сохранить
        </span>
        <span className={`${BTN} border bg-surface`}>Отмена</span>
      </div>
    ),
  },
  {
    id: "icon-button",
    title: "Кнопка-иконка",
    text: "Круглая кнопка с иконкой и подсказкой для скринридера.",
    group: "Действия",
    preview: (
      <div className="flex items-center gap-8">
        {[
          "bg-primary text-primary-foreground",
          "border bg-surface",
          "bg-foreground/5",
        ].map((cls) => (
          <span
            key={cls}
            className={`size-36 br-full grid place-items-center font-16 ${cls}`}
          >
            +
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "input",
    title: "Поле ввода",
    text: "Подпись, подсказка, ошибка, иконка слева и кнопка справа.",
    group: "Формы",
    preview: (
      <div className="flex flex-col gap-6 w-full max-w-200">
        <span className="font-12 font-w-600">Почта</span>
        <span
          className={`${FIELD} border-secondary shadow-[0_0_0_3px_color-mix(in_oklab,var(--secondary)_14%,transparent)]`}
        >
          you@mail.ru
        </span>
      </div>
    ),
  },
  {
    id: "checkbox",
    title: "Флажок",
    text: "Флажок с подписью, неопределённое состояние, группа.",
    group: "Формы",
    preview: (
      <div className="flex flex-col gap-8 font-13">
        {[true, false].map((on) => (
          <span key={String(on)} className="flex items-center gap-8">
            <span
              className={`size-18 br-sm grid place-items-center font-11 font-w-700 ${on ? "bg-secondary text-secondary-foreground" : "border bg-surface"}`}
            >
              {on ? "✓" : ""}
            </span>
            {on ? "Запомнить меня" : "Подписаться"}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "switch",
    title: "Переключатель",
    text: "Вкл/выкл на пружине, с подписью и описанием.",
    group: "Формы",
    preview: (
      <div className="flex flex-col gap-10">
        {[true, false].map((on) => (
          <span
            key={String(on)}
            className={`relative w-44 h-26 br-full ${on ? "bg-secondary" : "bg-foreground/15"}`}
          >
            <span
              className={`absolute top-3 size-20 br-full bg-white shadow-2 ${on ? "left-21" : "left-3"}`}
            />
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "radio",
    title: "Радио",
    text: "Один вариант из нескольких, карточки-варианты.",
    group: "Формы",
    preview: (
      <div className="flex flex-col gap-8 font-13">
        {["Курьером", "Самовывоз"].map((t, i) => (
          <span key={t} className="flex items-center gap-8">
            <span
              className={`size-18 br-full grid place-items-center border ${i === 0 ? "border-secondary" : ""}`}
            >
              {i === 0 && <span className="size-8 br-full bg-secondary" />}
            </span>
            {t}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "select",
    title: "Выбор",
    text: "Свой выпадающий список вместо системного: поиск, иконки, группы.",
    group: "Формы",
    preview: (
      <div className="flex flex-col gap-4 w-full max-w-200">
        <span className={`${FIELD} justify-between text-foreground`}>
          Next.js <span className="text-foreground-subtle">⌄</span>
        </span>
        <span className="flex flex-col gap-2 p-4 br-lg border bg-surface shadow-3 font-12">
          <span className="px-8 py-4 br-md bg-secondary/10 text-secondary">
            Next.js
          </span>
          <span className="px-8 py-4">React</span>
        </span>
      </div>
    ),
  },
  {
    id: "slider",
    title: "Ползунок",
    text: "Значение или диапазон, шаги и подписи.",
    group: "Формы",
    preview: (
      <div className="relative w-full max-w-200 h-20 flex items-center">
        <span className="w-full h-6 br-full bg-foreground/10" />
        <span className="absolute left-0 w-3/5 h-6 br-full bg-secondary" />
        <span className="absolute left-[60%] size-18 -ml-9 br-full bg-white border-2 border-secondary shadow-2" />
      </div>
    ),
  },
  {
    id: "tabs",
    title: "Вкладки",
    text: "Сегменты, подчёркивание, вкладки с иконками и счётчиками.",
    group: "Навигация",
    preview: (
      <div className="flex gap-2 p-3 br-full bg-foreground/5 font-12 font-w-600">
        <span className="px-12 py-6 br-full bg-surface shadow-2">Фото</span>
        <span className="px-12 py-6 text-foreground-muted">Видео</span>
        <span className="px-12 py-6 text-foreground-muted">Файлы</span>
      </div>
    ),
  },
  {
    id: "breadcrumbs",
    title: "Путь",
    text: "Хлебные крошки: где вы на сайте.",
    group: "Навигация",
    preview: (
      <div className="flex items-center gap-6 font-13 text-foreground-muted">
        Справка <span>›</span> Размеры <span>›</span>
        <span className="text-foreground">Ширина</span>
      </div>
    ),
  },
  {
    id: "pagination",
    title: "Страницы",
    text: "Переход по страницам списка.",
    group: "Навигация",
    preview: (
      <div className="flex items-center gap-4 font-13 font-w-600">
        {["‹", "1", "2", "3", "…", "9", "›"].map((p, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: статичное превью
            key={i}
            className={`size-30 br-md grid place-items-center ${p === "2" ? "bg-secondary text-secondary-foreground" : "text-foreground-muted"}`}
          >
            {p}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "dropdown",
    title: "Меню",
    text: "Выпадающее меню действий: иконки, разделители, горячие клавиши.",
    group: "Навигация",
    preview: (
      <div className="flex flex-col gap-2 w-160 p-4 br-lg border bg-surface shadow-4 font-12">
        <span className="px-8 py-5 br-md bg-foreground/5">Изменить</span>
        <span className="px-8 py-5">Скопировать</span>
        <span className="h-px my-2 bg-foreground/10" />
        <span className="px-8 py-5 text-danger">Удалить</span>
      </div>
    ),
  },
  {
    id: "modal",
    title: "Окно",
    text: "Окно по центру и лист снизу на телефоне: смахивается, размытие под ним.",
    group: "Окна и подсказки",
    preview: (
      <div className="relative w-full max-w-220 h-120 br-lg bg-foreground/8 grid place-items-center">
        <span className="flex flex-col gap-6 w-150 p-12 br-lg bg-surface shadow-5">
          <span className="font-12 font-w-700">Удалить файл?</span>
          <span className={`${LINE} w-4/5`} />
          <span className="self-end px-10 py-3 br-full bg-danger text-white font-11 font-w-600">
            Удалить
          </span>
        </span>
      </div>
    ),
  },
  {
    id: "tooltip",
    title: "Подсказка",
    text: "Подсказка при наведении и фокусе, со стрелкой.",
    group: "Окна и подсказки",
    preview: (
      <div className="flex flex-col items-center gap-6">
        <span className="relative px-10 py-5 br-md bg-foreground text-background font-12 font-w-600 after:absolute after:top-full after:left-1/2 after:-ml-5 after:border-5 after:border-transparent after:border-t-foreground">
          Скопировать
        </span>
        <span className="size-32 br-full border bg-surface" />
      </div>
    ),
  },
  {
    id: "popover",
    title: "Всплывающая панель",
    text: "Панель у кнопки с любым содержимым, на Popover API.",
    group: "Окна и подсказки",
    preview: (
      <div className="flex flex-col items-start gap-6">
        <span className={`${BTN} border bg-surface`}>Фильтры</span>
        <span className="flex flex-col gap-6 w-150 p-10 br-lg border bg-surface shadow-4">
          <span className={`${LINE} w-full`} />
          <span className={`${LINE} w-2/3`} />
        </span>
      </div>
    ),
  },
  {
    id: "toast",
    title: "Уведомление",
    text: "Короткое сообщение внизу экрана: успех, ошибка, отмена действия.",
    group: "Отклик",
    preview: (
      <div className="flex items-center gap-10 px-14 py-10 br-full bg-foreground text-background font-13 shadow-4">
        <span className="size-18 br-full bg-success grid place-items-center text-white font-11">
          ✓
        </span>
        Сохранено
        <span className="font-w-600 text-lime-300">Отменить</span>
      </div>
    ),
  },
  {
    id: "alert",
    title: "Заметка",
    text: "Блок с важным: совет, предупреждение, ошибка.",
    group: "Отклик",
    preview: (
      <div className="flex gap-10 w-full max-w-220 p-12 br-lg border border-secondary/30 bg-secondary/8 font-12">
        <span className="size-18 shrink-0 br-full bg-secondary text-secondary-foreground grid place-items-center font-11 font-w-700">
          i
        </span>
        <span className="flex flex-col gap-6 flex-1">
          <span className={`${LINE} w-full bg-secondary/25`} />
          <span className={`${LINE} w-3/4 bg-secondary/25`} />
        </span>
      </div>
    ),
  },
  {
    id: "progress",
    title: "Прогресс",
    text: "Полоса и круг: сколько сделано.",
    group: "Отклик",
    preview: (
      <div className="flex items-center gap-14 w-full max-w-220">
        <span className="flex-1 h-8 br-full bg-foreground/10 overflow-hidden">
          <span className="block w-2/3 h-full br-full bg-secondary" />
        </span>
        <span className="size-36 br-full bg-[conic-gradient(var(--secondary)_70%,color-mix(in_oklab,var(--foreground)_10%,transparent)_0)] [mask:radial-gradient(circle,transparent_11px,#000_12px)]" />
      </div>
    ),
  },
  {
    id: "spinner",
    title: "Загрузка",
    text: "Крутилка и точки — пока что-то грузится.",
    group: "Отклик",
    preview: (
      <div className="flex items-center gap-16">
        <span className="size-32 br-full border-3 border-foreground/10 border-t-secondary" />
        <span className="flex gap-4">
          {["opacity-100", "opacity-60", "opacity-30"].map((o) => (
            <span key={o} className={`size-8 br-full bg-secondary ${o}`} />
          ))}
        </span>
      </div>
    ),
  },
  {
    id: "skeleton",
    title: "Заготовка",
    text: "Серые блоки на месте содержимого, пока оно грузится.",
    group: "Отклик",
    preview: (
      <div className="flex items-center gap-10 w-full max-w-220">
        <span className="size-40 shrink-0 br-full bg-foreground/8" />
        <span className="flex flex-col gap-6 flex-1">
          <span className={`${LINE} w-full`} />
          <span className={`${LINE} w-2/3`} />
        </span>
      </div>
    ),
  },
  {
    id: "card",
    title: "Карточка",
    text: "Обложка, заголовок, текст и действия.",
    group: "Показ данных",
    preview: (
      <div className="flex flex-col w-150 br-lg border bg-surface shadow-2 overflow-hidden">
        <span className="h-50 bg-[linear-gradient(135deg,var(--violet-300),var(--lime-200))]" />
        <span className="flex flex-col gap-6 p-10">
          <span className="font-12 font-w-700">Заголовок</span>
          <span className={`${LINE} w-4/5`} />
        </span>
      </div>
    ),
  },
  {
    id: "avatar",
    title: "Аватар",
    text: "Фото или буквы, статус, группа аватаров.",
    group: "Показ данных",
    preview: (
      <div className="flex -space-x-10">
        {[
          "bg-violet-400",
          "bg-lime-300 text-gray-900",
          "bg-pink-400",
          "bg-foreground/10 text-foreground",
        ].map((c, i) => (
          <span
            key={c}
            className={`size-40 br-full grid place-items-center border-2 border-surface text-white font-13 font-w-700 ${c}`}
          >
            {["РА", "ДИ", "ОК", "+5"][i]}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "chip",
    title: "Метка",
    text: "Метки и фильтры: цвета, иконка, крестик.",
    group: "Показ данных",
    preview: (
      <div className="flex flex-wrap gap-6 font-12 font-w-600">
        <span className="px-10 py-4 br-full bg-secondary/12 text-secondary">
          Дизайн
        </span>
        <span className="px-10 py-4 br-full bg-success/12 text-success">
          Готово
        </span>
        <span className="px-10 py-4 br-full border">Черновик ×</span>
      </div>
    ),
  },
  {
    id: "badge",
    title: "Счётчик",
    text: "Число или точка на иконке.",
    group: "Показ данных",
    preview: (
      <span className="relative size-40 br-lg border bg-surface grid place-items-center font-16">
        ✉
        <span className="absolute -top-6 -right-6 min-w-20 h-20 px-5 br-full bg-danger text-white grid place-items-center font-11 font-w-700">
          3
        </span>
      </span>
    ),
  },
  {
    id: "accordion",
    title: "Аккордеон",
    text: "Вопрос — ответ: раскрывается плавно, по одному или несколько.",
    group: "Показ данных",
    preview: (
      <div className="flex flex-col w-full max-w-220 br-lg border bg-surface font-12 font-w-600">
        {["Как установить?", "Нужен ли Node.js?"].map((q, i) => (
          <span
            key={q}
            className={`flex justify-between px-12 py-8 ${i ? "border-t" : ""}`}
          >
            {q}
            <span className="text-foreground-subtle">{i ? "+" : "−"}</span>
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "table",
    title: "Таблица",
    text: "Сортировка, выбор строк, прокрутка с закреплённой шапкой.",
    group: "Показ данных",
    preview: (
      <div className="flex flex-col w-full max-w-220 br-lg border bg-surface overflow-hidden font-11">
        <span className="grid grid-cols-3 px-10 py-6 bg-surface-muted font-w-700 text-foreground-muted">
          <span>Имя</span>
          <span>Роль</span>
          <span>Статус</span>
        </span>
        {[1, 2].map((r) => (
          <span
            key={r}
            className="grid grid-cols-3 items-center gap-6 px-10 py-7 border-t"
          >
            <span className={`${LINE} w-4/5`} />
            <span className={`${LINE} w-3/5`} />
            <span className="w-fit px-6 br-full bg-success/12 text-success">
              ок
            </span>
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "kbd",
    title: "Клавиша",
    text: "Горячие клавиши в тексте и подсказках.",
    group: "Показ данных",
    preview: (
      <div className="flex items-center gap-6 font-12 font-w-600">
        {["Ctrl", "K"].map((k) => (
          <span
            key={k}
            className="min-w-28 h-28 px-8 br-md border border-b-3 bg-surface grid place-items-center font-mono"
          >
            {k}
          </span>
        ))}
      </div>
    ),
  },
];

export const GROUPS = [...new Set(COMPONENTS.map((c) => c.group))];
