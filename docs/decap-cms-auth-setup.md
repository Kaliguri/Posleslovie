# Настройка Sveltia CMS

Sveltia CMS на GitHub Pages не может авторизоваться в GitHub напрямую — нужен OAuth-прокси на Cloudflare Workers. В репозитории уже есть worker `cloudflare/posleslovie-cms-auth-worker.js`.

## Шаг 1 — GitHub OAuth App

1. Открой: https://github.com/settings/applications/3625225 (или создай новое OAuth App)
2. Заполни:
   - **Application name**: `Послесловие CMS`
   - **Homepage URL**: `https://kaliguri.github.io/Posleslovie`
   - **Authorization callback URL**: `https://posleslovie-cms-auth.kailgurika.workers.dev/callback`
3. Скопируй **Client ID** и **Client Secret**

> Callback должен указывать на worker (`/callback`), а не на `/admin/`.

## Шаг 2 — Деплой OAuth worker на Cloudflare

Из папки `cloudflare/`:

```bash
npx wrangler login
npx wrangler deploy -c wrangler.cms-auth.toml
```

В Cloudflare Dashboard → Workers → `posleslovie-cms-auth` → **Settings → Variables** добавь:

| Переменная | Значение |
|---|---|
| `GITHUB_CLIENT_ID` | Client ID из шага 1 |
| `GITHUB_CLIENT_SECRET` | Client Secret (Encrypt) |
| `ALLOWED_DOMAINS` | `kaliguri.github.io` |

## Шаг 3 — Деплой сайта

Запушь изменения в `main` — GitHub Actions соберёт сайт и опубликует `/admin/` на Pages.

Принудительный деплой:

```bash
gh workflow run pages.yml
```

## Шаг 4 — Войти в CMS

1. Открой https://kaliguri.github.io/Posleslovie/admin/
2. Нажми **Login with GitHub**
3. Разреши доступ к репозиторию `Kaliguri/Posleslovie`
4. Редактируй контент и нажимай **Publish**

## Что делает клиент

1. Заходит на `/admin`
2. Входит через GitHub (один раз)
3. Меняет текст / загружает фото
4. Нажимает **Publish**
5. Через ~3–5 минут сайт обновляется автоматически

## Доступ для клиента

- Добавь клиента как **Collaborator** в репозиторий с правами `Write`:  
  GitHub repo → **Settings** → **Collaborators** → **Add people**
- Клиенту нужен свой GitHub-аккаунт для входа в CMS

## Как обновлять оферту и другие договоры (PDF)

1. Открой в CMS раздел `Сайт - общие настройки` → `02. Юридические документы (PDF)`.
2. Выбери нужный документ в списке (например, оферта или политика).
3. В поле `PDF-файл документа` загрузи новый `.pdf` (файл попадет в `public/docs`).
4. При необходимости обнови `Короткое название` документа.
5. Нажми **Publish** — ссылка в футере будет вести на новый PDF.

> Поле `Slug` лучше не менять: оно используется в коде сайта для привязки документа.
> Текст юридических документов в CMS скрыт намеренно: рабочим источником для клиента считается PDF-файл.
