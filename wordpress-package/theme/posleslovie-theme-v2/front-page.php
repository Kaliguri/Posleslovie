<?php
if (!defined('ABSPATH')) { exit; }

$d = ps_get_default_content();

function ps_mk_img($acf_key, $mediakit_path) {
    $val = ps_get_acf($acf_key);
    if ($val) return ps_image_url($val);
    return get_template_directory_uri() . '/assets/media-kit/' . $mediakit_path;
}
function ps_json_field($acf_key, $default) {
    $raw = ps_get_acf($acf_key);
    if ($raw) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded) && count($decoded) > 0) return $decoded;
    }
    return $default;
}

// Site-wide
$phone     = ps_get_acf('site_phone', $d['site']['phone']);
$phone_raw = preg_replace('/[^0-9+]/', '', $phone);
$email     = ps_get_acf('site_email', $d['site']['email']);
$socials   = ps_json_field('site_socials_json', $d['site']['socials']);
$legal     = ps_json_field('legal_documents_json', $d['legal']);

// Hero
$hero_title = ps_get_acf('hero_title',       $d['hero']['title']);
$hero_lead1 = ps_get_acf('hero_lead_line_1', $d['hero']['lead_1']);
$hero_lead2 = ps_get_acf('hero_lead_line_2', $d['hero']['lead_2']);
$hero_cta   = ps_get_acf('hero_cta_label',   $d['hero']['button']);
$hero_bg    = ps_mk_img('hero_background_image', 'images/hero/home-hero-bg.jpg');

// Feature cards
$feature_cards = ps_json_field('feature_cards_json', $d['feature_cards']);

// Process sections
$process_sections = ps_json_field('process_sections_json', $d['process_sections']);
$gallery_map = [
    'bombs'    => ps_json_field('gallery_bombs_json',   $d['gallery_bombs']),
    'lavender' => ps_json_field('gallery_lavender_json', $d['gallery_lavender']),
    'packs'    => ps_json_field('gallery_packs_json',   $d['gallery_packs']),
];
$gallery_mediakit = [
    'bombs'    => ['images/galleries/bombs/bombs-handmade-01.jpg','images/galleries/bombs/bombs-handmade-02.jpg','images/galleries/bombs/bombs-handmade-03.jpg'],
    'lavender' => ['images/galleries/lavender/lavender-story-01.svg','images/galleries/lavender/lavender-story-02.svg','images/galleries/lavender/lavender-story-03.svg'],
    'packs'    => ['images/galleries/packs/packaging-set-01.jpg','images/galleries/packs/packaging-set-02.jpg','images/galleries/packs/packaging-set-03.jpg'],
];

// Why Us
$why_title = ps_get_acf('why_title', $d['why']['title']);
$why_bg    = ps_mk_img('why_background_image', 'images/sections/why/why-us-bg.jpg');
$why_items = ps_json_field('why_items_json', $d['why']['items']);

// About
$about_kicker = ps_get_acf('about_kicker',      $d['about']['kicker']);
$about_title  = ps_get_acf('about_title',       $d['about']['title']);
$about_p1     = ps_get_acf('about_paragraph_1', $d['about']['paragraph_1']);
$about_p2     = ps_get_acf('about_paragraph_2', $d['about']['paragraph_2']);
$about_img    = ps_mk_img('about_image', 'images/galleries/bombs/bombs-handmade-01.jpg');

// Reviews
$reviews_title = ps_get_acf('reviews_title', $d['reviews']['title']);
$reviews_items = ps_json_field('reviews_items_json', $d['reviews']['items']);

// CTA
$cta_heading = ps_get_acf('cta_heading',      $d['cta']['heading']);
$cta_text    = ps_get_acf('cta_text',         $d['cta']['text']);
$cta_button  = ps_get_acf('cta_button_label', $d['cta']['button']);
$cta_bg      = ps_mk_img('cta_background_image', 'images/sections/cta/cta-bg.jpg');

$star_row_url   = get_template_directory_uri() . '/assets/media-kit/images/decor/stars-row.svg';
$mk_base        = get_template_directory_uri() . '/assets/media-kit/';
$bombs2_url     = get_template_directory_uri() . '/assets/media/images/desktop-29/bombs-2.jpg';

get_header();
?>
<div class="ps-page-wrap">

