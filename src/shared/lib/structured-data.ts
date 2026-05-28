import { seoConfig, toAbsoluteUrl } from "@/shared/config/seo";
import { siteConfig } from "@/shared/config/site";

type CheckoutProduct = {
  title: string;
  price: number;
  image: string;
};

export function buildHomeStructuredData(primaryCheckoutProduct: CheckoutProduct) {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: toAbsoluteUrl("/"),
    logo: toAbsoluteUrl("/images/photos/hero.jpg"),
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
      availability: "https://schema.org/InStock",
      url: toAbsoluteUrl("/"),
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
  };

  return {
    organizationStructuredData,
    websiteStructuredData,
    productStructuredData,
  };
}
