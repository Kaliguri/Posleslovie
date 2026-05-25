# Спецификация ACF и структура главной

Целевой стек миграции: тема Astra + стандартный редактор WordPress + ACF (бесплатная версия).

## Структура главной страницы (порядок рендера)

1. Hero
2. Карточки преимуществ (здесь начинается якорь `#bombs`)
3. Секции процесса (3 блока с поддержкой галерей)
4. Почему выбирают нас
5. О нас (`#about`)
6. Отзывы (`#reviews`)
7. Финальный CTA
8. Footer с юридическими ссылками

Якоря в меню должны сохраниться:

- `#bombs`
- `#about`
- `#reviews`

## Группы полей ACF

## 1) Группа полей: `home_page_content`
Привязка: шаблон страницы `Front Page` (или страница с названием `Главная`).

| Ключ поля | Тип | Обязательное | Примечание |
| --- | --- | --- | --- |
| `hero_title` | Text | да | соответствует `heading` |
| `hero_lead_line_1` | Text | да | соответствует `leadLine1` |
| `hero_lead_line_2` | Text | да | соответствует `leadLine2` |
| `hero_cta_label` | Text | да | текст кнопки |
| `hero_background_image` | Image | да | использовать JPG из манифеста ассетов |
| `feature_cards` | Repeater | да | минимум 3 |
| `feature_cards.title` | Text | да |  |
| `feature_cards.description` | Textarea | да |  |
| `feature_cards.icon` | Image | да | PNG/SVG |
| `process_sections` | Repeater | да | минимум 3 |
| `process_sections.eyebrow` | Text | да | короткий лейбл |
| `process_sections.title` | Text | да |  |
| `process_sections.description` | Textarea | да |  |
| `process_sections.reverse_layout` | True/False | да | соответствует `reverse` |
| `process_sections.gallery_key` | Select | да | значения: `bombs`, `lavender`, `packs` |
| `process_sections.button_label` | Text | нет | есть только у блока упаковки |
| `gallery_bombs` | Repeater | да | минимум 3 |
| `gallery_bombs.image` | Image | да |  |
| `gallery_bombs.alt` | Text | да |  |
| `gallery_lavender` | Repeater | да | минимум 3 |
| `gallery_lavender.image` | Image | да |  |
| `gallery_lavender.alt` | Text | да |  |
| `gallery_packs` | Repeater | да | минимум 3 |
| `gallery_packs.image` | Image | да |  |
| `gallery_packs.alt` | Text | да |  |
| `why_title` | Text | да |  |
| `why_background_image` | Image | да |  |
| `why_items` | Repeater | да | минимум 3 |
| `why_items.title` | Text | да |  |
| `why_items.description` | Textarea | да |  |
| `why_items.icon` | Image | да |  |
| `about_kicker` | Text | да | по умолчанию `О нас` |
| `about_title` | Text | да |  |
| `about_paragraph_1` | Textarea | да |  |
| `about_paragraph_2` | Textarea | да |  |
| `about_image` | Image | да |  |
| `reviews_title` | Text | да | по умолчанию `Нам доверяют` |
| `reviews_items` | Repeater | да | минимум 4 |
| `reviews_items.name` | Text | да |  |
| `reviews_items.text` | Textarea | да |  |
| `reviews_items.image` | Image | да |  |
| `cta_heading` | Text | да |  |
| `cta_text` | Textarea | да |  |
| `cta_button_label` | Text | да |  |
| `cta_background_image` | Image | да |  |

## 2) Группа полей: `site_settings`
Привязка: ACF Options page (`Theme Settings` или `Site Settings`).

| Ключ поля | Тип | Обязательное | Примечание |
| --- | --- | --- | --- |
| `site_phone` | Text | да | сохранить формат для click-to-call |
| `site_email` | Email | да |  |
| `site_socials` | Repeater | да | минимум 2 |
| `site_socials.label` | Text | да | Telegram/WhatsApp/VK |
| `site_socials.url` | URL | да | полный URL |
| `contacts_address` | Text | да | сейчас используется в модалке контактов |
| `contacts_inn` | Text | нет | допускается плейсхолдер |
| `contacts_ogrnip` | Text | нет | допускается плейсхолдер |
| `contacts_owner_name` | Text | да | ФИО ИП |

## 3) Группа полей: `legal_documents`
Привязка: ACF Options page.

| Ключ поля | Тип | Обязательное | Примечание |
| --- | --- | --- | --- |
| `legal_documents` | Repeater | да | минимум 5 |
| `legal_documents.slug` | Text | да | сохранить стабильные slug |
| `legal_documents.short_title` | Text | да | текст ссылки в footer |
| `legal_documents.full_title` | Text | нет | заголовок юридической страницы |
| `legal_documents.pdf_file` | File | да | PDF во вложениях Media Library |
| `legal_documents.text_body` | WYSIWYG | нет | опциональная замена текста модалок |

## Примечания по шаблону

- Использовать одну статическую главную страницу, без блога на первом экране.
- Контент модалок сделать редактируемым через Options или отдельные секции.
- Юридические ссылки в footer должны открывать загруженные PDF в новой вкладке.
- Контакты и соцсети хранить в глобальных полях, не хардкодить в шаблоне.
- Для MVP достаточно стандартного редактора блоков или кастомного шаблона страницы (без page builder).

## Контроль паритета данных

- Порядок секций и тексты совпадают с `src/shared/config/home-page-content.ts`.
- В footer ровно 5 юридических ссылок (как в текущем `legal-documents`).
- Телефон/email/соцсети совпадают с `src/shared/config/site.ts`, если не было осознанных изменений.

