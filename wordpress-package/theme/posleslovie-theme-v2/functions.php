<?php

if (!defined('ABSPATH')) {
    exit;
}

require_once get_template_directory() . '/inc/defaults.php';

add_filter('acf/settings/load_json', function ($paths) {
    $paths[] = get_template_directory() . '/acf-json';
    return $paths;
});

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
    register_nav_menus([
        'primary' => 'Основное меню',
    ]);
});

add_action('wp_enqueue_scripts', function () {
    // Google Fonts: Roboto + Inter (cyrillic + latin)
    wp_enqueue_style(
        'posleslovie-google-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Roboto:wght@300;400;500;700;800&display=swap',
        [],
        null
    );

    wp_enqueue_style(
        'posleslovie-theme',
        get_template_directory_uri() . '/assets/theme.css',
        ['posleslovie-google-fonts'],
        '2.0.0'
    );

    wp_enqueue_script(
        'posleslovie-theme',
        get_template_directory_uri() . '/assets/theme.js',
        [],
        '2.0.0',
        true
    );
});
