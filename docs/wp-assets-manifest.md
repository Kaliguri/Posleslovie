# WordPress Assets Manifest

Use this file to upload assets into WordPress Media Library and bind them to ACF fields.

## Upload sources

- Images: `public/images/desktop-29/*`
- Legal PDFs: `public/docs/*`

## Mandatory assets (homepage + footer)

| Source file | Target usage in WP |
| --- | --- |
| `/images/desktop-29/hero.jpg` | `hero_background_image` |
| `/images/desktop-29/icon-nature.png` | `feature_cards[0].icon`, `why_items[0].icon` |
| `/images/desktop-29/icon-gift.png` | `feature_cards[1].icon`, `why_items[2].icon` |
| `/images/desktop-29/icon-success.png` | `feature_cards[2].icon`, `why_items[1].icon` |
| `/images/desktop-29/bombs-1.jpg` | `gallery_bombs[0].image`, `about_image` default |
| `/images/desktop-29/bombs-2.jpg` | `gallery_bombs[1].image` |
| `/images/desktop-29/bombs-3.jpg` | `gallery_bombs[2].image` |
| `/images/desktop-29/product-2.svg` | `gallery_lavender[0].image` |
| `/images/desktop-29/product-1.svg` | `gallery_lavender[1].image` |
| `/images/desktop-29/product-3.svg` | `gallery_lavender[2].image` |
| `/images/desktop-29/packs-1.jpg` | `gallery_packs[0].image` |
| `/images/desktop-29/packs-2.jpg` | `gallery_packs[1].image` |
| `/images/desktop-29/packs-3.jpg` | `gallery_packs[2].image` |
| `/images/desktop-29/why-us.jpg` | `why_background_image` |
| `/images/desktop-29/review-1.svg` | `reviews_items[0].image` |
| `/images/desktop-29/review-2.svg` | `reviews_items[1].image` |
| `/images/desktop-29/review-3.svg` | `reviews_items[2].image` |
| `/images/desktop-29/review-4.svg` | `reviews_items[3].image` |
| `/images/desktop-29/cta.jpg` | `cta_background_image` |
| `/docs/privacy.pdf` | `legal_documents[privacy].pdf_file` |
| `/docs/offer.pdf` | `legal_documents[offer].pdf_file` |
| `/docs/personal-data-consent.pdf` | `legal_documents[personal-data-consent].pdf_file` |
| `/docs/personal-data-distribution.pdf` | `legal_documents[personal-data-distribution].pdf_file` |
| `/docs/marketing-consent.pdf` | `legal_documents[marketing-consent].pdf_file` |

## Decorative assets (optional but recommended)

| Source file | Current usage |
| --- | --- |
| `/images/desktop-29/stars.svg` | decorative stars in process section |
| `/images/desktop-29/crystal.png` | decorative image near process section |
| `/images/desktop-29/pero.png` | decorative image near process section |

## Duplicate/legacy variants (not required for MVP)

These files exist but are not needed if you use the default JPG/PNG/SVG set above:

- `/images/desktop-29/hero.png`
- `/images/desktop-29/hero.svg`
- `/images/desktop-29/why-us.png`
- `/images/desktop-29/why-us.svg`
- `/images/desktop-29/cta.png`
- `/images/desktop-29/cta.svg`
- `/images/desktop-29/bombs-1.png`
- `/images/desktop-29/bombs-2.png`
- `/images/desktop-29/bombs-3.png`
- `/images/desktop-29/packs-1.png`
- `/images/desktop-29/packs-2.png`
- `/images/desktop-29/packs-3.png`
- `/images/desktop-29/icon-nature.svg`
- `/images/desktop-29/icon-gift.svg`
- `/images/desktop-29/icon-success.svg`

## Recommended upload order

1. Upload all mandatory images first.
2. Upload all PDFs second.
3. Upload decorative assets if used in template.
4. Assign each uploaded file to matching ACF fields from `docs/wp-acf-spec.md`.

## URL strategy in WordPress

- Use Media Library generated URLs for all images and PDFs.
- Do not keep hardcoded `/images/...` and `/docs/...` paths in WP templates.
- For legal docs, link to attached PDF file URL from the `legal_documents` repeater.

