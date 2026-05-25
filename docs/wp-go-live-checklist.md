# WordPress Go-Live Checklist (Budget Flow)

Target environment: `ce621296-wordpress-te82f.tw1.ru` (test domain).

This checklist is ordered and optimized for minimal manual steps.

## A) Timeweb and WordPress base setup

- [ ] WordPress installed and accessible at `/wp-login.php`.
- [ ] Admin password rotated from initial generated password.
- [ ] Theme Astra activated.
- [ ] Permalinks set to `Post name` (`Настройки -> Постоянные ссылки`).
- [ ] Search indexing disabled for test phase (`Настройки -> Чтение`).

## B) Required plugins only

- [ ] ACF installed and activated.
- [ ] Fluent Forms (or Contact Form 7) installed and activated.
- [ ] Safe SVG installed (if SVG uploads are needed).
- [ ] One cache plugin installed (`LiteSpeed Cache` or `WP Super Cache`).
- [ ] Backup plugin installed (`UpdraftPlus`).

## C) Content and field setup

- [ ] Create static page `Главная` and set as homepage.
- [ ] Build ACF groups according to `docs/wp-acf-spec.md`.
- [ ] Fill homepage content from `docs/wp-content-map.md`.
- [ ] Upload and bind all mandatory files from `docs/wp-assets-manifest.md`.
- [ ] Create/update header menu with anchors: `#bombs`, `#about`, `#reviews`.
- [ ] Fill global contacts/social/legal options.

## D) Lead form setup

- [ ] Create form according to `docs/wp-form-spec.md`.
- [ ] Configure required fields and conditional logic.
- [ ] Enable email notifications to business mailbox.
- [ ] Confirm consent text links to uploaded PDF files.

## E) QA acceptance (must pass before publish)

- [ ] Hero, cards, process, why-us, about, reviews, CTA match expected order and texts.
- [ ] Anchor navigation scroll works for `#bombs`, `#about`, `#reviews`.
- [ ] Footer contains phone, email, socials, and 5 legal PDF links.
- [ ] Form submits successfully and notification email is received.
- [ ] Mobile view checked for header, section spacing, and form usability.
- [ ] No broken images, no 404 links, and no placeholder demo content remains.

## F) Cutover and decommission readiness

- [ ] Confirm WP test site is accepted as new source of truth for content.
- [ ] Archive old CMS content DB (`backend/data/content.db`) before removal.
- [ ] Plan removal of custom CMS stack from codebase:
  - `src/app/admin/content/page.tsx`
  - `src/shared/config/cms-content-schemas.ts`
  - `backend/src/content/*`
  - CMS-related media API parts in `backend/src/media/*`
- [ ] Update project README after final switch to WordPress.

## Quick rollback plan

If a release issue appears on WP test domain:

1. Keep old project code untouched (no destructive deletions yet).
2. Restore last WordPress backup via backup plugin.
3. Re-run section/form QA only on changed blocks.