<!-- ==================== HEADER ==================== -->
<header class="ps-header">
    <div class="ps-container--wide">
        <div class="ps-header__inner">
            <!-- Gold rule -->
            <div class="header-rule" aria-hidden="true">
                <span class="gold-rule__diamond"></span>
                <span class="gold-rule__line"></span>
                <span class="gold-rule__diamond"></span>
            </div>

            <!-- Hamburger -->
            <button type="button" class="ps-hamburger" id="js-hamburger" aria-label="Открыть меню" aria-expanded="false" aria-controls="js-mobile-menu">
                <span class="ps-hamburger__lines" aria-hidden="true">
                    <span class="ps-hamburger__line"></span>
                    <span class="ps-hamburger__line"></span>
                    <span class="ps-hamburger__line"></span>
                </span>
            </button>

            <!-- Logo -->
            <a href="<?php echo esc_url(home_url('/')); ?>" class="ps-logo">
                <span class="ps-logo__mark">П.С</span>
                <span class="ps-logo__name"><?php echo esc_html(get_bloginfo('name')); ?></span>
            </a>

            <!-- Phone mobile -->
            <a href="tel:<?php echo esc_attr($phone_raw); ?>" class="ps-header-phone-btn" aria-label="Позвонить <?php echo esc_attr($phone); ?>">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>

            <!-- Phone desktop -->
            <a href="tel:<?php echo esc_attr($phone_raw); ?>" class="ps-header-phone-text"><?php echo esc_html($phone); ?></a>
        </div>

        <!-- Desktop nav -->
        <nav class="ps-nav" aria-label="Основная навигация">
            <button type="button" class="ps-nav__pill" data-scroll="bombs">
                <span class="ps-nav__pill-text-wrap">
                    <span class="ps-nav__pill-label">Бомбочки</span>
                    <span class="ps-nav__pill-diamond" aria-hidden="true"></span>
                </span>
            </button>
            <button type="button" class="ps-nav__pill" data-scroll="about">
                <span class="ps-nav__pill-text-wrap">
                    <span class="ps-nav__pill-label">О нас</span>
                    <span class="ps-nav__pill-diamond" aria-hidden="true"></span>
                </span>
            </button>
            <button type="button" class="ps-nav__pill" data-scroll="reviews">
                <span class="ps-nav__pill-text-wrap">
                    <span class="ps-nav__pill-label">Отзывы</span>
                    <span class="ps-nav__pill-diamond" aria-hidden="true"></span>
                </span>
            </button>
            <button type="button" class="ps-nav__pill" data-modal="delivery">
                <span class="ps-nav__pill-text-wrap">
                    <span class="ps-nav__pill-label">Оплата и доставка</span>
                    <span class="ps-nav__pill-diamond" aria-hidden="true"></span>
                </span>
            </button>
            <button type="button" class="ps-nav__pill" data-modal="partners">
                <span class="ps-nav__pill-text-wrap">
                    <span class="ps-nav__pill-label">Для партнеров</span>
                    <span class="ps-nav__pill-diamond" aria-hidden="true"></span>
                </span>
            </button>
            <button type="button" class="ps-nav__pill" data-modal="contacts">
                <span class="ps-nav__pill-text-wrap">
                    <span class="ps-nav__pill-label">Контакты</span>
                    <span class="ps-nav__pill-diamond" aria-hidden="true"></span>
                </span>
            </button>
        </nav>
    </div>
</header>

<!-- Mobile menu -->
<div class="ps-mobile-menu" id="js-mobile-menu" aria-hidden="true">
    <nav class="ps-mobile-menu__nav" aria-label="Мобильная навигация">
        <button type="button" class="ps-mobile-menu__btn" data-scroll="bombs" data-close-menu>Бомбочки</button>
        <button type="button" class="ps-mobile-menu__btn" data-scroll="about" data-close-menu>О нас</button>
        <button type="button" class="ps-mobile-menu__btn" data-scroll="reviews" data-close-menu>Отзывы</button>
        <button type="button" class="ps-mobile-menu__btn" data-modal="delivery" data-close-menu>Оплата и доставка</button>
        <button type="button" class="ps-mobile-menu__btn" data-modal="partners" data-close-menu>Для партнеров</button>
        <button type="button" class="ps-mobile-menu__btn" data-modal="contacts" data-close-menu>Контакты</button>
        <button type="button" class="ps-mobile-menu__cta" data-modal="checkout" data-close-menu>Оформить заказ</button>
        <a href="tel:<?php echo esc_attr($phone_raw); ?>" class="ps-mobile-menu__phone"><?php echo esc_html($phone); ?></a>
    </nav>
</div>

<!-- ==================== HERO ==================== -->
<section class="ps-hero">
    <div class="ps-hero__bg" style="background-image:url('<?php echo esc_url($hero_bg); ?>')"></div>
    <div class="ps-hero__overlay"></div>
    <div class="ps-hero__blur-panel"></div>
    <div class="ps-hero__content">
        <div class="ps-hero__inner">
            <h1 class="ps-hero__title"><?php echo esc_html($hero_title); ?></h1>
            <p class="ps-hero__leads">
                <span><?php echo esc_html($hero_lead1); ?></span>
                <span><?php echo esc_html($hero_lead2); ?></span>
            </p>
            <div class="ps-hero__cta">
                <button type="button" class="ps-btn ps-btn--xl ps-btn--filled" data-modal="checkout">
                    <?php echo esc_html($hero_cta); ?>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        </div>
    </div>
</section>

<!-- ==================== FEATURE CARDS ==================== -->
<section id="bombs" class="ps-bombs-section">
    <div class="ps-bombs-card">
        <div class="ps-section-heading ps-section-heading--centered">
            <h2 class="ps-section-heading__title">Дарите настроение и заботу тем, кто вам важен и дорог</h2>
            <div class="gold-rule gold-rule--centered" aria-hidden="true">
                <span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span>
            </div>
        </div>
        <div class="ps-feature-grid">
            <?php foreach ($feature_cards as $card) :
                $icon_src = ps_image_url($card['icon'] ?? '', '');
                if (!$icon_src && isset($card['icon'])) {
                    $icon_src = $mk_base . 'images/icons/' . basename($card['icon']);
                }
            ?>
            <article class="ps-feature-card">
                <?php if ($icon_src) : ?>
                <div class="ps-icon-image" style="background-image:url('<?php echo esc_url($icon_src); ?>')" aria-hidden="true"></div>
                <?php endif; ?>
                <h3 class="ps-feature-card__title"><?php echo esc_html($card['title'] ?? ''); ?></h3>
                <p class="ps-feature-card__desc"><?php echo esc_html($card['description'] ?? ''); ?></p>
            </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ==================== PROCESS SECTIONS ==================== -->
