export const siteConfig = {
  name: "Послесловие",
  description:
    "Премиальные подарочные наборы и деликатесы для частных клиентов, мероприятий и партнерских заказов.",
  phone: "+7 (999) 123-45-67",
  email: "hello@posleslovie.ru",
  address: "Москва, Россия",
  socials: [
    { label: "Telegram", href: "https://t.me/posleslovie" },
    { label: "WhatsApp", href: "https://wa.me/79991234567" },
    { label: "VK", href: "https://vk.com/posleslovie" },
  ],
  nav: [
    { label: "Главная", href: "/" },
    { label: "Доставка", href: "/delivery" },
    { label: "Дистрибьютерам", href: "/distributors" },
    { label: "Оформление", href: "/checkout" },
  ],
  distributorBenefits: [
    "Оптовые цены и гибкая матрица по объему закупок.",
    "Маркетинговые материалы для партнерских точек и мероприятий.",
    "Индивидуальная сборка наборов под ваш канал продаж.",
  ],
  deliveryFeatures: [
    "Доставка по Москве на следующий день при подтверждении до 18:00.",
    "Отправка по России транспортными компаниями и курьерскими службами.",
    "Бережная упаковка и контроль температуры для деликатных товаров.",
  ],
} as const;
