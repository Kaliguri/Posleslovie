import { assetPath } from "@/shared/lib/asset-path";
import homeAboutJson from "../../../../content/home-about.json";
import homeCtaJson from "../../../../content/home-cta.json";
import homeFaqJson from "../../../../content/home-faq.json";
import homeFeatureCardsJson from "../../../../content/home-feature-cards.json";
import homeGalleriesJson from "../../../../content/home-galleries.json";
import homeHeroJson from "../../../../content/home-hero.json";
import homeProcessBombsJson from "../../../../content/home-process-bombs.json";
import homeProcessLavenderJson from "../../../../content/home-process-lavender.json";
import homeProcessPacksJson from "../../../../content/home-process-packs.json";
import homeProcessSectionsJson from "../../../../content/home-process-sections.json";
import homeReviewsJson from "../../../../content/home-reviews.json";
import homeWhyUsJson from "../../../../content/home-why-us.json";
import siteBehaviorJson from "../../../../content/site-behavior.json";
import siteProductsJson from "../../../../content/site-products.json";
import {
  homeAboutSchema,
  homeCtaSchema,
  homeFaqSchema,
  homeFeatureCardsSchema,
  homeGalleriesSchema,
  homeHeroSchema,
  homeProcessSectionSchema,
  homeProcessSectionsSchema,
  homeReviewsSchema,
  homeWhyUsSchema,
  siteBehaviorSchema,
  siteProductsSchema,
} from "./content-schema";

