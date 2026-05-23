# Posleslovie Site

Сайт-визитка для продажи бомбочек с локальным CMS-бэкендом и админкой контента.

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

Сборка поддерживает static export для legacy GitHub Pages. После `npm run build` (в режиме static export) готовые файлы появляются в папке `out/`.

## Локальный fullstack-режим

Быстрый запуск фронта + API:

```bash
# 1) backend
npm --prefix backend run dev

# 2) frontend
npm run dev
```

Адреса:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`
- Healthcheck: `http://localhost:4000/api/health`

Текущий CMS-контент хранится локально в SQLite: `backend/data/content.db`.

Опционально можно поднимать инфраструктуру через `docker compose up --build` (PostgreSQL/Redis/MinIO) для следующих этапов миграции.

## Админка контента

Веб-интерфейс админки доступен по адресу:

- `/admin/content` (например `http://localhost:3000/admin/content`)

Что нужно для сохранения:

- запущенный backend API;
- `NEXT_PUBLIC_API_BASE_URL` во фронте;
- действующий `x-api-key` (`API_KEY_ADMIN` из backend env; по умолчанию в локальной разработке: `local-admin-key-please-change`).

Сейчас через админку можно:

- редактировать контент по секциям с inline preview;
- обновлять live-preview сайта после сохранения;
- управлять массивами (добавить/удалить/дублировать/переставить);
- смотреть историю версий и восстанавливать ревизии;
- работать с изображениями: preview, выбор файла, загрузка в `public/images/uploads`, выбор из библиотеки проекта.

На витрину уже подключены CMS-блоки:

- `home-hero`
- `home-feature-cards`
- `home-process-sections`
- `home-why-us`
- `home-about`
- `home-reviews`
- `home-cta`
- `home-galleries`
- `site-settings` (телефон, email, соцсети)
- `legal-documents` (заголовки, PDF-пути, тексты документов)

### Редактирование контактов и договоров

Для изменения контактов и соцсетей:

- откройте в админке блок `site-settings`;
- обновите `phone` и элементы массива `socials` (например Telegram/VK);
- сохраните.

Для изменения договорных/юридических документов:

- откройте блок `legal-documents`;
- отредактируйте `documents` (например `shortTitle`, `pdfPath`, `content`);
- сохраните.

После сохранения изменения применяются в:

- шапке/футере сайта;
- модалке контактов;
- модалках документов и ссылках на PDF в футере.

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
