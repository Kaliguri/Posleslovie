import { env } from "@/shared/config/env";
import { assetPath } from "@/shared/lib/asset-path";
import homeAboutJson from "../../../../content/home-about.json";
import homeCtaJson from "../../../../content/home-cta.json";
import homeFaqJson from "../../../../content/home-faq.json";
import homeFeatureCardsJson from "../../../../content/home-feature-cards.json";
import homeHeroJson from "../../../../content/home-hero.json";
import homeProcessBombsJson from "../../../../content/home-process-bombs.json";
import homeProcessLavenderJson from "../../../../content/home-process-lavender.json";
import homeProcessPacksJson from "../../../../content/home-process-packs.json";
import homeReviewsJson from "../../../../content/home-reviews.json";
import homeWhyUsJson from "../../../../content/home-why-us.json";
import siteProductsJson from "../../../../content/site-products.json";
import {
  homeAboutSchema,
  homeCtaSchema,
  homeFaqSchema,
  homeFeatureCardsSchema,
  homeHeroSchema,
  homeProcessSectionSchema,
  homeReviewsSchema,
  homeWhyUsSchema,
  siteProductsSchema,
} from "./content-schema";

type ParsingSchema = { parse: (data: unknown) => unknown };

/**
 * Parse a single CMS content source against its schema, falling back to a safe default when the
 * JSON is malformed (e.g. a non-developer broke a field in the CMS). Keeping the source name,
 * schema, raw JSON and fallback together makes each entry a one-liner instead of a try/catch block.
 */
