import { buildHomeStructuredData } from "@/shared/lib/structured-data";

type CheckoutProduct = {
  title: string;
  price: number;
  image: string;
};

export function HomeStructuredData({
  primaryCheckoutProduct,
}: Readonly<{ primaryCheckoutProduct: CheckoutProduct }>) {
  const { organizationStructuredData, websiteStructuredData, productStructuredData } =
    buildHomeStructuredData(primaryCheckoutProduct);

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
    </>
  );
}
