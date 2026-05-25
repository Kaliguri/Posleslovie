# Posleslovie WP пакет: установка за 10 минут

## Что в пакете

- `theme/posleslovie-theme` — кастомная тема (готова к ZIP-установке).
- `acf-json/group_posleslovie_home.json` — импорт группы полей ACF.
- `forms/fluentforms-posleslovie-order.json` — импорт формы Fluent Forms.
- `assets/` — исходные изображения и PDF для Media Library.
- `acf-default-values.json` — JSON-шаблоны для текстовых ACF-полей.

## 1) Установи тему

1. Заархивируй папку `theme/posleslovie-theme` в ZIP (`posleslovie-theme.zip`).
2. В WordPress: `Внешний вид -> Темы -> Добавить -> Загрузить тему`.
3. Выбери ZIP и активируй тему.

## 2) Создай главную страницу

1. `Страницы -> Добавить новую` -> название `Главная`.
2. Опубликуй.
3. `Настройки -> Чтение -> Статическая страница` -> выбери `Главная`.

## 3) Импортируй поля ACF

1. Установи плагин ACF (бесплатный).
2. `Custom Fields -> Tools -> Import Field Groups`.
3. Импортируй `acf-json/group_posleslovie_home.json`.

## 4) Заполни ключевые ACF-поля

Открой страницу `Главная` и заполни:

- Hero-поля (заголовки, кнопка, фон).
- About/Why/CTA простые поля.
- JSON-поля (карточки, секции, галереи, отзывы, соцсети, документы):
  - бери готовые значения из `acf-default-values.json` (копипастой).

## 5) Импортируй форму

1. Установи Fluent Forms.
2. `Fluent Forms -> Tools -> Import Forms`.
3. Импортируй `forms/fluentforms-posleslovie-order.json`.
4. После импорта открой форму и нажми `Save` (обновит структуру).

## 6) Проверка, что все работает

- Главная открывается с дизайном и секциями.
- Якоря работают: `#bombs`, `#about`, `#reviews`.
- В footer открываются PDF-документы.
- Форма отправляет письмо на `wp.admin_email`.

## Важно

- Тема уже содержит fallback-ассеты внутри `assets/media`, поэтому сайт запустится даже до ручной загрузки медиа.
- Если хочешь хранить все файлы в Media Library, загрузи `assets/images` и `assets/docs`, затем замени URL в ACF-полях.

