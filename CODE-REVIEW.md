# Ревью кода RenDit UI

**Дата:** 2026-11-10  
**Версия проекта:** 0.3.8  
**Что сверялось:** официальная документация Next.js 16.4.5 из `node_modules/next/dist/docs/` (как требует `AGENTS.md`), React 19.3.1, плюс Biome / TypeScript / тесты / сборка.

## Как проверялось

```bash
npx biome check src e2e rendit-code scripts   # чисто
npx tsc --noEmit                              # без ошибок
npm test                                      # 99 юнит-тестов + 25 тестов движка — все ✓
npm run build                                 # 73 статические страницы, успешно
npm run test:e2e                              # 53/53 (прод-сервер :3100)
```

Все автоматические проверки зелёные. Ниже — то, что автоматика не ловит.

---

## Ошибки в коде

### 1. `src/app/not/page.tsx` — чужой брендинг и мёртвые якоря

**Важность: высокая.**

- Строки **222**, **269**, **274** называют проект **«Tawilind»** — остаток другого проекта:
  - `Tawilind — лёгкий движок стилей поверх HTML и CSS…`
  - `<span>tawilind — zsh</span>`
  - `<b>❯</b> npx tawilind init`
- Строки **228**, **232**: ссылки `href="#start"` и `href="#docs"`, но элементов с `id="start"` / `id="docs"` на странице нет — ссылки никуда не ведут.
- Страница **никем не слинкована** и при этом **индексируется**: это клиентский компонент (`"use client"`), `metadata` / `robots: noindex` в нём экспортировать нельзя, а в корневом `layout.tsx` `robots` не задан. Публичный URL `/not` с чужим названием может попасть в поиск.
- Для сравнения: лабораторная `/header` закрыта от индексации (`robots: { index: false, follow: false }`).

**Что сделать:** удалить маршрут (он нигде не нужен) либо переписать под RenDit UI и закрыть от индексации (перенести в клиентскую обёртку с `metadata` в серверном `page.tsx` или добавить `robots`).

### 2. `src/app/layout.tsx:27-29` — `metadataBase` падает на localhost

**Важность: высокая (для прода).**

```ts
metadataBase: new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
),
```

В проде без переменной `NEXT_PUBLIC_SITE_URL` абсолютные адреса метаданных — прежде всего `og:image` из `opengraph-image.tsx` — будут вести на `http://localhost:3000`. В репозитории нет `.env` и деплой-конфига, где эта переменная точно задаётся.

**Что сделать:** задать `NEXT_PUBLIC_SITE_URL` в окружении хостинга либо захардкодить реальный домен как fallback.

### 3. `next.config.ts` — нет `turbopack.root`

**Важность: средняя (локально мешает, на CI не проявится).**

Сборка локально предупреждает:

```
⚠ Next.js ignored package-lock.json in C:\Users\ytref because it is outside the current Git repository
```

Причина — реально существующий `C:\Users\ytref\package-lock.json`: Turbopack ищет корень по лок-файлам и находит чужой в домашней папке. На CI такого файла нет, но сборка недетерминирована.

**Что сделать** (по `turbopack.md`, раздел «Root directory»):

```ts
turbopack: {
  root: path.join(process.cwd()),
},
```

---

## Замечания по коду (не ломают, но стоит поправить)

### 4. `src/components/ui/Search/index.tsx:51-64` — эффект без массива зависимостей

Глобальный `keydown`-слушатель перевешивается на **каждом** рендере. Cleanup есть, утечки нет, но это лишняя работа. Достаточно `[]` (или вынести `openSearch` в `useCallback` и указать его в зависимостях).

### 5. `src/components/ui/Search/index.tsx:173-201` — нарушение ARIA

`<div role="option">` оборачивает `<Link>`. Внутри `option` не должно быть интерактивных элементов — скринридер видит противоречивую семантику.

**Что сделать:** `option` + обработчик выбора, либо пункты-ссылки без `role="option"`, либо `listbox` без обёрток.

### 6. `src/providers/theme-provider.tsx:11-32` — подмена `console.error`

Чтобы скрыть предупреждение React 19 «Encountered a script tag while rendering», код глобально переопределяет `console.error` в dev (с восстановлением в cleanup).

Официальный гайд Next 16 (`02-guides/preventing-flash-before-hydration.md`, раздел «Extracting a reusable component») предлагает штатный приём — обёртку `InlineScript`, которая на сервере ставит `type="text/javascript"`, на клиенте — `type="text/plain"`, плюс `suppressHydrationWarning`. Это чище и не трогает глобальный консоль.

### 7. Нет `app/not-found.tsx` (и `app/global-not-found.tsx`)

Сейчас 404 показывает дефолтную страницу Next. `production-checklist.md` прямо рекомендует свою 404 (и `global-error.tsx` для ошибок). Для проекта-фреймворка со своей типографикой это заметная дыра.

### 8. `src/app/layout.tsx:24-25` — устаревший комментарий

Написано «icon1/icon2.tsx (PNG для Android)», а реально в `app/` лежат `icon-192.png` и `icon-512.png`. По докам (`app-icons.md`) нумерованные иконки — это `icon1.png`, `icon2.png`; `icon-192.png` — просто статический файл, который подключается вручную из `manifest.ts`. Комментарий вводит в заблуждение.

---

## Проверено — это НЕ ошибки (важное уточнение)

- **`next-env.d.ts` в `.gitignore` — правильно.** В первом разборе было сказано обратное, но документация Next 16.4.5 (`next.md:205`, `typescript.md:120`, `project-structure.md:47`) прямо рекомендует не коммитить его. Здесь всё верно.
- `cacheComponents: true` + `partialPrefetching: true`, `reactCompiler: true` (и `babel-plugin-react-compiler` в devDependencies), `turbopack.rules` для SVGR, `sassOptions.loadPaths`, `headers` — всё соответствует докам.
- `viewport.themeColor` (а не `metadata`), `data-scroll-behavior="smooth"` (правильное поведение Next 16), `LayoutProps<"/">` / `PageProps`, `next/font/local` с диапазоном `400 700`, inline-скрипты до первой отрисовки, `suppressHydrationWarning` на `<html>` — по гайдам.
- Нет `runtime = 'edge'` (Cache Components требует Node), нет синхронных `params` / `searchParams`, нет `useSearchParams` без `Suspense`, нет `next/image` / `next/script` с нарушениями.
- Очистка `addEventListener` есть во всех клиентских компонентах (`Tilt`, `Spotlight`, `Search`, `quick-menu`, `_sidebar`, `toc`, `_platform`, `_nav-closed`).
- SVG-конфиг Turbopack сохраняет `viewBox` — иконки масштабируются, а не обрезаются.

---

## Приоритет исправлений

| # | Что | Где | Важность |
| --- | --- | --- | --- |
| 1 | Убрать «Tawilind», мёртвые якоря, закрыть `/not` от индексации или удалить | `src/app/not/page.tsx` | высокая |
| 2 | Задать реальный домен в `metadataBase` | `src/app/layout.tsx:27-29` | высокая |
| 3 | Зафиксировать `turbopack.root` | `next.config.ts` | средняя |
| 4 | Своя 404 | `src/app/not-found.tsx` | средняя |
| 5 | ARIA в поиске и зависимость эффекта | `src/components/ui/Search/index.tsx` | средняя |
| 6 | `InlineScript` вместо подмены `console.error` | `src/providers/theme-provider.tsx` | низкая |
| 7 | Поправить комментарий про иконки | `src/app/layout.tsx:24-25` | низкая |
