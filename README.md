<div align="center">

# Послесловие · Posleslovie

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

## Screenshots

![Главный экран](docs/screenshots/hero.png)

## Architecture

```mermaid
flowchart LR
  User[Visitor] --> Site[Next.js static site]
  Site --> AmoWorker[Cloudflare AmoCRM Worker]
  AmoWorker --> AmoCRM[AmoCRM]

  Admin[Content editor] --> CMS[Sveltia CMS]
  CMS --> OAuth[Cloudflare OAuth Worker]
  CMS --> GitHub[GitHub content JSON]
  GitHub --> Actions[GitHub Actions]
  Actions --> Pages[GitHub Pages]
```

---

## Русский

**Сайт-витрина для бренда натуральных бомбочек** с онлайн-заказом, интеграцией CRM и управлением контентом без разработчика.

### Что умеет

- **Адаптивный дизайн** для телефона, планшета и десктопа
- **Заказ в пару кликов** для частных и корпоративных клиентов (загрузка логотипа, автодополнение города, сохранение данных формы)
- **Интеграция с AmoCRM**: каждая заявка создаёт сделку с заметкой, суммой и вложениями
- **No-code редактирование контента** через Sveltia CMS (публикация в прод примерно за 3 минуты)
- **Автодеплой на GitHub Pages** при каждом коммите в `main`
- **SEO из коробки**: sitemap, robots.txt, Open Graph, JSON-LD

### Для разработчиков

**Стек**

|            |                                                             |
| ---------- | ----------------------------------------------------------- |
| Frontend   | Next.js (static export), React, TypeScript, Tailwind CSS v4 |
| Контент    | JSON в `content/`, Sveltia CMS                              |
| Хостинг    | GitHub Pages + GitHub Actions                               |
| Интеграции | Cloudflare Workers (AmoCRM, CMS OAuth)                      |

**Структура**

```text
├── content/              # JSON-контент (редактируется через CMS)
│   ├── home-*.json       # Секции лендинга
│   ├── site-settings.json
│   ├── site-products.json
│   └── legal-documents.json
├── public/admin/         # Sveltia CMS
├── src/app/              # Next.js App Router (page, layout, robots, sitemap)
├── cloudflare/           # Workers: AmoCRM, CMS OAuth
└── .github/workflows/pages.yml
```

**Локальный запуск**

```bash
npm install
npm run dev    # http://localhost:3000
npm run check  # format + lint + typecheck
npm run build  # статическая сборка -> out/
```

> Требуется Node.js 22+. Checkout и CMS-авторизация работают через внешние Cloudflare Workers.

**Деплой:** push в `main` -> GitHub Actions -> `out/` на GitHub Pages.  
**Настройка Pages:** `Settings -> Pages -> GitHub Actions`.

**Контент:** [posleslovie.online/admin/](https://posleslovie.online/admin/) -> GitHub -> Edit -> Publish (~3 мин).  
**Документация:** [`docs/decap-cms-auth-setup.md`](docs/decap-cms-auth-setup.md).

**Интеграции**

| Сервис       | Назначение                                    |
| ------------ | --------------------------------------------- |
| AmoCRM       | Форма заказа -> сделка с заметкой и вложением |
| GitHub OAuth | Авторизация в Sveltia CMS                     |

Секреты (токены AmoCRM, OAuth) хранятся только в Cloudflare Dashboard, не в репозитории.

---

## English

**A brand website for natural bath bombs** with online ordering, CRM integration, and no-code content management.

### What it does

- **Responsive design** for mobile, tablet, and desktop
- **Fast checkout flow** for personal and corporate orders (logo upload, city autocomplete, persisted form data)
- **AmoCRM integration**: each submission creates a deal with note, total, and attachments
- **No-code content editing** via Sveltia CMS (live in production in about 3 minutes)
- **Auto-deploy to GitHub Pages** on every commit to `main`
- **SEO built in**: sitemap, robots.txt, Open Graph, JSON-LD

### For developers

**Stack**

|              |                                                             |
| ------------ | ----------------------------------------------------------- |
| Frontend     | Next.js (static export), React, TypeScript, Tailwind CSS v4 |
| Content      | JSON in `content/`, Sveltia CMS                             |
| Hosting      | GitHub Pages + GitHub Actions                               |
| Integrations | Cloudflare Workers (AmoCRM, CMS OAuth)                      |

**Structure**

```text
├── content/              # JSON content (edited via CMS)
│   ├── home-*.json       # Landing sections
│   ├── site-settings.json
│   ├── site-products.json
│   └── legal-documents.json
├── public/admin/         # Sveltia CMS
├── src/app/              # Next.js App Router (page, layout, robots, sitemap)
├── cloudflare/           # Workers: AmoCRM, CMS OAuth
└── .github/workflows/pages.yml
```

**Local development**

```bash
npm install
npm run dev    # http://localhost:3000
npm run check  # format + lint + typecheck
npm run build  # static build -> out/
```

> Node.js 22+ is required. Checkout and CMS auth are handled by external Cloudflare Workers.

**Deployment:** push to `main` -> GitHub Actions -> `out/` to GitHub Pages.  
**Pages setup:** `Settings -> Pages -> GitHub Actions`.

**Content:** [posleslovie.online/admin/](https://posleslovie.online/admin/) -> GitHub -> Edit -> Publish (~3 min).  
**Docs:** [`docs/decap-cms-auth-setup.md`](docs/decap-cms-auth-setup.md).

**Integrations**

| Service      | Purpose                                        |
| ------------ | ---------------------------------------------- |
| AmoCRM       | Checkout form -> deal with note and attachment |
| GitHub OAuth | Sveltia CMS sign-in                            |

Secrets (AmoCRM tokens and OAuth credentials) are stored only in the Cloudflare Dashboard, never in the repository.

---

## License

This is a public portfolio repository for a private/commercial project.  
The code is provided for review only. Reuse, redistribution and commercial use are not allowed without permission.

See [`LICENSE.md`](LICENSE.md) for details.
