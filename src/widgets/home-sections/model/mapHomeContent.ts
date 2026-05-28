import { assetPath } from "@/shared/lib/asset-path";
import homeAboutJson from "../../../../content/home-about.json";
import homeCtaJson from "../../../../content/home-cta.json";
import homeFeatureCardsJson from "../../../../content/home-feature-cards.json";
import homeHeroJson from "../../../../content/home-hero.json";
import homeProcessBombsJson from "../../../../content/home-process-bombs.json";
import homeProcessLavenderJson from "../../../../content/home-process-lavender.json";
import homeProcessPacksJson from "../../../../content/home-process-packs.json";
import homeReviewsJson from "../../../../content/home-reviews.json";
import homeWhyUsJson from "../../../../content/home-why-us.json";
import siteBehaviorJson from "../../../../content/site-behavior.json";
import siteProductsJson from "../../../../content/site-products.json";

const siteBehavior = siteBehaviorJson;

export const globalOverlaysEnabled = Boolean(siteBehavior.enableGlobalOverlays);
export const scrollAnimationsEnabled = Boolean(siteBehavior.enableScrollAnimations);

const fallbackCheckoutProduct = {
  title: "Бомбочка для ванны",
  price: Number(process.env.NEXT_PUBLIC_PRODUCT_PRICE ?? "999"),
  image: assetPath("/images/photos/bombs-2.jpg"),
};

export const checkoutProducts = siteProductsJson.items.map((item) => ({
  ...item,
  image: assetPath(item.image),
}));

export const primaryCheckoutProduct = checkoutProducts[0] ?? fallbackCheckoutProduct;

export const heroContent = {
  ...homeHeroJson,
  backgroundMediaType: homeHeroJson.backgroundMediaType === "video" ? "video" : "image",
  backgroundImage: assetPath(homeHeroJson.backgroundImage),
  backgroundVideo: homeHeroJson.backgroundVideo ? assetPath(homeHeroJson.backgroundVideo) : "",
};

export const featureCardsSection = {
  sectionTitle: homeFeatureCardsJson.sectionTitle,
  cards: homeFeatureCardsJson.cards.map((card) => ({
    ...card,
    icon: assetPath(card.icon),
  })),
};

export const processSections = [homeProcessBombsJson, homeProcessLavenderJson, homeProcessPacksJson].map(
  (section) => ({
    ...section,
    slides: section.slides.map((slide) => ({
      ...slide,
      image: assetPath(slide.image),
    })),
  }),
);

export const whyUsContent = {
  ...homeWhyUsJson,
  backgroundImage: assetPath(homeWhyUsJson.backgroundImage),
  reasons: homeWhyUsJson.reasons.map((reason) => ({
    ...reason,
    icon: assetPath(reason.icon),
  })),
};

export const aboutContent = {
  ...homeAboutJson,
  image: assetPath(homeAboutJson.image),
};

export const reviewsContent = {
  ...homeReviewsJson,
  items: homeReviewsJson.items.map((review) => ({
    ...review,
    image: assetPath(review.image),
  })),
};

export const ctaContent = {
  ...homeCtaJson,
  backgroundImage: assetPath(homeCtaJson.backgroundImage),
};

export const decorativeImages = {
  crystal: assetPath("/images/photos/crystal.png"),
  pero: assetPath("/images/photos/pero.png"),
  stars: assetPath("/images/photos/stars.svg"),
  heroVideo: assetPath("/videos/how-we-make-bath-bombs.mp4"),
};