<?php foreach ($process_sections as $idx => $proc) :
    $reverse     = !empty($proc['reverse']);
    $gallery_key = $proc['gallery_key'] ?? ($proc['gallery'] ?? 'bombs');
    $slides      = $gallery_map[$gallery_key] ?? [];
    $mk_paths    = $gallery_mediakit[$gallery_key] ?? [];
    $btn_label   = $proc['button_label'] ?? ($proc['button'] ?? '');
    $gallery_id  = 'carousel-' . $idx;
?>
<section class="ps-process-section">
    <div class="ps-process-card">
        <!-- Blend overlay -->
        <div class="ps-process-blend <?php echo $reverse ? 'ps-process-blend--reverse' : 'ps-process-blend--normal'; ?>" aria-hidden="true">
            <?php if ($reverse) : ?>
                <div class="ps-process-blend__fill"></div>
                <div class="ps-process-blend__white"></div>
            <?php else : ?>
                <div class="ps-process-blend__white"></div>
                <div class="ps-process-blend__fill"></div>
            <?php endif; ?>
        </div>
        <!-- Decor -->
        <?php if ($idx === 0) : ?>
        <img src="<?php echo esc_url($mk_base . 'images/decor/crystal-accent.png'); ?>" alt="" aria-hidden="true" class="ps-process-decor ps-process-decor--crystal">
        <?php elseif ($idx === 2) : ?>
        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/media/images/desktop-29/pero.png'); ?>" alt="" aria-hidden="true" class="ps-process-decor ps-process-decor--pero">
        <?php endif; ?>

        <div class="ps-process-inner">
            <!-- Gallery -->
            <div class="ps-gallery <?php echo $reverse ? 'ps-gallery--reverse' : ''; ?>" data-carousel="<?php echo esc_attr($gallery_id); ?>">
                <div class="ps-tape-wrap">
                    <div class="ps-tape" id="<?php echo esc_attr($gallery_id); ?>-tape">
                        <?php foreach ($slides as $si => $img) :
                            $img_url = ps_image_url($img['image'] ?? '', '');
                            if (!$img_url && isset($mk_paths[$si])) {
                                $img_url = $mk_base . $mk_paths[$si];
                            }
                        ?>
                        <div class="ps-tape__slide zoom-frame">
                            <div class="ps-tape__img zoom-media" style="background-image:url('<?php echo esc_url($img_url); ?>')" role="img" aria-label="<?php echo esc_attr($img['alt'] ?? ''); ?>"></div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="ps-gallery__arrows">
                    <button type="button" class="ps-arrow-btn ps-arrow-btn--left" data-carousel-prev="<?php echo esc_attr($gallery_id); ?>" aria-label="Предыдущий слайд">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button type="button" class="ps-arrow-btn" data-carousel-next="<?php echo esc_attr($gallery_id); ?>" aria-label="Следующий слайд">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="ps-process-content <?php echo $reverse ? 'ps-process-content--reverse' : ''; ?>" style="max-width:552px">
                <p class="ps-kicker"><?php echo esc_html($proc['eyebrow'] ?? ''); ?></p>
                <h2 class="ps-process-content__title"><?php echo esc_html($proc['title'] ?? ''); ?></h2>
                <div class="gold-rule" aria-hidden="true">
                    <span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span>
                </div>
                <p class="ps-process-content__desc"><?php echo esc_html($proc['description'] ?? ''); ?></p>
                <?php if ($btn_label) : ?>
                <div class="ps-process-content__btn">
                    <button type="button" class="ps-btn" data-modal="checkout">
                        <?php echo esc_html($btn_label); ?>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
<?php endforeach; ?>

<!-- ==================== WHY US ==================== -->
<section class="ps-why-section" style="background-image:url('<?php echo esc_url($why_bg); ?>')">
    <div class="ps-why-overlay"></div>
    <div class="ps-why-inner">
        <div class="ps-section-heading ps-section-heading--centered">
            <p class="ps-kicker">Преимущества</p>
            <h2 class="ps-section-heading__title ps-section-heading__title--light"><?php echo esc_html($why_title); ?></h2>
            <div class="gold-rule gold-rule--centered" aria-hidden="true">
                <span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span>
            </div>
        </div>
        <div class="ps-why-grid">
            <?php foreach ($why_items as $item) :
                $icon_src = ps_image_url($item['icon'] ?? '', '');
                if (!$icon_src && isset($item['icon'])) {
                    $icon_src = $mk_base . 'images/icons/' . basename($item['icon']);
                }
            ?>
            <article class="ps-why-item">
                <?php if ($icon_src) : ?>
                <div class="ps-icon-image" style="background-image:url('<?php echo esc_url($icon_src); ?>');filter:brightness(0) invert(1)" aria-hidden="true"></div>
                <?php endif; ?>
                <h3 class="ps-why-item__title"><?php echo esc_html($item['title'] ?? ''); ?></h3>
                <p class="ps-why-item__desc"><?php echo esc_html($item['description'] ?? ''); ?></p>
            </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- ==================== ABOUT ==================== -->
