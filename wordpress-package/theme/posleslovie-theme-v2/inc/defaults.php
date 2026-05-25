<?php

if (!defined('ABSPATH')) {
    exit;
}

function ps_get_default_content() {
    return [
        'hero' => [
            'title' => 'Послесловие к вашему дню',
            'lead_1' => 'Энергия природы в каждой бомбочке для ванны',
            'lead_2' => 'Внимание и забота к каждой минуте наедине с собой',
            'button' => 'Оформить заказ',
            'background' => '/images/desktop-29/hero.jpg',
        ],
        'feature_cards' => [
            [
                'title' => 'Природа в чистом виде',
                'description' => 'Никакой агрессивной химии. Ручная сборка, натуральные масла и компоненты, которые мы тщательно отбираем сами.',
                'icon' => '/images/desktop-29/icon-nature.png',
            ],
            [
                'title' => 'Сюрприз в каждом заказе',
                'description' => 'Наши художники и писатели запечатали внутри культурный опыт и волшебство момента.',
                'icon' => '/images/desktop-29/icon-gift.png',
            ],
            [
                'title' => 'Дизайн по вашим правилам',
                'description' => 'От цвета упаковки до теплых пожеланий на вкладыше. Мы полностью адаптируем внешний вид упаковки под эстетику вашего бренда.',
                'icon' => '/images/desktop-29/icon-success.png',
            ],
        ],
        'process_sections' => [
            [
                'eyebrow' => 'Продукция',
                'title' => 'Как мы делаем бомбочки для ванн?',
                'description' => 'Каждая бомбочка сделана вручную. В составе исключительно натуральные ингредиенты, прошедшие сертификацию в лаборатории.',
                'reverse' => false,
                'gallery_key' => 'bombs',
                'button_label' => '',
            ],
            [
                'eyebrow' => 'Натуральные масла',
                'title' => 'Собираем лаванду вручную',
                'description' => 'Наши партнеры собирают лаванду и изготавливают масло вручную. Букет из 50 сортов лаванды в каждой бомбочке.',
                'reverse' => true,
                'gallery_key' => 'lavender',
                'button_label' => '',
            ],
            [
                'eyebrow' => 'Продукция',
                'title' => 'Упаковываем с любовью',
                'description' => 'Вы выбираете цвет сургучной печати, а мы берем на себя все технические моменты и собираем готовый брендированный бокс.',
                'reverse' => false,
                'gallery_key' => 'packs',
                'button_label' => 'Сделать заказ',
            ],
        ],
        'gallery_bombs' => [
            ['image' => '/images/desktop-29/bombs-1.jpg', 'alt' => 'Мраморные бомбочки для ванны'],
            ['image' => '/images/desktop-29/bombs-2.jpg', 'alt' => 'Голубые бомбочки с лавандой'],
            ['image' => '/images/desktop-29/bombs-3.jpg', 'alt' => 'Бомбочка крупным планом'],
        ],
        'gallery_lavender' => [
            ['image' => '/images/desktop-29/product-2.svg', 'alt' => 'Лавандовая бомбочка для ванны'],
            ['image' => '/images/desktop-29/product-1.svg', 'alt' => 'Натуральные масла и сухоцветы'],
            ['image' => '/images/desktop-29/product-3.svg', 'alt' => 'Лавандовый блок'],
        ],
        'gallery_packs' => [
            ['image' => '/images/desktop-29/packs-1.jpg', 'alt' => 'Подарочная упаковка Послесловие'],
            ['image' => '/images/desktop-29/packs-2.jpg', 'alt' => 'Брендированный набор бомбочек'],
            ['image' => '/images/desktop-29/packs-3.jpg', 'alt' => 'Упакованные наборы для подарков'],
        ],
        'why' => [
            'title' => 'Почему выбирают нас?',
            'background' => '/images/desktop-29/why-us.jpg',
            'items' => [
                [
                    'title' => 'Чистый состав',
                    'description' => 'Только органические масла и настоящие сухоцветы.',
                    'icon' => '/images/desktop-29/icon-nature.png',
                ],
                [
                    'title' => 'Гарантия качества',
                    'description' => 'Ручная сборка и контроль каждой партии.',
                    'icon' => '/images/desktop-29/icon-success.png',
                ],
                [
                    'title' => 'Креативный подарок',
                    'description' => 'Приятный сюрприз и культурный опыт в каждом наборе.',
                    'icon' => '/images/desktop-29/icon-gift.png',
                ],
            ],
        ],
        'about' => [
            'kicker' => 'О нас',
            'title' => 'Кто мы такие?',
            'paragraph_1' => 'Послесловие — это команда амбициозных, творческих и талантливых людей, бесконечно целеустремленных и искренне увлеченных созданием подарков.',
            'paragraph_2' => 'Мы прилагаем максимум усилий, чтобы создать продукцию на уровень выше конкурентов. Именно поэтому с нами сотрудничают лидеры рынка.',
            'image' => '/images/desktop-29/bombs-1.jpg',
        ],
        'reviews' => [
            'title' => 'Нам доверяют',
            'items' => [
                ['name' => 'Алиса Ч.', 'text' => 'Потрясающая бомбочка! Аромат настоящей лаванды, растворяется мягко и выглядит очень эстетично.', 'image' => '/images/desktop-29/review-1.svg'],
                ['name' => 'Мария П.', 'text' => 'Покупала набор в подарок. Все выглядит аккуратно и премиально, получательница была в восторге.', 'image' => '/images/desktop-29/review-2.svg'],
                ['name' => 'Владимир К.', 'text' => 'Заказали партию с логотипом для боксов. Качество превзошло ожидания.', 'image' => '/images/desktop-29/review-3.svg'],
                ['name' => 'Анна С.', 'text' => 'После тяжелого дня это идеальный способ расслабиться. Видно внимание к деталям.', 'image' => '/images/desktop-29/review-4.svg'],
            ],
        ],
        'cta' => [
            'heading' => 'Наши наборы - ваш идеальный комплимент!',
            'text' => 'Подарите минуты душевного равновесия и культурный опыт тем, кто вам важен.',
            'button' => 'Оформить заказ',
            'background' => '/images/desktop-29/cta.jpg',
        ],
        'site' => [
            'phone' => '+8 (978) 673-47-01',
            'email' => 'Posle.Slovie@yandex.ru',
            'socials' => [
                ['label' => 'Telegram', 'url' => 'https://t.me/posleslovie'],
                ['label' => 'WhatsApp', 'url' => 'https://wa.me/89786734701'],
                ['label' => 'VK', 'url' => 'https://vk.com/posleslovie'],
            ],
        ],
        'legal' => [
            ['slug' => 'privacy', 'short_title' => 'Политика конфиденциальности', 'file' => '/docs/privacy.pdf'],
            ['slug' => 'offer', 'short_title' => 'Договор оферты', 'file' => '/docs/offer.pdf'],
            ['slug' => 'personal-data-consent', 'short_title' => 'Согласие на обработку данных', 'file' => '/docs/personal-data-consent.pdf'],
            ['slug' => 'personal-data-distribution', 'short_title' => 'Согласие на распространение данных', 'file' => '/docs/personal-data-distribution.pdf'],
            ['slug' => 'marketing-consent', 'short_title' => 'Согласие на рассылку', 'file' => '/docs/marketing-consent.pdf'],
        ],
    ];
}

function ps_image_url($value, $fallback = '') {
    if (is_array($value) && isset($value['url'])) {
        return $value['url'];
    }
    if (is_numeric($value)) {
        $url = wp_get_attachment_image_url((int) $value, 'full');
        if ($url) {
            return $url;
        }
    }
    if (is_string($value) && $value !== '') {
        if (strpos($value, '/images/') === 0) {
            return trailingslashit(get_template_directory_uri()) . 'assets/media' . $value;
        }
        return $value;
    }
    if (is_string($fallback) && strpos($fallback, '/images/') === 0) {
        return trailingslashit(get_template_directory_uri()) . 'assets/media' . $fallback;
    }
    return $fallback;
}

function ps_get_acf($key, $fallback = null, $scope = false) {
    if (!function_exists('get_field')) {
        return $fallback;
    }
    $value = get_field($key, $scope);
    if ($value === null || $value === false || $value === '') {
        return $fallback;
    }
    return $value;
}

