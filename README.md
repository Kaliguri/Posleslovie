# Posleslovie Site

Сайт-визитка для продажи бомбочек.

Сайт на GitHub Pages: https://kaliguri.github.io/Posleslovie/

## Контекст проекта

Проект создается как компактный промо-сайт: показать продукт, передать настроение бренда и помочь посетителю быстро понять, как оформить покупку или заявку.

## Технологии

- Next.js
- React
- TypeScript
- Tailwind CSS
- Figma MCP для работы с макетами

## Разработка фронтенда

```bash
npm run dev
```

Проверка качества:

```bash
npm run lint
```

Сборка:

```bash
npm run build
```

Сборка настроена как static export Next.js. После `npm run build` готовые файлы появляются в папке `out/`.

## Локальный fullstack-режим

Для разработки нового backend можно запускать полный стек:

```bash
docker compose up --build
```

Сервисы:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`
- Healthcheck: `http://localhost:4000/api/health`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- MinIO: `http://localhost:9001`

Детали по переходу и CMS scope: [docs/backend-transition.md](docs/backend-transition.md).

## GitHub Pages (legacy)

Проект подготовлен для публикации через GitHub Pages.

Что нужно сделать в GitHub:

1. Открыть репозиторий.
2. Перейти в `Settings` -> `Pages`.
3. В `Build and deployment` выбрать `GitHub Actions`.
4. Запушить изменения в ветку `main`.

Workflow `.github/workflows/pages.yml` сам установит зависимости, выполнит `npm run build` и опубликует папку `out/` в GitHub Pages.

Для локальной проверки перед публикацией:

```bash
npm run lint
npm run build
```

Важно: GitHub Pages обслуживает только статические файлы. Серверные маршруты Next.js, например `/api/*`, и backend-интеграции оплаты не выполняются на Pages.

Текущий план миграции:

- frontend: Vercel;
- backend API: Render (Node/Nest);
- БД: managed PostgreSQL;
- файлы: S3-compatible storage;
- кеш/rate-limit: Redis.

## Рабочий процесс

UI-изменения делаем с опорой на Figma. Перед реализацией страниц, секций и компонентов нужно сверяться с макетом через Figma MCP и переносить решения в код с учетом текущей структуры проекта.

Если ссылка ведет на корень файла, для точной реализации лучше использовать ссылку на конкретный frame или node.

## Cursor: большой счётчик у Review

Если у кнопки **Review** в Cursor отображаются миллионы добавленных строк, это не означает, что `.gitignore` сломан: в репозитории по-прежнему мало отслеживаемых файлов, но рядом на диске лежат `node_modules/`, `.next/` и `out/` с огромным числом строк. Для Cursor они отделены от Git и перечислены в `.cursorignore`, плюс исключения поиска и watcher в `.vscode/settings.json`.

Откройте проект через **File → Open Folder…** (корень `Posleslovie`, не один файл и не «пустое окно»), затем выполните **Developer: Reload Window** в Command Palette.

Дополнительно (если Review лагает или Cursor падает):

1. В палитре команд: **Developer: Reload Window**, затем **Cursor: Restart Language Server**, при необходимости **Cursor: Reindex Workspace**.
2. Кэш retrieval для этой папки можно сбросить, удалив в профиле Windows папку `anysphere.cursor-retrieval` внутри `%APPDATA%\Cursor\User\workspaceStorage\<id-вашего-workspace>\` (Cursor пересоздаст её при следующем открытии проекта).
3. В репозитории обновлён `.gitattributes` на `* text=auto eol=lf`, чтобы реже ловить «весь файл изменён» из‑за CRLF/LF. Глобальный `git config` агентом не менялся; при необходимости вы можете выставить `core.autocrlf` только для себя. Если после смены атрибутов Git внезапно покажет много «переформатированных» файлов, один раз можно применить нормализацию: `git add --renormalize .` и затем закоммитить осознанно.
4. **`git stash clear` и `git reset --hard`** не выполнялись автоматически: они сотрут ваши текущие незакоммиченные правки.