<section id="about" class="ps-about-section">
    <div class="ps-about-card">
        <div class="ps-about-inner">
            <div class="ps-about-text">
                <p class="ps-kicker"><?php echo esc_html($about_kicker); ?></p>
                <h2 class="ps-about-title"><?php echo esc_html($about_title); ?></h2>
                <div class="gold-rule" aria-hidden="true">
                    <span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span>
                </div>
                <div class="ps-about-paragraphs">
                    <p><?php echo esc_html($about_p1); ?></p>
                    <?php if ($about_p2) : ?><p><?php echo esc_html($about_p2); ?></p><?php endif; ?>
                </div>
            </div>
            <div class="ps-about-image zoom-frame">
                <div class="zoom-media" style="height:100%;width:100%;background-image:url('<?php echo esc_url($about_img); ?>');background-size:cover;background-position:center" aria-label="Бомбочки Послесловие" role="img"></div>
            </div>
        </div>
    </div>
</section>

<!-- ==================== REVIEWS ==================== -->
<section id="reviews" class="ps-reviews-section">
    <div class="ps-reviews-inner">
        <div class="ps-section-heading ps-section-heading--centered">
            <p class="ps-kicker">Отзывы</p>
            <h2 class="ps-section-heading__title"><?php echo esc_html($reviews_title); ?></h2>
            <div class="gold-rule gold-rule--centered" aria-hidden="true">
                <span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span>
            </div>
        </div>
        <div class="ps-reviews-carousel-wrap">
            <div class="ps-reviews-tape" id="reviews-tape">
                <?php foreach ($reviews_items as $ri => $review) :
                    $avatar_raw = $review['image'] ?? '';
                    $avatar_url = ps_image_url($avatar_raw, '');
                    if (!$avatar_url) {
                        $n = ($ri % 4) + 1;
                        $avatar_url = $mk_base . 'images/reviews/review-avatar-0' . $n . '.svg';
                    }
                ?>
                <article class="ps-review-card">
                    <div>
                        <div class="ps-review-image">
                            <div style="height:100%;background-image:url('<?php echo esc_url($avatar_url); ?>');background-size:cover;background-position:center"></div>
                        </div>
                        <div class="ps-review-stars" style="background-image:url('<?php echo esc_url($star_row_url); ?>')" aria-label="5 звезд"></div>
                        <p class="ps-review-text"><?php echo esc_html($review['text'] ?? ''); ?></p>
                    </div>
                    <p class="ps-review-author"><?php echo esc_html($review['name'] ?? ''); ?></p>
                </article>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="ps-reviews-arrows">
            <button type="button" class="ps-arrow-btn ps-arrow-btn--left" id="reviews-prev" aria-label="Предыдущий отзыв">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button type="button" class="ps-arrow-btn" id="reviews-next" aria-label="Следующий отзыв">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
    </div>
</section>

<!-- ==================== CTA ==================== -->
<section class="ps-cta-section" style="background-image:linear-gradient(0deg,rgba(14,17,50,0.3),rgba(14,17,50,0.3)),url('<?php echo esc_url($cta_bg); ?>')">
    <div class="ps-cta-inner">
        <h2 class="ps-cta-title"><?php echo esc_html($cta_heading); ?></h2>
        <p class="ps-cta-text"><?php echo esc_html($cta_text); ?></p>
        <div class="ps-cta-btn">
            <button type="button" class="ps-btn ps-btn--xl" data-modal="checkout">
                <?php echo esc_html($cta_button); ?>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
    </div>
</section>

<!-- ==================== SCROLL TO TOP ==================== -->
<button type="button" class="ps-scroll-top" id="js-scroll-top" aria-label="Наверх">
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>

<!-- ==================== FOOTER ==================== -->
<footer id="contacts" class="ps-footer">
    <div class="ps-container--footer" style="padding-top:40px;padding-bottom:40px">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="ps-footer__logo">
            <span class="ps-footer__logo-mark">П.С</span>
            <span class="ps-footer__logo-name"><?php echo esc_html(get_bloginfo('name')); ?></span>
        </a>
        <div class="ps-footer__meta">
            <p style="flex:1">@ 2026 <?php echo esc_html(get_bloginfo('name')); ?></p>
            <div class="ps-footer__contact-row">
                <a href="tel:<?php echo esc_attr($phone_raw); ?>"><?php echo esc_html($phone); ?></a>
                <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
            </div>
            <?php if ($socials) : ?>
            <div class="ps-footer__socials">
                <?php foreach ($socials as $s) : ?>
                <a href="<?php echo esc_url($s['url'] ?? $s['href'] ?? '#'); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($s['label']); ?></a>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>
        <?php if ($legal) : ?>
        <div class="ps-footer__legal">
            <?php foreach ($legal as $doc) :
                $file = $doc['file'] ?? ($doc['pdfPath'] ?? '');
                if (strpos($file, '/docs/') === 0) {
                    $file_url = get_template_directory_uri() . '/assets/media-kit/docs/legal' . substr($file, 5);
                } else {
                    $file_url = $file;
                }
            ?>
            <a href="<?php echo esc_url($file_url); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($doc['short_title'] ?? $doc['shortTitle'] ?? ''); ?></a>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</footer>

