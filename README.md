# Posleslovie Site

Сайт-визитка для продажи бомбочек.

## Контекст проекта

Проект создается как компактный промо-сайт: показать продукт, передать настроение бренда и привести посетителя к покупке или заявке.

Основной дизайн-источник:

https://www.figma.com/design/WmOedCtt1kVyO6xx1FfEW2/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D0%B5?node-id=0-1&p=f&t=3cGAwdm57tSOHoss-0

## Технологии

- Next.js
- React
- TypeScript
- Tailwind CSS
- Figma MCP для работы с макетами

## Разработка

```bash
npm run dev
```

Проверка качества:

```bash
npm run lint
```

Сборка:

```bash
npm run build
```

Сборка настроена как static export Next.js. После `npm run build` готовые файлы появляются в папке `out/`.

## GitHub Pages

Проект подготовлен для публикации через GitHub Pages.

Что нужно сделать в GitHub:

1. Открыть репозиторий.
2. Перейти в `Settings` -> `Pages`.
3. В `Build and deployment` выбрать `GitHub Actions`.
4. Запушить изменения в ветку `main`.

Workflow `.github/workflows/pages.yml` сам установит зависимости, выполнит `npm run build` и опубликует папку `out/` в GitHub Pages.

Для локальной проверки перед публикацией:

```bash
npm run lint
npm run build
```

Важно: GitHub Pages обслуживает только статические файлы. Серверные маршруты Next.js, например `/api/*`, и backend-интеграции оплаты не выполняются на Pages. Для полноценного checkout позже нужен внешний backend, serverless-функции или отдельный хостинг с Node.js.

## Рабочий процесс

UI-изменения делаем с опорой на Figma. Перед реализацией страниц, секций и компонентов нужно сверяться с макетом через Figma MCP и переносить решения в код с учетом текущей структуры проекта.

Если ссылка ведет на корень файла, для точной реализации лучше использовать ссылку на конкретный frame или node.
