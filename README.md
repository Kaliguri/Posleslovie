<div align="center">

# Послесловие

**Сайт-витрина для бренда натуральных бомбочек**
*A brand site for natural bath bombs*

<br>

[![Открыть сайт](https://img.shields.io/badge/Открыть%20сайт-posleslovie.online-4a7c59?style=for-the-badge&logo=googlechrome&logoColor=white)](https://posleslovie.online)
[![Панель управления](https://img.shields.io/badge/Панель%20управления-%2Fadmin-6c757d?style=for-the-badge&logo=contentful&logoColor=white)](https://posleslovie.online/admin/)

<br>

[![Deploy](https://img.shields.io/github/actions/workflow/status/kaliguri/Posleslovie/pages.yml?branch=main&style=flat-square&label=Deploy&logo=githubactions&logoColor=white)](https://github.com/kaliguri/Posleslovie/actions)
![Next.js](https://img.shields.io/badge/Next.js-black?logo=nextdotjs&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white&style=flat-square)
![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?logo=cloudflare&logoColor=white&style=flat-square)

</div>

---

## Что умеет

- **Адаптивный дизайн** — отлично смотрится на телефоне, планшете и большом экране
- **Заказ в пару кликов** — форма для частных клиентов и корпоративных заказов: загрузка логотипа, автодополнение города, сохранение данных
- **Заявки прямо в CRM** — каждая форма создаёт сделку в AmoCRM с запиской, суммой и вложениями. Ничего не теряется
- **Контент без программиста** — встроенная CMS: открыл браузер, поправил текст или фото, нажал «Опубликовать» — изменения живые через ~3 минуты
- **Быстрый и бесплатный хостинг** — статический сайт на GitHub Pages, без своего сервера
- **SEO из коробки** — sitemap, robots.txt, Open Graph (красивые превью в мессенджерах), JSON-LD для Google
- **Обновляется само** — любой коммит в `main` запускает сборку и деплой автоматически

---

## Страница

| Секция | |
|---|---|
| Hero | Заголовок, питч, видео о производстве |
| Продукт | Карточки с описанием и ценой |
| Процесс | Три фотогалереи: бомбочки, лаванда, упаковка |
| Почему мы | Ключевые преимущества |
| О нас | История команды |
| Отзывы | Карточки клиентов |
| Заказ | Модальное окно — личный и корпоративный |
| Ещё | Доставка, партнёрам, контакты, юридические документы |

---

<details>
<summary><b>Для разработчиков</b></summary>

<br>

### Стек

| | |
|---|---|
| Frontend | Next.js (static export), React, TypeScript, Tailwind CSS v4 |
| Контент | JSON в `content/`, Sveltia CMS |
| Хостинг | GitHub Pages + GitHub Actions |
| Интеграции | Cloudflare Workers — AmoCRM, CMS OAuth |

### Структура

```
├── content/              # JSON-контент (редактируется через CMS)
│   ├── home-*.json       # Секции лендинга
│   ├── site-settings.json
│   ├── site-products.json
│   └── legal-documents.json
├── public/
│   ├── admin/            # Sveltia CMS
│   └── images/ videos/
├── src/
│   ├── app/              # Next.js App Router (page, layout, robots, sitemap)
│   └── shared/           # Конфиги и UI-компоненты
├── cloudflare/
│   ├── posleslovie-amocrm-worker.js    # Checkout → AmoCRM
│   └── posleslovie-cms-auth-worker.js  # GitHub OAuth для CMS
└── .github/workflows/pages.yml
```

### Локально

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # статическая сборка → out/
```

> Node.js 22+. Серверные API не используются — checkout и CMS-авторизация живут в Cloudflare Workers.

### Деплой

Push в `main` → GitHub Actions → `out/` на GitHub Pages.

Настройка: **Settings → Pages → GitHub Actions**.

### Редактирование контента

1. [posleslovie.online/admin/](https://posleslovie.online/admin/)
2. Войти через GitHub
3. Отредактировать → **Publish**
4. ~3 минуты до обновления

Подробнее: [`docs/decap-cms-auth-setup.md`](docs/decap-cms-auth-setup.md)

### Интеграции

| Сервис | Назначение |
|---|---|
| AmoCRM | Форма заказа → сделка с заметкой и вложением |
| GitHub OAuth | Авторизация в Sveltia CMS |

Секреты (токены AmoCRM, OAuth) — в Cloudflare Dashboard, не в репозитории.

</details>

---

<div align="center">

*Private project · All rights reserved*

</div>
