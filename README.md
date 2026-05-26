# Послесловие / Posleslovie

**Промо-сайт бренда натуральных бомбочек для ванны** — лендинг с галереями, отзывами, оформлением заказа и CMS для редактирования контента без правок кода.

**Live:** [kaliguri.github.io/Posleslovie](https://kaliguri.github.io/Posleslovie/) · **CMS:** [/admin](https://kaliguri.github.io/Posleslovie/admin/)

---

## Содержание · Contents

| | |
|---|---|
| [Русский](#-русский) | [English](#-english) |

---

## 🇷🇺 Русский

### О проекте

«Послесловие» — одностраничный сайт-визитка для B2C- и B2B-заказов: показать продукт, передать настроение бренда и провести клиента до заявки. Контент (тексты, изображения, отзывы, юридические документы) хранится в JSON и редактируется через **Sveltia CMS**. Заказы уходят в **AmoCRM** через Cloudflare Worker.

### Возможности

- **Главная страница** — hero, карточки продукта, секции процесса с галереями, «Почему мы», «О нас», отзывы, финальный CTA
- **Модальные окна** — доставка, партнёрам, контакты, юридические документы
- **Оформление заказа** — вкладки «Для себя» / «Для компании», валидация, автодополнение городов, загрузка логотипа (B2B)
- **AmoCRM** — заявки создаются как сделки с заметками и вложениями
- **Sveltia CMS** — редактирование контента через GitHub, автодеплой после публикации
- **Адаптивная вёрстка** — mobile-first, дизайн по [макету в Figma](https://www.figma.com/design/WmOedCtt1kVyO6xx1FfEW2/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D0%B5)

### Стек

| Слой | Технологии |
|------|------------|
| Frontend | Next.js (static export), React, TypeScript, Tailwind CSS |
| Контент | JSON в `content/`, Sveltia CMS в `public/admin/` |
| Хостинг | GitHub Pages + GitHub Actions |
| Интеграции | Cloudflare Workers (AmoCRM, OAuth для CMS) |

### Структура репозитория

```
├── content/              # JSON-контент сайта (редактируется через CMS)
├── public/
│   ├── admin/            # Sveltia CMS (config.yml, index.html)
│   ├── images/           # Статические изображения
│   └── docs/             # PDF юридических документов
├── src/
│   ├── app/              # Next.js App Router (layout, page, стили)
│   └── shared/           # UI-компоненты и конфигурация
├── cloudflare/           # Workers: AmoCRM checkout, CMS OAuth
├── .github/workflows/    # CI/CD → GitHub Pages
└── docs/                 # Документация (CMS, WordPress-архив и др.)
```

### Локальная разработка

**Требования:** Node.js 20+

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # результат в out/
```

Сборка — **static export**. Серверные API Next.js на GitHub Pages не работают; checkout и CMS-auth вынесены во внешние Workers.

### Редактирование контента (CMS)

1. Откройте [редактор](https://kaliguri.github.io/Posleslovie/admin/)
2. Войдите через GitHub
3. Измените секции → **Publish**
4. Через ~3–5 минут сайт обновится после деплоя Actions

Подробная настройка OAuth: [`docs/decap-cms-auth-setup.md`](docs/decap-cms-auth-setup.md)

### Деплой

Push в ветку `main` запускает workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml):

1. `npm ci` → `npm run build`
2. Публикация `out/` на GitHub Pages

В репозитории: **Settings → Pages → Build and deployment → GitHub Actions**.

### Интеграции

| Сервис | Назначение | Код |
|--------|------------|-----|
| AmoCRM | Приём заявок с формы заказа | `cloudflare/posleslovie-amocrm-worker.js` |
| GitHub OAuth | Вход в Sveltia CMS | `cloudflare/posleslovie-cms-auth-worker.js` |

Секреты (токены AmoCRM, OAuth client secret) хранятся только в Cloudflare Dashboard, не в репозитории.

### Дизайн

UI сверяется с Figma. Изображения для production — в `public/images/` со стабильными путями `/images/...`, не через временные MCP-URL.

---

## 🇬🇧 English

### About

**Posleslovie** is a single-page promotional site for natural bath bombs, serving both B2C and B2B customers. It showcases the product, captures leads, and routes orders to **AmoCRM**. Content is stored as JSON and editable via **Sveltia CMS** without touching source code.

### Features

- **Landing page** — hero, product cards, process sections with galleries, “Why us”, about, reviews, final CTA
- **Modals** — delivery info, partners, contacts, legal documents
- **Checkout flow** — personal / company tabs, validation, city autocomplete, logo upload (B2B)
- **AmoCRM integration** — orders create leads with notes and attachments
- **Sveltia CMS** — content editing via GitHub with auto-deploy on publish
- **Responsive layout** — mobile-first, based on the [Figma design](https://www.figma.com/design/WmOedCtt1kVyO6xx1FfEW2/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D0%B5)

### Tech stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Next.js (static export), React, TypeScript, Tailwind CSS |
| Content | JSON in `content/`, Sveltia CMS in `public/admin/` |
| Hosting | GitHub Pages + GitHub Actions |
| Integrations | Cloudflare Workers (AmoCRM, CMS OAuth) |

### Repository layout

```
├── content/              # Site content JSON (edited via CMS)
├── public/
│   ├── admin/            # Sveltia CMS (config.yml, index.html)
│   ├── images/           # Static images
│   └── docs/             # Legal PDFs
├── src/
│   ├── app/              # Next.js App Router (layout, page, styles)
│   └── shared/           # UI components and config
├── cloudflare/           # Workers: AmoCRM checkout, CMS OAuth
├── .github/workflows/    # CI/CD → GitHub Pages
└── docs/                 # Documentation (CMS setup, WordPress archive, etc.)
```

### Local development

**Requirements:** Node.js 20+

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # output in out/
```

The site uses **static export**. Next.js server routes are not available on GitHub Pages; checkout and CMS auth run on external Cloudflare Workers.

### Content editing (CMS)

1. Open the [admin panel](https://kaliguri.github.io/Posleslovie/admin/)
2. Sign in with GitHub
3. Edit sections → **Publish**
4. The site updates in ~3–5 minutes after the Actions deploy

OAuth setup guide: [`docs/decap-cms-auth-setup.md`](docs/decap-cms-auth-setup.md)

### Deployment

Pushing to `main` triggers [`.github/workflows/pages.yml`](.github/workflows/pages.yml):

1. `npm ci` → `npm run build`
2. Deploy `out/` to GitHub Pages

In the repo: **Settings → Pages → Build and deployment → GitHub Actions**.

### Integrations

| Service | Purpose | Code |
|---------|---------|------|
| AmoCRM | Checkout form submissions | `cloudflare/posleslovie-amocrm-worker.js` |
| GitHub OAuth | Sveltia CMS sign-in | `cloudflare/posleslovie-cms-auth-worker.js` |

Secrets (AmoCRM tokens, OAuth client secret) live in the Cloudflare Dashboard only — never in the repo.

### Design

UI follows the Figma source of truth. Production images live in `public/images/` with stable `/images/...` paths.

---

## Лицензия · License

Private project. All rights reserved.