<!-- ==================== MODALS ==================== -->

<!-- DELIVERY MODAL -->
<div class="ps-modal-overlay" id="modal-delivery" role="dialog" aria-modal="true" aria-labelledby="modal-delivery-title">
    <div class="ps-modal-dialog">
        <div class="ps-modal-header">
            <button type="button" class="ps-modal-close" data-modal-close aria-label="Закрыть">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <div class="ps-modal-header__inner">
                <p class="ps-kicker">Оплата и доставка</p>
                <h2 class="ps-modal-title" id="modal-delivery-title">Условия оплаты и доставки</h2>
                <div class="gold-rule" aria-hidden="true"><span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span></div>
            </div>
        </div>
        <div class="ps-modal-body modal-scroll">
            <div class="delivery-blocks">
                <section class="info-block"><h3>1. Оплата</h3><p>Доступны СБП, банковская карта и оплата при получении. Онлайн-оплата будет подключаться через отдельный backend, потому что GitHub Pages обслуживает только статические файлы.</p></section>
                <section class="info-block"><h3>2. Способы доставки</h3><p>При оформлении заказа доступны курьерская доставка до двери, доставка в пункт выдачи и постамат через сервисы доставки. Стоимость зависит от адреса, веса и объёма заказа.</p></section>
                <section class="info-block"><h3>3. Сроки</h3><p>После подтверждения заказа менеджер согласует удобный интервал и финальные детали упаковки.</p></section>
            </div>
        </div>
    </div>
</div>

<!-- PARTNERS MODAL -->
<div class="ps-modal-overlay" id="modal-partners" role="dialog" aria-modal="true" aria-labelledby="modal-partners-title">
    <div class="ps-modal-dialog">
        <div class="ps-modal-header">
            <button type="button" class="ps-modal-close" data-modal-close aria-label="Закрыть">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <div class="ps-modal-header__inner">
                <p class="ps-kicker">Партнерство</p>
                <h2 class="ps-modal-title" id="modal-partners-title">Хотите стать нашим партнером?</h2>
                <div class="gold-rule" aria-hidden="true"><span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span></div>
            </div>
        </div>
        <div class="ps-modal-body modal-scroll">
            <div class="partners-content">
                <p>Предлагаем выгодные условия для региональных дистрибьюторов, розничных магазинов и селлеров. Расширьте свой ассортимент продуктом, который продает сам себя.</p>
                <p class="highlight">Оставьте заявку и мы свяжемся с вами, чтобы обсудить все детали</p>
                <div class="gold-rule" aria-hidden="true"><span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span></div>
                <form class="lead-form" id="partners-form">
                    <div class="lead-form-row">
                        <label class="form-field"><span class="form-field__label">Имя</span><input type="text" name="name" placeholder="Ваше имя" class="form-field__input" autocomplete="name"></label>
                        <label class="form-field"><span class="form-field__label">Телефон</span><input type="tel" name="phone" placeholder="+7 (000) 000-00-00" class="form-field__input" autocomplete="tel"></label>
                    </div>
                    <label class="form-field"><span class="form-field__label">Email</span><input type="email" name="email" placeholder="Ваш email" class="form-field__input" autocomplete="email"></label>
                    <label class="form-field"><span class="form-field__label">Компания</span><input type="text" name="company" placeholder="Название компании" class="form-field__input" autocomplete="organization"></label>
                    <label class="form-field"><span class="form-field__label">Как с вами удобнее связаться?</span><input type="text" name="contact" placeholder="Телеграм" class="form-field__input"></label>
                    <label class="lead-form-consent">
                        <input type="checkbox" class="lead-form-consent__check">
                        <span>Нажимая на кнопку, вы соглашаетесь с обработкой <u>персональных данных</u>. Ознакомлены с <u>политикой конфиденциальности</u></span>
                    </label>
                    <button type="submit" class="lead-form-submit">
                        Стать партнером
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <div id="partners-message" style="display:none" class="checkout-message"></div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- CONTACTS MODAL -->
<div class="ps-modal-overlay" id="modal-contacts" role="dialog" aria-modal="true" aria-labelledby="modal-contacts-title">
    <div class="ps-modal-dialog">
        <div class="ps-modal-header">
            <button type="button" class="ps-modal-close" data-modal-close aria-label="Закрыть">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <div class="ps-modal-header__inner">
                <p class="ps-kicker">Контактные данные</p>
                <h2 class="ps-modal-title" id="modal-contacts-title">Свяжитесь с нами</h2>
                <div class="gold-rule" aria-hidden="true"><span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span></div>
            </div>
        </div>
        <div class="ps-modal-body modal-scroll">
            <dl class="contacts-grid">
                <div class="contact-item"><dt>Телефон</dt><dd><a href="tel:<?php echo esc_attr($phone_raw); ?>"><?php echo esc_html($phone); ?></a></dd></div>
                <div class="contact-item"><dt>Почта</dt><dd><a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a></dd></div>
                <div class="contact-item"><dt>Адрес</dt><dd>г. Севастополь, ул. Бориса Михайлова 3А, кв. 44</dd></div>
                <div class="contacts-row">
                    <div class="contact-item contact-item--compact"><dt>ИНН</dt><dd>Будет указан после открытия ИП</dd></div>
                    <div class="contact-item contact-item--compact"><dt>ОГРНИП</dt><dd>Будет указан после открытия ИП</dd></div>
                </div>
                <div class="contact-item"><dt>ИП</dt><dd>Серебренникова Полина Кирилловна</dd></div>
            </dl>
        </div>
    </div>