function loadContent<S extends ParsingSchema>(
  sourceName: string,
  schema: S,
  json: unknown,
  fallbackInput: unknown,
): ReturnType<S["parse"]> {
  try {
    return schema.parse(json) as ReturnType<S["parse"]>;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[content-schema] failed to parse ${sourceName}`, error);
    }
    return schema.parse(fallbackInput) as ReturnType<S["parse"]>;
  }
}

const homeHero = loadContent("home-hero.json", homeHeroSchema, homeHeroJson, {
  heading: "Послесловие к вашему дню",
  leadLine1: "Послесловие к вашему ритуалу ухода",
  leadLine2: "Ручная работа в Севастополе",
  ctaLabel: "Оформить заказ",
  backgroundMediaType: "image",
  backgroundImage: "/images/photos/hero.jpg",
  backgroundVideo: "",
});

const homeFeatureCards = loadContent(
  "home-feature-cards.json",
  homeFeatureCardsSchema,
  homeFeatureCardsJson,
  { sectionTitle: "Преимущества", cards: [] },
);

const homeProcessBombs = loadContent(
  "home-process-bombs.json",
  homeProcessSectionSchema,
  homeProcessBombsJson,
  {
    eyebrow: "Процесс",
    title: "Как мы создаем бомбочки",
    description: "Описание процесса временно недоступно.",
    reverse: false,
    slides: [{ image: "/images/photos/bombs-2.jpg", alt: "Бомбочки" }],
  },
);

const homeProcessLavender = loadContent(
  "home-process-lavender.json",
  homeProcessSectionSchema,
  homeProcessLavenderJson,
  {
    eyebrow: "Процесс",
    title: "Лаванда",
    description: "Описание процесса временно недоступно.",
    reverse: true,
    slides: [{ image: "/images/photos/bombs-2.jpg", alt: "Лаванда" }],
  },
);

const homeProcessPacks = loadContent(
  "home-process-packs.json",
  homeProcessSectionSchema,
  homeProcessPacksJson,
  {
    eyebrow: "Процесс",
    title: "Наборы",
    description: "Описание процесса временно недоступно.",
    reverse: false,
    slides: [{ image: "/images/photos/bombs-2.jpg", alt: "Наборы" }],
  },
);

const homeWhyUs = loadContent("home-why-us.json", homeWhyUsSchema, homeWhyUsJson, {
  kicker: "Почему мы",
  title: "Почему выбирают нас",
  backgroundImage: "/images/photos/hero.jpg",
  reasons: [],
});

const homeAbout = loadContent("home-about.json", homeAboutSchema, homeAboutJson, {
  kicker: "О нас",
  title: "Послесловие",
  paragraphs: ["Контент временно недоступен."],
  image: "/images/photos/bombs-2.jpg",
});

const homeReviews = loadContent("home-reviews.json", homeReviewsSchema, homeReviewsJson, {
  kicker: "Отзывы",
  title: "Отзывы",
  items: [],
});

const homeCta = loadContent("home-cta.json", homeCtaSchema, homeCtaJson, {
  heading: "Оформите заказ",
  text: "Свяжитесь с нами для оформления.",
  buttonLabel: "Оформить заказ",
  backgroundImage: "/images/photos/hero.jpg",
});

const homeFaq = loadContent("home-faq.json", homeFaqSchema, homeFaqJson, {
  kicker: "Вопросы",
  title: "FAQ",
  items: [
    {
      question: "Как оформить заказ?",
      answer: "Нажмите «Оформить заказ» и заполните форму на сайте.",
    },
  ],
});

const siteProducts = loadContent("site-products.json", siteProductsSchema, siteProductsJson, {
  items: [],
});

export { globalOverlaysEnabled, scrollAnimationsEnabled } from "@/shared/config/site-behavior";

const fallbackCheckoutProduct = {
  title: "Бомбочка для ванны",
  price: env.productPrice ?? 999,
  image: assetPath("/images/photos/bombs-2.jpg"),
};

export const checkoutProducts = siteProducts.items.map((item) => ({
  ...item,
  image: assetPath(item.image),
}));

export const primaryCheckoutProduct = checkoutProducts[0] ?? fallbackCheckoutProduct;

type HeroContent = Omit<typeof homeHeroJson, "backgroundMediaType"> & {
  backgroundMediaType: "video" | "image";
  backgroundImage: string;
  backgroundVideo: string;
};

export const heroContent: HeroContent = {
  ...homeHero,
  backgroundMediaType: homeHero.backgroundMediaType === "video" ? "video" : "image",
  backgroundImage: assetPath(homeHero.backgroundImage),
  backgroundVideo: homeHero.backgroundVideo ? assetPath(homeHero.backgroundVideo) : "",
};

export const featureCardsSection = {
  sectionTitle: homeFeatureCards.sectionTitle,
  cards: homeFeatureCards.cards.map((card) => ({
    ...card,
    icon: assetPath(card.icon),
  })),
};

export const faqContent = homeFaq;

export const processSections = [homeProcessBombs, homeProcessLavender, homeProcessPacks].map(
  (section) => ({
    ...section,
    slides: section.slides.map((slide) => ({
      ...slide,
      image: assetPath(slide.image),
    })),
  }),
);

export const whyUsContent = {
  ...homeWhyUs,
  backgroundImage: assetPath(homeWhyUs.backgroundImage),
  reasons: homeWhyUs.reasons.map((reason) => ({
    ...reason,
    icon: assetPath(reason.icon),
  })),
};

export const aboutContent = {
  ...homeAbout,
  image: assetPath(homeAbout.image),
};

export const reviewsContent = {
  ...homeReviews,
  items: homeReviews.items.map((review) => ({
    ...review,
    mediaType: (review.mediaType === "video" ? "video" : "image") as "image" | "video",
    image: assetPath(review.image),
    video: review.video ? assetPath(review.video) : "",
  })),
};

export const ctaContent = {
  ...homeCta,
  backgroundImage: assetPath(homeCta.backgroundImage),
};

export const decorativeImages = {
  crystal: assetPath("/images/photos/crystal.png"),
  pero: assetPath("/images/photos/pero.png"),
  stars: assetPath("/images/photos/stars.svg"),
  heroVideo: assetPath("/videos/how-we-make-bath-bombs.mp4"),
};