function parseWithFallback<T>(sourceName: string, parse: () => T, fallback: () => T): T {
  try {
    return parse();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[content-schema] failed to parse ${sourceName}`, error);
    }
    return fallback();
  }
}

const siteBehavior = parseWithFallback(
  "site-behavior.json",
  () => siteBehaviorSchema.parse(siteBehaviorJson),
  () => siteBehaviorSchema.parse({}),
);
const homeHero = parseWithFallback(
  "home-hero.json",
  () => homeHeroSchema.parse(homeHeroJson),
  () =>
    homeHeroSchema.parse({
      heading: "Послесловие к вашему дню",
      leadLine1: "Послесловие к вашему ритуалу ухода",
      leadLine2: "Ручная работа в Севастополе",
      ctaLabel: "Оформить заказ",
      backgroundMediaType: "image",
      backgroundImage: "/images/photos/hero.jpg",
      backgroundVideo: "",
    }),
);
const homeFeatureCards = parseWithFallback(
  "home-feature-cards.json",
  () => homeFeatureCardsSchema.parse(homeFeatureCardsJson),
  () => homeFeatureCardsSchema.parse({ sectionTitle: "Преимущества", cards: [] }),
);
const homeProcessBombs = parseWithFallback(
  "home-process-bombs.json",
  () => homeProcessSectionSchema.parse(homeProcessBombsJson),
  () =>
    homeProcessSectionSchema.parse({
      eyebrow: "Процесс",
      title: "Как мы создаем бомбочки",
      description: "Описание процесса временно недоступно.",
      reverse: false,
      slides: [{ image: "/images/photos/bombs-2.jpg", alt: "Бомбочки" }],
    }),
);
const homeProcessLavender = parseWithFallback(
  "home-process-lavender.json",
  () => homeProcessSectionSchema.parse(homeProcessLavenderJson),
  () =>
    homeProcessSectionSchema.parse({
      eyebrow: "Процесс",
      title: "Лаванда",
      description: "Описание процесса временно недоступно.",
      reverse: true,
      slides: [{ image: "/images/photos/bombs-2.jpg", alt: "Лаванда" }],
    }),
);
const homeProcessPacks = parseWithFallback(
  "home-process-packs.json",
  () => homeProcessSectionSchema.parse(homeProcessPacksJson),
  () =>
    homeProcessSectionSchema.parse({
      eyebrow: "Процесс",
      title: "Наборы",
      description: "Описание процесса временно недоступно.",
      reverse: false,
      slides: [{ image: "/images/photos/bombs-2.jpg", alt: "Наборы" }],
    }),
);
const homeWhyUs = parseWithFallback(
  "home-why-us.json",
  () => homeWhyUsSchema.parse(homeWhyUsJson),
  () =>
    homeWhyUsSchema.parse({
      kicker: "Почему мы",
      title: "Почему выбирают нас",
      backgroundImage: "/images/photos/hero.jpg",
      reasons: [],
    }),
);
const homeAbout = parseWithFallback(
  "home-about.json",
  () => homeAboutSchema.parse(homeAboutJson),
  () =>
    homeAboutSchema.parse({
      kicker: "О нас",
      title: "Послесловие",
      paragraphs: ["Контент временно недоступен."],
      image: "/images/photos/bombs-2.jpg",
    }),
);
const homeReviews = parseWithFallback(
  "home-reviews.json",
  () => homeReviewsSchema.parse(homeReviewsJson),
  () => homeReviewsSchema.parse({ kicker: "Отзывы", title: "Отзывы", items: [] }),
);
const homeCta = parseWithFallback(
  "home-cta.json",
  () => homeCtaSchema.parse(homeCtaJson),
  () =>
    homeCtaSchema.parse({
      heading: "Оформите заказ",
      text: "Свяжитесь с нами для оформления.",
      buttonLabel: "Оформить заказ",
      backgroundImage: "/images/photos/hero.jpg",
    }),
);
const siteProducts = parseWithFallback(
  "site-products.json",
  () => siteProductsSchema.parse(siteProductsJson),
  () => siteProductsSchema.parse({ items: [] }),
);

// Validate currently unused content files to keep CMS contracts in sync.
parseWithFallback(
  "home-galleries.json",
  () => homeGalleriesSchema.parse(homeGalleriesJson),
  () => homeGalleriesSchema.parse({ galleries: [] }),
);
parseWithFallback(
  "home-process-sections.json",
  () => homeProcessSectionsSchema.parse(homeProcessSectionsJson),
  () => homeProcessSectionsSchema.parse({ sections: [] }),
);

export const globalOverlaysEnabled = Boolean(siteBehavior.enableGlobalOverlays);
export const scrollAnimationsEnabled = Boolean(siteBehavior.enableScrollAnimations);

const fallbackCheckoutProduct = {
  title: "Бомбочка для ванны",
  price: Number(process.env.NEXT_PUBLIC_PRODUCT_PRICE ?? "999"),
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
  backgroundImageMobile: string;
  backgroundImageTablet: string;
  backgroundVideo: string;
};

export const heroContent: HeroContent = {
  ...homeHero,
  backgroundMediaType: homeHero.backgroundMediaType === "video" ? "video" : "image",
  backgroundImage: assetPath(homeHero.backgroundImage),
  backgroundImageMobile: homeHero.backgroundImageMobile
    ? assetPath(homeHero.backgroundImageMobile)
    : assetPath(homeHero.backgroundImage),
  backgroundImageTablet: homeHero.backgroundImageTablet
    ? assetPath(homeHero.backgroundImageTablet)
    : assetPath(homeHero.backgroundImage),
  backgroundVideo: homeHero.backgroundVideo ? assetPath(homeHero.backgroundVideo) : "",
};

export const featureCardsSection = {
  sectionTitle: homeFeatureCards.sectionTitle,
  cards: homeFeatureCards.cards.map((card) => ({
    ...card,
    icon: assetPath(card.icon),
  })),
};

const homeFaq = parseWithFallback(
  "home-faq.json",
  () => homeFaqSchema.parse(homeFaqJson),
  () =>
    homeFaqSchema.parse({
      kicker: "Вопросы",
      title: "FAQ",
      items: [
        {
          question: "Как оформить заказ?",
          answer: "Нажмите «Оформить заказ» и заполните форму на сайте.",
        },
      ],
    }),
);

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
