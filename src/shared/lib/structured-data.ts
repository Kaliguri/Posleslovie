import { seoConfig, toAbsoluteUrl } from "@/shared/config/seo";
import { siteConfig } from "@/shared/config/site";

type CheckoutProduct = {
  title: string;
  price: number;
  image: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

function offerValidUntil() {
  // Google requires a future priceValidUntil on offers; default to the end of next year.
  return `${new Date().getFullYear() + 1}-12-31`;
}

export function buildHomeStructuredData(
  primaryCheckoutProduct: CheckoutProduct,
  faqItems: ReadonlyArray<FaqItem> = [],
) {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: toAbsoluteUrl("/"),
    // Prefer a real brand logo when configured; fall back to the hero image otherwise.
    logo: toAbsoluteUrl(siteConfig.favicon || "/images/photos/hero.jpg"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: siteConfig.socials.map((social) => social.href),
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.title,
    url: toAbsoluteUrl("/"),
    description: seoConfig.description,
    inLanguage: "ru-RU",
  };

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: primaryCheckoutProduct.title,
    description: seoConfig.description,
    image: [toAbsoluteUrl(primaryCheckoutProduct.image)],
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: primaryCheckoutProduct.price,
      priceValidUntil: offerValidUntil(),
      availability: "https://schema.org/InStock",
      url: toAbsoluteUrl("/"),
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };

  const faqStructuredData =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return {
    organizationStructuredData,
    websiteStructuredData,
    productStructuredData,
    faqStructuredData,
  };
}