</div>

<!-- CHECKOUT MODAL -->
<div class="ps-modal-overlay" id="modal-checkout" role="dialog" aria-modal="true" aria-labelledby="modal-checkout-title">
    <div class="ps-modal-dialog">
        <div class="ps-modal-header">
            <button type="button" class="ps-modal-close" data-modal-close aria-label="Закрыть">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <div class="ps-modal-header__inner">
                <p class="ps-kicker">Оформление заказа</p>
                <h2 class="ps-modal-title" id="modal-checkout-title">Бомбочка для ванны</h2>
                <div class="gold-rule" aria-hidden="true"><span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span></div>
            </div>
            <!-- Tab bar -->
            <div class="checkout-tab-bar">
                <button type="button" class="checkout-back-btn checkout-back-btn--disabled" id="checkout-back" disabled title="Back to step 1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <div class="checkout-tabs">
                    <button type="button" class="checkout-tab checkout-tab--active" id="tab-personal">Для себя</button>
                    <button type="button" class="checkout-tab" id="tab-company">Для компании</button>
                </div>
            </div>
        </div>
        <div class="ps-modal-body modal-scroll" id="checkout-body">
            <div class="checkout-grid">
                <!-- LEFT: form steps -->
                <div id="checkout-form-col">
                    <!-- Step 1 -->
                    <div id="checkout-step1">
                        <h3 class="checkout-step-title">Контактная информация</h3>
                        <div class="checkout-divider"></div>
                        <div class="checkout-fields">
                            <div id="checkout-error-summary" style="display:none" class="form-error-summary"></div>
                            <div class="checkout-fields-row">
                                <label class="form-field" id="field-name-wrap">
                                    <span class="form-field__label">Имя <span class="form-field__required">*</span></span>
                                    <input type="text" id="field-name" class="form-field__input" placeholder="Ваше имя" autocomplete="name">
                                    <span class="form-field__error" id="err-name" style="display:none"></span>
                                </label>
                                <label class="form-field" id="field-phone-wrap">
                                    <span class="form-field__label">Телефон <span class="form-field__required">*</span></span>
                                    <input type="tel" id="field-phone" class="form-field__input" placeholder="+7 (000) 000-00-00" autocomplete="tel" inputmode="tel">
                                    <span class="form-field__error" id="err-phone" style="display:none"></span>
                                </label>
                            </div>
                            <label class="form-field" id="field-email-wrap">
                                <span class="form-field__label">Email <span class="form-field__required">*</span></span>
                                <input type="email" id="field-email" class="form-field__input" placeholder="Ваш email" autocomplete="email">
                                <span class="form-field__error" id="err-email" style="display:none"></span>
                            </label>
                            <!-- Company fields (hidden for personal) -->
                            <div id="company-fields" style="display:none">
                                <div style="display:grid;gap:12px">
                                    <label class="form-field" id="field-company-wrap">
                                        <span class="form-field__label">Компания <span class="form-field__required">*</span></span>
                                        <input type="text" id="field-company" class="form-field__input" placeholder="Название компании" autocomplete="organization">
                                        <span class="form-field__error" id="err-company" style="display:none"></span>
                                    </label>
                                    <div class="checkout-fields-row">
                                        <label class="form-field"><span class="form-field__label">ИНН</span><input type="text" id="field-inn" class="form-field__input" placeholder="ИНН" inputmode="numeric"></label>
                                        <label class="form-field"><span class="form-field__label">ОГРН</span><input type="text" id="field-ogrn" class="form-field__input" placeholder="ОГРН" inputmode="numeric"></label>
                                    </div>
                                </div>
                            </div>
                            <div class="checkout-fields-row">
                                <div class="form-field form-field--select">
                                    <span class="form-field__label">Как с вами удобнее связаться?</span>
                                    <select id="field-contact-method" class="form-field__select">
                                        <option value="tg">Telegram</option>
                                        <option value="max">MAX</option>
                                    </select>
                                </div>
                                <label class="form-field" id="field-handle-wrap">
                                    <span class="form-field__label">Ник (TG) <span class="form-field__required" id="handle-required">*</span></span>
                                    <input type="text" id="field-handle" class="form-field__input" placeholder="@username">
                                    <span class="form-field__error" id="err-handle" style="display:none"></span>
                                </label>
                            </div>
                            <!-- City (personal) -->
                            <div id="city-field-wrap">
                                <div class="city-dropdown-wrap">
                                    <label class="form-field" id="field-city-wrap">
                                        <span class="form-field__label">Город доставки <span class="form-field__required">*</span></span>
                                        <input type="text" id="field-city" class="form-field__input" placeholder="Москва" autocomplete="off" aria-autocomplete="list">
                                        <span class="form-field__error" id="err-city" style="display:none"></span>
                                    </label>
                                    <div class="city-dropdown" id="city-dropdown">
                                        <div class="city-dropdown__list" id="city-list"></div>
                                        <p class="city-dropdown__hint">Выберите город из списка</p>
                                    </div>
                                </div>
                            </div>
                            <!-- Comment (company tab, step 1) -->
                            <div id="company-comment-wrap" style="display:none">
                                <label class="form-field"><span class="form-field__label">Комментарий к заказу</span><textarea id="field-comment-company" class="form-field__textarea" rows="4" placeholder="Комментарии, которые помогут нам лучше узнать о задаче"></textarea></label>
                            </div>
                            <p class="required-note"><strong>*</strong> обязательные поля</p>
                            <button type="button" class="checkout-submit-btn" id="checkout-continue">
                                Продолжить оформление
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </button>
                        </div>
                    </div>
                    <!-- Step 2 -->
                    <div id="checkout-step2" style="display:none">
                        <h3 class="checkout-step-title">Пожелания в подарок</h3>
                        <div class="checkout-divider"></div>
                        <div class="checkout-fields">
                            <div id="checkout-error-summary2" style="display:none" class="form-error-summary"></div>
                            <!-- Logo upload -->
                            <div class="logo-field" id="logo-field-wrap">
                                <p class="logo-field__title">Логотип</p>
                                <p class="logo-field__hint" id="logo-hint">Файлы формата .jpg .png не больше 3мб</p>
                                <span class="form-field__error" id="err-logo" style="display:none"></span>
                                <label class="logo-field__btn" title="Upload logo file">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    <input type="file" id="field-logo" accept=".jpg,.jpeg,.png,image/jpeg,image/png" style="display:none">
                                </label>
                            </div>
                            <!-- Artist -->
                            <div class="artist-field">
                                <p class="artist-field__title">Выбор художника</p>
                                <select id="field-artist" class="artist-field__select">
                                    <option value="">Художник 1</option>
                                    <option value="artist2">Художник 2</option>
                                    <option value="artist3">Художник 3</option>
                                </select>
                            </div>
                            <!-- Seal color -->
                            <div class="seal-field">
                                <p class="seal-field__title">Цвет сургутной печати</p>
                                <p class="seal-field__hint">Фото не является эталонным продуктом*</p>
                                <div class="seal-swatches">
                                    <button type="button" class="seal-swatch is-active" data-seal="red"><span class="seal-swatch__color" style="background:#b03020"></span><span class="seal-swatch__label">Красный</span></button>
                                    <button type="button" class="seal-swatch" data-seal="green"><span class="seal-swatch__color" style="background:#2e7d32"></span><span class="seal-swatch__label">Зелёный</span></button>
                                    <button type="button" class="seal-swatch" data-seal="white"><span class="seal-swatch__color" style="background:#e8e6e1"></span><span class="seal-swatch__label">Белый</span></button>
                                    <button type="button" class="seal-swatch" data-seal="blue"><span class="seal-swatch__color" style="background:#1565c0"></span><span class="seal-swatch__label">Синий</span></button>
                                </div>
                            </div>
                            <!-- Comment -->
                            <label class="form-field"><span class="form-field__label">Комментарий к заказу</span><textarea id="field-comment" class="form-field__textarea" rows="4" placeholder="Комментарии, которые помогут нам лучше узнать о задаче"></textarea></label>
                            <!-- Consent -->
                            <label class="consent-label" id="consent-wrap">
                                <input type="checkbox" id="field-consent" class="consent-label__checkbox">
                                <span>
                                    <span class="consent-label__title">Согласие с условиями<span class="consent-label__required">*</span></span><br>
                                    Нажимая на кнопку, вы соглашаетесь с обработкой
                                    <a href="<?php echo esc_url(get_template_directory_uri() . '/assets/media-kit/docs/legal/personal-data-consent.pdf'); ?>" target="_blank" rel="noopener noreferrer">персональных данных</a>
                                    и ознакомлены с
                                    <a href="<?php echo esc_url(get_template_directory_uri() . '/assets/media-kit/docs/legal/privacy-policy.pdf'); ?>" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a>.
                                </span>
                            </label>
                            <span class="form-field__error" id="err-consent" style="display:none"></span>
                            <p class="required-note"><strong>*</strong> обязательные поля</p>
                            <button type="button" class="checkout-submit-btn" id="checkout-submit">
                                <span id="checkout-submit-label">Оплатить</span>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </button>
                            <div id="checkout-message" style="display:none" class="checkout-message"></div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT: order panel -->
                <div>
                    <h3 class="order-panel__title">Детали заказа</h3>
                    <div class="checkout-divider"></div>
                    <div class="order-panel__product">
                        <div class="order-panel__image zoom-frame">
                            <div class="zoom-media" style="height:100%;background-image:url('<?php echo esc_url($bombs2_url); ?>');background-size:cover;background-position:center"></div>
                        </div>
                        <div style="flex:1;min-width:0">
                            <p class="order-panel__name">Бомбочка для ванны</p>
                            <div class="order-panel__qty-row">
                                <button type="button" class="counter-btn" id="qty-minus" title="Уменьшить количество" disabled>-</button>
                                <input type="number" id="qty-input" class="order-panel__qty-input" min="1" value="3" aria-label="Количество бомбочек">
                                <button type="button" class="counter-btn" id="qty-plus" title="Увеличить количество">+</button>
                            </div>
                            <span class="form-field__error" id="err-qty" style="display:none"></span>
                        </div>
                        <p class="order-panel__price">999 ₽</p>
                    </div>
                    <div class="checkout-divider" style="margin-top:20px"></div>
                    <div class="order-panel__summary">
                        <p>Количество: <span id="summary-qty">3</span> шт.</p>
                        <p>Цена за 1 шт.: 999 руб.</p>
                        <p class="total">Итоговая сумма: <span id="summary-total">2997</span> руб.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- LEGAL MODALS -->
