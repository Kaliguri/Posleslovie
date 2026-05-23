export type GalleryItem = {
  image: string;
  alt: string;
};

export type HomePageContent = {
  hero: {
    heading: string;
    leadLine1: string;
    leadLine2: string;
    ctaLabel: string;
    backgroundImage: string;
  };
  featureCards: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  processSections: Array<{
    eyebrow: string;
    title: string;
    description: string;
    reverse: boolean;
    gallery: "bombs" | "lavender" | "packs";
    button?: string;
  }>;
  galleries: {
    bombs: GalleryItem[];
    lavender: GalleryItem[];
    packs: GalleryItem[];
  };
  whyUs: {
    title: string;
    backgroundImage: string;
    reasons: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    image: string;
  };
  reviews: {
    title: string;
    items: Array<{
      name: string;
      text: string;
      image: string;
    }>;
  };
  cta: {
    heading: string;
    text: string;
    buttonLabel: string;
    backgroundImage: string;
  };
};

export const defaultHomePageContent: HomePageContent = {
  hero: {
    heading: "Послесловие к вашему дню",
    leadLine1: "Энергия природы в каждой бомбочке для ванны",
    leadLine2: "Внимание и забота к каждой минуте наедине с собой",
    ctaLabel: "Оформить заказ",
    backgroundImage: "/images/desktop-29/hero.jpg",
  },
  featureCards: [
    {
      title: "Природа в чистом виде",
      description:
        "Никакой агрессивной химии. Ручная сборка, натуральные масла и компоненты, которые мы тщательно отбираем сами.",
      icon: "/images/desktop-29/icon-nature.png",
    },
    {
      title: "Сюрприз в каждом заказе",
      description: "Наши художники и писатели запечатали внутри культурный опыт и волшебство момента",
      icon: "/images/desktop-29/icon-gift.png",
    },
    {
      title: "Дизайн по вашим правилам",
      description:
        "От цвета упаковки до теплых пожеланий на вкладыше. Мы полностью адаптируем внешний вид упаковки под эстетику вашего бренда",
      icon: "/images/desktop-29/icon-success.png",
    },
  ],
  processSections: [
    {
      eyebrow: "Продукция",
      title: "Как мы делаем бомбочки для ванн?",
      description:
        "Каждая бомбочка сделана в ручную. В составе исключительно натуральные ингредиенты, прошедшие сертификацию в лаборатории. Мы не экономим на вас, главное принести реальную пользу",
      reverse: false,
      gallery: "bombs",
    },
    {
      eyebrow: "Натуральные масла",
      title: "Собираем лаванду вручную",
      description:
        "Наши партнеры собирают лаванду и изготавливают масло в ручную. Букет из 50 сортов лаванды в каждой бомбочке.",
      reverse: true,
      gallery: "lavender",
    },
    {
      eyebrow: "Продукция",
      title: "Упаковываем с любовью",
      description:
        "Мы нанесем ваш логотип на упаковку, вы выберите цвет сургучной печати. Мы возьмем на себя все технические моменты, чтобы вы получили готовый брендированный бокс, соответствующий эстетике и духу вашей компании",
      reverse: false,
      gallery: "packs",
      button: "Сделать заказ",
    },
  ],
  galleries: {
    bombs: [
      { image: "/images/desktop-29/bombs-1.jpg", alt: "Мраморные бомбочки для ванны" },
      { image: "/images/desktop-29/bombs-2.jpg", alt: "Голубые бомбочки с лавандой" },
      { image: "/images/desktop-29/bombs-3.jpg", alt: "Бомбочка крупным планом" },
    ],
    lavender: [
      { image: "/images/desktop-29/product-2.svg", alt: "Лавандовая бомбочка для ванны" },
      { image: "/images/desktop-29/product-1.svg", alt: "Натуральные масла и сухоцветы" },
      { image: "/images/desktop-29/product-3.svg", alt: "Лавандовый блок" },
    ],
    packs: [
      { image: "/images/desktop-29/packs-1.jpg", alt: "Подарочная упаковка Послесловие" },
      { image: "/images/desktop-29/packs-2.jpg", alt: "Брендированный набор бомбочек" },
      { image: "/images/desktop-29/packs-3.jpg", alt: "Упакованные наборы для подарков" },
    ],
  },
  whyUs: {
    title: "Почему выбирают нас?",
    backgroundImage: "/images/desktop-29/why-us.jpg",
    reasons: [
      {
        title: "Чистый состав",
        description: "Только органические масла и настоящие сухоцветы",
        icon: "/images/desktop-29/icon-nature.png",
      },
      {
        title: "Гарантия качества",
        description: "Ручная сборка и контроль каждой партии",
        icon: "/images/desktop-29/icon-success.png",
      },
      {
        title: "Креативный подарок",
        description: "Приятный сюрприз и культурный опыт в каждом наборе",
        icon: "/images/desktop-29/icon-gift.png",
      },
    ],
  },
  about: {
    kicker: "О нас",
    title: "Кто мы такие?",
    paragraphs: [
      "Послесловие — это команда амбициозных, творческих и талантливых людей, бесконечно целеустремленных и искренне увлеченных процессом создания подарков.",
      "Мы прилагаем максимум усилий, чтобы создать продукцию на уровень выше конкурентов. Именно поэтому с нами сотрудничают лидеры рынка в своих нишах.",
    ],
    image: "/images/desktop-29/bombs-1.jpg",
  },
  reviews: {
    title: "Нам доверяют",
    items: [
      {
        name: "Алиса Ч.",
        image: "/images/desktop-29/review-1.svg",
        text: "«Потрясающая бомбочка! Я очень привередлива к запахам и не люблю химозные отдушки, но тут аромат настоящей лаванды, как будто стоишь в поле. Растворяется мягко, кожу не сушит, сухоцветы смотрятся невероятно красиво. И самое главное — ванну после нее отмывать не нужно!»",
      },
      {
        name: "Мария П.",
        image: "/images/desktop-29/review-2.svg",
        text: "«Покупала набор в подарок. Все выглядит аккуратно и очень премиально: упаковка, аромат, сама идея маленького ритуала после долгого дня. Получательница была в восторге.»",
      },
      {
        name: "Владимир К.",
        image: "/images/desktop-29/review-3.svg",
        text: "«Искали эстетичные комплименты для подарочных боксов, заказали партию с нашим логотипом на упаковке. Качество превзошло ожидания, продукт делает распаковку особенной.»",
      },
      {
        name: "Анна С.",
        image: "/images/desktop-29/review-4.svg",
        text: "«Брала набор себе, чтобы отдохнуть от суеты. Очень эстетичный вид, чувствуется ручная работа и внимание к деталям. После тяжелого дня — идеальный способ расслабиться.»",
      },
    ],
  },
  cta: {
    heading: "Наши наборы - ваш идеальный комплимент!",
    text: "Подарите минуты душевного равновесия и культурный опыт тем, кто вам важен",
    buttonLabel: "Оформить заказ",
    backgroundImage: "/images/desktop-29/cta.jpg",
  },
};
