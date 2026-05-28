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

<details>
<summary><b>Screenshots</b></summary>

<br>

![Главный экран](docs/screenshots/hero.png)

</details>

<details>
<summary><b>Architecture</b></summary>

<br>

```mermaid
flowchart TD
  User[Visitor] --> Site[Next.js site]
  Site --> AmoWorker[AmoCRM Worker]
  AmoWorker --> AmoCRM[AmoCRM]

  Admin[Content editor] --> CMS[Sveltia CMS]
  CMS --> OAuth[OAuth Worker]
  CMS --> GitHub[GitHub content]
  GitHub --> Actions[GitHub Actions]
  Actions --> Pages[GitHub Pages]
```

</details>

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

<details>
<summary><b>Для разработчиков</b></summary>

<br>

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

**Карта архитектуры (current boundaries)**

```text
src/
├── app/                      # entry, page composition, metadata
├── widgets/
│   └── home-sections/
│       ├── ui/               # section-level UI modules (Hero, Process, WhyUs, ...)
│       └── model/            # content mapping + runtime schemas
├── features/
│   └── checkout/
│       ├── model/            # state, validation, payload contracts, API
│       └── ui/
│           ├── CheckoutModal.tsx         # thin orchestrator
│           └── checkout-modal/*          # stepper/forms/panels/legal/lead
└── shared/
    ├── ui/                   # reusable primitives
    ├── lib/                  # pure helpers (assetPath, city, phone, structured data)
    └── config/               # typed config backed by content JSON
```

**How to demo project**

1. `npm install`
2. `npm run dev` and open [http://localhost:3000](http://localhost:3000)
3. Show key scenarios:
   - hero CTA -> checkout modal opens
   - mobile menu -> checkout action
   - partners modal -> lead submit flow
4. Before client demo run:
   - `npm run check:full`

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

**Known limitations (for transparent expectation management)**

- Modal state uses a lightweight custom event bus (`posleslovie:open-modal`) instead of router-based state.
- Some UI blocks still use native `<img>` (acceptable for current static-export scope, planned gradual optimization path).
- `cloudflare/` worker lint warnings for anonymous default export are non-blocking.

</details>

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

<details>
<summary><b>For developers</b></summary>

<br>

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

**Architecture map (current boundaries)**

```text
src/
├── app/                      # entry, page composition, metadata
├── widgets/
│   └── home-sections/
│       ├── ui/               # section-level UI modules (Hero, Process, WhyUs, ...)
│       └── model/            # content mapping + runtime schemas
├── features/
│   └── checkout/
│       ├── model/            # state, validation, payload contracts, API
│       └── ui/
│           ├── CheckoutModal.tsx         # thin orchestrator
│           └── checkout-modal/*          # stepper/forms/panels/legal/lead
└── shared/
    ├── ui/                   # reusable primitives
    ├── lib/                  # pure helpers (assetPath, city, phone, structured data)
    └── config/               # typed config backed by content JSON
```

**How to demo project**

1. `npm install`
2. `npm run dev` and open [http://localhost:3000](http://localhost:3000)
3. Show key scenarios:
   - hero CTA -> checkout modal opens
   - mobile menu -> checkout action
   - partners modal -> lead submit flow
4. Before client demo run:
   - `npm run check:full`

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

**Known limitations**

- Modal state currently uses a lightweight custom event bus (`posleslovie:open-modal`) instead of router-based state.
- Some UI blocks still use native `<img>` (acceptable for the current static-export scope, with a gradual optimization path).
- `cloudflare/` worker lint warnings for anonymous default export are non-blocking.

</details>

---

## License

This is a public portfolio repository for a private/commercial project.  
The code is provided for review only. Reuse, redistribution and commercial use are not allowed without permission.

See [`LICENSE.md`](LICENSE.md) for details.
