import { Suspense } from "react";

import { CheckoutSuccessContent } from "@/features/checkout/ui/checkout-success-content";

export const metadata = {
  title: "Заказ оформлен",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
