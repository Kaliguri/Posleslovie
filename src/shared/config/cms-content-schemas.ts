import { defaultHomeHeroContent } from "./home-hero-content";
import { defaultHomePageContent } from "./home-page-content";

export type CmsContentSchema = {
  slug: string;
  title: string;
  description: string;
  defaultValue: Record<string, unknown>;
};

export const cmsContentSchemas: CmsContentSchema[] = [
  {
    slug: "home-hero",
    title: "Главный экран (Hero)",
    description: "Заголовок, подзаголовок и подпись кнопки на первом экране.",
    defaultValue: defaultHomeHeroContent as unknown as Record<string, unknown>,
  },
  {
    slug: "home-feature-cards",
    title: "Карточки преимуществ",
    description: "Массив карточек в секции «Дарите настроение и заботу...».",
    defaultValue: {
      cards: [
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
    },
  },
  {
    slug: "home-process-sections",
    title: "Секции процесса",
    description: "Шаги о продукции, маслах и упаковке.",
    defaultValue: {
      sections: [
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
    },
  },
  {
    slug: "home-why-us",
    title: "Секция Почему выбирают нас",
    description: "Заголовок, фон и карточки преимуществ.",
    defaultValue: {
      title: defaultHomePageContent.whyUs.title,
      backgroundImage: defaultHomePageContent.whyUs.backgroundImage,
      reasons: defaultHomePageContent.whyUs.reasons,
    },
  },
  {
    slug: "home-about",
    title: "Секция О нас",
    description: "Kicker, заголовок, абзацы и главное изображение.",
    defaultValue: defaultHomePageContent.about as unknown as Record<string, unknown>,
  },
  {
    slug: "home-reviews",
    title: "Секция Отзывы",
    description: "Заголовок и карточки отзывов.",
    defaultValue: {
      title: defaultHomePageContent.reviews.title,
      items: defaultHomePageContent.reviews.items,
    },
  },
  {
    slug: "home-cta",
    title: "Финальный CTA блок",
    description: "Текст и фоновое изображение финального блока.",
    defaultValue: defaultHomePageContent.cta as unknown as Record<string, unknown>,
  },
  {
    slug: "home-galleries",
    title: "Галереи секций",
    description: "Изображения и alt-тексты для bombs/lavender/packs.",
    defaultValue: defaultHomePageContent.galleries as unknown as Record<string, unknown>,
  },
];

export function getCmsSchemaBySlug(slug: string): CmsContentSchema | undefined {
  return cmsContentSchemas.find((schema) => schema.slug === slug);
}
