<img src="src/assets/svg/Rendit_UI_logo.svg" width="56" alt="RenDit UI">

# RenDit UI

Свой UI-фреймворк: стили, движок классов и компоненты в одном проекте. Этот же проект — сайт-документация
и конструктор, где люди собирают компоненты и копируют код (HTML/CSS/JS, TSX, Next.js).

| Часть | Что это | Где лежит |
| --- | --- | --- |
| **RenDit UI** | фреймворк целиком, общее имя и общая версия | весь репозиторий |
| **RenDit SCSS** | токены, сброс, база, контейнер, сетка `.row` | `src/assets/scss/` |
| **RenDit Code** | движок классов: находит классы в коде и генерирует CSS | `rendit-code/` |
| **RenDit Components** | компоненты, каждый — отдельная папка | `src/components/ui/<имя>/` |

## Запуск

```bash
npm run dev                 # RenDit Code в режиме наблюдения + next dev
npm run build               # RenDit Code + next build
npm run rendit-code:test    # тесты движка
```

`npm run dev` обязателен вместо голого `next dev`: без движка новые классы не попадут в CSS.

## Подсказки в VS Code

Расширение **RenDit Code IntelliSense** (папка `rendit-code/vscode`) подсказывает классы прямо в редакторе:
автодополнение классов и вариантов (`hover:`, `md:`, `dark:` …) в `className="…"`, `class="…"`, `cn("…")`,
CSS класса при наведении и образцы цвета рядом с `bg-…`, `text-…`, `border-…`. Своих правил у него нет —
оно спрашивает движок проекта, поэтому подсказки всегда совпадают с CSS. Новые токены и правки
`rendit.config.mjs` подхватываются сами.

```bash
npm run rendit-code:vscode   # собрать и установить расширение, затем Developer: Reload Window
```

Настройки рабочей области — `.vscode/settings.json` (подсказки внутри строк включены).

## Структура

```
ui/
├── rendit.config.mjs              настройки RenDit Code (брейкпоинты, safelist)
├── rendit-code/                   RenDit Code — движок классов
│   ├── cli.mjs                    команды build / watch / dev / check
│   ├── core/                      парсер, утилиты, варианты, генератор, сканер
│   ├── test.mjs                   тесты
│   └── README.md                  справочник по всем классам
├── src/
│   ├── app/                       сайт-документация (Next.js)
│   │   ├── page.tsx               инструкция и живые примеры всех классов
│   │   └── _docs/                 блоки документации (пример, палитра, переключатель темы)
│   ├── assets/scss/               RenDit SCSS
│   │   ├── RenDit_UI.scss         точка входа
│   │   ├── _layers.scss           порядок слоёв: theme, reset, base, layout, components, utilities
│   │   ├── settings/              токены — CSS-переменные
│   │   │   ├── _palette.scss      палитра 14 × 11 (OKLCH, считается из тона и насыщенности)
│   │   │   ├── _tokens.semantic.scss  смысловые цвета, светлая и тёмная темы, градиенты
│   │   │   ├── _shadows.scss      shadow-1…6, inset, line, glass
│   │   │   ├── _radius.scss       скругления xs…2xl
│   │   │   └── _index.scss        собирает все токены (его читает RenDit Code)
│   │   ├── tools/_mixins.scss     hover (только мышь), touch-press, up()/down()
│   │   ├── generic/               _reset, _base
│   │   ├── layout/                _container, _grid (.row)
│   │   ├── components/            стили компонентов (_glass: класс .liquid-glass)
│   │   └── generated/             пишет RenDit Code — не редактировать
│   │       ├── rendit-code.css    классы из исходников
│   │       ├── _screens.scss      брейкпоинты для SCSS
│   │       └── _version.scss      версия для шапки CSS
│   ├── components/ui/             RenDit Components (появятся следующими)
│   └── providers/                 ThemeProvider (next-themes, data-theme на <html>)
├── CHANGELOG.md                   история версий
└── package.json                   версия RenDit UI — единственный источник
```

### Где что писать

| Задача | Куда |
| --- | --- |
| Раскладка, отступы, цвета, тени, адаптив, состояния | классы RenDit Code в разметке |
| Новый цвет, тень, скругление, градиент | токен в `settings/` — класс появится сам |
| Не хватает утилиты, нужной любому проекту | `rendit-code/core/utilities.mjs` + тест + строка в CHANGELOG |
| Стили, которые классами не выразить (`::before` с геометрией, `@keyframes`, сложные `:has()`) | `components/_<имя>.scss` в слое `components` |
| Новый компонент | `src/components/ui/<имя>/` (см. ниже) |

## Компоненты: как будут устроены

Каждый компонент — самодостаточная папка, которую можно скачать целиком:

```
src/components/ui/modal/
├── index.tsx        компонент (React/Next), стили — классами RenDit Code
├── modal.html       вариант для HTML/CSS/JS
├── modal.js         поведение для варианта без React
├── meta.json        { "name", "version", "requires": ["rendit-scss@^0.1"], "files": [...] }
└── README.md        пропсы, примеры, доступность
```

На сайте у компонента вкладки HTML · CSS · JS · TSX · Next.js. Кнопка «Скачать» отдаёт архив папки;
`meta.json` говорит, какая версия RenDit SCSS нужна и куда класть файлы.

## Версии

Как у Next.js, Tailwind и HeroUI — [семантическое версионирование](https://semver.org/lang/ru/) `MAJOR.MINOR.PATCH`:

- **PATCH** (0.1.0 → 0.1.1) — исправления, без изменений в классах и токенах;
- **MINOR** (0.1.x → 0.2.0) — новые классы, токены, компоненты; старые работают как раньше;
- **MAJOR** (0.x → 1.0.0) — переименования и удаления, которые ломают разметку.

Пока версия `0.x`, API ещё может меняться в MINOR — это нормально до первого публичного релиза. `1.0.0` — когда
сайт-документация и первые компоненты готовы.

Версия хранится в одном месте — `package.json`. Движок печатает её в шапке `rendit-code.css` и пишет в
`generated/_version.scss`, откуда её берёт шапка `RenDit_UI.scss`. Каждое изменение — строка в `CHANGELOG.md`.

## Логотип

Знак «Layers» — три слоя каскада (theme → base → utilities). Источник — `src/assets/svg/Rendit_UI_logo.svg`, подключается как React-компонент через SVGR:
`import RenDitLogo from "@/assets/svg/Rendit_UI_logo.svg"`. Где стоит:

| Где | Файл |
| --- | --- |
| Шапка сайта | `src/components/Header` |
| Фавикон (меняет цвет с темой браузера) | `src/app/icon.svg` |
| Иконка «На экран Домой» (iPhone) | `src/app/apple-icon.tsx` |
| Превью ссылки в соцсетях | `src/app/opengraph-image.tsx` |
| Установка сайта как приложения | `src/app/manifest.ts` |

Все варианты, из которых выбирали, — на странице `/logos`.

## Из ReluxCode

ReluxCode (проект ozon) — предшественник. Что изменилось и почему, и таблица соответствия классов —
в [rendit-code/README.md](rendit-code/README.md#было-в-reluxcode--стало).
