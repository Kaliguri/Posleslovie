# Карта контента для WordPress (Фаза 1)

Этот документ сопоставляет текущую модель контента проекта с целевой моделью WordPress при полном переходе на WP.

## Источник данных до миграции

Базовый снимок контента берем из текущих frontend-конфигов:

- `src/shared/config/home-page-content.ts`
- `src/shared/config/home-hero-content.ts`
- `src/shared/config/contact-legal-content.ts`
- `src/shared/config/legal-documents.ts`
- `src/shared/ui/site-header.tsx`
- `src/shared/ui/site-footer.tsx`

`backend/prisma/schema.prisma` не использовать как источник контента для миграции. Рабочий CMS-контент сейчас хранится в SQLite (`backend/data/content.db`) через `backend/src/content/content.service.ts`.

## Сопоставление секций главной страницы

| Текущий slug/блок | Текущие поля | Цель в WordPress |
| --- | --- | --- |
| `home-hero` | `heading`, `leadLine1`, `leadLine2`, `ctaLabel`, фон hero | Поля главной: заголовок hero, 2 строки подзаголовка, текст CTA, фоновое изображение |
| `home-feature-cards` | `cards[]` с `title`, `description`, `icon` | Repeater `feature_cards` на главной |
| `home-process-sections` | `sections[]` с `eyebrow`, `title`, `description`, `reverse`, `gallery`, `button` | Repeater `process_sections`; `reverse` оставить как переключатель true/false; `gallery` оставить как ключ блока |
| `home-galleries` | `bombs[]`, `lavender[]`, `packs[]` с `image`, `alt` | Три repeater-поля: `gallery_bombs`, `gallery_lavender`, `gallery_packs` |
| `home-why-us` | `title`, `backgroundImage`, `reasons[]` | Группа `why_us` + repeater `why_items` |
| `home-about` | `kicker`, `title`, `paragraphs[]`, `image` | Группа `about` (WYSIWYG/textarea + изображение) |
| `home-reviews` | `title`, `items[]` (`name`, `text`, `image`) | Группа `reviews` + repeater `review_items` |
| `home-cta` | `heading`, `text`, `buttonLabel`, `backgroundImage` | Группа `final_cta` |
| Ссылки в header | якоря секций + модалки (`delivery`, `partners`, `contacts`) | Меню WP с теми же якорями; контент модалок выносится в блоки/части страницы |
| Контакты/соцсети/документы в footer | телефон, email, соцсети, список документов | Глобальные поля Options: `site_settings`, `legal_documents` |

## Сопоставление глобальных настроек

| Текущий блок | Текущие поля | Цель в WordPress |
| --- | --- | --- |
| `site-settings` | `phone`, `email`, `socials[]` | ACF Options: контакты и соцсети |
| `legal-documents` | `documents[]` с `slug`, `pdfPath`, `title`, `shortTitle`, `content[]` | ACF Options: repeater юридических документов с PDF-вложением и публичным названием |

## Какие блоки обязательно сохраняем

- Одностраничную структуру и якоря `#bombs`, `#about`, `#reviews`.
- Контент по доставке, партнерам и контактам как редактируемые блоки.
- PDF-ссылки на документы в footer (текущий основной сценарий).
- Глобально редактируемые телефон/email/соцсети.

## Какие изменения принимаем при миграции

- Заменяем кастомный редактор `/admin/content` на WP-админку + ACF.
- Убираем контентную загрузку через API (`NEXT_PUBLIC_API_BASE_URL`) и рендерим нативно в WordPress.
- Текст юридических модалок в приложении заменяем на страницы WordPress или PDF-ссылки (PDF обязательны).

## Что станет лишним после запуска WordPress

- `src/app/admin/content/page.tsx`
- `src/shared/config/cms-content-schemas.ts`
- `backend/src/content/*`
- `backend/src/media/*` (в части CMS-медиа)
- `backend/data/content.db` (после архивирования)

