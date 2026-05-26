# Настройка авторизации Decap CMS

Decap CMS на GitHub Pages требует OAuth-прокси для входа через GitHub. Используем бесплатный Netlify OAuth без деплоя сайта на Netlify.

## Шаг 1 — Создать GitHub OAuth App

1. Открой: https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. Заполни:
   - **Application name**: `Послесловие CMS`
   - **Homepage URL**: `https://kaliguri.github.io/Posleslovie` (или твой домен)
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
3. Нажми **Register application**
4. Скопируй **Client ID**
5. Нажми **Generate a new client secret** → скопируй **Client Secret**

## Шаг 2 — Создать аккаунт Netlify и подключить GitHub OAuth

1. Зарегистрируйся на https://app.netlify.com (бесплатно, без деплоя)
2. Создай любой сайт (можно пустой): **Sites** → **Add new site** → **Deploy manually** → перетащи любой файл
3. Зайди в настройки этого сайта: **Site configuration** → **Access control** → **OAuth**
4. Нажми **Install provider** → выбери **GitHub**
5. Вставь **Client ID** и **Client Secret** из Шага 1
6. Нажми **Install**

## Шаг 3 — Включить GitHub Pages и настроить домен

В репозитории на GitHub:
1. **Settings** → **Pages** → Source: **GitHub Actions** → Save
2. Запушь изменения в ветку `main` — GitHub Actions соберёт и задеплоит сайт

## Шаг 4 — Войти в CMS

1. Открой `https://твой-домен/admin`
2. Нажми **Login with GitHub**
3. Разреши доступ к репозиторию
4. Готово — редактор открыт

## Что делает клиент при редактировании

1. Заходит на `/admin`
2. Входит через GitHub (один раз, браузер запоминает)
3. Меняет текст / загружает фото
4. Нажимает **Publish** (или **Save**)
5. Через ~3-5 минут сайт обновляется автоматически

## Важно

- GitHub аккаунт нужен **только тебе** (владельцу репозитория) и клиенту если дать ему доступ к репо
- Если клиент не должен иметь GitHub аккаунт — можно добавить его как **Collaborator** к репозиторию с правами `write`
- Путь: GitHub repo → **Settings** → **Collaborators** → **Add people** → ввести email/username клиента
