# WordPress ACF Spec and Homepage Structure

Target stack for this migration: Astra theme + WordPress core editor + ACF (free).

## Homepage structure (render order)

1. Hero
2. Feature cards (`#bombs` anchor starts at this section)
3. Process sections (3 blocks with gallery support)
4. Why us
5. About (`#about`)
6. Reviews (`#reviews`)
7. Final CTA
8. Footer with legal links

Header menu anchors must remain:

- `#bombs`
- `#about`
- `#reviews`

## ACF field groups

## 1) Field Group: `home_page_content`
Attach to: Page template `Front Page` (or page titled `Главная`).

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `hero_title` | Text | yes | maps `heading` |
| `hero_lead_line_1` | Text | yes | maps `leadLine1` |
| `hero_lead_line_2` | Text | yes | maps `leadLine2` |
| `hero_cta_label` | Text | yes | button text |
| `hero_background_image` | Image | yes | use JPG from assets pack |
| `feature_cards` | Repeater | yes | min 3 |
| `feature_cards.title` | Text | yes |  |
| `feature_cards.description` | Textarea | yes |  |
| `feature_cards.icon` | Image | yes | PNG/SVG |
| `process_sections` | Repeater | yes | min 3 |
| `process_sections.eyebrow` | Text | yes | small label |
| `process_sections.title` | Text | yes |  |
| `process_sections.description` | Textarea | yes |  |
| `process_sections.reverse_layout` | True/False | yes | maps `reverse` |
| `process_sections.gallery_key` | Select | yes | values: `bombs`, `lavender`, `packs` |
| `process_sections.button_label` | Text | no | present only for packaging block |
| `gallery_bombs` | Repeater | yes | min 3 |
| `gallery_bombs.image` | Image | yes |  |
| `gallery_bombs.alt` | Text | yes |  |
| `gallery_lavender` | Repeater | yes | min 3 |
| `gallery_lavender.image` | Image | yes |  |
| `gallery_lavender.alt` | Text | yes |  |
| `gallery_packs` | Repeater | yes | min 3 |
| `gallery_packs.image` | Image | yes |  |
| `gallery_packs.alt` | Text | yes |  |
| `why_title` | Text | yes |  |
| `why_background_image` | Image | yes |  |
| `why_items` | Repeater | yes | min 3 |
| `why_items.title` | Text | yes |  |
| `why_items.description` | Textarea | yes |  |
| `why_items.icon` | Image | yes |  |
| `about_kicker` | Text | yes | default `О нас` |
| `about_title` | Text | yes |  |
| `about_paragraph_1` | Textarea | yes |  |
| `about_paragraph_2` | Textarea | yes |  |
| `about_image` | Image | yes |  |
| `reviews_title` | Text | yes | default `Нам доверяют` |
| `reviews_items` | Repeater | yes | min 4 |
| `reviews_items.name` | Text | yes |  |
| `reviews_items.text` | Textarea | yes |  |
| `reviews_items.image` | Image | yes |  |
| `cta_heading` | Text | yes |  |
| `cta_text` | Textarea | yes |  |
| `cta_button_label` | Text | yes |  |
| `cta_background_image` | Image | yes |  |

## 2) Field Group: `site_settings`
Attach to: ACF Options page (`Theme Settings` or `Site Settings`).

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `site_phone` | Text | yes | keep click-to-call format |
| `site_email` | Email | yes |  |
| `site_socials` | Repeater | yes | min 2 |
| `site_socials.label` | Text | yes | Telegram/WhatsApp/VK |
| `site_socials.url` | URL | yes | full link |
| `contacts_address` | Text | yes | currently modal-only text |
| `contacts_inn` | Text | no | placeholder allowed |
| `contacts_ogrnip` | Text | no | placeholder allowed |
| `contacts_owner_name` | Text | yes | IP owner full name |

## 3) Field Group: `legal_documents`
Attach to: ACF Options page.

| Field key | Type | Required | Notes |
| --- | --- | --- | --- |
| `legal_documents` | Repeater | yes | min 5 |
| `legal_documents.slug` | Text | yes | keep stable slugs |
| `legal_documents.short_title` | Text | yes | footer link text |
| `legal_documents.full_title` | Text | no | for legal page heading |
| `legal_documents.pdf_file` | File | yes | PDF in Media Library |
| `legal_documents.text_body` | WYSIWYG | no | optional replacement for modal body |

## Template notes for implementation

- Keep one static front page; avoid blog layout.
- Keep modal content editable in WP options or dedicated sections.
- Footer legal links should open uploaded PDF files in new tab.
- Keep contact/social values global, not hardcoded in template.
- Use native block editor sections or a custom page template; no page builder required for MVP.

## Data parity checkpoints

- Section order and text match baseline from `src/shared/config/home-page-content.ts`.
- Footer has exactly 5 legal links (same as current `legal-documents` default).
- Phone/email/social links match `src/shared/config/site.ts` unless intentionally changed.

