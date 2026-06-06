import { buildHomeStructuredData } from "@/shared/lib/structured-data";

type CheckoutProduct = {
  title: string;
  price: number;
  image: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

export function HomeStructuredData({
  primaryCheckoutProduct,
  faqItems = [],
}: Readonly<{ primaryCheckoutProduct: CheckoutProduct; faqItems?: ReadonlyArray<FaqItem> }>) {
  const {
    organizationStructuredData,
    websiteStructuredData,
    productStructuredData,
    faqStructuredData,
  } = buildHomeStructuredData(primaryCheckoutProduct, faqItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
      />
      {faqStructuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      ) : null}
    </>
  );
}
