# WordPress Content Mapping (Phase 1 Prep)

This file maps the current project content model to the target WordPress model for a full WP migration.

## Source of truth before migration

Use the current frontend defaults as the baseline snapshot:

- `src/shared/config/home-page-content.ts`
- `src/shared/config/home-hero-content.ts`
- `src/shared/config/contact-legal-content.ts`
- `src/shared/config/legal-documents.ts`
- `src/shared/ui/site-header.tsx`
- `src/shared/ui/site-footer.tsx`

Do not use `backend/prisma/schema.prisma` as content source for migration. Current runtime CMS content is in SQLite (`backend/data/content.db`) via `backend/src/content/content.service.ts`.

## Homepage section mapping

| Current slug/block | Current fields | WordPress target |
| --- | --- | --- |
| `home-hero` | `heading`, `leadLine1`, `leadLine2`, `ctaLabel`, hero bg image | Home page fields: Hero title, subtitle line 1, subtitle line 2, CTA label, Hero background image |
| `home-feature-cards` | `cards[]` with `title`, `description`, `icon` | Repeater `feature_cards` on Home page |
| `home-process-sections` | `sections[]` with `eyebrow`, `title`, `description`, `reverse`, `gallery`, `button` | Repeater `process_sections`; keep `reverse` as true/false toggle; keep gallery key for block rendering |
| `home-galleries` | `bombs[]`, `lavender[]`, `packs[]` with `image`, `alt` | Three repeaters: `gallery_bombs`, `gallery_lavender`, `gallery_packs` |
| `home-why-us` | `title`, `backgroundImage`, `reasons[]` | Group `why_us` + repeater `why_items` |
| `home-about` | `kicker`, `title`, `paragraphs[]`, `image` | Group `about` with WYSIWYG/textarea + image |
| `home-reviews` | `title`, `items[]` (`name`, `text`, `image`) | Group `reviews` + repeater `review_items` |
| `home-cta` | `heading`, `text`, `buttonLabel`, `backgroundImage` | Group `final_cta` |
| Header links | section anchors + modal triggers (`delivery`, `partners`, `contacts`) | WP menu with same anchor links; modal content moved to page blocks/partials |
| Footer contacts/social/legal | phone, email, socials, docs list | Global Options fields (`site_settings`, `legal_documents`) |

## Global settings mapping

| Current block | Current fields | WordPress target |
| --- | --- | --- |
| `site-settings` | `phone`, `email`, `socials[]` | ACF Options page: Contacts and Socials |
| `legal-documents` | `documents[]` with `slug`, `pdfPath`, `title`, `shortTitle`, `content[]` | ACF Options page: legal docs repeater with PDF attachment and public label |

## Functional content blocks to keep

- Keep one-page structure and anchor IDs: `#bombs`, `#about`, `#reviews`.
- Keep delivery, partners, contacts information as editable content blocks.
- Keep legal PDF links in footer (current behavior is PDF-first).
- Keep contact phone/email/social links globally editable.

## Behavior changes accepted in this migration

- Replace custom `/admin/content` editor with WP admin + ACF.
- Replace custom content API fetch (`NEXT_PUBLIC_API_BASE_URL`) with native WP rendering.
- Replace in-app legal modal body text with WP pages or PDF links (PDF links are mandatory).

## What becomes unnecessary after WP go-live

- `src/app/admin/content/page.tsx`
- `src/shared/config/cms-content-schemas.ts`
- `backend/src/content/*`
- `backend/src/media/*` (for CMS media usage)
- `backend/data/content.db` (archive before deletion)

