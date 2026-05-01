# Cursor Notes

Этот проект ведется в Cursor с подключенным Figma MCP.

## Главный контекст

- Работаем над сайтом-визиткой для продажи бомбочек.
- Дизайн и визуальные решения берем из Figma.
- Основная ссылка на проект Figma:
  https://www.figma.com/design/WmOedCtt1kVyO6xx1FfEW2/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D1%81%D0%BB%D0%BE%D0%B2%D0%B8%D0%B5?node-id=0-1&p=f&t=3cGAwdm57tSOHoss-0

## Правила работы

- Перед изменениями интерфейса проверять актуальный дизайн через Figma MCP.
- При переносе макета в код адаптировать результат под Next.js, React, TypeScript и Tailwind CSS.
- Сохранять визуальную идею из Figma: композицию, настроение, цвета, типографику и ритм.
- Если нужна точная верстка, использовать ссылку на конкретный frame/node, а не только на корень файла.

## GitHub Pages

- Сайт должен собираться как статический Next.js export для GitHub Pages.
- Конфигурация находится в `next.config.ts`: `output: "export"`, `images.unoptimized: true`, GitHub Pages `basePath` берется из имени репозитория при сборке в GitHub Actions.
- Деплой описан в `.github/workflows/pages.yml` и публикует папку `out/`.
- Перед изменениями, влияющими на роутинг или сборку, проверять `npm run lint` и `npm run build`.
- GitHub Pages не запускает backend. Любые `/api/*`, платежи, webhooks и server-side интеграции должны быть вынесены во внешний backend/serverless или заменены статичным клиентским сценарием.
