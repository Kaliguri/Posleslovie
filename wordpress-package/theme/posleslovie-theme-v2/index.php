<?php
if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>
<main class="ps-main">
    <section class="ps-section ps-section--plain">
        <div class="ps-container">
            <h1><?php echo esc_html(get_bloginfo('name')); ?></h1>
            <p><?php echo esc_html(get_bloginfo('description')); ?></p>
        </div>
    </section>
</main>
<?php
get_footer();

