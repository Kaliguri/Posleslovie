# Манифест ассетов для WordPress

Используй этот файл, чтобы загрузить ассеты в Media Library WordPress и привязать их к ACF-полям.

## Источники загрузки

- Изображения: `public/images/desktop-29/*`
- Юридические PDF: `public/docs/*`

## Обязательные ассеты (главная + footer)

| Исходный файл | Использование в WP |
| --- | --- |
| `/images/desktop-29/hero.jpg` | `hero_background_image` |
| `/images/desktop-29/icon-nature.png` | `feature_cards[0].icon`, `why_items[0].icon` |
| `/images/desktop-29/icon-gift.png` | `feature_cards[1].icon`, `why_items[2].icon` |
| `/images/desktop-29/icon-success.png` | `feature_cards[2].icon`, `why_items[1].icon` |
| `/images/desktop-29/bombs-1.jpg` | `gallery_bombs[0].image`, базовый `about_image` |
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

## Декоративные ассеты (опционально, но желательно)

| Исходный файл | Текущее использование |
| --- | --- |
| `/images/desktop-29/stars.svg` | декоративные звезды в секции процесса |
| `/images/desktop-29/crystal.png` | декоративное изображение рядом с секцией процесса |
| `/images/desktop-29/pero.png` | декоративное изображение рядом с секцией процесса |

## Дубли/legacy-варианты (для MVP не нужны)

Эти файлы есть в проекте, но не обязательны, если используешь основной набор JPG/PNG/SVG выше:

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

## Рекомендуемый порядок загрузки

1. Сначала загрузи все обязательные изображения.
2. Затем загрузи все PDF.
3. Потом загрузи декоративные ассеты (если используешь их в шаблоне).
4. Привяжи каждый загруженный файл к соответствующим ACF-полям из `docs/wp-acf-spec.md`.

## Стратегия URL в WordPress

- Для изображений и PDF использовать URL из Media Library.
- Не оставлять хардкодные пути вида `/images/...` и `/docs/...` в WP-шаблонах.
- Для юридических документов в footer брать URL файла из repeater `legal_documents`.

