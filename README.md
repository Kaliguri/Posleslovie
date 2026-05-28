# Послесловие / Posleslovie

[![Live Site](https://img.shields.io/badge/Live%20Site-posleslovie.online-4a7c59?style=for-the-badge&logo=googlechrome&logoColor=white)](https://posleslovie.online)
[![Deploy](https://img.shields.io/github/actions/workflow/status/kaliguri/Posleslovie/pages.yml?branch=main&style=for-the-badge&label=Deploy&logo=githubactions&logoColor=white)](https://github.com/kaliguri/Posleslovie/actions)
[![Next.js](https://img.shields.io/badge/Next.js-static%20export-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**Сайт-витрина для бренда натуральных бомбочек** — с онлайн-заказом, интеграцией CRM и управлением контентом без разработчика.

**A complete brand site for natural bath bombs** — with an ordering flow, CRM integration, and no-code content management.

---

## Содержание · Contents

| | |
|---|---|
| [Русский](#-о-проекте) | [English](#-about) |

---

## 🇷🇺 О проекте

«Послесловие» — одностраничный сайт-визитка, сделанный под конкретный бренд: передать эстетику, рассказать о продукте и довести клиента до заявки. Работает для частных покупателей и корпоративных заказов.

### Что умеет этот сайт

**Выглядит так, как должен**
Дизайн разработан в Figma и реализован пиксель-в-пиксель. Отлично смотрится на телефоне, планшете и большом экране — без компромиссов.

**Заказ без лишних шагов**
Форма для частных клиентов («для себя») и для компаний («для бизнеса» — с загрузкой логотипа, выбором оттиска, реквизитами). Автодополнение города, сохранение данных между визитами, понятная валидация.

**Заявки сразу в CRM — ничего не теряется**
Каждая заполненная форма автоматически создаёт сделку в AmoCRM: с подробной запиской, суммой, контактами и вложениями. Менеджер видит заказ в момент отправки.

**Контент меняется без программиста**
Встроенная CMS прямо на сайте: открываешь браузер, правишь текст или фото, нажимаешь «Опубликовать» — через ~3 минуты изменения живые. Никаких звонков разработчику ради правки одного слова.

**Быстро грузится, хостинг бесплатный**
Сайт собирается в статику и живёт на GitHub Pages. Нет своего сервера — нет счёта за хостинг. Первый байт отдаётся примерно за 50 мс.

**SEO из коробки**
Автоматические `sitemap.xml` и `robots.txt`, Open Graph-теги (красивые превью при отправке ссылки в мессенджер), структурированные данные для Google (`Organization`, `WebSite`, `Product`).

**Обновляется само**
Любое изменение в коде или контенте → автоматическая сборка и публикация через GitHub Actions. Никакой ручной загрузки файлов на сервер.

---

### Что есть на странице

| Секция | Описание |
|--------|----------|
| Hero | Заголовок, короткий питч, видео-ролик о производстве |
| Продукт | Карточки с описанием и ценой |
| Процесс | Три галереи: бомбочки, лаванда, упаковка |
| Почему мы | Ключевые преимущества бренда |
| О нас | История и ценности команды |
| Отзывы | Карточки с реальными отзывами |
| Оформление заказа | Модальное окно — «для себя» и «для компании» |
| Доп. модальные окна | Доставка, партнёрам, контакты, юридические документы |

---

### Стек

| | Технологии |
|---|---|
| Frontend | Next.js (static export), React, TypeScript, Tailwind CSS v4 |
| Контент | JSON в `content/`, Sveltia CMS |
| Хостинг | GitHub Pages + GitHub Actions |
| Интеграции | Cloudflare Workers (AmoCRM, OAuth для CMS) |
| Шрифты | Roboto, Inter, Educational Gothic |
| Дизайн | [Figma](https://www.figma.com/design/WmOedCtt1kVyO6xx1FfEW2/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D0%B5) |

---

### Структура репозитория

```
├── content/                  # JSON-контент (правится через CMS)
│   ├── home-hero.json        # Hero-секция
│   ├── home-feature-cards.json
│   ├── home-galleries.json
│   ├── home-process-*.json   # Галереи процесса
│   ├── home-reviews.json
│   ├── home-why-us.json
│   ├── home-about.json
│   ├── home-cta.json
│   ├── site-settings.json    # Имя, контакты, соцсети
│   ├── site-products.json    # Продукты и цены
│   ├── site-behavior.json    # Анимации, оверлеи
│   └── legal-documents.json  # Юридические документы
├── public/
│   ├── admin/                # Sveltia CMS (config.yml, index.html)
│   ├── images/               # Изображения и иконки
│   └── videos/               # Видео-ролик производства
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Весь лендинг
│   │   ├── layout.tsx        # Шрифты, мета, header/footer
│   │   ├── robots.ts         # /robots.txt
│   │   └── sitemap.ts        # /sitemap.xml
│   └── shared/
│       ├── config/           # seo.ts, site.ts, legal.ts
│       └── ui/               # SiteHeader, SiteFooter
├── cloudflare/
│   ├── posleslovie-amocrm-worker.js   # Checkout → AmoCRM
│   └── posleslovie-cms-auth-worker.js # GitHub OAuth для CMS
└── .github/workflows/pages.yml        # CI/CD → GitHub Pages
```

---

### Локальная разработка

**Требования:** Node.js 22+

```bash
git clone https://github.com/kaliguri/Posleslovie.git
cd Posleslovie
npm install
npm run dev      # http://localhost:3000
npm run build    # статическая сборка в out/
npm run lint
```

> Сборка — статический экспорт. Серверные API Next.js не используются; checkout и CMS-авторизация работают через внешние Cloudflare Workers.

---

### Деплой

Push в ветку `main` автоматически запускает [`.github/workflows/pages.yml`](.github/workflows/pages.yml):

1. `npm ci` → `npm run build`
2. Публикация папки `out/` на GitHub Pages

Настройка: **Settings → Pages → Build and deployment → GitHub Actions**.

---

### Редактирование контента

1. Откройте [admin-панель](https://posleslovie.online/admin/)
2. Войдите через GitHub
3. Выберите нужный раздел и отредактируйте
4. Нажмите **Publish**
5. Через ~3 минуты сайт обновится автоматически

Подробная настройка OAuth: [`docs/decap-cms-auth-setup.md`](docs/decap-cms-auth-setup.md)

---

### Интеграции

| Сервис | Назначение | Код |
|--------|------------|-----|
| AmoCRM | Заявки с формы заказа → сделки с заметками | `cloudflare/posleslovie-amocrm-worker.js` |
| GitHub OAuth | Авторизация в Sveltia CMS | `cloudflare/posleslovie-cms-auth-worker.js` |

Секреты (токены AmoCRM, OAuth) хранятся в Cloudflare Dashboard, не в репозитории.

---

## 🇬🇧 About

**Posleslovie** is a single-page brand site for natural bath bombs, built to convert visitors into customers. It handles both personal and corporate orders, syncs with AmoCRM, and lets the owner update content without touching code.

### What this site does

**Looks exactly as designed**
Built pixel-perfect from a Figma file. Fully responsive — works great on phones, tablets, and desktops.

**Frictionless ordering**
Two checkout modes: personal (name, city, contact) and corporate (company details, logo upload, seal color, artist note). City autocomplete, form persistence, clear validation.

**Every order lands in CRM instantly**
Each submitted form creates a deal in AmoCRM with a formatted note, order total, contact info, and logo attachment — no orders slip through.

**Content updates without a developer**
Built-in CMS at `/admin`: edit text or images in the browser, click Publish, and changes are live in ~3 minutes. No deploys, no calls to an agency.

**Fast, zero hosting cost**
Fully static site on GitHub Pages. No server, no monthly hosting bill. First byte in ~50ms.

**SEO ready out of the box**
Auto-generated `sitemap.xml`, `robots.txt`, Open Graph tags, Twitter Card, and JSON-LD structured data (`Organization`, `WebSite`, `Product`).

**Ships itself**
Any code or content change triggers an automated build and deploy via GitHub Actions.

---

### Page sections

| Section | Description |
|---------|-------------|
| Hero | Headline, brand pitch, production video |
| Product | Cards with description and price |
| Process | Three photo galleries: bombs, lavender, packaging |
| Why us | Brand advantages |
| About | Team story and values |
| Reviews | Customer testimonial cards |
| Checkout | Modal — personal and corporate tabs |
| Extra modals | Delivery info, partners, contacts, legal documents |

---

### Tech stack

| | Technologies |
|---|---|
| Frontend | Next.js (static export), React, TypeScript, Tailwind CSS v4 |
| Content | JSON files in `content/`, Sveltia CMS |
| Hosting | GitHub Pages + GitHub Actions |
| Integrations | Cloudflare Workers (AmoCRM, CMS OAuth) |
| Fonts | Roboto, Inter, Educational Gothic |
| Design | [Figma](https://www.figma.com/design/WmOedCtt1kVyO6xx1FfEW2/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D0%B5) |

---

### Repository layout

```
├── content/                  # JSON content (edited via CMS)
│   ├── home-hero.json
│   ├── home-feature-cards.json
│   ├── home-galleries.json
│   ├── home-process-*.json
│   ├── home-reviews.json
│   ├── home-why-us.json
│   ├── home-about.json
│   ├── home-cta.json
│   ├── site-settings.json    # Name, contacts, socials
│   ├── site-products.json    # Products and prices
│   ├── site-behavior.json    # Animations, overlays
│   └── legal-documents.json  # Legal texts
├── public/
│   ├── admin/                # Sveltia CMS (config.yml, index.html)
│   ├── images/               # Images and icons
│   └── videos/               # Production video
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Full landing page
│   │   ├── layout.tsx        # Fonts, metadata, header/footer
│   │   ├── robots.ts         # /robots.txt
│   │   └── sitemap.ts        # /sitemap.xml
│   └── shared/
│       ├── config/           # seo.ts, site.ts, legal.ts
│       └── ui/               # SiteHeader, SiteFooter
├── cloudflare/
│   ├── posleslovie-amocrm-worker.js   # Checkout → AmoCRM
│   └── posleslovie-cms-auth-worker.js # GitHub OAuth for CMS
└── .github/workflows/pages.yml        # CI/CD → GitHub Pages
```

---

### Local development

**Requirements:** Node.js 22+

```bash
git clone https://github.com/kaliguri/Posleslovie.git
cd Posleslovie
npm install
npm run dev      # http://localhost:3000
npm run build    # static build → out/
npm run lint
```

> Static export only. Next.js server routes are not used; checkout and CMS auth run on external Cloudflare Workers.

---

### Deployment

Push to `main` triggers [`.github/workflows/pages.yml`](.github/workflows/pages.yml):

1. `npm ci` → `npm run build`
2. Deploy `out/` to GitHub Pages

In the repo: **Settings → Pages → Build and deployment → GitHub Actions**.

---

### Content editing

1. Open the [admin panel](https://posleslovie.online/admin/)
2. Sign in with GitHub
3. Pick a section and make changes
4. Click **Publish**
5. Site updates in ~3 minutes

OAuth setup guide: [`docs/decap-cms-auth-setup.md`](docs/decap-cms-auth-setup.md)

---

### Integrations

| Service | Purpose | Code |
|---------|---------|------|
| AmoCRM | Checkout form → deal with note | `cloudflare/posleslovie-amocrm-worker.js` |
| GitHub OAuth | Sveltia CMS sign-in | `cloudflare/posleslovie-cms-auth-worker.js` |

Secrets (AmoCRM tokens, OAuth credentials) live in the Cloudflare Dashboard only — never in the repo.

---

## Лицензия · License

Private project. All rights reserved.