<?php
$legal_texts = [
    'privacy' => [
        'kicker' => 'Документы',
        'title'  => 'Политика в отношении обработки персональных данных',
        'content' => [
            '1. Общие положения',
            '1.1. Настоящая Политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 N 152-ФЗ «О персональных данных».',
            '1.2. Оператор считает соблюдение прав и свобод человека при обработке его персональных данных важнейшим условием своей деятельности.',
            '3.1. Оператор может собирать следующие ПДн: ФИО, номер телефона, адрес электронной почты, адрес доставки.',
            '4.1. Оператор обрабатывает ПДн для идентификации пользователя, оформления заказа, обработки и доставки, связи с покупателем.',
            '6.1. ПДн хранятся в электронном виде не более 5 лет.',
            '9.2. Для реализации прав направьте запрос на Posle.Slovie@yandex.ru.',
            '12. ИП Серебренникова Полина Кирилловна. E-mail: Posle.Slovie@yandex.ru.',
        ],
    ],
    'offer' => [
        'kicker' => 'Документы',
        'title'  => 'Договор публичной оферты',
        'content' => [
            'ИП Серебренникова Полина Кирилловна публикует настоящий Договор, являющийся официальным публичным предложением (офертой) для заключения договора купли-продажи товаров дистанционным способом.',
            '1.4. Товар — косметическая продукция (бомбочки для ванн), представленная в каталоге на Сайте.',
            '5.3. Оплата производится наличными, безналичным способом или с использованием платёжных сервисов.',
            '7.1. Покупатель вправе отказаться от Товара до его передачи или в течение 7 дней после.',
            '10.2. Все споры подлежат разрешению в судебном порядке по месту нахождения Продавца.',
            '11. ИП Серебренникова Полина Кирилловна. E-mail: Posle.Slovie@yandex.ru.',
        ],
    ],
    'personal-data-consent' => [
        'kicker' => 'Документы',
        'title'  => 'Согласие на обработку персональных данных',
        'content' => [
            'Оставляя свои персональные данные на сайте, принимаю условия Политики конфиденциальности и даю согласие ИП Серебренниковой Полине Кирилловне на обработку своих персональных данных.',
            'Цели: идентификация пользователя, оформление и исполнение заказа, доставка товаров, связь для уточнения деталей заказа.',
            'Настоящее согласие дается на срок не более 3 лет.',
            'Могу отозвать согласие, направив заявление на Posle.Slovie@yandex.ru.',
        ],
    ],
    'personal-data-distribution' => [
        'kicker' => 'Документы',
        'title'  => 'Согласие на распространение персональных данных',
        'content' => [
            'Заполняя форму отзыва на Сайте, даю согласие на распространение моих персональных данных ИП Серебренниковой Полине Кирилловне.',
            'Цель: публикация отзыва о товарах Оператора на сайте и в официальных аккаунтах в социальных сетях.',
            'Согласие действует до момента его отзыва путём направления уведомления на Posle.Slovie@yandex.ru.',
        ],
    ],
    'marketing-consent' => [
        'kicker' => 'Документы',
        'title'  => 'Согласие на получение рекламных и информационных материалов',
        'content' => [
            'Заполняя форму, даю согласие ИП Серебренниковой Полине Кирилловне на получение на указанный email и/или телефон информационных и рекламных материалов о товарах, акциях и специальных предложениях.',
            'Могу отозвать согласие, нажав на ссылку «Отписаться» в каждом письме или направив уведомление на Posle.Slovie@yandex.ru с пометкой «Отказ от рассылки».',
            'Настоящее согласие действует до момента его отзыва.',
        ],
    ],
];
foreach ($legal_texts as $slug => $doc) : ?>
<div class="ps-modal-overlay" id="modal-legal-<?php echo esc_attr($slug); ?>" role="dialog" aria-modal="true" aria-labelledby="modal-legal-title-<?php echo esc_attr($slug); ?>">
    <div class="ps-modal-dialog">
        <div class="ps-modal-header">
            <button type="button" class="ps-modal-close" data-modal-close aria-label="Закрыть">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <div class="ps-modal-header__inner">
                <p class="ps-kicker"><?php echo esc_html($doc['kicker']); ?></p>
                <h2 class="ps-modal-title" id="modal-legal-title-<?php echo esc_attr($slug); ?>"><?php echo esc_html($doc['title']); ?></h2>
                <div class="gold-rule" aria-hidden="true"><span class="gold-rule__diamond"></span><span class="gold-rule__line"></span><span class="gold-rule__diamond"></span></div>
            </div>
        </div>
        <div class="ps-modal-body modal-scroll">
            <article class="legal-content">
                <?php foreach ($doc['content'] as $para) : ?>
                <p><?php echo esc_html($para); ?></p>
                <?php endforeach; ?>
            </article>
        </div>
    </div>
</div>
<?php endforeach; ?>

</div><!-- .ps-page-wrap -->
<?php get_footer(); ?>
